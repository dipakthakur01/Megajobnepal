import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { dbService, User } from './mongodb';
import { env } from './env';

// JWT Token management
export interface JWTPayload {
  userId: string;
  email: string;
  userType: string;
  iat?: number;
  exp?: number;
}

export class AuthService {
  private emailTransporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initEmailTransporter();
  }

  private initEmailTransporter() {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.emailTransporter = nodemailer.createTransporter({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }
  }

  // Password hashing
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // JWT token operations
  generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // OTP generation and verification
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  isOTPValid(otpExpiresAt: Date): boolean {
    return new Date() <= otpExpiresAt;
  }

  // Email sending
  async sendOTPEmail(email: string, otp: string, userName: string): Promise<boolean> {
    if (!this.emailTransporter) {
      console.log(`OTP for ${email}: ${otp} (Email not configured)`);
      return true; // For development, consider OTP sent
    }

    try {
      await this.emailTransporter.sendMail({
        from: env.SMTP_USER,
        to: email,
        subject: 'Your MegaJobNepal Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6600;">MegaJobNepal - Email Verification</h2>
            <p>Hello ${userName},</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #FF6600; font-size: 32px; margin: 0;">${otp}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email from MegaJobNepal. Please do not reply to this email.
            </p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string, userName: string): Promise<boolean> {
    if (!this.emailTransporter) {
      console.log(`Password reset token for ${email}: ${resetToken} (Email not configured)`);
      return true;
    }

    try {
      const resetLink = `${env.APP_URL}/reset-password?token=${resetToken}`;
      
      await this.emailTransporter.sendMail({
        from: env.SMTP_USER,
        to: email,
        subject: 'Reset Your MegaJobNepal Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6600;">MegaJobNepal - Password Reset</h2>
            <p>Hello ${userName},</p>
            <p>You requested to reset your password. Click the link below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #FF6600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email from MegaJobNepal. Please do not reply to this email.
            </p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  // User authentication methods
  async signUp(userData: {
    email: string;
    password: string;
    full_name: string;
    user_type: 'job_seeker' | 'employer' | 'admin';
    phone_number?: string;
  }): Promise<{ user: User; token: string } | { error: string }> {
    try {
      // Check if user already exists
      const existingUser = await dbService.getUserByEmail(userData.email);
      if (existingUser) {
        return { error: 'User with this email already exists' };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);

      // Generate OTP
      const otp = this.generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create user
      const user = await dbService.createUser({
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
      const token = this.generateToken({
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

  async signIn(email: string, password: string): Promise<{ user: User; token: string } | { error: string }> {
    try {
      // Find user
      const user = await dbService.getUserByEmail(email);
      if (!user) {
        return { error: 'Invalid email or password' };
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        return { error: 'Invalid email or password' };
      }

      // Generate token
      const token = this.generateToken({
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

  async verifyOTP(userId: string, otp: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await dbService.getUserById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (!user.otp_code || !user.otp_expires_at) {
        return { success: false, error: 'No OTP found for this user' };
      }

      if (user.otp_code !== otp) {
        return { success: false, error: 'Invalid OTP' };
      }

      if (!this.isOTPValid(user.otp_expires_at)) {
        return { success: false, error: 'OTP has expired' };
      }

      // Mark user as verified and clear OTP
      await dbService.updateUser(userId, {
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

  async resendOTP(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await dbService.getUserById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (user.is_verified) {
        return { success: false, error: 'User is already verified' };
      }

      const otp = this.generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await dbService.updateUser(userId, {
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

  async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await dbService.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return { success: true };
      }

      const resetToken = this.generateToken({
        userId: user.id!,
        email: user.email,
        userType: 'password_reset',
      });

      await this.sendPasswordResetEmail(email, resetToken, user.full_name);

      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Failed to send password reset email' };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = this.verifyToken(token);
      if (!payload || payload.userType !== 'password_reset') {
        return { success: false, error: 'Invalid or expired reset token' };
      }

      const hashedPassword = await this.hashPassword(newPassword);
      
      await dbService.updateUser(payload.userId, {
        password_hash: hashedPassword,
      });

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Failed to reset password' };
    }
  }

  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const payload = this.verifyToken(token);
      if (!payload || payload.userType === 'password_reset') {
        return null;
      }

      return await dbService.getUserById(payload.userId);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      return await dbService.updateUser(userId, updates);
    } catch (error) {
      console.error('Update profile error:', error);
      return null;
    }
  }
}

// Global auth service instance
export const authService = new AuthService();