// Browser-compatible MongoDB service for MegaJobNepal
// This implementation uses localStorage to simulate MongoDB in the browser environment

import { env } from './env';

// MongoDB connection simulation
let dbConnected = false;
let dbInstance: BrowserMongoDB | null = null;

// Browser-compatible cursor that implements MongoDB cursor interface
class BrowserCursor<T> {
  private data: T[];
  private skipCount = 0;
  private limitCount?: number;

  constructor(data: T[]) {
    this.data = Array.isArray(data) ? [...data] : [];
  }

  skip(count: number): this {
    this.skipCount = Math.max(0, count);
    return this;
  }

  limit(count: number): this {
    this.limitCount = Math.max(1, count);
    return this;
  }

  toArray(): Promise<T[]> {
    return new Promise((resolve) => {
      try {
        let result = [...this.data];
        
        // Apply skip
        if (this.skipCount > 0) {
          result = result.slice(this.skipCount);
        }
        
        // Apply limit
        if (this.limitCount && this.limitCount > 0) {
          result = result.slice(0, this.limitCount);
        }
        
        resolve(result);
      } catch (error) {
        console.error('Error in cursor toArray:', error);
        resolve([]);
      }
    });
  }
}

// Browser-compatible collection that implements MongoDB collection interface
class BrowserCollection<T> {
  constructor(private name: string, private db: BrowserMongoDB) {}

  insertOne(doc: any): Promise<{ insertedId: string }> {
    return new Promise((resolve, reject) => {
      try {
        const data = this.db.getCollectionData(this.name);
        const id = this.generateId();
        const newDoc = { ...doc, _id: id };
        data.push(newDoc);
        this.db.setCollectionData(this.name, data);
        resolve({ insertedId: id });
      } catch (error) {
        reject(error);
      }
    });
  }

  findOne(filter: any = {}): Promise<T | null> {
    return new Promise((resolve) => {
      try {
        const data = this.db.getCollectionData(this.name);
        const result = this.findInArray(data, filter);
        resolve(result || null);
      } catch (error) {
        console.error('Error in findOne:', error);
        resolve(null);
      }
    });
  }

  find(filter: any = {}): BrowserCursor<T> {
    try {
      const data = this.db.getCollectionData(this.name);
      const filtered = filter && Object.keys(filter).length > 0 
        ? data.filter(item => this.matchesFilter(item, filter))
        : data;
      return new BrowserCursor<T>(filtered);
    } catch (error) {
      console.error('Error in find:', error);
      return new BrowserCursor<T>([]);
    }
  }

  findOneAndUpdate(
    filter: any, 
    update: any, 
    options: { returnDocument?: 'before' | 'after' } = {}
  ): Promise<T | null> {
    return new Promise((resolve) => {
      try {
        const data = this.db.getCollectionData(this.name);
        const index = data.findIndex(item => this.matchesFilter(item, filter));
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        const oldDoc = data[index];
        const updatedDoc = this.applyUpdate(oldDoc, update);
        data[index] = updatedDoc;
        this.db.setCollectionData(this.name, data);
        
        resolve(options.returnDocument === 'before' ? oldDoc : updatedDoc);
      } catch (error) {
        console.error('Error in findOneAndUpdate:', error);
        resolve(null);
      }
    });
  }

  deleteOne(filter: any): Promise<{ deletedCount: number }> {
    return new Promise((resolve) => {
      try {
        const data = this.db.getCollectionData(this.name);
        const index = data.findIndex(item => this.matchesFilter(item, filter));
        
        if (index === -1) {
          resolve({ deletedCount: 0 });
          return;
        }
        
        data.splice(index, 1);
        this.db.setCollectionData(this.name, data);
        resolve({ deletedCount: 1 });
      } catch (error) {
        console.error('Error in deleteOne:', error);
        resolve({ deletedCount: 0 });
      }
    });
  }

