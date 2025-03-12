# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import FarmerProfile
from crop_prediction.models import CropPrediction
#from disease_detection.models import DiseaseDetection
#from weather_service.models import WeatherData

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        
class FarmerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = FarmerProfile
        fields = ['id', 'user', 'location', 'farm_size', 'created_at', 'updated_at']

class CropPredictionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CropPrediction
        fields = ['id', 'user', 'nitrogen', 'phosphorus', 'potassium', 'temperature', 
                  'humidity', 'ph', 'rainfall', 'predicted_crop', 
                  'fertilizer_recommendation', 'created_at']

'''
class DiseaseDetectionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = DiseaseDetection
        fields = ['id', 'user', 'image', 'plant_type', 'detected_disease', 
                  'confidence_score', 'treatment_recommendation', 'created_at']

class WeatherDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherData
        fields = ['id', 'location', 'temperature', 'humidity', 'rainfall', 'date']'
        '''