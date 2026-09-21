import React from 'react';
import { Peony } from './Peony';
import { Jasmine } from './Jasmine';
import { Lavender } from './Lavender';
import { Daisy } from './Daisy';
import { Tulip } from './Tulip';
import { Gypsophila } from './Gypsophila';
import { BouquetWrapping } from './BouquetWrapping';
import { BOUQUET_FLOWERS } from '../data/flowersData';
import { ExperienceStage } from '../types';

interface BouquetProps {
  stage: ExperienceStage;
  peonyBloomProgress: number;
  peonyStemGrowth: number;
  otherFlowersBloom: number; // 0 to 1 progressive bloom for companion flowers
  revealedFlowerIndex: number; // which flowers have appeared
  onFlowerClick: (flowerId: string) => void;
  onFlowerHover: (flowerId: string | null) => void;
}

export const Bouquet: React.FC<BouquetProps> = ({
  stage,
  peonyBloomProgress,
  peonyStemGrowth,
  otherFlowersBloom,
  revealedFlowerIndex,
  onFlowerClick,
  onFlowerHover,
}) => {
  const isSoloPeonyMode = stage === 'darkness' || stage === 'seed' || stage === 'stem_growth' || stage === 'peony_blooming' || stage === 'peony_revealed';

  // The Peony definition
  const peonyConfig = BOUQUET_FLOWERS[0];

  return (
    <group position={[0, -0.4, 0]}>
      {/* 1. Protagonist: La Peonía */}
      <Peony
        bloomProgress={peonyBloomProgress}
        stemGrowProgress={peonyStemGrowth}
        position={isSoloPeonyMode ? [0, 0, 0] : peonyConfig.position}
        rotation={isSoloPeonyMode ? [0.1, 0, 0] : peonyConfig.rotation}
        scale={isSoloPeonyMode ? 1.25 : peonyConfig.scale}
        isBouquetMode={!isSoloPeonyMode}
        onClick={() => onFlowerClick(peonyConfig.id)}
        onPointerOver={() => onFlowerHover(peonyConfig.id)}
        onPointerOut={() => onFlowerHover(null)}
      />

      {/* 2. Companion Flowers of the Nocturnal Bouquet */}
      {!isSoloPeonyMode && (
        <group>
          {/* Jasmine */}
          {revealedFlowerIndex >= 2 && (
            <Jasmine
              bloomProgress={otherFlowersBloom}
              position={[0, 0, 0]}
              rotation={BOUQUET_FLOWERS[1].rotation}
              scale={BOUQUET_FLOWERS[1].scale}
              stemCurve={BOUQUET_FLOWERS[1].stemCurve}
              onClick={() => onFlowerClick(BOUQUET_FLOWERS[1].id)}
              onPointerOver={() => onFlowerHover(BOUQUET_FLOWERS[1].id)}
              onPointerOut={() => onFlowerHover(null)}
            />
          )}

          {/* Lavender */}
          {revealedFlowerIndex >= 3 && (
            <Lavender
              bloomProgress={otherFlowersBloom}
              position={[0, 0, 0]}
              rotation={BOUQUET_FLOWERS[2].rotation}
              scale={BOUQUET_FLOWERS[2].scale}
              stemCurve={BOUQUET_FLOWERS[2].stemCurve}
              onClick={() => onFlowerClick(BOUQUET_FLOWERS[2].id)}
              onPointerOver={() => onFlowerHover(BOUQUET_FLOWERS[2].id)}
              onPointerOut={() => onFlowerHover(null)}
            />
          )}

          {/* Daisy */}
          {revealedFlowerIndex >= 4 && (
            <Daisy
              bloomProgress={otherFlowersBloom}
              position={[0, 0, 0]}
              rotation={BOUQUET_FLOWERS[3].rotation}
              scale={BOUQUET_FLOWERS[3].scale}
              stemCurve={BOUQUET_FLOWERS[3].stemCurve}
              onClick={() => onFlowerClick(BOUQUET_FLOWERS[3].id)}
              onPointerOver={() => onFlowerHover(BOUQUET_FLOWERS[3].id)}
              onPointerOut={() => onFlowerHover(null)}
            />
          )}

          {/* Tulip */}
          {revealedFlowerIndex >= 5 && (
            <Tulip
              bloomProgress={otherFlowersBloom}
              position={[0, 0, 0]}
              rotation={BOUQUET_FLOWERS[4].rotation}
              scale={BOUQUET_FLOWERS[4].scale}
              stemCurve={BOUQUET_FLOWERS[4].stemCurve}
              onClick={() => onFlowerClick(BOUQUET_FLOWERS[4].id)}
              onPointerOver={() => onFlowerHover(BOUQUET_FLOWERS[4].id)}
              onPointerOut={() => onFlowerHover(null)}
            />
          )}

          {/* Gypsophila spray */}
          {revealedFlowerIndex >= 6 && (
            <Gypsophila
              bloomProgress={otherFlowersBloom}
              position={[0, 0, 0]}
              rotation={BOUQUET_FLOWERS[5].rotation}
              scale={BOUQUET_FLOWERS[5].scale}
              stemCurve={BOUQUET_FLOWERS[5].stemCurve}
              onClick={() => onFlowerClick(BOUQUET_FLOWERS[5].id)}
              onPointerOver={() => onFlowerHover(BOUQUET_FLOWERS[5].id)}
              onPointerOut={() => onFlowerHover(null)}
            />
          )}

          {/* Elegant Florist Kraft Paper Wrap gathering all stems together */}
          <BouquetWrapping
            progress={
              stage === 'bouquet_reveal' || stage === 'spring_transition'
                ? 1.0
                : Math.min(1, Math.max(0.1, (revealedFlowerIndex - 1) / 4))
            }
          />
        </group>
      )}
    </group>
  );
};
