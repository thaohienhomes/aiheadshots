import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import {
  Sparkles,
  CheckCircle,
  Clock,
  Zap,
  Camera,
  Brain,
  Palette,
  Download,
  Star,
  Eye,
  Cpu,
  AlertCircle
} from 'lucide-react';
import { PageType } from '../../App';
import { processingSteps, tips } from './constants/waitPageData';
import { useGenerations } from '../../hooks/useGenerations';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface WaitPageProps {
  navigate: (page: PageType) => void;
  uploadData?: any;
}

export function WaitPage({ navigate, uploadData }: WaitPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { getGenerationById } = useGenerations();
  const generation = uploadData?.generation;

  const totalDuration = processingSteps.reduce((sum, step) => sum + step.duration, 0);
  const estimatedTime = Math.ceil(totalDuration / 60); // in minutes

  // Real-time polling for generation status
  useEffect(() => {
    if (!generation?.id) {
      setError('No generation found');
      return;
    }

    const pollGeneration = async () => {
      try {
        const result = await getGenerationById(generation.id);
        if (result.success && result.generation) {
          const gen = result.generation;

          switch (gen.status) {
            case 'queued':
              setCurrentStep(0);
              setProgress(10);
              break;
            case 'processing':
              setCurrentStep(1);
              setProgress(50);
              break;
            case 'completed':
              setCurrentStep(processingSteps.length);
              setProgress(100);
              setIsComplete(true);
              setResultUrl(gen.result_url || null);
              return; // Stop polling
            case 'failed':
              setError('Generation failed. Please try again.');
              return; // Stop polling
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        setError('Failed to check generation status');
      }
    };

    // Initial poll
    pollGeneration();

    // Poll every 3 seconds
    const interval = setInterval(pollGeneration, 3000);

    return () => clearInterval(interval);
  }, [generation?.id, getGenerationById]);

  // Timer for elapsed time display
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const overallProgress = (timeElapsed / totalDuration) * 100;



  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl mb-6 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-2 border-cyan-400 border-t-transparent rounded-2xl"
            />
            <Cpu className="h-10 w-10 text-cyan-400" />
          </div>
          
          {isComplete ? (
            <>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Your Headshots Are Ready!
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                We've successfully generated your professional AI headshots. They're ready for download and use.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Creating Your Headshots
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Our AI is working hard to create professional headshots just for you. This process typically takes {estimatedTime} minutes.
              </p>
            </>
          )}
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Zap className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Processing Progress</h2>
                    <p className="text-slate-400 text-sm">
                      {isComplete ? 'Complete!' : `${Math.round(overallProgress)}% complete`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">
                    {formatTime(timeElapsed)}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {isComplete ? 'Finished' : `Est. ${formatTime(totalDuration - timeElapsed)} remaining`}
                  </div>
                </div>
              </div>
              <Progress 
                value={Math.min(overallProgress, 100)} 
                className="h-3"
              />
            </div>
          </Card>
        </motion.div>

        {/* Processing Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Processing Steps</h2>
              <div className="space-y-4">
                {processingSteps.map((step, index) => {
                  const isActive = index === currentStep && !isComplete;
                  const isCompleted = index < currentStep || isComplete;
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                        isActive 
                          ? 'border-cyan-400 bg-cyan-400/5' 
                          : isCompleted
                          ? 'border-green-400 bg-green-400/5'
                          : 'border-slate-600 bg-slate-700/30'
                      }`}
                    >
                      <div className={`p-3 rounded-xl flex-shrink-0 ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : isCompleted
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-600/50 text-slate-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <step.icon className="h-6 w-6" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${
                            isActive || isCompleted ? 'text-white' : 'text-slate-400'
                          }`}>
                            {step.title}
                          </h3>
                          {isActive && (
                            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 animate-pulse">
                              Active
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                              Complete
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${
                          isActive || isCompleted ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {step.description}
                        </p>
                        
                        {isActive && (
                          <div className="mt-2">
                            <Progress value={progress} className="h-1" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tips and Information */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-600">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Star className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">While You Wait</h2>
                </div>
                
                <div className="space-y-3">
                  {tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-red-800/50 to-orange-800/50 backdrop-blur-sm border-red-500/30">
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-red-500/20 rounded-2xl">
                    <AlertCircle className="h-12 w-12 text-red-400" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Generation Failed
                </h2>
                <p className="text-slate-300 mb-8 max-w-md mx-auto">
                  {error}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('summary')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-3 text-lg font-semibold"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => navigate('dashboard')}
                    variant="outline"
                    className="border-slate-600 hover:bg-slate-700/50 px-8 py-3 text-lg"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Completion Actions */}
        {isComplete && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-6"
          >
            {/* Result Display */}
            {resultUrl && (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Your AI Generated Headshot</h3>
                  <div className="max-w-md mx-auto">
                    <ImageWithFallback
                      src={resultUrl}
                      alt="Generated AI Headshot"
                      className="w-full h-auto rounded-lg shadow-xl"
                    />
                  </div>
                </div>
              </Card>
            )}

            <Card className="bg-gradient-to-r from-green-800/50 to-cyan-800/50 backdrop-blur-sm border-green-500/30">
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-green-500/20 rounded-2xl">
                    <CheckCircle className="h-12 w-12 text-green-400" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  🎉 Generation Complete!
                </h2>
                <p className="text-slate-300 mb-8 max-w-md mx-auto">
                  Your professional AI headshots have been successfully generated and are ready to download.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {resultUrl && (
                    <Button
                      onClick={() => window.open(resultUrl, '_blank')}
                      className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 px-8 py-3 text-lg font-semibold"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Result
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate('dashboard')}
                    variant="outline"
                    className="border-slate-600 hover:bg-slate-700/50 px-8 py-3 text-lg"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Processing Animation */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="fixed bottom-8 right-8"
          >
            <div className="p-4 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-xl">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full"
                />
                <span className="text-slate-300 text-sm">AI Processing...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}