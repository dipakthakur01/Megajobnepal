import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  opacity: number;
  isActive: boolean;
  order: number;
  created_at: Date;
}

interface HeroSettings {
  autoSlide: boolean;
  slideInterval: number;
  showNavigation: boolean;
  overlayOpacity: number;
  enableGradient: boolean;
  gradientDirection: string;
}

interface HeroCarouselProps {
  children: React.ReactNode;
}

export const HeroCarousel = React.memo(function HeroCarousel({ children }: HeroCarouselProps) {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [settings, setSettings] = useState<HeroSettings>({
    autoSlide: true,
    slideInterval: 5,
    showNavigation: true,
    overlayOpacity: 20,
    enableGradient: true,
    gradientDirection: 'from-blue-50 via-white to-blue-50'
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load settings and images from localStorage
  useEffect(() => {
    try {
      const savedImages = localStorage.getItem('megajob_hero_images');
      const savedSettings = localStorage.getItem('megajob_hero_settings');
      
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        const activeImages = parsedImages.filter((img: HeroImage) => img.isActive);
        setImages(activeImages.sort((a: HeroImage, b: HeroImage) => a.order - b.order));
      } else {
        // Default fallback images for auto-carousel
        setImages([
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1630283017802-785b7aff9aac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU5MDEzOTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            title: 'Modern Office Workspace',
            description: 'Contemporary office environment with natural lighting',
            opacity: 25,
            isActive: true,
            order: 1,
            created_at: new Date()
          },
          {
            id: '2',
            url: 'https://images.unsplash.com/photo-1557804500-7a58fbcd4d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBjb25mZXJlbmNlfGVufDF8fHx8MTc1OTAzOTEwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            title: 'Business Conference',
            description: 'Professional meeting and collaboration space',
            opacity: 30,
            isActive: true,
            order: 2,
            created_at: new Date()
          },
          {
            id: '3',
            url: 'https://images.unsplash.com/photo-1758518731457-5ef826b75b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NTg5OTEwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            title: 'Team Collaboration',
            description: 'Dynamic team working together on projects',
            opacity: 28,
            isActive: true,
            order: 3,
            created_at: new Date()
          },
          {
            id: '4',
            url: 'https://images.unsplash.com/photo-1611736362199-2f7e76ebeca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NTg5NjgyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            title: 'Corporate Architecture',
            description: 'Modern corporate building and business environment',
            opacity: 27,
            isActive: true,
            order: 4,
            created_at: new Date()
          }
        ]);
      }
      
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading hero carousel data:', error);
      // Fallback to default images with better visibility
      setImages([
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1630283017802-785b7aff9aac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU5MDEzOTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          title: 'Modern Office Workspace',
          description: 'Contemporary office environment with natural lighting',
          opacity: 25,
          isActive: true,
          order: 1,
          created_at: new Date()
        },
        {
          id: '2',
          url: 'https://images.unsplash.com/photo-1557804500-7a58fbcd4d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBjb25mZXJlbmNlfGVufDF8fHx8MTc1OTAzOTEwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          title: 'Business Conference',
          description: 'Professional meeting and collaboration space',
          opacity: 30,
          isActive: true,
          order: 2,
          created_at: new Date()
        },
        {
          id: '3',
          url: 'https://images.unsplash.com/photo-1758518731457-5ef826b75b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NTg5OTEwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          title: 'Team Collaboration',
          description: 'Dynamic team working together on projects',
          opacity: 28,
          isActive: true,
          order: 3,
          created_at: new Date()
        },
        {
          id: '4',
          url: 'https://images.unsplash.com/photo-1611736362199-2f7e76ebeca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NTg5NjgyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          title: 'Corporate Architecture',
          description: 'Modern corporate building and business environment',
          opacity: 27,
          isActive: true,
          order: 4,
          created_at: new Date()
        }
      ]);
    }
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (settings.autoSlide && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, settings.slideInterval * 1000);
      
      return () => clearInterval(interval);
    }
  }, [settings.autoSlide, settings.slideInterval, images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const currentImage = images[currentImageIndex] || images[0];

  return (
    <section className={`relative bg-gradient-to-br ${settings.gradientDirection} py-20 px-4 overflow-hidden`}>
      {/* Background Image Carousel */}
      {currentImage && (
        <div className="absolute inset-0">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url('${image.url}')`,
                opacity: index === currentImageIndex ? (image.opacity / 100) : 0
              }}
            />
          ))}
          
          {/* Overlay for better text readability */}
          <div 
            className="absolute inset-0 bg-white"
            style={{ opacity: settings.overlayOpacity / 100 }}
          />
        </div>
      )}

      {/* Enhanced Navigation Controls */}
      {settings.showNavigation && images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </>
      )}

      {/* Enhanced Image Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 transform ${
                index === currentImageIndex 
                  ? 'bg-blue-600 scale-125 shadow-lg' 
                  : 'bg-white/70 hover:bg-white/90 hover:scale-110'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>


    </section>
  );
});