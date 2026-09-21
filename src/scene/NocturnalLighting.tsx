import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface LightingProps {
  springProgress?: number; // 0 (nocturnal garden) to 1 (luminous spring sunlight)
  intensityMultiplier?: number;
}

export const NocturnalLighting: React.FC<LightingProps> = ({
  springProgress = 0,
  intensityMultiplier = 1.0,
}) => {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.PointLight>(null);
  const springSunRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const breath = 1.0 + Math.sin(t * 0.7) * 0.05;
    const sp = Math.max(0, Math.min(1, springProgress));

    if (keyLightRef.current) {
      // Night key is soft ivory (#fff4ea), spring key is sunny gold (#fff5db)
      const baseIntensity = THREE.MathUtils.lerp(1.8, 2.6, sp);
      keyLightRef.current.intensity = baseIntensity * intensityMultiplier * breath;
      keyLightRef.current.color.set(sp > 0.5 ? '#fff8e7' : '#fff4ea');
    }

    if (rimLightRef.current) {
      // Night rim is soft rose (#ffdce6), spring rim is rich warm gold (#ffd778)
      const baseIntensity = THREE.MathUtils.lerp(2.4, 3.2, sp);
      rimLightRef.current.intensity = baseIntensity * intensityMultiplier * breath;
      rimLightRef.current.color.set(sp > 0.5 ? '#ffe28a' : '#ffdce6');
    }

    if (fillLightRef.current) {
      fillLightRef.current.intensity = THREE.MathUtils.lerp(0.8, 1.4, sp) * intensityMultiplier;
      fillLightRef.current.color.set(sp > 0.5 ? '#fff3cc' : '#fceae8');
    }

    if (springSunRef.current) {
      springSunRef.current.intensity = sp * 2.2 * breath;
    }
  });

  return (
    <>
      {/* 1. Ambient lighting (cool nocturnal shifting to warm sunlit dawn) */}
      <ambientLight
        color={springProgress > 0.4 ? '#2b2313' : '#12151c'}
        intensity={0.6 + springProgress * 0.5}
      />

      {/* 2. Key directional light */}
      <directionalLight
        ref={keyLightRef}
        position={[-2.5, 4.5, 3.5]}
        color="#fff4ea"
        intensity={1.8 * intensityMultiplier}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />

      {/* 3. Rim / Backlight behind flower head */}
      <directionalLight
        ref={rimLightRef}
        position={[2.0, 3.0, -3.2]}
        color="#ffdce6"
        intensity={2.4 * intensityMultiplier}
      />

      {/* 4. Soft intimate fill light */}
      <pointLight
        ref={fillLightRef}
        position={[0, 0.5, 1.8]}
        color="#fceae8"
        intensity={0.8 * intensityMultiplier}
        distance={7}
        decay={2}
      />

      {/* 5. Direct spring sunbeam that awakens during transition */}
      <directionalLight
        ref={springSunRef}
        position={[1.5, 5.0, 2.0]}
        color="#fff0bd"
        intensity={0}
        castShadow
      />
    </>
  );
};
