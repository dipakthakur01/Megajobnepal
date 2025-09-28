import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';
import { 
  Upload, Edit, Heart, Clock, CheckCircle, XCircle, User, FileText, Bell, Eye, Download, 
  MapPin, Calendar as CalendarIcon, Briefcase, GraduationCap, Award, Plus, Trash2, 
  AlertCircle, Map, BookmarkPlus, Building2, Users, TrendingUp, DollarSign, Search,
  Star, Video, Camera, Play, MessageSquare, ThumbsUp, Share2
} from 'lucide-react';
import { Job, Application, User as UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
// Note: unsplash_tool would be imported here if available

interface EmployerProfile {
  companyName: string;
  companyLogo: File | null;
  industry: string;
  location: string;
  website: string;
  description: string;
  founded: string;
  size: string;
  email: string;
  phone: string;
  benefits: string[];
  culture: string;
  mission: string;
  vision: string;
  values: string[];
  socialMedia: {
    linkedin: string;
    facebook: string;
    twitter: string;
    instagram: string;
  };
}

interface JobPost {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  qualifications: string[];
  location: string;
  employment_type: string;
  experience_level: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  deadline: Date;
  benefits: string[];
  responsibilities: string[];
  skills: string[];
  status: 'draft' | 'active' | 'paused' | 'expired';
  coverImage: File | null;
  createdAt: Date;
  updatedAt: Date;
  applicationsCount: number;
  viewsCount: number;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  location: string;
  experience: string;
  skills: string[];
  profileImage: string;
  resume: string;
  appliedJobs: string[];
  rating: number;
  lastActive: Date;
  matchScore: number;
}

interface CompanyBranding {
  videos: {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    type: 'culture' | 'office_tour' | 'testimonial' | 'intro';
  }[];
  testimonials: {
    id: string;
    employee: string;
    position: string;
    content: string;
    rating: number;
    image: string;
  }[];
  gallery: {
    id: string;
    image: string;
    caption: string;
    category: 'office' | 'team' | 'events' | 'products';
  }[];
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  jobPostLimit: number;
  candidateSearchLimit: number;
  priority: boolean;
  current: boolean;
}

interface EmployerJobSeekerDashboardProps {
  user: UserType;
  jobs: Job[];
  applications: Application[];
  onApplicationUpdate: (applications: Application[]) => void;
  onLogout: () => void;
}

export function EmployerJobSeekerDashboard({ 
  user, 
  jobs, 
  applications, 
  onApplicationUpdate, 
  onLogout 
}: EmployerJobSeekerDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showJobPostDialog, setShowJobPostDialog] = useState(false);
  const [showBrandingDialog, setShowBrandingDialog] = useState(false);

  const [employerProfile, setEmployerProfile] = useState<EmployerProfile>({
    companyName: 'TechCorp Nepal',
    companyLogo: null,
    industry: 'Technology',
    location: 'Kathmandu, Nepal',
    website: 'https://techcorp.com.np',
    description: 'Leading technology company providing innovative solutions.',
    founded: '2015',
    size: '50-100 employees',
    email: 'info@techcorp.com.np',
    phone: '+977-1-4123456',
    benefits: ['Health Insurance', 'Flexible Hours', 'Remote Work', 'Training Budget'],
    culture: 'Innovation-driven culture with emphasis on work-life balance.',
    mission: 'To transform businesses through technology.',
    vision: 'Leading tech company in Nepal by 2030.',
    values: ['Innovation', 'Integrity', 'Excellence', 'Collaboration'],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/techcorp',
      facebook: 'https://facebook.com/techcorp',
      twitter: 'https://twitter.com/techcorp',
      instagram: 'https://instagram.com/techcorp'
    }
  });

  const [jobPosts, setJobPosts] = useState<JobPost[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      description: 'We are looking for an experienced frontend developer...',
      requirements: ['React', 'TypeScript', '3+ years experience'],
      qualifications: ['Bachelor in Computer Science', 'Strong problem-solving skills'],
      location: 'Kathmandu',
      employment_type: 'full_time',
      experience_level: 'senior',
      salary_min: 80000,
      salary_max: 120000,
      currency: 'NPR',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      benefits: ['Health Insurance', 'Performance Bonus'],
      responsibilities: ['Develop user interfaces', 'Code review', 'Mentoring'],
      skills: ['React', 'TypeScript', 'JavaScript'],
      status: 'active',
      coverImage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      applicationsCount: 25,
      viewsCount: 150
    }
  ]);

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Kathmandu',
      experience: '3+ years',
      skills: ['React', 'Node.js', 'JavaScript'],
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      resume: 'john-doe-resume.pdf',
      appliedJobs: ['1'],
      rating: 4.5,
      lastActive: new Date(),
      matchScore: 85
    }
  ]);

  const [branding, setBranding] = useState<CompanyBranding>({
    videos: [
      {
        id: '1',
        title: 'Our Company Culture',
        url: 'https://example.com/culture-video',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop',
        type: 'culture'
      }
    ],
    testimonials: [
      {
        id: '1',
        employee: 'Sarah Johnson',
        position: 'Software Engineer',
        content: 'Great place to work with amazing opportunities for growth.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b5c06d32?w=100&h=100&fit=crop'
      }
    ],
    gallery: [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
        caption: 'Our modern office space',
        category: 'office'
      }
    ]
  });

  const [subscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 2000,
      duration: 'month',
      features: ['5 Job Posts', '50 Candidate Views', 'Basic Analytics'],
      jobPostLimit: 5,
      candidateSearchLimit: 50,
      priority: false,
      current: false
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: 5000,
      duration: 'month',
      features: ['20 Job Posts', '200 Candidate Views', 'Advanced Analytics', 'Priority Support'],
      jobPostLimit: 20,
      candidateSearchLimit: 200,
      priority: true,
      current: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 10000,
      duration: 'month',
      features: ['Unlimited Job Posts', 'Unlimited Candidate Views', 'Custom Branding', 'Dedicated Manager'],
      jobPostLimit: -1,
      candidateSearchLimit: -1,
      priority: true,
      current: false
    }
  ]);

  const [newJobPost, setNewJobPost] = useState<Partial<JobPost>>({
    status: 'draft',
    employment_type: 'full_time',
    experience_level: 'mid',
    currency: 'NPR',
    requirements: [],
    qualifications: [],
    benefits: [],
    responsibilities: [],
    skills: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [candidateFilters, setCandidateFilters] = useState({
    location: '',
    experience: '',
    skills: ''
  });

  // Mock images for job covers
  const [jobCoverImages, setJobCoverImages] = useState<{[key: string]: string}>({});

  const profileCompletionPercentage = () => {
    const fields = [
      employerProfile.companyName,
      employerProfile.industry,
      employerProfile.location,
      employerProfile.description,
      employerProfile.website,
      employerProfile.email,
      employerProfile.phone
    ];
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    const logoComplete = employerProfile.companyLogo ? 1 : 0;
    const benefitsComplete = employerProfile.benefits.length > 0 ? 1 : 0;
    const valuesComplete = employerProfile.values.length > 0 ? 1 : 0;
    
    const totalFields = fields.length + 3;
    const completedCount = completedFields + logoComplete + benefitsComplete + valuesComplete;
    
    return Math.round((completedCount / totalFields) * 100);
  };

  const handleSaveProfile = () => {
    toast.success('Company profile updated successfully!');
    setShowEditProfile(false);
  };

  const handleCreateJobPost = async () => {
    if (!newJobPost.title || !newJobPost.description) {
      toast.error('Please fill in required fields');
      return;
    }

    // Get cover image for the job
    let coverImageUrl = '';
    if (newJobPost.title) {
      try {
        // Use unsplash_tool to get relevant job image
        const imageQuery = `${newJobPost.title} office work`;
        // Mock the image URL since we can't actually call the tool here
        coverImageUrl = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop`;
      } catch (error) {
        console.log('Could not fetch cover image');
      }
    }

    const jobPost: JobPost = {
      id: Date.now().toString(),
      title: newJobPost.title,
      description: newJobPost.description,
      requirements: newJobPost.requirements || [],
      qualifications: newJobPost.qualifications || [],
      location: newJobPost.location || employerProfile.location,
      employment_type: newJobPost.employment_type || 'full_time',
      experience_level: newJobPost.experience_level || 'mid',
      salary_min: newJobPost.salary_min || 0,
      salary_max: newJobPost.salary_max || 0,
      currency: newJobPost.currency || 'NPR',
      deadline: newJobPost.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      benefits: newJobPost.benefits || [],
      responsibilities: newJobPost.responsibilities || [],
      skills: newJobPost.skills || [],
      status: newJobPost.status || 'draft',
      coverImage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      applicationsCount: 0,
      viewsCount: 0
    } as JobPost;

    // Store the cover image URL separately
    setJobCoverImages(prev => ({
      ...prev,
      [jobPost.id]: coverImageUrl
    }));

    setJobPosts([...jobPosts, jobPost]);
    setNewJobPost({
      status: 'draft',
      employment_type: 'full_time',
      experience_level: 'mid',
      currency: 'NPR',
      requirements: [],
      qualifications: [],
      benefits: [],
      responsibilities: [],
      skills: []
    });
    setShowJobPostDialog(false);
    toast.success('Job post created successfully!');
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (searchTerm && !candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    if (candidateFilters.location && !candidate.location.toLowerCase().includes(candidateFilters.location.toLowerCase())) {
      return false;
    }
    if (candidateFilters.experience && !candidate.experience.toLowerCase().includes(candidateFilters.experience.toLowerCase())) {
      return false;
    }
    if (candidateFilters.skills && !candidate.skills.some(skill => 
      skill.toLowerCase().includes(candidateFilters.skills.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const currentPlan = subscriptionPlans.find(plan => plan.current);
  const totalApplications = jobPosts.reduce((sum, job) => sum + job.applicationsCount, 0);
  const totalViews = jobPosts.reduce((sum, job) => sum + job.viewsCount, 0);

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Welcome Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome, {employerProfile.companyName}!</h2>
            <p className="text-muted-foreground mt-1">Manage your company profile and job postings</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={showJobPostDialog} onOpenChange={setShowJobPostDialog}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Job Post</DialogTitle>
                  <DialogDescription>
                    Create a new job posting with detailed requirements and benefits.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="job-title">Job Title *</Label>
                      <Input
                        id="job-title"
                        value={newJobPost.title || ''}
                        onChange={(e) => setNewJobPost({ ...newJobPost, title: e.target.value })}
                        placeholder="e.g. Senior Frontend Developer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="job-location">Location</Label>
                      <Input
                        id="job-location"
                        value={newJobPost.location || ''}
                        onChange={(e) => setNewJobPost({ ...newJobPost, location: e.target.value })}
                        placeholder="e.g. Kathmandu or Remote"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="employment-type">Employment Type</Label>
                      <Select 
                        value={newJobPost.employment_type || 'full_time'} 
                        onValueChange={(value) => setNewJobPost({ ...newJobPost, employment_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">Full Time</SelectItem>
                          <SelectItem value="part_time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experience-level">Experience Level</Label>
                      <Select 
                        value={newJobPost.experience_level || 'mid'} 
                        onValueChange={(value) => setNewJobPost({ ...newJobPost, experience_level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="lead">Lead/Principal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="job-status">Status</Label>
                      <Select 
                        value={newJobPost.status || 'draft'} 
                        onValueChange={(value) => setNewJobPost({ ...newJobPost, status: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salary-min">Minimum Salary (NPR)</Label>
                      <Input
                        id="salary-min"
                        type="number"
                        value={newJobPost.salary_min || ''}
                        onChange={(e) => setNewJobPost({ ...newJobPost, salary_min: parseInt(e.target.value) || 0 })}
                        placeholder="e.g. 50000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary-max">Maximum Salary (NPR)</Label>
                      <Input
                        id="salary-max"
                        type="number"
                        value={newJobPost.salary_max || ''}
                        onChange={(e) => setNewJobPost({ ...newJobPost, salary_max: parseInt(e.target.value) || 0 })}
                        placeholder="e.g. 80000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="job-description">Job Description *</Label>
                    <Textarea
                      id="job-description"
                      value={newJobPost.description || ''}
                      onChange={(e) => setNewJobPost({ ...newJobPost, description: e.target.value })}
                      placeholder="Describe the job role, responsibilities, and what you're looking for..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Cover Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Upload job cover image</p>
                      <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewJobPost({ ...newJobPost, coverImage: e.target.files?.[0] || null })}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowJobPostDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateJobPost} className="bg-primary hover:bg-primary/90">
                      Create Job Post
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Company Profile</DialogTitle>
                  <DialogDescription>
                    Update your company information and branding.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        value={employerProfile.companyName}
                        onChange={(e) => setEmployerProfile({ ...employerProfile, companyName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={employerProfile.industry}
                        onChange={(e) => setEmployerProfile({ ...employerProfile, industry: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Company Logo</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Upload company logo</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEmployerProfile({ ...employerProfile, companyLogo: e.target.files?.[0] || null })}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea
                      id="description"
                      value={employerProfile.description}
                      onChange={(e) => setEmployerProfile({ ...employerProfile, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowEditProfile(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Profile Completion */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Company Profile Completion</h3>
              <span className="text-2xl font-bold text-primary">{profileCompletionPercentage()}%</span>
            </div>
            <Progress value={profileCompletionPercentage()} className="w-full mb-2" />
            <p className="text-sm text-muted-foreground">
              Complete your profile to attract better candidates
            </p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold">{jobPosts.filter(job => job.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold">{totalApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Job Views</p>
                  <p className="text-2xl font-bold">{totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
                  <p className="text-lg font-bold">{currentPlan?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Job Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Job Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobPosts.slice(0, 3).map((job) => (
                      <div key={job.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{job.title}</h4>
                          <Badge 
                            variant={job.status === 'active' ? 'default' : 'secondary'}
                            className={job.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{job.location}</p>
                        <div className="flex justify-between text-sm">
                          <span>{job.applicationsCount} applications</span>
                          <span>{job.viewsCount} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Candidates */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Matching Candidates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidates.slice(0, 3).map((candidate) => (
                      <div key={candidate.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <ImageWithFallback
                          src={candidate.profileImage}
                          alt={candidate.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.experience}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{candidate.matchScore}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>My Job Posts ({jobPosts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobPosts.map((job) => (
                    <div key={job.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex space-x-4">
                          {jobCoverImages[job.id] && (
                            <ImageWithFallback
                              src={jobCoverImages[job.id]}
                              alt={job.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            <p className="text-muted-foreground">{job.location} • {job.employment_type.replace('_', ' ')}</p>
                            <p className="text-sm text-muted-foreground">
                              Created: {job.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={job.status === 'active' ? 'default' : 'secondary'}
                            className={job.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {job.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{job.applicationsCount}</p>
                          <p className="text-sm text-muted-foreground">Applications</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{job.viewsCount}</p>
                          <p className="text-sm text-muted-foreground">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-orange-600">
                            {Math.floor((job.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                          </p>
                          <p className="text-sm text-muted-foreground">Remaining</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Applications
                          </Button>
                          <Button size="sm">
                            Promote Job
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Database</CardTitle>
                <div className="flex space-x-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search candidates by name, skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select 
                    value={candidateFilters.experience} 
                    onValueChange={(value) => setCandidateFilters({...candidateFilters, experience: value})}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Experience</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCandidates.map((candidate) => (
                    <div key={candidate.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex space-x-4">
                          <ImageWithFallback
                            src={candidate.profileImage}
                            alt={candidate.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-semibold">{candidate.name}</h3>
                            <p className="text-muted-foreground">{candidate.location} • {candidate.experience}</p>
                            <div className="flex items-center mt-2">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="text-sm">{candidate.rating}/5.0</span>
                              <span className="mx-2">•</span>
                              <span className="text-sm text-green-600">{candidate.matchScore}% match</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Resume
                          </Button>
                          <Button size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Manage Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Application management features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding">
            <div className="space-y-6">
              {/* Company Videos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="w-5 h-5 mr-2" />
                    Company Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branding.videos.map((video) => (
                      <div key={video.id} className="border rounded-lg overflow-hidden">
                        <div className="relative">
                          <ImageWithFallback
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium">{video.title}</h4>
                          <Badge variant="outline" className="mt-2">{video.type}</Badge>
                        </div>
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Upload new video</p>
                      <Button variant="outline" className="mt-2" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Video
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employee Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Employee Testimonials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {branding.testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <ImageWithFallback
                            src={testimonial.image}
                            alt={testimonial.employee}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">{testimonial.employee}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                              </div>
                              <div className="flex items-center">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm">{testimonial.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testimonial
                  </Button>
                </CardContent>
              </Card>

              {/* Company Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Company Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {branding.gallery.map((item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.caption}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2">
                          <p className="text-xs text-muted-foreground">{item.caption}</p>
                          <Badge variant="outline" className="mt-1 text-xs">{item.category}</Badge>
                        </div>
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Add photo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPlan && (
                    <div className="border rounded-lg p-6 bg-primary/5 border-primary/20">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{currentPlan.name}</h3>
                          <p className="text-2xl font-bold text-primary">
                            NPR {currentPlan.price.toLocaleString()}/{currentPlan.duration}
                          </p>
                        </div>
                        <Badge className="bg-primary text-primary-foreground">Current Plan</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{currentPlan.jobPostLimit === -1 ? '∞' : currentPlan.jobPostLimit}</p>
                          <p className="text-sm text-muted-foreground">Job Posts</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{currentPlan.candidateSearchLimit === -1 ? '∞' : currentPlan.candidateSearchLimit}</p>
                          <p className="text-sm text-muted-foreground">Candidate Views</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{jobPosts.filter(j => j.status === 'active').length}</p>
                          <p className="text-sm text-muted-foreground">Used Posts</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">150</p>
                          <p className="text-sm text-muted-foreground">Used Views</p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {currentPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subscriptionPlans.filter(plan => !plan.current).map((plan) => (
                      <div key={plan.id} className="border rounded-lg p-6">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold">{plan.name}</h3>
                          <p className="text-2xl font-bold text-primary">
                            NPR {plan.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">per {plan.duration}</p>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full" variant={plan.id === 'enterprise' ? 'default' : 'outline'}>
                          {plan.id === 'basic' ? 'Downgrade' : 'Upgrade'} to {plan.name}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Notification Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">Email notifications for new applications</Label>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-notifications">SMS notifications for urgent updates</Label>
                        <Switch id="sms-notifications" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="weekly-report">Weekly performance report</Label>
                        <Switch id="weekly-report" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Privacy Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="profile-visibility">Make company profile public</Label>
                        <Switch id="profile-visibility" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="contact-visibility">Allow direct contact from candidates</Label>
                        <Switch id="contact-visibility" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="destructive">
                      Delete Company Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}