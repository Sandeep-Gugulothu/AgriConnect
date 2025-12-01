import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: 'home', label: 'Home', active: location.pathname === '/dashboard' },
    { path: '/fields', icon: 'field', label: 'Fields', active: location.pathname === '/fields' },
    { path: '/ai-agent', icon: 'robot', label: 'AI Agent', active: location.pathname === '/ai-agent' },
    { path: '/communities', icon: 'users', label: 'Community', active: location.pathname.startsWith('/communit') },
    { path: '/learning', icon: 'book', label: 'Learning', active: location.pathname === '/learning' }
  ];

  const getIcon = (iconName) => {
    const icons = {
      home: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ),
      users: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.01 3.01 0 0 0 16.5 6.5h-1c-.8 0-1.5.7-1.5 1.5v6c0 1.1.9 2 2 2h1v6h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
        </svg>
      ),
      book: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
        </svg>
      ),
      field: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
          <path d="M8 11h8v2H8z"/>
          <path d="M8 15h8v2H8z"/>
        </svg>
      ),
      robot: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 8.5c0-.83-.67-1.5-1.5-1.5S15 9.67 15 10.5s.67 1.5 1.5 1.5S18 11.33 18 10.5zM7.5 9C6.67 9 6 9.67 6 10.5S6.67 12 7.5 12 9 11.33 9 10.5 8.33 9 7.5 9zm12.5 3.5c0 2.33-1.67 4.5-4 4.5h-8c-2.33 0-4-2.17-4-4.5V9c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v3.5z"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  return (
    <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '3.5rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2rem', height: '2rem', backgroundColor: '#059669', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>AC</span>
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a' }}>Agri-Connect</span>
          </div>

          {/* Navigation Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  color: item.active ? '#059669' : '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: item.active ? '600' : '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => !item.active && (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseOut={(e) => !item.active && (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ marginBottom: '0.25rem' }}>{getIcon(item.icon)}</div>
                <span>{item.label}</span>
                {item.active && (
                  <div style={{ width: '100%', height: '2px', backgroundColor: '#059669', marginTop: '0.25rem', borderRadius: '1px' }}></div>
                )}
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => navigate('/profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ width: '2rem', height: '2rem', backgroundColor: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>{user.name}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;