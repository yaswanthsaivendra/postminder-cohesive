from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.generics import GenericAPIView
from cohesive.auth import AuthDetails

from rest_framework.mixins import (
    ListModelMixin,
    CreateModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin
)

from .serializers import (
    ChannelSerializer,
    UserAnalyticsSerializer
)
from .models import Channel, UserAnalytics

# Create your views here.


class ChannelListView(
    GenericAPIView, 
    ListModelMixin,
    CreateModelMixin,
    ):


    serializer_class = ChannelSerializer

    def get_queryset(self):
        return Channel.objects.filter(creator=self.request.user)

    def get(self, request:Request, *args, **kwargs):
        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)

        return self.list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
        return super().perform_create(serializer)

    def post(self, request:Request, *args, **kwargs):

        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)

        return self.create(request, *args, **kwargs)



class ChannelRetrieveUpdateDeleteView(
    GenericAPIView,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin
    ):

    serializer_class = ChannelSerializer

    def get_queryset(self):
        return Channel.objects.all().filter(creator=self.request.user)

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



class UserAnalyticsView(
    GenericAPIView, 
    ListModelMixin,
    CreateModelMixin,
    ):

    serializer_class = UserAnalyticsSerializer

    def get_queryset(self):
        return UserAnalytics.objects.all().filter(user=self.request.user)

    def get(self, request:Request, *args, **kwargs):

        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)

        return self.list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        return super().perform_create(serializer)

    def post(self, request:Request, *args, **kwargs):

        if not isinstance(request.auth_details, AuthDetails):
            return Response({"error": "no auth details found"}, status=401)

        return self.create(request, *args, **kwargs)















    
