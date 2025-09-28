import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { MapPin, Briefcase, Calendar, DollarSign, Users, Heart, Share2, Building, Clock, Bell, Upload, FileText, Eye, AlertCircle, Send, BookmarkPlus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShareJobModal } from './ShareJobModal';

// Updated Job interface to match our current structure
interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string;
  company_id: string;
  category_id: string;
  location_id: string;
  employment_type: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  salary_negotiable: boolean;
  job_tier: string;
  status: string;
  is_featured: boolean;
  is_urgent: boolean;
  views_count: number;
  applications_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  company?: {
    id: string;
    name: string;
    logo_url?: string;
    industry?: string;
    description?: string;
    is_verified: boolean;
  };
  category?: {
    id: string;
    name: string;
  };
  location?: {
    id: string;
    city: string;
    state?: string;
    country?: string;
  };
}

interface JobDetailProps {
  job?: Job;
  relatedJobs: Job[];
  onApply: (jobId: string, applicationData?: any) => void;
  onSave: (jobId: string) => void;
  isSaved: boolean;
  hasApplied: boolean;
  onViewJob: (jobId: string) => void;
  onViewCompany?: (companyName: string) => void;
  currentUser?: any;
}

export function JobDetail({ job, relatedJobs, onApply, onSave, isSaved, hasApplied, onViewJob, onViewCompany, currentUser }: JobDetailProps) {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availableFrom: '',
    resumeFile: null as File | null,
    agreeToTerms: false,
    contactPermission: true
  });
  const [reminderDate, setReminderDate] = useState('');

  // Helper function to get company name from either structure
  const getCompanyName = (job: Job): string | null => {
    // New structure with company object
    if (job.company?.name) {
      return job.company.name;
    }
    // Legacy structure where company is a string (from AppProvider)
    if ((job as any).company && typeof (job as any).company === 'string') {
      return (job as any).company;
    }
    return null;
  };

  // Helper function to get company logo
  const getCompanyLogo = (job: Job): string => {
    // New structure with company object
    if (job.company?.logo_url) {
      return job.company.logo_url;
    }
    // Legacy structure fallbacks
    if ((job as any).logo) {
      return (job as any).logo;
    }
    if ((job as any).companyLogo) {
      return (job as any).companyLogo;
    }
    return '/placeholder-company.png';
  };

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Reset form data on unmount
      setApplicationData({
        coverLetter: '',
        expectedSalary: '',
        availableFrom: '',
        resumeFile: null,
        agreeToTerms: false,
        contactPermission: true
      });
      setReminderDate('');
    };
  }, []);

  const handleQuickApply = () => {
    if (!job) {
      toast.error('Job not found');
      return;
    }
    if (!currentUser) {
      toast.error('Please log in to apply for jobs', {
        action: {
          label: 'Login',
          onClick: () => {
            // This would trigger the login modal in a real app
            window.location.href = '/auth';
          }
        }
      });
      return;
    }
    if (hasApplied) {
      toast.info('You have already applied for this job');
      return;
    }
    
    try {
      onApply(job.id);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Application error:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handleDetailedApply = () => {
    if (!job) {
      toast.error('Job not found');
      return;
    }
    if (!currentUser) {
      toast.error('Please log in to apply for jobs');
      return;
    }
    if (hasApplied) {
      toast.info('You have already applied for this job');
      return;
    }
    
    if (!applicationData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    try {
      onApply(job.id, applicationData);
      setShowApplicationModal(false);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Application error:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handleSetReminder = () => {
    if (!reminderDate) {
      toast.error('Please select a reminder date');
      return;
    }
    
    // In a real app, this would save the reminder
    console.log('Setting reminder for', reminderDate);
    setShowReminderModal(false);
    toast.success('Application reminder set successfully!');
  };

  const handleShareJob = () => {
    if (!job) {
      toast.error('Job not found');
      return;
    }
    
    setShowShareModal(true);
  };



  const formatSalary = (min?: number, max?: number, negotiable?: boolean) => {
    if (negotiable) return 'Negotiable';
    if (min && max) return `NPR ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `NPR ${min.toLocaleString()}+`;
    return 'Competitive Salary';
  };

  const getJobTierBadge = (tier: string) => {
    const tierConfig = {
      mega_job: { label: 'MegaJob', className: 'bg-purple-100 text-purple-800' },
      premium_job: { label: 'Premium', className: 'bg-blue-100 text-blue-800' },
      prime_job: { label: 'Prime', className: 'bg-green-100 text-green-800' },
      latest_job: { label: 'Latest', className: 'bg-gray-100 text-gray-800' },
      newspaper_job: { label: 'Newspaper', className: 'bg-orange-100 text-orange-800' }
    };
    
    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.latest_job;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Job Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex items-start space-x-6">
                <ImageWithFallback
                  src={getCompanyLogo(job)}
                  alt={getCompanyName(job) || 'Company'}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    {job.is_featured && (
                      <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                    )}
                    {job.is_urgent && (
                      <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                    )}
                    {getJobTierBadge(job.job_tier)}
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h2 className="text-xl text-gray-700">{getCompanyName(job)}</h2>
                    {job.company?.is_verified && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{job.location?.city || 'Remote'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{job.employment_type?.replace('_', ' ') || 'Full Time'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{formatSalary(job.salary_min, job.salary_max, job.salary_negotiable)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{job.experience_level?.replace('_', ' ') || 'Entry Level'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleQuickApply}
                    disabled={hasApplied || !currentUser}
                    className="bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white font-semibold"
                  >
                    {hasApplied ? 'Applied' : !currentUser ? 'Login to Apply' : 'Quick Apply'}
                  </Button>
                  
                  <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={hasApplied || !currentUser}
                        className="w-full hover:bg-primary/10 hover:text-primary border-primary/20"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {!currentUser ? 'Login for Detailed Apply' : 'Detailed Apply'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="application-form-description">
                      <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                        <DialogDescription id="application-form-description">
                          Fill out the application form below to apply for this position. All fields are optional unless marked as required.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cover-letter">Cover Letter</Label>
                          <Textarea
                            id="cover-letter"
                            placeholder="Tell us why you're perfect for this role..."
                            value={applicationData.coverLetter}
                            onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expected-salary">Expected Salary (NPR)</Label>
                            <Input
                              id="expected-salary"
                              type="number"
                              placeholder="e.g. 60000"
                              value={applicationData.expectedSalary}
                              onChange={(e) => setApplicationData({...applicationData, expectedSalary: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="available-from">Available From</Label>
                            <Input
                              id="available-from"
                              type="date"
                              value={applicationData.availableFrom}
                              onChange={(e) => setApplicationData({...applicationData, availableFrom: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="resume-upload">Resume (Optional)</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 mb-2">Upload a different resume for this application</p>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => setApplicationData({...applicationData, resumeFile: e.target.files?.[0] || null})}
                              className="hidden"
                              id="resume-upload-input"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('resume-upload-input')?.click()}
                            >
                              Choose File
                            </Button>
                            {applicationData.resumeFile && (
                              <p className="text-sm text-green-600 mt-2">{applicationData.resumeFile.name}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="agree-terms"
                              checked={applicationData.agreeToTerms}
                              onCheckedChange={(checked) => setApplicationData({...applicationData, agreeToTerms: checked as boolean})}
                            />
                            <Label htmlFor="agree-terms" className="text-sm">
                              I agree to the terms and conditions and privacy policy
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="contact-permission"
                              checked={applicationData.contactPermission}
                              onCheckedChange={(checked) => setApplicationData({...applicationData, contactPermission: checked as boolean})}
                            />
                            <Label htmlFor="contact-permission" className="text-sm">
                              Allow the employer to contact me about this position
                            </Label>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setShowApplicationModal(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleDetailedApply}>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Application
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!currentUser) {
                        toast.error('Please log in to save jobs');
                        return;
                      }
                      onSave(job.id);
                      toast.success(isSaved ? 'Job removed from saved list' : 'Job saved successfully!');
                    }}
                    className="flex-1 lg:w-full hover:bg-red-50 hover:border-red-200"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    {isSaved ? 'Saved' : 'Save Job'}
                  </Button>
                  
                  <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent aria-describedby="reminder-form-description">
                      <DialogHeader>
                        <DialogTitle>Set Application Reminder</DialogTitle>
                        <DialogDescription id="reminder-form-description">
                          Choose a date when you want to be reminded to apply for this job.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="reminder-date">Remind me on</Label>
                          <Input
                            id="reminder-date"
                            type="date"
                            value={reminderDate}
                            onChange={(e) => setReminderDate(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowReminderModal(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSetReminder}>
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" size="icon" onClick={handleShareJob}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {formatDate(job.published_at || job.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{job.views_count} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{job.applications_count} applicants</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{job.employment_type?.replace('_', ' ') || 'Full Time'}</Badge>
                {job.experience_level && (
                  <Badge variant="outline">{job.experience_level.replace('_', ' ')}</Badge>
                )}
                {job.category && (
                  <Badge variant="outline">{job.category.name}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Job Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h3>
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
                    {job.description || 'We are looking for a motivated professional to join our team. This position offers excellent opportunities for growth and development in a dynamic work environment.'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
                    {job.requirements || `• Bachelor's degree in relevant field or equivalent experience
• Strong communication and interpersonal skills
• Ability to work independently and as part of a team
• Proficiency in relevant software and tools
• Willingness to learn and adapt to new challenges`}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Description */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">About {getCompanyName(job) || 'the Company'}</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
                    onClick={() => {
                      const companyName = getCompanyName(job);
                      if (companyName && onViewCompany) {
                        onViewCompany(companyName);
                      } else {
                        toast.info('Company profile will be available soon');
                      }
                    }}
                  >
                    <Building className="w-4 h-4 mr-2" />
                    View Company
                  </Button>
                </div>
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    {job.company?.description || `${getCompanyName(job) || 'This company'} is a leading organization committed to excellence and innovation. We provide a collaborative work environment where employees can grow professionally and make meaningful contributions to our mission.`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Company Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <ImageWithFallback
                    src={getCompanyLogo(job)}
                    alt={getCompanyName(job) || 'Company'}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{getCompanyName(job)}</span>
                      {job.company?.is_verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                      )}
                    </div>
                    {job.company?.industry && (
                      <p className="text-sm text-gray-600">{job.company.industry}</p>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
                  onClick={() => {
                    const companyName = getCompanyName(job);
                    if (companyName && onViewCompany) {
                      onViewCompany(companyName);
                    } else {
                      toast.info('Company profile will be available soon');
                    }
                  }}
                >
                  <Building className="w-4 h-4 mr-2" />
                  View Company Profile
                </Button>
              </CardContent>
            </Card>

            {/* Job Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published On:</span>
                    <span className="font-medium">{formatDate(job.published_at || job.created_at)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type:</span>
                    <span className="font-medium">{job.employment_type?.replace('_', ' ') || 'Full Time'}</span>
                  </div>
                  <Separator />
                  {job.experience_level && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{job.experience_level.replace('_', ' ')}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{job.location?.city || 'Remote'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary:</span>
                    <span className="font-medium text-green-600">{formatSalary(job.salary_min, job.salary_max, job.salary_negotiable)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applications:</span>
                    <span className="font-medium">{job.applications_count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Apply */}
            <Card className="bg-primary/5 border-primary/20 shadow-lg">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {hasApplied ? 'Application Status' : 'Quick Apply'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {hasApplied 
                    ? 'Your application has been submitted successfully' 
                    : currentUser 
                      ? 'Apply now with your saved profile' 
                      : 'Sign in to apply for this position'
                  }
                </p>
                {hasApplied ? (
                  <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">Application Submitted</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleQuickApply}
                    disabled={!currentUser}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition-colors"
                  >
                    {!currentUser ? 'Sign In to Apply' : 'Apply Now'}
                  </Button>
                )}
                {!hasApplied && currentUser && (
                  <p className="text-xs text-gray-500 mt-2">
                    Or use detailed apply for a custom application
                  </p>
                )}
                {!currentUser && (
                  <p className="text-xs text-gray-500 mt-2">
                    Create an account to save your applications
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedJobs.map((relatedJob) => (
                <Card key={relatedJob.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <ImageWithFallback
                        src={relatedJob.company?.logo_url || '/placeholder-company.png'}
                        alt={relatedJob.company?.name || 'Company'}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1">{relatedJob.title}</h4>
                        <p className="text-sm text-gray-600">{relatedJob.company?.name}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{relatedJob.location?.city || 'Remote'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatSalary(relatedJob.salary_min, relatedJob.salary_max, relatedJob.salary_negotiable)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">{relatedJob.employment_type?.replace('_', ' ') || 'Full Time'}</Badge>
                      {relatedJob.experience_level && (
                        <Badge variant="outline" className="text-xs">{relatedJob.experience_level.replace('_', ' ')}</Badge>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => onViewJob(relatedJob.id)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Share Job Modal - Only render when needed */}
      {showShareModal && job && (
        <ShareJobModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          job={job}
        />
      )}
    </div>
  );
}