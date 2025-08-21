import { useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Users, Camera, Star, Clock, TrendingUp, Globe, Award, Zap } from 'lucide-react';
import { useRef } from 'react';

interface Statistic {
  id: number;
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
  progressColor: string;
  duration: number;
}

const statistics: Statistic[] = [
  {
    id: 1,
    icon: <Users className="w-6 h-6" />,
    value: 50000,
    suffix: "+",
    label: "Happy Customers",
    description: "Professionals trust our AI technology",
    color: "text-cyan-400",
    progressColor: "from-cyan-500 to-blue-500",
    duration: 2.5
  },
  {
    id: 2,
    icon: <Camera className="w-6 h-6" />,
    value: 250000,
    suffix: "+",
    label: "Headshots Generated",
    description: "High-quality professional photos created",
    color: "text-blue-400",
    progressColor: "from-blue-500 to-purple-500",
    duration: 3
  },
  {
    id: 3,
    icon: <Star className="w-6 h-6" />,
    value: 98.5,
    suffix: "%",
    label: "Satisfaction Rate",
    description: "Client satisfaction with our results",
    color: "text-yellow-400",
    progressColor: "from-yellow-500 to-orange-500",
    duration: 2
  },
  {
    id: 4,
    icon: <Clock className="w-6 h-6" />,
    value: 5,
    suffix: " min",
    label: "Average Processing",
    description: "Lightning-fast AI generation time",
    color: "text-green-400",
    progressColor: "from-green-500 to-teal-500",
    duration: 1.5
  },
  {
    id: 5,
    icon: <TrendingUp className="w-6 h-6" />,
    value: 300,
    suffix: "%",
    label: "Career Impact",
    description: "Average improvement in profile views",
    color: "text-purple-400",
    progressColor: "from-purple-500 to-pink-500",
    duration: 2.2
  },
  {
    id: 6,
    icon: <Globe className="w-6 h-6" />,
    value: 120,
    suffix: "+",
    label: "Countries Served",
    description: "Global reach across continents",
    color: "text-cyan-400",
    progressColor: "from-cyan-500 to-blue-500",
    duration: 2.8
  },
  {
    id: 7,
    icon: <Award className="w-6 h-6" />,
    value: 15,
    suffix: "+",
    label: "Industry Awards",
    description: "Recognition for AI innovation",
    color: "text-yellow-400",
    progressColor: "from-yellow-500 to-orange-500",
    duration: 1.8
  },
  {
    id: 8,
    icon: <Zap className="w-6 h-6" />,
    value: 99.9,
    suffix: "%",
    label: "Uptime",
    description: "Reliable service availability",
    color: "text-green-400",
    progressColor: "from-green-500 to-teal-500",
    duration: 2.3
  }
];

function AnimatedCounter({ 
  value, 
  suffix, 
  duration, 
  isInView 
}: { 
  value: number; 
  suffix: string; 
  duration: number; 
  isInView: boolean; 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(value * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, isInView]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatisticsCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322d3ee' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
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
            <span className="text-white">Platform </span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Statistics
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real numbers that showcase the impact and reliability of our AI headshot platform
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-md border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 group relative overflow-hidden">
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.progressColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`w-12 h-12 mb-4 bg-gradient-to-br ${stat.progressColor} rounded-xl flex items-center justify-center text-white relative`}>
                  {stat.icon}
                  
                  {/* Pulse Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.progressColor} rounded-xl`}
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  />
                </div>

                {/* Main Number */}
                <div className="space-y-2 mb-4">
                  <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix} 
                      duration={stat.duration}
                      isInView={isInView}
                    />
                  </div>
                  <h3 className="text-white font-semibold text-lg">{stat.label}</h3>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4">{stat.description}</p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Progress</span>
                    <span>
                      <AnimatedCounter 
                        value={Math.min(100, (stat.value / (stat.value > 100 ? 1000 : 100)) * 100)} 
                        suffix="%" 
                        duration={stat.duration}
                        isInView={isInView}
                      />
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${stat.progressColor} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, (stat.value / (stat.value > 100 ? 1000 : 100)) * 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5, duration: stat.duration }}
                    />
                  </div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 ${stat.color} rounded-full opacity-0 group-hover:opacity-100`}
                      style={{
                        top: `${20 + i * 20}%`,
                        left: `${10 + i * 30}%`,
                      }}
                      animate={{
                        y: [-5, -15, -5],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Overall Impact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-md border-cyan-400/30 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              From Fortune 500 executives to startup founders, professionals worldwide choose our AI technology for their headshot needs
            </p>
            
            {/* Company Logos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-60">
              {["TechCorp", "StartupVision", "DevSolutions", "BusinessPro"].map((company, index) => (
                <motion.div
                  key={company}
                  className="bg-white/10 rounded-lg p-4 text-white text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 0.6, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}