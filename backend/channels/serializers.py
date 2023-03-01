from rest_framework import serializers
from .models import Channel, UserAnalytics


class ChannelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Channel
        fields = '__all__'
        read_only_fields = ['creator']

    
class UserAnalyticsSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserAnalytics
        fields = '__all__'
        read_only_fields = ['user']