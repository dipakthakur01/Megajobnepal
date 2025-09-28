# MegaJobNepal Login Testing Guide

## 🧪 Demo Account Testing

### Step 1: Database Setup
1. Visit the application homepage
2. If you see "Database Setup" screen, click "Run Database Setup"
3. Wait for setup to complete (creates demo accounts automatically)

### Step 2: Test Login Credentials

#### Job Seeker Account
- **Email:** `jobseeker.demo@megajobnepal.com`
- **Password:** `jobseeker123`
- **Access:** Go to homepage and click "Register/Login"

#### Employer Account  
- **Email:** `employer.demo@megajobnepal.com`
- **Password:** `employer123`
- **Access:** Go to homepage and click "Register/Login"

#### Admin Account
- **Email:** `admin.demo@megajobnepal.com`
- **Password:** `admin123`
- **Access:** Visit `/admin` directly or go to `/admin/login`

#### HR Manager Account
- **Email:** `hr.demo@megajobnepal.com`
- **Password:** `hr123`
- **Access:** Visit `/admin` directly or go to `/admin/login`

## 🔧 Troubleshooting

### If Login Fails:
1. **Check Browser Console** for error messages
2. **Clear Browser Storage:** Go to Developer Tools > Application > Storage > Clear All
3. **Refresh Database:** Delete all localStorage entries starting with "mongodb_"
4. **Restart Database Setup:** Refresh page and run database setup again

### Admin Panel Features to Test:
- [ ] Dashboard with statistics
- [ ] User Management (view, edit, delete users)
- [ ] Job Management (approve, edit, delete jobs)
- [ ] Company Management (verify companies)
- [ ] Site Settings and Configuration
- [ ] Reports and Analytics
- [ ] Blog and Content Management

### Expected Behavior:
- Demo accounts should login immediately without OTP verification
- Each user type should redirect to their respective dashboard
- Admin users should have access to all admin panel features
- Regular users should only see their permitted areas

## 🐛 Common Issues and Fixes:

1. **"Invalid email or password"** → Database setup not completed
2. **"Please verify your email first"** → Demo account verification failed
3. **Blank admin panel** → User role not set correctly
4. **404 errors** → Route configuration issue

## 📝 Testing Checklist:

- [ ] Job seeker can login and access dashboard
- [ ] Employer can login and access dashboard  
- [ ] Admin can login and access admin panel
- [ ] All admin panel sections load correctly
- [ ] Users can logout and login with different accounts
- [ ] Navigation between different user types works
- [ ] Demo accounts are auto-verified (no OTP required)