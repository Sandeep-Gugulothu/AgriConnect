import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [postsRes, communitiesRes, cropsRes] = await Promise.all([
        fetch('http://localhost:5000/api/users/profile/posts', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/users/profile/communities', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/users/profile/crops', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      const posts = await postsRes.json();
      const userCommunities = await communitiesRes.json();
      const userCrops = await cropsRes.json();
      
      setUserPosts(posts);
      setCommunities(userCommunities);
      setCrops(userCrops);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const totalLand = crops.reduce((sum, crop) => sum + (crop.landSize || 0), 0);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem' }}>
        
        {/* Profile Header - Compact */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '4rem', height: '4rem', backgroundColor: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 0.25rem' }}>{user.name}</h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • 
                {crops.length > 0 ? `${crops[0].location?.state}, ${crops[0].location?.district}` : 'Location not set'} • 
                {totalLand ? `${totalLand.toFixed(1)} acres` : 'Farm size not set'}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>{userPosts.length}</div>
                <div style={{ color: '#64748b' }}>Posts</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>{communities.length}</div>
                <div style={{ color: '#64748b' }}>Communities</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>{crops.length}</div>
                <div style={{ color: '#64748b' }}>Crops</div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              style={{ 
                backgroundColor: '#dc2626', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                border: 'none', 
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          
          {/* Main Content */}
          <div>
            {/* Tab Navigation */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem 0.75rem 0 0', padding: '1rem 2rem 0', border: '1px solid #e2e8f0', borderBottom: 'none' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                {[
                  { id: 'posts', label: 'Posts', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" /></svg> },
                  { id: 'crops', label: 'My Crops', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A2,2 0 0,1 14,4C14,5.5 13.2,6.77 12,7.46V16H15V18H9V16H12V7.46C10.8,6.77 10,5.5 10,4A2,2 0 0,1 12,2M12,4.5A0.5,0.5 0 0,0 11.5,4A0.5,0.5 0 0,0 12,3.5A0.5,0.5 0 0,0 12.5,4A0.5,0.5 0 0,0 12,4.5Z" /></svg> },
                  { id: 'communities', label: 'Communities', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C18.67,14 24,15.33 24,18V20H8V18C8,15.33 13.33,14 16,14M8,4C10.21,4 12,5.79 12,8C12,10.21 10.21,12 8,12C5.79,12 4,10.21 4,8C4,5.79 5.79,4 8,4M8,14C10.67,14 16,15.33 16,18V20H0V18C0,15.33 5.33,14 8,14Z" /></svg> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: activeTab === tab.id ? '2px solid #059669' : '2px solid transparent',
                      color: activeTab === tab.id ? '#059669' : '#64748b',
                      fontWeight: activeTab === tab.id ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div style={{ backgroundColor: 'white', borderRadius: '0 0 0.75rem 0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', borderTop: 'none', minHeight: '20rem' }}>
              
              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <div>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
                  ) : userPosts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {userPosts.map((post) => (
                        <div key={post._id} style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: '#f8fafc' }}>
                          <div style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                            Posted in {post.community?.name}
                          </div>
                          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5', margin: '0 0 1rem' }}>
                            {post.content}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                            <span>{formatDate(post.createdAt)}</span>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10.08L23,10M1,21H5V9H1V21Z" />
                                </svg>
                                {post.likes?.length || 0}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z" />
                                </svg>
                                {post.comments?.length || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="#64748b" style={{ marginBottom: '1rem' }}>
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No posts yet</h3>
                      <p style={{ color: '#64748b' }}>Share your farming journey with the community!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Crops Tab */}
              {activeTab === 'crops' && (
                <div>
                  {crops.length > 0 ? (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>My Crops</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {crops.map((crop) => (
                          <div key={crop._id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: '#f8fafc' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669">
                                  <path d="M12,2A2,2 0 0,1 14,4C14,5.5 13.2,6.77 12,7.46V16H15V18H9V16H12V7.46C10.8,6.77 10,5.5 10,4A2,2 0 0,1 12,2M12,4.5A0.5,0.5 0 0,0 11.5,4A0.5,0.5 0 0,0 12,3.5A0.5,0.5 0 0,0 12.5,4A0.5,0.5 0 0,0 12,4.5Z" />
                                </svg>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>{crop.cropName}</h4>
                              </div>
                              <span style={{ 
                                fontSize: '0.75rem', 
                                padding: '0.25rem 0.5rem', 
                                borderRadius: '0.25rem',
                                backgroundColor: crop.status === 'harvested' ? '#d1fae5' : crop.status === 'growing' ? '#fef3c7' : crop.status === 'planted' ? '#dbeafe' : '#f3f4f6',
                                color: crop.status === 'harvested' ? '#065f46' : crop.status === 'growing' ? '#92400e' : crop.status === 'planted' ? '#1e40af' : '#374151'
                              }}>
                                {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 0.5rem' }}>
                              {crop.landSize} acres • {crop.soilType} soil
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '500', margin: 0 }}>
                              {crop.location?.state}, {crop.location?.district}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="#64748b" style={{ marginBottom: '1rem' }}>
                        <path d="M12,2A2,2 0 0,1 14,4C14,5.5 13.2,6.77 12,7.46V16H15V18H9V16H12V7.46C10.8,6.77 10,5.5 10,4A2,2 0 0,1 12,2M12,4.5A0.5,0.5 0 0,0 11.5,4A0.5,0.5 0 0,0 12,3.5A0.5,0.5 0 0,0 12.5,4A0.5,0.5 0 0,0 12,4.5Z" />
                      </svg>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No crops added</h3>
                      <p style={{ color: '#64748b' }}>Add your crops to track your farming activities!</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Farm Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                      <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{totalLand.toFixed(1)}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Acres</div>
                      </div>
                      <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{crops.length}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Crop Fields</div>
                      </div>
                      <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{crops.filter(c => c.status === 'growing').length}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Active Crops</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Communities Tab */}
              {activeTab === 'communities' && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1.5rem' }}>Joined Communities</h3>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
                  ) : communities.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {communities.map((userCommunity) => (
                        <div key={userCommunity._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: '#f8fafc' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '3rem', height: '3rem', backgroundColor: '#059669', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C18.67,14 24,15.33 24,18V20H8V18C8,15.33 13.33,14 16,14M8,4C10.21,4 12,5.79 12,8C12,10.21 10.21,12 8,12C5.79,12 4,10.21 4,8C4,5.79 5.79,4 8,4M8,14C10.67,14 16,15.33 16,18V20H0V18C0,15.33 5.33,14 8,14Z" />
                              </svg>
                            </div>
                            <div>
                              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: '0 0 0.25rem' }}>{userCommunity.communityId?.name}</h4>
                              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                                {userCommunity.communityId?.memberCount || 0} members • Joined {formatDate(userCommunity.joinedAt)}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => navigate(`/community/${userCommunity.communityId._id}`)}
                            style={{ 
                              backgroundColor: '#f3f4f6', 
                              color: '#374151', 
                              padding: '0.5rem 1rem', 
                              borderRadius: '0.5rem', 
                              fontSize: '0.875rem', 
                              border: 'none', 
                              cursor: 'pointer' 
                            }}
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="#64748b" style={{ marginBottom: '1rem' }}>
                        <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C18.67,14 24,15.33 24,18V20H8V18C8,15.33 13.33,14 16,14M8,4C10.21,4 12,5.79 12,8C12,10.21 10.21,12 8,12C5.79,12 4,10.21 4,8C4,5.79 5.79,4 8,4M8,14C10.67,14 16,15.33 16,18V20H0V18C0,15.33 5.33,14 8,14Z" />
                      </svg>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No communities joined</h3>
                      <p style={{ color: '#64748b' }}>Join agricultural communities to connect with other farmers!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Quick Actions */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Quick Actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left', padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '0.5rem', cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  Create Post
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left', padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '0.5rem', cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669">
                    <path d="M12,2A2,2 0 0,1 14,4C14,5.5 13.2,6.77 12,7.46V16H15V18H9V16H12V7.46C10.8,6.77 10,5.5 10,4A2,2 0 0,1 12,2M12,4.5A0.5,0.5 0 0,0 11.5,4A0.5,0.5 0 0,0 12,3.5A0.5,0.5 0 0,0 12.5,4A0.5,0.5 0 0,0 12,4.5Z" />
                  </svg>
                  Update Profile
                </button>
                <button 
                  onClick={() => navigate('/community')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left', padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '0.5rem', cursor: 'pointer' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669">
                    <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C18.67,14 24,15.33 24,18V20H8V18C8,15.33 13.33,14 16,14M8,4C10.21,4 12,5.79 12,8C12,10.21 10.21,12 8,12C5.79,12 4,10.21 4,8C4,5.79 5.79,4 8,4M8,14C10.67,14 16,15.33 16,18V20H0V18C0,15.33 5.33,14 8,14Z" />
                  </svg>
                  Join Community
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Recent Activity</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                {userPosts.length > 0 && <div>• Posted {userPosts.length} time{userPosts.length !== 1 ? 's' : ''}</div>}
                {communities.length > 0 && <div>• Joined {communities.length} communit{communities.length !== 1 ? 'ies' : 'y'}</div>}
                {crops.length > 0 && <div>• Growing {crops.length} crop type{crops.length !== 1 ? 's' : ''}</div>}
                {!userPosts.length && !communities.length && !crops.length && <div>No recent activity</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;