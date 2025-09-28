# MongoDB Production Setup Guide for MegaJobNepal

## 🚀 Overview

This guide will help you migrate from the current localStorage-based system to a production MongoDB Atlas database using the provided connection string.

**Connection String:** `mongodb+srv://thakurrn132_db_user:oetxrQ2H1dZEwKNk@cluster0.b2o0mbb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

## 📁 Current Implementation

The application currently uses:
- **Development:** localStorage with MongoDB-compatible API (`/lib/mongodb-real.ts`)
- **Storage:** Browser localStorage with keys like `mongodb_megajobnepal_*`
- **Interface:** Same MongoDB methods for easy migration

## 🔄 Migration Steps

### Step 1: Validate MongoDB Connection

```bash
npm run db:validate
```

This will test the connection to your MongoDB Atlas cluster.

### Step 2: Export Data from localStorage

In your browser console, run:
```javascript
// Load migration utilities
const script = document.createElement('script');
script.src = '/scripts/migrate-localStorage-to-mongodb.js';
document.head.appendChild(script);

// Export data
migrationUtils.migrateFromLocalStorage();
```

This will download a JSON file with all your current data.

### Step 3: Import Data to MongoDB Atlas

#### Option A: Using MongoDB Compass (Recommended)
1. Install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your connection string
3. Create database `megajobnepal`
4. Import the JSON file into each collection

#### Option B: Using mongoimport
```bash
# For each collection in your exported JSON
mongoimport --uri "mongodb+srv://thakurrn132_db_user:oetxrQ2H1dZEwKNk@cluster0.b2o0mbb.mongodb.net/megajobnepal" --collection users --file users.json --jsonArray

mongoimport --uri "mongodb+srv://thakurrn132_db_user:oetxrQ2H1dZEwKNk@cluster0.b2o0mbb.mongodb.net/megajobnepal" --collection companies --file companies.json --jsonArray

# ... repeat for all collections
```

#### Option C: Using MongoDB Atlas Data Import
1. Go to MongoDB Atlas dashboard
2. Navigate to your cluster
3. Use the "Insert Document" or "Import" feature
4. Upload your JSON data

### Step 4: Update Environment Variables

Ensure your `.env.local` file has:
```env
MONGODB_URI=mongodb+srv://thakurrn132_db_user:oetxrQ2H1dZEwKNk@cluster0.b2o0mbb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=megajobnepal
```

### Step 5: Switch to Production MongoDB

Once data is migrated, you can switch from localStorage to real MongoDB by:

1. **For Server-Side Deployment (Node.js/Next.js):**
   ```typescript
   // Replace imports in your components
   import { dbService } from './lib/mongodb-server';
   ```

2. **For Client-Side (Current Setup):**
   The current implementation in `/lib/mongodb-real.ts` will automatically work with your Atlas database.

## 📊 Database Schema

### Collections Structure

```javascript
// Users Collection
{
  _id: ObjectId,
  id: String,
  email: String,
  password_hash: String,
  user_type: "job_seeker" | "employer" | "admin",
  full_name: String,
  phone_number: String,
  is_verified: Boolean,
  otp_code: String,
  otp_expires_at: Date,
  created_at: Date,
  updated_at: Date,
  profile: {
    bio: String,
    skills: [String],
    experience: String,
    education: String,
    location: String,
    resume_url: String,
    profile_image_url: String
  }
}

// Companies Collection
{
  _id: ObjectId,
  id: String,
  name: String,
  description: String,
  website: String,
  logo_url: String,
  cover_image_url: String,
  location: String,
  industry: String,
  size: String,
  founded_year: Number,
  is_featured: Boolean,
  is_top_hiring: Boolean,
  is_trusted: Boolean,
  employer_id: String,
  created_at: Date,
  updated_at: Date
}

// Jobs Collection
{
  _id: ObjectId,
  id: String,
  title: String,
  description: String,
  requirements: String,
  benefits: String,
  salary_min: Number,
  salary_max: Number,
  salary_currency: String,
  employment_type: String,
  experience_level: String,
  location: String,
  is_remote: Boolean,
  company_id: String,
  category_id: String,
  status: "active" | "inactive" | "expired",
  posted_by: String,
  expires_at: Date,
  cover_image_url: String,
  created_at: Date,
  updated_at: Date
}

