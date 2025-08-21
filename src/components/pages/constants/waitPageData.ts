import { Eye, Brain, Camera, Sparkles, CheckCircle } from 'lucide-react';

export interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  duration: number; // in seconds
  completed: boolean;
}

export const processingSteps: ProcessingStep[] = [
  {
    id: 'analyzing',
    title: 'Analyzing Your Photos',
    description: 'AI is examining facial features, lighting, and composition',
    icon: Eye,
    duration: 45,
    completed: false
  },
  {
    id: 'training',
    title: 'Training AI Model',
    description: 'Creating a personalized model based on your unique features',
    icon: Brain,
    duration: 180,
    completed: false
  },
  {
    id: 'generating',
    title: 'Generating Headshots',
    description: 'Creating professional headshots in your selected style',
    icon: Camera,
    duration: 120,
    completed: false
  },
  {
    id: 'enhancing',
    title: 'Enhancing Quality',
    description: 'Applying professional retouching and optimization',
    icon: Sparkles,
    duration: 90,
    completed: false
  },
  {
    id: 'finalizing',
    title: 'Finalizing Results',
    description: 'Preparing your headshots for download',
    icon: CheckCircle,
    duration: 30,
    completed: false
  }
];

export const tips = [
  "AI headshots typically generate 20-25 unique variations",
  "Our AI considers facial geometry, lighting, and professional standards",
  "Each headshot is optimized for LinkedIn, professional websites, and business cards",
  "You'll receive both color and black & white versions",
  "All images are delivered in high-resolution format (2048x2048)"
];