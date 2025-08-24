import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight,
  Upload,
  Users,
  Clock,
  Star
} from 'lucide-react';
import { PageType } from '../../App';

interface UploadIntroProps {
  navigate: (page: PageType) => void;
}

export function UploadIntro({ navigate }: UploadIntroProps) {
  const guidelines = [
    {
      icon: CheckCircle,
      title: 'High Resolution Photos',
      description: 'Upload photos that are at least 1024x1024 pixels for the best AI results',
      type: 'success'
    },
    {
      icon: CheckCircle,
      title: 'Clear Face Visibility',
      description: 'Ensure your face is clearly visible, well-lit, and takes up most of the frame',
      type: 'success'
    },
    {
      icon: CheckCircle,
      title: 'Variety of Angles',
      description: 'Include photos from different angles - front-facing, slight turns, and profile shots',
      type: 'success'
    },
    {
      icon: AlertTriangle,
      title: 'Avoid Sunglasses',
      description: 'Remove sunglasses, hats, or anything covering your face for optimal recognition',
      type: 'warning'
    },
    {
      icon: AlertTriangle,
      title: 'Single Person Only',
      description: 'Make sure you\'re the only person in the photo to avoid AI confusion',
      type: 'warning'
    },
    {
      icon: AlertTriangle,
      title: 'Good Lighting',
      description: 'Avoid harsh shadows or extremely dark/bright lighting conditions',
      type: 'warning'
    }
  ];

  const tips = [
    'Use photos taken in the last 2 years for current appearance',
    'Include both formal and casual outfit photos if possible',
    'Natural expressions work better than forced smiles',
    'Upload 10-20 photos for the best variety and quality'
  ];

  const stats = {
    avgPhotos: 15,
    avgTime: 12,
    satisfaction: 4.9
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl mb-6">
            <Camera className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Let's Create Your AI Headshots
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Follow these guidelines to get the best results from our AI models. Quality photos lead to stunning professional headshots.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-cyan-400 mr-2" />
              <span className="text-2xl font-bold text-white">{stats.avgPhotos}</span>
            </div>
            <p className="text-sm text-slate-400">Average photos uploaded</p>
          </Card>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-2xl font-bold text-white">{stats.avgTime}min</span>
            </div>
            <p className="text-sm text-slate-400">Average processing time</p>
          </Card>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-2xl font-bold text-white">{stats.satisfaction}</span>
            </div>
            <p className="text-sm text-slate-400">User satisfaction rating</p>
          </Card>
        </motion.div>

        {/* Guidelines Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {guidelines.map((guideline, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-6 h-full hover:bg-slate-800/70 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    guideline.type === 'success' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    <guideline.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {guideline.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {guideline.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-600">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Lightbulb className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Pro Tips for Better Results</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/20"
                  >
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-300 text-sm leading-relaxed">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={() => navigate('dashboard')}
            variant="outline"
            className="border-slate-600 hover:bg-slate-700/50 px-8 py-3 text-lg"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate('image-upload')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-3 text-lg font-semibold group"
          >
            <Upload className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Start Upload Process
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center mt-12"
        >
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === 0 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {step}
                </div>
                {index < 4 && (
                  <div className="w-8 h-px bg-slate-600 mx-2"></div>
                )}
              </div>
            ))}
          </div>
          <div className="ml-4 text-sm text-slate-400">
            Step 1 of 5: Upload Guidelines
          </div>
        </motion.div>
      </div>
    </div>
  );
}