from django.shortcuts import render, redirect
from django.urls import reverse
import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.renderers import JSONRenderer
from .models import Credential
from rest_framework.views import APIView
from core import settings
import json
from rest_framework.permissions import IsAuthenticated
from channels.models import Channel
from cohesive.auth import AuthDetails





@api_view(['GET',])
# @permission_classes([]) 
def authorize(request):

    if not isinstance(request.auth_details, AuthDetails):
        return Response({"error": "no auth details found"}, status=401)
        
    user_credentials = Credential.objects.filter(user=request.user).first()
    

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
    settings.CLIENT_SECRETS_FILE,
    scopes=settings.SCOPES
    )
    # flow.redirect_uri = request.build_absolute_uri(reverse('oauth2callback'))

    flow.redirect_uri = 'http://localhost:3000/callback'
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )

    if user_credentials:
        return Response(data= {
        "message" : "authorized",
        "auth_url" : authorization_url
        },
        status=status.HTTP_200_OK
    )

    return Response(data= {
        "message" : "unauthorized",
        "auth_url" : authorization_url
    }, status=status.HTTP_200_OK)


@api_view(['POST',])
# @permission_classes([]) 
def oauth2callback(request:Request):
    if request.method == 'POST':

        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)


    # state - to verify the request, and thereby preventing csrf (b/w oauth req and response

        auth_url = request.data.get("url", "")
        flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
            settings.CLIENT_SECRETS_FILE,
            scopes=settings.SCOPES,
            )

        # flow.redirect_uri = request.build_absolute_uri(reverse('oauth2callback'))
        flow.redirect_uri = 'http://localhost:3000/callback'

        # authorization_response = request.build_absolute_uri()
        authorization_response = auth_url


        flow.fetch_token(authorization_response=authorization_response)

        credentials = flow.credentials

        user_credentials = Credential(
            user = request.user,
            token=credentials.token,
            refresh_token=credentials.refresh_token
        )
        user_credentials.save()

        # store creds
        # print(credentials)
        # print(credentials.token)
        # print(credentials.refresh_token)
        # print(credentials.token_uri)
        # print(credentials.client_id)
        # print(credentials.client_secret)
        # print(credentials.scopes)
        return Response({"message": "successfully authorized"}, status=status.HTTP_201_CREATED)


@api_view(['POST',])
def authorizeuser(request:Request, *args, **kwargs):
    if request.method == 'POST':

        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)


        print(request.POST)
        user_credentials = Credential(
            user = request.user,
            token= request.data.get("access_token", ""),
    )
        print(user_credentials.token)
        user_credentials.save()
        return redirect(reverse("retrieve-youtube-channels"))





class RetrieveYoutubeChannels(APIView):


    def get(self, request): 

        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)


        user_credentials = Credential.objects.filter(user=request.user).first()
        user_channels = Channel.objects.filter(creator=request.user)

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
        channels = youtube.channels().list(mine=True, part='snippet').execute() 
        channels_list = []
        for channel in channels["items"]:
            channel_id = channel["id"]
            title = channel["snippet"]["title"]
            channel_pic = channel["snippet"]["thumbnails"]["high"]["url"]
            description = channel["snippet"]["localized"]["description"]

            flag = 0
            for user_channel in user_channels:
                if user_channel.channel_id == channel_id:
                    flag = 1
            if flag == 0:
                channels_list.append({
                    "id" : channel_id,
                    "title" : title,
                    "channel_pic" : channel_pic,
                    "description" : description
                })
            flag = 0
            
        user_credentials.token = credentials.token
        user_credentials.refresh_token = credentials.refresh_token
        user_credentials.save(update_fields=['token', 'refresh_token'])

        return Response(
            {
                "message": "success",
                "channels" : channels_list
            },
        status=status.HTTP_200_OK
        )



