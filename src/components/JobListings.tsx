import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, SlidersHorizontal, Map } from 'lucide-react';
import { JobCard } from './JobCard';
import { dbService } from '../lib/mongodb-fixed';
import type { Job, JobCategory, Company } from '../lib/mongodb-fixed';

// Mock data for when database is not available
const mockCategories: JobCategory[] = [
  { id: '1', name: 'Information Technology', description: 'IT and Technology Jobs', tier: 1, created_at: new Date(), updated_at: new Date() },
  { id: '2', name: 'Banking & Finance', description: 'Banking and Finance Jobs', tier: 1, created_at: new Date(), updated_at: new Date() },
  { id: '3', name: 'Healthcare', description: 'Healthcare and Medical Jobs', tier: 1, created_at: new Date(), updated_at: new Date() },
  { id: '4', name: 'Education', description: 'Education and Training Jobs', tier: 1, created_at: new Date(), updated_at: new Date() },
  { id: '5', name: 'Marketing & Sales', description: 'Marketing and Sales Jobs', tier: 1, created_at: new Date(), updated_at: new Date() }
];

const mockLocations: string[] = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Chitwan'];

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Google Senior Software Engineer',
    description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies like React, Node.js, and databases.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience with React, Node.js, and databases.',
    company_id: '1',
    category_id: '1',
    location: 'Kathmandu',
    employment_type: 'full_time',
    experience_level: 'senior',
    salary_min: 180000,
    salary_max: 250000,
    salary_currency: 'NPR',
    is_remote: false,
    status: 'active',
    posted_by: 'employer',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    title: 'Netflix Content Marketing Manager',
    description: 'Join our marketing team to lead digital marketing initiatives including social media campaigns, SEO optimization, and online advertising strategies to drive business growth.',
    requirements: 'Bachelor\'s in Marketing or related field. 2+ years in digital marketing with proven track record.',
    company_id: '2',
    category_id: '5',
    location: 'Kathmandu',
    employment_type: 'full_time',
    experience_level: 'mid',
    salary_min: 100000,
    salary_max: 150000,
    salary_currency: 'NPR',
    is_remote: false,
    status: 'active',
    posted_by: 'employer',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '3',
    title: 'Microsoft Data Analyst',
    description: 'Analyze large datasets to extract meaningful insights and support business decision-making. Work with various data visualization tools and statistical software.',
    requirements: 'Degree in Statistics, Mathematics, or Computer Science. Proficiency in SQL, Python, and data visualization tools.',
    company_id: '3',
    category_id: '1',
    location: 'Pokhara',
    employment_type: 'full_time',
    experience_level: 'mid',
    salary_min: 80000,
    salary_max: 120000,
    salary_currency: 'NPR',
    is_remote: false,
    status: 'active',
    posted_by: 'employer',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '4',
    title: 'Apple UX Designer',
    description: 'Create beautiful and intuitive user experiences for Apple\'s next generation of products.',
    requirements: 'Design degree, 3+ years UX experience, portfolio required, proficiency in design tools.',
    company_id: '4',
    category_id: '4',
    location: 'Kathmandu',
    employment_type: 'full_time',
    experience_level: 'mid',
    salary_min: 120000,
    salary_max: 180000,
    salary_currency: 'NPR',
    is_remote: false,
    status: 'active',
    posted_by: 'employer',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '5',
    title: 'Amazon DevOps Engineer',
    description: 'Build and maintain scalable cloud infrastructure for Amazon Web Services.',
    requirements: 'AWS certification, 4+ years DevOps experience, Kubernetes knowledge, CI/CD pipelines.',
    company_id: '5',
    category_id: '1',
    location: 'Kathmandu',
    employment_type: 'full_time',
    experience_level: 'mid',
    salary_min: 100000,
    salary_max: 150000,
    salary_currency: 'NPR',
    is_remote: false,
    status: 'active',
    posted_by: 'employer',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '6',
    title: 'Tesla Junior Software Developer',
    description: 'Join Tesla\'s innovative software team working on automotive technology.',
    requirements: 'Computer Science degree, Python/C++ knowledge, problem solving skills, team collaboration.',
    company_id: '6',
    category_id: '1',
    location: 'Kathmandu',
    employment_type: 'full_time',
    experience_level: 'entry',
    salary_min: 55000,
    salary_max: 80000,
    salary_currency: 'NPR',
    is_remote: false,
    status: 'active',
    posted_by: 'employer',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '7',
    title: 'Spotify Music Data Specialist',
    description: 'Work with music data to improve recommendation algorithms for Spotify users.',
    requirements: 'Data analysis experience, music industry knowledge, Python/R skills, cultural awareness.',
    company_id: '7',
    category_id: '1',
    location: 'Kathmandu',
    employment_type: 'full_time',
    experience_level: 'mid',
    salary_min: 80000,
    salary_max: 120000,
    salary_currency: 'NPR',
    is_remote: false,
    status: 'active',
    posted_by: 'employer',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '8',
    title: 'Meta AI Research Intern',
    description: 'Research and develop cutting-edge AI technologies for Meta\'s social platforms.',
    requirements: 'PhD student in AI/ML, research experience, deep learning knowledge, publication record.',
    company_id: '8',
    category_id: '1',
    location: 'Kathmandu',
    employment_type: 'internship',
    experience_level: 'entry',
    salary_min: 40000,
    salary_max: 60000,
    salary_currency: 'NPR',
    is_remote: false,
    status: 'active',
    posted_by: 'employer',
    created_at: new Date(),
    updated_at: new Date()
  }
];

