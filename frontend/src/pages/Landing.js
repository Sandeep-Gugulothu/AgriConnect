import React, { useState, useCallback } from 'react';

const DemoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(17, 24, 39, 0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)', maxWidth: '28rem', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '4rem', height: '4rem', backgroundColor: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <span style={{ fontSize: '2rem' }}>🌾</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Join Our Community!</h3>
          <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
            Connect with thousands of farmers sharing their success stories and growing tips.
          </p>
          <button
            onClick={onClose}
            style={{ width: '100%', backgroundColor: '#059669', color: 'white', fontWeight: '600', padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <DemoModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Navigation */}
      <nav style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '2rem', height: '2rem', backgroundColor: '#059669', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>AC</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>Agri-Connect</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <a href="#community" style={{ color: '#64748b', fontWeight: '500', textDecoration: 'none' }}>Community</a>
              <a href="#achievements" style={{ color: '#64748b', fontWeight: '500', textDecoration: 'none' }}>Success Stories</a>
              <a href="#connect" style={{ color: '#64748b', fontWeight: '500', textDecoration: 'none' }}>Connect</a>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <a href="/login" style={{ color: '#64748b', fontWeight: '500', textDecoration: 'none' }}>Sign In</a>
              <a href="/register" style={{ backgroundColor: '#059669', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none' }}>
                Join Community
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', paddingTop: '4rem', paddingBottom: '5rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 50%, #f0f9ff 100%)' }}></div>
        
        <div style={{ position: 'relative', maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#d1fae5', color: '#065f46', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1.5rem' }}>
              <span style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '0.5rem' }}></span>
              Where farmers share, learn, and grow together
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 'bold', color: '#0f172a', marginBottom: '1.5rem', lineHeight: '1.1' }}>
              Share Your Farm Journey.
              <span style={{ display: 'block', color: '#059669' }}>Connect with Fellow Farmers.</span>
            </h1>
            
            <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '2rem', maxWidth: '48rem', margin: '0 auto 2rem' }}>
              Join thousands of farmers sharing their crop achievements, farming tips, and success stories. Learn from your community and grow together.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem' }}>
              <a href="/register" style={{ backgroundColor: '#059669', color: 'white', padding: '1rem 2rem', borderRadius: '0.75rem', fontWeight: '600', fontSize: '1.125rem', textDecoration: 'none', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}>
                Join the Community
              </a>
              <button 
                onClick={openModal}
                style={{ backgroundColor: 'white', color: '#374151', padding: '1rem 2rem', borderRadius: '0.75rem', fontWeight: '600', fontSize: '1.125rem', border: '1px solid #e5e7eb', cursor: 'pointer' }}
              >
                See Success Stories
              </button>
            </div>
          </div>

          {/* Community Feed Preview */}
          <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              
              {/* Feed Header */}
              <div style={{ backgroundColor: '#0f172a', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#fff', fontSize: '1rem', fontWeight: '600' }}>🌾 Community Feed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Live Updates</span>
                   <span style={{ color: '#10b981', fontSize: '1.25rem' }}>●</span>
                </div>
              </div>
              
              {/* Feed Content */}
              <div style={{ padding: '1.5rem', height: '24rem', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Post 1: Farmer Achievement */}
                  <div style={{ padding: '1rem', border: '1px solid #d1fae5', borderRadius: '0.75rem', backgroundColor: '#ecfdf5', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
                          <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>RK</span>
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 'bold', color: '#065f46', fontSize: '1rem', margin: 0 }}>Rajesh Kumar</h4>
                          <p style={{ color: '#10b981', fontSize: '0.875rem', margin: 0 }}>Farmer • Punjab • 2 hours ago</p>
                        </div>
                    </div>
                    <p style={{ color: '#10b981', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                        🎉 Just harvested 45 quintals of wheat from 2 acres! Used organic fertilizer and drip irrigation. My best yield yet! Thanks to tips from @ManojSingh about soil preparation. 
                        <br/><br/>
                        <strong>💡 Key learnings:</strong> Early morning watering + compost made all the difference. Happy to share more details!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.875rem', color: '#059669' }}>
                      <span>👍 24 likes</span>
                      <span>💬 8 comments</span>
                      <span>🔄 3 shares</span>
                    </div>
                  </div>
                  
                  {/* Post 2: Question/Help */}
                  <div style={{ padding: '1rem', border: '1px solid #bfdbfe', borderRadius: '0.75rem', backgroundColor: '#eff6ff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
                          <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>PS</span>
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 'bold', color: '#1e40af', fontSize: '1rem', margin: 0 }}>Priya Sharma</h4>
                          <p style={{ color: '#3b82f6', fontSize: '0.875rem', margin: 0 }}>New Farmer • Maharashtra • 4 hours ago</p>
                        </div>
                    </div>
                    <p style={{ color: '#3b82f6', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                        🤔 Need advice: Planning to start tomato farming on 1 acre. What's the best variety for Maharashtra climate? Also looking for reliable seed suppliers in Pune area.
                        <br/><br/>
                        Any experienced tomato farmers here? Would love to connect! 🍅
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.875rem', color: '#3b82f6' }}>
                      <span>👍 12 likes</span>
                      <span>💬 15 comments</span>
                      <span>🔄 2 shares</span>
                    </div>
                  </div>
                  
                  {/* Post 3: Market Update */}
                  <div style={{ padding: '1rem', border: '1px solid #fef3c7', borderRadius: '0.75rem', backgroundColor: '#fffbeb', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
                          <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>AM</span>
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 'bold', color: '#924003', fontSize: '1rem', margin: 0 }}>Amit Mehta</h4>
                          <p style={{ color: '#f59e0b', fontSize: '0.875rem', margin: 0 }}>Market Expert • Delhi • 6 hours ago</p>
                        </div>
                    </div>
                    <p style={{ color: '#f59e0b', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                        📈 <strong>Market Update:</strong> Onion prices up 15% this week in Delhi mandi. Good time for farmers with ready stock to sell. 
                        <br/><br/>
                        🌧️ Monsoon forecast looks good for next month - expect vegetable prices to stabilize. Plan your sowing accordingly!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.875rem', color: '#f59e0b' }}>
                      <span>👍 31 likes</span>
                      <span>💬 12 comments</span>
                      <span>🔄 8 shares</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section id="community" style={{ padding: '5rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>
              Connect, Share, and Grow Together
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '48rem', margin: '0 auto' }}>
              Join a community where every farmer's experience matters and knowledge flows freely.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              {
                icon: '📸',
                title: 'Share Your Harvest',
                description: 'Post photos of your crops, share yield numbers, and celebrate your farming achievements with the community.'
              },
              {
                icon: '🤝',
                title: 'Get Expert Advice',
                description: 'Ask questions and get answers from experienced farmers in your region. Real solutions from real farmers.'
              },
              {
                icon: '💰',
                title: 'Market Intelligence',
                description: 'Stay updated with local market prices, demand trends, and the best times to sell your produce.'
              }
            ].map((feature, index) => (
              <div key={index} style={{ backgroundColor: '#f8fafc', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ width: '3rem', height: '3rem', backgroundColor: '#d1fae5', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{feature.icon}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#059669' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { number: '25K+', label: 'Active Farmers' },
              { number: '1.2M+', label: 'Posts Shared' },
              { number: '500+', label: 'Villages Connected' },
              { number: '98%', label: 'Helpful Responses' }
            ].map((stat, index) => (
              <div key={index}>
                <div style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>{stat.number}</div>
                <div style={{ color: '#a7f3d0' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 0', backgroundColor: '#0f172a', color: 'white' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '2rem', height: '2rem', backgroundColor: '#059669', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>AC</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Agri-Connect</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', color: '#9ca3af' }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #374151' }}>
            © {new Date().getFullYear()} Agri-Connect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;