import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import Learning from './pages/Learning';
import Community from './pages/Community';
import CommunityDetail from './pages/CommunityDetail';
import Fields from './pages/Fields';
import CropDetail from './pages/CropDetail';
import AIAgent from './pages/AIAgent';
import DailyTasks from './pages/DailyTasks';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌾</div>
          <p style={{ color: '#64748b' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        user ? (
          <>
            <Navbar user={user} logout={logout} />
            <Dashboard user={user} />
          </>
        ) : <Navigate to="/login" />
      } />
      

      
      <Route path="/profile" element={
        user ? (
          <>
            <Navbar user={user} logout={logout} />
            <Profile user={user} />
          </>
        ) : <Navigate to="/login" />
      } />
      
      <Route path="/learning" element={
        user ? (
          <>
            <Navbar user={user} logout={logout} />
            <Learning />
          </>
        ) : <Navigate to="/login" />
      } />
      
      <Route path="/communities" element={
        user ? (
          <>
            <Navbar user={user} logout={logout} />
            <Community />
          </>
        ) : <Navigate to="/login" />
      } />
      
      <Route path="/community/:id" element={
        user ? (
          <>
            <Navbar user={user} logout={logout} />
            <CommunityDetail />
          </>
        ) : <Navigate to="/login" />
      } />
      
      <Route path="/fields" element={
        user ? (
          <>
            <Navbar user={user} logout={logout} />
            <Fields />
          </>
        ) : <Navigate to="/login" />
      } />
      
      <Route path="/fields/:id" element={
        user ? (
          <>
            <Navbar user={user} logout={logout} />
            <CropDetail />
          </>
        ) : <Navigate to="/login" />
      } />
      
      <Route path="/ai-agent" element={
        user ? (
          <>
            <Navbar user={user} logout={logout} />
            <AIAgent />
          </>
        ) : <Navigate to="/login" />
      } />
      
      <Route path="/daily-tasks/:cropId" element={
        user ? (
          <>
            <Navbar user={user} logout={logout} />
            <DailyTasks />
          </>
        ) : <Navigate to="/login" />
      } />
    </Routes>
  );
}

export default App;