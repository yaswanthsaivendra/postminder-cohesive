from django.db import models
from channels.models import Channel
from youtube_auth.models import Credential
from django.core.files.storage import default_storage

# Create your models here.



class Tag(models.Model):
    title = models.CharField(max_length=50)


    def __str__(self):
        return self.title



class Post(models.Model):

    UPLOAD_STATUS_CHOICES = [
        ('SCHEDULED', 'Scheuled'),
        ('DRAFT', 'Draft'),
        ('LIVE', 'Live')
    ]
    
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    scheduled_by = models.ForeignKey(Credential, on_delete=models.CASCADE)
    title = models.CharField(max_length=300, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    thumbnail = models.FileField(upload_to='thumbnails/', null=True, blank=True)
    video = models.FileField(upload_to='videos/', null=True, blank=True)
    scheduled_at = models.DateTimeField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    category_id = models.PositiveIntegerField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True)

    upload_status = models.CharField(
        max_length=10,
        choices= UPLOAD_STATUS_CHOICES,
        default='SCHEDULED',
    )


    def __str__(self) -> str:
        if self.title:
            return self.title
    
    def get_thumbnail_url(self):
        if self.thumbnail:
            return default_storage.url(self.thumbnail.name)
        else:
            return None

    def get_video_url(self):
        if self.video:
            return default_storage.url(self.video.name)
        else:
            return None





