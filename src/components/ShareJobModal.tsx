import React, { useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { 
  Copy, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Mail, 
  Link, 
  Share2,
  ExternalLink,
  Check
} from 'lucide-react';
import { Job } from '../lib/mockData';
import { toast } from 'sonner@2.0.3';

interface ShareJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

export const ShareJobModal = React.memo(function ShareJobModal({ isOpen, onClose, job }: ShareJobModalProps) {
  const [copied, setCopied] = useState(false);
  
  // Memoize URLs and content to prevent recalculation
  const jobUrl = useMemo(() => `${window.location.origin}/jobs/${job.id}`, [job.id]);
  
  const shareContent = useMemo(() => {
    const companyName = typeof job.company === 'string' ? job.company : job.company?.name || 'Company';
    const jobType = job.type || job.employment_type || 'Position';
    const location = typeof job.location === 'string' ? job.location : job.location?.city || 'Remote';
    const salary = job.salary || 'Competitive';
    
    return {
      title: `${job.title} at ${companyName}`,
      description: `Check out this ${jobType} position in ${location}. Salary: ${salary}`,
      text: `${job.title} at ${companyName} - Check out this ${jobType} position in ${location}. Salary: ${salary}`
    };
  }, [job]);

  const handleCopyLink = useCallback(async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(jobUrl);
      } else {
        // Fallback method for older browsers or non-HTTPS
        fallbackCopyToClipboard(jobUrl);
        return;
      }
      
      setCopied(true);
      toast.success('Job link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      // Try fallback method
      fallbackCopyToClipboard(jobUrl);
    }
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  }, [jobUrl]);

  const fallbackCopyToClipboard = useCallback((text: string) => {
    try {
      // Create a temporary textarea element for better mobile support
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = text;
      
      // Make it invisible but accessible
      tempTextArea.style.position = 'fixed';
      tempTextArea.style.left = '-999999px';
      tempTextArea.style.top = '-999999px';
      tempTextArea.style.opacity = '0';
      tempTextArea.style.pointerEvents = 'none';
      tempTextArea.setAttribute('readonly', '');
      tempTextArea.setAttribute('tabindex', '-1');
      
      document.body.appendChild(tempTextArea);
      
      // Focus and select the text
      tempTextArea.focus();
      tempTextArea.setSelectionRange(0, tempTextArea.value.length);
      tempTextArea.select();
      
      // Try to copy
      const successful = document.execCommand('copy');
      document.body.removeChild(tempTextArea);
      
      if (successful) {
        setCopied(true);
        toast.success('Job link copied to clipboard!');
      } else {
        throw new Error('Copy command failed');
      }
    } catch (error) {
      console.error('Fallback copy failed:', error);
      
      // Final fallback - select the input field text
      try {
        const inputElement = document.querySelector('input[readonly]') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
          inputElement.setSelectionRange(0, inputElement.value.length);
          inputElement.select();
          toast.info('Please use Ctrl+C (or Cmd+C) to copy the selected link');
        } else {
          // Last resort - show in alert
          const message = `Copy this job link:\n\n${text}`;
          alert(message);
        }
      } catch (finalError) {
        console.error('All copy methods failed:', finalError);
        const message = `Copy this job link:\n\n${text}`;
        alert(message);
      }
    }
  }, []);

  const handleSocialShare = useCallback((platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}&quote=${encodeURIComponent(shareContent.text)}`;
        break;
      
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(shareContent.text)}&hashtags=Jobs,Nepal,Career,MegaJobNepal`;
        break;
      
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}&title=${encodeURIComponent(shareContent.title)}&summary=${encodeURIComponent(shareContent.description)}`;
        break;
      
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareContent.text}\n\n${jobUrl}`)}`;
        break;
      
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(shareContent.title)}&body=${encodeURIComponent(`${shareContent.description}\n\nApply here: ${jobUrl}\n\nShared from MegaJobNepal`)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      toast.success(`Opening ${platform} to share...`);
    }
  }, [jobUrl, shareContent]);

  const socialPlatforms = useMemo(() => [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-600'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      textColor: 'text-sky-500'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      textColor: 'text-blue-700'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-green-600'
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      textColor: 'text-gray-600'
    }
  ], []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Share2 className="w-5 h-5 text-primary" />
            Share Job
          </DialogTitle>
          <DialogDescription>
            Share this job opportunity with others via social media or by copying the direct link.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Job Info Card - Simplified */}
          <div className="bg-gray-50 rounded-lg p-3 border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-primary/20 rounded"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">
                  {job.title}
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  {typeof job.company === 'string' ? job.company : job.company?.name || 'Company'}
                </p>
              </div>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              Copy Job Link
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={jobUrl}
                  readOnly
                  className="pl-10 pr-4 bg-gray-50 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <Button
                onClick={handleCopyLink}
                variant={copied ? "default" : "outline"}
                className={`px-4 ${copied ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Sharing - Simplified */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              Share on Social Media
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {socialPlatforms.slice(0, 4).map((platform) => {
                const PlatformIcon = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    variant="outline"
                    onClick={() => handleSocialShare(platform.id)}
                    className="flex items-center gap-2 text-sm"
                    size="sm"
                  >
                    <PlatformIcon className="w-4 h-4" />
                    {platform.name}
                  </Button>
                );
              })}
            </div>
          </div>


        </div>
      </DialogContent>
    </Dialog>
  );
});