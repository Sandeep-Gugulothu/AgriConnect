const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const executionAgent = require('../agents/executionAgent');

// Get daily tasks for a crop
router.get('/daily-tasks/:cropId', protect, async (req, res) => {
  try {
    const { cropId } = req.params;
    const dailyGuidance = await executionAgent.getDailyTasks(cropId, req.user.id);
    
    res.json({
      success: true,
      data: dailyGuidance,
      message: 'Daily tasks retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting daily tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get daily tasks'
    });
  }
});

// Get adaptive plan recommendations
router.post('/adapt-plan/:cropId', protect, async (req, res) => {
  try {
    const { cropId } = req.params;
    const { conditions } = req.body;
    
    const adaptations = await executionAgent.adaptPlan(cropId, req.user.id, conditions);
    
    res.json({
      success: true,
      data: adaptations,
      message: 'Plan adaptations generated successfully'
    });
  } catch (error) {
    console.error('Error adapting plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to adapt plan'
    });
  }
});

// Mark task as completed
router.post('/complete-task', protect, async (req, res) => {
  try {
    const { cropId, taskId, completed } = req.body;
    
    // Here you would update task completion in database
    // For now, just return success
    res.json({
      success: true,
      message: `Task ${completed ? 'completed' : 'uncompleted'} successfully`
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
});

// Get crop progress summary
router.get('/progress/:cropId', protect, async (req, res) => {
  try {
    const { cropId } = req.params;
    const dailyGuidance = await executionAgent.getDailyTasks(cropId, req.user.id);
    
    // Calculate progress metrics
    const progress = {
      currentDay: dailyGuidance.day,
      currentPhase: dailyGuidance.phase,
      nextMilestone: dailyGuidance.nextMilestone,
      tasksToday: dailyGuidance.tasks.length,
      alertsActive: dailyGuidance.alerts.length,
      overallProgress: Math.min((dailyGuidance.day / 120) * 100, 100) // Assuming 120-day crop cycle
    };
    
    res.json({
      success: true,
      data: progress,
      message: 'Progress summary retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get progress summary'
    });
  }
});

module.exports = router;