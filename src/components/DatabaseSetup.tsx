import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { CheckCircle, Database, AlertCircle, Loader2 } from "lucide-react";
import { dbService } from "../lib/mongodb-fixed";
import { mongodbAuthService } from "../lib/mongodb-auth";
import { mockJobs } from "../lib/mockData";

export function DatabaseSetup() {
  const [isSetupRunning, setIsSetupRunning] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupSteps, setSetupSteps] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDatabaseSetup = async () => {
    setIsSetupRunning(true);
    setSetupProgress(0);
    setSetupSteps([]);
    setError(null);
    setIsComplete(false);

    try {
      // Step 1: Initialize MongoDB database
      setSetupSteps(prev => [...prev, "Initializing MongoDB database..."]);
      setSetupProgress(10);
      
      await dbService.setupDatabase();
      
      // Step 2: Create default job categories
      setSetupSteps(prev => [...prev, "Creating default job categories..."]);
      setSetupProgress(30);
      
      await createDefaultJobCategories();
      
      // Step 3: Create demo users (admin, jobseeker, employer)
      setSetupSteps(prev => [...prev, "Creating demo user accounts..."]);
      setSetupProgress(50);
      
      await createDemoUsers();
      
      // Step 4: Create sample companies
      setSetupSteps(prev => [...prev, "Creating sample companies..."]);
      setSetupProgress(70);
      
      await createSampleCompanies();
      
      // Step 5: Create sample jobs
      setSetupSteps(prev => [...prev, "Creating sample jobs..."]);
      setSetupProgress(85);
      
      await createSampleJobs();
      
      // Step 6: Complete
      setSetupSteps(prev => [...prev, "MongoDB database setup completed successfully!"]);
      setSetupProgress(100);
      setIsComplete(true);
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("MongoDB database setup failed:", error);
      setError(error instanceof Error ? error.message : "Setup failed");
      setSetupSteps(prev => [...prev, `Error: ${error instanceof Error ? error.message : "Setup failed"}`]);
    } finally {
      setIsSetupRunning(false);
    }
  };

  const createDemoUsers = async () => {
    const demoUsers = [
      {
        email: "admin.demo@megajobnepal.com",
        password: "admin123",
        full_name: "Demo Administrator",
        user_type: "admin" as const,
        phone_number: "+977-1-4441234",
      },
      {
        email: "hr.demo@megajobnepal.com",
        password: "hr123",
        full_name: "HR Manager Demo",
        user_type: "admin" as const,
        phone_number: "+977-1-4441235",
      },
      {
        email: "jobseeker.demo@megajobnepal.com",
        password: "jobseeker123",
        full_name: "Demo Job Seeker",
        user_type: "job_seeker" as const,
        phone_number: "+977-98-12345678",
      },
      {
        email: "employer.demo@megajobnepal.com",
        password: "employer123",
        full_name: "Demo Employer",
        user_type: "employer" as const,
        phone_number: "+977-98-87654321",
      }
    ];

    console.log('🔧 Creating demo users...');

    for (const userData of demoUsers) {
      try {
        // Check if user already exists
        const existingUser = await dbService.getUserByEmail(userData.email);
        if (existingUser) {
          // Ensure existing demo user is verified and has correct role
          await dbService.updateUser(existingUser.id!, {
            is_verified: true,
            otp_code: undefined,
            otp_expires_at: undefined,
            user_type: userData.user_type, // Ensure role is correct
            role: userData.user_type, // Add legacy role field for compatibility
          });
          console.log(`✅ Demo user ${userData.email} updated and verified`);
          continue;
        }

        // Create demo user using signUp method
        const userResult = await mongodbAuthService.signUp(userData);

        if ('error' in userResult) {
          console.error(`❌ Demo user creation error for ${userData.email}:`, userResult.error);
          continue;
        } else {
          // Immediately verify the demo user (bypass OTP for demo accounts)
          await dbService.updateUser(userResult.user.id!, {
            is_verified: true,
            otp_code: undefined,
            otp_expires_at: undefined,
            role: userData.user_type, // Add legacy role field for compatibility
          });
          console.log(`✅ Demo user ${userData.email} created and verified successfully`);
        }
      } catch (error) {
        console.error(`❌ Failed to create demo user ${userData.email}:`, error);
        // Continue with other users even if one fails
      }
    }
  };

  const createDefaultJobCategories = async () => {
    const categories = [
      // Tier 1 Categories (Main Categories)
      { name: "Information Technology", tier: 1, description: "Software, Hardware, and IT Services" },
      { name: "Finance & Banking", tier: 1, description: "Banking, Insurance, and Financial Services" },
      { name: "Healthcare & Medical", tier: 1, description: "Medical, Pharmaceutical, and Healthcare Services" },
      { name: "Education & Training", tier: 1, description: "Teaching, Training, and Educational Services" },
      { name: "Engineering", tier: 1, description: "Civil, Mechanical, Electrical, and Other Engineering" },
      
      // Tier 2 Categories (Sub Categories)
      { name: "Software Development", tier: 2, description: "Web, Mobile, and Desktop Application Development" },
      { name: "Data Science & Analytics", tier: 2, description: "Data Analysis, Machine Learning, and AI" },
      { name: "Cybersecurity", tier: 2, description: "Information Security and Risk Management" },
      { name: "Commercial Banking", tier: 2, description: "Retail and Corporate Banking Services" },
      { name: "Investment Banking", tier: 2, description: "Investment and Advisory Services" },
      
      // Tier 3 Categories (Specific Roles)
      { name: "Frontend Developer", tier: 3, description: "UI/UX Development with React, Angular, Vue" },
      { name: "Backend Developer", tier: 3, description: "Server-side Development and APIs" },
      { name: "Full Stack Developer", tier: 3, description: "End-to-end Web Development" },
      { name: "Mobile App Developer", tier: 3, description: "iOS and Android Development" },
      { name: "DevOps Engineer", tier: 3, description: "Infrastructure and Deployment Automation" },
    ];

    for (const category of categories) {
      await dbService.createJobCategory(category);
    }
  };

  const createSampleCompanies = async () => {
    const companies = [
      {
        name: "TechVision Nepal",
        description: "Leading software development company in Nepal specializing in web and mobile applications",
        website: "https://techvision.com.np",
        location: "Kathmandu, Nepal",
        industry: "Information Technology",
        size: "50-100 employees",
        founded_year: 2018,
        is_featured: true,
        is_top_hiring: true,
        is_trusted: true,
      },
      {
        name: "Himalayan Bank Ltd",
        description: "One of Nepal's premier commercial banks offering comprehensive financial services",
        website: "https://himalayanbank.com",
        location: "Kathmandu, Nepal",
        industry: "Banking & Finance",
        size: "500+ employees",
        founded_year: 1993,
        is_featured: true,
        is_top_hiring: false,
        is_trusted: true,
      },
      {
        name: "Nepal Telecommunications Authority",
        description: "Government regulatory body for telecommunications in Nepal",
        website: "https://nta.gov.np",
        location: "Kathmandu, Nepal",
        industry: "Telecommunications",
        size: "100-200 employees",
        founded_year: 1998,
        is_featured: false,
        is_top_hiring: true,
        is_trusted: true,
      },
      {
        name: "Innovative Tech Solutions",
        description: "Digital transformation and software consulting company",
        location: "Pokhara, Nepal",
        industry: "Information Technology",
        size: "20-50 employees",
        founded_year: 2020,
        is_featured: false,
        is_top_hiring: true,
        is_trusted: false,
      },
      {
        name: "Green Energy Nepal",
        description: "Renewable energy solutions and consulting",
        location: "Lalitpur, Nepal",
        industry: "Energy & Environment",
        size: "10-20 employees",
        founded_year: 2019,
        is_featured: false,
        is_top_hiring: false,
        is_trusted: true,
      },
    ];

    for (const company of companies) {
      await dbService.createCompany(company);
    }
  };

  const createSampleJobs = async () => {
    // Get created companies and categories first
    const companies = await dbService.getCompanies();
    const categories = await dbService.getJobCategories();
    
    if (companies.length === 0 || categories.length === 0) return;

    // Create a mapping of tier to job tier
    const tierMapping = {
      'megajob': 'mega_job',
      'premium': 'premium_job', 
      'prime': 'prime_job',
      'latest': 'latest_job',
      'newspaper': 'newspaper_job'
    };

    // Convert mockJobs to database format
    const jobsToCreate = mockJobs.map((mockJob, index) => {
      // Use the first available company as fallback
      const company = companies[index % companies.length];
      // Use the first available category as fallback  
      const category = categories[index % categories.length];
      
      // Convert salary string to numbers
      let salaryMin = 25000;
      let salaryMax = 50000;
      
      if (mockJob.salary && mockJob.salary.includes('NPR')) {
        const salaryParts = mockJob.salary.replace('NPR ', '').split(' - ');
        if (salaryParts.length === 2) {
          salaryMin = parseInt(salaryParts[0].replace(/,/g, '')) || 25000;
          salaryMax = parseInt(salaryParts[1].replace(/,/g, '')) || 50000;
        }
      }

      // Determine experience level
      let experienceLevel = 'entry';
      if (mockJob.experience.includes('Senior') || mockJob.experience.includes('Executive')) {
        experienceLevel = 'senior';
      } else if (mockJob.experience.includes('Mid')) {
        experienceLevel = 'mid';
      }

      return {
        title: mockJob.title,
        description: mockJob.description,
        requirements: Array.isArray(mockJob.requirements) ? mockJob.requirements.join(', ') : mockJob.requirements,
        benefits: "Competitive salary, health insurance, flexible working hours",
        salary_min: salaryMin,
        salary_max: salaryMax,
        salary_currency: "NPR",
        employment_type: "full_time",
        experience_level: experienceLevel,
        location: mockJob.location,
        is_remote: mockJob.tags?.includes('Remote') || false,
        company_id: company.id!,
        category_id: category.id!,
        status: "active" as const,
        posted_by: "employer",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        tier: tierMapping[mockJob.tier as keyof typeof tierMapping] || 'latest_job',
        tags: mockJob.tags?.join(', ') || '',
        category: mockJob.category,
        source: mockJob.source || 'online',
        featured: mockJob.featured || false,
        urgent: mockJob.urgent || false,
        logo: mockJob.logo || company.logo || '',
        posted_date: mockJob.postedDate,
        published_date: mockJob.publishedDate,
        approvalStatus: mockJob.approvalStatus || 'approved',
        approvedBy: mockJob.approvedBy || 'admin',
        approvedDate: mockJob.approvedDate || mockJob.publishedDate,
        submittedBy: 'demo-setup',
        submittedDate: mockJob.publishedDate
      };
    });

    console.log(`Creating ${jobsToCreate.length} jobs from mockData...`);
    
    for (const job of jobsToCreate) {
      try {
        await dbService.createJob(job);
      } catch (error) {
        console.error(`Failed to create job: ${job.title}`, error);
        // Continue with other jobs even if one fails
      }
    }
    
    console.log(`✅ Successfully created ${jobsToCreate.length} jobs including all Prime Jobs`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl">Database Setup</CardTitle>
              <CardDescription>
                Initialize your MegaJobNepal database with required collections and sample data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {isSetupRunning ? (
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              ) : isComplete ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : error ? (
                <AlertCircle className="w-6 h-6 text-red-600" />
              ) : (
                <Database className="w-6 h-6 text-gray-600" />
              )}
              <div>
                <h3 className="font-semibold">
                  {isSetupRunning
                    ? "Setting up database..."
                    : isComplete
                    ? "Setup completed successfully!"
                    : error
                    ? "Setup failed"
                    : "Ready to setup database"}
                </h3>
                <p className="text-sm text-gray-600">
                  {isSetupRunning
                    ? "Please wait while we initialize your database"
                    : isComplete
                    ? "Your database is ready to use. Page will refresh shortly."
                    : error
                    ? "There was an error during setup. Check the logs below."
                    : "Click the button below to start the database initialization"}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {(isSetupRunning || isComplete) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Setup Progress</span>
                <span>{setupProgress}%</span>
              </div>
              <Progress value={setupProgress} className="w-full" />
            </div>
          )}

          {/* What will be setup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Database Collections</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Users (Job seekers, Employers, Admins)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Companies and Organizations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Job Categories (3-tier structure)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Job Postings and Applications</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Sample Data</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Default admin user</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Job categories (IT, Finance, Healthcare, etc.)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Sample companies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Database indexes for performance</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Setup Button */}
          <div className="flex justify-center">
            <Button
              onClick={runDatabaseSetup}
              disabled={isSetupRunning || isComplete}
              size="lg"
              className="px-8"
            >
              {isSetupRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : isComplete ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Setup Complete
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Initialize Database
                </>
              )}
            </Button>
          </div>

          {/* Setup Steps Log */}
          {setupSteps.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Setup Log</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono max-h-64 overflow-y-auto">
                {setupSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Setup Error</h4>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
              <Button
                onClick={runDatabaseSetup}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Retry Setup
              </Button>
            </div>
          )}

          {/* Demo Credentials */}
          {isComplete && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Demo Account Credentials</h4>
              <div className="text-sm text-blue-700 space-y-2">
                <div>
                  <p><strong>Admin:</strong> admin.demo@megajobnepal.com / admin123</p>
                  <p><strong>HR:</strong> hr.demo@megajobnepal.com / hr123</p>
                </div>
                <div>
                  <p><strong>Job Seeker:</strong> jobseeker.demo@megajobnepal.com / jobseeker123</p>
                  <p><strong>Employer:</strong> employer.demo@megajobnepal.com / employer123</p>
                </div>
                <p className="mt-2 text-xs">Full details are available in the Guidelines.md file.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}