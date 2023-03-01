from django.db import models
from django.contrib.auth.models import User

# Create your models here.



class Credential(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=1000)
    refresh_token = models.CharField(max_length=500)

    def __str__(self) -> str:
        return self.user.username

