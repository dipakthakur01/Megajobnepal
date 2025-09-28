export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
  salary: string;
  type: 'mega_job' | 'premium_job' | 'prime_job' | 'latest_job' | 'newspaper_job';
  tier: 'mega_job' | 'premium_job' | 'prime_job' | 'latest_job' | 'newspaper_job' | 'megajob' | 'premium' | 'prime' | 'latest' | 'newspaper';
  category: string;
  experience: string;
  tags: string[];
  featured?: boolean;
  urgent?: boolean;
  companyLogo?: string;
  logo?: string;
  source?: 'online' | 'newspaper';
  publishedDate: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  submittedBy?: string;
  submittedDate?: string;
}

export const mockJobs: Job[] = [
  // MegaJob Tier (2 jobs)
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Nepal',
    location: 'Kathmandu',
    description: 'We are looking for a senior software engineer to join our dynamic team and lead innovative projects.',
    requirements: ['5+ years experience', 'React', 'Node.js', 'TypeScript'],
    postedDate: '2024-01-15',
    publishedDate: '2024-01-15',
    deadline: '2024-02-15',
    salary: 'NPR 80,000 - 120,000',
    type: 'mega_job',
    tier: 'megajob',
    category: 'Information Technology',
    experience: 'Senior Level',
    tags: ['Remote', 'Full-time'],
    featured: true,
    source: 'online',
    logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=48&h=48&fit=crop&crop=center',
    approvalStatus: 'approved',
    approvedBy: 'admin',
    approvedDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Senior Product Manager',
    company: 'Google',
    location: 'Kathmandu',
    description: 'Lead product strategy and development for Google\'s emerging markets initiatives.',
    requirements: ['8+ years product management', 'Tech background', 'Analytics expertise', 'Leadership skills'],
    postedDate: '2024-01-19',
    publishedDate: '2024-01-19',
    deadline: '2024-02-19',
    salary: 'NPR 180,000 - 250,000',
    type: 'mega_job',
    tier: 'megajob',
    category: 'Product Management',
    experience: 'Senior Level',
    tags: ['Tech', 'Leadership'],
    featured: true,
    source: 'online',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=48&h=48&fit=crop&crop=center'
  },

  // Premium Jobs (2 jobs)
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'Digital Innovation Hub',
    location: 'Kathmandu',
    description: 'Join our team to build cutting-edge web applications using modern technologies.',
    requirements: ['3+ years experience', 'React', 'Python/Django', 'PostgreSQL'],
    postedDate: '2024-01-16',
    publishedDate: '2024-01-16',
    deadline: '2024-02-16',
    salary: 'NPR 60,000 - 90,000',
    type: 'premium_job',
    tier: 'premium',
    category: 'Information Technology',
    experience: 'Mid Level',
    tags: ['Hybrid', 'Full-time'],
    featured: false,
    source: 'online',
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=48&h=48&fit=crop&crop=center'
  },
  {
    id: '4',
    title: 'UX Design Lead',
    company: 'Apple',
    location: 'Kathmandu',
    description: 'Lead user experience design for Apple\'s emerging market products and services.',
    requirements: ['5+ years UX design', 'Design leadership', 'Prototyping tools', 'User research'],
    postedDate: '2024-01-19',
    publishedDate: '2024-01-19',
    deadline: '2024-02-19',
    salary: 'NPR 120,000 - 180,000',
    type: 'premium_job',
    tier: 'premium',
    category: 'Design',
    experience: 'Senior Level',
    tags: ['UX', 'Design'],
    featured: false,
    source: 'online',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=48&h=48&fit=crop&crop=center'
  },

  // Prime Jobs (2 jobs)
  {
    id: '5',
    title: 'Junior Software Developer',
    company: 'StartUp Tech',
    location: 'Kathmandu',
    description: 'Great opportunity for fresh graduates to start their career in software development.',
    requirements: ['0-2 years experience', 'Basic programming knowledge', 'JavaScript/Python', 'Eagerness to learn'],
    postedDate: '2024-01-17',
    publishedDate: '2024-01-17',
    deadline: '2024-02-17',
    salary: 'NPR 35,000 - 50,000',
    type: 'prime_job',
    tier: 'prime',
    category: 'Information Technology',
    experience: 'Entry Level',
    tags: ['Entry Level', 'Full-time'],
    featured: false,
    source: 'online',
    logo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=48&h=48&fit=crop&crop=center'
  },
  {
    id: '6',
    title: 'Junior Software Engineer',
    company: 'Tesla',
    location: 'Kathmandu',
    description: 'Join Tesla\'s software team to develop innovative automotive technologies.',
    requirements: ['Computer Science degree', 'Python/C++', 'Problem solving', 'Team collaboration'],
    postedDate: '2024-01-19',
    publishedDate: '2024-01-19',
    deadline: '2024-02-19',
    salary: 'NPR 55,000 - 80,000',
    type: 'prime_job',
    tier: 'prime',
    category: 'Automotive Software',
    experience: 'Entry Level',
    tags: ['Automotive', 'Software'],
    featured: false,
    source: 'online',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center'
  }
];

// Export categories and companies from the jobs
export const mockCategories = [
  { id: '1', name: 'Information Technology', description: 'Software development, IT services, and technology roles' },
  { id: '2', name: 'Product Management', description: 'Product strategy, development, and management roles' },
  { id: '3', name: 'Design', description: 'UI/UX design, product design, and creative roles' },
  { id: '4', name: 'Automotive Software', description: 'Software development for automotive industry' }
];

export const mockCompanies = [
  { id: '1', name: 'TechCorp Nepal', industry: 'Technology', size: '100-500', location: 'Kathmandu', verified: true },
  { id: '2', name: 'Google', industry: 'Technology', size: '10000+', location: 'Kathmandu', verified: true },
  { id: '3', name: 'Digital Innovation Hub', industry: 'Technology', size: '50-100', location: 'Kathmandu', verified: true },
  { id: '4', name: 'Apple', industry: 'Technology', size: '10000+', location: 'Kathmandu', verified: true },
  { id: '5', name: 'StartUp Tech', industry: 'Technology', size: '10-50', location: 'Kathmandu', verified: true },
  { id: '6', name: 'Tesla', industry: 'Automotive', size: '1000-10000', location: 'Kathmandu', verified: true }
];

