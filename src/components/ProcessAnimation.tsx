import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Upload, Brain, Sparkles, Download, ArrowRight, Zap } from 'lucide-react';

interface ProcessStep {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
  color: string;
  delay: number;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    icon: <Upload className="w-8 h-8" />,
    title: "Upload Photos",
    description: "Upload 5-10 high-quality photos of yourself",
    details: "Our AI works best with varied angles, lighting, and expressions",
    color: "from-blue-500 to-cyan-500",
    delay: 0
  },
  {
    id: 2,
    icon: <Brain className="w-8 h-8" />,
    title: "AI Analysis",
    description: "Advanced neural networks analyze your features",
    details: "Multiple AI models process facial structure, lighting, and composition",
    color: "from-cyan-500 to-teal-500",
    delay: 0.2
  },
  {
    id: 3,
    icon: <Sparkles className="w-8 h-8" />,
    title: "Style Generation",
    description: "AI generates professional variations and styles",
    details: "Choose from corporate, creative, or LinkedIn-optimized styles",
    color: "from-teal-500 to-blue-500",
    delay: 0.4
  },
  {
    id: 4,
    icon: <Download className="w-8 h-8" />,
    title: "Download Results",
    description: "Receive high-resolution professional headshots",
    details: "Multiple formats and sizes ready for any professional use",
    color: "from-blue-500 to-purple-500",
    delay: 0.6
  }
];

export function ProcessAnimation() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Neural Network Animation */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          {/* Neural Network Nodes */}
          {[...Array(20)].map((_, i) => (
            <motion.circle
              key={i}
              cx={100 + (i % 5) * 150}
              cy={100 + Math.floor(i / 5) * 100}
              r="4"
              fill="currentColor"
              className="text-cyan-400"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          
          {/* Neural Network Connections */}
          {[...Array(15)].map((_, i) => (
            <motion.line
              key={i}
              x1={100 + (i % 4) * 150}
              y1={100 + Math.floor(i / 4) * 100}
              x2={250 + (i % 4) * 150}
              y2={200 + Math.floor(i / 4) * 100}
              stroke="currentColor"
              strokeWidth="1"
              className="text-cyan-400"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </svg>
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
            <span className="text-white">How Our </span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              AI Magic
            </span>
            <span className="text-white"> Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our cutting-edge AI technology transforms your photos into professional headshots in minutes
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Progress Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 transform -translate-y-1/2 opacity-20" />
          
          <motion.div
            className="hidden lg:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 transform -translate-y-1/2"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.5 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay, duration: 0.6 }}
                className="relative"
              >
                <Card className="p-8 bg-white/5 backdrop-blur-md border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-500 group text-center relative overflow-hidden">
                  {/* Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white relative`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {step.icon}
                    
                    {/* Sparkle Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full"
                          style={{
                            top: `${20 + i * 20}%`,
                            left: `${10 + i * 30}%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{step.description}</p>
                  <p className="text-gray-400 text-sm">{step.details}</p>

                  {/* Hover Animation */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Card>

                {/* Arrow Between Steps */}
                {index < processSteps.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: step.delay + 0.3, duration: 0.4 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Processing Time Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="inline-flex items-center space-x-4 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-md border-cyan-400/30">
            <Zap className="w-6 h-6 text-cyan-400" />
            <div className="text-left">
              <div className="text-white font-semibold">Lightning Fast Processing</div>
              <div className="text-gray-300 text-sm">Average completion time: 3-5 minutes</div>
            </div>
          </Card>
        </motion.div>

        {/* Neural Network Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">Powered by Advanced Neural Networks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Flux Pro Ultra", accuracy: "99.2%", speed: "Ultra Fast" },
              { name: "Imagen4", accuracy: "98.8%", speed: "Fast" },
              { name: "Recraft V3", accuracy: "99.1%", speed: "Lightning" }
            ].map((model, index) => (
              <Card key={model.name} className="p-4 bg-white/5 backdrop-blur-md border-cyan-400/20">
                <h4 className="text-cyan-400 font-semibold mb-2">{model.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Accuracy:</span>
                    <span className="text-white">{model.accuracy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Speed:</span>
                    <span className="text-white">{model.speed}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}