import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  HeadphonesIcon,
  Building,
  Users,
  Globe
} from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Head Office',
      details: [
        'MegaJobNepal Pvt. Ltd.',
        'Putalisadak, Kathmandu',
        'Bagmati Province, Nepal',
        'P.O. Box: 12345'
      ]
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: [
        'Main: +977-1-4444567',
        'Support: +977-1-4444568',
        'Sales: +977-1-4444569',
        'HR: +977-1-4444570'
      ]
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: [
        'General: info@megajobnepal.com',
        'Support: support@megajobnepal.com',
        'Sales: sales@megajobnepal.com',
        'Careers: hr@megajobnepal.com'
      ]
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: [
        'Monday - Friday: 9:00 AM - 6:00 PM',
        'Saturday: 10:00 AM - 4:00 PM',
        'Sunday: Closed',
        'Public Holidays: Closed'
      ]
    }
  ];

  const departments = [
    {
      icon: HeadphonesIcon,
      name: 'Customer Support',
      description: 'Get help with your account, job applications, or technical issues.',
      email: 'support@megajobnepal.com',
      phone: '+977-1-4444568',
      responseTime: '24 hours'
    },
    {
      icon: Building,
      name: 'Sales & Partnerships',
      description: 'Inquiries about employer packages, partnerships, and business solutions.',
      email: 'sales@megajobnepal.com',
      phone: '+977-1-4444569',
      responseTime: '12 hours'
    },
    {
      icon: Users,
      name: 'Human Resources',
      description: 'Career opportunities at MegaJobNepal and general HR inquiries.',
      email: 'hr@megajobnepal.com',
      phone: '+977-1-4444570',
      responseTime: '48 hours'
    },
    {
      icon: Globe,
      name: 'Media & Press',
      description: 'Media inquiries, press releases, and public relations matters.',
      email: 'media@megajobnepal.com',
      phone: '+977-1-4444571',
      responseTime: '24 hours'
    }
  ];

  const faqs = [
    {
      question: 'How do I create an account on MegaJobNepal?',
      answer: 'Click on "Login/Register" and choose between Job Seeker or Employer account. Fill in your details and verify your email to get started.'
    },
    {
      question: 'Is there a fee for job seekers to use the platform?',
      answer: 'No, MegaJobNepal is completely free for job seekers. You can search jobs, apply, and manage your profile at no cost.'
    },
    {
      question: 'How long does it take for employers to respond to applications?',
      answer: 'Response times vary by employer, but most respond within 1-2 weeks. You can track your application status in your dashboard.'
    },
    {
      question: 'Can I post jobs in languages other than English?',
      answer: 'Yes, we support job postings in Nepali and English. You can choose your preferred language when posting.'
    },
    {
      question: 'Do you provide recruitment services?',
      answer: 'Yes, we offer premium recruitment services including candidate screening, interviews, and placement assistance. Contact our sales team for details.'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl max-w-2xl mx-auto">
              We're here to help! Whether you have questions, feedback, or need support, 
              our team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form and Departments */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>Send us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Enter message subject"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                        <SelectItem value="media">Media & Press</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Type your message here..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Departments */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Departments</h2>
              <div className="space-y-6">
                {departments.map((dept, index) => {
                  const IconComponent = dept.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
                            <p className="text-gray-600 mb-3">{dept.description}</p>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Email:</span> {dept.email}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Phone:</span> {dept.phone}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  Response: {dept.responseTime}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Find answers to the most common questions about MegaJobNepal.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
            <Button variant="outline">
              View All FAQs
            </Button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
            <p className="text-xl text-gray-600">
              We're located in the heart of Kathmandu. Drop by for a coffee and chat!
            </p>
          </div>
          
          <Card className="overflow-hidden">
            <div className="h-96">
              <iframe
                src="https://maps.google.com/maps?q=Putalisadak+Kathmandu+Nepal&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MegaJobNepal Office Location"
              />
            </div>
            <div className="p-6 bg-white border-t">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">MegaJobNepal Head Office</h3>
                  <p className="text-gray-600">
                    Putalisadak, Kathmandu<br />
                    Bagmati Province, Nepal<br />
                    P.O. Box: 12345
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://goo.gl/maps/putalisadak-kathmandu', '_blank')}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'MegaJobNepal Office Location',
                          text: 'Visit our office at Putalisadak, Kathmandu',
                          url: 'https://goo.gl/maps/putalisadak-kathmandu'
                        });
                      } else {
                        navigator.clipboard.writeText('Putalisadak, Kathmandu, Nepal - https://goo.gl/maps/putalisadak-kathmandu');
                      }
                    }}
                  >
                    Share Location
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}