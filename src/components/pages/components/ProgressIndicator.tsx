import { CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

export function ProgressIndicator({ currentStep, totalSteps, stepLabel }: ProgressIndicatorProps) {
  return (
    <div className="text-center">
      <div className="flex items-center gap-2 justify-center mb-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          return (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber === currentStep + 1
                  ? 'bg-cyan-500 text-white' 
                  : stepNumber <= currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {stepNumber <= currentStep ? <CheckCircle className="h-4 w-4" /> : stepNumber}
              </div>
              {index < totalSteps - 1 && (
                <div className={`w-8 h-px mx-2 ${
                  stepNumber <= currentStep ? 'bg-green-500' : 'bg-slate-600'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-sm text-slate-400">
        {stepLabel}
      </div>
    </div>
  );
}