// Authentication configuration for MegaJobNepal
// Since we're using MongoDB with browser-based auth, these are just placeholder values

export const projectId = "mongodb-megajobnepal";
export const publicAnonKey = "mongodb-browser-auth";

export const isSupabaseConfigured = () => {
  // Always return false since we're using MongoDB now
  return false;
};

export const isMongoDBConfigured = () => {
  // Check if MongoDB is properly set up by looking for localStorage keys
  try {
    const dbKeys = [
      'mongodb_megajobnepal_job_categories',
      'mongodb_megajobnepal_companies',
      'mongodb_megajobnepal_users'
    ];
    
    for (const key of dbKeys) {
      const data = localStorage.getItem(key);
      if (data && data !== '[]' && data !== 'null') {
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
};