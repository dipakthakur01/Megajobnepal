# MegaJobNepal Authentication Setup Guide

This guide will help you resolve the "failed to fetch" errors and set up the authentication system properly.

## Quick Test Access

Visit `/auth-test` in your application to access the comprehensive authentication testing interface that includes:

- Real-time debug information
- Health checks for server connectivity
- All authentication flows (signup, login, OTP verification, password reset)
- Configuration status monitoring

## Issues Fixed

### 1. "Failed to fetch" Error Resolution

**Root Cause**: Supabase environment variables were not configured.

**Solution**: 
- Added prompts for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables
- Enhanced error handling with detailed debugging information
- Added configuration validation checks

### 2. Enhanced Error Handling

**Improvements**:
- Better error messages that explain the actual issue
- Network connectivity checks
- Configuration validation
- Development vs production environment detection

### 3. Debug Information System

**New Features**:
- `AuthDebugInfo` component shows real-time configuration status
- Server health check endpoint with database connectivity test
- Environment variable validation
- Common troubleshooting suggestions

## Setup Steps

### 1. Configure Supabase Environment Variables

You'll be prompted to enter:
- **VITE_SUPABASE_URL**: Your Supabase project URL (e.g., `https://your-project.supabase.co`)
- **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous/public key

### 2. Backend Environment Variables

The following are automatically configured:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` 
- `SUPABASE_ANON_KEY`

### 3. Test Authentication Flow

1. Visit `/auth-test` in your application
2. Click "Debug Auth Issues" if you see errors
3. Check the configuration status
4. Test each authentication flow:
   - Signup with OTP verification
   - Login
   - Password reset
   - Profile management

## Authentication Features

### Complete OTP-based Signup Flow
- Email-based user registration
- OTP verification (6-digit code)
- Role-based account creation (job_seeker, employer, admin)
- Automatic email confirmation

### Secure Login System
- Email/password authentication
- Separate admin login endpoint
- Session validation
- Role-based access control

### Password Management
- Forgot password with token-based reset
- Secure password change with current password verification
- Token expiration handling

### User Management
- Profile updates
- Account status management
- Role verification
- Session persistence

## API Endpoints

All endpoints are prefixed with `/make-server-81837d53/`:

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/login` - User login
- `POST /auth/admin-login` - Admin login
- `POST /auth/logout` - Logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/change-password` - Change password

### System
- `GET /health` - Health check with database connectivity test

## Troubleshooting

### Common Issues

1. **"Failed to fetch"**
   - Check if Supabase environment variables are configured
   - Verify internet connectivity
   - Check browser console for detailed error messages

2. **"Network error"**
   - Ensure Supabase project is active
   - Verify the Supabase URL is correct
   - Check if the backend server is accessible

3. **"Unauthorized" errors**
   - Verify the Supabase anon key is correct
   - Check if the user has the required permissions
   - Ensure the access token is valid

4. **OTP not working**
   - In development, OTP codes are logged to console
   - Check the server logs for OTP generation
   - Verify email service configuration (for production)

### Debug Tools

The debug interface provides:
- Configuration status checks
- Server connectivity tests
- Environment variable validation
- Real-time error monitoring
- Common issue suggestions

## Development Notes

- OTP codes are displayed in development mode for testing
- Password reset tokens are shown in development for testing
- All authentication data is stored securely in Supabase
- Session validation ensures security across requests
- CORS is properly configured for cross-origin requests

## Production Considerations

1. **Email Service**: Implement proper email delivery for OTP and password reset
2. **Rate Limiting**: Add rate limiting for authentication endpoints
3. **Monitoring**: Set up proper logging and monitoring
4. **Security**: Review and harden security settings
5. **Performance**: Optimize database queries and caching

## Support

If you encounter any issues:

1. Check the debug interface at `/auth-test`
2. Review browser console for detailed error messages
3. Verify your Supabase configuration
4. Test with the provided authentication flows

The authentication system is now fully functional with comprehensive error handling and debugging capabilities.