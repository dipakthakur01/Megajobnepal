import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MapPin, 
  Users, 
  Briefcase, 
  Globe, 
  Star,
  Calendar,
  Clock,
  Building2,
  CheckCircle,
  Award,
  TrendingUp,
  Heart,
  Share2,
  ArrowLeft
} from 'lucide-react';
// Job interface will be inferred from props, no need to import

interface CompanyDetailPageProps {
  companyName: string;
  jobs: any[];
  onViewJob: (jobId: string) => void;
  onSaveJob: (jobId: string) => void;
  savedJobs: string[];
  onNavigate: (page: string) => void;
}

export function CompanyDetailPage({ 
  companyName, 
  jobs, 
  onViewJob, 
  onSaveJob, 
  savedJobs, 
  onNavigate 
}: CompanyDetailPageProps) {
  const [activeTab, setActiveTab] = useState('jobs');

  // Company data - in a real app, this would come from an API
  const companyData: { [key: string]: any } = {
    'TechVision Nepal': {
      name: 'TechVision Nepal',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop',
      industry: 'Information Technology',
      size: '50-100 employees',
      location: 'Kathmandu, Nepal',
      founded: '2018',
      website: 'www.techvision.com.np',
      rating: 4.7,
      description: 'Leading software development company in Nepal specializing in web and mobile applications. We are committed to excellence in technology and delivering world-class solutions.',
      mission: 'To empower businesses through innovative technology solutions and contribute to Nepal\'s digital transformation.',
      vision: 'To be the leading technology partner for businesses in Nepal and the region, known for innovation and excellence.',
      specialties: ['Web Development', 'Mobile Apps', 'Cloud Solutions', 'Digital Transformation', 'UI/UX Design', 'DevOps'],
      benefits: [
        'Competitive Salary Package',
        'Flexible Working Hours',
        'Remote Work Options',
        'Health Insurance Coverage',
        'Professional Development Budget',
        'Modern Tech Stack',
        'Team Building Activities',
        'Performance Bonuses'
      ],
      culture: [
        'Innovation and Creativity',
        'Technical Excellence',
        'Continuous Learning',
        'Work-Life Balance',
        'Collaborative Environment',
        'Open Communication'
      ],
      offices: [
        { location: 'Head Office - Kathmandu', address: 'New Baneshwor, Kathmandu', employees: '40+' },
        { location: 'Development Center', address: 'Durbarmarg, Kathmandu', employees: '30+' }
      ]
    },
    'Himalayan Bank Ltd': {
      name: 'Himalayan Bank Ltd',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
      industry: 'Banking & Finance',
      size: '500+ employees',
      location: 'Kathmandu, Nepal',
      founded: '1993',
      website: 'www.himalayanbank.com',
      rating: 4.5,
      description: 'One of Nepal\'s premier commercial banks offering comprehensive financial services across the country. We are committed to excellence in banking and customer service.',
      mission: 'To be the most preferred bank in Nepal by providing world-class banking services and contributing to the economic development of the country.',
      vision: 'To become the leading financial institution in Nepal, known for innovation, integrity, and customer satisfaction.',
      specialties: ['Commercial Banking', 'Corporate Finance', 'Retail Banking', 'Investment Services', 'Digital Banking', 'Trade Finance'],
      benefits: [
        'Comprehensive Health Insurance',
        'Retirement Plans & Provident Fund',
        'Professional Development Programs',
        'Performance-based Bonuses',
        'Educational Support for Children',
        'Flexible Working Hours',
        'Career Advancement Opportunities',
        'Medical Leave & Sick Benefits'
      ],
      culture: [
        'Innovation and Excellence',
        'Customer-Centric Approach',
        'Teamwork and Collaboration',
        'Integrity and Ethics',
        'Continuous Learning',
        'Work-Life Balance'
      ],
      offices: [
        { location: 'Head Office - Kathmandu', address: 'Kamaladi, Kathmandu', employees: '200+' },
        { location: 'Lalitpur Branch', address: 'Patan Dhoka, Lalitpur', employees: '150+' },
        { location: 'Pokhara Branch', address: 'New Road, Pokhara', employees: '100+' },
        { location: 'Chitwan Branch', address: 'Bharatpur, Chitwan', employees: '80+' }
      ]
    },
    'Nepal Telecommunications Authority': {
      name: 'Nepal Telecommunications Authority',
      logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop',
      industry: 'Telecommunications',
      size: '100-200 employees',
      location: 'Kathmandu, Nepal',
      founded: '1998',
      website: 'www.nta.gov.np',
      rating: 4.2,
      description: 'Government regulatory body for telecommunications in Nepal, ensuring fair competition and consumer protection in the telecom sector.',
      mission: 'To regulate and promote the development of telecommunications services in Nepal for the benefit of all citizens.',
      vision: 'To be a world-class telecommunications regulator contributing to Nepal\'s digital transformation and economic growth.',
      specialties: ['Telecommunications Regulation', 'Policy Development', 'Spectrum Management', 'Consumer Protection', 'Industry Development', 'Standards Setting'],
      benefits: [
        'Government Service Benefits',
        'Job Security',
        'Medical Insurance',
        'Pension Plan',
        'Training Opportunities',
        'Work-Life Balance',
        'Professional Development',
        'Social Security'
      ],
      culture: [
        'Public Service Excellence',
        'Transparency and Accountability',
        'Professional Integrity',
        'Continuous Improvement',
        'Stakeholder Engagement',
        'Innovation in Regulation'
      ],
      offices: [
        { location: 'Head Office - Kathmandu', address: 'Jawalakhel, Lalitpur', employees: '80+' },
        { location: 'Regional Office - Pokhara', address: 'Pokhara', employees: '30+' },
        { location: 'Regional Office - Biratnagar', address: 'Biratnagar', employees: '25+' }
      ]
    },
    'Innovative Tech Solutions': {
      name: 'Innovative Tech Solutions',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop',
      industry: 'Information Technology',
      size: '20-50 employees',
      location: 'Pokhara, Nepal',
      founded: '2020',
      website: 'www.innovativetech.com.np',
      rating: 4.4,
      description: 'Digital transformation and software consulting company helping businesses modernize their operations through technology.',
      mission: 'To help businesses achieve their digital transformation goals through innovative technology solutions.',
      vision: 'To be the leading digital transformation partner for businesses in Nepal and beyond.',
      specialties: ['Digital Transformation', 'Software Consulting', 'Cloud Migration', 'Business Intelligence', 'Process Automation', 'Mobile Solutions'],
      benefits: [
        'Competitive Salary',
        'Remote Work Flexibility',
        'Learning & Development',
        'Health Insurance',
        'Performance Incentives',
        'Modern Work Environment',
        'Career Growth Opportunities',
        'Team Building Activities'
      ],
      culture: [
        'Innovation and Creativity',
        'Client Success Focus',
        'Agile Methodology',
        'Continuous Learning',
        'Collaborative Teams',
        'Quality Excellence'
      ],
      offices: [
        { location: 'Head Office - Pokhara', address: 'Lake Side, Pokhara', employees: '35+' },
        { location: 'Branch Office - Kathmandu', address: 'Thamel, Kathmandu', employees: '15+' }
      ]
    },
    'Green Energy Nepal': {
      name: 'Green Energy Nepal',
      logo: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=200&h=200&fit=crop',
      industry: 'Energy & Environment',
      size: '10-20 employees',
      location: 'Lalitpur, Nepal',
      founded: '2019',
      website: 'www.greenenergy.com.np',
      rating: 4.3,
      description: 'Renewable energy solutions and consulting company committed to sustainable development and environmental protection.',
      mission: 'To promote renewable energy adoption and contribute to Nepal\'s sustainable development goals.',
      vision: 'To be the leading renewable energy solutions provider in Nepal, driving the transition to clean energy.',
      specialties: ['Solar Energy Solutions', 'Energy Consulting', 'Environmental Impact Assessment', 'Green Technology', 'Sustainability Consulting', 'Project Management'],
      benefits: [
        'Meaningful Work Impact',
        'Competitive Package',
        'Professional Development',
        'Health Benefits',
        'Flexible Work Arrangements',
        'Environmental Mission',
        'Growth Opportunities',
        'Team Collaboration'
      ],
      culture: [
        'Environmental Responsibility',
        'Sustainability Focus',
        'Innovation in Green Tech',
        'Community Impact',
        'Professional Excellence',
        'Collaborative Spirit'
      ],
      offices: [
        { location: 'Head Office - Lalitpur', address: 'Pulchowk, Lalitpur', employees: '18+' }
      ]
    },
    'Himalayan Bank Limited': {
      name: 'Himalayan Bank Limited',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
      industry: 'Banking & Finance',
      size: '1000+ employees',
      location: 'Kathmandu, Nepal',
      founded: '1993',
      website: 'www.himalayanbank.com',
      rating: 4.5,
      description: 'One of Nepal\'s leading commercial banks providing comprehensive banking and financial services across the country. We are committed to excellence in banking and customer service.',
      mission: 'To be the most preferred bank in Nepal by providing world-class banking services and contributing to the economic development of the country.',
      vision: 'To become the leading financial institution in Nepal, known for innovation, integrity, and customer satisfaction.',
      specialties: ['Commercial Banking', 'Corporate Finance', 'Retail Banking', 'Investment Services', 'Digital Banking', 'Trade Finance'],
      benefits: [
        'Comprehensive Health Insurance',
        'Retirement Plans & Provident Fund',
        'Professional Development Programs',
        'Performance-based Bonuses',
        'Educational Support for Children',
        'Flexible Working Hours',
        'Career Advancement Opportunities',
        'Medical Leave & Sick Benefits'
      ],
      culture: [
        'Innovation and Excellence',
        'Customer-Centric Approach',
        'Teamwork and Collaboration',
        'Integrity and Ethics',
        'Continuous Learning',
        'Work-Life Balance'
      ],
      offices: [
        { location: 'Head Office - Kathmandu', address: 'Kamaladi, Kathmandu', employees: '200+' },
        { location: 'Lalitpur Branch', address: 'Patan Dhoka, Lalitpur', employees: '150+' },
        { location: 'Pokhara Branch', address: 'New Road, Pokhara', employees: '100+' },
        { location: 'Chitwan Branch', address: 'Bharatpur, Chitwan', employees: '80+' }
      ]
    },
    'Ncell Axiata Limited': {
      name: 'Ncell Axiata Limited',
      logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop',
      industry: 'Telecommunications',
      size: '1000+ employees',
      location: 'Lalitpur, Nepal',
      founded: '2004',
      website: 'www.ncell.axiata.com',
      rating: 4.3,
      description: 'Nepal\'s leading telecommunications company providing mobile, internet, and digital services to millions of customers across the country.',
      mission: 'To advance lives through technology and connectivity, making digital services accessible to all Nepalis.',
      vision: 'To be the Digital Champion of Nepal, connecting people and transforming lives through innovative technology solutions.',
      specialties: ['Mobile Services', '4G/5G Networks', 'Digital Services', 'Enterprise Solutions', 'IoT Solutions', 'Cloud Services'],
      benefits: [
        'Flexible Working Arrangements',
        'Comprehensive Medical Coverage',
        'International Career Opportunities',
        'Professional Certification Support',
        'Performance Incentives',
        'Employee Stock Options',
        'Technology Learning Programs',
        'Wellness Programs'
      ],
      culture: [
        'Innovation and Technology Leadership',
        'Customer Obsession',
        'Diversity and Inclusion',
        'Agility and Speed',
        'Digital Transformation',
        'Environmental Responsibility'
      ],
      offices: [
        { location: 'Head Office - Lalitpur', address: 'Jawalakhel, Lalitpur', employees: '300+' },
        { location: 'Network Operations Center', address: 'Kathmandu', employees: '150+' },
        { location: 'Regional Office - Pokhara', address: 'Lake Side, Pokhara', employees: '120+' },
        { location: 'Customer Service Centers', address: 'Multiple Locations', employees: '400+' }
      ]
    },
    'F1Soft International': {
      name: 'F1Soft International',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop',
      industry: 'Information Technology',
      size: '500-1000 employees',
      location: 'Kathmandu, Nepal',
      founded: '2004',
      website: 'www.f1soft.com',
      rating: 4.6,
      description: 'Nepal\'s leading fintech company providing digital payment solutions and financial technology services to banks and financial institutions.',
      mission: 'To democratize financial services through innovative technology solutions and make digital payments accessible to everyone.',
      vision: 'To be the leading fintech company in South Asia, driving financial inclusion through cutting-edge technology.',
      specialties: ['Fintech Solutions', 'Digital Payments', 'Mobile Banking', 'Software Development', 'API Solutions', 'Financial Analytics'],
      benefits: [
        'Flexible Work Hours',
        'Remote Work Options',
        'Learning & Development Budget',
        'Health & Wellness Programs',
        'Performance Bonuses',
        'Stock Options',
        'Conference & Training Support',
        'Modern Office Environment'
      ],
      culture: [
        'Innovation and Creativity',
        'Technical Excellence',
        'Customer Success',
        'Continuous Learning',
        'Work-Life Balance',
        'Collaborative Environment'
      ],
      offices: [
        { location: 'Head Office - Kathmandu', address: 'Durbarmarg, Kathmandu', employees: '400+' },
        { location: 'Development Center', address: 'New Baneshwor, Kathmandu', employees: '200+' },
        { location: 'Regional Office - Pokhara', address: 'Pokhara', employees: '50+' }
      ]
    }
  };

  const company = companyData[companyName];
  // Handle both new and legacy job structure for company filtering
  const companyJobs = jobs.filter(job => {
    if (job.company?.name) {
      return job.company.name === companyName;
    }
    // Fallback for legacy structure where company is a string
    return (job as any).company === companyName;
  });

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Company Not Found</h2>
          <p className="text-gray-500 mb-4">The company you're looking for doesn't exist.</p>
          <Button onClick={() => onNavigate('employers')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('employers')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <img
              src={company.logo}
              alt={company.name}
              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">{company.rating}</span>
                  <span className="text-gray-500">• Company Rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{companyJobs.length} Open Positions</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{company.industry}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{company.size}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{company.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{company.website}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">{company.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="jobs">Jobs ({companyJobs.length})</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
              <TabsTrigger value="offices">Offices</TabsTrigger>
            </TabsList>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {companyJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{job.location?.city || job.location || 'Remote'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{job.employment_type?.replace('_', ' ') || job.type || 'Full Time'}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mb-3">
                            <Badge variant="secondary">{job.category?.name || job.category}</Badge>
                            <Badge variant="outline">{job.experience_level?.replace('_', ' ') || job.experience}</Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {job.salary_negotiable ? 'Negotiable' : 
                               job.salary_min && job.salary_max ? `NPR ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}` :
                               job.salary || 'Competitive Salary'}
                            </span>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(job.published_at || job.created_at || job.postedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => onSaveJob(job.id)}
                          className={`ml-4 p-2 rounded-full transition-colors ${
                            savedJobs.includes(job.id)
                              ? 'text-red-500 bg-red-50 hover:bg-red-100'
                              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button 
                          onClick={() => onViewJob(job.id)}
                          className="flex-1"
                          size="sm"
                        >
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Apply Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {companyJobs.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Open Positions</h3>
                  <p className="text-gray-500">This company doesn't have any open positions at the moment.</p>
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span>Mission</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{company.mission}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span>Vision</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{company.vision}</p>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Specialties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {company.specialties.map((specialty: string, index: number) => (
                        <Badge key={index} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Employee Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {company.benefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Culture Tab */}
            <TabsContent value="culture" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Culture & Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {company.culture.map((value: string, index: number) => (
                      <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Star className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">{value}</h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Offices Tab */}
            <TabsContent value="offices" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.offices.map((office: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2">{office.location}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{office.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{office.employees} employees</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}