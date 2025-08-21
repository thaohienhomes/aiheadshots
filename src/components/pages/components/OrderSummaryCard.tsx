import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Shield, Clock, Zap, Loader2 } from 'lucide-react';
import { includedFeatures } from '../constants/summaryData';

interface OrderSummaryCardProps {
  selectedModel: any;
  selectedBackground: any;
  selectedClothing: any;
  subtotal: number;
  tax: number;
  total: number;
  onStartProcessing: () => void;
  isLoading?: boolean;
  error?: string | null;
  showUpgradePrompt?: boolean;
  onUpgrade?: () => void;
}

export function OrderSummaryCard({
  selectedModel,
  selectedBackground,
  selectedClothing,
  subtotal,
  tax,
  total,
  onStartProcessing,
  isLoading = false,
  error,
  showUpgradePrompt = false,
  onUpgrade
}: OrderSummaryCardProps) {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 sticky top-8">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Shield className="h-5 w-5 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Order Summary</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">AI Model ({selectedModel?.name})</span>
            <span className="text-white">${selectedModel?.price}</span>
          </div>
          
          {selectedBackground?.premium && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Premium Background</span>
              <span className="text-white">${selectedBackground.price}</span>
            </div>
          )}
          
          {selectedClothing?.premium && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Premium Clothing</span>
              <span className="text-white">${selectedClothing.price}</span>
            </div>
          )}
          
          <Separator className="bg-slate-600" />
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-white">${subtotal}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Tax (8%)</span>
            <span className="text-white">${tax}</span>
          </div>
          
          <Separator className="bg-slate-600" />
          
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold text-lg">Total</span>
            <span className="text-cyan-400 font-bold text-xl">${total}</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-5 w-5 text-cyan-400" />
            <h3 className="font-semibold text-white">What's Included</h3>
          </div>
          <ul className="text-sm text-slate-300 space-y-1">
            {includedFeatures.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <Clock className="h-4 w-4 text-blue-400 flex-shrink-0" />
          <p className="text-sm text-blue-300">
            Estimated processing time: 10-15 minutes
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {showUpgradePrompt && onUpgrade && (
          <div className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
            <p className="text-sm text-cyan-300 mb-3">
              🚀 Upgrade your plan to generate more AI headshots!
            </p>
            <Button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-sm py-2"
            >
              Upgrade Now
            </Button>
          </div>
        )}

        <Button
          onClick={onStartProcessing}
          disabled={isLoading}
          className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Starting AI Processing...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              Start AI Processing
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}