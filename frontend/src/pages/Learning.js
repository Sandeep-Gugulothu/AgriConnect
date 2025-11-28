import React, { useState, useEffect } from 'react';

const Learning = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mixedContent, setMixedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchContent();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  // Helper function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoUrl) => {
    const videoId = getYouTubeVideoId(videoUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const fetchContent = async () => {    
    try {
      setLoading(true);
  
      // Curated agriculture learning videos (English, India-focused)
      const demoVideos = [
        {
          id: '1',
          type: 'video',
          title: 'How to Start Organic Farming in India',
          description:
            'Step-by-step basics of starting an organic farming business in India, including investment, training, and government schemes. [web:37]',
          duration: '9:27',
          views: '100K+',
          likes: 0,
          author: 'Organic Farming India',
          verified: true,
          videoUrl: 'https://www.youtube.com/embed/VzTwZjr6_So'
        },
        {
          id: '2',
          type: 'video',
          title: 'Smart Irrigation Systems for Indian Farms',
          description:
            'Overview of IoT-based smart irrigation systems that save water, reduce labour, and improve crop yields for Indian farmers. [web:44]',
          duration: '10:00',
          views: '50K+',
          likes: 0,
          author: 'Smart Irrigation Project',
          verified: true,
          videoUrl: 'https://www.youtube.com/embed/zfzP9Q-N_jg'
        },
        {
          id: '3',
          type: 'video',
          title: 'Beginner’s Guide to Organic Vegetable Farming',
          description:
            'Practical guide to starting an organic vegetable garden or small farm, covering soil preparation, manure, and crop selection. [web:38]',
          duration: '50:40',
          views: '200K+',
          likes: 0,
          author: 'Good Food Movement',
          verified: true,
          videoUrl: 'https://www.youtube.com/embed/yfcLpFLM5Ew'
        },
        {
          id: '4',
          type: 'video',
          title: 'Organic Farming Explained: Benefits & Techniques',
          description:
            'Short explainer on organic farming principles, key techniques, and why it is profitable and sustainable for Indian farmers. [web:43]',
          duration: '6:10',
          views: '300K+',
          likes: 0,
          author: 'Krishi Jagran Business',
          verified: true,
          videoUrl: 'https://www.youtube.com/embed/K6PCFo1DR8U'
        },
        {
          id: '5',
          type: 'video',
          title: 'Earn ₹4.6 Lakh in 50 Days from One Vegetable',
          description:
            'Case study style video showing how a farmer earns lakhs from a high-value vegetable crop using modern practices. [web:45]',
          duration: '19:58',
          views: '220K+',
          likes: 0,
          author: 'Indian Farmer',
          verified: true,
          videoUrl: 'https://www.youtube.com/embed/IMYCnvYH6hY'
        },
        {
          id: '6',
          type: 'video',
          title: 'We Grow Organic Fruits and Vegetables – 100% Healthy',
          description:
            'Experiment-style video documenting a family growing fruits and vegetables organically without any chemicals or pesticides. [web:54]',
          duration: '16:00',
          views: '150K+',
          likes: 0,
          author: 'Organic Farming Experiment',
          verified: false,
          videoUrl: 'https://www.youtube.com/embed/BNptH6EmNDM'
        },
        {
          id: '7',
          type: 'video',
          title: 'Low Investment Vegetable Nursery Farming Business',
          description:
            'Profitable vegetable nursery model explaining investment, setup and income potential for Indian farmers. [web:33][web:59]',
          duration: '18:30',
          views: '180K+',
          likes: 0,
          author: 'Farmer Success Stories',
          verified: true,
          videoUrl: 'https://www.youtube.com/embed/lfhBFrR9ENI'
        },
        {
          id: 'ad-1',
          type: 'ad',
          title: 'Premium Seeds - 25% Off',
          company: 'AgriSupply Co.',
          thumbnail: '🌱',
          description: 'High-yield certified seeds for better harvest'
        }
      ];
      
      // Add thumbnail URLs to video items
      const videosWithThumbnails = demoVideos.map(item => {
        if (item.type === 'video') {
          return {
            ...item,
            thumbnail: getYouTubeThumbnail(item.videoUrl)
          };
        }
        return item;
      });
      
      setMixedContent(videosWithThumbnails);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoLike = (videoId) => {
    setMixedContent(mixedContent.map(item => 
      item.id === videoId 
        ? { ...item, likes: item.likes + 1 }
        : item
    ));
  };

  const filteredContent = mixedContent.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContentCard = (item) => {
    const cardStyle = {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      height: 'fit-content'
    };

    if (item.type === 'video') {
      return (
        <div key={item.id} style={cardStyle}
          onClick={() => setSelectedVideo(item)}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          {/* Video Thumbnail */}
          <div style={{ 
            position: 'relative', 
            backgroundColor: '#f1f5f9', 
            height: isMobile ? '200px' : '180px', 
            overflow: 'hidden'
          }}>
            {item.thumbnail ? (
              <img 
                src={item.thumbnail}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div style={{
              display: item.thumbnail ? 'none' : 'flex',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              fontSize: isMobile ? '3rem' : '2.5rem'
            }}>
              🎥
            </div>
            
            {/* Play Button Overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '3rem',
              height: '3rem',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem'
            }}>
              ▶️
            </div>
            
            {/* Duration */}
            <div style={{
              position: 'absolute',
              bottom: '0.5rem',
              right: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              {item.duration}
            </div>
            
            {/* Verified Badge */}
            {item.verified && (
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                backgroundColor: '#059669',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                ✓ VERIFIED
              </div>
            )}
          </div>
          
          {/* Video Info */}
          <div style={{ padding: isMobile ? '1rem' : '0.875rem' }}>
            {/* Author Info */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                backgroundColor: '#059669',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.5rem'
              }}>
                <span style={{ color: 'white', fontSize: '0.625rem', fontWeight: 'bold' }}>
                  {item.author.charAt(0)}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                {item.author}
              </span>
              {item.verified && (
                <span style={{ marginLeft: '0.25rem', color: '#059669', fontSize: '0.75rem' }}>✓</span>
              )}
            </div>
            
            {/* Title */}
            <h3 style={{
              fontSize: isMobile ? '0.875rem' : '0.8rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 0.5rem',
              lineHeight: '1.3',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {item.title}
            </h3>
            
            {/* Description */}
            <p style={{
              fontSize: '0.75rem',
              color: '#64748b',
              margin: '0 0 0.75rem',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {item.description}
            </p>
            
            {/* Stats & Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
              color: '#64748b'
            }}>
              <span>{item.views} views</span>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoLike(item.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem'
                  }}
                >
                  ❤️ {item.likes}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVideo(item);
                  }}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                  Watch
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (item.type === 'ad') {
      return (
        <div key={item.id} style={{
          ...cardStyle,
          border: '1px solid #fbbf24'
        }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          <div style={{
            position: 'relative',
            backgroundColor: '#fef3c7',
            height: isMobile ? '200px' : '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
          }}>
            <span style={{ fontSize: isMobile ? '3rem' : '2.5rem' }}>{item.thumbnail}</span>
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              SPONSORED
            </div>
          </div>
          <div style={{ padding: isMobile ? '1rem' : '0.875rem' }}>
            <h3 style={{
              fontSize: isMobile ? '0.875rem' : '0.8rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 0.25rem',
              lineHeight: '1.3'
            }}>
              {item.title}
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: '#92400e',
              margin: '0 0 0.75rem',
              fontWeight: '500'
            }}>
              by {item.company}
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: '#64748b',
              margin: '0 0 0.75rem',
              lineHeight: '1.4'
            }}>
              {item.description}
            </p>
            <button style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              width: '100%'
            }}>
              Learn More
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Video Modal */}
      {selectedVideo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            maxWidth: '56rem',
            width: '100%',
            maxHeight: '90vh'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
                {selectedVideo.title}
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
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
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={selectedVideo.videoUrl}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
                title={selectedVideo.title}
              />
            </div>
          </div>
        </div>
      )}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem' }}>
        
        {/* Search Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ position: 'relative', maxWidth: '32rem', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="Search for farming tips, courses, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                backgroundColor: 'white',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '1rem' }}>
              🔍
            </div>
          </div>
        </div>

        {/* Mixed Content Feed */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌾</div>
            <p style={{ color: '#64748b' }}>Loading content...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : 'repeat(3, 1fr)',
            gap: isMobile ? '1rem' : '1.5rem',
            maxWidth: isMobile ? '100%' : '1200px',
            margin: '0 auto'
          }}>
            {filteredContent.map((item) => renderContentCard(item))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredContent.length === 0 && searchQuery && (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No results found</h3>
            <p style={{ color: '#64748b' }}>Try searching for different keywords or topics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;