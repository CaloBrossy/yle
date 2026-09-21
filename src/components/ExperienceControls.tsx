import React from 'react';
import { Sparkles } from 'lucide-react';
import { ExperienceStage } from '../types';

interface ExperienceControlsProps {
  stage: ExperienceStage;
  onAdvance: () => void;
  onReset: () => void;
  isAutoAdvancing: boolean;
  setIsAutoAdvancing: (val: boolean) => void;
}

export const ExperienceControls: React.FC<ExperienceControlsProps> = ({
  stage,
  onAdvance,
}) => {
  // In contemplative end or final message, absolutely NO buttons or interface appear
  if (stage === 'contemplative_end') {
    return null;
  }

  const getActionPrompt = () => {
    switch (stage) {
      case 'darkness':
        return 'Toca para dejar caer la semilla';
      case 'seed':
        return 'Observa nacer el tallo';
      case 'stem_growth':
        return 'Aparecen los primeros pétalos...';
      case 'peony_blooming':
        return 'Floreciendo...';
      case 'peony_revealed':
        return 'Toca para reunir el ramo';
      case 'bouquet_reveal':
        return 'Hacia una nueva luz...';
      case 'spring_transition':
        return 'Despertar la primavera';
      case 'yellow_blooming':
        return 'Floreciendo...';
      case 'yellow_revealed':
      case 'final_spring_letter':
        return 'Continuar';
      default:
        return 'Continuar';
    }
  };

  return (
    <div className="absolute bottom-7 inset-x-0 z-30 flex items-center justify-center px-6 pointer-events-none transition-opacity duration-1000">
      {/* Main forward progression prompt */}
      <div className="pointer-events-auto">
        <button
          onClick={onAdvance}
          className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/15 bg-black/50 backdrop-blur-md hover:bg-black/70 hover:border-white/30 text-[#e6ded2] transition-all cursor-pointer shadow-lg"
        >
          <Sparkles size={14} className="text-[#fed049] opacity-80 group-hover:opacity-100 transition-opacity" />
          <span className="font-serif text-sm sm:text-base tracking-widest italic">
            {getActionPrompt()}
          </span>
        </button>
      </div>
    </div>
  );
};
