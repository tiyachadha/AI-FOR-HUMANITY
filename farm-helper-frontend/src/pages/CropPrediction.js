import React, { useState, useContext, useEffect } from 'react';
import { 
  Container, Typography, TextField, Button, Paper, Box, 
  CircularProgress, Alert, Grid, Card, CardContent,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const CropPrediction = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await axios.post('/api/predict-crop/', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crop Prediction
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Enter Soil Parameters
              </Typography>
              
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="nitrogen"
                      label="Nitrogen (mg/kg)"
                      name="nitrogen"
                      type="number"
                      inputProps={{ min: 0, step: 0.1 }}
                      value={formData.nitrogen}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="phosphorus"
                      label="Phosphorus (mg/kg)"
                      name="phosphorus"
                      type="number"
                      inputProps={{ min: 0, step: 0.1 }}
                      value={formData.phosphorus}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="potassium"
                      label="Potassium (mg/kg)"
                      name="potassium"
                      type="number"
                      inputProps={{ min: 0, step: 0.1 }}
                      value={formData.potassium}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="temperature"
                      label="Temperature (°C)"
                      name="temperature"
                      type="number"
                      inputProps={{ min: 0, step: 0.1 }}
                      value={formData.temperature}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="humidity"
                      label="Humidity (%)"
                      name="humidity"
                      type="number"
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                      value={formData.humidity}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="ph"
                      label="pH Value"
                      name="ph"
                      type="number"
                      inputProps={{ min: 0, max: 14, step: 0.1 }}
                      value={formData.ph}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="rainfall"
                      label="Annual Rainfall (mm)"
                      name="rainfall"
                      type="number"
                      inputProps={{ min: 0, step: 0.1 }}
                      value={formData.rainfall}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Predict Suitable Crop'}
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Prediction Results
              </Typography>
              
              {!result && !loading && (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  height="80%"
                >
                  <Typography variant="body1" color="text.secondary" align="center">
                    Enter soil parameters and click "Predict Suitable Crop" to see recommendations
                  </Typography>
                </Box>
              )}
              
              {loading && (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  height="80%"
                >
                  <CircularProgress />
                </Box>
              )}
              
              {result && (
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h5" color="primary" gutterBottom>
                      {result.predicted_crop.charAt(0).toUpperCase() + result.predicted_crop.slice(1)}
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Best suitable crop for your soil and climate conditions
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom>
                      Fertilizer Recommendation
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      {result.fertilizer_recommendation}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Prediction ID: {result.prediction_id}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CropPrediction;