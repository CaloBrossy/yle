import React from 'react';
import { ExperienceStage } from '../types';
import { POETIC_VERSES } from '../data/flowersData';

interface PoeticOverlayProps {
  stage: ExperienceStage;
  finalVerseIndex: number;
  springVerseIndex: number; // 0: "Feliz primavera, Yle.", 1: "Te quiero.", 2: "Algún día..."
  onAdvanceStage?: () => void;
}

export const PoeticOverlay: React.FC<PoeticOverlayProps> = ({
  stage,
  springVerseIndex,
}) => {
  // During contemplative end, all UI elements fade to transparent except the gentle final letter
  const isContemplativeEnd = stage === 'contemplative_end';

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-12 z-10 select-none">
      {/* Top subtle chapter indicator (hidden in pure contemplative ending) */}
      {!isContemplativeEnd && (
        <div className="flex justify-between items-center opacity-35 transition-opacity duration-1000">
          <span className="font-sans text-xs tracking-[0.25em] uppercase text-[#e2dad0]">
            Para Vos
          </span>
          <span className="font-sans text-xs tracking-widest text-[#a89f91]">
            {stage === 'darkness' || stage === 'seed'
              ? 'I'
              : stage === 'stem_growth' || stage === 'peony_blooming' || stage === 'peony_revealed'
              ? 'II'
              : stage === 'bouquet_reveal'
              ? 'III'
              : 'IV'}
          </span>
        </div>
      )}

      {/* Center Poetry Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto px-4 my-auto">
        {/* ESCENA 1: La semilla en la oscuridad */}
        {(stage === 'darkness' || stage === 'seed') && (
          <div className="transition-all duration-2000 ease-out space-y-6 px-8 py-6 rounded-2xl bg-black/45 backdrop-blur-sm border border-white/5 shadow-xl">
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#efebe4] font-light leading-relaxed tracking-wide italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              &ldquo;{POETIC_VERSES.scene1.whisper1}&rdquo;
            </p>
          </div>
        )}

        {/* ESCENA 2: El florecimiento y el significado de la Peonía */}
        {stage === 'peony_revealed' && (
          <div className="transition-all duration-1000 ease-out space-y-5 animate-fade-in px-7 sm:px-10 py-7 sm:py-9 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl max-w-lg mx-auto">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#fdf8f4] font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {POETIC_VERSES.scene2.flowerName}
            </h1>
            <p className="font-serif text-xl sm:text-2xl text-[#f4c2c2] tracking-widest uppercase font-light drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
              {POETIC_VERSES.scene2.meaning}
            </p>
            <div className="w-12 h-px bg-[#f4c2c2]/50 mx-auto my-3" />
            <p className="font-serif text-lg sm:text-2xl text-[#e2dad0] font-light italic leading-relaxed max-w-md mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              &ldquo;{POETIC_VERSES.scene2.quote}&rdquo;
            </p>
          </div>
        )}

        {/* ESCENA 3: Transición cinematográfica */}
        {stage === 'spring_transition' && (
          <div className="transition-all duration-1000 ease-out space-y-4 px-8 py-6 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 shadow-2xl animate-fade-in">
            <p className="font-serif text-2xl sm:text-3xl text-[#ffe6a7] font-light italic leading-relaxed tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              No quiero que seas espectadora...
            </p>
          </div>
        )}

        {/* ESCENA 4 & 5: EL RAMO AMARILLO Y LA CARTA FINAL */}
        {(stage === 'final_spring_letter' || stage === 'contemplative_end' || stage === 'yellow_revealed') && (
          <div className="transition-all duration-1000 ease-out space-y-7 max-w-lg mx-auto px-8 sm:px-12 py-8 sm:py-11 rounded-3xl bg-black/55 backdrop-blur-md border border-white/10 shadow-2xl animate-fade-in">
            {/* 1. "Feliz primavera, Yle." */}
            <p className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#fff9db] font-normal tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              Feliz primavera, Yle.
            </p>

            {/* 2. "Te quiero." */}
            {springVerseIndex >= 1 && (
              <p className="font-serif text-2xl sm:text-3xl text-[#ffe066] font-light italic tracking-wider animate-fade-in drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Te quiero.
              </p>
            )}

            {/* 3. "Algún día voy a poder dártelas en persona." */}
            {springVerseIndex >= 2 && (
              <div className="pt-2 animate-fade-in">
                <div className="w-12 h-px bg-[#ffd43b]/40 mx-auto mb-5" />
                <p className="font-serif text-xl sm:text-2xl md:text-3xl text-[#f1e7d0] font-light italic leading-relaxed tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  Algún día voy a poder dártelas en persona.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ESCENA: Ramo principal reunido - Texto flotando a un costado en el espacio, sin fondo */}
      {stage === 'bouquet_reveal' && (
        <div className="absolute right-6 sm:right-10 md:right-16 lg:right-24 top-[32%] sm:top-[38%] -translate-y-1/2 max-w-[210px] sm:max-w-[270px] text-right pointer-events-none select-none transition-all duration-1000 ease-out animate-fade-in">
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#f4eee6] font-light italic leading-snug tracking-wide drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
            Clickeá cada una para saber por qué
          </p>
          <div className="mt-3 flex items-center justify-end gap-2.5 opacity-60">
            <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-white/70 to-transparent" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#fcdada] shadow-[0_0_8px_#fcdada]" />
          </div>
        </div>
      )}

      {/* Bottom spacer */}
      <div className="h-10" />
    </div>
  );
};
