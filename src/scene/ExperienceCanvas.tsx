import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { NocturnalLighting } from './NocturnalLighting';
import { AmbientPollen } from './AmbientPollen';
import { Bouquet } from '../flowers/Bouquet';
import { YellowBouquet } from '../flowers/YellowBouquet';
import { ExperienceStage } from '../types';

interface ExperienceCanvasProps {
  stage: ExperienceStage;
  peonyBloomProgress: number;
  peonyStemGrowth: number;
  otherFlowersBloom: number;
  revealedFlowerIndex: number;
  seedProgress: number;
  yellowBloomProgress: number;
  yellowRevealedCount: number;
  springTransitionProgress: number; // 0 to 1
  onFlowerClick: (flowerId: string) => void;
  onFlowerHover: (flowerId: string | null) => void;
  isMobile: boolean;
}

// Camera controller with smooth transitions across the entire narrative journey
const DynamicCameraController: React.FC<{
  stage: ExperienceStage;
  springProgress: number;
  isMobile: boolean;
}> = ({ stage, springProgress, isMobile }) => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const targetCamPos = useRef(new THREE.Vector3(0, 0.2, isMobile ? 4.5 : 3.6));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.1, 0));

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handlePointerMove);
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, []);

  useFrame(() => {
    if (stage === 'darkness' || stage === 'seed') {
      targetCamPos.current.set(0, 0.5, isMobile ? 4.2 : 3.4);
      targetLookAt.current.set(0, 0.2, 0);
    } else if (stage === 'stem_growth') {
      targetCamPos.current.set(0, -0.4, isMobile ? 4.4 : 3.6);
      targetLookAt.current.set(0, -0.5, 0);
    } else if (stage === 'peony_blooming' || stage === 'peony_revealed') {
      // Intimate close-up of the pristine Peony
      targetCamPos.current.set(0, 0.12, isMobile ? 4.1 : 3.2);
      targetLookAt.current.set(0, 0.08, 0);
    } else if (stage === 'bouquet_reveal') {
      // Pull back to reveal full first bouquet
      targetCamPos.current.set(0, -0.15, isMobile ? 5.6 : 4.6);
      targetLookAt.current.set(0, -0.25, 0);
    } else if (stage === 'spring_transition') {
      // Camera recedes gently as golden light fills space
      targetCamPos.current.set(0, 0.2, isMobile ? 6.2 : 5.2);
      targetLookAt.current.set(0, 0, 0);
    } else if (stage === 'yellow_blooming') {
      // Gentle forward focus as yellow flowers begin appearing
      targetCamPos.current.set(0, 0.05, isMobile ? 4.6 : 3.8);
      targetLookAt.current.set(0, 0.05, 0);
    } else {
      // yellow_revealed, final_spring_letter, contemplative_end:
      // Perfectly composed warm spring frame
      targetCamPos.current.set(0, -0.05, isMobile ? 5.2 : 4.2);
      targetLookAt.current.set(0, -0.1, 0);
    }

    const parallaxX = mouse.current.x * (isMobile ? 0.06 : 0.22);
    const parallaxY = mouse.current.y * (isMobile ? 0.06 : 0.16);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamPos.current.x + parallaxX, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamPos.current.y + parallaxY, 0.035);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamPos.current.z, 0.035);

    camera.lookAt(targetLookAt.current);
  });

  return null;
};

export const ExperienceCanvas: React.FC<ExperienceCanvasProps> = ({
  stage,
  peonyBloomProgress,
  peonyStemGrowth,
  otherFlowersBloom,
  revealedFlowerIndex,
  seedProgress,
  yellowBloomProgress,
  yellowRevealedCount,
  springTransitionProgress,
  onFlowerClick,
  onFlowerHover,
  isMobile,
}) => {
  const isSpringPhase = [
    'spring_transition',
    'yellow_blooming',
    'yellow_revealed',
    'final_spring_letter',
    'contemplative_end'
  ].includes(stage);

  // Background color warms from dark night into soft sunlit dawn
  const bgColor = isSpringPhase
    ? '#090704'
    : '#040507';

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{
          position: [0, 0.2, isMobile ? 4.5 : 3.6],
          fov: isMobile ? 52 : 45,
          near: 0.1,
          far: 30,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05 + springTransitionProgress * 0.2;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <DynamicCameraController
          stage={stage}
          springProgress={springTransitionProgress}
          isMobile={isMobile}
        />

        {/* Dynamic Atmosphere Background & Fog */}
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 3.5, 16]} />

        {/* Lighting with smooth Spring Transition */}
        <NocturnalLighting
          springProgress={springTransitionProgress}
          intensityMultiplier={stage === 'darkness' ? 0.3 : 1.0}
        />

        {/* Ambient Pollen & Golden Spring Motes */}
        <AmbientPollen
          count={isMobile ? 80 : 160}
          showInitialSeed={stage === 'darkness' || stage === 'seed'}
          seedProgress={seedProgress}
          springProgress={springTransitionProgress}
        />

        {/* First Bouquet (Nocturnal Peony & Companions) */}
        {!isSpringPhase && stage !== 'darkness' && (
          <Bouquet
            stage={stage}
            peonyBloomProgress={peonyBloomProgress}
            peonyStemGrowth={peonyStemGrowth}
            otherFlowersBloom={otherFlowersBloom}
            revealedFlowerIndex={revealedFlowerIndex}
            onFlowerClick={onFlowerClick}
            onFlowerHover={onFlowerHover}
          />
        )}

        {/* Second Bouquet (Spring Yellow Bouquet) */}
        {isSpringPhase && (
          <group
            position={[0, 0, (1 - springTransitionProgress) * -2]}
          >
            <YellowBouquet
              bloomProgress={yellowBloomProgress}
              revealedCount={yellowRevealedCount}
              onFlowerClick={(name) => onFlowerClick(name)}
            />
          </group>
        )}
      </Canvas>
    </div>
  );
};
