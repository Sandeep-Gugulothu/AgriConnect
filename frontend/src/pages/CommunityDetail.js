import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);

  const getIcon = (iconType) => {
    const icons = {
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
      camera: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
        </svg>
      )
    };
    return icons[iconType] || icons.interest;
  };

  useEffect(() => {
    fetchCommunityDetails();
    fetchPosts();
    checkMembership();
  }, [id]);

  const fetchCommunityDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/communities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommunity(response.data);
    } catch (error) {
      console.error('Error fetching community:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/posts/community/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const checkMembership = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/communities/my-communities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const joinedIds = response.data.map(c => c._id);
      setIsJoined(joinedIds.includes(id));
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  const handleJoinLeave = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isJoined ? 'leave' : 'join';
      await axios.post(`http://localhost:5000/api/communities/${id}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsJoined(!isJoined);
      fetchCommunityDetails(); // Refresh member count
    } catch (error) {
      console.error('Error joining/leaving community:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', newPost);
      formData.append('communityId', id);
      
      selectedImages.forEach((image, index) => {
        formData.append('images', image);
      });
      
      const response = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      
      setPosts([response.data, ...posts]);
      setNewPost('');
      setSelectedImages([]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
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
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
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
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
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

  const formatMemberCount = (count) => {
    if (!count && count !== 0) return '0';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading community...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Community not found</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem' }}>
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/communities')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#059669',
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Back to Communities
        </button>

        {/* Community Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon(community.type)}
              </div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: '600', margin: 0 }}>{community.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: community.type === 'crop' ? '#dbeafe' : community.type === 'location' ? '#fef3c7' : '#f3e8ff',
                    color: community.type === 'crop' ? '#1e40af' : community.type === 'location' ? '#92400e' : '#7c3aed'
                  }}>
                    {community.type === 'crop' ? 'Crop' : community.type === 'location' ? 'Location' : 'Interest'}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {formatMemberCount(community.memberCount)} members
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleJoinLeave}
              style={{
                backgroundColor: isJoined ? '#dc2626' : '#059669',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isJoined ? 'Leave Community' : 'Join Community'}
            </button>
          </div>
          
          <p style={{ fontSize: '1rem', color: '#374151', lineHeight: '1.6', margin: 0 }}>
            {community.description}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* Posts Section */}
          <div>
            {/* Create Post */}
            {isJoined && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts with the community..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
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
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
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
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    style={{
                      backgroundColor: !newPost.trim() ? '#9ca3af' : '#059669',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: !newPost.trim() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}

            {/* Posts Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {posts.length > 0 ? posts.map(post => (
                <div key={post._id} style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
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
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                          {post.author.name}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {formatTimeAgo(post.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Delete Button - Only show for post author */}
                    {post.author._id === JSON.parse(localStorage.getItem('user') || '{}')._id && (
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete post"
                      >
                        {getIcon('delete')}
                      </button>
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
                    gap: '1rem',
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
                      {isJoined && (
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
                      )}
                    </div>
                  )}
                </div>
              )) : (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  padding: '3rem',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    No posts yet
                  </h3>
                  <p style={{ color: '#64748b' }}>
                    {isJoined ? 'Be the first to share something!' : 'Join the community to see posts and discussions'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Community Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Members</span>
                  <p style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                    {formatMemberCount(community.memberCount)}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Posts</span>
                  <p style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                    {posts.length}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Type</span>
                  <p style={{ fontSize: '1rem', fontWeight: '500', margin: 0, textTransform: 'capitalize' }}>
                    {community.type} Community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating + Button */}
        {isJoined && (
          <button
            onClick={() => setShowPostModal(true)}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            +
          </button>
        )}
        
        {/* Post Modal */}
        {showPostModal && (
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
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Create Post in {community?.name}</h3>
                <button
                  onClick={() => {
                    setShowPostModal(false);
                    setNewPost('');
                    setSelectedImages([]);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  ×
                </button>
              </div>
              
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts with the community..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  marginBottom: '1rem'
                }}
              />
              
              {/* Image Upload */}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                  id="image-upload-modal"
                />
                <label
                  htmlFor="image-upload-modal"
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
                            width: '80px',
                            height: '80px',
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
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowPostModal(false);
                    setNewPost('');
                    setSelectedImages([]);
                  }}
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
                  onClick={() => {
                    handleCreatePost();
                    setShowPostModal(false);
                  }}
                  disabled={!newPost.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    backgroundColor: !newPost.trim() ? '#9ca3af' : '#059669',
                    color: 'white',
                    cursor: !newPost.trim() ? 'not-allowed' : 'pointer'
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;