// Component Template - Following Established AI Headshot Platform Patterns
// Copy this template for creating new components that match your design system

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Zap 
} from 'lucide-react';

// Import your page navigation type
import { PageType } from '../App';

// Define component props interface
interface ComponentTemplateProps {
  navigate: (page: PageType) => void;
  data?: any;
  className?: string;
}

export function ComponentTemplate({ navigate, data, className = '' }: ComponentTemplateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sample data following your patterns
  const features = [
    { 
      icon: Star, 
      title: "AI Enhanced", 
      description: "Professional quality transformation",
      color: "text-yellow-400"
    },
    { 
      icon: TrendingUp, 
      title: "Fast Processing", 
      description: "5 minute average completion",
      color: "text-cyan-400"
    },
    { 
      icon: Zap, 
      title: "Multiple Styles", 
      description: "Choose from various backgrounds",
      color: "text-blue-400"
    }
  ];

  return (
    <section className={`section-spacing relative overflow-hidden ${className}`}>
      {/* Background Pattern - Following your design */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.08)_0%,transparent_50%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 responsive-container">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <Badge 
            variant="secondary" 
            className="bg-white/10 backdrop-blur-md border-cyan-400/20 text-white mx-auto"
          >
            <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
            Professional AI Technology
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Component Template
            </span>
          </h2>
          
          <p className="subtitle-text max-w-2xl mx-auto">
            This template follows your established design patterns and professional standards
            for consistent development across your AI headshot platform.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="professional-grid max-w-4xl mx-auto mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
            >
              <Card className="professional-card-enhanced group cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="body-text text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">
              Ready to Get Started?
            </h3>
            <p className="body-text max-w-lg mx-auto">
              Begin your professional headshot transformation with our advanced AI technology.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate('upload-intro')}
              className="professional-button bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 group"
              disabled={isLoading}
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Generate Your Headshots
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('dashboard')}
              className="professional-button border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white hover:border-slate-500 backdrop-blur-sm"
            >
              View Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Example Image Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                className="relative group"
              >
                <div className="professional-image-container bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Replace with actual images using ImageWithFallback */}
                  <div className="professional-image bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-cyan-400" />
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <Badge className="bg-green-500/90 text-white border-0">
                        AI Enhanced
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Usage Examples:
// 
// 1. Import in your App.tsx:
// import { ComponentTemplate } from './components/ComponentTemplate';
//
// 2. Use in your render method:
// <ComponentTemplate navigate={navigate} />
//
// 3. Customize with props:
// <ComponentTemplate 
//   navigate={navigate} 
//   data={customData} 
//   className="custom-spacing" 
// />

/* 
DEVELOPMENT NOTES:

1. **Styling Classes Used:**
   - .section-spacing: 100-120px vertical padding
   - .responsive-container: Max-width container with responsive padding
   - .professional-grid: Responsive 1-3 column grid
   - .professional-card-enhanced: Glassmorphism card with hover effects
   - .subtitle-text: 20px secondary text
   - .body-text: 16px body text
   - .professional-button: 250px width professional button
   - .professional-image: 250x250px rounded image

2. **Animation Pattern:**
   - Initial: opacity: 0, y: 30
   - Animate: opacity: 1, y: 0
   - Staggered delays: 0.2 + index * 0.1
   - Duration: 0.6-0.8s

3. **Color Scheme:**
   - Primary: cyan-400 to blue-400 gradient
   - Background: slate-800 to blue-950 gradient
   - Glassmorphism: white/10 with backdrop-blur
   - Borders: cyan-400/20

4. **Responsive Behavior:**
   - Mobile: Single column, smaller text
   - Desktop: Multi-column, larger elements
   - Proper spacing on all devices

5. **Accessibility:**
   - Semantic HTML structure
   - ARIA labels where needed
   - Focus states on interactive elements
   - Color contrast compliance
*/