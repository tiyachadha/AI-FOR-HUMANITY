from django.db import models
from django.contrib.auth.models import User

class FarmerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    location = models.CharField(max_length=100)
    farm_size = models.FloatField(help_text="Farm size in acres")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Farm Profile"