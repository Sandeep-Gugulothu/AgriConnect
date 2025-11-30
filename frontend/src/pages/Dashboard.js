import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getIcon = (iconType) => {
  const icons = {
    weather: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,10.68 7.95,12.12 9.34,12.8L10,13.09V16H14V13.09L14.66,12.8C16.05,12.12 17,10.68 17,9A5,5 0 0,0 12,4Z"/>
      </svg>
    ),
    crop: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22V16H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V16H2V14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M5,9V20H19V9H5M7,11H17V18H7V11Z"/>
      </svg>
    ),
    alert: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
      </svg>
    ),
    market: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
      </svg>
    ),
    trending: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
      </svg>
    ),
    camera: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
      </svg>
    ),
    poll: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17,17H7V14L10.5,10.5L13.5,13.5L17,10V17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
      </svg>
    ),
    like: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10.08L23,10M1,21H5V9H1V21Z"/>
      </svg>
    ),
    comment: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z"/>
      </svg>
    ),
    share: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z"/>
      </svg>
    )
  };
  return icons[iconType] || null;
};

const Dashboard = ({ user }) => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [weather, setWeather] = useState(null);
  const [crops, setCrops] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [locationRequested, setLocationRequested] = useState(false);

  useEffect(() => {
    fetchMyCommunities();
    fetchDashboardFeed();
    fetchWeatherWithLocation(); // Get location and fetch weather
    fetchCrops();
    fetchMarketData();
    fetchAlerts();
  }, []);

  const fetchWeatherWithLocation = async () => {
    try {
      const position = await getCurrentLocation();
      const response = await axios.get('http://localhost:5000/api/weather', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: position
      });
      setWeather(response.data);
    } catch (error) {
      // Fallback to default location if geolocation fails
      try {
        const response = await axios.get('http://localhost:5000/api/weather', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setWeather(response.data);
      } catch (fallbackError) {
        setWeather({
          temperature: 28,
          humidity: 65,
          rainChance: 20,
          condition: 'Partly Cloudy',
          location: 'Delhi'
        });
      }
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        alert('Geolocation not supported by this browser');
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert('Location access denied. Please enable location permission in browser settings.');
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            alert('Location information unavailable.');
          } else {
            alert('Location request timed out.');
          }
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 // Always request fresh location
        }
      );
    });
  };

  const fetchCrops = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/crops', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCrops(response.data || []);
    } catch (error) {
      console.error('Error fetching crops:', error);
      // Fallback to mock data
      setCrops([
        { name: 'Wheat', status: 'Growing', area: 2, days: 45 },
        { name: 'Tomatoes', status: 'Planning', area: 1, days: 0 }
      ]);
    }
  };

  const fetchMarketData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/market/prices', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMarketData(response.data || []);
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Fallback to mock data
      setMarketData([
        { commodity: 'Wheat', change: '+8%', description: 'Up 8% this week due to export demand' },
        { commodity: 'Tomato', change: '+15%', description: 'Prices expected to increase by 15%' },
        { commodity: 'Subsidy', change: 'New', description: '₹50,000 for drip irrigation systems' }
      ]);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Fallback to mock data
      setAlerts([
        { type: 'weather', title: 'Heavy Rain Alert', description: 'Expected in next 48 hours', severity: 'high' },
        { type: 'pest', title: 'Pest Warning', description: 'Aphids spotted in nearby farms', severity: 'medium' }
      ]);
    }
  };

  const fetchMyCommunities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get('http://localhost:5000/api/communities/my-communities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyCommunities(response.data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const fetchDashboardFeed = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get('http://localhost:5000/api/posts/feed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || selectedCommunities.length === 0) return;
    
    try {
      const promises = selectedCommunities.map(async (communityId) => {
        const formData = new FormData();
        formData.append('content', newPost);
        formData.append('communityId', communityId);
        
        selectedImages.forEach((image) => {
          formData.append('images', image);
        });
        
        return axios.post('http://localhost:5000/api/posts', formData, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      });
      
      const responses = await Promise.all(promises);
      const newPosts = responses.map(response => response.data);
      setPosts([...newPosts, ...posts]);
      setNewPost('');
      setSelectedCommunities([]);
      setSelectedImages([]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const toggleCommunitySelection = (communityId) => {
    setSelectedCommunities(prev => 
      prev.includes(communityId) 
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId]
    );
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 4) {
      alert('Maximum 4 images allowed');
      return;
    }
    setSelectedImages([...selectedImages, ...files]);
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likes: response.data.liked 
              ? [...post.likes, { user: 'current-user' }] 
              : post.likes.filter(like => like.user !== 'current-user')
            }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;
    
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
        content: commentText
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, comments: [...post.comments, response.data] }
          : post
      ));
      
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };



  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Sidebar - Profile & Climate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Profile Card */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', margin: '0 0 0.25rem' }}>{user.name}</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
            </div>
            
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Profile views</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>127</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Post impressions</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>1,234</span>
              </div>
            </div>
          </div>

          {/* Climate & Crop Details */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {getIcon('weather')} Today's Weather
            </h4>
            {weather ? (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{weather.temperature}°C</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', textTransform: 'capitalize' }}>{weather.description || weather.condition}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{weather.location}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Humidity</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>{weather.humidity}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Wind Speed</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>{weather.windSpeed || 0} m/s</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Pressure</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>{weather.pressure || 1013} hPa</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>Loading weather...</div>
            )}
            
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {getIcon('crop')} My Crops
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {crops.length > 0 ? crops.map((crop, index) => (
                <div key={index} style={{ 
                  padding: '0.75rem', 
                  backgroundColor: crop.status === 'Growing' ? '#f0fdf4' : '#fef3c7', 
                  borderRadius: '0.5rem', 
                  border: crop.status === 'Growing' ? '1px solid #bbf7d0' : '1px solid #fde68a'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: crop.status === 'Growing' ? '#166534' : '#92400e'
                    }}>{crop.name}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: crop.status === 'Growing' ? '#16a34a' : '#d97706'
                    }}>{crop.status}</span>
                  </div>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: crop.status === 'Growing' ? '#15803d' : '#b45309', 
                    margin: '0.25rem 0 0' 
                  }}>
                    {crop.area} acres {crop.days > 0 ? `• Day ${crop.days}` : '• Next season'}
                  </p>
                </div>
              )) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                  No crops added yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Create Post */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <form onSubmit={handlePostSubmit}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your farming experience, ask questions, or celebrate your harvest..."
                  style={{ 
                    flex: 1, 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.5rem', 
                    padding: '0.75rem', 
                    fontSize: '0.875rem', 
                    resize: 'vertical', 
                    minHeight: '4rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              {/* Image Upload */}
              {selectedImages.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {selectedImages.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db'
                        }}
                      />
                      <button
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Community Selection */}
              {myCommunities.length > 0 ? (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Post to communities:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {myCommunities.map(community => (
                      <button
                        key={community._id}
                        type="button"
                        onClick={() => toggleCommunitySelection(community._id)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          border: '1px solid #d1d5db',
                          backgroundColor: selectedCommunities.includes(community._id) ? '#059669' : 'white',
                          color: selectedCommunities.includes(community._id) ? 'white' : '#374151',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {community.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #fde68a' }}>
                  <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>Join communities to start posting and connecting with other farmers!</p>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                    id="image-upload-dashboard"
                  />
                  <label
                    htmlFor="image-upload-dashboard"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {getIcon('camera')} Photo
                  </label>
                  <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {getIcon('poll')} Poll
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!newPost.trim() || selectedCommunities.length === 0}
                  style={{
                    backgroundColor: (newPost.trim() && selectedCommunities.length > 0) ? '#059669' : '#9ca3af',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: (newPost.trim() && selectedCommunities.length > 0) ? 'pointer' : 'not-allowed'
                  }}
                >
                  Post to {selectedCommunities.length} {selectedCommunities.length === 1 ? 'community' : 'communities'}
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <p style={{ color: '#64748b' }}>Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
                    <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      {post.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>{post.author.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                      {post.author.role} • {post.community.name} • {formatTimeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>
                
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5', marginBottom: '1rem' }}>
                  {post.content}
                </p>
                
                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: post.images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000${image}`}
                        alt={`Post image ${index + 1}`}
                        style={{
                          width: '100%',
                          height: post.images.length === 1 ? '300px' : '150px',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                    ))}
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <button 
                    onClick={() => handleLikePost(post._id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {getIcon('like')} {post.likes.length}
                  </button>
                  <button 
                    onClick={() => toggleComments(post._id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {getIcon('comment')} {post.comments.length}
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {getIcon('share')} {post.shares.length}
                  </button>
                </div>

                {/* Comments Section */}
                {showComments[post._id] && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    {/* Existing Comments */}
                    {post.comments.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        {post.comments.map((comment, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            gap: '0.75rem',
                            marginBottom: '0.75rem',
                            padding: '0.75rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '0.5rem'
                          }}>
                            <div style={{
                              width: '2rem',
                              height: '2rem',
                              backgroundColor: '#059669',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151' }}>
                                  {comment.user?.name || 'User'}
                                </span>
                                <span style={{ fontSize: '0.625rem', color: '#64748b' }}>
                                  {formatTimeAgo(comment.createdAt)}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.75rem', color: '#374151', margin: 0, lineHeight: '1.4' }}>
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add Comment */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        backgroundColor: '#059669',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <textarea
                          value={commentInputs[post._id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                          placeholder="Write a comment..."
                          style={{
                            width: '100%',
                            minHeight: '60px',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            resize: 'vertical',
                            outline: 'none',
                            fontFamily: 'inherit'
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(post._id)}
                          disabled={!commentInputs[post._id]?.trim()}
                          style={{
                            backgroundColor: !commentInputs[post._id]?.trim() ? '#9ca3af' : '#059669',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: 'none',
                            cursor: !commentInputs[post._id]?.trim() ? 'not-allowed' : 'pointer',
                            marginTop: '0.5rem'
                          }}
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No posts yet</h3>
              <p style={{ color: '#64748b' }}>Join communities to see posts from fellow farmers</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - News & Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Important Alerts */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {getIcon('alert')} Important Alerts
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {alerts.length > 0 ? alerts.map((alert, index) => (
                <div key={index} style={{ 
                  padding: '0.75rem', 
                  backgroundColor: alert.severity === 'high' ? '#fef2f2' : '#fef3c7', 
                  borderRadius: '0.5rem', 
                  border: alert.severity === 'high' ? '1px solid #fecaca' : '1px solid #fde68a'
                }}>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: alert.severity === 'high' ? '#dc2626' : '#d97706', 
                    margin: 0 
                  }}>{alert.title}</p>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: alert.severity === 'high' ? '#b91c1c' : '#b45309', 
                    margin: '0.25rem 0 0' 
                  }}>{alert.description}</p>
                </div>
              )) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                  No alerts
                </div>
              )}
            </div>
          </div>

          {/* Market News */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {getIcon('market')} Market News
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {marketData.length > 0 ? marketData.map((item, index) => (
                <div key={index}>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a', margin: '0 0 0.25rem' }}>
                    {item.commodity} {item.change && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: item.change.startsWith('+') ? '#059669' : item.change === 'New' ? '#3b82f6' : '#ef4444',
                        marginLeft: '0.5rem'
                      }}>{item.change}</span>
                    )}
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{item.description}</p>
                </div>
              )) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                  No market updates
                </div>
              )}
            </div>
          </div>

          {/* Trending Topics */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {getIcon('trending')} Trending
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['#OrganicFarming', '#DroughtResistant', '#SoilHealth', '#CropRotation', '#SmartIrrigation'].map((tag, index) => (
                <button key={index} style={{ textAlign: 'left', color: '#059669', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0' }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;