import { motion } from 'framer-motion';
import { Badge } from '../../ui/badge';
import { Crown, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { StyleOption } from '../constants/styleData';

interface StyleOptionCardProps {
  style: StyleOption;
  isSelected: boolean;
  onSelect: (styleId: string, category: 'background' | 'clothing') => void;
}

export function StyleOptionCard({ style, isSelected, onSelect }: StyleOptionCardProps) {
  const aspectRatio = style.category === 'background' ? 'aspect-video' : 'aspect-[3/4]';

  return (
    <motion.button
      onClick={() => onSelect(style.id, style.category)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-cyan-400'
          : 'border-slate-600 hover:border-slate-500'
      }`}
    >
      <div className={aspectRatio}>
        <ImageWithFallback
          src={style.preview}
          alt={style.name}
          className="w-full h-full object-cover"
        />
        {style.premium && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}
        {isSelected && (
          <div className="absolute inset-0 bg-cyan-400/20 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-cyan-400" />
          </div>
        )}
      </div>
      <div className="p-3 text-left">
        <h3 className="font-medium text-white text-sm">{style.name}</h3>
        <p className="text-xs text-slate-400 mt-1">{style.description}</p>
        {style.premium && (
          <p className="text-xs text-yellow-400 mt-1">+${style.price}</p>
        )}
      </div>
    </motion.button>
  );
}