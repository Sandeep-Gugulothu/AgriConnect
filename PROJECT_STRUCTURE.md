# AgriConnect Platform - Complete Project Structure

## Root Directory Structure

```
agri-connect-platform/
├── backend/                    # Node.js Express Server
├── frontend/                   # React.js Application
├── .gitignore                  # Git ignore rules
├── package.json                # Root package configuration for deployment
├── PROJECT_STRUCTURE.md        # This file - complete project documentation
├── README.md                   # Main project documentation
├── render.yaml                 # Render deployment configuration
└── start-mongodb.bat           # Local MongoDB startup script (Windows)
```

## Backend Directory Structure

```
backend/
├── agents/
│   └── executionAgent.js      # AI agent for task execution and planning
├── controllers/
│   └── authController.js      # Authentication business logic
├── data/
│   ├── cropKnowledge.js       # Agricultural crop data and knowledge base
│   └── decisionRules.js       # AI decision-making rules and algorithms
├── middleware/
│   └── auth.js                # JWT authentication middleware
├── models/
│   ├── Community.js           # Community schema (crops, locations, interests)
│   ├── Crop.js                # Crop/Field schema with AI insights
│   ├── FarmerProfile.js       # Extended farmer profile data
│   ├── Post.js                # Community posts and discussions
│   ├── User.js                # User authentication and basic info
│   └── UserCommunity.js       # User-community relationship mapping
├── routes/
│   ├── admin.js               # Admin panel and management endpoints
│   ├── ai-agent.js            # AI agent chat and recommendations
│   ├── alerts.js              # Farming alerts and notifications
│   ├── auth.js                # Authentication endpoints (login/register)
│   ├── communities.js         # Community management and discovery
│   ├── courses.js             # Learning platform and courses
│   ├── crops.js               # Crop/field management endpoints
│   ├── execution.js           # AI task execution and planning
│   ├── fields.js              # Field management with AI insights
│   ├── market.js              # Market prices and analysis
│   ├── posts.js               # Community posts and discussions
│   ├── users.js               # User profile management
│   └── weather.js             # Weather data and integration
├── scripts/
│   └── seedCommunities.js     # Database seeding for agricultural communities
├── services/
│   └── hybridAI.js            # AI service integration and processing
├── uploads/
│   ├── .gitkeep               # Keep directory in git
│   └── [uploaded files]       # User uploaded images and documents
├── .env                       # Environment variables (not in git)
├── package.json               # Backend dependencies and scripts
├── package-lock.json          # Locked dependency versions
└── server.js                  # Main Express server configuration
```

## Frontend Directory Structure

```
frontend/
├── public/
│   └── index.html             # Main HTML template
├── src/
│   ├── components/
│   │   └── Navbar.js          # Navigation component with user menu
│   ├── pages/
│   │   ├── AIAgent.js         # AI farming assistant chat interface
│   │   ├── Community.js       # Community discovery and management
│   │   ├── CommunityDetail.js # Individual community view with posts
│   │   ├── Courses.js         # Learning platform and educational content
│   │   ├── CropDetail.js      # Detailed crop/field management interface
│   │   ├── DailyTasks.js      # AI-generated daily farming tasks
│   │   ├── Dashboard.js       # Main farmer dashboard with overview
│   │   ├── Fields.js          # Field management and crop tracking
│   │   ├── Landing.js         # Landing page for new users
│   │   ├── Learning.js        # Educational resources and tutorials
│   │   ├── Login.js           # User authentication login form
│   │   ├── Profile.js         # User profile management
│   │   └── Register.js        # User registration form
│   ├── services/
│   │   └── api.js             # API integration and HTTP client
│   ├── styles/
│   │   └── animations.css     # CSS animations and transitions
│   ├── App.js                 # Main React application component
│   ├── config.js              # Frontend configuration and API URLs
│   └── index.js               # React application entry point
├── package.json               # Frontend dependencies and build scripts
└── package-lock.json          # Locked dependency versions
```

## Database Collections Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String, // 'farmer' | 'entrepreneur'
  createdAt: Date,
  updatedAt: Date
}
```

### Communities Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  type: String, // 'crop' | 'location' | 'interest'
  category: String, // specific category like 'rice', 'punjab', 'organic'
  memberCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### UserCommunities Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  communityId: ObjectId,
  joinedAt: Date
}
```

