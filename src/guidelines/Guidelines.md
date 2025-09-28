# MegaJobNepal Development Guidelines

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- VS Code (recommended)
- Git

### Initial Setup from VS Code

**⚡ Quick Start (Recommended):**
```bash
npm run startup
```
This automated script handles everything for you!

**Manual Setup:**
1. **Clone and Open Project**
   ```bash
   git clone <repository-url>
   cd megajobnepal
   code .
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Visit `http://localhost:5173`
   - The app will automatically detect if database setup is needed

### First Time Setup

When you first visit the application:

1. **Database Setup Screen**
   - If you see "Database Setup" screen, click "Run Database Setup"
   - This creates demo data in localStorage (MongoDB-compatible)
   - Wait for completion (usually 2-3 seconds)

2. **Demo Accounts Created**
   - Job Seeker, Employer, Admin, and HR accounts are auto-created
   - All demo accounts bypass OTP verification

3. **Ready to Use**
   - Homepage will load with sample jobs and companies
   - Login with demo credentials (see testing section below)

### Troubleshooting Common Issues

#### Website Not Loading
1. **Check Terminal for Errors**
   ```bash
   # Kill any existing processes
   pkill -f "vite"
   
   # Clear npm cache
   npm cache clean --force
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   
   # Start fresh
   npm run dev
   ```

2. **Clear Browser Data**
   - Clear localStorage: `localStorage.clear()`
   - Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`

3. **Port Issues**
   - If port 5173 is busy, Vite will auto-assign another port
   - Check terminal output for the correct URL

#### Database Setup Issues
1. **Clear Storage and Reset**
   ```javascript
   // In browser console
   localStorage.clear();
   location.reload();
   ```

2. **Manual Database Reset**
   - Delete all `mongodb_megajobnepal_*` keys from localStorage
   - Refresh page to trigger setup again

### Development Scripts

```bash
# Main development server
npm run dev                 # Start Vite dev server (port 5173)

# Alternative builds
npm run build              # Production build
npm run preview           # Preview production build

# Backend services (if needed later)
npm run dev:backend       # Start Express server
npm run dev:full         # Start both frontend and backend

