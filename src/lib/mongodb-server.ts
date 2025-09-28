// Server-side MongoDB connection for production deployment
// This file is for when you deploy to a Node.js environment

import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import { env } from './env';

// MongoDB connection string from environment
const uri = env.MONGODB_URI;
const dbName = env.MONGODB_DB_NAME;

// Connection options
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
};

class MongoDBConnection {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.client = new MongoClient(uri, options);
  }

  async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      return;
    }

    try {
      console.log('🔗 Connecting to MongoDB Atlas...');
      
      // Connect to MongoDB
      await this.client?.connect();
      
      // Get database instance
      this.db = this.client?.db(dbName) || null;
      
      // Test the connection
      await this.db?.admin().ping();
      
      this.isConnected = true;
      console.log('✅ Successfully connected to MongoDB Atlas');
      
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB Atlas:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      this.client = null;
      this.db = null;
      console.log('📴 Disconnected from MongoDB Atlas');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  isConnectedToDatabase(): boolean {
    return this.isConnected;
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.db) {
        return false;
      }
      
      await this.db.admin().ping();
      return true;
    } catch (error) {
      console.error('MongoDB health check failed:', error);
      return false;
    }
  }

  // Setup database indexes and collections
  async setupDatabase(): Promise<void> {
    try {
      if (!this.db) {
        await this.connect();
      }

      const db = this.getDb();

      // Create collections if they don't exist
      const collections = ['users', 'companies', 'jobs', 'job_categories', 'applications'];
      
      for (const collectionName of collections) {
        try {
          await db.createCollection(collectionName);
          console.log(`📝 Created collection: ${collectionName}`);
        } catch (error) {
          // Collection might already exist, which is fine
          console.log(`📄 Collection ${collectionName} already exists`);
        }
      }

      // Create indexes for better performance
      console.log('🔍 Creating database indexes...');

      // Users collection indexes
      const usersCollection = db.collection('users');
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      await usersCollection.createIndex({ user_type: 1 });
      await usersCollection.createIndex({ is_verified: 1 });

      // Jobs collection indexes
      const jobsCollection = db.collection('jobs');
      await jobsCollection.createIndex({ company_id: 1 });
      await jobsCollection.createIndex({ category_id: 1 });
      await jobsCollection.createIndex({ status: 1 });
      await jobsCollection.createIndex({ location: 1 });
      await jobsCollection.createIndex({ employment_type: 1 });
      await jobsCollection.createIndex({ experience_level: 1 });
      await jobsCollection.createIndex({ created_at: -1 });

      // Companies collection indexes
      const companiesCollection = db.collection('companies');
      await companiesCollection.createIndex({ name: 1 });
      await companiesCollection.createIndex({ is_featured: 1 });
      await companiesCollection.createIndex({ is_top_hiring: 1 });
      await companiesCollection.createIndex({ is_trusted: 1 });
      await companiesCollection.createIndex({ employer_id: 1 });

      // Job categories collection indexes
      const categoriesCollection = db.collection('job_categories');
      await categoriesCollection.createIndex({ tier: 1 });
      await categoriesCollection.createIndex({ parent_id: 1 });
      await categoriesCollection.createIndex({ name: 1 });

      // Applications collection indexes
      const applicationsCollection = db.collection('applications');
      await applicationsCollection.createIndex({ job_id: 1 });
      await applicationsCollection.createIndex({ job_seeker_id: 1 });
      await applicationsCollection.createIndex({ status: 1 });
      await applicationsCollection.createIndex({ applied_at: -1 });

      console.log('✅ Database setup completed successfully');
      
    } catch (error) {
      console.error('❌ Failed to setup database:', error);
      throw error;
    }
  }

  // Seed initial data (optional)
  async seedInitialData(): Promise<void> {
    try {
      if (!this.db) {
        await this.connect();
      }

      const db = this.getDb();
      
      console.log('🌱 Seeding initial data...');

      // Check if data already exists
      const usersCount = await db.collection('users').countDocuments();
      if (usersCount > 0) {
        console.log('📊 Data already exists, skipping seed');
        return;
      }

      // Seed job categories
      const categories = [
        {
          name: 'Information Technology',
          description: 'Software development, web development, system administration',
          tier: 1,
          icon: 'laptop',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Marketing & Sales',
          description: 'Digital marketing, sales, business development',
          tier: 1,
          icon: 'megaphone',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Finance & Accounting',
          description: 'Financial analysis, accounting, auditing',
          tier: 1,
          icon: 'dollar-sign',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Human Resources',
          description: 'HR management, recruitment, employee relations',
          tier: 1,
          icon: 'users',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Healthcare',
          description: 'Medical, nursing, healthcare administration',
          tier: 1,
          icon: 'heart',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await db.collection('job_categories').insertMany(categories);
      console.log('📂 Seeded job categories');

      // Create admin user
      const adminUser = {
        email: 'admin@megajobnepal.com',
        password_hash: 'hashed_password_here', // You should hash this properly
        user_type: 'admin',
        full_name: 'System Administrator',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      await db.collection('users').insertOne(adminUser);
      console.log('👤 Created admin user');

      console.log('✅ Initial data seeded successfully');
      
    } catch (error) {
      console.error('❌ Failed to seed initial data:', error);
      throw error;
    }
  }
}

// Global connection instance
let mongoConnection: MongoDBConnection | null = null;

export function getMongoConnection(): MongoDBConnection {
  if (!mongoConnection) {
    mongoConnection = new MongoDBConnection();
  }
  return mongoConnection;
}

// Connection helper functions
export async function connectToMongoDB(): Promise<MongoDBConnection> {
  const connection = getMongoConnection();
  await connection.connect();
  return connection;
}

export async function getDatabase(): Promise<Db> {
  const connection = await connectToMongoDB();
  return connection.getDb();
}

export async function closeMongoDB(): Promise<void> {
  if (mongoConnection) {
    await mongoConnection.disconnect();
    mongoConnection = null;
  }
}

// Helper function to safely handle MongoDB operations
export async function withMongoDB<T>(
  operation: (db: Db) => Promise<T>
): Promise<T> {
  const connection = await connectToMongoDB();
  const db = connection.getDb();
  return await operation(db);
}

// Export connection string for reference (without credentials in logs)
export const connectionInfo = {
  uri: uri.replace(/\/\/.*@/, '//***:***@'),
  database: dbName,
  options
};

console.log('🔧 MongoDB configuration loaded:', {
  database: dbName,
  uri: uri.replace(/\/\/.*@/, '//***:***@')
});