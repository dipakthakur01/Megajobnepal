# MegaJobNepal Database Setup

This document explains how to set up and configure the database for your MegaJobNepal application.

## Database Schema Overview

The MegaJobNepal application uses PostgreSQL through Supabase with the following key entities:

### Core Tables

1. **users** - All user types (job seekers, employers, admins, HR)
2. **job_seekers** - Extended profile information for job seekers
3. **companies** - Company profiles and information
4. **employers** - Links users to companies with permissions
5. **jobs** - Job postings with 5-tier classification system
6. **job_categories** - Predefined job categories
7. **job_locations** - Available job locations
8. **job_applications** - Application submissions and tracking
9. **payments** - Payment records for job postings
10. **payment_plans** - Pricing tiers for different job types

### Supporting Tables

- **blog_posts** & **blog_categories** - Content management
- **site_settings** - Configuration and settings
- **notifications** - User notifications
- **admin_logs** - Admin activity tracking
- **saved_jobs** - User job bookmarks
- **company_followers** - Company following system

## Job Tier System

The application supports 5 job tiers with different pricing and features:

1. **MegaJob** (₹15,000 for 60 days)
   - Featured placement
   - Top search results
   - Premium badge
   - Extended visibility

2. **Premium Job** (₹8,000 for 45 days)
   - Enhanced visibility
   - Premium badge
   - Priority in search

3. **Prime Job** (₹5,000 for 30 days)
   - Better visibility
   - Prime badge
   - Category priority

4. **Latest Job** (₹2,000 for 15 days)
   - Standard listing
   - Basic visibility

5. **Newspaper Job** (₹1,000 for 7 days)
   - Basic listing
   - Newspaper style display

## Setup Instructions

### 1. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Set up environment variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 2. Database Schema Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `/database/schema.sql`
4. Execute the SQL to create all tables and relationships

### 3. Seed Data Setup

1. In the SQL Editor, run the contents of `/database/seed-data.sql`
2. This will populate your database with:
   - Job categories (IT, Banking, Healthcare, etc.)
   - Job locations (Major cities in Nepal)
   - Payment plans for each job tier
   - Site settings
   - Sample companies and jobs

### 4. Application Setup

1. Start your application
2. If the database setup is incomplete, you'll see a setup screen
3. Click "Initialize Database" to complete the setup automatically
4. The application will verify and insert any missing data

## User Roles and Authentication

### Admin Users
- Email: admin@megajobnepal.com
- Role: admin
- Access: Full system administration

### HR Users  
- Email: hr@megajobnepal.com
- Role: hr
- Access: HR management features

### Default Passwords
- All default users use hashed passwords
- Update these in production with proper password hashing

## Database Security

### Row Level Security (RLS)
The database includes RLS policies to ensure:
- Users can only access their own data
- Employers can only manage their company's jobs
- Admins have full access to all data

### Data Protection
- Sensitive data is properly encrypted
- PII is handled according to privacy guidelines
- Audit logs track all admin actions

## API Integration

The application includes a comprehensive API layer (`/lib/supabase.ts`) with:

- User management functions
- Job CRUD operations
- Company management
- Application tracking
- Payment processing
- Content management

## Monitoring and Maintenance

### Database Health
- Monitor table sizes and performance
- Set up automated backups
- Track slow queries and optimize

### Data Cleanup
- Archive old job postings
- Clean up expired applications
- Maintain audit logs

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Validate environment variables

2. **Permission Errors**
   - Review RLS policies
   - Check user roles and permissions
   - Verify authentication state

3. **Data Consistency**
   - Run database integrity checks
   - Verify foreign key relationships
   - Check for orphaned records

### Support

For additional support:
1. Check Supabase documentation
2. Review application logs
3. Contact system administrator

## Future Enhancements

Planned database improvements:
- Advanced search indexing
- Real-time notifications
- Analytics and reporting tables
- Integration with payment gateways
- Mobile app support