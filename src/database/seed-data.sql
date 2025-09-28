-- Seed data for MegaJobNepal
-- This file contains initial data to populate the database

-- Insert default admin user
insert into users (id, email, password_hash, role, first_name, last_name, is_verified, is_active) 
values (
  uuid_generate_v4(),
  'admin@megajobnepal.com',
  '$2b$10$rKzMJTZZoZZKJKJKJKJKJOeU7vJJJJJJJJJJJJJJJJJJJJJJJJJJJJ', -- This should be properly hashed
  'admin',
  'Admin',
  'User',
  true,
  true
);

-- Insert HR user
insert into users (id, email, password_hash, role, first_name, last_name, is_verified, is_active) 
values (
  uuid_generate_v4(),
  'hr@megajobnepal.com',
  '$2b$10$rKzMJTZZoZZKJKJKJKJKJOeU7vJJJJJJJJJJJJJJJJJJJJJJJJJJJ', -- This should be properly hashed
  'hr',
  'HR',
  'Manager',
  true,
  true
);

-- Insert job categories
insert into job_categories (name, slug, description, icon) values
('Information Technology', 'information-technology', 'Software development, IT support, cybersecurity, and tech roles', 'laptop'),
('Banking & Finance', 'banking-finance', 'Banking, accounting, financial analysis, and insurance', 'credit-card'),
('Healthcare', 'healthcare', 'Medical, nursing, pharmacy, and healthcare administration', 'heart'),
('Education', 'education', 'Teaching, training, educational administration', 'graduation-cap'),
('Marketing & Sales', 'marketing-sales', 'Digital marketing, sales, business development', 'trending-up'),
('Engineering', 'engineering', 'Civil, mechanical, electrical, and other engineering fields', 'cog'),
('Human Resources', 'human-resources', 'HR management, recruitment, employee relations', 'users'),
('Customer Service', 'customer-service', 'Customer support, call center, client relations', 'headphones'),
('Hospitality & Tourism', 'hospitality-tourism', 'Hotels, restaurants, travel, event management', 'map-pin'),
('Media & Communications', 'media-communications', 'Journalism, content creation, public relations', 'megaphone'),
('Government & NGO', 'government-ngo', 'Government jobs, NGO, development sector', 'building'),
('Construction & Real Estate', 'construction-real-estate', 'Construction, architecture, property management', 'home'),
('Transportation & Logistics', 'transportation-logistics', 'Delivery, supply chain, transportation services', 'truck'),
('Legal', 'legal', 'Legal services, law firms, paralegal work', 'scale'),
('Others', 'others', 'Miscellaneous job categories', 'more-horizontal');

-- Insert job locations (major cities in Nepal)
insert into job_locations (city, state, country) values
('Kathmandu', 'Bagmati', 'Nepal'),
('Pokhara', 'Gandaki', 'Nepal'),
('Lalitpur', 'Bagmati', 'Nepal'),
('Bhaktapur', 'Bagmati', 'Nepal'),
('Chitwan', 'Bagmati', 'Nepal'),
('Butwal', 'Lumbini', 'Nepal'),
('Dharan', 'Koshi', 'Nepal'),
('Birgunj', 'Madhesh', 'Nepal'),
('Janakpur', 'Madhesh', 'Nepal'),
('Nepalgunj', 'Lumbini', 'Nepal'),
('Biratnagar', 'Koshi', 'Nepal'),
('Hetauda', 'Bagmati', 'Nepal'),
('Itahari', 'Koshi', 'Nepal'),
('Dhangadhi', 'Sudurpashchim', 'Nepal'),
('Mahendranagar', 'Sudurpashchim', 'Nepal');

-- Insert payment plans for different job tiers
insert into payment_plans (name, job_tier, price, duration_days, features) values
('MegaJob Premium', 'mega_job', 15000.00, 60, ARRAY['Featured placement', 'Top search results', 'Premium badge', 'Extended visibility', 'Priority support']),
('Premium Job', 'premium_job', 8000.00, 45, ARRAY['Enhanced visibility', 'Premium badge', 'Priority in search', 'Featured in category']),
('Prime Job', 'prime_job', 5000.00, 30, ARRAY['Better visibility', 'Prime badge', 'Category priority']),
('Latest Job', 'latest_job', 2000.00, 15, ARRAY['Standard listing', 'Basic visibility']),
('Newspaper Job', 'newspaper_job', 1000.00, 7, ARRAY['Basic listing', 'Newspaper style display']);

