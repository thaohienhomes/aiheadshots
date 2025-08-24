import image_3c24e0a4b4a8cd1736f7bc8bf029ed943f4f83d6 from 'figma:asset/3c24e0a4b4a8cd1736f7bc8bf029ed943f4f83d6.png';
import image_825c4a2fd790ef92a0a68c3e85d0fdf54124dd01 from 'figma:asset/825c4a2fd790ef92a0a68c3e85d0fdf54124dd01.png';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, Pause, Volume2, VolumeX, Sparkles, Zap, TrendingUp, Star, ArrowRight, RotateCcw } from 'lucide-react';

import { PageType } from '../App';

interface HeroSectionProps {
  navigate: (page: PageType) => void;
  openLoginModal?: () => void;
}

export function HeroSection({ navigate, openLoginModal }: HeroSectionProps) {
  const [sliderPosition, setSliderPosition] = useState(5);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideoDemo, setShowVideoDemo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-slide effect for demo
  useEffect(() => {
    if (!isAutoSliding || isPaused) return;
    
    const interval = setInterval(() => {
      setSliderPosition(prev => {
        // Pause at the boundaries
        if (prev >= 95) {
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 800); // 0.8 second pause
          return 5;
        }
        if (prev <= 5) {
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 800); // 0.8 second pause
        }
        return prev + 0.5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isAutoSliding, isPaused]);

  const handleSliderInteraction = (e: React.MouseEvent) => {
    setIsAutoSliding(false);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        // Attempt to play video and handle promise
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Video play was prevented:", error);
          });
        }
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Video play was prevented:", error);
        });
      }
    }
  };

  const switchToVideoDemo = () => {
    setShowVideoDemo(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }, 500);
  };

  const switchToSlider = () => {
    setShowVideoDemo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/10 to-slate-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.08)_0%,transparent_50%)]" />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
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
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-left"
          >
            {/* AI Models Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-wrap gap-3 mb-6"
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
                    className="bg-white/10 backdrop-blur-md border-cyan-400/20 text-white hover:bg-white/20 transition-all px-3 py-1.5"
                  >
                    <model.icon className={`w-3 h-3 mr-1.5 ${model.color}`} />
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
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
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
              className="text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-xl"
            >
              Transform your photos into stunning professional headshots using cutting-edge AI technology. 
              Perfect for LinkedIn, resumes, and business profiles.
            </motion.p>

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
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Generate Your Headshots
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                onClick={switchToVideoDemo}
                variant="outline" 
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white hover:border-slate-500 backdrop-blur-sm px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                  className="text-center lg:text-left"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-slate-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Video Showcase / Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-lg">
              
              {/* Demo Toggle */}
              <div className="flex justify-center mb-6 space-x-2">
                <Button
                  onClick={switchToSlider}
                  variant={!showVideoDemo ? "default" : "outline"}
                  size="sm"
                  className={`px-4 py-2 rounded-lg transition-all ${
                    !showVideoDemo 
                      ? 'bg-cyan-500 text-white' 
                      : 'border-slate-600 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Compare
                </Button>
                <Button
                  onClick={switchToVideoDemo}
                  variant={showVideoDemo ? "default" : "outline"}
                  size="sm"
                  className={`px-4 py-2 rounded-lg transition-all ${
                    showVideoDemo 
                      ? 'bg-cyan-500 text-white' 
                      : 'border-slate-600 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Video Demo
                </Button>
              </div>

              {/* Video Showcase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: showVideoDemo ? 1 : 0,
                  scale: showVideoDemo ? 1 : 0.9,
                  display: showVideoDemo ? 'block' : 'none'
                }}
                transition={{ duration: 0.5 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/50 bg-gradient-to-br from-slate-800 to-slate-900"
              >
                {/* Video Player */}
                <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden">
                  {/* Actual Video Element */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted={isMuted}
                    loop
                    playsInline
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={() => setIsVideoPlaying(false)}
                    poster="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face"
                  >
                    {/* Add your video sources here */}
                    <source src="/videos/headshot-demo.mp4" type="video/mp4" />
                    <source src="/videos/headshot-demo.webm" type="video/webm" />
                    
                    {/* Fallback content for browsers that don't support video */}
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex flex-col items-center justify-center">
                      <div className="space-y-6 text-center px-8">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">AI Processing Demo</h3>
                          <p className="text-slate-300">
                            Your browser doesn't support video playback
                          </p>
                        </div>
                      </div>
                    </div>
                  </video>

                  {/* Video Overlay - shown when video is loading or paused */}
                  {!isVideoPlaying && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">AI Headshot Demo</h3>
                        <p className="text-slate-300 text-sm">
                          See how our AI transforms photos into professional headshots
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {isVideoPlaying && videoRef.current && (
                    <div className="absolute bottom-20 left-4 right-4">
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          initial={{ width: '0%' }}
                          animate={{ 
                            width: videoRef.current.duration 
                              ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` 
                              : '0%' 
                          }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={toggleVideo}
                        size="sm"
                        className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0 w-10 h-10 rounded-full p-0"
                      >
                        {isVideoPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </Button>
                      
                      <Button
                        onClick={restartVideo}
                        size="sm"
                        className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0 w-10 h-10 rounded-full p-0"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      onClick={toggleMute}
                      size="sm"
                      className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0 w-10 h-10 rounded-full p-0"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Video Labels */}
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-purple-500/90 text-white border-0 shadow-lg backdrop-blur-sm">
                      AI Demo
                    </Badge>
                  </div>
                  
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-blue-500/90 text-white border-0 shadow-lg backdrop-blur-sm">
                      Live Preview
                    </Badge>
                  </div>
                </div>
              </motion.div>

              {/* Before/After Image Slider */}
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ 
                  opacity: !showVideoDemo ? 1 : 0,
                  scale: !showVideoDemo ? 1 : 0.9,
                  display: !showVideoDemo ? 'block' : 'none'
                }}
                transition={{ duration: 0.5 }}
              >
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
                      src={image_825c4a2fd790ef92a0a68c3e85d0fdf54124dd01}
                      alt="Professional AI-generated headshot"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay with label */}
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-green-500/90 text-white border-0 shadow-lg backdrop-blur-sm">
                        AI Enhanced
                      </Badge>
                    </div>
                  </div>

                  {/* Before Image (Original Photo) - Using uploaded image */}
                  <div
                    className="absolute inset-0 overflow-hidden transition-all duration-100 ease-out"
                    style={{
                      clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                    }}
                  >
                    <ImageWithFallback
                      src={image_3c24e0a4b4a8cd1736f7bc8bf029ed943f4f83d6}
                      alt="Original photo before AI enhancement"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay with label */}
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-slate-700/90 text-white border-0 shadow-lg backdrop-blur-sm">
                        Original
                      </Badge>
                    </div>
                  </div>

                  {/* Slider Line */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl z-30 transition-all duration-100 ease-out"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  />

                  {/* Slider Handle */}
                  <div 
                    className="absolute top-1/2 w-8 h-8 bg-white rounded-full shadow-xl border-4 border-white z-40 transition-all duration-100 ease-out cursor-col-resize group-hover:scale-110 group-hover:shadow-2xl"
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
              </motion.div>

              {/* Floating enhancement indicators */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute -top-6 -right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                ✨ AI Enhanced
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                🎯 Professional
              </motion.div>
            </div>
          </motion.div>
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