<FILE_REGENERATED_FROM_WORKDIR>import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { analytics } from '../lib/analytics';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from './ui/dialog';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Camera,
  Brain,
  Clock,
  Star,
  ChevronRight,
  Play,
  Eye
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  version: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  strengths: string[];
  processingTime: string;
  accuracy: number;
  popularity: number;
  sampleImages: string[];
  gradient: string;
  borderColor: string;
  specialties: string[];
  pricing: {
    credits: number;
    description: string;
  };
}

const aiModels: AIModel[] = [
  {
    id: 'flux-pro-ultra',
    name: 'Flux Pro Ultra',
    version: 'v2.1',
    icon: <Sparkles className="w-6 h-6" />,
    description: 'Our flagship model delivering ultra-realistic professional headshots with exceptional detail and lighting.',
    features: ['Ultra-high resolution', 'Advanced lighting control', 'Facial feature enhancement', 'Professional styling'],
    strengths: ['Photorealism', 'Lighting mastery', 'Detail precision', 'Professional finish'],
    processingTime: '3-5 minutes',
    accuracy: 99.2,
    popularity: 95,
    sampleImages: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face'
    ],
    gradient: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-400/40',
    specialties: ['Corporate executives', 'LinkedIn profiles', 'Business headshots'],
    pricing: {
      credits: 8,
      description: 'Premium quality for professional use'
    }
  },
  {
    id: 'imagen4',
    name: 'Imagen4',
    version: 'v4.0',
    icon: <Zap className="w-6 h-6" />,
    description: 'Lightning-fast AI model perfect for quick professional headshots with consistent quality.',
    features: ['Rapid processing', 'Consistent output', 'Natural expressions', 'Versatile styling'],
    strengths: ['Speed optimization', 'Reliability', 'Natural look', 'Batch processing'],
    processingTime: '1-3 minutes',
    accuracy: 98.8,
    popularity: 88,
    sampleImages: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face'
    ],
    gradient: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-400/40',
    specialties: ['Quick turnaround', 'Batch processing', 'Natural expressions'],
    pricing: {
      credits: 5,
      description: 'Fast and efficient processing'
    }
  },
  {
    id: 'recraft-v3',
    name: 'Recraft V3',
    version: 'v3.2',
    icon: <TrendingUp className="w-6 h-6" />,
    description: 'Creative-focused model specializing in artistic and contemporary professional headshots.',
    features: ['Artistic styling', 'Creative composition', 'Modern aesthetics', 'Style flexibility'],
    strengths: ['Creative flair', 'Modern styling', 'Artistic quality', 'Style variety'],
    processingTime: '4-6 minutes',
    accuracy: 99.1,
    popularity: 82,
    sampleImages: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b1c?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face'
    ],
    gradient: 'from-green-500 to-teal-600',
    borderColor: 'border-green-400/40',
    specialties: ['Creative professionals', 'Artistic styles', 'Modern aesthetics'],
    pricing: {
      credits: 6,
      description: 'Creative styling options'
    }
  }
];

// Build a srcSet for square images by adjusting Unsplash w/h params
const buildSrcSetSquare = (url: string, sizes: number[]) =>
  sizes
    .map((s) => `${url.replace('w=300', `w=${s}`).replace('h=300', `h=${s}`)} ${s}w`)
    .join(', ');


