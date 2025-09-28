'use client';

import { AdminLogin } from '@/components/AdminLogin';
import { useApp } from '@/app/providers/AppProvider';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const { setCurrentUser } = useApp();
  const router = useRouter();

  const handleAdminLogin = (user: any) => {
    setCurrentUser(user);
    router.push('/admin');
  };

  const handleBackToWebsite = () => {
    router.push('/');
  };

  return (
    <AdminLogin 
      onLogin={handleAdminLogin}
      onBackToWebsite={handleBackToWebsite}
    />
  );
}