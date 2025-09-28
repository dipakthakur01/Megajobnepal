// Browser-compatible database service for development
import { User, Company, Job, JobCategory, Application } from './mongodb-types';

class BrowserDBService {
  private getStorageKey(collection: string): string {
    return `megajobnepal_${collection}`;
  }

  private getData<T>(collection: string): T[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(collection));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setData<T>(collection: string, data: T[]): void {
    try {
      localStorage.setItem(this.getStorageKey(collection), JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${collection}:`, error);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Connection check
  async checkConnection(): Promise<boolean> {
    try {
      // Test localStorage access
      const testKey = 'megajobnepal_connection_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // User operations
  async createUser(userData: Omit<User, '_id' | 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const users = this.getData<User>('users');
    const now = new Date();
    
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };
    
    users.push(newUser);
    this.setData('users', users);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = this.getData<User>('users');
    return users.find(user => user.email === email) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const users = this.getData<User>('users');
    return users.find(user => user.id === id) || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = this.getData<User>('users');
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updated_at: new Date(),
    };
    
    this.setData('users', users);
    return users[userIndex];
  }

  // Company operations
  async createCompany(companyData: Omit<Company, '_id' | 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    const companies = this.getData<Company>('companies');
    const now = new Date();
    
    const newCompany: Company = {
      ...companyData,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };
    
    companies.push(newCompany);
    this.setData('companies', companies);
    return newCompany;
  }

  async getCompanies(filter: any = {}): Promise<Company[]> {
    const companies = this.getData<Company>('companies');
    
    // Simple filtering
    if (filter.is_featured === true) {
      return companies.filter(c => c.is_featured);
    }
    if (filter.is_top_hiring === true) {
      return companies.filter(c => c.is_top_hiring);
    }
    
    return companies;
  }

  async getCompanyById(id: string): Promise<Company | null> {
    const companies = this.getData<Company>('companies');
    return companies.find(company => company.id === id) || null;
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    const companies = this.getData<Company>('companies');
    const companyIndex = companies.findIndex(company => company.id === id);
    
    if (companyIndex === -1) return null;
    
    companies[companyIndex] = {
      ...companies[companyIndex],
      ...updates,
      updated_at: new Date(),
    };
    
    this.setData('companies', companies);
    return companies[companyIndex];
  }

  // Job operations
  async createJob(jobData: Omit<Job, '_id' | 'id' | 'created_at' | 'updated_at'>): Promise<Job> {
    const jobs = this.getData<Job>('jobs');
    const now = new Date();
    
    const newJob: Job = {
      ...jobData,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };
    
    jobs.push(newJob);
    this.setData('jobs', jobs);
    return newJob;
  }

  async getJobs(filter: any = {}, limit?: number, skip?: number): Promise<Job[]> {
    let jobs = this.getData<Job>('jobs');
    
    // Simple filtering
    if (filter.status) {
      jobs = jobs.filter(job => job.status === filter.status);
    }
    if (filter.company_id) {
      jobs = jobs.filter(job => job.company_id === filter.company_id);
    }
    
    // Pagination
    if (skip) {
      jobs = jobs.slice(skip);
    }
    if (limit) {
      jobs = jobs.slice(0, limit);
    }
    
    return jobs;
  }

  async getJobById(id: string): Promise<Job | null> {
    const jobs = this.getData<Job>('jobs');
    return jobs.find(job => job.id === id) || null;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    const jobs = this.getData<Job>('jobs');
    const jobIndex = jobs.findIndex(job => job.id === id);
    
    if (jobIndex === -1) return null;
    
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...updates,
      updated_at: new Date(),
    };
    
    this.setData('jobs', jobs);
    return jobs[jobIndex];
  }

  async deleteJob(id: string): Promise<boolean> {
    const jobs = this.getData<Job>('jobs');
    const initialLength = jobs.length;
    const filteredJobs = jobs.filter(job => job.id !== id);
    
    this.setData('jobs', filteredJobs);
    return filteredJobs.length < initialLength;
  }

  // Job Category operations
  async createJobCategory(categoryData: Omit<JobCategory, '_id' | 'id' | 'created_at' | 'updated_at'>): Promise<JobCategory> {
    const categories = this.getData<JobCategory>('job_categories');
    const now = new Date();
    
    const newCategory: JobCategory = {
      ...categoryData,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };
    
    categories.push(newCategory);
    this.setData('job_categories', categories);
    return newCategory;
  }

  async getJobCategories(filter: any = {}): Promise<JobCategory[]> {
    const categories = this.getData<JobCategory>('job_categories');
    
    if (filter.tier) {
      return categories.filter(cat => cat.tier === filter.tier);
    }
    
    return categories;
  }

  async getJobCategoryById(id: string): Promise<JobCategory | null> {
    const categories = this.getData<JobCategory>('job_categories');
    return categories.find(category => category.id === id) || null;
  }

  // Application operations
  async createApplication(applicationData: Omit<Application, '_id' | 'id' | 'applied_at' | 'updated_at'>): Promise<Application> {
    const applications = this.getData<Application>('applications');
    const now = new Date();
    
    const newApplication: Application = {
      ...applicationData,
      id: this.generateId(),
      applied_at: now,
      updated_at: now,
    };
    
    applications.push(newApplication);
    this.setData('applications', applications);
    return newApplication;
  }

  async getApplications(filter: any = {}): Promise<Application[]> {
    let applications = this.getData<Application>('applications');
    
    if (filter.job_id) {
      applications = applications.filter(app => app.job_id === filter.job_id);
    }
    if (filter.job_seeker_id) {
      applications = applications.filter(app => app.job_seeker_id === filter.job_seeker_id);
    }
    
    return applications;
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application | null> {
    const applications = this.getData<Application>('applications');
    const appIndex = applications.findIndex(app => app.id === id);
    
    if (appIndex === -1) return null;
    
    applications[appIndex] = {
      ...applications[appIndex],
      ...updates,
      updated_at: new Date(),
    };
    
    this.setData('applications', applications);
    return applications[appIndex];
  }

  // Database setup
  async setupDatabase(): Promise<void> {
    console.log('Setting up browser database...');
    
    // Initialize collections if they don't exist
    if (this.getData<User>('users').length === 0) {
      console.log('Initializing user collection');
    }
    
    if (this.getData<Company>('companies').length === 0) {
      console.log('Initializing company collection');
    }
    
    if (this.getData<Job>('jobs').length === 0) {
      console.log('Initializing job collection');
    }
    
    if (this.getData<JobCategory>('job_categories').length === 0) {
      console.log('Initializing job category collection');
    }
    
    if (this.getData<Application>('applications').length === 0) {
      console.log('Initializing application collection');
    }
    
    console.log('Browser database setup completed');
  }

  // Initialize with default data
  async initializeWithDefaultData(): Promise<void> {
    await this.setupDatabase();
    
    // This will be called from DatabaseSetup component
    // when user clicks "Initialize Database"
  }
}

// Global database service instance
export const browserDBService = new BrowserDBService();

// Timeout wrapper
export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    ),
  ]);
}