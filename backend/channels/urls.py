from django.urls import path
from .views import ChannelListView, ChannelRetrieveUpdateDeleteView, UserAnalyticsView


urlpatterns = [
    path("channels/", ChannelListView.as_view()),
    path("channel_analytics/<int:pk>/", ChannelRetrieveUpdateDeleteView.as_view()),
    path("overall_analytics/", UserAnalyticsView.as_view()),
]