from django.db import models
from youtube_auth.models import Credential

# Create your models here.


class Channel(models.Model):
    channel_id = models.CharField(max_length=100)
    channel_pic = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    creator = models.ForeignKey(Credential, on_delete = models.CASCADE, related_name='creator')
    description = models.CharField(max_length=600, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    views = models.PositiveBigIntegerField(default=0)
    likes = models.PositiveBigIntegerField(default=0)
    subscribersGained = models.PositiveBigIntegerField(default=0)
    impressions = models.PositiveBigIntegerField(default=0)



    def __str__(self) -> str:
        return self.title



class UserAnalytics(models.Model):
    user = models.OneToOneField(Credential, on_delete=models.CASCADE)
    views = models.PositiveBigIntegerField(default=0)
    videos = models.PositiveBigIntegerField(default=0)
    subscribersGained = models.PositiveBigIntegerField(default=0)


    def __str__(self) -> str:
        return self.user.username





