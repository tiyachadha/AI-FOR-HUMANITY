import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CropPrediction from './pages/CropPrediction';
// import NotFound from './pages/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';

// API base URL
axios.defaults.baseURL = 'http://localhost:8000';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/crop-prediction" element={<CropPrediction />} />
              
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;