const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB connection
let db;
let client;

async function connectToMongoDB() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    client = new MongoClient(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    await client.connect();
    db = client.db(process.env.MONGODB_DB_NAME || 'megajobnepal');
    
    // Test the connection
    await db.admin().ping();
    console.log('✅ Connected to MongoDB successfully');
    
    // Create indexes for better performance
    await createIndexes();
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

async function createIndexes() {
  try {
    console.log('📋 Creating database indexes...');
    
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ user_type: 1 });
    await db.collection('users').createIndex({ is_verified: 1 });
    
    // Jobs collection indexes
    await db.collection('jobs').createIndex({ company_id: 1 });
    await db.collection('jobs').createIndex({ category_id: 1 });
    await db.collection('jobs').createIndex({ status: 1 });
    await db.collection('jobs').createIndex({ location: 1 });
    await db.collection('jobs').createIndex({ created_at: -1 });
    
    // Companies collection indexes
    await db.collection('companies').createIndex({ name: 1 });
    await db.collection('companies').createIndex({ employer_id: 1 });
    
    // Applications collection indexes
    await db.collection('applications').createIndex({ job_id: 1 });
    await db.collection('applications').createIndex({ job_seeker_id: 1 });
    await db.collection('applications').createIndex({ status: 1 });
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.warn('⚠️ Warning: Some indexes may already exist:', error.message);
  }
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'megajobnepal_jwt_secret_key_2024', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: db ? 'Connected' : 'Disconnected'
  });
});

// Database status endpoint
app.get('/api/status', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    // Ping database
    await db.admin().ping();
    
    // Get collection stats
    const stats = {
      users: await db.collection('users').countDocuments(),
      jobs: await db.collection('jobs').countDocuments(),
      companies: await db.collection('companies').countDocuments(),
      applications: await db.collection('applications').countDocuments()
    };
    
    res.json({
      status: 'Connected',
      database: process.env.MONGODB_DB_NAME || 'megajobnepal',
      collections: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({ error: 'Database connection error' });
  }
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, userType, phone } = req.body;
    
    // Validate input
    if (!email || !password || !fullName || !userType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = {
      email,
      password_hash: passwordHash,
      full_name: fullName,
      user_type: userType,
      phone_number: phone || null,
      is_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
      profile: {}
    };
    
    const result = await db.collection('users').insertOne(user);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.insertedId, 
        email, 
        userType,
        isVerified: false 
      },
      process.env.JWT_SECRET || 'megajobnepal_jwt_secret_key_2024',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertedId,
        email,
        fullName,
        userType,
        isVerified: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        userType: user.user_type,
        isVerified: user.is_verified 
      },
      process.env.JWT_SECRET || 'megajobnepal_jwt_secret_key_2024',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.full_name,
        userType: user.user_type,
        isVerified: user.is_verified,
        profile: user.profile || {}
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.collection('users').findOne(
      { _id: req.user.userId },
      { projection: { password_hash: 0 } }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // Don't allow password updates here
    delete updates.email; // Don't allow email updates here
    
    updates.updated_at = new Date();
    
    const result = await db.collection('users').findOneAndUpdate(
      { _id: req.user.userId },
      { $set: updates },
      { returnDocument: 'after', projection: { password_hash: 0 } }
    );
    
    if (!result.value) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.value);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Jobs routes
app.get('/api/jobs', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, location, type, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build filter
    const filter = { status: 'active' };
    
    if (category) filter.category_id = category;
    if (location) filter.location = new RegExp(location, 'i');
    if (type) filter.employment_type = type;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    const jobs = await db.collection('jobs')
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    const total = await db.collection('jobs').countDocuments(filter);
    
    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = await db.collection('jobs').findOne({ _id: id });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/jobs', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'employer') {
      return res.status(403).json({ error: 'Only employers can create jobs' });
    }
    
    const job = {
      ...req.body,
      posted_by: req.user.userId,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await db.collection('jobs').insertOne(job);
    
    res.status(201).json({
      message: 'Job created successfully',
      jobId: result.insertedId
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Companies routes
app.get('/api/companies', async (req, res) => {
  try {
    const { page = 1, limit = 20, featured, topHiring } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const filter = {};
    if (featured === 'true') filter.is_featured = true;
    if (topHiring === 'true') filter.is_top_hiring = true;
    
    const companies = await db.collection('companies')
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    const total = await db.collection('companies').countDocuments(filter);
    
    res.json({
      companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Applications routes
app.post('/api/applications', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can apply for jobs' });
    }
    
    const { jobId, coverLetter, resumeUrl } = req.body;
    
    // Check if already applied
    const existingApplication = await db.collection('applications').findOne({
      job_id: jobId,
      job_seeker_id: req.user.userId
    });
    
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }
    
    const application = {
      job_id: jobId,
      job_seeker_id: req.user.userId,
      cover_letter: coverLetter,
      resume_url: resumeUrl,
      status: 'pending',
      applied_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await db.collection('applications').insertOne(application);
    
    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: result.insertedId
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/applications', authenticateToken, async (req, res) => {
  try {
    const filter = {};
    
    if (req.user.userType === 'job_seeker') {
      filter.job_seeker_id = req.user.userId;
    } else if (req.user.userType === 'employer') {
      // Get jobs posted by this employer
      const employerJobs = await db.collection('jobs').find({
        posted_by: req.user.userId
      }).toArray();
      
      const jobIds = employerJobs.map(job => job._id);
      filter.job_id = { $in: jobIds };
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const applications = await db.collection('applications')
      .find(filter)
      .sort({ applied_at: -1 })
      .toArray();
    
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  if (client) {
    await client.close();
    console.log('📤 MongoDB connection closed');
  }
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    await connectToMongoDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 MegaJobNepal Backend Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📈 API Status: http://localhost:${PORT}/api/status`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();