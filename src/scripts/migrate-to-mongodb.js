#!/usr/bin/env node

/**
 * Migration script to help transition from Supabase to MongoDB
 * Run this script to check your environment and setup
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 MegaJobNepal MongoDB Migration Helper\n');

// Check if required dependencies are installed
function checkDependencies() {
  console.log('📦 Checking dependencies...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = ['mongodb', 'bcryptjs', 'jsonwebtoken', 'nodemailer'];
  const missingDeps = [];

  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies?.[dep]) {
      missingDeps.push(dep);
    }
  });

  if (missingDeps.length > 0) {
    console.log('❌ Missing dependencies:', missingDeps.join(', '));
    console.log('📌 Run: npm install ' + missingDeps.join(' '));
    return false;
  }

  console.log('✅ All required dependencies are installed\n');
  return true;
}

// Check environment configuration
function checkEnvironment() {
  console.log('🔧 Checking environment configuration...');
  
  const envFiles = ['.env.local', '.env'];
  let envFound = false;
  
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      console.log(`✅ Found ${envFile}`);
      envFound = true;
      
      const envContent = fs.readFileSync(envFile, 'utf8');
      
      // Check for MongoDB configuration
      if (envContent.includes('MONGODB_URI') || envContent.includes('VITE_MONGODB_URI')) {
        console.log('✅ MongoDB configuration detected');
      } else {
        console.log('⚠️  MongoDB configuration not found in ' + envFile);
        console.log('📌 Add MONGODB_URI and related variables');
      }
      
      break;
    }
  }
  
  if (!envFound) {
    console.log('⚠️  No environment file found');
    console.log('📌 Copy env.example to .env.local and configure');
  }
  
  console.log('');
}

// Check MongoDB connection (basic check)
async function checkMongoDB() {
  console.log('🗄️  Checking MongoDB connection...');
  
  try {
    // Try to require MongoDB (basic check)
    require('mongodb');
    console.log('✅ MongoDB client library is available');
    
    // Note: We can't test actual connection here without loading the full app
    console.log('📌 Run the application to test actual MongoDB connection');
  } catch (error) {
    console.log('❌ MongoDB client library not found');
    console.log('📌 Run: npm install mongodb');
  }
  
  console.log('');
}

// Generate helpful next steps
function generateNextSteps() {
  console.log('🎯 Next Steps:\n');
  
  console.log('1. 📝 Configure Environment Variables:');
  console.log('   - Copy env.example to .env.local');
  console.log('   - Set MONGODB_URI to your MongoDB connection string');
  console.log('   - Configure JWT_SECRET with a secure random string');
  console.log('   - Set up SMTP configuration for email (optional)\n');
  
  console.log('2. 🗄️  Setup MongoDB:');
  console.log('   - Install MongoDB locally OR use MongoDB Atlas');
  console.log('   - Ensure MongoDB is running and accessible');
  console.log('   - Test connection with your MongoDB client\n');
  
  console.log('3. 🚀 Start the Application:');
  console.log('   - Run: npm run dev');
  console.log('   - Navigate to the database setup page');
  console.log('   - Click "Initialize Database" to setup collections\n');
  
  console.log('4. 🔐 Admin Access:');
  console.log('   - Default admin: admin@megajobnepal.com');
  console.log('   - Default password: admin123');
  console.log('   - Change these credentials after first login\n');
  
  console.log('5. 🔧 Update Components (if needed):');
  console.log('   - Check all components use the new database service');
  console.log('   - Update any remaining Supabase references');
  console.log('   - Test all user flows (signup, login, job posting, etc.)\n');
}

// Main execution
async function main() {
  const depsOk = checkDependencies();
  checkEnvironment();
  await checkMongoDB();
  
  if (depsOk) {
    console.log('🎉 Migration environment looks good!\n');
  } else {
    console.log('⚠️  Please install missing dependencies first\n');
  }
  
  generateNextSteps();
  
  console.log('📚 For detailed instructions, see: MONGODB_MIGRATION_GUIDE.md');
  console.log('❓ For issues, check the troubleshooting section in the guide\n');
}

main().catch(console.error);