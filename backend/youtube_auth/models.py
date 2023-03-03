from django.db import models

# Create your models here.



class Credential(models.Model):
    cohesive_user_id = models.CharField(max_length=10)
    cohesive_user_name = models.CharField(max_length=300)
    cohesive_instance_id = models.CharField(max_length=10)
    cohesive_workspace_id = models.CharField(max_length=10)
    cohesive_workspace_name = models.CharField(max_length=300)
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=1000)
    refresh_token = models.CharField(max_length=500)

    def __str__(self) -> str:
        return self.cohesive_user_name