  createIndex(indexSpec: any, options?: any): Promise<void> {
    return new Promise((resolve) => {
      console.log(`Created index on ${this.name}:`, indexSpec);
      resolve();
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private findInArray(data: any[], filter: any): any {
    return data.find(item => this.matchesFilter(item, filter));
  }

  private matchesFilter(item: any, filter: any): boolean {
    if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
      return true;
    }
    
    for (const [key, value] of Object.entries(filter)) {
      if (key === '$or') {
        const orConditions = value as any[];
        if (!Array.isArray(orConditions)) continue;
        const matches = orConditions.some(condition => this.matchesFilter(item, condition));
        if (!matches) return false;
      } else if (item[key] !== value) {
        return false;
      }
    }
    
    return true;
  }

  private applyUpdate(doc: any, update: any): any {
    const result = { ...doc };
    
    if (update.$set && typeof update.$set === 'object') {
      Object.assign(result, update.$set);
    }
    
    return result;
  }
}

// Browser-compatible MongoDB database simulation
class BrowserMongoDB {
  private collections: Map<string, any[]> = new Map();

  constructor() {
    this.loadCollections();
  }

  private getStorageKey(collection: string): string {
    return `mongodb_${env.MONGODB_DB_NAME}_${collection}`;
  }

  private loadCollections(): void {
    try {
      const collections = ['users', 'companies', 'jobs', 'job_categories', 'applications'];
      collections.forEach(collectionName => {
        try {
          const data = localStorage.getItem(this.getStorageKey(collectionName));
          this.collections.set(collectionName, data ? JSON.parse(data) : []);
        } catch (error) {
          console.warn(`Failed to load collection ${collectionName}:`, error);
          this.collections.set(collectionName, []);
        }
      });
    } catch (error) {
      console.error('Failed to load collections from localStorage:', error);
    }
  }

  private saveCollection(name: string): void {
    try {
      const data = this.collections.get(name) || [];
      localStorage.setItem(this.getStorageKey(name), JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save collection ${name}:`, error);
    }
  }

  collection<T>(name: string): BrowserCollection<T> {
    if (!this.collections.has(name)) {
      this.collections.set(name, []);
    }
    return new BrowserCollection<T>(name, this);
  }

  admin() {
    return {
      ping: () => Promise.resolve({ ok: 1 })
    };
  }

  getCollectionData(name: string): any[] {
    return this.collections.get(name) || [];
  }

  setCollectionData(name: string, data: any[]): void {
    this.collections.set(name, Array.isArray(data) ? data : []);
    this.saveCollection(name);
  }
}

// Connection management
export async function connectToMongoDB(): Promise<BrowserMongoDB> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    console.log('Connecting to MongoDB (Browser Mode)...');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    dbInstance = new BrowserMongoDB();
    dbConnected = true;
    
    console.log('Connected to MongoDB successfully (Browser Mode)');
    return dbInstance;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getDB(): Promise<BrowserMongoDB> {
  if (!dbInstance) {
    return await connectToMongoDB();
  }
  return dbInstance;
}

export async function closeConnection(): Promise<void> {
  if (dbInstance) {
    dbInstance = null;
    dbConnected = false;
    console.log('MongoDB connection closed');
  }
}

// Collection interfaces
export interface User {
  _id?: string;
  id?: string;
  email: string;
  password_hash: string;
  user_type: 'job_seeker' | 'employer' | 'admin';
  full_name: string;
  phone_number?: string;
  is_verified: boolean;
  otp_code?: string;
  otp_expires_at?: Date;
  created_at: Date;
  updated_at: Date;
  profile?: {
    bio?: string;
    skills?: string[];
    experience?: string;
    education?: string;
    location?: string;
    resume_url?: string;
    profile_image_url?: string;
  };
}

export interface Company {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  cover_image_url?: string;
  location?: string;
  industry?: string;
  size?: string;
  founded_year?: number;
  is_featured: boolean;
  is_top_hiring: boolean;
  is_trusted: boolean;
  employer_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Job {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  employment_type: string;
  experience_level: string;
  location: string;
  is_remote: boolean;
  company_id: string;
  category_id: string;
  status: 'active' | 'inactive' | 'expired';
  posted_by: string;
  expires_at?: Date;
  cover_image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface JobCategory {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  tier: number;
  parent_id?: string;
  icon?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Application {
  _id?: string;
  id?: string;
  job_id: string;
  job_seeker_id: string;
  cover_letter?: string;
  resume_url?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  applied_at: Date;
  updated_at: Date;
}

// Database service class
export class DatabaseService {
  private db: BrowserMongoDB | null = null;

  async init(): Promise<void> {
    if (!this.db) {
      this.db = await getDB();
    }
  }

  private async getCollection<T>(name: string): Promise<BrowserCollection<T>> {
    await this.init();
    return this.db!.collection<T>(name);
  }

  // User operations
  async createUser(user: Omit<User, '_id' | 'created_at' | 'updated_at'>): Promise<User> {
    const collection = await this.getCollection<User>('users');
    const now = new Date();
    const newUser = {
      ...user,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };
    
    const result = await collection.insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection<User>('users');
    return await collection.findOne({ email });
  }

  async getUserById(id: string): Promise<User | null> {
    const collection = await this.getCollection<User>('users');
    return await collection.findOne({ $or: [{ id }, { _id: id }] });
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const collection = await this.getCollection<User>('users');
    return await collection.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      { $set: { ...updates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
  }

  // Company operations
  async createCompany(company: Omit<Company, '_id' | 'created_at' | 'updated_at'>): Promise<Company> {
    const collection = await this.getCollection<Company>('companies');
    const now = new Date();
    const newCompany = {
      ...company,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };
    
    const result = await collection.insertOne(newCompany);
    return { ...newCompany, _id: result.insertedId };
  }

  async getCompanies(filter: any = {}): Promise<Company[]> {
    try {
      const collection = await this.getCollection<Company>('companies');
      const companies = await collection.find(filter).toArray();
      return Array.isArray(companies) ? companies : [];
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  }

  async getCompanyById(id: string): Promise<Company | null> {
    const collection = await this.getCollection<Company>('companies');
    return await collection.findOne({ $or: [{ id }, { _id: id }] });
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    const collection = await this.getCollection<Company>('companies');
    return await collection.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      { $set: { ...updates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
  }

  // Job operations
  async createJob(job: Omit<Job, '_id' | 'created_at' | 'updated_at'>): Promise<Job> {
    const collection = await this.getCollection<Job>('jobs');
    const now = new Date();
    const newJob = {
      ...job,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };
    
    const result = await collection.insertOne(newJob);
    return { ...newJob, _id: result.insertedId };
  }

  async getJobs(filter: any = {}, limit?: number, skip?: number): Promise<Job[]> {
    try {
      const collection = await this.getCollection<Job>('jobs');
      let query = collection.find(filter);
      
      if (skip) query = query.skip(skip);
      if (limit) query = query.limit(limit);
      
      const jobs = await query.toArray();
      return Array.isArray(jobs) ? jobs : [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    const collection = await this.getCollection<Job>('jobs');
    return await collection.findOne({ $or: [{ id }, { _id: id }] });
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    const collection = await this.getCollection<Job>('jobs');
    return await collection.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      { $set: { ...updates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
  }

  async deleteJob(id: string): Promise<boolean> {
    const collection = await this.getCollection<Job>('jobs');
    const result = await collection.deleteOne({ $or: [{ id }, { _id: id }] });
    return result.deletedCount > 0;
  }

  // Job Category operations
  async createJobCategory(category: Omit<JobCategory, '_id' | 'created_at' | 'updated_at'>): Promise<JobCategory> {
    const collection = await this.getCollection<JobCategory>('job_categories');
    const now = new Date();
    const newCategory = {
      ...category,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };
    
    const result = await collection.insertOne(newCategory);
    return { ...newCategory, _id: result.insertedId };
  }

  // Add cache for job categories to prevent repeated queries
  private categoriesCache: { data: JobCategory[]; timestamp: number } | null = null;
  private readonly CATEGORIES_CACHE_TTL = 30000; // 30 seconds

  async getJobCategories(filter: any = {}): Promise<JobCategory[]> {
    try {
      // Use cached data if available and recent (for empty filter only)
      const now = Date.now();
      const isEmptyFilter = Object.keys(filter).length === 0;
      
      if (isEmptyFilter && this.categoriesCache && 
          (now - this.categoriesCache.timestamp) < this.CATEGORIES_CACHE_TTL) {
        return this.categoriesCache.data;
      }

      const collection = await this.getCollection<JobCategory>('job_categories');
      
      // For quick checks, limit the results to speed up the query
      let query = collection.find(filter);
      
      if (isEmptyFilter) {
        query = query.limit(20); // Reasonable limit for categories
      }
      
      const categories = await query.toArray();
      const result = Array.isArray(categories) ? categories : [];
      
      // Cache empty filter results
      if (isEmptyFilter) {
        this.categoriesCache = {
          data: result,
          timestamp: now
        };
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching job categories:', error);
      return [];
    }
  }

  async getJobCategoryById(id: string): Promise<JobCategory | null> {
    const collection = await this.getCollection<JobCategory>('job_categories');
    return await collection.findOne({ $or: [{ id }, { _id: id }] });
  }

  // Application operations
  async createApplication(application: Omit<Application, '_id' | 'applied_at' | 'updated_at'>): Promise<Application> {
    const collection = await this.getCollection<Application>('applications');
    const now = new Date();
    const newApplication = {
      ...application,
      id: this.generateId(),
      applied_at: now,
      updated_at: now,
    };
    
    const result = await collection.insertOne(newApplication);
    return { ...newApplication, _id: result.insertedId };
  }

  async getApplications(filter: any = {}): Promise<Application[]> {
    const collection = await this.getCollection<Application>('applications');
    return await collection.find(filter).toArray();
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application | null> {
    const collection = await this.getCollection<Application>('applications');
    return await collection.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      { $set: { ...updates, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Add connection check cache to prevent loops
  private connectionCheckCache: { result: boolean; timestamp: number } | null = null;
  private readonly CONNECTION_CACHE_TTL = 5000; // 5 seconds

  async checkConnection(): Promise<boolean> {
    try {
      // Use cached result if recent
      const now = Date.now();
      if (this.connectionCheckCache && 
          (now - this.connectionCheckCache.timestamp) < this.CONNECTION_CACHE_TTL) {
        return this.connectionCheckCache.result;
      }

      // Quick localStorage availability check (no timeout needed)
      const testKey = 'mongodb_connection_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      // Simple db initialization check
      if (!this.db) {
        await this.init();
      }
      
      // Cache the result
      this.connectionCheckCache = {
        result: true,
        timestamp: now
      };
      
      return true;
    } catch (error) {
      console.error('MongoDB connection check failed:', error);
      
      // Cache the failure too
      this.connectionCheckCache = {
        result: false,
        timestamp: Date.now()
      };
      
      return false;
    }
  }

  async setupDatabase(): Promise<void> {
    try {
      console.log('Starting database setup...');
      await this.init();
      
      // Create indexes for better performance - with timeout protection
      const indexPromises = [
        this.createIndexSafely('users', { email: 1 }),
        this.createIndexSafely('users', { user_type: 1 }),
        this.createIndexSafely('jobs', { company_id: 1 }),
        this.createIndexSafely('jobs', { category_id: 1 }),
        this.createIndexSafely('jobs', { status: 1 }),
        this.createIndexSafely('companies', { name: 1 }),
        this.createIndexSafely('applications', { job_id: 1 })
      ];

      // Wait for all indexes with timeout
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Index creation timeout')), 2000)
      );

      await Promise.race([
        Promise.all(indexPromises),
        timeoutPromise
      ]);

      console.log('MongoDB database setup completed');
    } catch (error) {
      console.warn('Database setup completed with warnings:', error.message);
      // Don't throw - allow setup to complete even if indexes fail
    }
  }

  private async createIndexSafely(collectionName: string, indexSpec: any): Promise<void> {
    try {
      const collection = await this.getCollection(collectionName);
      await collection.createIndex(indexSpec);
    } catch (error) {
      console.warn(`Failed to create index on ${collectionName}:`, error);
      // Continue even if individual index creation fails
    }
  }
}

// Global database service instance
export const dbService = new DatabaseService();