import React, { useState, useRef, useEffect } from 'react';
import '../styles/animations.css';

const AIAgent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'agent',
      content: "🌾 Hello! I'm your Agricultural AI Agent. I can help you with crop recommendations, cultivation planning, disease management, and farming guidance. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowQuickQuestions(false);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/ai-agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: inputMessage })
      });

      const data = await response.json();
      
      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: data.response || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        source: data.source || 'unknown',
        processingTime: data.processingTime || 'normal'
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: 'Sorry, I encountered an error connecting to the server. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What crop should I grow on 2 acres of clay soil?",
    "How to prepare paddy nursery step by step?",
    "Best fertilizer schedule for wheat cultivation?",
    "Common diseases in tomato farming and treatment?",
    "Current market prices for rice varieties?",
    "Organic farming techniques for beginners?",
    "Drip irrigation setup cost and benefits?",
    "Soil testing procedure and interpretation?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setShowQuickQuestions(false);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '85vh', display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
          
          {/* Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '3rem', height: '3rem', backgroundColor: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 8.5c0-.83-.67-1.5-1.5-1.5S15 9.67 15 10.5s.67 1.5 1.5 1.5S18 11.33 18 10.5zM7.5 9C6.67 9 6 9.67 6 10.5S6.67 12 7.5 12 9 11.33 9 10.5 8.33 9 7.5 9zm12.5 3.5c0 2.33-1.67 4.5-4 4.5h-8c-2.33 0-4-2.17-4-4.5V9c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v3.5z"/>
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Agricultural AI Agent
                </h1>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>
                  Your intelligent farming companion
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '1rem 1.25rem',
                    borderRadius: message.type === 'user' ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                    backgroundColor: message.type === 'user' ? '#059669' : '#ffffff',
                    color: message.type === 'user' ? 'white' : '#1f2937',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                    border: message.type === 'agent' ? '1px solid #e5e7eb' : 'none',
                    boxShadow: message.type === 'agent' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(5,150,105,0.2)',
                    position: 'relative'
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {message.content.split('\n').map((line, index) => {
                      // Handle bold text **text**
                      if (line.includes('**')) {
                        const parts = line.split(/\*\*(.*?)\*\*/g);
                        return (
                          <div key={index} style={{ marginBottom: index < message.content.split('\n').length - 1 ? '0.5rem' : 0 }}>
                            {parts.map((part, partIndex) => 
                              partIndex % 2 === 1 ? 
                                <strong key={partIndex} style={{ fontWeight: '600', color: message.type === 'user' ? 'white' : '#059669' }}>{part}</strong> : 
                                part
                            )}
                          </div>
                        );
                      }
                      // Handle bullet points
                      if (line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim())) {
                        return (
                          <div key={index} style={{ 
                            marginLeft: '1rem', 
                            marginBottom: '0.25rem',
                            position: 'relative'
                          }}>
                            {line.trim().startsWith('-') || line.trim().startsWith('•') ? 
                              <span style={{ position: 'absolute', left: '-1rem', color: '#059669' }}>•</span> : null
                            }
                            {line.replace(/^[\s\-•\d\.]+/, '')}
                          </div>
                        );
                      }
                      // Regular lines
                      return line.trim() ? (
                        <div key={index} style={{ marginBottom: index < message.content.split('\n').length - 1 ? '0.5rem' : 0 }}>
                          {line}
                        </div>
                      ) : (
                        <div key={index} style={{ height: '0.5rem' }} />
                      );
                    })}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    opacity: 0.8, 
                    marginTop: '0.75rem',
                    color: message.type === 'user' ? 'rgba(255,255,255,0.8)' : '#6b7280',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: message.type === 'agent' ? '1px solid #f3f4f6' : 'none',
                    paddingTop: message.type === 'agent' ? '0.5rem' : '0'
                  }}>
                    <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {message.source && message.type === 'agent' && (
                      <span style={{ 
                        fontSize: '0.65rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: message.source === 'gemini' ? '#4285f4' : '#059669',
                        color: 'white',
                        borderRadius: '1rem',
                        textTransform: 'uppercase',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        {message.source === 'gemini' ? (
                          <>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            AI Powered
                          </>
                        ) : (
                          <>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                            </svg>
                            Instant
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  maxWidth: '70%'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ 
                      width: '2rem', 
                      height: '2rem', 
                      backgroundColor: '#059669', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 8.5c0-.83-.67-1.5-1.5-1.5S15 9.67 15 10.5s.67 1.5 1.5 1.5S18 11.33 18 10.5zM7.5 9C6.67 9 6 9.67 6 10.5S6.67 12 7.5 12 9 11.33 9 10.5 8.33 9 7.5 9zm12.5 3.5c0 2.33-1.67 4.5-4 4.5h-8c-2.33 0-4-2.17-4-4.5V9c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v3.5z"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>AI is thinking...</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#059669', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                    <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#059669', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.5s' }}></div>
                    <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#059669', borderRadius: '50%', animation: 'pulse 1.5s infinite 1s' }}></div>
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Analyzing your query</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - Only show initially */}
          {showQuickQuestions && (
            <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669">
                  <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                </svg>
                <p style={{ fontSize: '0.8rem', color: '#059669', margin: 0, fontWeight: '500' }}>Quick Questions:</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      flexShrink: 0
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#f0fdf4';
                      e.target.style.borderColor = '#059669';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#059669">
                      <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                    </svg>
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div style={{ padding: '1rem', borderTop: showQuickQuestions ? 'none' : '1px solid #e5e7eb' }}>
            {/* Input */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about farming - crop recommendations, disease diagnosis, market prices..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    resize: 'none',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0.5rem',
                  right: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>
                  {inputMessage.length}/500
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: inputMessage.trim() && !isLoading ? '#059669' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '1rem',
                  cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '100px',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  if (inputMessage.trim() && !isLoading) {
                    e.target.style.backgroundColor = '#047857';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (inputMessage.trim() && !isLoading) {
                    e.target.style.backgroundColor = '#059669';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{ width: '1rem', height: '1rem', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                    </svg>
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;