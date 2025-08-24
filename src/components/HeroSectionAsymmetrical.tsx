import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, Sparkles, Zap, TrendingUp, Star, ArrowRight, Camera, Users, Clock } from 'lucide-react';

import { PageType } from '../App';

interface HeroSectionAsymmetricalProps {
  navigate: (page: PageType) => void;
}

export function HeroSectionAsymmetrical({ navigate }: HeroSectionAsymmetricalProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  // Auto-slide effect for demo
  useEffect(() => {
    if (!isAutoSliding) return;
    
    const interval = setInterval(() => {
      setSliderPosition(prev => {
        const newPos = prev >= 85 ? 15 : prev + 0.8;
        return newPos;
      });
    }, 40);

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
    { number: "50K+", label: "Headshots Generated", icon: Camera },
    { number: "98%", label: "Satisfaction Rate", icon: Star },
    { number: "5 Min", label: "Average Processing", icon: Clock }
  ];

  const aiModels = [
    { name: "Flux Ultra", icon: Star, color: "text-yellow-400" },
    { name: "Recraft V3", icon: TrendingUp, color: "text-cyan-400" },
    { name: "Image4", icon: Zap, color: "text-blue-400" }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Complex gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-blue-900/20 to-slate-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(34,211,238,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1)_0%,transparent_60%)]" />
        
        {/* Animated mesh pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(-45deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:128px_128px]" />
        </div>

        {/* Dynamic floating elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${i % 3 === 0 ? 'w-2 h-2 bg-cyan-400/40' : i % 3 === 1 ? 'w-1 h-1 bg-blue-400/50' : 'w-1.5 h-1.5 bg-slate-400/30'}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.7, 0],
                scale: [0, 1, 1.2, 0],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: 12 + Math.random() * 8,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          
          {/* Asymmetrical Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full py-20">
            
            {/* Left Column - Text Content (Spans 7 columns) */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:col-span-7 space-y-8"
            >
              {/* AI Models Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex flex-wrap gap-3 mb-6"
              >
                <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border-cyan-400/30 text-cyan-300 px-3 py-1.5">
                  🚀 Powered by Advanced AI
                </Badge>
                <div className="flex gap-2">
                  {aiModels.map((model, index) => (
                    <motion.div
                      key={model.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="bg-white/10 backdrop-blur-sm border-slate-600/50 text-slate-300 hover:bg-white/20 transition-all px-2 py-1"
                      >
                        <model.icon className={`w-3 h-3 mr-1 ${model.color}`} />
                        {model.name}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Main Headline - Larger and more impactful */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.9 }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight">
                  <span className="block text-white mb-2">
                    Professional
                  </span>
                  <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    AI Headshots
                  </span>
                  <span className="block text-slate-300 text-2xl sm:text-3xl lg:text-4xl font-normal mt-4">
                    in minutes, not hours
                  </span>
                </h1>
              </motion.div>

              {/* Enhanced Subheadline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="space-y-4"
              >
                <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl">
                  Transform your photos into stunning professional headshots using cutting-edge AI technology. 
                  Perfect for LinkedIn, resumes, and business profiles.
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>No photographer needed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Multiple styles included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Ready in 5 minutes</span>
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button 
                  onClick={() => navigate('upload-intro')}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 group hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Generate Your Headshots
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white hover:border-slate-400 backdrop-blur-sm px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Compact Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="grid grid-cols-3 gap-4 pt-8 max-w-lg"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-1">
                      <stat.icon className="w-4 h-4 text-cyan-400 mr-1" />
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Integrated Image Slider (Spans 5 columns) */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              {/* Main Slider Container with enhanced design */}
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute -inset-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
                <div className="absolute -inset-4 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border border-white/10"></div>
                
                {/* Slider */}
                <div 
                  className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/60 cursor-col-resize group"
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
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=face"
                      alt="Professional AI-generated headshot"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 right-6 z-20">
                      <Badge className="bg-green-500/95 text-white border-0 shadow-xl backdrop-blur-sm px-3 py-1.5 font-medium">
                        ✨ AI Enhanced
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
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=750&fit=crop&crop=face"
                      alt="Original photo before AI enhancement"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 left-6 z-20">
                      <Badge className="bg-slate-800/95 text-white border-0 shadow-xl backdrop-blur-sm px-3 py-1.5 font-medium">
                        📷 Original
                      </Badge>
                    </div>
                  </div>

                  {/* Enhanced Slider Line */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-white via-cyan-400 to-white shadow-2xl z-30 transition-all duration-75 ease-out"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  />

                  {/* Enhanced Slider Handle */}
                  <div 
                    className="absolute top-1/2 w-12 h-12 bg-white rounded-full shadow-2xl border-4 border-white z-40 transition-all duration-75 ease-out cursor-col-resize group-hover:scale-110 group-hover:shadow-cyan-500/50"
                    style={{ 
                      left: `${sliderPosition}%`, 
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Enhanced interaction hint */}
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isAutoSliding ? [1, 0.7, 1] : 0 }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
                  >
                    <Badge className="bg-black/70 backdrop-blur-md text-white border-white/20 px-4 py-2">
                      👆 Drag to compare
                    </Badge>
                  </motion.div>
                </div>

                {/* Floating enhancement badges */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
                  className="absolute -top-8 -right-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-2xl text-sm font-bold shadow-xl rotate-12 hover:rotate-0 transition-transform cursor-pointer"
                >
                  🎯 Professional Quality
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: 10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 1.4, duration: 0.8, type: "spring" }}
                  className="absolute -bottom-8 -left-8 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-3 rounded-2xl text-sm font-bold shadow-xl -rotate-12 hover:rotate-0 transition-transform cursor-pointer"
                >
                  ⚡ Instant Results
                </motion.div>

                {/* Process indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  className="absolute -bottom-16 left-0 right-0 flex justify-center"
                >
                  <div className="flex items-center gap-3 bg-slate-800/90 backdrop-blur-md rounded-full px-6 py-3 border border-slate-600/50">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-300">Upload</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <span className="text-sm text-slate-300">Process</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <span className="text-sm text-slate-300">Download</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-cyan-400/40 rounded-full flex justify-center cursor-pointer hover:border-cyan-400/60 transition-colors"
          onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <motion.div
            className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}