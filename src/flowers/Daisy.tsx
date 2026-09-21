import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createProceduralPetalGeometry } from './math/proceduralPetal';
import { createStemGeometry, createLeafGeometry } from './math/proceduralStem';
import { FLOWERS_DATA } from '../data/flowersData';

interface DaisyProps {
  bloomProgress?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  stemCurve?: [number, number, number][];
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export const Daisy: React.FC<DaisyProps> = ({
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
  const colors = FLOWERS_DATA.daisy.colorPalette;

  const defaultStem: [number, number, number][] = useMemo(() => stemCurve || [
    [0.03, -2.4, 0.04],
    [0.10, -1.4, 0.08],
    [0.30, -0.45, 0.22],
    [0.60, -0.32, 0.34],
    [0.85, -0.22, 0.42],
  ], [stemCurve]);

  const stemGeometry = useMemo(() => createStemGeometry(defaultStem, 0.035, 0.022, 8, 30), [defaultStem]);
  const leafGeometry = useMemo(() => createLeafGeometry(0.38, 0.16, 0.35, 8, 12), []);

  // Ray florets: 22 slender radiant petals
  const rayPetals = useMemo(() => {
    const items = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const geom = createProceduralPetalGeometry({
        length: 0.52,
        width: 0.14,
        curvature: 0.1,
        cupDepth: 0.12,
        ruffleIntensity: 0.02,
        ruffleFrequency: 3,
        randomSeed: i * 7.1,
      });
      items.push({ angle, geom });
    }
    return items;
  }, []);

  useFrame(({ clock }) => {
    if (headRef.current) {
      const t = clock.getElapsedTime();
      headRef.current.rotation.x = rotation[0] + Math.cos(t * 1.1) * 0.02;
      headRef.current.rotation.y = rotation[1];
      headRef.current.rotation.z = rotation[2] + Math.sin(t * 0.95 + 2.0) * 0.03;
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
      {/* Curved Stem */}
      <mesh geometry={stemGeometry} castShadow>
        <meshStandardMaterial color={colors.stem} roughness={0.7} />
      </mesh>

      {/* Leaf (emerging above the florist paper wrap) */}
      <group position={[0.50, -0.25, 0.28]} rotation={[0.4, 0.5, -0.3]}>
        <mesh geometry={leafGeometry} castShadow>
          <meshStandardMaterial color={colors.leaf} roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Flower Head with dedicated rotation orientation */}
      <group ref={headRef} position={tipPos}>
        {/* Golden convex disk center */}
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.13, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color={colors.center}
            roughness={0.4}
            metalness={0.1}
            emissive={colors.center}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* 22 White Ray Petals */}
        {rayPetals.map((p, idx) => {
          const tilt = 1.45 * bloom;
          return (
            <mesh
              key={idx}
              geometry={p.geom}
              rotation={[-Math.cos(p.angle) * tilt, p.angle, Math.sin(p.angle) * tilt]}
              position={[Math.sin(p.angle) * 0.1, 0, Math.cos(p.angle) * 0.1]}
              castShadow
            >
              <meshStandardMaterial
                color={colors.primary}
                roughness={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
