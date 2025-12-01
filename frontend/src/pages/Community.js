import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Community = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [joinedCommunityIds, setJoinedCommunityIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [posts, setPosts] = useState([]);
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [postsLoading, setPostsLoading] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showPostMenu, setShowPostMenu] = useState({});

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
      ),
      heart: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
        </svg>
      ),
      comment: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z"/>
        </svg>
      ),
      share: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z"/>
        </svg>
      ),
      delete: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
        </svg>
      ),
      menu: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
        </svg>
      ),
      camera: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
        </svg>
      )
    };
    return icons[iconType] || icons.community;
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchMyCommunities();
      await fetchCommunities();
    };
    loadData();
  }, []);
  
  useEffect(() => {
    if (activeTab === 'my-communities') {
      fetchMyCommunities();
    }
  }, [activeTab]);

  useEffect(() => {
    // Update URL when tab changes
    setSearchParams({ tab: activeTab });
    
    if (activeTab === 'feed') {
      fetchFeed();
    } else if (activeTab === 'discover') {
      fetchCommunities();
    }
  }, [activeTab, setSearchParams]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowPostMenu({});
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const autoJoinCommunities = async () => {
    // Disabled for now
  };

  const fetchCommunities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/communities/all`);
      setCommunities(response.data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCommunities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMyCommunities([]);
        setJoinedCommunityIds(new Set());
        return;
      }
      
      const response = await axios.get('http://localhost:5000/api/communities/my-communities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const communities = response.data || [];
      const communityIds = communities.map(c => c._id);
      
      setMyCommunities(communities);
      setJoinedCommunityIds(new Set(communityIds));
      
    } catch (error) {
      setMyCommunities([]);
      setJoinedCommunityIds(new Set());
    }
  };

  const handleJoinCommunity = async (communityId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to join communities');
      return;
    }
    
    // Optimistic update
    setJoinedCommunityIds(prev => new Set([...prev, communityId]));
    setCommunities(prev => prev.map(c => 
      c._id === communityId ? { ...c, memberCount: c.memberCount + 1 } : c
    ));
    
    try {
      const response = await axios.post(`http://localhost:5000/api/communities/${communityId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Add to myCommunities
      const joinedCommunity = communities.find(c => c._id === communityId);
      if (joinedCommunity) {
        setMyCommunities(prev => [...prev, joinedCommunity]);
      }
      
    } catch (error) {
      console.error('Join community error:', error);
      // Revert optimistic update
      setJoinedCommunityIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(communityId);
        return newSet;
      });
      setCommunities(prev => prev.map(c => 
        c._id === communityId ? { ...c, memberCount: c.memberCount - 1 } : c
      ));
      
      const errorMsg = error.response?.data?.message || 'Failed to join community';
      alert(errorMsg);
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      await axios.post(`http://localhost:5000/api/communities/${communityId}/leave`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchMyCommunities();
      
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

  const handleCreatePost = async () => {
    if (!newPost.trim() || selectedCommunities.length === 0) return;
    
    try {
      const promises = selectedCommunities.map(async (communityId) => {
        const formData = new FormData();
        formData.append('content', newPost);
        formData.append('communityId', communityId);
        
        selectedImages.forEach((image, index) => {
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
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
        content: commentText
      }, {
        headers: { Authorization: `Bearer ${token}` }
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

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.status === 200) {
        setPosts(posts.filter(post => post._id !== postId));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setDeleteConfirm(null);
      alert(error.response?.data?.message || 'Failed to delete post');
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
    if (!count && count !== 0) return '0';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleCommunityClick = (community) => {
    navigate(`/community/${community._id}`);
  };

  const renderCommunityCard = (community, showJoinButton = true) => {
    const isJoined = joinedCommunityIds.has(community._id);
    
    return (
      <div key={community._id} style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
        onClick={() => handleCommunityClick(community)}
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
          
          {showJoinButton && !isJoined && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleJoinCommunity(community._id);
              }}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
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
  };

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
                
                {/* Image Upload */}
                <div style={{ marginTop: '1rem' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                    id="image-upload-feed"
                  />
                  <label
                    htmlFor="image-upload-feed"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      color: '#374151'
                    }}
                  >
                    {getIcon('camera')} Add Photos
                  </label>
                  
                  {/* Selected Images Preview */}
                  {selectedImages.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
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
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Post to communities:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {myCommunities.map(community => (
                      <button
                        key={community._id}
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
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.trim() || selectedCommunities.length === 0}
                      style={{
                        backgroundColor: (!newPost.trim() || selectedCommunities.length === 0) ? '#9ca3af' : '#059669',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        border: 'none',
                        cursor: (!newPost.trim() || selectedCommunities.length === 0) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Post to {selectedCommunities.length} {selectedCommunities.length === 1 ? 'community' : 'communities'}
                    </button>
                  </div>
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
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
                        <div>
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
                      
                      {/* Menu Button - Only show for post author */}
                      {post.author._id === JSON.parse(localStorage.getItem('user') || '{}')._id && (
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPostMenu({ ...showPostMenu, [post._id]: !showPostMenu[post._id] });
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              borderRadius: '0.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {getIcon('menu')}
                          </button>
                          
                          {/* Dropdown Menu */}
                          {showPostMenu[post._id] && (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                zIndex: 10,
                                minWidth: '120px'
                              }}>
                              <button
                                onClick={() => {
                                  setDeleteConfirm(post._id);
                                  setShowPostMenu({ ...showPostMenu, [post._id]: false });
                                }}
                                style={{
                                  width: '100%',
                                  padding: '0.75rem 1rem',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  color: '#ef4444',
                                  fontSize: '0.875rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  borderRadius: '0.5rem'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                              >
                                {getIcon('delete')} Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Post Content */}
                    <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5', margin: '0 0 1rem' }}>
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
                        {getIcon('heart')} {post.likes.length}
                      </button>
                      <button 
                        onClick={() => toggleComments(post._id)}
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
                        {getIcon('comment')} {post.comments.length}
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
                            <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>U</span>
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
                {filteredCommunities.map(community => renderCommunityCard(community, true))}
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
                {myCommunities.map(community => renderCommunityCard(community, true))}
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
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
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
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Delete Post</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.5' }}>Are you sure you want to delete this post? This action cannot be undone.</p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
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
                onClick={() => handleDeletePost(deleteConfirm)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;