# Next.js Migration Guide

## Overview
This guide covers the migration from Vite to Next.js for the MegaJobNepal project.

## Key Changes Made

### 1. Project Structure
- Moved from Vite-based structure to Next.js App Router
- Created proper `app/` directory structure
- Set up route-based layouts and pages

### 2. Configuration Files
- **package.json**: Updated dependencies from Vite to Next.js
- **next.config.js**: Created Next.js configuration
- **tsconfig.json**: Updated for Next.js paths and configuration
- **tailwind.config.js**: Updated content paths for Next.js
- **middleware.ts**: Added authentication middleware

### 3. Environment Variables
- Changed from `import.meta.env.VITE_*` to `process.env.NEXT_PUBLIC_*`
- Created `.env.local.example` for environment setup
- Updated Supabase configuration to use Next.js env vars

### 4. Routing System
- Migrated from React Router to Next.js App Router
- Created proper layouts for different sections:
  - `/app/layout.tsx` - Root layout
  - `/app/(main)/layout.tsx` - Main app layout
  - `/app/admin/layout.tsx` - Admin layout

### 5. Image Handling
- Updated to use Next.js `Image` component
- Moved assets to `/public/images/` directory
- Updated logo imports

### 6. CSS and Styling
- Moved global CSS to `/app/globals.css`
- Maintained Tailwind v4 configuration
- Preserved custom animations and styles

## Migration Steps Required

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Update Image Assets
1. Copy your company logo to `/public/images/company-logo.png`
2. Update any other image imports as needed

### 4. Database Setup
- The existing database schema and setup should work as-is
- Supabase integration remains the same, just with updated env vars

## File Changes Summary

### New Files Created
- `/app/layout.tsx` - Root layout with metadata
- `/app/(main)/layout.tsx` - Main app layout wrapper
- `/app/(main)/client-layout.tsx` - Client-side logic for routing
- `/app/providers/AppProvider.tsx` - Next.js compatible providers
- `/app/globals.css` - Global styles for Next.js
- `/middleware.ts` - Authentication middleware
- `/next.config.js` - Next.js configuration
- `/next-env.d.ts` - Next.js type definitions
- `/env.local.example` - Environment variables template

### Updated Files
- `/package.json` - Next.js dependencies
- `/tsconfig.json` - Next.js TypeScript config
- `/tailwind.config.js` - Next.js content paths
- `/lib/supabase.ts` - Environment variable handling

### Removed Dependencies
- Vite and Vite-related packages
- React Router (replaced with Next.js routing)
- Vite-specific plugins and configuration

## Component Updates Required

Most existing components should work with minimal changes:

1. **Client Components**: Add `"use client"` directive to components that use:
   - `useState`, `useEffect`, `useContext`
   - Event handlers
   - Browser-only APIs

2. **Image Imports**: Update from relative imports to Next.js `Image` component where needed

3. **Navigation**: Replace React Router navigation with Next.js `useRouter` and `Link` components

## Testing the Migration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test all routes:
   - Home page: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin`
   - Job seeker dashboard: `http://localhost:3000/jobseeker-dashboard`
   - Employer dashboard: `http://localhost:3000/employer-dashboard`

3. Verify authentication flows work correctly

4. Test responsive design and all features

## Benefits of Migration

1. **Better Performance**: Next.js provides better optimization and caching
2. **SEO Friendly**: Server-side rendering improves SEO
3. **Better Developer Experience**: Improved hot reloading and development tools
4. **Production Ready**: Better build optimization and deployment options
5. **Middleware Support**: Built-in authentication and route protection
6. **Image Optimization**: Automatic image optimization with Next.js Image component

## Deployment Considerations

- Use Vercel, Netlify, or any platform that supports Next.js
- Set environment variables in your deployment platform
- Update any CI/CD pipelines from Vite build commands to Next.js commands

## Troubleshooting

### Common Issues
1. **Hydration Errors**: Add `suppressHydrationWarning` where needed
2. **Client-Side Code**: Ensure browser-only code is in client components
3. **Environment Variables**: Make sure they're prefixed with `NEXT_PUBLIC_` for client access

### Support
If you encounter issues during migration, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading)