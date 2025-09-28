# MegaJobNepal - Modern Job Portal

A comprehensive job portal website built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔍 Advanced job search and filtering
- 👔 Separate dashboards for employers and job seekers
- 🔐 Complete authentication system with OTP verification
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations
- ⚡ Visual scroll-to-top animations
- 🛡️ Admin panel for complete site management
- 🏢 Company profiles and job management
- 📊 Analytics and reporting
- 💼 5-tier job classification system

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Database, Auth, Storage)
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Motion (Framer Motion)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd megajobnepal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Development

### Running in VS Code

1. Open the project in VS Code
2. Install the recommended extensions (will be prompted)
3. Use `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and run "Tasks: Run Task" then select "dev"
4. Or simply run `npm run dev` in the integrated terminal

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Authentication components
│   ├── admin/          # Admin panel components
│   └── figma/          # Figma-specific components
├── lib/                # Utility libraries
├── styles/             # Global styles
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── assets/             # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Authentication System
- Email/password registration and login
- OTP verification via email
- Password reset functionality
- Role-based access control (Admin, Employer, Job Seeker)

### Job Management
- 5-tier job classification system
- Advanced filtering and search
- Company-specific job posting
- Application tracking

### Admin Panel
- Complete site management
- User and company management
- Job and payment oversight
- Analytics and reporting

### Visual Enhancements
- Smooth scroll-to-top animations
- Responsive design for all devices
- Modern UI with hover effects
- Loading states and transitions

## Database Setup

The application uses Supabase for the backend. Run the database setup by:

1. Navigate to `/auth-test` to set up the database tables
2. Follow the on-screen instructions to initialize the schema
3. The app will automatically detect when setup is complete

## Environment Setup

For Supabase configuration, update `/src/utils/supabase/info.tsx` with your project details, or use environment variables in production.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For support, please contact the development team or create an issue in the repository.