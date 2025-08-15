# GreenCart Logistics - Delivery Simulation & KPI Dashboard

*Full-Stack Developer Assessment Project*

Live ink-(https://v0-node-js-project-details-beryl.vercel.app/)

## Project Overview

GreenCart Logistics is a fictional eco-friendly delivery company simulation tool that helps managers experiment with staffing, delivery schedules, and route allocations to optimize profits and efficiency. This application implements custom business rules for delivery operations and provides real-time KPI calculations.

## Tech Stack

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **MongoDB** - Database for storing drivers, routes, orders, and simulations
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** (Hooks) - User interface
- **Chart.js** - Data visualization and charts
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Icons

## Project Structure

\`\`\`
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── server.js           # Express server setup
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main application
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
└── README.md
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or cloud instance)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file with the following variables:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/greencart
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

4. Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file (optional):
\`\`\`env
REACT_APP_API_URL=http://localhost:5000
\`\`\`

4. Start the frontend development server:
\`\`\`bash
npm start
\`\`\`

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `FRONTEND_URL` - Frontend URL for CORS configuration
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL (defaults to http://localhost:5000)

## API Documentation

### Authentication
- `POST /api/auth/login` - User login

### Data Management
- `GET /api/drivers` - Get all drivers
- `POST /api/drivers` - Create new driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

- `GET /api/routes` - Get all routes
- `POST /api/routes` - Create new route
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Simulation & Analytics
- `POST /api/simulation/run` - Run delivery simulation
- `GET /api/dashboard/kpis` - Get dashboard KPIs
- `POST /api/seed` - Seed database with sample data

## Custom Business Rules

1. **Late Delivery Penalty**: ₹50 penalty if delivery time > (base route time + 10 minutes)
2. **Driver Fatigue Rule**: 30% speed decrease if driver works >8 hours/day
3. **High-Value Bonus**: 10% bonus for orders >₹1000 delivered on time
4. **Fuel Cost Calculation**: ₹5/km base + ₹2/km surcharge for high traffic
5. **Efficiency Score**: (On-time deliveries / Total deliveries) × 100

## Features

### Dashboard
- Total Profit calculation
- Efficiency Score tracking
- On-time vs Late Deliveries chart
- Fuel Cost Breakdown visualization

### Simulation Engine
- Driver allocation optimization
- Route scheduling
- Real-time KPI calculation
- Historical simulation tracking

### Management Interface
- CRUD operations for Drivers, Routes, and Orders
- Data validation and error handling
- Responsive design for mobile and desktop

## Demo Credentials

- **Username**: admin
- **Password**: admin123

## Deployment Instructions

### Backend Deployment (Render/Railway/Heroku)
1. Create account on deployment platform
2. Connect GitHub repository
3. Set environment variables in platform dashboard
4. Deploy backend service

### Frontend Deployment (Vercel/Netlify)
1. Create account on deployment platform
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Deploy frontend application

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create new cluster
3. Get connection string
4. Update `MONGODB_URI` in backend environment variables

## Testing

Run backend tests:
\`\`\`bash
cd backend
npm test
\`\`\`

## Development Notes

- The application uses JWT tokens for authentication
- All API endpoints require authentication except login and seed
- Database seeding is required on first setup
- CORS is configured to allow frontend-backend communication
- Rate limiting is implemented for API security

