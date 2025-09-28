// Migration script to move data from localStorage to MongoDB Atlas
// Run this script in browser console or as a Node.js script

const MONGODB_URI = "mongodb+srv://thakurrn132_db_user:oetxrQ2H1dZEwKNk@cluster0.b2o0mbb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "megajobnepal";

// Collections to migrate
const COLLECTIONS = [
  'users',
  'companies', 
  'jobs',
  'job_categories',
  'applications',
  'skills',
  'subscriptions'
];

/**
 * Browser-based migration (run in browser console)
 */
function migrateFromLocalStorage() {
  console.log('🚀 Starting localStorage to MongoDB migration...');
  
  const migrationData = {};
  let totalRecords = 0;
  
  // Extract data from localStorage
  COLLECTIONS.forEach(collection => {
    const storageKey = `mongodb_megajobnepal_${collection}`;
    const data = localStorage.getItem(storageKey);
    
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          migrationData[collection] = parsed;
          totalRecords += parsed.length;
          console.log(`📊 Found ${parsed.length} records in ${collection}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to parse ${collection}:`, error);
      }
    }
  });
  
  if (totalRecords === 0) {
    console.log('❌ No data found in localStorage to migrate');
    return;
  }
  
  console.log(`📈 Total records to migrate: ${totalRecords}`);
  console.log('📋 Migration data:', migrationData);
  
  // Create downloadable JSON file
  const migrationBlob = new Blob([JSON.stringify(migrationData, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(migrationBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `megajobnepal-migration-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('✅ Migration data exported! Upload this file to your MongoDB Atlas cluster.');
  console.log('💡 You can use MongoDB Compass or mongoimport to import the data.');
  
  return migrationData;
}

/**
 * Node.js based migration (for server environment)
 */
async function migrateToMongoDB(migrationData) {
  try {
    const { MongoClient } = require('mongodb');
    
    console.log('🔗 Connecting to MongoDB Atlas...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB Atlas');
    
    for (const [collection, data] of Object.entries(migrationData)) {
      if (Array.isArray(data) && data.length > 0) {
        console.log(`📝 Migrating ${data.length} records to ${collection}...`);
        
        // Clean up data - ensure proper ObjectIds and dates
        const cleanedData = data.map(record => {
          const cleaned = { ...record };
          
          // Convert date strings back to Date objects
          if (cleaned.created_at && typeof cleaned.created_at === 'string') {
            cleaned.created_at = new Date(cleaned.created_at);
          }
          if (cleaned.updated_at && typeof cleaned.updated_at === 'string') {
            cleaned.updated_at = new Date(cleaned.updated_at);
          }
          if (cleaned.applied_at && typeof cleaned.applied_at === 'string') {
            cleaned.applied_at = new Date(cleaned.applied_at);
          }
          if (cleaned.expires_at && typeof cleaned.expires_at === 'string') {
            cleaned.expires_at = new Date(cleaned.expires_at);
          }
          if (cleaned.otp_expires_at && typeof cleaned.otp_expires_at === 'string') {
            cleaned.otp_expires_at = new Date(cleaned.otp_expires_at);
          }
          
          return cleaned;
        });
        
        try {
          // Insert data into MongoDB
          await db.collection(collection).insertMany(cleanedData, { ordered: false });
          console.log(`✅ Successfully migrated ${cleanedData.length} records to ${collection}`);
        } catch (insertError) {
          if (insertError.code === 11000) {
            console.log(`⚠️ Some duplicate records found in ${collection}, continuing...`);
          } else {
            console.error(`❌ Error migrating ${collection}:`, insertError);
          }
        }
      }
    }
    
    await client.close();
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Validate MongoDB connection
 */
async function validateConnection() {
  try {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(MONGODB_URI);
    
    console.log('🔍 Testing MongoDB connection...');
    await client.connect();
    
    const db = client.db(DB_NAME);
    await db.admin().ping();
    
    console.log('✅ MongoDB connection successful!');
    
    // List existing collections
    const collections = await db.listCollections().toArray();
    console.log('📂 Existing collections:', collections.map(c => c.name));
    
    await client.close();
    return true;
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
}

/**
 * Setup instructions
 */
function showMigrationInstructions() {
  console.log(`
🚀 MegaJobNepal MongoDB Migration Guide
=====================================

STEP 1: Extract data from localStorage (run in browser)
-------------------------------------------------------
migrateFromLocalStorage()

STEP 2: Validate MongoDB connection (run in Node.js)
---------------------------------------------------
node -e "
const { validateConnection } = require('./migrate-localStorage-to-mongodb.js');
validateConnection();
"

STEP 3: Upload migration file to MongoDB
----------------------------------------
You can use:
1. MongoDB Compass (GUI)
2. mongoimport command line tool
3. MongoDB Atlas Data Import feature

STEP 4: Verify migration
-----------------------
Check your MongoDB Atlas dashboard to confirm data was imported.

Connection Details:
- URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}
- Database: ${DB_NAME}

Collections to migrate:
${COLLECTIONS.map(c => `- ${c}`).join('\n')}
`);
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    migrateToMongoDB,
    validateConnection,
    showMigrationInstructions,
    COLLECTIONS,
    MONGODB_URI,
    DB_NAME
  };
} else {
  // Browser environment
  window.migrationUtils = {
    migrateFromLocalStorage,
    showMigrationInstructions,
    COLLECTIONS
  };
  
  console.log('🔧 Migration utilities loaded! Run showMigrationInstructions() for help.');
}