# Database utilities
npm run migrate:mongodb   # Migrate to real MongoDB (future)
```

### Project Structure Overview

```
megajobnepal/
├── App.tsx                 # Main app component
├── components/            # React components
│   ├── admin/            # Admin panel components
│   ├── auth/             # Authentication components
│   └── ui/               # UI components (shadcn)
├── lib/                  # Utilities and services
├── styles/               # Global CSS and Tailwind
└── Guidelines.md         # This file
```

### Quick Debugging Checklist

1. **✅ Node.js version:** `node --version` (should be v18+)
2. **✅ Dependencies installed:** `npm list` shows packages
3. **✅ Dev server running:** Terminal shows "Local: http://localhost:5173"
4. **✅ Browser console:** No errors in developer tools
5. **✅ Database setup:** localStorage has demo data keys

---

## 🔐 Authentication System

### User Types
- **Job Seekers:** Register/login from main website, access job search and applications
- **Employers:** Register/login from main website, access job posting and candidate management  
- **Admins:** Login directly from `/admin/login` URL, access full system management

### Login Flow
1. **Job Seekers & Employers:** Use main website login/signup form
2. **Admins:** Navigate to `megajobnepal.com/admin/login` 
3. **Dashboard Access:** After login, users are redirected to their respective dashboards in new tabs
4. **Email Verification:** Required for new registrations (demo accounts auto-verified)

## 🧪 Developer Testing Credentials

⚠️ **FOR DEVELOPMENT USE ONLY** - These accounts are automatically created during database setup:

### Job Seeker Test Account
- **Email:** `jobseeker.demo@megajobnepal.com`
- **Password:** `jobseeker123`

### Employer Test Account  
- **Email:** `employer.demo@megajobnepal.com`
- **Password:** `employer123`

### Admin Test Account
- **Email:** `admin.demo@megajobnepal.com` 
- **Password:** `admin123`

### HR Manager Test Account
- **Email:** `hr.demo@megajobnepal.com`
- **Password:** `hr123`

**Note:** These credentials are NOT displayed in the user interface but are available for development testing.

## 🧪 Testing Instructions

### Database Setup Process
1. Visit the application homepage
2. If "Database Setup" screen appears, click "Run Database Setup"
3. Wait for completion (automatically creates and verifies demo accounts)

### Login Testing
- **Job Seeker:** Use credentials above to access `/jobseeker-dashboard`
- **Employer:** Use credentials above to access `/employer-dashboard` 
- **Admin:** Use credentials above to access `/admin` panel
- **Demo accounts bypass OTP verification for immediate access**

### Admin Panel Features
- ✅ Dashboard with system statistics
- ✅ User Management (view, edit, delete users)
- ✅ Job Management (approve, edit, delete jobs)
- ✅ Company Management (verify companies)
- ✅ Site Settings and Configuration
- ✅ Reports and Analytics
- ✅ Blog and Content Management

### Troubleshooting
- **Login fails:** Clear browser storage and run database setup again
- **Admin panel blank:** Ensure user has admin role/user_type
- **Demo accounts not working:** Check browser console for setup errors

---

## MongoDB Connection Guide

### Current Setup (Browser-Based MongoDB Compatible Storage)

MegaJobNepal currently uses a MongoDB-compatible service that runs in the browser using localStorage as the storage backend. This provides the same MongoDB API interface for easy server deployment later.

#### How it Works:
1. **Local Storage Backend**: All data is stored in browser's localStorage
2. **MongoDB API Compatibility**: Uses the same method signatures as MongoDB
3. **Automatic Setup**: Database is automatically initialized on first run
4. **Demo Data**: Includes sample data for jobs, companies, users, etc.

#### Storage Structure:
```
localStorage keys:
- mongodb_megajobnepal_users (User accounts)
- mongodb_megajobnepal_companies (Company profiles)
- mongodb_megajobnepal_jobs (Job listings)
- mongodb_megajobnepal_job_categories (Job categories)
- mongodb_megajobnepal_applications (Job applications)
- mongodb_megajobnepal_skills (Skills database)
- mongodb_megajobnepal_subscriptions (Employer subscriptions)
```

### Migrating to Real MongoDB

When ready to deploy to production, follow these steps:

#### 1. Set Up MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Set up database user credentials
4. Whitelist your IP addresses
5. Get your connection string

#### 2. Environment Configuration
Create a `.env.local` file with:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/megajobnepal?retryWrites=true&w=majority
MONGODB_DB_NAME=megajobnepal
```

#### 3. Update the Database Service
Replace `/lib/mongodb-fixed.ts` with a real MongoDB connection:

```typescript
import { MongoClient, Db } from 'mongodb';

class MongoDBService {
  private client: MongoClient;
  private db: Db;

  async connect() {
    this.client = new MongoClient(process.env.MONGODB_URI!);
    await this.client.connect();
    this.db = this.client.db(process.env.MONGODB_DB_NAME);
  }

  // Add your collection methods here
}
```

#### 4. Data Migration
Use the migration script to export localStorage data and import into MongoDB:

```bash
node scripts/migrate-to-mongodb.js
```

#### 5. Authentication Integration
Update authentication to use:
- JWT tokens with proper signing
- Real email service (SendGrid, AWS SES)
- Password hashing with bcrypt
- Session management

### Development vs Production

#### Development (Current):
- ✅ Browser-based storage
- ✅ Mock email service (console logs)
- ✅ Demo accounts pre-created
- ✅ No external dependencies

#### Production (Future):
- 🔄 Real MongoDB database
- 🔄 Email service integration
- 🔄 Proper JWT signing
- 🔄 Server-side authentication
- 🔄 File upload to cloud storage

---

## Design Guidelines

### Color Scheme
- **Primary:** #FF6600 (Orange)
- **Secondary:** #007ACC (Blue) 
- **Accent:** #FFF4E6 (Light Orange)
- **Background:** #FFFFFF (White)
- **Text:** Dark gray/black

### Typography
- Base font size: 16px
- Use system default typography unless explicitly overridden
- Do not use Tailwind font classes unless specifically requested

### Component Guidelines
- Follow responsive design principles
- Use flexbox and grid for layouts
- Maintain consistent spacing and alignment
- Ensure accessibility standards are met

**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
