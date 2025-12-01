import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Fields = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    landSize: '',
    soilType: '',
    waterSource: '',
    location: {
      state: '',
      district: ''
    },
    plantingDate: '',
    expectedHarvest: '',
    status: 'planning'
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/fields/crops', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCrops(data);
      }
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/fields/crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Crop added successfully!');
        setShowAddForm(false);
        setFormData({
          cropName: '',
          variety: '',
          landSize: '',
          soilType: '',
          waterSource: '',
          location: { state: '', district: '' },
          plantingDate: '',
          expectedHarvest: '',
          status: 'planning'
        });
        fetchCrops();
      } else {
        alert('Error adding crop');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding crop');
    }
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

  const getCropIcon = (cropName) => {
    const iconColor = '#059669';
    const icons = {
      'rice': <svg width="32" height="32" viewBox="0 0 24 24" fill={iconColor}><path d="M7.5 2L6 3.5l1.5 1.5L9 3.5 7.5 2zm9 0L15 3.5l1.5 1.5L18 3.5 16.5 2zM12 4.5L10.5 6 12 7.5 13.5 6 12 4.5zM4.5 7L3 8.5l1.5 1.5L6 8.5 4.5 7zm15 0L18 8.5l1.5 1.5L21 8.5 19.5 7zM9 9.5L7.5 11 9 12.5 10.5 11 9 9.5zm6 0L13.5 11 15 12.5 16.5 11 15 9.5zM12 14.5L10.5 16 12 17.5 13.5 16 12 14.5z"/></svg>,
      'wheat': <svg width="32" height="32" viewBox="0 0 24 24" fill={iconColor}><path d="M7.5 2L6 3.5l1.5 1.5L9 3.5 7.5 2zm9 0L15 3.5l1.5 1.5L18 3.5 16.5 2zM12 4.5L10.5 6 12 7.5 13.5 6 12 4.5zM4.5 7L3 8.5l1.5 1.5L6 8.5 4.5 7zm15 0L18 8.5l1.5 1.5L21 8.5 19.5 7zM9 9.5L7.5 11 9 12.5 10.5 11 9 9.5zm6 0L13.5 11 15 12.5 16.5 11 15 9.5zM12 14.5L10.5 16 12 17.5 13.5 16 12 14.5z"/></svg>,
      'corn': <svg width="32" height="32" viewBox="0 0 24 24" fill={iconColor}><path d="M12 2C8.69 2 6 4.69 6 8v8c0 3.31 2.69 6 6 6s6-2.69 6-6V8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4v8c0 2.21-1.79 4-4 4s-4-1.79-4-4V8c0-2.21 1.79-4 4-4z"/></svg>,
      'tomato': <svg width="32" height="32" viewBox="0 0 24 24" fill={iconColor}><path d="M12 2C8.69 2 6 4.69 6 8c0 5.25 3.75 9.5 8.5 12.5C19.25 17.5 23 13.25 23 8c0-3.31-2.69-6-6-6-1.66 0-3.16.67-4.24 1.76C11.68 2.67 10.18 2 8.5 2 5.19 2 2.5 4.69 2.5 8c0 5.25 3.75 9.5 8.5 12.5z"/></svg>,
      'potato': <svg width="32" height="32" viewBox="0 0 24 24" fill={iconColor}><path d="M17.5 8c-1.5 0-2.64.5-3.5 1.16C13.14 8.5 12 8 10.5 8 7.46 8 5 10.46 5 13.5S7.46 19 10.5 19c1.5 0 2.64-.5 3.5-1.16.86.66 2 1.16 3.5 1.16 3.04 0 5.5-2.46 5.5-5.5S20.54 8 17.5 8z"/></svg>,
      'onion': <svg width="32" height="32" viewBox="0 0 24 24" fill={iconColor}><path d="M12 2C8.69 2 6 4.69 6 8v4c0 3.31 2.69 6 6 6s6-2.69 6-6V8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4v4c0 2.21-1.79 4-4 4s-4-1.79-4-4V8c0-2.21 1.79-4 4-4z"/></svg>,
      'sugarcane': <svg width="32" height="32" viewBox="0 0 24 24" fill={iconColor}><path d="M9 2v20h2V2H9zm4 0v20h2V2h-2zM5 6v12h2V6H5zm12 0v12h2V6h-2z"/></svg>,
      'cotton': <svg width="32" height="32" viewBox="0 0 24 24" fill={iconColor}><path d="M12 2l-2 2v4l2-2 2 2V4l-2-2zm-4 6l-2 2v4l2-2 2 2v-4l-2-2zm8 0l-2 2v4l2-2 2 2v-4l-2-2zm-4 6l-2 2v4l2-2 2 2v-4l-2-2z"/></svg>
    };
    return icons[cropName?.toLowerCase()] || <svg width="32" height="32" viewBox="0 0 24 24" fill={iconColor}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
  };

  if (showAddForm) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 0' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                  🌱 Add New Crop
                </h1>
                <p style={{ color: '#6b7280' }}>Add a new crop to your field management</p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Crop Name & Variety */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Crop Name *
                  </label>
                  <select
                    name="cropName"
                    value={formData.cropName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">Select crop</option>
                    <option value="rice">Rice</option>
                    <option value="wheat">Wheat</option>
                    <option value="corn">Corn</option>
                    <option value="tomato">Tomato</option>
                    <option value="potato">Potato</option>
                    <option value="onion">Onion</option>
                    <option value="sugarcane">Sugarcane</option>
                    <option value="cotton">Cotton</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Variety
                  </label>
                  <input
                    type="text"
                    name="variety"
                    value={formData.variety}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., Basmati, Hybrid"
                  />
                </div>
              </div>

              {/* Land Size */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Land Size (acres) *
                </label>
                <input
                  type="number"
                  name="landSize"
                  value={formData.landSize}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., 2.5"
                />
              </div>

              {/* Soil Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Soil Type *
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="">Select soil type</option>
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="loamy">Loamy</option>
                  <option value="silt">Silt</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              {/* Water Source */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Water Source *
                </label>
                <select
                  name="waterSource"
                  value={formData.waterSource}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="">Select water source</option>
                  <option value="bore">Bore Well</option>
                  <option value="canal">Canal</option>
                  <option value="river">River</option>
                  <option value="rain">Rain Fed</option>
                  <option value="mixed">Mixed Sources</option>
                </select>
              </div>

              {/* Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., Punjab"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    District *
                  </label>
                  <input
                    type="text"
                    name="location.district"
                    value={formData.location.district}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., Ludhiana"
                  />
                </div>
              </div>

              {/* Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Planting Date
                  </label>
                  <input
                    type="date"
                    name="plantingDate"
                    value={formData.plantingDate}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Expected Harvest
                  </label>
                  <input
                    type="date"
                    name="expectedHarvest"
                    value={formData.expectedHarvest}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
              >
                Add Crop
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 0' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#059669">
                <path d="M7.5 2L6 3.5l1.5 1.5L9 3.5 7.5 2zm9 0L15 3.5l1.5 1.5L18 3.5 16.5 2zM12 4.5L10.5 6 12 7.5 13.5 6 12 4.5zM4.5 7L3 8.5l1.5 1.5L6 8.5 4.5 7zm15 0L18 8.5l1.5 1.5L21 8.5 19.5 7zM9 9.5L7.5 11 9 12.5 10.5 11 9 9.5zm6 0L13.5 11 15 12.5 16.5 11 15 9.5zM12 14.5L10.5 16 12 17.5 13.5 16 12 14.5z"/>
              </svg>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>My Fields</h1>
            </div>
            <p style={{ color: '#6b7280' }}>Manage your crops and track their progress</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>+</span>
            Add Crop
          </button>
        </div>

        {/* Crops Grid */}
        {crops.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#6b7280">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No crops added yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Start by adding your first crop to track its progress</p>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Add Your First Crop
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {crops.map((crop) => (
              <div 
                key={crop._id} 
                onClick={() => navigate(`/fields/${crop._id}`)}
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.75rem', 
                  padding: '1.5rem', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getCropIcon(crop.cropName)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0, textTransform: 'capitalize' }}>
                        {crop.cropName}
                      </h3>
                      {crop.variety && (
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{crop.variety}</p>
                      )}
                    </div>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: getStatusColor(crop.status) + '20',
                    color: getStatusColor(crop.status),
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {crop.status}
                  </span>
                </div>
                
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Land Size:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>{crop.landSize} acres</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Soil Type:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', textTransform: 'capitalize' }}>{crop.soilType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Water Source:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', textTransform: 'capitalize' }}>{crop.waterSource}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Location:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>{crop.location.district}, {crop.location.state}</span>
                  </div>
                  {crop.plantingDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Planted:</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                        {new Date(crop.plantingDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {crop.expectedHarvest && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expected Harvest:</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                        {new Date(crop.expectedHarvest).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Click to view details and cultivation plan</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fields;