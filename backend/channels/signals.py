from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserAnalytics
from youtube_auth.models import Credential
from .cron import overall_analytics




@receiver(post_save, sender=Credential)
def create_user_analytics(sender, instance, created, **kwargs):
    if created:
        user_analytics = UserAnalytics.objects.create(user=instance.user)
        user_analytics.save()
        overall_analytics(user_analytics)