export function AIModelsShowcase() {
  const [selectedModel, setSelectedModel] = useState<string>(aiModels[0].id);
  const [activeComparison, setActiveComparison] = useState<boolean>(false);
  const [previewIndex, setPreviewIndex] = useState<{ [key: string]: number }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Prefetch neighbor images when dialog opens or index/model changes
  useEffect(() => {
    if (!isDialogOpen) return;
    const model = aiModels.find(m => m.id === selectedModel) || aiModels[0];
    const arr = model.sampleImages;
    if (!arr?.length) return;
    const idx = previewIndex[model.id] || 0;
    const nextIdx = (idx + 1) % arr.length;
    const prevIdx = (idx - 1 + arr.length) % arr.length;
    [arr[nextIdx], arr[prevIdx]].forEach((url) => {
      try {
        const img = new Image();
        img.decoding = 'async';
        img.loading = 'eager' as any;
        img.src = url.replace('w=300', 'w=480').replace('h=300', 'h=480');
      } catch {}
    });
  }, [isDialogOpen, selectedModel, previewIndex]);

  const currentModel = aiModels.find(model => model.id === selectedModel) || aiModels[0];

  const nextPreview = (modelId: string) => {
    const model = aiModels.find(m => m.id === modelId);
    if (!model) return;

    setPreviewIndex(prev => ({
      ...prev,
      [modelId]: ((prev[modelId] || 0) + 1) % model.sampleImages.length
    }));
  };

  const handleTryNow = () => { analytics.track('try_now_click', { modelId: currentModel.id });
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferredModel', currentModel.id);
        (window as any).appNavigate?.('upload-intro');
      }
    } catch {}
  };

  const handleTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (index + dir + aiModels.length) % aiModels.length;
    setSelectedModel(aiModels[next].id);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
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
            <span className="text-white">AI Models </span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Showcase
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our cutting-edge AI models, each specialized for different professional headshot styles and use cases
          </p>
        </motion.div>

        {/* Model Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12" role="tablist" aria-label="AI models">
          {aiModels.map((model, idx) => (
            <Button
              key={model.id}
              data-testid={`model-tab-${model.id}`}
              onClick={() => { setSelectedModel(model.id); analytics.track('model_tab_change', { modelId: model.id }); }}
              onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => handleTabKey(e, idx)}
              variant={selectedModel === model.id ? "default" : "outline"}
              role="tab"
              aria-selected={selectedModel === model.id}
              aria-controls={`panel-${model.id}`}
              id={`tab-${model.id}`}
              aria-pressed={undefined as any}
              className={`px-6 py-4 rounded-xl transition-all duration-300 ${
                selectedModel === model.id
                  ? `bg-gradient-to-r ${model.gradient} text-white shadow-lg`
                  : `${model.borderColor} text-gray-300 hover:bg-white/10 backdrop-blur-sm`
              }`}
            >
              <div className="flex items-center space-x-3">
                {model.icon}
                <div className="text-left">
                  <div className="font-semibold">{model.name}</div>
                  <div className="text-xs opacity-80">{model.version}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Main Model Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedModel}
            role="tabpanel"
            id={`panel-${currentModel.id}`}
            aria-labelledby={`tab-${currentModel.id}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          >
            {/* Model Info */}
            <div className="space-y-8">
              <Card className={`p-8 bg-white/5 backdrop-blur-md ${currentModel.borderColor} relative overflow-hidden`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${currentModel.gradient} opacity-5`} />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${currentModel.gradient} rounded-2xl flex items-center justify-center text-white`}>
                      {currentModel.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{currentModel.name}</h3>
                      <p className="text-gray-400">{currentModel.version}</p>
                    </div>
                    <Badge className={`bg-gradient-to-r ${currentModel.gradient} text-white border-0`}>
                      Popular
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {currentModel.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Accuracy</span>
                        <span className="text-white font-semibold">{currentModel.accuracy}%</span>
                      </div>
                      <Progress
                        value={currentModel.accuracy}
                        className="h-2"
                      />
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Popularity</span>
                        <span className="text-white font-semibold">{currentModel.popularity}%</span>
                      </div>
                      <Progress
                        value={currentModel.popularity}
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* Processing Time */}
                  <div className="flex items-center space-x-2 mb-6">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-300">Processing Time: </span>
                    <span className="text-white font-semibold">{currentModel.processingTime}</span>
                  </div>

                  {/* Pricing */}
                  <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-cyan-400 font-semibold">{currentModel.pricing.credits} Credits per image</div>
                        <div className="text-gray-400 text-sm">{currentModel.pricing.description}</div>
                      </div>
                      <Button
                        size="sm"
                        data-testid="try-now"
                        onClick={handleTryNow}
                        className={`bg-gradient-to-r ${currentModel.gradient} text-white border-0`}
                      >
                        Try Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Features & Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-white/5 backdrop-blur-md border-cyan-400/20">
                  <h4 className="text-cyan-400 font-semibold mb-4">Key Features</h4>
                  <ul className="space-y-2">
                    {currentModel.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-300">
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 bg-white/5 backdrop-blur-md border-cyan-400/20">
                  <h4 className="text-cyan-400 font-semibold mb-4">Strengths</h4>
                  <ul className="space-y-2">
                    {currentModel.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-300">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>

            {/* Sample Images & Preview */}
            <div className="space-y-8">
              {/* Live Preview */}
              <Card className="p-6 bg-white/5 backdrop-blur-md border-cyan-400/20">
                <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  <span>Sample Results</span>
                </h4>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {currentModel.sampleImages.map((image, index) => (
                    <motion.div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => { analytics.track('zoom_open', { modelId: currentModel.id, sampleIndex: index });
                        setPreviewIndex(prev => ({ ...prev, [currentModel.id]: index }));
                        setIsDialogOpen(true);
                      }}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${currentModel.name} sample ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={300}
                        height={300}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 300px"
                        srcSet={buildSrcSetSquare(image, [180, 240, 300])}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
              {/* Zoom Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={(open: boolean) => { if (!open) analytics.track('zoom_close', { modelId: currentModel.id, sampleIndex: (previewIndex[currentModel.id] || 0) }); setIsDialogOpen(open); }}>
                <DialogContent data-testid="sample-zoom-dialog" className="bg-slate-900 border-slate-700" onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === 'ArrowLeft') {
                    const idx = (previewIndex[currentModel.id] || 0);
                    const prevIdx = (idx - 1 + currentModel.sampleImages.length) % currentModel.sampleImages.length;
                    setPreviewIndex(p => ({ ...p, [currentModel.id]: prevIdx })); analytics.track('zoom_prev_key', { modelId: currentModel.id, sampleIndex: prevIdx });
                    e.stopPropagation();
                  } else if (e.key === 'ArrowRight') {
                    const idx = (previewIndex[currentModel.id] || 0);
                    const nextIdx = (idx + 1) % currentModel.sampleImages.length;
                    setPreviewIndex(p => ({ ...p, [currentModel.id]: nextIdx })); analytics.track('zoom_next_key', { modelId: currentModel.id, sampleIndex: nextIdx });
                    e.stopPropagation();
                  }
                }}>
                  <DialogHeader>
                    <DialogTitle>{currentModel.name} – Sample {((previewIndex[currentModel.id] || 0) + 1)}</DialogTitle>
                  </DialogHeader>
                  <div className="relative">
                    <ImageWithFallback
                      src={currentModel.sampleImages[previewIndex[currentModel.id] || 0]}
                      alt={`${currentModel.name} enlarged sample`}
                      className="w-full h-auto rounded-lg"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 960px"
                      srcSet={buildSrcSetSquare(currentModel.sampleImages[previewIndex[currentModel.id] || 0], [480, 720, 960, 1200])}
                    />
                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const idx = (previewIndex[currentModel.id] || 0);
                          const prevIdx = (idx - 1 + currentModel.sampleImages.length) % currentModel.sampleImages.length;
                          setPreviewIndex(p => ({ ...p, [currentModel.id]: prevIdx })); analytics.track('zoom_prev', { modelId: currentModel.id, sampleIndex: prevIdx });
                        }}
                      >
                        Prev
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const idx = (previewIndex[currentModel.id] || 0);
                          const nextIdx = (idx + 1) % currentModel.sampleImages.length;
                          setPreviewIndex(p => ({ ...p, [currentModel.id]: nextIdx })); analytics.track('zoom_next', { modelId: currentModel.id, sampleIndex: nextIdx });
                        }}
                      >
                        Next
                      </Button>
                    </div>
                    <DialogClose asChild>
                      <Button className="mt-4 w-full">Close</Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
                      {(previewIndex[currentModel.id] || 0) === index && (
                        <div className="absolute inset-0 ring-2 ring-cyan-400 ring-inset" />
                      )}
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => nextPreview(currentModel.id)}
                  variant="outline"
                  className="w-full border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  View Next Sample
                </Button>
              </Card>

              {/* Specialties */}
              <Card className="p-6 bg-white/5 backdrop-blur-md border-cyan-400/20">
                <h4 className="text-white font-semibold mb-4">Best For</h4>
                <div className="flex flex-wrap gap-2">
                  {currentModel.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Real-time Processing Visualization */}
              <Card className="p-6 bg-white/5 backdrop-blur-md border-cyan-400/20">
                <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <span>AI Processing Stages</span>
                </h4>

                <div className="space-y-3">
                  {[
                    { stage: "Face Detection", progress: 100, color: "bg-green-500" },
                    { stage: "Feature Analysis", progress: 100, color: "bg-blue-500" },
                    { stage: "Style Application", progress: 85, color: "bg-cyan-500" },
                    { stage: "Final Enhancement", progress: 60, color: "bg-purple-500" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.stage}</span>
                        <span className="text-white">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${item.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Comparison Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => setActiveComparison(!activeComparison)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 text-lg rounded-xl shadow-lg shadow-cyan-500/25"
          >
            <Brain className="w-5 h-5 mr-2" />
            {activeComparison ? 'Exit' : 'Compare'} All Models
          </Button>
        </motion.div>

        {/* Model Comparison Grid */}
        <AnimatePresence>
          {activeComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {aiModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className={`p-6 bg-white/5 backdrop-blur-md ${model.borderColor} hover:border-opacity-60 transition-all duration-300`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${model.gradient} rounded-lg flex items-center justify-center text-white`}>
                        {model.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{model.name}</h3>
                        <p className="text-gray-400 text-sm">{model.version}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Accuracy</span>
                        <span className="text-white">{model.accuracy}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Speed</span>
                        <span className="text-white">{model.processingTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Credits</span>
                        <span className="text-white">{model.pricing.credits}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
