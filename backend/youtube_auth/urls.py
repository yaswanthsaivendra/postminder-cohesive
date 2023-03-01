from django.urls import path, include
from .views import oauth2callback, authorize, RetrieveYoutubeChannels, authorizeuser

urlpatterns = [
    path('authorize/', authorize, name='authorize'),
    path('oauth2callback/', oauth2callback, name='oauth2callback'),
    path('retrieveyoutubechannels/', RetrieveYoutubeChannels.as_view(), name='retrieve-youtube-channels'),
    path('authorizeuser/', authorizeuser, name='authorize-user'),
]