interface JobListingsProps {
  onViewJob: (id: string) => void;
  onSaveJob: (id: string) => void;
  savedJobs: string[];
  filter?: { type: string; value: string };
  isUserLoggedIn?: boolean;
  onLoginRequired?: () => void;
}

export function JobListings({ onViewJob, onSaveJob, savedJobs, filter, isUserLoggedIn = false, onLoginRequired }: JobListingsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  
  const [filters, setFilters] = useState({
    category_id: '',
    location_id: '',
    job_tier: '',
    employment_type: '',
    experience_level: '',
    work_type: '', // remote, onsite, hybrid
    salary_range: '',
    is_internship: false,
    is_fresher_friendly: false,
    is_featured: false,
    search: ''
  });

  const jobsPerPage = 12; // Changed to 12 for better grid layout

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadJobs();
  }, [filters, searchQuery]);

  // Apply navigation filter when component receives filter prop
  useEffect(() => {
    if (filter) {
      if (filter.type === 'featured') {
        setFilters(prev => ({ ...prev, is_featured: true }));
      } else if (filter.type === 'remote') {
        setFilters(prev => ({ ...prev, work_type: 'remote' }));
      }
    }
  }, [filter]);

  const loadData = async () => {
    try {
      const [jobsData, categoriesData] = await Promise.all([
        dbService.getJobs({ status: 'active' }, 50),
        dbService.getJobCategories()
      ]);

      if (Array.isArray(jobsData) && jobsData.length > 0) {
        setJobs(jobsData);
      } else {
        setJobs(mockJobs);
      }

      if (Array.isArray(categoriesData) && categoriesData.length > 0) {
        setCategories(categoriesData);
      } else {
        setCategories(mockCategories);
      }

      setLocations(mockLocations);
    } catch (error) {
      console.error('Error loading data from MongoDB, using mock data:', error);
      setJobs(mockJobs);
      setCategories(mockCategories);
      setLocations(mockLocations);
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const dbJobs = await dbService.getJobs({ status: 'active' }, 50);
      
      let filteredJobs = Array.isArray(dbJobs) && dbJobs.length > 0 ? dbJobs : [...mockJobs];
      
      // Apply client-side filters
      if (searchQuery) {
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.requirements?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (filters.employment_type) {
        filteredJobs = filteredJobs.filter(job => job.employment_type === filters.employment_type);
      }

      if (filters.category_id) {
        filteredJobs = filteredJobs.filter(job => job.category_id === filters.category_id);
      }

      if (filters.location_id) {
        filteredJobs = filteredJobs.filter(job => job.location === filters.location_id);
      }

      if (filters.experience_level) {
        filteredJobs = filteredJobs.filter(job => job.experience_level === filters.experience_level);
      }

      if (filters.work_type) {
        filteredJobs = filteredJobs.filter(job => {
          if (filters.work_type === 'remote') {
            return job.is_remote || 
                   job.title.toLowerCase().includes('remote') || 
                   job.description.toLowerCase().includes('remote');
          }
          if (filters.work_type === 'hybrid') {
            return job.title.toLowerCase().includes('hybrid') || 
                   job.description.toLowerCase().includes('hybrid');
          }
          if (filters.work_type === 'onsite') {
            return !job.is_remote && 
                   !job.title.toLowerCase().includes('remote') && 
                   !job.title.toLowerCase().includes('hybrid') &&
                   !job.description.toLowerCase().includes('remote') && 
                   !job.description.toLowerCase().includes('hybrid');
          }
          return true;
        });
      }

      if (filters.is_internship) {
        filteredJobs = filteredJobs.filter(job => 
          job.employment_type === 'internship' ||
          job.title.toLowerCase().includes('intern') ||
          job.description.toLowerCase().includes('internship')
        );
      }

      if (filters.is_fresher_friendly) {
        filteredJobs = filteredJobs.filter(job => 
          job.experience_level === 'entry' ||
          job.title.toLowerCase().includes('junior') ||
          job.title.toLowerCase().includes('entry') ||
          job.description.toLowerCase().includes('fresher') ||
          job.description.toLowerCase().includes('no experience required')
        );
      }

      if (filters.is_featured) {
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes('featured') ||
          job.description.toLowerCase().includes('featured')
        );
      }
      
      // Sort jobs
      filteredJobs.sort((a, b) => {
        switch (sortBy) {
          case 'salary':
            return (b.salary_max || 0) - (a.salary_max || 0);
          case 'relevance':
            return (b.id ? b.id.length : 0) - (a.id ? a.id.length : 0);
          case 'recent':
          default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
      
      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error loading jobs from MongoDB, using mock data:', error);
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadJobs();
  };

  const handleFilterChange = (key: string, value: string) => {
    let filterValue: any = value === 'all' ? '' : value;
    
    if (key === 'is_internship' || key === 'is_fresher_friendly' || key === 'is_featured') {
      filterValue = value === 'true';
    }
    
    setFilters(prev => ({ ...prev, [key]: filterValue }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category_id: '',
      location_id: '',
      job_tier: '',
      employment_type: '',
      experience_level: '',
      work_type: '',
      salary_range: '',
      is_internship: false,
      is_fresher_friendly: false,
      is_featured: false,
      search: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const formatSalary = (min?: number, max?: number, negotiable?: boolean) => {
    if (negotiable) return 'Negotiable';
    if (min && max) return `NPR ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `NPR ${min.toLocaleString()}+`;
    return 'Not specified';
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Convert job data to match JobCard interface
  const convertJobToJobCardFormat = (job: Job) => {
    // Map salary ranges to job tiers for better distribution
    const salaryMax = job.salary_max || 0;
    let assignedTier = 'latest';
    
    if (salaryMax >= 150000) {
      assignedTier = 'megajob';
    } else if (salaryMax >= 100000) {
      assignedTier = 'premium';
    } else if (salaryMax >= 60000 || job.employment_type === 'internship') {
      assignedTier = 'prime';
    } else {
      assignedTier = 'latest';
    }

    // Override with featured jobs getting higher tiers
    if (job.title.toLowerCase().includes('featured') || job.title.toLowerCase().includes('senior') || job.title.toLowerCase().includes('lead')) {
      if (salaryMax >= 120000) {
        assignedTier = 'megajob';
      } else {
        assignedTier = 'premium';
      }
    }

    // Map company names from trusted brands
    const companyMap: { [key: string]: string } = {
      'google': 'Google',
      'microsoft': 'Microsoft', 
      'netflix': 'Netflix',
      'meta': 'Meta',
      'apple': 'Apple',
      'amazon': 'Amazon',
      'spotify': 'Spotify',
      'slack': 'Slack',
      'tesla': 'Tesla',
      'pinterest': 'Pinterest',
      'adobe': 'Adobe',
      'airbnb': 'Airbnb',
      'salesforce': 'Salesforce',
      'zoom': 'Zoom',
      'uber': 'Uber'
    };

    const cleanCompanyName = job.title.toLowerCase();
    let companyName = 'TechCorp Nepal';
    
    // Try to map to known companies based on job title keywords
    for (const [key, value] of Object.entries(companyMap)) {
      if (cleanCompanyName.includes(key) || job.description.toLowerCase().includes(key)) {
        companyName = value;
        break;
      }
    }

    return {
      id: job.id || '',
      title: job.title,
      company: companyName,
      location: job.location,
      description: job.description,
      requirements: typeof job.requirements === 'string' ? [job.requirements] : [],
      postedDate: formatDate(job.created_at),
      publishedDate: new Date(job.created_at).toISOString().split('T')[0],
      deadline: '2024-02-28',
      salary: formatSalary(job.salary_min, job.salary_max),
      type: job.employment_type === 'full_time' ? 'Full Time' : 
            job.employment_type === 'part_time' ? 'Part Time' : 
            job.employment_type === 'contract' ? 'Contract' : 
            job.employment_type === 'internship' ? 'Internship' : 'Full Time',
      tier: assignedTier,
      category: 'General',
      experience: job.experience_level === 'entry' ? 'Entry Level' :
                  job.experience_level === 'mid' ? 'Mid Level' :
                  job.experience_level === 'senior' ? 'Senior Level' :
                  job.experience_level === 'executive' ? 'Executive Level' : 'Mid Level',
      tags: [job.employment_type.replace('_', ' ')],
      featured: job.title.toLowerCase().includes('featured'),
      source: 'online' as const,
      logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=48&h=48&fit=crop&crop=center'
    };
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'megajob':
        return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white';
      case 'premium':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'prime':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'newspaper':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      default:
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    }
  };

  // Pagination
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  const employmentTypes = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ];

  const jobTiers = [
    { value: 'mega_job', label: 'MegaJob' },
    { value: 'premium_job', label: 'Premium Job' },
    { value: 'prime_job', label: 'Prime Job' },
    { value: 'latest_job', label: 'Latest Job' },
    { value: 'newspaper_job', label: 'Newspaper Job' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {filter?.type === 'featured' ? 'Featured Jobs' : 
             filter?.type === 'remote' ? 'Remote Jobs' : 
             'Find Your Perfect Job'}
          </h1>
          <p className="text-lg text-gray-600">
            {filter?.type === 'featured' ? 'Discover the best featured job opportunities' : 
             filter?.type === 'remote' ? 'Work from anywhere with these remote opportunities' : 
             `Discover ${jobs.length} opportunities waiting for you`}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by job title, company, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Search Jobs
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </form>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Employment Type */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Employment Type</h4>
                  <Select value={filters.employment_type || 'all'} onValueChange={(value) => handleFilterChange('employment_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {employmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                  <Select value={filters.location_id || 'all'} onValueChange={(value) => handleFilterChange('location_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location, index) => (
                        <SelectItem key={index} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                  <Select value={filters.category_id || 'all'} onValueChange={(value) => handleFilterChange('category_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Experience Level</h4>
                  <Select value={filters.experience_level || 'all'} onValueChange={(value) => handleFilterChange('experience_level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="executive">Executive Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Work Type */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Work Type</h4>
                  <Select value={filters.work_type || 'all'} onValueChange={(value) => handleFilterChange('work_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Job Results */}
          <div className="flex-1">
            
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + jobsPerPage, jobs.length)} of {jobs.length} jobs
              </p>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Map className="w-4 h-4 mr-2" />
                  Map View
                </Button>
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="relevance">Most Relevant</SelectItem>
                      <SelectItem value="salary">Highest Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 job-grid mb-8">
              {currentJobs.map((job, index) => {
                const convertedJob = convertJobToJobCardFormat(job);
                return (
                  <div key={job.id} className="job-card-container">
                    <JobCard 
                      job={convertedJob}
                      onViewJob={onViewJob}
                      tierColor={getTierColor(convertedJob.tier)}
                      tierBgColor="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                      onSaveJob={onSaveJob}
                      onLoginRequired={onLoginRequired}
                      isSaved={savedJobs.includes(job.id || '')}
                      isUserLoggedIn={isUserLoggedIn}
                    />
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}