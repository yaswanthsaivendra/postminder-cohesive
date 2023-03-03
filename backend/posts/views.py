from youtube_auth.models import Credential
from rest_framework.decorators import api_view, permission_classes
from channels.models import Channel
from core import settings
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import (
    ListModelMixin,
    CreateModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin
)
from django.core.files.storage import default_storage
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import PostSerializer
from .models import Post
from cohesive.auth import AuthDetails


class PostCreateView(APIView):

    serializer_class = PostSerializer
    parser_classes = [MultiPartParser, FormParser]


    def post(self, request, *args, **kwargs):

        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)


        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user_credential = Credential.objects.filter(cohesive_instance_id=self.request.auth_details.instance_id).first()
            serializer.save(scheduled_by=user_credential)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PostListView(
    GenericAPIView, 
    ListModelMixin,
    ):

    serializer_class = PostSerializer

    def get_queryset(self):
        channel_id = self.kwargs['channel_id']
        user_credential = Credential.objects.filter(cohesive_instance_id=self.request.auth_details.instance_id).first()
        return Post.objects.filter(scheduled_by=user_credential).filter(channel=channel_id).order_by('-uploaded_at')

    def get(self, request:Request, *args, **kwargs):

        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)


        return self.list(request, *args, **kwargs)





class PostRetrieveUpdateDeleteView(
    GenericAPIView,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin
    ):

    permission_classes = [IsAuthenticated]

    serializer_class = PostSerializer

    def get_queryset(self):
        user_credential = Credential.objects.filter(cohesive_instance_id=self.request.auth_details.instance_id).first()
        return Post.objects.filter(scheduled_by=user_credential)

    def get(self, request:Request, *args, **kwargs):
        
        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)

        return self.retrieve(request, *args, **kwargs)

    def put(self, request:Request, *args, **kwargs):
        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)

        return self.update(request, *args, **kwargs)

    def delete(self, request:Request, *args, **kwargs):
        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)

        return self.destroy(request, *args, **kwargs)