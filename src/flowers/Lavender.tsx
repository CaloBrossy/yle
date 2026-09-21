import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createStemGeometry } from './math/proceduralStem';
import { FLOWERS_DATA } from '../data/flowersData';

interface LavenderProps {
  bloomProgress?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  stemCurve?: [number, number, number][];
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export const Lavender: React.FC<LavenderProps> = ({
  bloomProgress = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  stemCurve,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const colors = FLOWERS_DATA.lavender.colorPalette;

  const defaultStem: [number, number, number][] = useMemo(() => stemCurve || [
    [0.03, -2.4, -0.03],
    [0.10, -1.4, -0.06],
    [0.26, -0.45, -0.10],
    [0.58, 0.40, -0.16],
    [0.85, 1.15, -0.20],
  ], [stemCurve]);

  const stemGeometry = useMemo(() => createStemGeometry(defaultStem, 0.03, 0.015, 8, 32), [defaultStem]);

  // Spike of lavender florets: stacked tiers along upper stem
  const florets = useMemo(() => {
    const items = [];
    const tiers = 14;
    for (let t = 0; t < tiers; t++) {
      const tierHeight = t * 0.07;
      const countInTier = 4 + (t % 2);
      const tierRadius = 0.05 + (1 - t / tiers) * 0.03;
      for (let i = 0; i < countInTier; i++) {
        const angle = (i / countInTier) * Math.PI * 2 + t * 0.8;
        items.push({
          pos: [
            Math.cos(angle) * tierRadius,
            tierHeight,
            Math.sin(angle) * tierRadius,
          ] as [number, number, number],
          rot: [Math.sin(angle) * 0.4, angle, Math.cos(angle) * 0.4] as [number, number, number],
          scale: 0.035 + (1 - t / tiers) * 0.015,
          color: t % 3 === 0 ? colors.primary : colors.secondary,
        });
      }
    }
    return items;
  }, [colors]);

  useFrame(({ clock }) => {
    if (headRef.current) {
      const time = clock.getElapsedTime();
      headRef.current.rotation.x = rotation[0] + Math.cos(time * 1.0) * 0.02;
      headRef.current.rotation.y = rotation[1];
      headRef.current.rotation.z = rotation[2] + Math.sin(time * 1.3 + 0.8) * 0.03;
    }
  });

  const bloom = Math.max(0.01, Math.min(1, bloomProgress));
  const tipPos = defaultStem[defaultStem.length - 1];

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale * bloom}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver?.();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerOut?.();
      }}
    >
      {/* Tall slender stem */}
      <mesh geometry={stemGeometry} castShadow>
        <meshStandardMaterial color={colors.stem} roughness={0.7} />
      </mesh>

      {/* Flower Spike with dedicated rotation orientation */}
      <group ref={headRef} position={tipPos}>
        {florets.map((floret, idx) => (
          <group key={idx} position={floret.pos} rotation={floret.rot} scale={floret.scale * bloom}>
            {/* Tubular petal cluster */}
            <mesh castShadow>
              <sphereGeometry args={[1, 6, 6]} />
              <meshStandardMaterial color={floret.color} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.4, 0.2, 1.2, 5]} />
              <meshStandardMaterial color={colors.deep} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