### Posts Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  communityId: ObjectId,
  content: String,
  images: [String], // URLs to uploaded images
  likes: Number,
  comments: [{
    userId: ObjectId,
    content: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Crops/Fields Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  cropType: String,
  plantingDate: Date,
  expectedHarvest: Date,
  landSize: Number,
  location: String,
  currentPhase: String,
  tasks: [{
    phase: String,
    task: String,
    completed: Boolean,
    dueDate: Date
  }],
  expenses: [{
    date: Date,
    description: String,
    amount: Number,
    category: String
  }],
  notes: [{
    date: Date,
    note: String,
    weather: String
  }],
  photos: [{
    url: String,
    date: Date,
    caption: String
  }],
  aiInsights: {
    yieldPrediction: Number,
    recommendations: [String],
    riskFactors: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints Structure

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user profile
- `POST /logout` - User logout

### Community Routes (`/api/communities`)
- `GET /` - List all communities with filters
- `GET /:id` - Get specific community details
- `POST /join/:id` - Join a community
- `DELETE /leave/:id` - Leave a community
- `GET /my-communities` - Get user's joined communities

### Posts Routes (`/api/posts`)
- `GET /:communityId` - Get posts for a community
- `POST /` - Create new post
- `PUT /:id` - Update post
- `DELETE /:id` - Delete post
- `POST /:id/like` - Like/unlike post
- `POST /:id/comment` - Add comment to post

### Fields Routes (`/api/fields`)
- `GET /` - Get user's fields/crops
- `POST /` - Create new field/crop
- `GET /:id` - Get specific field details
- `PUT /:id` - Update field information
- `DELETE /:id` - Delete field
- `POST /:id/task` - Add task to field
- `PUT /:id/task/:taskId` - Update task status
- `POST /:id/expense` - Add expense record
- `POST /:id/note` - Add field note
- `POST /:id/photo` - Upload field photo

### AI Agent Routes (`/api/ai-agent`)
- `POST /advice` - Get AI farming recommendations
- `POST /analyze` - Analyze crop data with AI
- `POST /chat` - Chat with AI assistant
- `GET /insights/:cropId` - Get AI insights for specific crop

### Weather Routes (`/api/weather`)
- `GET /current/:location` - Current weather data
- `GET /forecast/:location` - Weather forecast
- `GET /history/:location` - Historical weather data

### Market Routes (`/api/market`)
- `GET /prices/:crop` - Current market prices
- `GET /trends/:crop` - Price trends and analysis
- `GET /opportunities` - Market opportunities

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/agri-connect
JWT_SECRET=agri-connect-super-secret-jwt-key-2024
PORT=5000
NODE_ENV=development
WEATHER_API_KEY=your_weather_api_key
MARKET_API_KEY=your_market_api_key
```

### Frontend (environment variables)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WEATHER_API_KEY=your_weather_api_key
```

## Deployment Structure

### Render Configuration (render.yaml)
- Web service for backend (Node.js)
- Static site for frontend (React build)
- Environment variables configuration
- Build and start commands

### Production Environment
- Backend: Node.js server on Render
- Frontend: Static React build served by backend
- Database: MongoDB Atlas (cloud)
- File Storage: Local uploads directory
- Domain: Custom domain or Render subdomain

## Development Workflow

### Local Development
1. Start MongoDB locally
2. Run backend server (`npm run dev`)
3. Run frontend development server (`npm start`)
4. Access application at `http://localhost:3000`

### Production Deployment
1. Push code to GitHub repository
2. Connect repository to Render
3. Configure environment variables
4. Deploy automatically on git push
5. Access live application at Render URL

## Key Features Implementation

### AI Integration
- Hybrid AI service in `services/hybridAI.js`
- Decision rules in `data/decisionRules.js`
- Crop knowledge base in `data/cropKnowledge.js`
- Execution agent in `agents/executionAgent.js`

### Community System
- Community discovery and filtering
- Real-time member counts
- Post creation and engagement
- User-community relationship management

### Field Management
- Interactive crop tracking
- Task management with AI suggestions
- Expense tracking and analytics
- Photo documentation
- Weather integration
- Yield prediction algorithms

### Authentication & Security
- JWT-based authentication
- Role-based access control
- Secure password hashing
- Protected API endpoints
- Input validation and sanitization

This structure provides a comprehensive agricultural platform with AI-powered insights, community features, and complete farm management capabilities.