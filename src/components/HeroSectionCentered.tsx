import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, Sparkles, Zap, TrendingUp, Star, ArrowRight, ChevronDown } from 'lucide-react';

import { PageType } from '../App';

interface HeroSectionCenteredProps {
  navigate: (page: PageType) => void;
}

export function HeroSectionCentered({ navigate }: HeroSectionCenteredProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  // Auto-slide effect for demo
  useEffect(() => {
    if (!isAutoSliding) return;
    
    const interval = setInterval(() => {
      setSliderPosition(prev => {
        const newPos = prev >= 80 ? 20 : prev + 1;
        return newPos;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isAutoSliding]);

  const handleSliderInteraction = (e: React.MouseEvent) => {
    setIsAutoSliding(false);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const stats = [
    { number: "50K+", label: "Headshots Generated" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "5 Min", label: "Average Processing" }
  ];

  const aiModels = [
    { name: "Flux Ultra", icon: Star, color: "text-yellow-400" },
    { name: "Recraft V3", icon: TrendingUp, color: "text-cyan-400" },
    { name: "Image4", icon: Zap, color: "text-blue-400" }
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/10 to-slate-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.1)_0%,transparent_70%)]" />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* AI Models Badge Row */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {aiModels.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <Badge 
                variant="secondary" 
                className="bg-white/10 backdrop-blur-md border-cyan-400/20 text-white hover:bg-white/20 transition-all px-4 py-2"
              >
                <model.icon className={`w-4 h-4 mr-2 ${model.color}`} />
                {model.name}
              </Badge>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-6 mb-8"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Professional AI
            </span>
            <br />
            <span className="text-white">
              Headshots
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl sm:text-2xl lg:text-3xl text-slate-300 leading-relaxed max-w-4xl mx-auto mb-12"
        >
          Transform your photos into stunning professional headshots using cutting-edge AI technology. 
          Perfect for LinkedIn, resumes, and business profiles.
        </motion.p>

        {/* Before/After Image Slider - Centered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-12"
        >
          <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-lg">
            <div 
              className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/50 cursor-col-resize group"
              onClick={handleSliderInteraction}
              onMouseMove={(e) => {
                if (e.buttons === 1) handleSliderInteraction(e);
              }}
              onMouseEnter={() => setIsAutoSliding(false)}
              onMouseLeave={() => setIsAutoSliding(true)}
            >
              {/* After Image (Professional Headshot) */}
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face"
                  alt="Professional AI-generated headshot"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-green-500/90 text-white border-0 shadow-lg backdrop-blur-sm">
                    AI Enhanced
                  </Badge>
                </div>
              </div>

              {/* Before Image (Original Photo) */}
              <div
                className="absolute inset-0 overflow-hidden transition-all duration-75 ease-out"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&crop=face"
                  alt="Original photo before AI enhancement"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 z-20">
                  <Badge className="bg-slate-700/90 text-white border-0 shadow-lg backdrop-blur-sm">
                    Original
                  </Badge>
                </div>
              </div>

              {/* Slider Line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl z-30 transition-all duration-75 ease-out"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              />

              {/* Slider Handle */}
              <div 
                className="absolute top-1/2 w-10 h-10 bg-white rounded-full shadow-xl border-4 border-white z-40 transition-all duration-75 ease-out cursor-col-resize group-hover:scale-110"
                style={{ 
                  left: `${sliderPosition}%`, 
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="absolute inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              </div>

              {/* Interaction hint */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isAutoSliding ? [1, 0.5, 1] : 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
              >
                <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20">
                  Drag to compare
                </Badge>
              </motion.div>
            </div>

            {/* Floating enhancement indicators */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute -top-4 -right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
            >
              ✨ AI Enhanced
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute -bottom-4 -left-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
            >
              🎯 Professional
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button 
            onClick={() => navigate('upload-intro')}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-4 text-xl font-semibold rounded-xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 group"
          >
            <Sparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
            Generate Your Headshots
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white hover:border-slate-500 backdrop-blur-sm px-10 py-4 text-xl rounded-xl transition-all duration-300"
          >
            <Play className="w-6 h-6 mr-3" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
              className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-cyan-400/20"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-base sm:text-lg text-slate-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm text-slate-400"
        >
          Scroll to explore
        </motion.p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-12 border-2 border-cyan-400/40 rounded-full flex justify-center cursor-pointer hover:border-cyan-400/60 transition-colors"
          onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-cyan-400 mt-2" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}