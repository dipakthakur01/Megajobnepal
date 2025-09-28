// Browser-compatible authentication service
import { User } from './mongodb-types';
import { env } from './env';

// Simple JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  userType: string;
  iat?: number;
  exp?: number;
}

// Simple base64 encode/decode for browser
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

// Simple browser-compatible password hashing (for demo purposes)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'megajobnepal_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Browser-compatible JWT creation (simplified for demo)
function createSimpleJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (7 * 24 * 60 * 60); // 7 days
  
  const fullPayload = { ...payload, iat: now, exp };
  
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload));
  
  // In a real implementation, you'd sign this with a secret
  // For demo purposes, we'll just create a simple signature
  const signature = base64UrlEncode(`${headerB64}.${payloadB64}.${env.JWT_SECRET}`);
  
  return `${headerB64}.${payloadB64}.${signature}`;
}

// Browser-compatible JWT verification (simplified for demo)
function verifySimpleJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson) as JWTPayload;
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Mock database for browser-only demo
class BrowserMockDB {
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

  // Initialize with default data
  async initializeDefaultData(): Promise<void> {
    const users = this.getData<User>('users');
    
    // Create default admin if it doesn't exist
    if (!users.find(user => user.email === 'admin@megajobnepal.com')) {
      await this.createUser({
        email: 'admin@megajobnepal.com',
        password_hash: await hashPassword('admin123'),
        full_name: 'MegaJobNepal Admin',
        user_type: 'admin',
        is_verified: true,
      });
    }

    // Create demo job seeker
    if (!users.find(user => user.email === 'jobseeker@demo.com')) {
      await this.createUser({
        email: 'jobseeker@demo.com',
        password_hash: await hashPassword('demo123'),
        full_name: 'Demo Job Seeker',
        user_type: 'job_seeker',
        is_verified: true,
        profile: {
          bio: 'Experienced software developer',
          skills: ['JavaScript', 'React', 'Node.js'],
          location: 'Kathmandu, Nepal',
        },
      });
    }

    // Create demo employer
    if (!users.find(user => user.email === 'employer@demo.com')) {
      await this.createUser({
        email: 'employer@demo.com',
        password_hash: await hashPassword('demo123'),
        full_name: 'Demo Employer',
        user_type: 'employer',
        is_verified: true,
      });
    }
  }
}

// Browser-compatible auth service
export class BrowserAuthService {
  private mockDB = new BrowserMockDB();

  constructor() {
    // Initialize default data when the service is created
    this.mockDB.initializeDefaultData().catch(console.error);
  }

  // Generate OTP (6-digit number)
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP (mock implementation for browser)
  async sendOTPEmail(email: string, otp: string, userName: string): Promise<boolean> {
    // In browser environment, we'll show the OTP in console
    console.log(`📧 OTP Email for ${userName} (${email}): ${otp}`);
    
    // For development, also show an alert
    if (env.NODE_ENV === 'development') {
      setTimeout(() => {
        alert(`Development Mode: OTP for ${email} is ${otp}`);
      }, 500);
    }
    
    return true;
  }

  // Sign up a new user
  async signUp(userData: {
    email: string;
    password: string;
    full_name: string;
    user_type: 'job_seeker' | 'employer';
    phone_number?: string;
  }): Promise<{ user: User; token: string } | { error: string }> {
    try {
      // Check if user already exists
      const existingUser = await this.mockDB.getUserByEmail(userData.email);
      if (existingUser) {
        return { error: 'User with this email already exists' };
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Generate OTP
      const otp = this.generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create user
      const user = await this.mockDB.createUser({
        email: userData.email,
        password_hash: hashedPassword,
        full_name: userData.full_name,
        user_type: userData.user_type,
        phone_number: userData.phone_number,
        is_verified: false,
        otp_code: otp,
        otp_expires_at: otpExpiresAt,
      });

      // Send OTP email
      await this.sendOTPEmail(userData.email, otp, userData.full_name);

      // Generate token
      const token = createSimpleJWT({
        userId: user.id!,
        email: user.email,
        userType: user.user_type,
      });

      return { user, token };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'Failed to create account' };
    }
  }

  // Sign in user
  async signIn(email: string, password: string): Promise<{ user: User; token: string } | { error: string }> {
    try {
      // Find user
      const user = await this.mockDB.getUserByEmail(email);
      if (!user) {
        return { error: 'Invalid email or password' };
      }

      // Verify password
      const hashedPassword = await hashPassword(password);
      if (user.password_hash !== hashedPassword) {
        return { error: 'Invalid email or password' };
      }

      // Generate token
      const token = createSimpleJWT({
        userId: user.id!,
        email: user.email,
        userType: user.user_type,
      });

      return { user, token };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'Failed to sign in' };
    }
  }

  // Verify OTP
  async verifyOTP(userId: string, otp: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await this.mockDB.getUserById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (!user.otp_code || !user.otp_expires_at) {
        return { success: false, error: 'No OTP found for this user' };
      }

      if (user.otp_code !== otp) {
        return { success: false, error: 'Invalid OTP' };
      }

      if (new Date() > user.otp_expires_at) {
        return { success: false, error: 'OTP has expired' };
      }

      // Mark user as verified and clear OTP
      await this.mockDB.updateUser(userId, {
        is_verified: true,
        otp_code: undefined,
        otp_expires_at: undefined,
      });

      return { success: true };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, error: 'Failed to verify OTP' };
    }
  }

  // Resend OTP
  async resendOTP(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await this.mockDB.getUserById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (user.is_verified) {
        return { success: false, error: 'User is already verified' };
      }

      const otp = this.generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await this.mockDB.updateUser(userId, {
        otp_code: otp,
        otp_expires_at: otpExpiresAt,
      });

      await this.sendOTPEmail(user.email, otp, user.full_name);

      return { success: true };
    } catch (error) {
      console.error('Resend OTP error:', error);
      return { success: false, error: 'Failed to resend OTP' };
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await this.mockDB.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return { success: true };
      }

      // For browser demo, we'll just show the reset instructions
      console.log(`🔐 Password reset requested for ${email}`);
      
      if (env.NODE_ENV === 'development') {
        alert(`Development Mode: Password reset link sent to ${email}. In production, this would be sent via email.`);
      }

      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Failed to send password reset email' };
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = verifySimpleJWT(token);
      if (!payload) {
        return { success: false, error: 'Invalid or expired reset token' };
      }

      const hashedPassword = await hashPassword(newPassword);
      
      await this.mockDB.updateUser(payload.userId, {
        password_hash: hashedPassword,
      });

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Failed to reset password' };
    }
  }

  // Get current user
  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const payload = verifySimpleJWT(token);
      if (!payload) {
        return null;
      }

      return await this.mockDB.getUserById(payload.userId);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Update profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      return await this.mockDB.updateUser(userId, updates);
    } catch (error) {
      console.error('Update profile error:', error);
      return null;
    }
  }

  // Generate token
  generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return createSimpleJWT(payload);
  }

  // Verify token
  verifyToken(token: string): JWTPayload | null {
    return verifySimpleJWT(token);
  }
}

// Global browser auth service instance
export const browserAuthService = new BrowserAuthService();