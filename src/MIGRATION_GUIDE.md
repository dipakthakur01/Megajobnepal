# Migration Guide - Moving to Proper React Structure

This guide shows how to move the existing components to the new `src/` structure.

## File Migration Map

All files need to be moved from root directories to the `src/` folder:

### Component Files
```
/components/*.tsx → /src/components/*.tsx
/components/ui/*.tsx → /src/components/ui/*.tsx  
/components/auth/*.tsx → /src/components/auth/*.tsx
/components/admin/*.tsx → /src/components/admin/*.tsx
/components/figma/*.tsx → /src/components/figma/*.tsx
```

### Library Files
```
/lib/*.ts → /src/lib/*.ts
/utils/** → /src/utils/**
```

### Style Files
```
/styles/*.css → /src/styles/*.css
```

## Import Updates Required

All components will need their imports updated. Here are the common patterns:

### Before (Current)
```typescript
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';
import companyLogo from 'figma:asset/...';
```

### After (New Structure)
```typescript
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';
// Replace figma assets with actual images or data URLs
const companyLogo = "/src/assets/company-logo.png";
// or use data URL as shown in App.tsx
```

## Key Changes

1. **Remove figma: imports** - Replace with actual image files or data URLs
2. **Remove Next.js imports** - Replace `import Link from 'next/link'` with proper React router or remove
3. **Update relative paths** - Ensure all imports work from the new `src/` structure

## Steps to Complete Migration

1. **Move component files one by one to maintain working state**
2. **Update imports in each moved file**
3. **Test each component as you move it**
4. **Remove the old file locations once confirmed working**

## Example Component Migration

Here's how to migrate a typical component like Header.tsx:

1. Copy `/components/Header.tsx` to `/src/components/Header.tsx`
2. Update imports:
   - Remove `import Link from 'next/link';` (not needed)
   - Change `import companyLogo from 'figma:asset/...'` to use actual logo
   - Update any relative imports if needed
3. Test the component works
4. Remove the old `/components/Header.tsx`

## Running After Migration

Once all components are moved:

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## VS Code Setup

1. Open the project in VS Code
2. Open the `megajobnepal.code-workspace` file
3. Install recommended extensions when prompted
4. Use the integrated terminal to run `npm run dev`