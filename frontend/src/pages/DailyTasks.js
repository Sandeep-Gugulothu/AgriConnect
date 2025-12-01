import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DailyTasks = () => {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const [dailyGuidance, setDailyGuidance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  useEffect(() => {
    fetchDailyTasks();
  }, [cropId]);

  const fetchDailyTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/execution/daily-tasks/${cropId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDailyGuidance(data.data);
      }
    } catch (error) {
      console.error('Error fetching daily tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId, completed) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/execution/complete-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cropId, taskId, completed })
      });

      if (completed) {
        setCompletedTasks(prev => new Set([...prev, taskId]));
      } else {
        setCompletedTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      default: return '#059669';
    }
  };

  const getTaskIcon = (type) => {
    const icons = {
      inspection: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
        </svg>
      ),
      fertilizer: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A2,2 0 0,1 14,4V8A2,2 0 0,1 12,10A2,2 0 0,1 10,8V4A2,2 0 0,1 12,2M21,9V7L15,10L13,9V7H11V9L9,10L3,7V9L9,12L11,13V15H13V13L15,12L21,9Z"/>
        </svg>
      ),
      irrigation: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97L14.47,9.97Z"/>
        </svg>
      ),
      pest_control: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
        </svg>
      ),
      default: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A2,2 0 0,1 14,4C14,5.5 13.2,6.77 12,7.46V16H15V18H9V16H12V7.46C10.8,6.77 10,5.5 10,4A2,2 0 0,1 12,2Z"/>
        </svg>
      )
    };
    return icons[type] || icons.default;
  };

  const getAlertIcon = (type) => {
    const icons = {
      weather: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47Z"/>
        </svg>
      ),
      pest: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,10L13,9V7H11V9L9,10L3,7V9L9,12L11,13V15H13V13L15,12L21,9Z"/>
        </svg>
      ),
      disease: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2C6.48,2 2,6.48 2,12S6.48,22 12,22S22,17.52 22,12S17.52,2 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z"/>
        </svg>
      )
    };
    return icons[type] || icons.weather;
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading daily tasks...</div>
      </div>
    );
  }

  if (!dailyGuidance) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>No tasks available</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 0' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/fields')}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Daily Tasks - {dailyGuidance.crop}
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Day {dailyGuidance.day} • {dailyGuidance.phase} Phase
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* Main Tasks */}
          <div>
            {/* Today's Tasks */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Today's Tasks ({dailyGuidance.tasks.length})
              </h2>
              
              {dailyGuidance.tasks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {dailyGuidance.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        padding: '1rem', 
                        border: `2px solid ${getPriorityColor(task.priority)}20`,
                        borderRadius: '0.5rem',
                        backgroundColor: completedTasks.has(task.id) ? '#f0fdf4' : 'white',
                        opacity: completedTasks.has(task.id) ? 0.8 : 1
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedTasks.has(task.id)}
                        onChange={(e) => handleTaskComplete(task.id, e.target.checked)}
                        style={{ 
                          width: '1.25rem', 
                          height: '1.25rem', 
                          cursor: 'pointer',
                          accentColor: '#059669'
                        }}
                      />
                      
                      <div style={{ color: getPriorityColor(task.priority) }}>
                        {getTaskIcon(task.type)}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '1rem', 
                          fontWeight: '500', 
                          color: '#1f2937',
                          textDecoration: completedTasks.has(task.id) ? 'line-through' : 'none'
                        }}>
                          {task.task}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>
                          {task.priority} priority • {task.type.replace('_', ' ')}
                        </div>
                      </div>
                      
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: getPriorityColor(task.priority),
                        color: 'white'
                      }}>
                        {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ marginBottom: '1rem' }}>
                    <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z"/>
                  </svg>
                  <p>No specific tasks for today. General field monitoring recommended.</p>
                </div>
              )}
            </div>

            {/* Alerts */}
            {dailyGuidance.alerts.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                  Active Alerts ({dailyGuidance.alerts.length})
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {dailyGuidance.alerts.map((alert, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: alert.severity === 'high' ? '#fef2f2' : '#fef3c7',
                        border: `1px solid ${alert.severity === 'high' ? '#fecaca' : '#fde68a'}`
                      }}
                    >
                      <div style={{ color: alert.severity === 'high' ? '#dc2626' : '#d97706' }}>
                        {getAlertIcon(alert.type)}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '1rem', 
                          fontWeight: '500', 
                          color: alert.severity === 'high' ? '#dc2626' : '#d97706',
                          marginBottom: '0.25rem'
                        }}>
                          {alert.message}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Action: {alert.action}
                        </div>
                      </div>
                      
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: alert.severity === 'high' ? '#dc2626' : '#d97706',
                        color: 'white',
                        textTransform: 'uppercase'
                      }}>
                        {alert.severity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Progress Summary */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Progress Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Current Phase</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{dailyGuidance.phase}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Day</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{dailyGuidance.day}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tasks Today</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{dailyGuidance.tasks.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Milestone */}
            {dailyGuidance.nextMilestone && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Next Milestone</h3>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.5rem' }}>
                    {dailyGuidance.nextMilestone.daysRemaining}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    days until
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937' }}>
                    {dailyGuidance.nextMilestone.phase}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Actions</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  onClick={() => navigate('/ai-agent')}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Ask AI Agent
                </button>
                <button 
                  onClick={() => navigate(`/crop/${cropId}`)}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  View Crop Details
                </button>
                <button style={{
                  padding: '0.75rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}>
                  Check Weather
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;