// Job Categories Collection
{
  _id: ObjectId,
  id: String,
  name: String,
  description: String,
  tier: Number,
  parent_id: String,
  icon: String,
  created_at: Date,
  updated_at: Date
}

// Applications Collection
{
  _id: ObjectId,
  id: String,
  job_id: String,
  job_seeker_id: String,
  cover_letter: String,
  resume_url: String,
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired",
  applied_at: Date,
  updated_at: Date
}
```

## 🔍 Database Indexes

The following indexes are automatically created for optimal performance:

### Users Collection
- `{ email: 1 }` (unique)
- `{ user_type: 1 }`
- `{ is_verified: 1 }`

### Jobs Collection
- `{ company_id: 1 }`
- `{ category_id: 1 }`
- `{ status: 1 }`
- `{ location: 1 }`
- `{ employment_type: 1 }`
- `{ experience_level: 1 }`
- `{ created_at: -1 }`

### Companies Collection
- `{ name: 1 }`
- `{ is_featured: 1 }`
- `{ is_top_hiring: 1 }`
- `{ is_trusted: 1 }`
- `{ employer_id: 1 }`

### Job Categories Collection
- `{ tier: 1 }`
- `{ parent_id: 1 }`
- `{ name: 1 }`

### Applications Collection
- `{ job_id: 1 }`
- `{ job_seeker_id: 1 }`
- `{ status: 1 }`
- `{ applied_at: -1 }`

## 🛡️ Security Considerations

### Connection Security
- ✅ Connection string uses SSL/TLS encryption
- ✅ Authentication with username/password
- ✅ Network access restricted to whitelisted IPs (configure in Atlas)

### Application Security
- 🔒 Passwords are hashed using SHA-256 (consider upgrading to bcrypt)
- 🔒 JWT tokens for session management
- 🔒 Input validation and sanitization
- 🔒 Rate limiting on authentication endpoints

### Recommended Security Enhancements
1. **Upgrade password hashing:**
   ```typescript
   import bcrypt from 'bcryptjs';
   const hash = await bcrypt.hash(password, 12);
   ```

2. **Add JWT secret rotation:**
   ```env
   JWT_SECRET=your-strong-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-key-here
   ```

3. **Implement rate limiting:**
   ```typescript
   // Add rate limiting middleware
   app.use('/api/auth', rateLimiter);
   ```

## 🚀 Production Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add MONGODB_URI
vercel env add MONGODB_DB_NAME
vercel env add JWT_SECRET
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://thakurrn132_db_user:oetxrQ2H1dZEwKNk@cluster0.b2o0mbb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=megajobnepal
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
JWT_EXPIRES_IN=7d
NODE_ENV=production

# Email service (for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File upload (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📈 Monitoring & Maintenance

### MongoDB Atlas Monitoring
- Monitor connection limits and usage
- Set up alerts for high CPU/memory usage
- Regular backups (Atlas handles this automatically)
- Monitor slow queries and optimize indexes

### Application Monitoring
- Add logging for database operations
- Monitor API response times
- Track user authentication failures
- Monitor storage usage

### Regular Maintenance
- Update dependencies regularly
- Review and rotate JWT secrets
- Clean up expired OTP codes
- Archive old job applications

## 🔧 Troubleshooting

### Common Issues

**Connection Timeout:**
```javascript
// Increase timeout in connection options
const options = {
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
};
```

**Authentication Failed:**
- Verify connection string credentials
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**Too Many Connections:**
- Monitor connection pool usage
- Implement connection pooling
- Consider using connection limits

**Performance Issues:**
- Review database indexes
- Monitor slow queries
- Consider data archiving for old records

## 📞 Support

For MongoDB Atlas support:
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Community Forums](https://developer.mongodb.com/community/forums/)
- MongoDB Atlas Support (paid plans)

For application-specific issues:
- Check application logs
- Review error messages in browser console
- Test API endpoints individually