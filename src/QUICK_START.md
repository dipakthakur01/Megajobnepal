# MegaJobNepal - Quick Start Guide

Welcome to MegaJobNepal! This guide will get you up and running in minutes.

## 🚀 One-Command Setup

```bash
npm run startup
```

This automated script will:
- ✅ Check Node.js version (v18+ required)
- ✅ Install dependencies automatically
- ✅ Start the development server
- ✅ Open the app at http://localhost:5173

## 📱 First Time Setup

1. **Visit the App**: Open http://localhost:5173 in your browser
2. **Database Setup**: If you see a "Database Setup" screen, click the button
3. **Wait**: Demo data creation takes 2-3 seconds
4. **Ready**: Homepage loads with sample jobs and companies

## 🧪 Demo Login Credentials

### Job Seeker
- **Email**: `jobseeker.demo@megajobnepal.com`
- **Password**: `jobseeker123`

### Employer  
- **Email**: `employer.demo@megajobnepal.com`
- **Password**: `employer123`

### Admin
- **Email**: `admin.demo@megajobnepal.com`
- **Password**: `admin123`

## 🛠️ Manual Setup (if needed)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚨 Troubleshooting

### Website not loading?
1. **Clear browser data**: Press F12 → Console → Type `localStorage.clear()` → Enter
2. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Check terminal**: Look for any error messages

### Database setup fails?
1. **Reset storage**: In browser console, run `localStorage.clear()`
2. **Refresh page**: The setup will run again automatically
3. **Try incognito**: Sometimes browser extensions interfere

### Port 5173 busy?
- Vite will automatically use another port (check terminal output)
- Or kill processes: `pkill -f "vite"`

## 📖 Full Documentation

For detailed development guidelines, see:
- `/guidelines/Guidelines.md` - Complete development guide
- `/README.md` - Project overview and features

## 🎯 Next Steps

1. **Explore the App**: Browse jobs, companies, and features
2. **Test Authentication**: Login with demo accounts
3. **Admin Panel**: Visit `/admin` with admin credentials
4. **Development**: Start building new features!

---

**Need Help?** Check the browser console (F12) for error messages or refer to the troubleshooting guide above.