import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Target, Award, TrendingUp, Mail, Phone, MapPin, Linkedin } from 'lucide-react';

export function AboutPage() {
  const stats = [
    { icon: Users, label: 'Active Job Seekers', value: '50,000+' },
    { icon: Target, label: 'Job Placements', value: '12,000+' },
    { icon: Award, label: 'Partner Companies', value: '2,500+' },
    { icon: TrendingUp, label: 'Success Rate', value: '85%' }
  ];

  const managementTeam = [
    {
      id: 1,
      name: 'Rajesh Sharma',
      position: 'Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
      bio: 'Rajesh has over 15 years of experience in HR technology and has been instrumental in transforming Nepal\'s job market through digital innovation.',
      email: 'rajesh@megajobnepal.com',
      phone: '+977-1-4444567',
      linkedin: 'linkedin.com/in/rajeshsharma'
    },
    {
      id: 2,
      name: 'Sita Poudel',
      position: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b2fd?w=300&h=300&fit=crop',
      bio: 'Sita leads our technology initiatives with expertise in AI-driven job matching and platform scalability. She has a Master\'s in Computer Science from Tribhuvan University.',
      email: 'sita@megajobnepal.com',
      phone: '+977-1-4444568',
      linkedin: 'linkedin.com/in/sitapoudel'
    },
    {
      id: 3,
      name: 'Bishal Thapa',
      position: 'Chief Operating Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      bio: 'Bishal oversees daily operations and has successfully scaled our platform to serve clients across all 7 provinces of Nepal.',
      email: 'bishal@megajobnepal.com',
      phone: '+977-1-4444569',
      linkedin: 'linkedin.com/in/bishalthapa'
    },
    {
      id: 4,
      name: 'Kamala Rai',
      position: 'Head of Human Resources',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      bio: 'Kamala brings deep expertise in talent acquisition and has helped thousands of Nepali professionals find their dream careers.',
      email: 'kamala@megajobnepal.com',
      phone: '+977-1-4444570',
      linkedin: 'linkedin.com/in/kamalarai'
    }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We continuously evolve our platform to meet the changing needs of Nepal\'s job market.'
    },
    {
      title: 'Integrity',
      description: 'We maintain the highest standards of honesty and transparency in all our interactions.'
    },
    {
      title: 'Inclusivity',
      description: 'We believe in creating equal opportunities for all job seekers regardless of background.'
    },
    {
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from our technology to customer service.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About MegaJobNepal</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Nepal's leading job portal connecting talented professionals with top employers 
              across the country. We're transforming careers and building the future workforce.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                Established 2018
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                ISO Certified
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                Award Winning
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardContent className="p-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To revolutionize Nepal's job market by providing an innovative, user-friendly platform 
                  that connects the right talent with the right opportunities. We're committed to reducing 
                  unemployment and building a stronger economy through technology-driven solutions.
                </p>
              </CardContent>
            </Card>
            <Card className="p-8">
              <CardContent className="p-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To become South Asia's most trusted job portal, empowering millions of professionals 
                  to achieve their career dreams while helping businesses build world-class teams. 
                  We envision a future where every Nepali has access to meaningful employment opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These fundamental principles guide our decisions and shape our company culture.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the experienced professionals leading MegaJobNepal's mission to transform Nepal's job market.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {managementTeam.map((member) => (
              <div key={member.id} className="group relative">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                  
                  {/* Hover Overlay with Contact Details */}
                  <div className="absolute inset-0 bg-blue-600 text-white p-6 flex flex-col justify-center opacity-0 group-hover:opacity-95 transition-opacity duration-300">
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <p className="text-blue-200 font-medium mb-4">{member.position}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm break-all">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Linkedin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm break-all">{member.linkedin}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-blue-200">
                      Hover to see contact details
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Founded in 2018 by a team of passionate entrepreneurs and tech professionals, MegaJobNepal 
              was born out of a simple observation: Nepal's talented workforce deserved better access to 
              quality employment opportunities, and employers needed a more efficient way to find the right talent.
            </p>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              What started as a small startup in Kathmandu has now grown into Nepal's most trusted job portal, 
              serving over 50,000 active job seekers and 2,500+ partner companies. Our AI-powered matching system 
              has revolutionized how Nepalis find jobs and how companies build their teams.
            </p>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Today, we're proud to have facilitated over 12,000 successful job placements and continue to 
              innovate with features like skill assessments, virtual interviews, and career development resources. 
              Our commitment to excellence has earned us recognition as the "Best Job Portal in Nepal" for three 
              consecutive years.
            </p>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              As we look to the future, we remain dedicated to our mission of creating meaningful connections 
              between talent and opportunity, contributing to Nepal's economic growth and helping build a 
              brighter future for all Nepalis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}