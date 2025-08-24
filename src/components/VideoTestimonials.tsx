import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Play, Pause, Volume2, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  videoThumbnail: string;
  avatar: string;
  rating: number;
  quote: string;
  transcript: string;
  duration: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "TechCorp Inc.",
    videoThumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote: "The AI headshots transformed my LinkedIn presence completely. Professional quality that rivals studio photography.",
    transcript: "I was skeptical at first, but the results exceeded all expectations. The AI captured my professional essence perfectly.",
    duration: "2:30"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "CEO & Founder",
    company: "StartupVision",
    videoThumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote: "Saved me thousands on professional photography. The quality is incredible and the turnaround time is amazing.",
    transcript: "As a startup founder, every dollar counts. This service delivered professional headshots at a fraction of traditional costs.",
    duration: "1:45"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Software Engineer",
    company: "DevSolutions",
    videoThumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote: "Perfect for remote professionals like me. No need to find a studio - just upload and get amazing results.",
    transcript: "Working remotely made professional photography challenging. This AI solution was exactly what I needed.",
    duration: "2:15"
  }
];

export function VideoTestimonials() {
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState<{ [key: number]: boolean }>({});

  const toggleTranscript = (id: number) => {
    setShowTranscript(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">What Our </span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real professionals sharing their experience with our AI headshot generation platform
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden bg-white/5 backdrop-blur-md border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 group">
                {/* Video Player Area */}
                <div className="relative">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={testimonial.videoThumbnail}
                      alt={`${testimonial.name} testimonial`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 group-hover:opacity-80 transition-opacity">
                      <Button
                        onClick={() => setCurrentVideo(currentVideo === testimonial.id ? null : testimonial.id)}
                        className="bg-white/20 backdrop-blur-md border-white/20 hover:bg-white/30 text-white rounded-full w-16 h-16 p-0"
                      >
                        {currentVideo === testimonial.id ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6 ml-1" />
                        )}
                      </Button>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {testimonial.duration}
                    </div>

                    {/* Playing Indicator */}
                    <AnimatePresence>
                      {currentVideo === testimonial.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent"
                        >
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400">
                            <motion.div
                              className="h-full bg-white"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 30, ease: "linear" }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Volume Control */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-2">
                    <Volume2 className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="p-6">
                  {/* Profile */}
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                    </Avatar>
                    <div>
                      <h3 className="text-white font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      <p className="text-cyan-400 text-sm">{testimonial.company}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-cyan-400/30" />
                    <p className="text-gray-300 italic pl-4">"{testimonial.quote}"</p>
                  </div>

                  {/* Transcript Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTranscript(testimonial.id)}
                    className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 text-sm"
                  >
                    {showTranscript[testimonial.id] ? "Hide" : "Show"} Transcript
                  </Button>

                  {/* Transcript */}
                  <AnimatePresence>
                    {showTranscript[testimonial.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 p-4 bg-white/5 rounded-lg border border-cyan-400/20"
                      >
                        <h4 className="text-cyan-400 font-medium mb-2">Video Transcript:</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {testimonial.transcript}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to create your professional headshots?
          </h3>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 text-lg rounded-xl shadow-lg shadow-cyan-500/25">
            Start Your Transformation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}