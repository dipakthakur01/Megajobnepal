import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { getCookie, setCookie } from "npm:hono/cookie";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    credentials: true,
    maxAge: 600,
  }),
);

// Initialize Supabase clients
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,
);

// Utility functions
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateRandomToken(): string {
  return crypto.randomUUID();
}

async function verifyAuthToken(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user;
  } catch (error) {
    console.log('Token verification failed:', error);
    return null;
  }
}

async function checkAdminPermission(user: any) {
  if (!user) return false;
  
  const { data: userData, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (error || !userData) return false;
  return userData.role === 'admin';
}

// Authentication Middleware
const requireAuth = async (c: any, next: any) => {
  const user = await verifyAuthToken(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  c.set('user', user);
  await next();
};

const requireAdmin = async (c: any, next: any) => {
  const user = c.get('user');
  const isAdmin = await checkAdminPermission(user);
  if (!isAdmin) {
    return c.json({ error: 'Admin access required' }, 403);
  }
  await next();
};

// Health check endpoint
app.get("/make-server-81837d53/health", async (c) => {
  try {
    // Test database connection
    const testKey = `health_check_${Date.now()}`;
    await kv.set(testKey, { timestamp: new Date().toISOString() });
    const testValue = await kv.get(testKey);
    await kv.del(testKey);
    
    return c.json({ 
      status: "ok",
      timestamp: new Date().toISOString(),
      database: testValue ? "connected" : "error",
      environment: {
        supabase_url: Deno.env.get('SUPABASE_URL') ? 'configured' : 'missing',
        supabase_service_role_key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'configured' : 'missing',
        supabase_anon_key: Deno.env.get('SUPABASE_ANON_KEY') ? 'configured' : 'missing'
      }
    });
  } catch (error) {
    console.log('Health check error:', error);
    return c.json({ 
      status: "error", 
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Authentication Routes
app.post("/make-server-81837d53/auth/signup", async (c) => {
  try {
    const { email, password, firstName, lastName, role, phone } = await c.req.json();
    
    if (!email || !password || !firstName || !lastName || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409);
    }
    
    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Store signup data temporarily with OTP
    const tempSignupId = generateRandomToken();
    await kv.set(`signup:${tempSignupId}`, JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      otp,
      otpExpiry: otpExpiry.toISOString(),
      verified: false
    }));
    
    // TODO: Send OTP via email (implement with your email service)
    console.log(`OTP for ${email}: ${otp}`); // For development only
    
    return c.json({ 
      success: true, 
      tempSignupId,
      message: 'OTP sent to your email address',
      // Always return OTP for testing (remove in production)
      otp: otp
    });
    
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-81837d53/auth/verify-otp", async (c) => {
  try {
    const { tempSignupId, otp } = await c.req.json();
    
    if (!tempSignupId || !otp) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Get signup data
    const signupData = await kv.get(`signup:${tempSignupId}`);
    if (!signupData) {
      return c.json({ error: 'Invalid or expired signup session' }, 400);
    }
    
    const data = JSON.parse(signupData);
    
    // Check OTP expiry
    if (new Date() > new Date(data.otpExpiry)) {
      await kv.del(`signup:${tempSignupId}`);
      return c.json({ error: 'OTP expired' }, 400);
    }
    
    // Verify OTP
    if (data.otp !== otp) {
      return c.json({ error: 'Invalid OTP' }, 400);
    }
    
    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      user_metadata: { 
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role
      },
      email_confirm: true // Auto-confirm since we verified via OTP
    });
    
    if (authError) {
      console.log('Auth user creation error:', authError);
      return c.json({ error: 'Failed to create user account' }, 500);
    }
    
    // Create user profile in database
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
        phone: data.phone,
        is_verified: true,
        is_active: true
      })
      .select()
      .single();
    
    if (profileError) {
      console.log('Profile creation error:', profileError);
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return c.json({ error: 'Failed to create user profile' }, 500);
    }
    
    // Create role-specific profile if needed
    if (data.role === 'job_seeker') {
      await supabaseAdmin
        .from('job_seekers')
        .insert({
          user_id: authUser.user.id
        });
    } else if (data.role === 'employer') {
      await supabaseAdmin
        .from('employers')
        .insert({
          user_id: authUser.user.id
        });
    }
    
    // Clean up temporary signup data
    await kv.del(`signup:${tempSignupId}`);
    
    return c.json({ 
      success: true, 
      message: 'Account created successfully',
      user: userProfile
    });
    
  } catch (error) {
    console.log('OTP verification error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-81837d53/auth/resend-otp", async (c) => {
  try {
    const { tempSignupId } = await c.req.json();
    
    if (!tempSignupId) {
      return c.json({ error: 'Missing signup ID' }, 400);
    }
    
    // Get signup data
    const signupData = await kv.get(`signup:${tempSignupId}`);
    if (!signupData) {
      return c.json({ error: 'Invalid or expired signup session' }, 400);
    }
    
    const data = JSON.parse(signupData);
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    
    // Update with new OTP
    data.otp = otp;
    data.otpExpiry = otpExpiry.toISOString();
    
    await kv.set(`signup:${tempSignupId}`, JSON.stringify(data));
    
    // TODO: Send new OTP via email
    console.log(`New OTP for ${data.email}: ${otp}`); // For development only
    
    return c.json({ 
      success: true, 
      message: 'New OTP sent to your email',
      // Always return OTP for testing (remove in production)
      otp: otp
    });
    
  } catch (error) {
    console.log('Resend OTP error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-81837d53/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }
    
    // Sign in with Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.log('Supabase auth error:', error);
      let errorMessage = 'Invalid credentials';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Make sure you have signed up first.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address first.';
      }
      
      return c.json({ error: errorMessage }, 401);
    }
    
    // Get user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError || !userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    // Check if user is active
    if (!userProfile.is_active) {
      return c.json({ error: 'Account is deactivated' }, 403);
    }
    
    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
    
    return c.json({
      success: true,
      user: userProfile,
      session: data.session,
      access_token: data.session.access_token
    });
    
  } catch (error) {
    console.log('Login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-81837d53/auth/admin-login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }
    
    // Sign in with Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Get user profile and verify admin role
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .eq('role', 'admin')
      .single();
    
    if (profileError || !userProfile) {
      return c.json({ error: 'Admin access denied' }, 403);
    }
    
    // Check if user is active
    if (!userProfile.is_active) {
      return c.json({ error: 'Admin account is deactivated' }, 403);
    }
    
    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
    
    return c.json({
      success: true,
      user: userProfile,
      session: data.session,
      access_token: data.session.access_token
    });
    
  } catch (error) {
    console.log('Admin login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-81837d53/auth/logout", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    
    // Sign out from Supabase
    const { error } = await supabaseClient.auth.signOut();
    
    if (error) {
      console.log('Logout error:', error);
    }
    
    return c.json({ success: true, message: 'Logged out successfully' });
    
  } catch (error) {
    console.log('Logout error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-81837d53/auth/forgot-password", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Email required' }, 400);
    }
    
    // Check if user exists
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (!userProfile) {
      // Don't reveal if email exists or not for security
      return c.json({ success: true, message: 'If the email exists, you will receive a password reset link' });
    }
    
    // Generate password reset token
    const resetToken = generateRandomToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    // Store reset token
    await kv.set(`password_reset:${resetToken}`, JSON.stringify({
      email,
      expiry: resetExpiry.toISOString()
    }));
    
    // TODO: Send password reset email with resetToken
    console.log(`Password reset token for ${email}: ${resetToken}`); // For development only
    
    return c.json({ 
      success: true, 
      message: 'If the email exists, you will receive a password reset link',
      // Always return token for testing (remove in production)
      resetToken: resetToken
    });
    
  } catch (error) {
    console.log('Forgot password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-81837d53/auth/reset-password", async (c) => {
  try {
    const { resetToken, newPassword } = await c.req.json();
    
    if (!resetToken || !newPassword) {
      return c.json({ error: 'Reset token and new password required' }, 400);
    }
    
    if (newPassword.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters long' }, 400);
    }
    
    // Get reset token data
    const resetData = await kv.get(`password_reset:${resetToken}`);
    if (!resetData) {
      return c.json({ error: 'Invalid or expired reset token' }, 400);
    }
    
    const data = JSON.parse(resetData);
    
    // Check token expiry
    if (new Date() > new Date(data.expiry)) {
      await kv.del(`password_reset:${resetToken}`);
      return c.json({ error: 'Reset token expired' }, 400);
    }
    
    // Get user by email
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', data.email)
      .single();
    
    if (!userProfile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Update password in Supabase Auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userProfile.id,
      { password: newPassword }
    );
    
    if (updateError) {
      console.log('Password update error:', updateError);
      return c.json({ error: 'Failed to update password' }, 500);
    }
    
    // Clean up reset token
    await kv.del(`password_reset:${resetToken}`);
    
    return c.json({ success: true, message: 'Password updated successfully' });
    
  } catch (error) {
    console.log('Reset password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-81837d53/auth/profile", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    
    // Get complete user profile
    const { data: userProfile, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        job_seeker:job_seekers(*),
        employer:employers(*)
      `)
      .eq('id', user.id)
      .single();
    
    if (error || !userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    return c.json({ success: true, user: userProfile });
    
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put("/make-server-81837d53/auth/profile", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const updates = await c.req.json();
    
    // Sanitize updates - only allow certain fields
    const allowedFields = ['first_name', 'last_name', 'phone', 'profile_image'];
    const sanitizedUpdates: any = {};
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field];
      }
    }
    
    if (Object.keys(sanitizedUpdates).length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400);
    }
    
    sanitizedUpdates.updated_at = new Date().toISOString();
    
    // Update user profile
    const { data: updatedProfile, error } = await supabaseAdmin
      .from('users')
      .update(sanitizedUpdates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      console.log('Profile update error:', error);
      return c.json({ error: 'Failed to update profile' }, 500);
    }
    
    return c.json({ success: true, user: updatedProfile });
    
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-81837d53/auth/change-password", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { currentPassword, newPassword } = await c.req.json();
    
    if (!currentPassword || !newPassword) {
      return c.json({ error: 'Current password and new password required' }, 400);
    }
    
    if (newPassword.length < 6) {
      return c.json({ error: 'New password must be at least 6 characters long' }, 400);
    }
    
    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabaseClient.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });
    
    if (verifyError) {
      return c.json({ error: 'Current password is incorrect' }, 400);
    }
    
    // Update password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );
    
    if (updateError) {
      console.log('Password change error:', updateError);
      return c.json({ error: 'Failed to change password' }, 500);
    }
    
    return c.json({ success: true, message: 'Password changed successfully' });
    
  } catch (error) {
    console.log('Change password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// User Management Routes (Admin only)
app.get("/make-server-81837d53/admin/users", requireAuth, requireAdmin, async (c) => {
  try {
    const { role, status, page = 1, limit = 20 } = c.req.query();
    
    let query = supabaseAdmin
      .from('users')
      .select(`
        *,
        job_seeker:job_seekers(*),
        employer:employers(*)
      `)
      .order('created_at', { ascending: false });
    
    if (role) {
      query = query.eq('role', role);
    }
    
    if (status) {
      query = query.eq('is_active', status === 'active');
    }
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(offset, offset + parseInt(limit) - 1);
    
    const { data: users, error } = await query;
    
    if (error) {
      console.log('Get users error:', error);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }
    
    // Get total count
    const { count, error: countError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    return c.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.log('Get users error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put("/make-server-81837d53/admin/users/:id/status", requireAuth, requireAdmin, async (c) => {
  try {
    const userId = c.req.param('id');
    const { is_active } = await c.req.json();
    
    if (typeof is_active !== 'boolean') {
      return c.json({ error: 'is_active must be a boolean' }, 400);
    }
    
    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.log('Update user status error:', error);
      return c.json({ error: 'Failed to update user status' }, 500);
    }
    
    return c.json({ success: true, user: updatedUser });
    
  } catch (error) {
    console.log('Update user status error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.delete("/make-server-81837d53/admin/users/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const userId = c.req.param('id');
    const currentUser = c.get('user');
    
    // Prevent admin from deleting themselves
    if (userId === currentUser.id) {
      return c.json({ error: 'Cannot delete your own account' }, 400);
    }
    
    // Delete from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.log('Delete auth user error:', authError);
      return c.json({ error: 'Failed to delete user from authentication' }, 500);
    }
    
    // Delete from database (cascade should handle related records)
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (dbError) {
      console.log('Delete user from database error:', dbError);
      return c.json({ error: 'Failed to delete user from database' }, 500);
    }
    
    return c.json({ success: true, message: 'User deleted successfully' });
    
  } catch (error) {
    console.log('Delete user error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Session validation endpoint
app.get("/make-server-81837d53/auth/validate-session", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    
    // Get current user profile
    const { data: userProfile, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error || !userProfile || !userProfile.is_active) {
      return c.json({ error: 'Invalid session' }, 401);
    }
    
    return c.json({ success: true, user: userProfile });
    
  } catch (error) {
    console.log('Validate session error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);