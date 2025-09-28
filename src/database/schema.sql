-- MegaJobNepal Database Schema
-- This file contains all the SQL commands to set up the complete database schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('job_seeker', 'employer', 'admin', 'hr');
create type job_tier as enum ('mega_job', 'premium_job', 'prime_job', 'latest_job', 'newspaper_job');
create type job_status as enum ('active', 'inactive', 'expired', 'draft');
create type application_status as enum ('pending', 'viewed', 'shortlisted', 'rejected', 'hired');
create type payment_status as enum ('pending', 'completed', 'failed', 'refunded');
create type employment_type as enum ('full_time', 'part_time', 'contract', 'internship', 'freelance');
create type experience_level as enum ('entry_level', 'mid_level', 'senior_level', 'executive');
create type company_size as enum ('startup', 'small', 'medium', 'large', 'enterprise');

-- Users table (handles all user types)
create table users (
  id uuid default uuid_generate_v4() primary key,
  email varchar(255) unique not null,
  password_hash varchar(255) not null,
  role user_role not null default 'job_seeker',
  first_name varchar(100),
  last_name varchar(100),
  phone varchar(20),
  profile_image text,
  is_verified boolean default false,
  is_active boolean default true,
  last_login timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Job seekers profile
create table job_seekers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  date_of_birth date,
  gender varchar(20),
  address text,
  city varchar(100),
  country varchar(100) default 'Nepal',
  resume_url text,
  cover_letter text,
  skills text[], -- Array of skills
  experience_years integer default 0,
  expected_salary_min integer,
  expected_salary_max integer,
  education_level varchar(100),
  university varchar(200),
  degree varchar(200),
  graduation_year integer,
  linkedin_url text,
  portfolio_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Companies table
create table companies (
  id uuid default uuid_generate_v4() primary key,
  name varchar(200) not null,
  slug varchar(200) unique not null,
  description text,
  industry varchar(100),
  company_size company_size,
  founded_year integer,
  website_url text,
  logo_url text,
  banner_url text,
  address text,
  city varchar(100),
  country varchar(100) default 'Nepal',
  phone varchar(20),
  email varchar(255),
  linkedin_url text,
  facebook_url text,
  twitter_url text,
  is_verified boolean default false,
  is_featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Employers table (links users to companies)
create table employers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  position varchar(100),
  is_primary_contact boolean default false,
  can_post_jobs boolean default true,
  can_manage_applications boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Job categories
create table job_categories (
  id uuid default uuid_generate_v4() primary key,
  name varchar(100) not null,
  slug varchar(100) unique not null,
  description text,
  icon varchar(50),
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

-- Job locations
create table job_locations (
  id uuid default uuid_generate_v4() primary key,
  city varchar(100) not null,
  state varchar(100),
  country varchar(100) default 'Nepal',
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Jobs table
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  title varchar(200) not null,
  slug varchar(200) unique not null,
  description text not null,
  requirements text,
  responsibilities text,
  benefits text,
  company_id uuid references companies(id) on delete cascade,
  category_id uuid references job_categories(id),
  location_id uuid references job_locations(id),
  employment_type employment_type not null,
  experience_level experience_level,
  min_experience integer default 0,
  max_experience integer,
  salary_min integer,
  salary_max integer,
  salary_negotiable boolean default false,
  job_tier job_tier not null default 'latest_job',
  status job_status default 'draft',
  is_featured boolean default false,
  is_urgent boolean default false,
  application_deadline date,
  posted_by uuid references users(id),
  views_count integer default 0,
  applications_count integer default 0,
  published_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Job applications
create table job_applications (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references jobs(id) on delete cascade,
  job_seeker_id uuid references job_seekers(id) on delete cascade,
  status application_status default 'pending',
  cover_letter text,
  resume_url text,
  additional_documents text[],
  notes text, -- Internal notes from employer
  viewed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(job_id, job_seeker_id) -- Prevent duplicate applications
);

-- Payment plans
create table payment_plans (
  id uuid default uuid_generate_v4() primary key,
  name varchar(100) not null,
  job_tier job_tier not null,
  price decimal(10,2) not null,
  duration_days integer not null,
  features text[],
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

-- Payments
create table payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  plan_id uuid references payment_plans(id),
  job_id uuid references jobs(id) on delete cascade,
  amount decimal(10,2) not null,
  currency varchar(3) default 'NPR',
  status payment_status default 'pending',
  payment_method varchar(50),
  transaction_id varchar(100),
  paid_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Blog/News categories
create table blog_categories (
  id uuid default uuid_generate_v4() primary key,
  name varchar(100) not null,
  slug varchar(100) unique not null,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Blog/News posts
create table blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title varchar(200) not null,
  slug varchar(200) unique not null,
  content text not null,
  excerpt text,
  featured_image text,
  category_id uuid references blog_categories(id),
  author_id uuid references users(id),
  is_published boolean default false,
  is_featured boolean default false,
  views_count integer default 0,
  tags text[],
  meta_title varchar(200),
  meta_description text,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Site settings
create table site_settings (
  id uuid default uuid_generate_v4() primary key,
  key varchar(100) unique not null,
  value text,
  type varchar(50) default 'text', -- text, number, boolean, json
  description text,
  group_name varchar(100),
  is_public boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Admin logs
create table admin_logs (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references users(id),
  action varchar(100) not null,
  target_type varchar(50), -- users, jobs, companies, etc.
  target_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default now()
);

-- Job views tracking
create table job_views (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references jobs(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  ip_address inet,
  viewed_at timestamp with time zone default now()
);

-- Saved jobs
create table saved_jobs (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references jobs(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(job_id, user_id)
);

-- Company followers
create table company_followers (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references companies(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(company_id, user_id)
);

-- Notifications
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  title varchar(200) not null,
  message text not null,
  type varchar(50) not null, -- job_alert, application_update, system, etc.
  is_read boolean default false,
  related_id uuid, -- ID of related entity (job, application, etc.)
  related_type varchar(50), -- Type of related entity
  created_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index idx_users_email on users(email);
create index idx_users_role on users(role);
create index idx_jobs_company_id on jobs(company_id);
create index idx_jobs_category_id on jobs(category_id);
create index idx_jobs_status on jobs(status);
create index idx_jobs_tier on jobs(job_tier);
create index idx_jobs_published_at on jobs(published_at);
create index idx_applications_job_id on job_applications(job_id);
create index idx_applications_job_seeker_id on job_applications(job_seeker_id);
create index idx_applications_status on job_applications(status);
create index idx_blog_posts_published on blog_posts(is_published, published_at);
create index idx_notifications_user_id on notifications(user_id, is_read);

-- Create triggers for updated_at timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at before update on users
  for each row execute function update_updated_at_column();

create trigger update_job_seekers_updated_at before update on job_seekers
  for each row execute function update_updated_at_column();

create trigger update_companies_updated_at before update on companies
  for each row execute function update_updated_at_column();

create trigger update_employers_updated_at before update on employers
  for each row execute function update_updated_at_column();

create trigger update_jobs_updated_at before update on jobs
  for each row execute function update_updated_at_column();

create trigger update_job_applications_updated_at before update on job_applications
  for each row execute function update_updated_at_column();

create trigger update_blog_posts_updated_at before update on blog_posts
  for each row execute function update_updated_at_column();

create trigger update_site_settings_updated_at before update on site_settings
  for each row execute function update_updated_at_column();