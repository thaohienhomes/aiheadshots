import { Label } from '../../ui/label';
import { eyeColors } from '../constants/personalInfoData';

interface EyeColorSelectorProps {
  selectedEyeColor: string;
  onEyeColorChange: (color: string) => void;
}

export function EyeColorSelector({ selectedEyeColor, onEyeColorChange }: EyeColorSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Eye Color</Label>
      <div className="grid grid-cols-3 gap-3">
        {eyeColors.map((eye) => (
          <button
            key={eye.value}
            onClick={() => onEyeColorChange(eye.value)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedEyeColor === eye.value
                ? 'border-cyan-400 bg-cyan-400/10'
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border border-slate-400"
                style={{ backgroundColor: eye.color }}
              />
              <span className="text-sm text-white">{eye.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}