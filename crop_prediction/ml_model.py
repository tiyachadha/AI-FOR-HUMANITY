import os
import pickle
import numpy as np
import pandas as pd
from django.conf import settings

class CropPredictionModel:
    def __init__(self):
        # Path to the pre-trained model file
        model_path = os.path.join(settings.BASE_DIR, 'ml_models', 'cropmodel2.pkl')
        try:
            self.model = pickle.load(open(model_path, 'rb'))
            self.crop_dict = {
                1: "rice", 2: "maize", 3: "chickpea", 4: "kidneybeans", 5: "pigeonpeas",
                6: "mothbeans", 7: "mungbean", 8: "blackgram", 9: "lentil", 10: "pomegranate",
                11: "banana", 12: "mango", 13: "grapes", 14: "watermelon", 15: "muskmelon",
                16: "apple", 17: "orange", 18: "papaya", 19: "coconut", 20: "cotton",
                21: "jute", 22: "coffee"
            }
            
            # Fertilizer recommendation data
            self.fertilizer_dict = {
                "rice": "NPK 10-26-26, 2.5 bags per acre",
                "maize": "NPK 20-20-20, 2 bags per acre",
                "chickpea": "NPK 10-26-26, 1.5 bags per acre",
                "kidneybeans": "NPK 20-10-10, 1.5 bags per acre",
                "pigeonpeas": "NPK 18-46-0, 1 bag per acre",
                "mothbeans": "NPK 20-20-0, 1 bag per acre",
                "mungbean": "NPK 20-40-0, 1 bag per acre",
                "blackgram": "NPK 10-26-26, 1 bag per acre",
                "lentil": "NPK 20-10-10, 1 bag per acre",
                "pomegranate": "NPK 15-15-15, 3 bags per acre",
                "banana": "NPK 14-14-14, 3 bags per acre",
                "mango": "NPK 20-10-10, 2 bags per acre",
                "grapes": "NPK 10-20-20, 2 bags per acre",
                "watermelon": "NPK 15-15-15, 2 bags per acre",
                "muskmelon": "NPK 15-15-15, 2 bags per acre",
                "apple": "NPK 20-20-20, 2 bags per acre",
                "orange": "NPK 15-15-15, 2 bags per acre",
                "papaya": "NPK 20-20-20, 2 bags per acre",
                "coconut": "NPK 15-15-15, 2 bags per acre",
                "cotton": "NPK 20-10-10, 2 bags per acre",
                "jute": "NPK 10-26-26, 1.5 bags per acre",
                "coffee": "NPK 20-20-20, 2 bags per acre"
            }
        except (FileNotFoundError, EOFError) as e:
            # For hackathon purposes, we'll create a dummy model if file not found
            print(f"Error loading model: {e}. Using dummy model.")
            from sklearn.ensemble import RandomForestClassifier
            self.model = RandomForestClassifier()
            self.model.fit(np.random.rand(100, 7), np.random.randint(0, 22, 100))

    def predict_crop(self, n, p, k, temperature, humidity, ph, rainfall):
        """
        Predict the most suitable crop based on soil and environmental parameters
        
        Args:
            n (float): Nitrogen content in soil
            p (float): Phosphorus content in soil
            k (float): Potassium content in soil
            temperature (float): Temperature in degrees Celsius
            humidity (float): Humidity in percentage
            ph (float): pH value of soil
            rainfall (float): Rainfall in mm
            
        Returns:
            tuple: (predicted_crop, fertilizer_recommendation)
        """
        input_data = np.array([[n, p, k, temperature, humidity, ph, rainfall]])
        prediction = self.model.predict(input_data)[0]
        crop_name = self.crop_dict[prediction]
        fertilizer = self.fertilizer_dict.get(crop_name, "Standard NPK 20-20-20 fertilizer recommended")
        
        return crop_name, fertilizer