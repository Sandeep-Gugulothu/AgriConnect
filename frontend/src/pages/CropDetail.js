import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/animations.css';

const CropDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [weather, setWeather] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'seeds' });
  const [photos, setPhotos] = useState([]);
  const [yieldPrediction, setYieldPrediction] = useState(null);

  useEffect(() => {
    fetchCropDetail();
    fetchTasks();
    fetchNotes();
    fetchExpenses();
    fetchWeather();
    fetchPhotos();
    fetchYieldPrediction();
  }, [id]);

  const fetchCropDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/fields/crops/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCrop(data);
      }
    } catch (error) {
      console.error('Error fetching crop detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    // Mock data for now - would be from API
    const mockTasks = [
      { id: 1, phase: 'Nursery Preparation', task: 'Soak seeds for 24 hours', completed: true, dueDate: '2024-01-15' },
      { id: 2, phase: 'Nursery Preparation', task: 'Prepare nursery bed', completed: true, dueDate: '2024-01-16' },
      { id: 3, phase: 'Nursery Preparation', task: 'Sow seeds', completed: false, dueDate: '2024-01-17' },
      { id: 4, phase: 'Nursery Preparation', task: 'Maintain water level', completed: false, dueDate: '2024-01-18' }
    ];
    setTasks(mockTasks);
  };

  const fetchNotes = async () => {
    // Mock data for now
    const mockNotes = [
      { id: 1, date: '2024-01-15', note: 'Seeds soaked successfully. Good germination expected.', weather: 'Sunny, 28°C' },
      { id: 2, date: '2024-01-14', note: 'Prepared the field. Soil looks healthy after recent rain.', weather: 'Cloudy, 25°C' }
    ];
    setNotes(mockNotes);
  };

  const fetchExpenses = async () => {
    // Mock data for now
    const mockExpenses = [
      { id: 1, date: '2024-01-15', description: 'Premium Rice Seeds', amount: 2500, category: 'seeds' },
      { id: 2, date: '2024-01-14', description: 'Organic Fertilizer', amount: 1800, category: 'fertilizer' },
      { id: 3, date: '2024-01-13', description: 'Field Preparation', amount: 3000, category: 'labor' }
    ];
    setExpenses(mockExpenses);
  };

  const fetchWeather = async () => {
    // Mock weather data
    const mockWeather = {
      current: { temp: 28, condition: 'Sunny', humidity: 65, rainfall: 0 },
      forecast: [
        { day: 'Today', temp: 28, condition: 'Sunny', rain: 0 },
        { day: 'Tomorrow', temp: 26, condition: 'Cloudy', rain: 20 },
        { day: 'Day 3', temp: 24, condition: 'Rainy', rain: 80 }
      ]
    };
    setWeather(mockWeather);
  };

  const fetchPhotos = async () => {
    // Mock photo data
    const mockPhotos = [
      { id: 1, url: 'https://via.placeholder.com/300x200/059669/ffffff?text=Seeds+Planted', date: '2024-01-15', caption: 'Day 1 - Seeds planted' },
      { id: 2, url: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Field+Ready', date: '2024-01-10', caption: 'Field preparation complete' }
    ];
    setPhotos(mockPhotos);
  };

  const fetchYieldPrediction = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/fields/crops/${id}/yield-prediction`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setYieldPrediction(data);
      }
    } catch (error) {
      console.error('Error fetching yield prediction:', error);
      // Mock data as fallback
      setYieldPrediction({
        perHectare: { min: 4.5, max: 6.2, avg: 5.3, unit: 'tons/hectare' },
        totalExpected: { min: '3.6', max: '5.0', avg: '4.3', unit: 'tons' },
        factors: [
          'Soil quality: Good',
          'Weather conditions: Favorable', 
          'Water availability: Adequate',
          'Crop variety: High yielding'
        ],
        confidence: 85
      });
    }
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        note: newNote,
        weather: weather?.current ? `${weather.current.condition}, ${weather.current.temp}°C` : 'N/A'
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const expense = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      };
      setExpenses([expense, ...expenses]);
      setNewExpense({ description: '', amount: '', category: 'seeds' });
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo = {
          id: Date.now(),
          url: e.target.result,
          date: new Date().toISOString().split('T')[0],
          caption: `Progress photo - ${new Date().toLocaleDateString()}`
        };
        setPhotos([photo, ...photos]);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDaysInfo = (crop) => {
    if (!crop.plantingDate) return { daysSincePlanting: null, currentPhase: 'Planning' };
    
    const plantingDate = new Date(crop.plantingDate);
    const today = new Date();
    const daysSincePlanting = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));
    
    const cropPhases = {
      rice: [
        { name: 'Nursery', start: 0, end: 21 },
        { name: 'Transplanting', start: 21, end: 28 },
        { name: 'Vegetative Growth', start: 28, end: 60 },
        { name: 'Reproductive Stage', start: 60, end: 90 },
        { name: 'Maturation', start: 90, end: 120 }
      ],
      wheat: [
        { name: 'Germination', start: 0, end: 15 },
        { name: 'Tillering', start: 15, end: 45 },
        { name: 'Stem Extension', start: 45, end: 75 },
        { name: 'Flowering', start: 75, end: 95 },
        { name: 'Grain Filling', start: 95, end: 110 }
      ]
    };
    
    const phases = cropPhases[crop.cropName?.toLowerCase()] || [];
    const currentPhase = phases.find(phase => daysSincePlanting >= phase.start && daysSincePlanting < phase.end);
    
    return {
      daysSincePlanting,
      currentPhase: currentPhase ? currentPhase.name : daysSincePlanting < 0 ? 'Planning' : 'Harvest Ready'
    };
  };

  const getCropIcon = (cropName) => {
    const icons = {
      'rice': '🌾', 'wheat': '🌾', 'corn': '🌽', 'tomato': '🍅',
      'potato': '🥔', 'onion': '🧅', 'sugarcane': '🎋', 'cotton': '🌿'
    };
    return icons[cropName?.toLowerCase()] || '🌱';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'planning': return '#3b82f6';
      case 'planted': return '#10b981';
      case 'growing': return '#f59e0b';
      case 'harvested': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCropPlan = (cropName) => {
    const plans = {
      rice: [
        { phase: 'Nursery Preparation', days: '1-21', tasks: ['Soak seeds for 24 hours', 'Prepare nursery bed', 'Sow seeds', 'Maintain water level'] },
        { phase: 'Transplanting', days: '22-28', tasks: ['Prepare main field', 'Flood the field', 'Transplant seedlings', 'Apply first fertilizer'] },
        { phase: 'Vegetative Growth', days: '29-60', tasks: ['Weed management', 'Second fertilizer dose', 'Monitor for pests', 'Maintain water levels'] },
        { phase: 'Reproductive Stage', days: '61-90', tasks: ['Third fertilizer application', 'Disease monitoring', 'Pest control', 'Water management'] },
        { phase: 'Maturation', days: '91-120', tasks: ['Final fertilizer dose', 'Reduce water gradually', 'Monitor grain filling', 'Prepare for harvest'] }
      ],
      wheat: [
        { phase: 'Land Preparation', days: '1-7', tasks: ['Deep plowing', 'Leveling', 'Apply organic manure', 'Prepare seed bed'] },
        { phase: 'Sowing', days: '8-15', tasks: ['Seed treatment', 'Sowing with drill', 'Apply basal fertilizer', 'Light irrigation'] },
        { phase: 'Germination', days: '16-30', tasks: ['Monitor germination', 'Gap filling if needed', 'First irrigation', 'Weed control'] },
        { phase: 'Tillering', days: '31-60', tasks: ['Second irrigation', 'Top dressing fertilizer', 'Weed management', 'Pest monitoring'] },
        { phase: 'Grain Formation', days: '61-110', tasks: ['Regular irrigation', 'Disease control', 'Final fertilizer', 'Harvest preparation'] }
      ]
    };
    return plans[cropName?.toLowerCase()] || [];
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Crop not found</div>
      </div>
    );
  }

  const cropPlan = getCropPlan(crop.cropName);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg> },
    { id: 'tasks', label: 'Tasks', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> },
    { id: 'notes', label: 'Notes', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg> },
    { id: 'expenses', label: 'Expenses', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg> },
    { id: 'photos', label: 'Photos', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg> },
    { id: 'weather', label: 'Weather', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg> },
    { id: 'analytics', label: 'Analytics', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg> }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 0' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/fields')}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#059669">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0, textTransform: 'capitalize' }}>
                {crop.cropName} {crop.variety && `(${crop.variety})`}
              </h1>
              <p style={{ color: '#6b7280', margin: 0 }}>{crop.landSize} acres • {crop.location.district}, {crop.location.state}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="animate-slide-up" style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="tab-transition button-press"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: activeTab === tab.id ? '#059669' : '#f3f4f6',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Left Column - Crop Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Progress Timeline */}
            <div className="animate-slide-left hover-lift" style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Progress Timeline</h3>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  padding: '1rem',
                  backgroundColor: getStatusColor(crop.status) + '20',
                  color: getStatusColor(crop.status),
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {crop.status}
                </div>
              </div>
            </div>

            {/* Field Details */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Field Details</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Land Size:</span>
                  <span style={{ fontWeight: '500' }}>{crop.landSize} acres</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Soil Type:</span>
                  <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{crop.soilType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Water Source:</span>
                  <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{crop.waterSource}</span>
                </div>
                {crop.plantingDate && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Planted:</span>
                    <span style={{ fontWeight: '500' }}>{new Date(crop.plantingDate).toLocaleDateString()}</span>
                  </div>
                )}
                {crop.expectedHarvest && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Expected Harvest:</span>
                    <span style={{ fontWeight: '500' }}>{new Date(crop.expectedHarvest).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Yield Prediction */}
            {yieldPrediction && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#059669">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Yield Prediction</h3>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expected Yield:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#059669' }}>
                      {yieldPrediction.confidence}% confidence
                    </span>
                  </div>
                  
                  <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#059669', marginBottom: '0.25rem' }}>
                      {yieldPrediction.totalExpected.avg} {yieldPrediction.totalExpected.unit}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Range: {yieldPrediction.totalExpected.min} - {yieldPrediction.totalExpected.max} {yieldPrediction.totalExpected.unit}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  <div style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Key Factors:</div>
                  {yieldPrediction.factors.map((factor, index) => (
                    <div key={index} style={{ marginBottom: '0.25rem' }}>• {factor}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <button 
                  onClick={() => navigate(`/daily-tasks/${crop._id}`)}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.5rem' }}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Today's Tasks
                </button>
                <button 
                  onClick={() => navigate('/ai-agent')}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.5rem' }}>
                    <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c0 11 4.03 13 9 13s9-2 9-13l-.5-2z"/>
                  </svg>
                  Get AI Advice
                </button>
                <button 
                  onClick={() => setActiveTab('weather')}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.5rem' }}>
                    <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
                  </svg>
                  Check Weather
                </button>
                <button style={{
                  padding: '0.75rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.5rem' }}>
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                  Market Prices
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Cultivation Plan */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
              Cultivation Plan - {crop.cropName.charAt(0).toUpperCase() + crop.cropName.slice(1)}
            </h3>
            
            {cropPlan.length > 0 ? (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {cropPlan.map((phase, index) => {
                  const daysInfo = getDaysInfo(crop);
                  const isCurrentPhase = daysInfo.currentPhase === phase.phase;
                  const daysSincePlanting = daysInfo.daysSincePlanting || 0;
                  const [startDay, endDay] = phase.days.split('-').map(d => parseInt(d));
                  const isCompleted = daysSincePlanting > endDay;
                  
                  return (
                    <div 
                      key={index} 
                      style={{ 
                        border: `2px solid ${isCurrentPhase ? '#059669' : isCompleted ? '#10b981' : '#e5e7eb'}`,
                        borderRadius: '0.5rem', 
                        padding: '1rem',
                        backgroundColor: isCurrentPhase ? '#f0fdf4' : isCompleted ? '#f0fdf4' : 'white'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isCompleted && <span style={{ color: '#10b981' }}>✅</span>}
                          {isCurrentPhase && <span style={{ color: '#059669' }}>🔄</span>}
                          <h4 style={{ 
                            fontSize: '1rem', 
                            fontWeight: '600', 
                            color: isCurrentPhase ? '#059669' : isCompleted ? '#10b981' : '#1f2937', 
                            margin: 0 
                          }}>
                            {phase.phase}
                            {isCurrentPhase && <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>(Current)</span>}
                          </h4>
                        </div>
                        <span style={{ 
                          padding: '0.25rem 0.75rem',
                          backgroundColor: isCurrentPhase ? '#059669' : isCompleted ? '#10b981' : '#f3f4f6',
                          color: isCurrentPhase || isCompleted ? 'white' : '#6b7280',
                          borderRadius: '1rem',
                          fontSize: '0.75rem'
                        }}>
                          Days {phase.days}
                        </span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#374151' }}>
                        {phase.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} style={{ 
                            marginBottom: '0.25rem', 
                            fontSize: '0.875rem',
                            opacity: isCompleted ? 0.7 : 1,
                            textDecoration: isCompleted ? 'line-through' : 'none'
                          }}>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <p>Cultivation plan not available for this crop yet.</p>
                <button style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}>
                  Get Custom Plan from AI
                </button>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Task Management</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {completedTasks}/{totalTasks} completed ({Math.round(taskProgress)}%)
                </div>
                <div style={{ width: '100px', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                  <div style={{ width: `${taskProgress}%`, height: '100%', backgroundColor: '#059669', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {tasks.map(task => (
                <div key={task.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem',
                  backgroundColor: task.completed ? '#f0fdf4' : 'white'
                }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '1rem', 
                      fontWeight: '500', 
                      color: task.completed ? '#6b7280' : '#1f2937',
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}>
                      {task.task}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {task.phase} • Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  {task.completed && 
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#059669">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '2rem' }}>Field Notes & Observations</h3>
            
            {/* Add Note Form */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add your daily observations, weather conditions, or any important notes..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
              />
              <button
                onClick={addNote}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Add Note
              </button>
            </div>

            {/* Notes List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              {notes.map(note => (
                <div key={note.id} style={{ 
                  padding: '1.5rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {new Date(note.date).toLocaleDateString()} • {note.weather}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: '1.5' }}>
                    {note.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Expense Tracking</h3>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#059669' }}>
                Total: ₹{totalExpenses.toLocaleString()}
              </div>
            </div>

            {/* Add Expense Form */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Description</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    placeholder="e.g., Premium Seeds"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Amount (₹)</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="0"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }}
                  >
                    <option value="seeds">Seeds</option>
                    <option value="fertilizer">Fertilizer</option>
                    <option value="pesticide">Pesticide</option>
                    <option value="labor">Labor</option>
                    <option value="equipment">Equipment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button
                  onClick={addExpense}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Expenses List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              {expenses.map(expense => (
                <div key={expense.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem'
                }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937' }}>
                      {expense.description}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {new Date(expense.date).toLocaleDateString()} • {expense.category}
                    </div>
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#059669' }}>
                    ₹{expense.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Progress Photos</h3>
              <label style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#059669',
                color: 'white',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {photos.map(photo => (
                <div key={photo.id} style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={photo.url} 
                    alt={photo.caption}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {photo.caption}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {new Date(photo.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weather Tab */}
        {activeTab === 'weather' && weather && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '2rem' }}>Weather Information</h3>
            
            {/* Current Weather */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Current Conditions</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#ef4444">
                      <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4z"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>{weather.current.temp}°C</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Temperature</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937' }}>{weather.current.condition}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Condition</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6">
                      <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2C20 10.48 17.33 6.55 12 2z"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>{weather.current.humidity}%</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Humidity</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#6b7280">
                      <path d="M6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm12 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-6-7c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>{weather.current.rainfall}mm</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Rainfall</div>
                </div>
              </div>
            </div>

            {/* Forecast */}
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>3-Day Forecast</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {weather.forecast.map((day, index) => (
                  <div key={index} style={{ 
                    padding: '1rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '0.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem' }}>
                      {day.day}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b">
                        <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {day.temp}°C
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      {day.condition}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>
                      {day.rain}% chance of rain
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#059669">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#059669' }}>₹{totalExpenses.toLocaleString()}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Investment</div>
              </div>
              
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#3b82f6' }}>{Math.round(taskProgress)}%</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tasks Completed</div>
              </div>
              
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f59e0b' }}>
                  {yieldPrediction ? `${yieldPrediction.totalExpected.avg} tons` : 'N/A'}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expected Yield</div>
              </div>
              
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#10b981">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#10b981' }}>
                  {(() => {
                    const daysInfo = getDaysInfo(crop);
                    return daysInfo.daysSincePlanting !== null ? daysInfo.daysSincePlanting : 0;
                  })()} days
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Days Since Planting</div>
              </div>
            </div>

            {/* Expense Breakdown Chart */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>Expense Breakdown</h3>
              
              {(() => {
                const categoryTotals = expenses.reduce((acc, expense) => {
                  acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                  return acc;
                }, {});
                
                const categories = Object.keys(categoryTotals);
                const colors = {
                  seeds: '#059669',
                  fertilizer: '#3b82f6', 
                  pesticide: '#f59e0b',
                  labor: '#ef4444',
                  equipment: '#8b5cf6',
                  other: '#6b7280'
                };
                
                return (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {categories.map(category => {
                      const amount = categoryTotals[category];
                      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                      
                      return (
                        <div key={category} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ minWidth: '100px', fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', textTransform: 'capitalize' }}>
                            {category}
                          </div>
                          <div style={{ flex: 1, height: '24px', backgroundColor: '#f3f4f6', borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${percentage}%`,
                              height: '100%',
                              backgroundColor: colors[category] || '#6b7280',
                              borderRadius: '12px',
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                          <div style={{ minWidth: '80px', fontSize: '0.875rem', fontWeight: '600', color: colors[category] || '#6b7280', textAlign: 'right' }}>
                            ₹{amount.toLocaleString()}
                          </div>
                          <div style={{ minWidth: '50px', fontSize: '0.75rem', color: '#6b7280', textAlign: 'right' }}>
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Growth Timeline */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>Growth Timeline</h3>
              
              {(() => {
                const daysInfo = getDaysInfo(crop);
                const daysSincePlanting = daysInfo.daysSincePlanting || 0;
                const phases = [
                  { name: 'Planning', start: -30, end: 0, color: '#6b7280' },
                  { name: 'Planting', start: 0, end: 15, color: '#3b82f6' },
                  { name: 'Growth', start: 15, end: 60, color: '#10b981' },
                  { name: 'Maturation', start: 60, end: 90, color: '#f59e0b' },
                  { name: 'Harvest', start: 90, end: 120, color: '#059669' }
                ];
                
                return (
                  <div style={{ position: 'relative', height: '60px', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '1rem' }}>
                    {phases.map((phase, index) => {
                      const isActive = daysSincePlanting >= phase.start && daysSincePlanting < phase.end;
                      const isPast = daysSincePlanting >= phase.end;
                      const width = ((phase.end - phase.start) / 150) * 100; // 150 total days
                      const left = ((phase.start + 30) / 150) * 100; // +30 to account for planning phase
                      
                      return (
                        <div key={index} style={{
                          position: 'absolute',
                          left: `${left}%`,
                          width: `${width}%`,
                          height: '20px',
                          backgroundColor: isActive ? phase.color : isPast ? phase.color + '80' : phase.color + '40',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          color: isActive || isPast ? 'white' : '#6b7280'
                        }}>
                          {phase.name}
                        </div>
                      );
                    })}
                    
                    {/* Current day indicator */}
                    {daysSincePlanting >= 0 && (
                      <div style={{
                        position: 'absolute',
                        left: `${((daysSincePlanting + 30) / 150) * 100}%`,
                        top: '0',
                        width: '2px',
                        height: '100%',
                        backgroundColor: '#ef4444',
                        zIndex: 10
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '-4px',
                          width: '10px',
                          height: '10px',
                          backgroundColor: '#ef4444',
                          borderRadius: '50%'
                        }}></div>
                      </div>
                    )}
                  </div>
                );
              })()}
              
              <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                Current Phase: {getDaysInfo(crop).currentPhase}
              </div>
            </div>

            {/* Performance Insights */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>Performance Insights</h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#059669">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>Task Completion Rate</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>You're {taskProgress > 80 ? 'ahead of' : taskProgress > 60 ? 'on track with' : 'behind'} schedule</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>Cost Efficiency</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Spending ₹{Math.round(totalExpenses / (crop.landSize || 1))} per acre</div>
                  </div>
                </div>
                
                {yieldPrediction && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '0.5rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#059669">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>Yield Confidence</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{yieldPrediction.confidence}% confidence in predicted yield</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropDetail;