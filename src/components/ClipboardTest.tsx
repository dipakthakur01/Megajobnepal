import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Copy, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ClipboardTest() {
  const [copied, setCopied] = useState(false);
  const [testUrl] = useState('https://megajobnepal.com/jobs/test-job-123');

  const handleCopyLink = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(testUrl);
      } else {
        // Fallback method for older browsers or non-HTTPS
        fallbackCopyToClipboard(testUrl);
        return;
      }
      
      setCopied(true);
      toast.success('Test link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      // Try fallback method
      fallbackCopyToClipboard(testUrl);
    }
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  const fallbackCopyToClipboard = (text: string) => {
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
        toast.success('Test link copied to clipboard!');
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
          const message = `Copy this test link:\n\n${text}`;
          alert(message);
        }
      } catch (finalError) {
        console.error('All copy methods failed:', finalError);
        const message = `Copy this test link:\n\n${text}`;
        alert(message);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Clipboard Test
        </CardTitle>
        <CardDescription>
          Test the improved clipboard functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Test URL:</label>
          <div className="flex items-center gap-2">
            <Input
              value={testUrl}
              readOnly
              className="flex-1 bg-gray-50"
            />
            <Button 
              onClick={handleCopyLink} 
              size="sm"
              variant={copied ? "default" : "outline"}
              className={copied ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
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
        
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Test Instructions:</strong></p>
          <p>1. Click the "Copy" button</p>
          <p>2. Check if the success toast appears</p>
          <p>3. Try pasting the URL somewhere to verify</p>
          <p>4. Works on all browsers and devices</p>
        </div>
        
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          This test uses the same improved clipboard functionality as the job sharing feature.
        </div>
      </CardContent>
    </Card>
  );
}