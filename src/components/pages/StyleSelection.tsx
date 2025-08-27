import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles, 
  Building,
  Palette,
  Camera
} from 'lucide-react';
import { PageType } from '../../App';
import { backgroundStyles, clothingStyles, aiModels } from './constants/styleData';
import { AIModelCard } from './components/AIModelCard';
import { StyleOptionCard } from './components/StyleOptionCard';

interface StyleSelectionProps {
  navigate: (page: PageType) => void;
  uploadData: any;
  updateUploadData: (key: string, data: any) => void;
}

export function StyleSelection({ navigate, uploadData, updateUploadData }: StyleSelectionProps) {
  const [selectedBackground, setSelectedBackground] = useState<string>('');
  const [selectedClothing, setSelectedClothing] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('flux-pro');

  const handleStyleSelect = (styleId: string, category: 'background' | 'clothing') => {
    if (category === 'background') {
      setSelectedBackground(styleId);
    } else {
      setSelectedClothing(styleId);
    }
  };

  const calculateTotal = () => {
    let total = aiModels.find(m => m.id === selectedModel)?.price || 0;
    
    const bgStyle = backgroundStyles.find(s => s.id === selectedBackground);
    if (bgStyle?.premium) {
      total += bgStyle.price || 0;
    }
    
    const clothingStyle = clothingStyles.find(s => s.id === selectedClothing);
    if (clothingStyle?.premium) {
      total += clothingStyle.price || 0;
    }
    
    return total;
  };

  const handleContinue = () => {
    const styleSelection = {
      background: selectedBackground,
      clothing: selectedClothing,
      aiModel: selectedModel,
      totalPrice: calculateTotal()
    };
    updateUploadData('styleSelection', styleSelection);
    updateUploadData('currentStep', 3);
    navigate('summary');
  };

  const isFormValid = selectedBackground && selectedClothing && selectedModel;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl mb-6">
            <Palette className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Choose Your Style
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Select your preferred background and clothing style. Our AI will generate professional headshots based on your choices.
          </p>
        </motion.div>

        {/* AI Model Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">AI Model Selection</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiModels.map((model) => (
                  <AIModelCard
                    key={model.id}
                    model={model}
                    isSelected={selectedModel === model.id}
                    onSelect={setSelectedModel}
                  />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Background Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Building className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Background Style</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {backgroundStyles.map((style) => (
                    <StyleOptionCard
                      key={style.id}
                      style={style}
                      isSelected={selectedBackground === style.id}
                      onSelect={handleStyleSelect}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Clothing Selection */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Camera className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Clothing Style</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {clothingStyles.map((style) => (
                    <StyleOptionCard
                      key={style.id}
                      style={style}
                      isSelected={selectedClothing === style.id}
                      onSelect={handleStyleSelect}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Price Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-600">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Price</h3>
                  <p className="text-slate-400 text-sm">Includes 20-25 high-quality headshots</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-cyan-400">${calculateTotal()}</div>
                  <p className="text-slate-400 text-sm">One-time payment</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-center"
        >
          <Button
            onClick={() => navigate('personal-info')}
            variant="outline"
            className="border-slate-600 hover:bg-slate-700/50 px-6 py-3 order-2 sm:order-1"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          
          <div className="text-center order-1 sm:order-2">
            <div className="flex items-center gap-2 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === 3 
                      ? 'bg-cyan-500 text-white' 
                      : index < 3
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {index < 3 ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {index < 4 && (
                    <div className={`w-8 h-px mx-2 ${
                      index < 3 ? 'bg-green-500' : 'bg-slate-600'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-400">
              Step 4 of 5: Style Selection
            </div>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!isFormValid}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed order-3"
          >
            Review Order
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}