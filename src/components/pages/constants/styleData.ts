import { Crown, Sparkles, Zap } from 'lucide-react';

export interface StyleOption {
  id: string;
  name: string;
  category: 'background' | 'clothing';
  description: string;
  preview: string;
  premium: boolean;
  price?: number;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  speed: number;
  quality: number;
  price: number;
  popular: boolean;
  icon: React.ElementType;
}

export const backgroundStyles: StyleOption[] = [
  {
    id: 'corporate-office',
    name: 'Corporate Office',
    category: 'background',
    description: 'Professional office setting with modern design',
    preview: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    premium: false
  },
  {
    id: 'executive-boardroom',
    name: 'Executive Boardroom',
    category: 'background',
    description: 'High-end boardroom with city views',
    preview: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop',
    premium: true,
    price: 5
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    category: 'background',
    description: 'Artistic workspace with natural lighting',
    preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    premium: false
  },
  {
    id: 'outdoor-urban',
    name: 'Urban Professional',
    category: 'background',
    description: 'Modern cityscape background',
    preview: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    premium: true,
    price: 5
  },
  {
    id: 'neutral-gradient',
    name: 'Neutral Gradient',
    category: 'background',
    description: 'Clean gradient background',
    preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    premium: false
  },
  {
    id: 'luxury-interior',
    name: 'Luxury Interior',
    category: 'background',
    description: 'Premium interior setting',
    preview: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&h=300&fit=crop',
    premium: true,
    price: 8
  }
];

export const clothingStyles: StyleOption[] = [
  {
    id: 'business-suit',
    name: 'Business Suit',
    category: 'clothing',
    description: 'Classic professional suit',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face',
    premium: false
  },
  {
    id: 'smart-casual',
    name: 'Smart Casual',
    category: 'clothing',
    description: 'Professional yet relaxed attire',
    preview: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face',
    premium: false
  },
  {
    id: 'creative-casual',
    name: 'Creative Casual',
    category: 'clothing',
    description: 'Stylish and contemporary look',
    preview: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop&crop=face',
    premium: true,
    price: 3
  },
  {
    id: 'executive-formal',
    name: 'Executive Formal',
    category: 'clothing',
    description: 'High-end formal wear',
    preview: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=400&fit=crop&crop=face',
    premium: true,
    price: 5
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    category: 'clothing',
    description: 'Contemporary tech professional',
    preview: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&crop=face',
    premium: false
  },
  {
    id: 'luxury-formal',
    name: 'Luxury Formal',
    category: 'clothing',
    description: 'Premium formal attire',
    preview: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&h=400&fit=crop&crop=face',
    premium: true,
    price: 8
  }
];

export const aiModels: AIModel[] = [
  {
    id: 'flux-pro',
    name: 'Flux Pro Ultra',
    description: 'Highest quality with exceptional detail and realism',
    speed: 3,
    quality: 5,
    price: 49,
    popular: true,
    icon: Crown
  },
  {
    id: 'imagen4',
    name: 'Imagen4',
    description: 'Fast processing with excellent quality balance',
    speed: 5,
    quality: 4,
    price: 39,
    popular: false,
    icon: Zap
  },
  {
    id: 'recraft-v3',
    name: 'Recraft V3',
    description: 'Great value with solid professional results',
    speed: 4,
    quality: 4,
    price: 29,
    popular: false,
    icon: Sparkles
  }
];