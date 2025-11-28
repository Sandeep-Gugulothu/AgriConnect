import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  // Sample user posts
  const userPosts = [
    {
      id: 1,
      content: '🎉 Just harvested 45 quintals of wheat from 2 acres! Used organic fertilizer and drip irrigation. My best yield yet!',
      date: '2 days ago',
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      content: '🌱 Started preparing soil for tomato plantation. Excited for the new season!',
      date: '1 week ago',
      likes: 15,
      comments: 5
    }
  ];

  // Sample communities
  const communities = [
    { name: 'Organic Farmers Punjab', members: '2.3K', joined: '6 months ago' },
    { name: 'Wheat Growers Network', members: '5.1K', joined: '1 year ago' },
    { name: 'Sustainable Agriculture', members: '8.7K', joined: '8 months ago' }
  ];

  // Sample crop data
  const cropData = [
    { name: 'Wheat', acres: 2.5, status: 'Harvested', yield: '45 quintals', season: 'Rabi 2024' },
    { name: 'Tomatoes', acres: 1.0, status: 'Planning', yield: 'Expected 80 quintals', season: 'Kharif 2024' },
    { name: 'Sugarcane', acres: 0.5, status: 'Growing', yield: 'Day 120', season: 'Annual' }
  ];

  const totalLand = cropData.reduce((sum, crop) => sum + crop.acres, 0);

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
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)} • Punjab, India • {totalLand} acres</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>{userPosts.length}</div>
                <div style={{ color: '#64748b' }}>Posts</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>1,234</div>
                <div style={{ color: '#64748b' }}>Connections</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>{communities.length}</div>
                <div style={{ color: '#64748b' }}>Communities</div>
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
                  { id: 'posts', label: 'Posts', icon: '📝' },
                  { id: 'crops', label: 'My Crops', icon: '🌾' },
                  { id: 'communities', label: 'Communities', icon: '👥' }
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
                    <span>{tab.icon}</span>
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
                  {userPosts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {userPosts.map((post) => (
                        <div key={post.id} style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: '#f8fafc' }}>
                          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5', margin: '0 0 1rem' }}>
                            {post.content}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                            <span>{post.date}</span>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                              <span>👍 {post.likes}</span>
                              <span>💬 {post.comments}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No posts yet</h3>
                      <p style={{ color: '#64748b' }}>Share your farming journey with the community!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Crops Tab */}
              {activeTab === 'crops' && (
                <div>
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Land Distribution</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      {cropData.map((crop, index) => (
                        <div key={index} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: '#f8fafc' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>{crop.name}</h4>
                            <span style={{ 
                              fontSize: '0.75rem', 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '0.25rem',
                              backgroundColor: crop.status === 'Harvested' ? '#d1fae5' : crop.status === 'Growing' ? '#fef3c7' : '#e0e7ff',
                              color: crop.status === 'Harvested' ? '#065f46' : crop.status === 'Growing' ? '#92400e' : '#3730a3'
                            }}>
                              {crop.status}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 0.5rem' }}>{crop.acres} acres • {crop.season}</p>
                          <p style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '500', margin: 0 }}>{crop.yield}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Farming Statistics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                      <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{totalLand}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Acres</div>
                      </div>
                      <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>3</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Crop Types</div>
                      </div>
                      <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>8+</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Years Experience</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Communities Tab */}
              {activeTab === 'communities' && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1.5rem' }}>Joined Communities</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {communities.map((community, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '3rem', height: '3rem', backgroundColor: '#059669', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'white', fontSize: '1rem' }}>👥</span>
                          </div>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: '0 0 0.25rem' }}>{community.name}</h4>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>{community.members} members • Joined {community.joined}</p>
                          </div>
                        </div>
                        <button style={{ 
                          backgroundColor: '#f3f4f6', 
                          color: '#374151', 
                          padding: '0.5rem 1rem', 
                          borderRadius: '0.5rem', 
                          fontSize: '0.875rem', 
                          border: 'none', 
                          cursor: 'pointer' 
                        }}>
                          View
                        </button>
                      </div>
                    ))}
                  </div>
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
                <button style={{ textAlign: 'left', padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '0.5rem', cursor: 'pointer' }}>
                  📝 Create Post
                </button>
                <button style={{ textAlign: 'left', padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '0.5rem', cursor: 'pointer' }}>
                  🌾 Add New Crop
                </button>
                <button style={{ textAlign: 'left', padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '0.5rem', cursor: 'pointer' }}>
                  👥 Join Community
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Recent Activity</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                <div>• Posted about wheat harvest</div>
                <div>• Joined Organic Farmers group</div>
                <div>• Updated crop information</div>
                <div>• Connected with 5 new farmers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;