import { env } from './env';

export interface UploadResult {
  url: string;
  publicId?: string;
  error?: string;
}

export class FileUploadService {
  private cloudinaryConfig: any = null;

  constructor() {
    if (env.UPLOAD_SERVICE === 'cloudinary' && env.CLOUDINARY_CLOUD_NAME) {
      // Initialize Cloudinary config if available
      this.cloudinaryConfig = {
        cloudName: env.CLOUDINARY_CLOUD_NAME,
        apiKey: env.CLOUDINARY_API_KEY,
        apiSecret: env.CLOUDINARY_API_SECRET,
      };
    }
  }

  async uploadFile(file: File, folder?: string): Promise<UploadResult> {
    try {
      if (env.UPLOAD_SERVICE === 'cloudinary' && this.cloudinaryConfig) {
        return await this.uploadToCloudinary(file, folder);
      } else {
        // Fallback to local upload simulation
        return await this.uploadLocally(file, folder);
      }
    } catch (error) {
      console.error('File upload error:', error);
      return { url: '', error: 'Failed to upload file' };
    }
  }

  private async uploadToCloudinary(file: File, folder?: string): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'unsigned_upload'); // You'll need to create this in Cloudinary
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const result = await response.json();
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return { url: '', error: 'Failed to upload to Cloudinary' };
    }
  }

  private async uploadLocally(file: File, folder?: string): Promise<UploadResult> {
    // For development/local environment, we'll create a blob URL
    // In production, you should implement proper file storage
    try {
      const url = URL.createObjectURL(file);
      
      // Store file info in localStorage for development
      const fileKey = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fileInfo = {
        url,
        name: file.name,
        size: file.size,
        type: file.type,
        folder: folder || 'uploads',
        uploadedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(`file_${fileKey}`, JSON.stringify(fileInfo));
      
      // Return a simulated permanent URL for development
      const permanentUrl = `/uploads/${folder || 'files'}/${fileKey}_${file.name}`;
      
      return {
        url: permanentUrl,
        publicId: fileKey,
      };
    } catch (error) {
      console.error('Local upload error:', error);
      return { url: '', error: 'Failed to upload file locally' };
    }
  }

  async deleteFile(publicId: string): Promise<boolean> {
    try {
      if (env.UPLOAD_SERVICE === 'cloudinary' && this.cloudinaryConfig) {
        return await this.deleteFromCloudinary(publicId);
      } else {
        return await this.deleteLocally(publicId);
      }
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  private async deleteFromCloudinary(publicId: string): Promise<boolean> {
    try {
      // Note: Deleting from Cloudinary requires server-side implementation
      // due to API secret requirements. This is a placeholder.
      console.log('Cloudinary deletion requires server-side implementation');
      return true;
    } catch (error) {
      console.error('Cloudinary deletion error:', error);
      return false;
    }
  }

  private async deleteLocally(publicId: string): Promise<boolean> {
    try {
      localStorage.removeItem(`file_${publicId}`);
      return true;
    } catch (error) {
      console.error('Local deletion error:', error);
      return false;
    }
  }

  // Utility methods
  validateFile(file: File, options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}): { valid: boolean; error?: string } {
    const { maxSizeMB = 10, allowedTypes = [] } = options;

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return { valid: false, error: `File type ${file.type} is not allowed` };
    }

    return { valid: true };
  }

  getImageValidationOptions() {
    return {
      maxSizeMB: 5,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    };
  }

  getDocumentValidationOptions() {
    return {
      maxSizeMB: 10,
      allowedTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    };
  }
}

// Global file upload service instance
export const fileUploadService = new FileUploadService();