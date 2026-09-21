import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExperienceCanvas } from './scene/ExperienceCanvas';
import { PoeticOverlay } from './components/PoeticOverlay';
import { ExperienceControls } from './components/ExperienceControls';
import { FlowerMeaningModal } from './components/FlowerMeaningModal';
import { ExperienceStage } from './types';
import { ambientSound } from './audio/ambientSound';
import { GlobalAudio } from './audio/GlobalAudio';

export default function App() {
  const [stage, setStage] = useState<ExperienceStage>('darkness');
  const [peonyBloom, setPeonyBloom] = useState<number>(0);
  const [peonyStemGrowth, setPeonyStemGrowth] = useState<number>(0);
  const [otherFlowersBloom, setOtherFlowersBloom] = useState<number>(0);
  const [revealedFlowerIndex, setRevealedFlowerIndex] = useState<number>(1);
  const [seedProgress, setSeedProgress] = useState<number>(0);

  // Spring Yellow Bouquet States
  const [yellowBloom, setYellowBloom] = useState<number>(0);
  const [yellowRevealedCount, setYellowRevealedCount] = useState<number>(1);
  const [springTransitionProgress, setSpringTransitionProgress] = useState<number>(0);
  const [springVerseIndex, setSpringVerseIndex] = useState<number>(0);

  const [selectedFlowerId, setSelectedFlowerId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState<boolean>(true);

  const animationFrameRef = useRef<number | null>(null);

  // Responsive device check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Continuous animation and timing loop
  useEffect(() => {
    let lastTime = performance.now();

    const animateLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 1. Darkness -> Seed Descent
      if (stage === 'darkness') {
        setSeedProgress((prev) => {
          const next = prev + dt * 0.28;
          if (next >= 1) {
            setStage('stem_growth');
            return 1;
          }
          return next;
        });
      }

      // 2. Stem Upward Growth
      if (stage === 'stem_growth') {
        setPeonyStemGrowth((prev) => {
          const next = prev + dt * 0.45;
          if (next >= 1) {
            setStage('peony_blooming');
            return 1;
          }
          return next;
        });
      }

      // 3. Peony Blooming (Clean, controlled layers)
      if (stage === 'peony_blooming') {
        setPeonyBloom((prev) => {
          const next = prev + dt * 0.3;
          if (next >= 1) {
            ambientSound.playGentleChime(523.25);
            setStage('peony_revealed');
            return 1;
          }
          return next;
        });
      }

      // 5 & 6. Companion Bouquet Reveal
      if (stage === 'bouquet_reveal') {
        setOtherFlowersBloom((prev) => Math.min(1, prev + dt * 0.35));
        setRevealedFlowerIndex((prev) => {
          if (prev < 6) return Math.min(6, prev + dt * 1.5);
          return 6;
        });
      }

      // 7 & 8. Cinematic Transition to Warm Spring
      if (stage === 'spring_transition') {
        setSpringTransitionProgress((prev) => {
          const next = prev + dt * 0.35;
          if (next >= 1) {
            ambientSound.playGentleChime(659.25); // Warm E5 chime
            setStage('yellow_blooming');
            return 1;
          }
          return next;
        });
      }

      // 9 & 10. Progressive Blooming of Yellow Bouquet
      if (stage === 'yellow_blooming') {
        setYellowBloom((prev) => Math.min(1, prev + dt * 0.32));
        setYellowRevealedCount((prev) => {
          const next = prev + dt * 0.8;
          if (next >= 5) {
            ambientSound.playGentleChime(783.99); // G5 warm golden chime
            setStage('yellow_revealed');
            return 5;
          }
          return next;
        });
      }

      animationFrameRef.current = requestAnimationFrame(animateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(animateLoop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [stage]);

  // Stage Advancement Handler
  const handleAdvance = useCallback(() => {
    ambientSound.playGentleChime(523.25);

    if (stage === 'darkness' || stage === 'seed') {
      setSeedProgress(1);
      setStage('stem_growth');
    } else if (stage === 'stem_growth') {
      setPeonyStemGrowth(1);
      setStage('peony_blooming');
    } else if (stage === 'peony_blooming') {
      setPeonyBloom(1);
      setStage('peony_revealed');
    } else if (stage === 'peony_revealed') {
      // Move to complete nocturnal bouquet
      setStage('bouquet_reveal');
      setOtherFlowersBloom(0.5);
      setRevealedFlowerIndex(3);
    } else if (stage === 'bouquet_reveal') {
      // Transition to warm spring scene
      setStage('spring_transition');
      setSpringTransitionProgress(0.1);
    } else if (stage === 'spring_transition') {
      setSpringTransitionProgress(1);
      setStage('yellow_blooming');
      setYellowBloom(0.4);
      setYellowRevealedCount(2);
    } else if (stage === 'yellow_blooming') {
      setYellowBloom(1);
      setYellowRevealedCount(5);
      setStage('yellow_revealed');
    } else if (stage === 'yellow_revealed') {
      setStage('final_spring_letter');
      setSpringVerseIndex(0); // "Feliz primavera, Yle."
    } else if (stage === 'final_spring_letter') {
      if (springVerseIndex === 0) {
        setSpringVerseIndex(1); // "Te quiero."
      } else if (springVerseIndex === 1) {
        setSpringVerseIndex(2); // "Algún día voy a poder dártelas en persona."
      } else {
        // Enters pure contemplative ending without UI
        setStage('contemplative_end');
      }
    }
  }, [stage, springVerseIndex]);

  const handleReset = useCallback(() => {
    setStage('darkness');
    setSeedProgress(0);
    setPeonyStemGrowth(0);
    setPeonyBloom(0);
    setOtherFlowersBloom(0);
    setRevealedFlowerIndex(1);
    setYellowBloom(0);
    setYellowRevealedCount(1);
    setSpringTransitionProgress(0);
    setSpringVerseIndex(0);
    setSelectedFlowerId(null);
  }, []);

  return (
    <main
      className="relative w-screen h-screen overflow-hidden bg-[#040507] select-none"
      onClick={() => {
        // Tapping anywhere during final letter advances the intimate message
        if (stage === 'final_spring_letter') {
          handleAdvance();
        }
      }}
    >
      {/* 1. Global continuous audio engine - single persistent instance for the entire app */}
      <GlobalAudio />

      {/* 2. 3D WebGL Canvas Layer */}
      <ExperienceCanvas
        stage={stage}
        peonyBloomProgress={peonyBloom}
        peonyStemGrowth={peonyStemGrowth}
        otherFlowersBloom={otherFlowersBloom}
        revealedFlowerIndex={Math.floor(revealedFlowerIndex)}
        seedProgress={seedProgress}
        yellowBloomProgress={yellowBloom}
        yellowRevealedCount={Math.floor(yellowRevealedCount)}
        springTransitionProgress={springTransitionProgress}
        onFlowerClick={(id) => {
          if (stage !== 'contemplative_end' && stage !== 'final_spring_letter') {
            setSelectedFlowerId(id);
          }
        }}
        onFlowerHover={() => {}}
        isMobile={isMobile}
      />

      {/* Poetic Typography Overlay with Soft Dark Readability Backing */}
      <PoeticOverlay
        stage={stage}
        finalVerseIndex={0}
        springVerseIndex={springVerseIndex}
        onAdvanceStage={handleAdvance}
      />

      {/* Discrete Interaction Controls (Disappears completely in contemplative end) */}
      <ExperienceControls
        stage={stage}
        onAdvance={handleAdvance}
        onReset={handleReset}
        isAutoAdvancing={isAutoAdvancing}
        setIsAutoAdvancing={setIsAutoAdvancing}
      />

      {/* Interactive Meaning Modal (Active only during the first exploration phase) */}
      {selectedFlowerId && (
        <FlowerMeaningModal
          selectedFlowerId={selectedFlowerId}
          onClose={() => setSelectedFlowerId(null)}
        />
      )}
    </main>
  );
}
