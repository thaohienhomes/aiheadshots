import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight, Star, Award, Crown } from 'lucide-react';

interface FeaturedWork {
  id: number;
  image: string;
  title: string;
  category: string;
  client: string;
  rating: number;
  featured: boolean;
  transformation: string;
  style: string;
}

const featuredWorks: FeaturedWork[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&crop=face",
    title: "Executive Portrait",
    category: "Corporate",
    client: "Fortune 500 CEO",
    rating: 5,
    featured: true,
    transformation: "Professional corporate style with enhanced lighting",
    style: "Corporate Executive"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop&crop=face",
    title: "Creative Director",
    category: "Creative",
    client: "Tech Startup Founder",
    rating: 5,
    featured: true,
    transformation: "Modern creative style with artistic composition",
    style: "Creative Professional"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop&crop=face",
    title: "LinkedIn Optimized",
    category: "Professional",
    client: "Software Engineer",
    rating: 5,
    featured: false,
    transformation: "LinkedIn-optimized with warm professional lighting",
    style: "LinkedIn Professional"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop&crop=face",
    title: "Business Leader",
    category: "Corporate",
    client: "Investment Banking VP",
    rating: 5,
    featured: true,
    transformation: "Authoritative business style with premium finishing",
    style: "Business Elite"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop&crop=face",
    title: "Marketing Executive",
    category: "Professional",
    client: "Marketing Director",
    rating: 5,
    featured: false,
    transformation: "Approachable professional with modern styling",
    style: "Modern Professional"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face",
    title: "Tech Innovator",
    category: "Creative",
    client: "CTO & Co-founder",
    rating: 5,
    featured: true,
    transformation: "Innovative tech leader with contemporary edge",
    style: "Tech Visionary"
  }
];

export function CarouselShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotation
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredWorks.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredWorks.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredWorks.length) % featuredWorks.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Calculate visible slides for 3D effect
  const getVisibleSlides = () => {
    const slides = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + featuredWorks.length) % featuredWorks.length;
      slides.push({ ...featuredWorks[index], position: i });
    }
    return slides;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Featured </span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Masterpieces
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our most outstanding AI-generated headshots that have transformed professional careers
          </p>
        </motion.div>

        {/* 3D Carousel */}
        <div className="relative h-[600px] perspective-1000">
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {getVisibleSlides().map((work) => {
                const { position } = work;
                const isCenter = position === 0;
                const scale = isCenter ? 1 : 0.8 - Math.abs(position) * 0.1;
                const rotateY = position * 25;
                const translateX = position * 200;
                const translateZ = isCenter ? 0 : -Math.abs(position) * 100;
                const opacity = 1 - Math.abs(position) * 0.3;

                return (
                  <motion.div
                    key={`${work.id}-${position}`}
                    className="absolute cursor-pointer"
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                    initial={{ 
                      scale: 0.5, 
                      rotateY: rotateY + 90, 
                      translateX: translateX + 100,
                      translateZ,
                      opacity: 0 
                    }}
                    animate={{ 
                      scale, 
                      rotateY, 
                      translateX,
                      translateZ,
                      opacity 
                    }}
                    exit={{ 
                      scale: 0.5, 
                      rotateY: rotateY - 90, 
                      translateX: translateX - 100,
                      translateZ,
                      opacity: 0 
                    }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.25, 0.46, 0.45, 0.94] 
                    }}
                    onClick={() => !isCenter && goToSlide((currentIndex + position + featuredWorks.length) % featuredWorks.length)}
                    whileHover={!isCenter ? { scale: scale * 1.05 } : {}}
                  >
                    <Card className={`w-80 h-[500px] overflow-hidden transition-all duration-300 ${
                      isCenter 
                        ? 'bg-white/10 backdrop-blur-md border-cyan-400/40 shadow-2xl shadow-cyan-500/20' 
                        : 'bg-white/5 backdrop-blur-sm border-cyan-400/20'
                    }`}>
                      {/* Featured Badge */}
                      {work.featured && isCenter && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                            <Crown className="w-4 h-4" />
                            <span>Featured</span>
                          </div>
                        </div>
                      )}

                      {/* Image */}
                      <div className="relative h-80 overflow-hidden">
                        <ImageWithFallback
                          src={work.image}
                          alt={work.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                            {work.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Title and Rating */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-white font-bold text-xl mb-1">{work.title}</h3>
                            <p className="text-cyan-400 text-sm">{work.client}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(work.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>

                        {/* Style */}
                        <div className="bg-cyan-400/10 rounded-lg p-3">
                          <div className="text-cyan-400 text-sm font-medium mb-1">AI Style Applied</div>
                          <div className="text-white text-sm">{work.style}</div>
                        </div>

                        {/* Transformation Details */}
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {work.transformation}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button
              onClick={prevSlide}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              onClick={nextSlide}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {featuredWorks.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Auto-play Status */}
        <div className="text-center mt-6">
          <Button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            variant="outline"
            size="sm"
            className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
          >
            {isAutoPlaying ? 'Pause' : 'Play'} Auto-rotation
          </Button>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to create your masterpiece?
          </h3>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 text-lg rounded-xl shadow-lg shadow-cyan-500/25">
            <Award className="w-5 h-5 mr-2" />
            Start Your Transformation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}