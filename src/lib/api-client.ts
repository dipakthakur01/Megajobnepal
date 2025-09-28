// API Client for MegaJobNepal Backend
// This handles communication between the frontend and the MongoDB backend server

const API_BASE_URL = 'http://localhost:3001/api';

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    try {
      this.token = localStorage.getItem('megajobnepal_auth_token');
    } catch (error) {
      console.warn('Could not load token from storage:', error);
    }
  }

  private saveTokenToStorage(token: string) {
    try {
      localStorage.setItem('megajobnepal_auth_token', token);
      this.token = token;
    } catch (error) {
      console.error('Could not save token to storage:', error);
    }
  }

  private removeTokenFromStorage() {
    try {
      localStorage.removeItem('megajobnepal_auth_token');
      this.token = null;
    } catch (error) {
      console.warn('Could not remove token from storage:', error);
    }
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    userType: 'job_seeker' | 'employer';
    phone?: string;
  }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.saveTokenToStorage(response.token);
    }

    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.saveTokenToStorage(response.token);
    }

    return response;
  }

  logout() {
    this.removeTokenFromStorage();
  }

  // User methods
  async getProfile() {
    return await this.request('/users/profile');
  }

  async updateProfile(profileData: any) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Jobs methods
  async getJobs(params: {
    page?: number;
    limit?: number;
    category?: string;
    location?: string;
    type?: string;
    search?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/jobs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.request(endpoint);
  }

  async getJob(id: string) {
    return await this.request(`/jobs/${id}`);
  }

  async createJob(jobData: any) {
    return await this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  // Companies methods
  async getCompanies(params: {
    page?: number;
    limit?: number;
    featured?: boolean;
    topHiring?: boolean;
  } = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/companies${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await this.request(endpoint);
  }

  // Applications methods
  async applyForJob(applicationData: {
    jobId: string;
    coverLetter?: string;
    resumeUrl?: string;
  }) {
    return await this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getApplications() {
    return await this.request('/applications');
  }

  // Health and status methods
  async getStatus() {
    try {
      const response = await fetch(`${this.baseURL}/status`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Backend status check failed:', error);
      return { status: 'Disconnected', error: error.message };
    }
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Backend health check failed:', error);
      return { status: 'Error', error: error.message };
    }
  }

  // Check if backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      const health = await this.checkHealth();
      return health.status === 'OK';
    } catch (error) {
      console.warn('Backend is not available, falling back to localStorage mode');
      return false;
    }
  }

  // Get current authentication status
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create and export a singleton instance
export const apiClient = new APIClient();

// Export the class for testing or custom instances
export default APIClient;