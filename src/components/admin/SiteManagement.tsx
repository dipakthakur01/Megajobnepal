import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Save,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SiteManagement() {
  const [siteInfo, setSiteInfo] = useState({
    siteName: 'MegaJobNepal',
    siteUrl: 'https://megajobnepal.com',
    tagline: "Nepal's Premier Job Portal",
    description: 'Connect talented professionals with leading employers across Nepal. Find your dream job or hire the perfect candidate.',
    metaDescription: 'MegaJobNepal - Leading job portal in Nepal. Find jobs, post jobs, connect with employers and job seekers.',
    keywords: 'jobs nepal, employment, careers, hiring, job search, kathmandu jobs',
    
    // Contact Information
    email: 'info@megajobnepal.com',
    phone: '+977-1-4123456',
    address: 'Kathmandu, Nepal',
    supportEmail: 'support@megajobnepal.com',
    businessEmail: 'business@megajobnepal.com',
    
    // Company Location & Map
    companyLocation: 'Putalisadak, Kathmandu, Nepal',
    mapUrl: 'https://maps.google.com/maps?q=Putalisadak+Kathmandu&output=embed',
    googleMapsLink: 'https://goo.gl/maps/example',
    coordinates: {
      latitude: '27.7172',
      longitude: '85.3240'
    },
    
    // Social Media
    facebook: 'https://facebook.com/megajobnepal',
    instagram: 'https://instagram.com/megajobnepal',
    twitter: 'https://twitter.com/megajobnepal',
    linkedin: 'https://linkedin.com/company/megajobnepal',
    youtube: 'https://youtube.com/megajobnepal',
    
    // Company Info
    companyName: 'MegaJobNepal Pvt. Ltd.',
    registrationNumber: 'REG12345',
    taxNumber: 'TAX67890',
    establishedYear: '2020'
  });

  const [isLoading, setSaveLoading] = useState(false);

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Site information updated successfully!');
    } catch (error) {
      toast.error('Failed to update site information');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Site Management</h2>
          <p className="text-gray-600">Configure site information, contact details, and social media</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Saving...' : 'Save All Changes'}</span>
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="company">Company Info</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Website Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteInfo.siteName}
                    onChange={(e) => setSiteInfo({ ...siteInfo, siteName: e.target.value })}
                    placeholder="Your site name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={siteInfo.siteUrl}
                    onChange={(e) => setSiteInfo({ ...siteInfo, siteUrl: e.target.value })}
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={siteInfo.tagline}
                  onChange={(e) => setSiteInfo({ ...siteInfo, tagline: e.target.value })}
                  placeholder="Your site tagline"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Site Description</Label>
                <Textarea
                  id="description"
                  value={siteInfo.description}
                  onChange={(e) => setSiteInfo({ ...siteInfo, description: e.target.value })}
                  placeholder="Describe your website"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                <Textarea
                  id="metaDescription"
                  value={siteInfo.metaDescription}
                  onChange={(e) => setSiteInfo({ ...siteInfo, metaDescription: e.target.value })}
                  placeholder="SEO meta description (160 characters max)"
                  rows={2}
                />
                <p className="text-xs text-gray-500">{siteInfo.metaDescription.length}/160 characters</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keywords">SEO Keywords</Label>
                <Input
                  id="keywords"
                  value={siteInfo.keywords}
                  onChange={(e) => setSiteInfo({ ...siteInfo, keywords: e.target.value })}
                  placeholder="job, employment, career, nepal (comma separated)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Logo & Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Site Logos & Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Main Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <Button variant="outline" size="sm">Upload Logo</Button>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG (max 2MB)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <Button variant="outline" size="sm">Upload Favicon</Button>
                    <p className="text-xs text-gray-500 mt-1">ICO, PNG (32x32px)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Default Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <Button variant="outline" size="sm">Upload Image</Button>
                    <p className="text-xs text-gray-500 mt-1">For social media sharing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Primary Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={siteInfo.email}
                    onChange={(e) => setSiteInfo({ ...siteInfo, email: e.target.value })}
                    placeholder="info@yoursite.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Primary Phone</Label>
                  <Input
                    id="phone"
                    value={siteInfo.phone}
                    onChange={(e) => setSiteInfo({ ...siteInfo, phone: e.target.value })}
                    placeholder="+977-1-1234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={siteInfo.supportEmail}
                    onChange={(e) => setSiteInfo({ ...siteInfo, supportEmail: e.target.value })}
                    placeholder="support@yoursite.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={siteInfo.businessEmail}
                    onChange={(e) => setSiteInfo({ ...siteInfo, businessEmail: e.target.value })}
                    placeholder="business@yoursite.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Office Address</Label>
                <Textarea
                  id="address"
                  value={siteInfo.address}
                  onChange={(e) => setSiteInfo({ ...siteInfo, address: e.target.value })}
                  placeholder="Your office address"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Company Location & Map Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Company Location & Map
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyLocation">Company Location *</Label>
                <Textarea
                  id="companyLocation"
                  value={siteInfo.companyLocation}
                  onChange={(e) => setSiteInfo({ ...siteInfo, companyLocation: e.target.value })}
                  placeholder="Complete company address for maps and contact page"
                  rows={2}
                />
                <p className="text-xs text-gray-500">This will be displayed on the contact page and used for the map</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mapUrl">Google Maps Embed URL</Label>
                  <Textarea
                    id="mapUrl"
                    value={siteInfo.mapUrl}
                    onChange={(e) => setSiteInfo({ ...siteInfo, mapUrl: e.target.value })}
                    placeholder="https://maps.google.com/maps?q=YourLocation&output=embed"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">Get this from Google Maps → Share → Embed a map</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleMapsLink">Google Maps Share Link</Label>
                  <Input
                    id="googleMapsLink"
                    value={siteInfo.googleMapsLink}
                    onChange={(e) => setSiteInfo({ ...siteInfo, googleMapsLink: e.target.value })}
                    placeholder="https://goo.gl/maps/yourlink"
                  />
                  <p className="text-xs text-gray-500">Short link for "Get Directions" button</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={siteInfo.coordinates.latitude}
                    onChange={(e) => setSiteInfo({ 
                      ...siteInfo, 
                      coordinates: { ...siteInfo.coordinates, latitude: e.target.value }
                    })}
                    placeholder="27.7172"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={siteInfo.coordinates.longitude}
                    onChange={(e) => setSiteInfo({ 
                      ...siteInfo, 
                      coordinates: { ...siteInfo.coordinates, longitude: e.target.value }
                    })}
                    placeholder="85.3240"
                  />
                </div>
              </div>

              {/* Map Preview */}
              <div className="space-y-2">
                <Label>Map Preview</Label>
                <div className="border rounded-lg overflow-hidden">
                  {siteInfo.mapUrl ? (
                    <iframe
                      src={siteInfo.mapUrl}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Company Location"
                    />
                  ) : (
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                        <p>Enter map URL to preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Map Setup Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">How to get Google Maps URLs:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Maps</a></li>
                  <li>Search for your company address</li>
                  <li>Click "Share" → "Embed a map" → Copy the iframe src URL</li>
                  <li>For the share link: Click "Share" → "Copy link"</li>
                  <li>For coordinates: Right-click on your location and copy the numbers</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Accounts</CardTitle>
              <p className="text-sm text-gray-600">Manage your social media presence</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <Label htmlFor="facebook">Facebook Page</Label>
                    <Input
                      id="facebook"
                      value={siteInfo.facebook}
                      onChange={(e) => setSiteInfo({ ...siteInfo, facebook: e.target.value })}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <div className="flex-1">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={siteInfo.instagram}
                      onChange={(e) => setSiteInfo({ ...siteInfo, instagram: e.target.value })}
                      placeholder="https://instagram.com/youraccount"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <div className="flex-1">
                    <Label htmlFor="twitter">Twitter/X</Label>
                    <Input
                      id="twitter"
                      value={siteInfo.twitter}
                      onChange={(e) => setSiteInfo({ ...siteInfo, twitter: e.target.value })}
                      placeholder="https://twitter.com/youraccount"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Linkedin className="h-5 w-5 text-blue-700" />
                  <div className="flex-1">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={siteInfo.linkedin}
                      onChange={(e) => setSiteInfo({ ...siteInfo, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Youtube className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <Label htmlFor="youtube">YouTube Channel</Label>
                    <Input
                      id="youtube"
                      value={siteInfo.youtube}
                      onChange={(e) => setSiteInfo({ ...siteInfo, youtube: e.target.value })}
                      placeholder="https://youtube.com/yourchannel"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Information */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <p className="text-sm text-gray-600">Legal and business information</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Legal Company Name</Label>
                  <Input
                    id="companyName"
                    value={siteInfo.companyName}
                    onChange={(e) => setSiteInfo({ ...siteInfo, companyName: e.target.value })}
                    placeholder="Your Legal Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    value={siteInfo.establishedYear}
                    onChange={(e) => setSiteInfo({ ...siteInfo, establishedYear: e.target.value })}
                    placeholder="2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={siteInfo.registrationNumber}
                    onChange={(e) => setSiteInfo({ ...siteInfo, registrationNumber: e.target.value })}
                    placeholder="Company registration number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={siteInfo.taxNumber}
                    onChange={(e) => setSiteInfo({ ...siteInfo, taxNumber: e.target.value })}
                    placeholder="Tax identification number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}