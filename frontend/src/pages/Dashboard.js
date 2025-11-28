import React, { useState } from 'react';

const Dashboard = ({ user }) => {
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit post to backend
    setNewPost('');
  };

  const posts = [
    {
      id: 1,
      author: 'Rajesh Kumar',
      role: 'Farmer',
      location: 'Punjab',
      time: '2 hours ago',
      avatar: 'RK',
      content: '🎉 Just harvested 45 quintals of wheat from 2 acres! Used organic fertilizer and drip irrigation. My best yield yet! Thanks to tips from @ManojSingh about soil preparation.',
      image: null,
      likes: 24,
      comments: 8,
      shares: 3
    },
    {
      id: 2,
      author: 'Priya Sharma',
      role: 'New Farmer',
      location: 'Maharashtra',
      time: '4 hours ago',
      avatar: 'PS',
      content: '🤔 Need advice: Planning to start tomato farming on 1 acre. What\'s the best variety for Maharashtra climate? Also looking for reliable seed suppliers in Pune area. Any experienced tomato farmers here? Would love to connect! 🍅',
      image: null,
      likes: 12,
      comments: 15,
      shares: 2
    },
    {
      id: 3,
      author: 'Amit Mehta',
      role: 'Market Expert',
      location: 'Delhi',
      time: '6 hours ago',
      avatar: 'AM',
      content: '📈 Market Update: Onion prices up 15% this week in Delhi mandi. Good time for farmers with ready stock to sell. 🌧️ Monsoon forecast looks good for next month - expect vegetable prices to stabilize. Plan your sowing accordingly!',
      image: null,
      likes: 31,
      comments: 12,
      shares: 8
    }
  ];

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
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🌤️</span> Today's Weather
            </h4>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Temperature</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>28°C</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Humidity</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>65%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Rain Chance</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>20%</span>
              </div>
            </div>
            
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🌾</span> My Crops
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#166534' }}>Wheat</span>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>Growing</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#15803d', margin: '0.25rem 0 0' }}>2 acres • Day 45</p>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #fde68a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#92400e' }}>Tomatoes</span>
                  <span style={{ fontSize: '0.75rem', color: '#d97706' }}>Planning</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#b45309', margin: '0.25rem 0 0' }}>1 acre • Next season</p>
              </div>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    📷 Photo
                  </button>
                  <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    📊 Poll
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!newPost.trim()}
                  style={{
                    backgroundColor: newPost.trim() ? '#059669' : '#9ca3af',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: newPost.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Post
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          {posts.map((post) => (
            <div key={post.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
                  <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>{post.avatar}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>{post.author}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{post.role} • {post.location} • {post.time}</p>
                </div>
              </div>
              
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5', marginBottom: '1rem' }}>
                {post.content}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                  👍 {post.likes}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                  💬 {post.comments}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                  🔄 {post.shares}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar - News & Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Important Alerts */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🚨</span> Important Alerts
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#dc2626', margin: 0 }}>Heavy Rain Alert</p>
                <p style={{ fontSize: '0.75rem', color: '#b91c1c', margin: '0.25rem 0 0' }}>Expected in next 48 hours</p>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #fde68a' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#d97706', margin: 0 }}>Pest Warning</p>
                <p style={{ fontSize: '0.75rem', color: '#b45309', margin: '0.25rem 0 0' }}>Aphids spotted in nearby farms</p>
              </div>
            </div>
          </div>

          {/* Market News */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📈</span> Market News
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a', margin: '0 0 0.25rem' }}>Wheat Prices Rise</h5>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Up 8% this week due to export demand</p>
              </div>
              <div>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a', margin: '0 0 0.25rem' }}>Tomato Supply Shortage</h5>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Prices expected to increase by 15%</p>
              </div>
              <div>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a', margin: '0 0 0.25rem' }}>New Subsidy Scheme</h5>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>₹50,000 for drip irrigation systems</p>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔥</span> Trending
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