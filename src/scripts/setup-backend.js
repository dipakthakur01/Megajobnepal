#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MegaJobNepal Backend...\n');

// Check if server directory exists
const serverDir = path.join(__dirname, '..', 'server');
if (!fs.existsSync(serverDir)) {
  console.error('❌ Server directory not found!');
  console.log('Please make sure the /server directory exists with package.json and index.js');
  process.exit(1);
}

// Check if package.json exists in server directory
const packageJsonPath = path.join(serverDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found in server directory!');
  console.log('Please make sure /server/package.json exists');
  process.exit(1);
}

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found, creating default configuration...');
  
  const defaultEnv = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=megajobnepal

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=megajobnepal_jwt_secret_key_2024
JWT_EXPIRES_IN=7d

# Application Configuration
APP_NAME=MegaJobNepal
APP_URL=http://localhost:3000
API_URL=http://localhost:3001
`;

  try {
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ Created default .env file');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    process.exit(1);
  }
}

console.log('📦 Installing backend dependencies...');

// Install dependencies
const installProcess = spawn('npm', ['install'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true
});

installProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ npm install failed with code ${code}`);
    process.exit(1);
  }

  console.log('\n✅ Backend dependencies installed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Make sure MongoDB is running on localhost:27017');
  console.log('2. Start the backend server: cd server && npm run dev');
  console.log('3. Start the frontend: npm run dev');
  console.log('\n🌐 Backend will be available at: http://localhost:3001');
  console.log('📊 API Status: http://localhost:3001/api/status');
  console.log('🔍 Health Check: http://localhost:3001/health');
  
  console.log('\n📝 Note: If MongoDB is not available, the app will automatically');
  console.log('fall back to localStorage mode for development.');
});

installProcess.on('error', (error) => {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
});