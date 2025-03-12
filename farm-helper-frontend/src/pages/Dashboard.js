import React, { useContext, useEffect, useState } from 'react';
import { 
  Container, Typography, Grid, Paper, Box, Card, CardContent,
  CardMedia, CardActionArea, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchHistory();
    }
  }, [user, authLoading, navigate]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/history/');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: history?.crop_predictions.slice(0, 5).map(p => p.predicted_crop) || [],
    datasets: [
      {
        label: 'Predictions',
        data: history?.crop_predictions.slice(0, 5).map(() => 1) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Recent Crop Predictions',
      },
    },
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.first_name || user?.username}!
        </Typography>
        
        <Grid container spacing={4}>
          {/* Key features */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }} onClick={() => navigate('/crop-prediction')}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="/api/placeholder/400/140"
                  alt="Crop Prediction"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Crop Prediction
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get AI recommendations on which crops to grow based on soil parameters,
                    location, and weather conditions. Also receive fertilizer recommendations.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }} onClick={() => navigate('/disease-detection')}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="/api/placeholder/400/140"
                  alt="Disease Detection"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Disease Detection
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload images of your plants to identify diseases and pests. 
                    Receive treatment recommendations and preventive measures.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          
          {/* Recent predictions */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Predictions
              </Typography>
              {history && history.crop_predictions.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No crop predictions yet. Start by making a prediction!
                </Typography>
              )}
            </Paper>
          </Grid>
          
          {/* Disease detections */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Disease Detections
              </Typography>
              {history && history.disease_detections.length > 0 ? (
                <Box>
                  {history.disease_detections.slice(0, 3).map((detection) => (
                    <Box key={detection.id} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Box 
                        component="img"
                        src={detection.image}
                        alt={detection.detected_disease}
                        sx={{ width: 60, height: 60, mr: 2, objectFit: 'cover' }}
                      />
                      <Box>
                        <Typography variant="subtitle2">
                          {detection.detected_disease}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Confidence: {Math.round(detection.confidence_score * 100)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No disease detections yet. Upload a plant image to get started!
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;