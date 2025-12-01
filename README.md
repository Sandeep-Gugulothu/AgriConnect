# AgriConnect - Agricultural Digital Ecosystem

> **A comprehensive platform connecting farmers, entrepreneurs, and agricultural communities with AI-powered insights and collaborative tools.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://your-app.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=flat-square)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square)](https://mongodb.com/)

## Features

### **AI Farm Management Agent**
- **Intelligent Crop Advisor**: AI-powered recommendations for planting, fertilizing, and harvesting
- **Smart Decision Engine**: Analyzes weather, soil, and market data for optimal farming decisions
- **Automated Task Planning**: AI generates personalized farming schedules and reminders
- **Predictive Analytics**: Yield forecasting and risk assessment using machine learning
- **Natural Language Interface**: Chat with AI agent for instant farming advice

### **Comprehensive Field Management**
- **Interactive Crop Dashboard**: Visual progress tracking with growth timelines
- **Smart Task Management**: AI-suggested tasks with completion tracking
- **Financial Analytics**: Expense monitoring, profit calculations, and budget optimization
- **Weather Integration**: Real-time weather data and farming recommendations
- **Photo Documentation**: Progress tracking with AI-powered crop health analysis
- **Yield Prediction**: Advanced algorithms for harvest planning

### **Agricultural Communities**
- Active communities across crops, locations, and farming interests
- Real-time discussions and knowledge sharing
- Expert-led forums and peer-to-peer learning
- Community-driven problem solving

### **Secure Platform**
- JWT-based authentication with role management
- Professional farmer and entrepreneur profiles
- Secure data handling and privacy protection

### **Learning & Resources**
- AI-curated educational content
- Video tutorials and expert guidance
- Market insights and price analysis
- Best practices and farming techniques

## Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas account
- Git for version control

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agri-connect-platform.git
   cd agri-connect-platform
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "MONGODB_URI=mongodb://localhost:27017/agri-connect" > .env
   echo "JWT_SECRET=agri-connect-super-secret-jwt-key-2024" >> .env
   echo "PORT=5000" >> .env
   
   # Seed communities data
   node scripts/seedCommunities.js
   
   # Start development server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## Architecture

### Tech Stack
- **Frontend**: React.js with custom styling
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **File Upload**: Multer middleware
- **Deployment**: Render (Backend + Frontend)

### Project Structure
```
agri-connect-platform/
├── backend/
│   ├── models/           # Database schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Authentication & validation
│   ├── controllers/      # Business logic
│   ├── services/         # External services
│   ├── scripts/          # Database seeding
│   └── server.js         # Express server
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application pages
│   │   ├── services/     # API integration
│   │   └── App.js        # Main application
│   └── public/           # Static assets
└── README.md
```

## Agricultural Communities

### Crop-Specific Communities
- Rice Farmers India
- Wheat Growers Network
- Sugarcane Farmers
- Tomato Farmers
- Potato Growers
- Onion Farmers
- Chili Pepper Farmers
- Fruit Growers

### Specialized Farming
- Organic Farmers India
- Dairy Farmers Network
- Poultry Farmers
- Smart Farming Tech

### Regional Networks
- Farmers of Punjab
- Farmers of Uttar Pradesh
- Farmers of Maharashtra

## Deployment

### Deploy to Render (Free)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Setup MongoDB Atlas**
   - Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Get connection string
   - Whitelist all IPs (0.0.0.0/0)

3. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Connect GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri-connect
     JWT_SECRET=agri-connect-super-secret-jwt-key-2024
     NODE_ENV=production
     ```

4. **Access your live app**
   - Your app will be available at: `https://your-app-name.onrender.com`

## Usage Guide

### For Farmers
1. **AI Farm Assistant** - Chat with AI agent for personalized farming advice
2. **Field Management** - Track crops, tasks, expenses, and progress with AI insights
3. **Smart Planning** - Get AI-generated farming schedules and recommendations
4. **Community Learning** - Connect with peers and access expert knowledge
5. **Market Intelligence** - Receive AI-powered market analysis and pricing insights

### For Entrepreneurs
1. **Market Opportunities** - Discover investment opportunities in agriculture
2. **Network Building** - Connect with farmers and agricultural businesses
3. **Data Insights** - Access aggregated farming data and trends
4. **Partnership Development** - Build strategic agricultural partnerships

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Communities
- `GET /api/communities` - List all communities
- `POST /api/communities/join/:id` - Join community
- `DELETE /api/communities/leave/:id` - Leave community

### Posts
- `GET /api/posts/:communityId` - Get community posts
- `POST /api/posts` - Create new post
- `DELETE /api/posts/:id` - Delete post

### AI Agent & Fields
- `POST /api/ai-agent/advice` - Get AI farming recommendations
- `POST /api/ai-agent/analyze` - Analyze crop data with AI
- `GET /api/fields` - Get user fields with AI insights
- `POST /api/fields` - Create new field
- `PUT /api/fields/:id` - Update field
- `GET /api/execution/tasks` - Get AI-generated tasks

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Agricultural communities for inspiration
- Open source community for tools and libraries
- MongoDB Atlas for free database hosting
- Render for free deployment platform

---

**Built with love for the farming community**

*Empowering agriculture through technology and community collaboration*