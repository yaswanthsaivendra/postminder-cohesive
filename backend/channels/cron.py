from core import settings
from youtube_auth.models import Credential
from .models import Channel, UserAnalytics
from datetime import date, timedelta
import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery




def update_channel_analytics():
    all_channels = Channel.objects.all()
    for channel in all_channels:
        channel_analytics(channel)
    



def channel_analytics(channel):

    user_credentials = Credential.objects.filter(user=channel.creator).first() 

    credentials = google.oauth2.credentials.Credentials(
        token = user_credentials.token, 
        refresh_token = user_credentials.refresh_token,
        token_uri= settings.TOKEN_URI,
        client_id= settings.CLIENT_ID,
        client_secret= settings.CLIENT_SECRET,
        scopes= settings.SCOPES,
    )

    youtube = googleapiclient.discovery.build(
        "youtubeAnalytics",
        "v2", 
        credentials=credentials 
    )

    # if days_opt == 1: # for 30 days
    #     start_date = (date.today()-timedelta(days=30)).isoformat()
    #     end_date = date.today().isoformat()
    # elif days_opt == 2: # for 60 days
    #     start_date = (date.today()-timedelta(days=60)).isoformat()
    #     end_date = date.today().isoformat()
    # elif days_opt == 3: # for this year
    #     start_date = date.today().isoformat()[0:4] + "-01-01"
    #     end_date = date.today().isoformat()



    analytics = youtube.reports().query(
        endDate = date.today().isoformat(),
        ids = "channel=="+channel.channel_id,
        metrics = "views,likes,subscribersGained,annotationImpressions",
        startDate = channel.created_at
        ).execute()


    views = analytics["rows"][0][0]
    likes = analytics["rows"][0][1]
    subscribersGained = analytics["rows"][0][2]
    impressions = analytics["rows"][0][3]

    channel.views = views
    channel.likes = likes
    channel.subscribersGained = subscribersGained
    channel.impressions = impressions
    channel.save(update_fields=['views', 'likes', 'subscibersGained', 'impressions'])


    user_credentials.token = credentials.token
    user_credentials.refresh_token = credentials.refresh_token
    user_credentials.save(update_fields=['token', 'refresh_token'])



def update_user_analytics():
    all_useranalytics = UserAnalytics.objects.all()
    for useranalytics in all_useranalytics:
        overall_analytics(useranalytics)


def overall_analytics(useranalytics):
    user_credentials = Credential.objects.filter(user=useranalytics.user).first() 
    user_channels = Channel.objects.filter(creator=useranalytics.user)


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



    channels = youtube.channels().list(
        mine=True,
        part='statistics'
    ).execute() 

    views = 0
    subscribers = 0
    videos = 0

    flag = 0
    
    for channel in channels["items"]:
        for user_channel in user_channels:
            if user_channel.channel_id == channel["id"]:
                flag = 1
        if flag == 0:
            views += int(channel["statistics"]["viewCount"])
            subscribers += int(channel["statistics"]["subscriberCount"])
            videos += int(channel["statistics"]["videoCount"])
        flag = 0


    useranalytics.views = views
    useranalytics.subscribersGained = subscribers
    useranalytics.videos = videos

    useranalytics.save(update_fields=['views', 'subscribersGained', 'videos'])


    user_credentials.token = credentials.token
    user_credentials.refresh_token = credentials.refresh_token
    user_credentials.save(update_fields=['token', 'refresh_token'])

