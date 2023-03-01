from django.urls import path, include
from .views import PostCreateView, PostRetrieveUpdateDeleteView, PostListView

urlpatterns = [
    path("posts/", PostCreateView.as_view()),
    path("channel_posts/<int:channel_id>/", PostListView.as_view()),
    path("posts/<int:pk>/", PostRetrieveUpdateDeleteView.as_view()),
]