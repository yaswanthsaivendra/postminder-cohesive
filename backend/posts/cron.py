import logging
import http.client
import httplib2
import random
import time
import pytz
import requests
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery
from youtube_auth.models import Credential
from core import settings
import os
from .models import Post, Tag
from datetime import datetime, timedelta
import boto3


# Set up logging
logging.basicConfig(level=logging.INFO, filename='app.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s')

# Explicitly tell the underlying HTTP transport library not to retry, since
# we are handling retry logic ourselves.
httplib2.RETRIES = 1

# Maximum number of times to retry before giving up.
MAX_RETRIES = 10

# Always retry when these exceptions are raised.
RETRIABLE_EXCEPTIONS = (httplib2.HttpLib2Error, IOError, http.client.NotConnected,
  http.client.IncompleteRead, http.client.ImproperConnectionState,
  http.client.CannotSendRequest, http.client.CannotSendHeader,
  http.client.ResponseNotReady, http.client.BadStatusLine)

# Always retry when an apiclient.errors.HttpError with one of these status
# codes is raised.
RETRIABLE_STATUS_CODES = [500, 502, 503, 504]

VALID_PRIVACY_STATUSES = ('public', 'private', 'unlisted')

# Create a timezone object for UTC
utc = pytz.utc



def upload_posts():
    logging.info("Starting to upload posts...")

    posts = Post.objects.all()
    current_time = datetime.now(utc)
    for post in posts:
        scheduled_time = post.scheduled_at
        # max_time = post.scheduled_at + timedelta(minutes=5)
        if scheduled_time <= current_time and  post.upload_status=='SCHEDULED':
            upload_post(post)




def upload_post(post):
    logging.info(f"Uploading post with ID {post.id}...")
    
    user_id = post.scheduled_by.cohesive_user_id
    user_credentials = Credential.objects.filter(cohesive_user_id=user_id).first() 
    post_tags = Tag.objects.filter(post=post)


    credentials = google.oauth2.credentials.Credentials(
        token = user_credentials.token, 
        refresh_token = user_credentials.refresh_token,
        token_uri= settings.TOKEN_URI,
        client_id= settings.CLIENT_ID,
        client_secret= settings.CLIENT_SECRET,
        scopes= settings.SCOPES,
    )

    youtube = googleapiclient.discovery.build(
        settings.API_SERVICE_NAME,
        settings.API_VERSION, 
        credentials=credentials 
    )
    tags = []
    for tag in post_tags:
        tags.push(tag.title)
    
    video_url = post.get_video_url()
    response = requests.get(video_url)

    video_path = os.path.join(settings.MEDIA_ROOT, post.video.name)
    # print(file_path)

    
    # s3 = boto3.client("s3",
    # aws_access_key_id= settings.AWS_ACCESS_KEY_ID,
    # aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    # )
    with open(video_path, "wb") as file:
        # s3.download_fileobj(
        #     settings.AWS_STORAGE_BUCKET_NAME,
        #     video_url,
        #     file
        # )
        file.write(response.content)



    body=dict(
    snippet=dict(
        title=post.title,
        description=post.description,
        tags=tags,
        categoryId=post.category_id
    ),
    status=dict(
        privacyStatus="private"
    )
    )

    # Call the API's videos.insert method to create and upload the video.
    insert_request = youtube.videos().insert(
    part=','.join(body.keys()),
    body=body,
    # The chunksize parameter specifies the size of each chunk of data, in
    # bytes, that will be uploaded at a time. Set a higher value for
    # reliable connections as fewer chunks lead to faster uploads. Set a lower
    # value for better recovery on less reliable connections.
    #
    # Setting 'chunksize' equal to -1 in the code below means that the entire
    # file will be uploaded in a single HTTP request. (If the upload fails,
    # it will still be retried where it left off.) This is usually a best
    # practice, but if you're using Python older than 2.6 or if you're
    # running on App Engine, you should set the chunksize to something like
    # 1024 * 1024 (1 megabyte).
    media_body=MediaFileUpload(video_path, chunksize=-1, resumable=True)
    )

    video_id = resumable_upload(insert_request)
    print(video_id)

    thumbnail_url = post.get_thumbnail_url()
    response = requests.get(thumbnail_url)

    thumbnail_path = os.path.join(settings.MEDIA_ROOT, post.thumbnail.name)
   
    with open(thumbnail_path, "wb") as file:
        file.write(response.content)

    if video_id:
        thumbnail_request = youtube.thumbnails().set(
            videoId=video_id,
            media_body=MediaFileUpload(thumbnail_path)
        )
        try:
            thumbnail_request.execute()
        except:
            logging.info(f"Account isn't verified , so thumbnail haven't uploaded")
        post.upload_status = 'LIVE'
        post.save()
        os.remove(video_path)
        os.remove(thumbnail_path)


    user_credentials.token = credentials.token
    user_credentials.refresh_token = credentials.refresh_token
    user_credentials.save(update_fields=['token', 'refresh_token'])


  

# This method implements an exponential backoff strategy to resume a
# failed upload.
def resumable_upload(request):
    response = None
    error = None
    retry = 0
    while response is None:
        try:
            print('Uploading file...')
            status, response = request.next_chunk()
            if response is not None:
                if 'id' in response:
                    print(f"Video id {response['id']} was successfully uploaded.") 
                    return response['id']
                else:
                    exit(f'The upload failed with an unexpected response: {response}')
        except HttpError as e:
            if e.resp.status in RETRIABLE_STATUS_CODES:
                error = f'A retriable HTTP error {e.resp.status} occurred:\n {e.content}'
            else:
                raise
        except RETRIABLE_EXCEPTIONS as e:
            error = f'A retriable error occurred: {e}' 

        if error is not None:
            print(error)
            retry += 1
            if retry > MAX_RETRIES:
                exit('No longer attempting to retry.')

            max_sleep = 2 ** retry
            sleep_seconds = random.random() * max_sleep
            print(f"Sleeping {sleep_seconds} seconds and then retrying...")
            time.sleep(sleep_seconds)
