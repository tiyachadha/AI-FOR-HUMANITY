from django.db import models
from django.contrib.auth.models import User

class CropPrediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_predictions')
    nitrogen = models.FloatField()
    phosphorus = models.FloatField()
    potassium = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    ph = models.FloatField()
    rainfall = models.FloatField()
    predicted_crop = models.CharField(max_length=50)
    fertilizer_recommendation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Crop Prediction for {self.user.username} - {self.created_at.strftime('%Y-%m-%d')}"