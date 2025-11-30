const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const communityRoutes = require('./routes/communities');
const postRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');
const weatherRoutes = require('./routes/weather');
const cropsRoutes = require('./routes/crops');
const marketRoutes = require('./routes/market');
const alertsRoutes = require('./routes/alerts');
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agri-connect')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    console.log('Server will continue without database...');
  });

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/crops', cropsRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/alerts', alertsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', database: 'MongoDB' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));