import { motion } from 'framer-motion';
import { Badge } from '../../ui/badge';
import { AIModel } from '../constants/styleData';

interface AIModelCardProps {
  model: AIModel;
  isSelected: boolean;
  onSelect: (modelId: string) => void;
}

export function AIModelCard({ model, isSelected, onSelect }: AIModelCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(model.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-6 rounded-xl border-2 transition-all text-left relative ${
        isSelected
          ? 'border-cyan-400 bg-cyan-400/5'
          : 'border-slate-600 hover:border-slate-500 bg-slate-700/20'
      }`}
    >
      {model.popular && (
        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-600">
          Popular
        </Badge>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl">
          <model.icon className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{model.name}</h3>
          <p className="text-2xl font-bold text-cyan-400">${model.price}</p>
        </div>
      </div>
      
      <p className="text-slate-300 text-sm mb-4">{model.description}</p>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Quality</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`w-2 h-2 rounded-full ${
                  star <= model.quality ? 'bg-cyan-400' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Speed</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`w-2 h-2 rounded-full ${
                  star <= model.speed ? 'bg-green-400' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.button>
  );
}