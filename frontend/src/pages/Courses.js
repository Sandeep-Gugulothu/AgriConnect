import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Chip, Box } from '@mui/material';
import { School, AccessTime } from '@mui/icons-material';
import { courseAPI } from '../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const sampleCourses = [
    {
      _id: '1',
      title: 'Modern Farming Techniques',
      description: 'Learn about sustainable and efficient farming methods',
      category: 'farming',
      level: 'beginner',
      duration: 120,
      enrollments: 45
    },
    {
      _id: '2',
      title: 'Financial Literacy for Farmers',
      description: 'Understand banking, loans, and financial planning',
      category: 'finance',
      level: 'intermediate',
      duration: 90,
      enrollments: 32
    },
    {
      _id: '3',
      title: 'Digital Marketing for Agriculture',
      description: 'Sell your products online and reach more customers',
      category: 'marketing',
      level: 'advanced',
      duration: 150,
      enrollments: 28
    }
  ];

  const displayCourses = courses.length > 0 ? courses : sampleCourses;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Courses
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Enhance your skills with our educational programs
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {displayCourses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <School sx={{ mr: 1, color: 'primary.main' }} />
                  <Chip 
                    label={course.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {course.description}
                </Typography>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <AccessTime sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.duration} minutes
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip 
                    label={course.level} 
                    size="small" 
                    color={course.level === 'beginner' ? 'success' : course.level === 'intermediate' ? 'warning' : 'error'}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {course.enrollments} enrolled
                  </Typography>
                </Box>
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <Button variant="contained" fullWidth>
                  Enroll Now
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Courses;