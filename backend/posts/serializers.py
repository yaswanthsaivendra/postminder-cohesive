from rest_framework import serializers
from .models import Post, Tag




class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'



class PostSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)
    scheduled_by = serializers.ReadOnlyField(source='scheduled_by.cohesive_user_name')

    class Meta:
        model = Post
        fields = '__all__'

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        post = Post.objects.create(**validated_data)
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(title=tag_data['title'])
            post.tags.add(tag)
        return post

