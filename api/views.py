from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from users.models import FarmerProfile
from crop_prediction.models import CropPrediction
from crop_prediction.ml_model import CropPredictionModel
from .serializers import (
    UserSerializer, FarmerProfileSerializer, CropPredictionSerializer,
   # DiseaseDetectionSerializer, WeatherDataSerializer
)
import os

# User and Profile views
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own profile
        if not self.request.user.is_staff:
            return User.objects.filter(id=self.request.user.id)
        return User.objects.all()

class FarmerProfileViewSet(viewsets.ModelViewSet):
    queryset = FarmerProfile.objects.all()
    serializer_class = FarmerProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own profile
        if not self.request.user.is_staff:
            return FarmerProfile.objects.filter(user=self.request.user)
        return FarmerProfile.objects.all()

# Crop Prediction views
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_crop(request):
    try:
        # Extract data from request
        n = float(request.data.get('nitrogen'))
        p = float(request.data.get('phosphorus'))
        k = float(request.data.get('potassium'))
        temp = float(request.data.get('temperature'))
        humidity = float(request.data.get('humidity'))
        ph = float(request.data.get('ph'))
        rainfall = float(request.data.get('rainfall'))
        
        # Make prediction
        crop_model = CropPredictionModel()
        crop_name, fertilizer = crop_model.predict_crop(n, p, k, temp, humidity, ph, rainfall)
        
        # Save prediction to database
        prediction = CropPrediction.objects.create(
            user=request.user,
            nitrogen=n,
            phosphorus=p,
            potassium=k,
            temperature=temp,
            humidity=humidity,
            ph=ph,
            rainfall=rainfall,
            predicted_crop=crop_name,
            fertilizer_recommendation=fertilizer
        )
        
        return Response({
            'success': True,
            'prediction_id': prediction.id,
            'predicted_crop': crop_name,
            'fertilizer_recommendation': fertilizer
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    

    

# Disease Detection views
'''
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def detect_disease(request):
    try:
        # Get uploaded image
        image = request.FILES.get('image')
        plant_type = request.data.get('plant_type')
        
        if not image:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save image to temp file
        disease_detection = DiseaseDetection.objects.create(
            user=request.user,
            image=image,
            plant_type=plant_type
        )
        
        # Make prediction
        disease_model = DiseaseDetectionModel()
        disease_name, confidence, treatment = disease_model.predict_disease(disease_detection.image.path)
        
        # Update disease detection record
        disease_detection.detected_disease = disease_name
        disease_detection.confidence_score = confidence
        disease_detection.treatment_recommendation = treatment
        disease_detection.save()
        
        return Response({
            'success': True,
            'detection_id': disease_detection.id,
            'detected_disease': disease_name,
            'confidence': confidence,
            'treatment_recommendation': treatment,
            'image_url': disease_detection.image.url
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

# History views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def prediction_history(request):
    crop_predictions = CropPrediction.objects.filter(user=request.user).order_by('-created_at')
    disease_detections = DiseaseDetection.objects.filter(user=request.user).order_by('-created_at')
    
    crop_serializer = CropPredictionSerializer(crop_predictions, many=True)
    disease_serializer = DiseaseDetectionSerializer(disease_detections, many=True)
    
    return Response({
        'crop_predictions': crop_serializer.data,
        'disease_detections': disease_serializer.data
    }, status=status.HTTP_200_OK)'
    '''