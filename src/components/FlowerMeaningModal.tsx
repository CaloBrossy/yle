import React from 'react';
import { FLOWERS_DATA } from '../data/flowersData';

interface FlowerMeaningModalProps {
  selectedFlowerId: string | null;
  onClose: () => void;
}

export const FlowerMeaningModal: React.FC<FlowerMeaningModalProps> = ({
  selectedFlowerId,
  onClose,
}) => {
  if (!selectedFlowerId) return null;

  // Extract base type if id is composite like 'peony-main'
  const key = selectedFlowerId.split('-')[0];
  const flower = FLOWERS_DATA[key];
  if (!flower) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-black/40 backdrop-blur-xs pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full p-8 border border-white/10 bg-[#090b0e]/85 rounded-2xl shadow-2xl text-center space-y-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#a19688]">
            {flower.botanicalName}
          </p>
          <h2 className="font-serif text-3xl text-[#fbf7f0] font-normal tracking-wide">
            {flower.name}
          </h2>
        </div>

        <div className="inline-block px-3 py-1 rounded-full border border-[#e5b3b3]/30 bg-[#e5b3b3]/10">
          <span className="font-serif text-sm tracking-widest text-[#f0c2c2] uppercase">
            {flower.meaning}
          </span>
        </div>

        <p className="font-serif text-base text-[#d8d0c2] italic leading-relaxed pt-2">
          &ldquo;{flower.quote}&rdquo;
        </p>

        <div className="pt-4">
          <button
            onClick={onClose}
            className="font-sans text-xs tracking-widest uppercase text-[#9e9587] hover:text-[#fbf7f0] transition-colors py-2 px-4 border border-white/10 rounded-full hover:border-white/30"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
