'use client';

import { EmployersPage } from '@/components/EmployersPage';
import { useRouter } from 'next/navigation';

export default function Employers() {
  const router = useRouter();

  const handleNavigation = (page: string, param?: string) => {
    switch (page) {
      case 'company-detail':
        router.push(`/companies/${param}`);
        break;
      default:
        router.push(`/${page}`);
        break;
    }
  };

  return <EmployersPage onNavigate={handleNavigation} />;
}