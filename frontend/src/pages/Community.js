import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Community = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [posts, setPosts] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [postsLoading, setPostsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    type: 'interest',
    category: ''
  });

  const getIcon = (iconType) => {
    const icons = {
      search: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      ),
      users: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.01 3.01 0 0 0 16.5 6.5h-1c-.8 0-1.5.7-1.5 1.5v6c0 1.1.9 2 2 2h1v6h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
        </svg>
      ),
      crop: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22V16H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V16H2V14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M5,9V20H19V9H5M7,11H17V18H7V11Z"/>
        </svg>
      ),
      location: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19S6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6Z"/>
        </svg>
      ),
      interest: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
        </svg>
      ),
      community: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16,4C16.88,4 17.67,4.38 18.18,5H20C21.11,5 22,5.89 22,7V9C22,10.11 21.11,11 20,11H4C2.89,11 2,10.11 2,9V7C2,5.89 2.89,5 4,5H5.82C6.33,4.38 7.12,4 8,4H16M8,6A1,1 0 0,0 7,7A1,1 0 0,0 8,8A1,1 0 0,0 9,7A1,1 0 0,0 8,6M16,6A1,1 0 0,0 15,7A1,1 0 0,0 16,8A1,1 0 0,0 17,7A1,1 0 0,0 16,6M4,12H20V20C20,21.11 19.11,22 18,22H6C4.89,22 4,21.11 4,20V12Z"/>
        </svg>
      )
    };
    return icons[iconType] || icons.community;
  };

  useEffect(() => {
    fetchCommunities();
    fetchMyCommunities();
    autoJoinCommunities();
  }, []);

  useEffect(() => {
    // Update URL when tab changes
    setSearchParams({ tab: activeTab });
    
    if (activeTab === 'feed') {
      fetchFeed();
    } else if (activeTab === 'discover') {
      fetchCommunities();
    }
  }, [activeTab, setSearchParams]);

  const autoJoinCommunities = async () => {
    // Disabled for now
  };

  const fetchCommunities = async () => {
    try {
      // Use fallback route directly to avoid auth issues
      const response = await axios.get('http://localhost:5000/api/communities/all');
      setCommunities(response.data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCommunities = async () => {
    // Disabled for now - set empty array
    setMyCommunities([]);
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      await axios.post(`http://localhost:5000/api/communities/${communityId}/join`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Update local state
      setCommunities(communities.map(c => 
        c._id === communityId ? { ...c, isJoined: true, memberCount: c.memberCount + 1 } : c
      ));
      
      // Refresh my communities
      fetchMyCommunities();
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Join functionality temporarily disabled');
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    try {
      await axios.post(`http://localhost:5000/api/communities/${communityId}/leave`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Update local state
      setCommunities(communities.map(c => 
        c._id === communityId ? { ...c, isJoined: false, memberCount: c.memberCount - 1 } : c
      ));
      
      // Refresh my communities
      fetchMyCommunities();
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const fetchFeed = async () => {
    try {
      setPostsLoading(true);
      const response = await axios.get('http://localhost:5000/api/posts/feed', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleCreatePost = async (communityId) => {
    if (!newPost.trim()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/posts', {
        content: newPost,
        communityId: communityId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setPosts([response.data, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
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

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const handleCreateCommunity = async () => {
    if (!newCommunity.name.trim() || !newCommunity.description.trim()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/communities/create', newCommunity, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Add to communities list
      setCommunities([response.data, ...communities]);
      
      // Reset form and close modal
      setNewCommunity({ name: '', description: '', type: 'interest', category: '' });
      setShowCreateModal(false);
      
      // Refresh my communities
      fetchMyCommunities();
    } catch (error) {
      console.error('Error creating community:', error);
      alert(error.response?.data?.message || 'Error creating community');
    }
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || community.type === filterType;
    return matchesSearch && matchesType;
  });
  


  const formatMemberCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderCommunityCard = (community, showJoinButton = true) => (
    <div key={community._id} style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease'
    }}
      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'}
      onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            {getIcon(community.type)}
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>
              {community.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                backgroundColor: community.type === 'crop' ? '#dbeafe' : community.type === 'location' ? '#fef3c7' : '#f3e8ff',
                color: community.type === 'crop' ? '#1e40af' : community.type === 'location' ? '#92400e' : '#7c3aed'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {getIcon(community.type)}
                  <span>{community.type === 'crop' ? 'Crop' : community.type === 'location' ? 'Location' : 'Interest'}</span>
                </div>
              </span>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {formatMemberCount(community.memberCount)} members
              </span>
            </div>
          </div>
        </div>
        
        {showJoinButton && (
          <button
            onClick={() => alert('Join functionality coming soon!')}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Join
          </button>
        )}
      </div>
      
      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
        {community.description}
      </p>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 0.5rem' }}>
            Communities
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#64748b', margin: 0 }}>
            Connect with farmers who share your interests and location
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0' }}>
            {[
              { id: 'feed', label: 'Community Feed', icon: 'community' },
              { id: 'discover', label: 'Discover Communities', icon: 'search' },
              { id: 'my-communities', label: `My Communities (${myCommunities.length})`, icon: 'users' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchParams({ tab: tab.id });
                }}
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
                {getIcon(tab.icon)}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Community Feed Tab */}
        {activeTab === 'feed' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Create Post */}
            {myCommunities.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '1rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your farming experience, ask questions, or celebrate your harvest..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <select
                    value={selectedCommunity || ''}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">Select community...</option>
                    {myCommunities.map(community => (
                      <option key={community._id} value={community._id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleCreatePost(selectedCommunity)}
                    disabled={!newPost.trim() || !selectedCommunity}
                    style={{
                      backgroundColor: (!newPost.trim() || !selectedCommunity) ? '#9ca3af' : '#059669',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: (!newPost.trim() || !selectedCommunity) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}

            {/* Posts Feed */}
            {postsLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ marginBottom: '1rem' }}>{getIcon('community')}</div>
                <p style={{ color: '#64748b' }}>Loading posts...</p>
              </div>
            ) : posts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {posts.map(post => (
                  <div key={post._id} style={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0'
                  }}>
                    {/* Post Header */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        backgroundColor: '#059669',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>
                          {post.author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                            {post.author.name}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {formatTimeAgo(post.createdAt)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                          {getIcon(post.community.type)}
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {post.community.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Post Content */}
                    <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5', margin: '0 0 1rem' }}>
                      {post.content}
                    </p>
                    
                    {/* Post Actions */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <button
                        onClick={() => handleLikePost(post._id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#64748b',
                          fontSize: '0.875rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem'
                        }}
                      >
                        ❤️ {post.likes.length}
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#64748b',
                        fontSize: '0.875rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem'
                      }}>
                        💬 {post.comments.length}
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#64748b',
                        fontSize: '0.875rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem'
                      }}>
                        🔄 {post.shares.length}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ marginBottom: '1rem' }}>{getIcon('community')}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No posts yet</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Join communities to see posts from fellow farmers</p>
                <button
                  onClick={() => {
                    setActiveTab('discover');
                    setSearchParams({ tab: 'discover' });
                  }}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Discover Communities
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Community Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Create New Community</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Community Name</label>
                <input
                  type="text"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
                  placeholder="e.g., Mango Farmers Network"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Description</label>
                <textarea
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                  placeholder="Describe what this community is about..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Type</label>
                  <select
                    value={newCommunity.type}
                    onChange={(e) => setNewCommunity({...newCommunity, type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="crop">Crop Community</option>
                    <option value="location">Location Community</option>
                    <option value="interest">Interest Community</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Category</label>
                  <input
                    type="text"
                    value={newCommunity.category}
                    onChange={(e) => setNewCommunity({...newCommunity, category: e.target.value})}
                    placeholder="e.g., mango, organic, etc."
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
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCommunity}
                  disabled={!newCommunity.name.trim() || !newCommunity.description.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    backgroundColor: (!newCommunity.name.trim() || !newCommunity.description.trim()) ? '#9ca3af' : '#059669',
                    color: 'white',
                    cursor: (!newCommunity.name.trim() || !newCommunity.description.trim()) ? 'not-allowed' : 'pointer'
                  }}
                >
                  Create Community
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <>
            {/* Create Community Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>Discover Communities</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                + Create Community
              </button>
            </div>
            
            {/* Search and Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <input
                  type="text"
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Types</option>
                <option value="crop">Crop Communities</option>
                <option value="location">Location Communities</option>
                <option value="interest">Interest Communities</option>
              </select>
            </div>

            {/* Communities Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ marginBottom: '1rem' }}>{getIcon('crop')}</div>
                <p style={{ color: '#64748b' }}>Loading communities...</p>
              </div>
            ) : filteredCommunities.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredCommunities.map(community => renderCommunityCard(community))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ marginBottom: '1rem' }}>{getIcon('search')}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No communities found</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Try adjusting your search or create a new community</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Create Community
                </button>
              </div>
            )}
          </>
        )}

        {/* My Communities Tab */}
        {activeTab === 'my-communities' && (
          <div>
            {myCommunities.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '1.5rem'
              }}>
                {myCommunities.map(community => renderCommunityCard(community, false))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ marginBottom: '1rem' }}>{getIcon('users')}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No communities joined yet</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Discover and join communities to connect with fellow farmers</p>
                <button
                  onClick={() => {
                    setActiveTab('discover');
                    setSearchParams({ tab: 'discover' });
                  }}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Discover Communities
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;