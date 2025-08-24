import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ArrowLeft,
  CheckCircle,
  Camera,
  User,
  Palette,
  Zap,
  Crown,
  Star,
} from 'lucide-react';
import { PageType } from '../../App';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { backgroundStyles, clothingStyles, aiModels } from './constants/summaryData';
import { OrderSummaryCard } from './components/OrderSummaryCard';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { useUsage } from '../../hooks/useUsage';

interface SummaryProps {
  navigate: (page: PageType) => void;
  uploadData: any;
  updateUploadData: (key: string, data: any) => void;
}

export function Summary({ navigate, uploadData, updateUploadData }: SummaryProps) {
  const { images = [], personalInfo = {}, styleSelection = {} } = uploadData;
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { upgradeToTier } = useSubscription();
  const { checkCanGenerate, stats, shouldUpgrade } = useUsage();

  // ✅ HÀM ĐÃ ĐƯỢC SỬA LẠI ĐỂ GỌI API
  const handleStartProcessing = async () => {
    if (!user || !images.length) {
      setError('Missing user or images');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { canGenerate, message } = await checkCanGenerate();

      if (!canGenerate) {
        setError(message);
        setIsGenerating(false);
        return;
      }

      const primaryImage = images[0];

      // ✅ GỌI API ENDPOINT, KHÔNG GỌI HÀM SERVER TRỰC TIẾP
      const response = await fetch('/api/create-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          uploadId: primaryImage.id,
          model: styleSelection.aiModel || 'sdxl',
          style: `${styleSelection.background || 'professional'}, ${styleSelection.clothing || 'business attire'}`,
          personalInfo: {
            age: personalInfo.age,
            gender: personalInfo.gender,
            ethnicity: personalInfo.ethnicity,
            hairColor: personalInfo.hairColor,
            eyeColor: personalInfo.eyeColor,
            preferences: Object.keys(personalInfo.preferences || {}).filter(
              (key) => personalInfo.preferences[key]
            ),
          },
          uploadUrl: primaryImage.url,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.generation) {
        updateUploadData('generation', result.generation);
        updateUploadData('currentStep', 4);
        navigate('wait');
      } else {
        setError(result.error || 'Failed to start AI generation');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to start generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedBackground = backgroundStyles[styleSelection.background as keyof typeof backgroundStyles];
  const selectedClothing = clothingStyles[styleSelection.clothing as keyof typeof clothingStyles];
  const selectedModel = aiModels[styleSelection.aiModel as keyof typeof aiModels];

  const calculateSubtotal = () => {
    let subtotal = selectedModel?.price || 0;
    if (selectedBackground?.premium) {
      subtotal += selectedBackground.price || 0;
    }
    if (selectedClothing?.premium) {
      subtotal += selectedClothing.price || 0;
    }
    return subtotal;
  };

  const subtotal = calculateSubtotal();
  const tax = Math.round(subtotal * 0.08); // 8% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl mb-6">
            <CheckCircle className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Review Your Order
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Please review your selections before we start generating your professional AI headshots.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Uploaded Images */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <Camera className="h-5 w-5 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Your Photos</h2>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {images.length} photos uploaded
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {images.slice(0, 12).map((image: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="aspect-square rounded-lg overflow-hidden"
                      >
                        <ImageWithFallback
                          src={image.url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                    {images.length > 12 && (
                      <div className="aspect-square rounded-lg bg-slate-700/50 flex items-center justify-center">
                        <span className="text-slate-400 text-xs">+{images.length - 12}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Personal Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Name</p>
                        <p className="text-white font-medium">{personalInfo.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Age</p>
                        <p className="text-white font-medium">{personalInfo.age || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Gender</p>
                        <p className="text-white font-medium capitalize">{personalInfo.gender || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Ethnicity</p>
                        <p className="text-white font-medium capitalize">{personalInfo.ethnicity?.replace('-', ' ') || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Eye Color</p>
                        <p className="text-white font-medium capitalize">{personalInfo.eyeColor || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Hair Color</p>
                        <p className="text-white font-medium capitalize">{personalInfo.hairColor || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Style Selections */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Palette className="h-5 w-5 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Style Selections</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Background Style</p>
                        <p className="text-slate-400 text-sm">{selectedBackground?.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedBackground?.premium && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {selectedBackground?.premium && <span className="text-yellow-400">+${selectedBackground.price}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Clothing Style</p>
                        <p className="text-slate-400 text-sm">{selectedClothing?.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedClothing?.premium && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {selectedClothing?.premium && <span className="text-yellow-400">+${selectedClothing.price}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">AI Model</p>
                        <p className="text-slate-400 text-sm">{selectedModel?.name}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs text-slate-400">Quality: {selectedModel?.quality}/5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-green-400" />
                            <span className="text-xs text-slate-400">Speed: {selectedModel?.speed}/5</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-cyan-400 font-semibold">${selectedModel?.price}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary & Payment */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <OrderSummaryCard
              selectedModel={selectedModel}
              selectedBackground={selectedBackground}
              selectedClothing={selectedClothing}
              subtotal={subtotal}
              tax={tax}
              total={total}
              onStartProcessing={handleStartProcessing}
              isLoading={isGenerating}
              error={error}
              showUpgradePrompt={shouldUpgrade || (error?.includes('limit') ?? false)}
              onUpgrade={() =>
                upgradeToTier(stats.recommendedTier === 'enterprise' ? 'enterprise' : 'pro')
              }
            />
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
        >
          <Button
            onClick={() => navigate('style-selection')}
            variant="outline"
            className="border-slate-600 hover:bg-slate-700/50 px-6 py-3"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Style Selection
          </Button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === 4
                        ? 'bg-cyan-500 text-white'
                        : index < 4
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {index < 4 ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {index < 4 && (
                    <div
                      className={`w-8 h-px mx-2 ${
                        index < 4 ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-400">Step 5 of 5: Order Review</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
