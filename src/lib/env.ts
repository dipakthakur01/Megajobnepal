// Environment helper that works with both Vite and Next.js
function getEnv() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Browser environment - use Vite's import.meta.env
    return (import.meta as any)?.env || {};
  }
  
  // Node.js environment - use process.env
  return process?.env || {};
}

const envVars = getEnv();

export const env = {
  // MongoDB configuration
  MONGODB_URI: envVars.VITE_MONGODB_URI || envVars.MONGODB_URI || "mongodb://localhost:27017",
  MONGODB_DB_NAME: envVars.VITE_MONGODB_DB_NAME || envVars.MONGODB_DB_NAME || "megajobnepal",
  
  // General configuration
  NODE_ENV: envVars.NODE_ENV || envVars.VITE_NODE_ENV || "development",
  
  // Application configuration
  APP_NAME: envVars.VITE_APP_NAME || envVars.NEXT_PUBLIC_APP_NAME || "MegaJobNepal",
  APP_URL: envVars.VITE_APP_URL || envVars.NEXT_PUBLIC_APP_URL || "http://localhost:5173",
  
  // File upload configuration (you might want to use a service like Cloudinary or AWS S3)
  UPLOAD_SERVICE: envVars.VITE_UPLOAD_SERVICE || envVars.UPLOAD_SERVICE || "local",
  CLOUDINARY_CLOUD_NAME: envVars.VITE_CLOUDINARY_CLOUD_NAME || envVars.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: envVars.VITE_CLOUDINARY_API_KEY || envVars.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET, // Server-side only
  
  // Email configuration (for OTP and notifications)
  SMTP_HOST: envVars.SMTP_HOST,
  SMTP_PORT: envVars.SMTP_PORT,
  SMTP_USER: envVars.SMTP_USER,
  SMTP_PASS: envVars.SMTP_PASS,
  
  // JWT configuration
  JWT_SECRET: envVars.JWT_SECRET || "your-jwt-secret-change-in-production",
  JWT_EXPIRES_IN: envVars.JWT_EXPIRES_IN || "7d",
};

export default env