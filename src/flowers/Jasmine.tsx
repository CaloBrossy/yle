import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createProceduralPetalGeometry } from './math/proceduralPetal';
import { createStemGeometry, createLeafGeometry } from './math/proceduralStem';
import { FLOWERS_DATA } from '../data/flowersData';

interface JasmineProps {
  bloomProgress?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  stemCurve?: [number, number, number][];
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export const Jasmine: React.FC<JasmineProps> = ({
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
  const colors = FLOWERS_DATA.jasmine.colorPalette;

  const defaultStem: [number, number, number][] = useMemo(() => stemCurve || [
    [-0.04, -2.4, 0.02],
    [-0.12, -1.4, 0.06],
    [-0.32, -0.45, 0.18],
    [-0.68, -0.25, 0.28],
    [-0.95, -0.05, 0.35],
  ], [stemCurve]);

  const stemGeometry = useMemo(() => createStemGeometry(defaultStem, 0.035, 0.02, 8, 30), [defaultStem]);
  const leafGeometry = useMemo(() => createLeafGeometry(0.35, 0.16, 0.3, 8, 10), []);

  // Jasmine has 5 star-like elongated petals radiating from a slender tube
  const petals = useMemo(() => {
    const items = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const geom = createProceduralPetalGeometry({
        length: 0.42,
        width: 0.2,
        curvature: 0.15,
        cupDepth: 0.2,
        ruffleIntensity: 0.03,
        ruffleFrequency: 3,
        randomSeed: i * 4.2,
      });
      items.push({ angle, geom });
    }
    return items;
  }, []);

  useFrame(({ clock }) => {
    if (headRef.current) {
      const t = clock.getElapsedTime();
      headRef.current.rotation.x = rotation[0] + Math.cos(t * 0.9) * 0.02;
      headRef.current.rotation.y = rotation[1];
      headRef.current.rotation.z = rotation[2] + Math.sin(t * 1.1 + 1.2) * 0.025;
    }
  });

  const bloom = Math.max(0.01, Math.min(1, bloomProgress));

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
      {/* Stem */}
      <mesh geometry={stemGeometry} castShadow>
        <meshStandardMaterial color={colors.stem} roughness={0.7} />
      </mesh>

      {/* Leaves (emerging gracefully above the florist wrapping) */}
      <group position={[-0.55, -0.20, 0.24]} rotation={[0.3, 0.7, -0.4]}>
        <mesh geometry={leafGeometry} castShadow>
          <meshStandardMaterial color={colors.leaf} roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Blossom Head with dedicated rotation orientation */}
      <group ref={headRef} position={defaultStem[defaultStem.length - 1]}>
        {/* Slender green flower tube */}
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.02, 0.015, 0.16, 8]} />
          <meshStandardMaterial color={colors.stem} roughness={0.6} />
        </mesh>

        {/* Delicate golden center */}
        <mesh position={[0, 0.01, 0]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshStandardMaterial color={colors.center} roughness={0.3} emissive={colors.center} emissiveIntensity={0.2} />
        </mesh>

        {/* 5 Radiant Star Petals */}
        {petals.map((petal, idx) => {
          const openTilt = 1.35 * bloom;
          return (
            <mesh
              key={idx}
              geometry={petal.geom}
              rotation={[-Math.cos(petal.angle) * openTilt, petal.angle, Math.sin(petal.angle) * openTilt]}
              position={[Math.sin(petal.angle) * 0.04, 0.02, Math.cos(petal.angle) * 0.04]}
              castShadow
            >
              <meshStandardMaterial
                color={colors.primary}
                roughness={0.38}
                metalness={0.02}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
