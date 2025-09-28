# MegaJobNepal Backend Setup Guide

## Overview

This guide helps you set up the MegaJobNepal backend server that connects to MongoDB. The system is designed to work in two modes:

1. **Backend Mode**: Full MongoDB server with REST API
2. **Fallback Mode**: Browser localStorage (current implementation)

## Prerequisites

### Required Software
- **Node.js** (version 16 or higher)
- **MongoDB** (version 4.4 or higher)
- **npm** or **yarn** package manager

### MongoDB Installation

#### Option 1: Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/download-center/community
2. Run the installer and follow the setup wizard
3. Start MongoDB service: `net start MongoDB`

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string
4. Update the `.env` file with your Atlas connection string

## Quick Setup

### 1. Run the Setup Script
```bash
node scripts/setup-backend.js
```

This script will:
- Create a default `.env` file if it doesn't exist
- Install all backend dependencies
- Provide next steps

### 2. Configure Environment Variables
Edit the `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=megajobnepal

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=megajobnepal_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=megajobnepal
```

### 3. Start the Backend Server
```bash
cd server
npm run dev
```

### 4. Verify Backend is Running
- Health Check: http://localhost:3001/health
- API Status: http://localhost:3001/api/status

## Manual Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Start MongoDB (if using local installation)
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb/brew/mongodb-community
```

### 3. Start the Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## Backend API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)

### Jobs
- `GET /api/jobs` - Get all jobs (with pagination and filters)
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create new job (employers only)

### Companies
- `GET /api/companies` - Get all companies

### Applications
- `POST /api/applications` - Apply for a job (job seekers only)
- `GET /api/applications` - Get user's applications

### System
- `GET /health` - Health check
- `GET /api/status` - Database status and statistics

## Fallback Mode

If the backend server is not available, the application automatically falls back to the current localStorage implementation. This ensures the app works even without a backend server.

### How it Works
1. Frontend checks backend availability on startup
2. If backend is available, uses REST API
3. If backend is unavailable, continues with localStorage mode
4. Users see no difference in functionality

## Development Workflow

### 1. Start Backend (Terminal 1)
```bash
cd server
npm run dev
```

### 2. Start Frontend (Terminal 2)
```bash
npm run dev
```

### 3. Check Status
Visit http://localhost:3001/api/status to see:
- Database connection status
- Collection statistics
- Server health

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@production-cluster.mongodb.net/
MONGODB_DB_NAME=megajobnepal_prod
JWT_SECRET=your-super-secure-production-jwt-secret
PORT=3001
```

### Deployment Steps
1. Set up MongoDB Atlas or production MongoDB server
2. Update environment variables
3. Install dependencies: `npm install --production`
4. Start server: `npm start`

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
**Error**: `MongoNetworkError: failed to connect to server`

**Solutions**:
- Check if MongoDB is running: `sudo systemctl status mongod`
- Verify connection string in `.env`
- Check firewall settings
- For Atlas: verify IP whitelist and credentials

#### 2. Port Already in Use
**Error**: `EADDRINUSE: address already in use :::3001`

**Solutions**:
- Kill existing process: `lsof -ti:3001 | xargs kill -9`
- Change port in `.env` file
- Use different port: `PORT=3002 npm run dev`

#### 3. Authentication Errors
**Error**: `JWT token invalid`

**Solutions**:
- Clear browser localStorage
- Check JWT_SECRET in `.env`
- Re-login to get fresh token

#### 4. Database Permissions
**Error**: `not authorized on megajobnepal`

**Solutions**:
- Create database user with proper permissions
- Check MongoDB user roles
- Verify database name in connection string

### Debug Mode
Enable debug logging:
```bash
DEBUG=megajobnepal:* npm run dev
```

## Security Considerations

### Development
- Default JWT secret (change for production)
- No HTTPS (use reverse proxy in production)
- Basic rate limiting

### Production
- Use strong JWT secret
- Enable HTTPS
- Implement proper CORS policy
- Add request validation
- Use MongoDB authentication
- Enable audit logging

## Data Migration

To migrate from localStorage to MongoDB:
1. Export data from browser localStorage
2. Import data using MongoDB tools
3. Run data validation scripts

## Support

For issues and questions:
1. Check this documentation
2. Review application logs
3. Check MongoDB logs
4. Verify network connectivity
5. Test with simple MongoDB client

## Next Steps

After successful setup:
1. Test user registration and login
2. Create sample jobs and companies
3. Test job applications
4. Configure email notifications (future)
5. Set up file upload service (future)