-- Insert blog categories
insert into blog_categories (name, slug, description) values
('Job Market News', 'job-market-news', 'Latest trends and news in the job market'),
('Career Tips', 'career-tips', 'Tips and advice for job seekers'),
('Interview Guides', 'interview-guides', 'Interview preparation and tips'),
('Salary Insights', 'salary-insights', 'Salary trends and compensation analysis'),
('Industry Updates', 'industry-updates', 'Updates from various industries'),
('Company Spotlights', 'company-spotlights', 'Featured companies and employer branding'),
('Skill Development', 'skill-development', 'Professional development and skill building'),
('Remote Work', 'remote-work', 'Remote work opportunities and tips');

-- Insert default site settings
insert into site_settings (key, value, type, description, group_name, is_public) values
('site_name', 'MegaJobNepal', 'text', 'Website name', 'general', true),
('site_tagline', 'Nepal''s Premier Job Portal', 'text', 'Website tagline', 'general', true),
('contact_email', 'contact@megajobnepal.com', 'text', 'Primary contact email', 'contact', true),
('contact_phone', '+977-1-4567890', 'text', 'Primary contact phone', 'contact', true),
('address', 'Kathmandu, Nepal', 'text', 'Company address', 'contact', true),
('facebook_url', 'https://facebook.com/megajobnepal', 'text', 'Facebook page URL', 'social', true),
('linkedin_url', 'https://linkedin.com/company/megajobnepal', 'text', 'LinkedIn page URL', 'social', true),
('twitter_url', 'https://twitter.com/megajobnepal', 'text', 'Twitter profile URL', 'social', true),
('jobs_per_page', '20', 'number', 'Number of jobs to display per page', 'display', false),
('featured_jobs_count', '8', 'number', 'Number of featured jobs on homepage', 'display', false),
('job_posting_enabled', 'true', 'boolean', 'Enable job posting feature', 'features', false),
('user_registration_enabled', 'true', 'boolean', 'Enable user registration', 'features', false),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', 'system', false),
('analytics_code', '', 'text', 'Google Analytics tracking code', 'analytics', false),
('meta_description', 'Find your dream job in Nepal with MegaJobNepal - the leading job portal connecting job seekers with top employers.', 'text', 'Default meta description', 'seo', true),
('meta_keywords', 'jobs nepal, job portal nepal, employment nepal, career nepal', 'text', 'Default meta keywords', 'seo', true);

-- Insert sample companies
insert into companies (name, slug, description, industry, company_size, website_url, city, email, is_verified) values
('TechNepal Solutions', 'technepal-solutions', 'Leading software development company in Nepal providing innovative IT solutions.', 'Information Technology', 'medium', 'https://technepal.com', 'Kathmandu', 'hr@technepal.com', true),
('Himalayan Bank Limited', 'himalayan-bank', 'One of Nepal''s premier commercial banks offering comprehensive banking services.', 'Banking & Finance', 'large', 'https://himalayanbank.com', 'Kathmandu', 'careers@himalayanbank.com', true),
('Everest Insurance', 'everest-insurance', 'Trusted insurance company providing life and general insurance services.', 'Insurance', 'medium', 'https://everestinsurance.com', 'Kathmandu', 'jobs@everestinsurance.com', true),
('Nepal Telecom', 'nepal-telecom', 'National telecommunications service provider of Nepal.', 'Telecommunications', 'enterprise', 'https://ntc.net.np', 'Kathmandu', 'recruitment@ntc.net.np', true),
('Sunrise Bank', 'sunrise-bank', 'Modern commercial bank with digital banking solutions.', 'Banking & Finance', 'large', 'https://sunrisebank.com', 'Kathmandu', 'hr@sunrisebank.com', true);

-- Insert sample jobs
with sample_company as (
  select id from companies where slug = 'technepal-solutions' limit 1
), 
it_category as (
  select id from job_categories where slug = 'information-technology' limit 1
),
ktm_location as (
  select id from job_locations where city = 'Kathmandu' limit 1
)
insert into jobs (title, slug, description, requirements, company_id, category_id, location_id, employment_type, experience_level, salary_min, salary_max, job_tier, status, is_featured, published_at) 
select 
  'Senior Full Stack Developer',
  'senior-full-stack-developer-technepal',
  'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
  'Bachelor''s degree in Computer Science or related field. 3+ years of experience with React, Node.js, and databases. Strong problem-solving skills.',
  sample_company.id,
  it_category.id,
  ktm_location.id,
  'full_time',
  'senior_level',
  80000,
  120000,
  'premium_job',
  'active',
  true,
  now()
from sample_company, it_category, ktm_location;

-- Add more sample data as needed...