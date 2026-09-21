import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface AmbientPollenProps {
  count?: number;
  showInitialSeed?: boolean;
  seedProgress?: number; // 0 (high in darkness) to 1 (planted on ground)
  springProgress?: number; // 0 to 1
}

export const AmbientPollen: React.FC<AmbientPollenProps> = ({
  count = 140,
  showInitialSeed = false,
  seedProgress = 0,
  springProgress = 0,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const goldenPointsRef = useRef<THREE.Points>(null);
  const seedMeshRef = useRef<THREE.Group>(null);

  // Generate ambient dust & pollen particles
  const [positions, scales, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    const spd = new Float32Array(count);
    const pha = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 0.5 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      sca[i] = 0.015 + Math.random() * 0.035;
      spd[i] = 0.2 + Math.random() * 0.4;
      pha[i] = Math.random() * Math.PI * 2;
    }

    return [pos, sca, spd, pha];
  }, [count]);

  // Golden spring particles that awaken during spring transition
  const [goldenPos, goldenSpeeds] = useMemo(() => {
    const gCount = 100;
    const pos = new Float32Array(gCount * 3);
    const spd = new Float32Array(gCount);
    for (let i = 0; i < gCount; i++) {
      const r = 0.3 + Math.random() * 2.2;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      pos[i * 3 + 2] = Math.sin(a) * r;
      spd[i] = 0.3 + Math.random() * 0.5;
    }
    return [pos, spd];
  }, []);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 245, 220, 1)');
    grad.addColorStop(0.3, 'rgba(255, 220, 180, 0.7)');
    grad.addColorStop(0.7, 'rgba(240, 190, 160, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const goldenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 235, 120, 1)');
    grad.addColorStop(0.3, 'rgba(255, 210, 60, 0.85)');
    grad.addColorStop(0.7, 'rgba(255, 180, 20, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        arr[i3 + 1] += speeds[i] * 0.003;
        arr[i3] += Math.sin(time * 0.5 + phases[i]) * 0.0015;
        arr[i3 + 2] += Math.cos(time * 0.4 + phases[i]) * 0.0015;

        if (arr[i3 + 1] > 2.5) {
          arr[i3 + 1] = -2.5;
        }
      }
      posAttr.needsUpdate = true;
    }

    if (goldenPointsRef.current && springProgress > 0) {
      const posAttr = goldenPointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < 100; i++) {
        const i3 = i * 3;
        arr[i3 + 1] += goldenSpeeds[i] * 0.004;
        arr[i3] += Math.sin(time * 0.8 + i) * 0.002;
        arr[i3 + 2] += Math.cos(time * 0.7 + i) * 0.002;
        if (arr[i3 + 1] > 2.5) arr[i3 + 1] = -2.5;
      }
      posAttr.needsUpdate = true;
    }

    // Seed particle for Scene 1
    if (seedMeshRef.current && showInitialSeed) {
      const seedY = THREE.MathUtils.lerp(2.5, -1.8, seedProgress);
      const seedX = Math.sin(seedProgress * Math.PI * 2) * 0.08;
      const seedZ = Math.cos(seedProgress * Math.PI * 3) * 0.05;

      seedMeshRef.current.position.set(seedX, seedY, seedZ);
      const scale = 0.08 + Math.sin(time * 3) * 0.01;
      seedMeshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Night dust / ambient particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          map={particleTexture}
          transparent
          opacity={springProgress > 0.5 ? 0.3 : 0.65}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#fbe3cf"
        />
      </points>

      {/* Spring golden motes */}
      {springProgress > 0 && (
        <points ref={goldenPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[goldenPos, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.09}
            map={goldenTexture}
            transparent
            opacity={springProgress * 0.75}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color="#ffe277"
          />
        </points>
      )}

      {/* Escena 1: The descending seed */}
      {showInitialSeed && (
        <group ref={seedMeshRef}>
          <mesh>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshBasicMaterial
              color="#ffeedd"
              transparent
              opacity={0.45}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh scale={[0.4, 0.7, 0.4]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial
              color="#d2a679"
              roughness={0.5}
              emissive="#ffcc88"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
