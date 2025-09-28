#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MegaJobNepal Startup Script');
console.log('===============================\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js version 18 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  console.error('   Please upgrade Node.js and try again');
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Check if port 5173 is available
const net = require('net');
const checkPort = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
};

async function startApp() {
  const portAvailable = await checkPort(5173);
  
  if (!portAvailable) {
    console.log('⚠️  Port 5173 is busy, Vite will use another port');
  }

  console.log('\n🌟 Starting MegaJobNepal development server...');
  console.log('   📍 The app will open at http://localhost:5173');
  console.log('   🔄 If you see "Database Setup", click the button to initialize');
  console.log('   📧 Use demo accounts from Guidelines.md for testing\n');

  try {
    execSync('npm run dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to start development server');
    console.error('💡 Try running: npm install && npm run dev');
  }
}

startApp();