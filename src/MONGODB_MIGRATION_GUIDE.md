# MongoDB Migration Guide

This guide explains how to migrate your MegaJobNepal application from Supabase to MongoDB.

## What Changed

### 1. Database Layer
- **Before**: Supabase (PostgreSQL-based cloud database)
- **After**: MongoDB (NoSQL document database)

### 2. New Files Added
- `/lib/mongodb.ts` - MongoDB connection and database service
- `/lib/auth.ts` - Custom authentication service with JWT
- `/lib/file-upload.ts` - File upload service (local/Cloudinary)
- `/MONGODB_MIGRATION_GUIDE.md` - This migration guide

### 3. Updated Files
- `/lib/env.ts` - Added MongoDB environment variables
- `/App.tsx` - Updated to use MongoDB instead of Supabase
- `/components/DatabaseSetup.tsx` - Updated for MongoDB setup
- `/package.json` - Added MongoDB and authentication dependencies
- `/env.example` - Updated with MongoDB configuration

## Prerequisites

### 1. Install MongoDB
Choose one of the following options:

#### Option A: Local MongoDB Installation
```bash
# On macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# On Ubuntu/Debian
sudo apt-get install -y mongodb

# On Windows
# Download and install from: https://www.mongodb.com/try/download/community
```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string

#### Option C: Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Install New Dependencies
```bash
npm install mongodb bcryptjs jsonwebtoken nodemailer
npm install -D @types/bcryptjs @types/jsonwebtoken @types/nodemailer
```

## Environment Configuration

### 1. Update Environment Variables
Copy the new environment template:
```bash
cp env.example .env.local
```

### 2. Configure MongoDB Connection
Update `.env.local` with your MongoDB configuration:

```env
# For local MongoDB
VITE_MONGODB_URI=mongodb://localhost:27017
MONGODB_URI=mongodb://localhost:27017

# For MongoDB Atlas
VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Database name
VITE_MONGODB_DB_NAME=megajobnepal
MONGODB_DB_NAME=megajobnepal

# JWT Secret (IMPORTANT: Change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. Email Configuration (Optional)
For OTP verification and password reset emails:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. File Upload Configuration (Optional)
For file uploads (logos, resumes, etc.):
```env
# Use local storage (default)
VITE_UPLOAD_SERVICE=local

# Or use Cloudinary
VITE_UPLOAD_SERVICE=cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Database Setup

### 1. Start the Application
```bash
npm run dev
```

### 2. Initialize Database
When you first run the application, you'll see a database setup screen. Click "Initialize Database" to:
- Create MongoDB collections
- Set up database indexes
- Create default job categories
- Create a default admin user
- Add sample companies

### 3. Default Admin Credentials
After setup, you can login as admin:
- **Email**: admin@megajobnepal.com
- **Password**: admin123

**Important**: Change these credentials immediately after first login!

## Key Differences from Supabase

### 1. Authentication
- **Before**: Supabase Auth with built-in email verification
- **After**: Custom JWT-based authentication with email/OTP verification

### 2. Database Structure
- **Before**: SQL tables with foreign keys
- **After**: MongoDB collections with embedded documents

### 3. File Storage
- **Before**: Supabase Storage
- **After**: Local storage (development) or Cloudinary (production)

### 4. Real-time Features
- **Before**: Supabase real-time subscriptions
- **After**: Polling or WebSocket implementation needed (not included)

## Data Models

### User Document
```javascript
{
  _id: ObjectId,
  id: "generated_id",
  email: "user@example.com",
  password_hash: "hashed_password",
  user_type: "job_seeker" | "employer" | "admin",
  full_name: "User Name",
  phone_number: "+1234567890",
  is_verified: true,
  profile: {
    bio: "User bio",
    skills: ["JavaScript", "React"],
    location: "City, Country"
  },
  created_at: Date,
  updated_at: Date
}
```

### Company Document
```javascript
{
  _id: ObjectId,
  id: "generated_id",
  name: "Company Name",
  description: "Company description",
  website: "https://company.com",
  logo_url: "https://...",
  location: "City, Country",
  industry: "Technology",
  is_featured: true,
  is_top_hiring: false,
  is_trusted: true,
  created_at: Date,
  updated_at: Date
}
```

### Job Document
```javascript
{
  _id: ObjectId,
  id: "generated_id",
  title: "Job Title",
  description: "Job description",
  company_id: "company_id",
  category_id: "category_id",
  location: "City, Country",
  salary_min: 50000,
  salary_max: 80000,
  employment_type: "full_time",
  status: "active",
  created_at: Date,
  updated_at: Date
}
```

## Migration Checklist

### ✅ Completed
- [x] MongoDB connection setup
- [x] Authentication service with JWT
- [x] User management (signup, login, OTP verification)
- [x] Database service layer
- [x] File upload service
- [x] Environment configuration
- [x] Database initialization
- [x] Sample data creation

### 🔄 TODO (Manual Updates Needed)
- [ ] Update all components to use new database service
- [ ] Migrate existing Supabase queries to MongoDB
- [ ] Update authentication context to use new auth service
- [ ] Test all CRUD operations
- [ ] Implement file upload in components
- [ ] Update admin panel to use MongoDB
- [ ] Test all user flows

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```
Error: Failed to connect to MongoDB
```
**Solution**: 
- Check if MongoDB is running
- Verify connection string in `.env.local`
- For Atlas, check network access and credentials

#### 2. Authentication Errors
```
Error: JWT token verification failed
```
**Solution**:
- Ensure JWT_SECRET is set in environment
- Check token format and expiration

#### 3. Database Setup Fails
```
Error: Failed to setup MongoDB database
```
**Solution**:
- Check MongoDB permissions
- Verify database name in configuration
- Check network connectivity

### Getting Help

1. Check the browser console for detailed error messages
2. Look at the setup logs during database initialization
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible

## Production Deployment

### 1. Security Considerations
- Use strong JWT secret (32+ random characters)
- Enable MongoDB authentication
- Use HTTPS for all communications
- Configure proper CORS settings

### 2. Performance Optimization
- Set up MongoDB indexes (handled automatically)
- Use connection pooling
- Implement caching for frequently accessed data

### 3. Monitoring
- Set up MongoDB monitoring
- Log authentication events
- Monitor database performance

## Rollback Plan

If you need to rollback to Supabase:
1. Keep the old Supabase configuration in environment
2. Restore `/lib/supabase.ts` file
3. Update `/App.tsx` to use Supabase again
4. Update components to use Supabase queries

The migration preserves backward compatibility, so rollback is possible if needed.