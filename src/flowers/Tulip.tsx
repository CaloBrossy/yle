import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createProceduralPetalGeometry } from './math/proceduralPetal';
import { createStemGeometry, createLeafGeometry } from './math/proceduralStem';
import { FLOWERS_DATA } from '../data/flowersData';

interface TulipProps {
  bloomProgress?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  stemCurve?: [number, number, number][];
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export const Tulip: React.FC<TulipProps> = ({
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
  const colors = FLOWERS_DATA.tulip.colorPalette;

  const defaultStem: [number, number, number][] = useMemo(() => stemCurve || [
    [-0.03, -2.4, -0.04],
    [-0.10, -1.4, -0.06],
    [-0.26, -0.45, -0.10],
    [-0.60, 0.35, -0.14],
    [-0.88, 1.05, -0.15],
  ], [stemCurve]);

  const stemGeometry = useMemo(() => createStemGeometry(defaultStem, 0.045, 0.03, 10, 32), [defaultStem]);
  const bigLeafGeometry = useMemo(() => createLeafGeometry(0.85, 0.32, 0.25, 10, 16), []);

  // Tulip has 6 cupped tepals: 3 inner, 3 outer
  const tepals = useMemo(() => {
    const items = [];
    // 3 inner tepals
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const geom = createProceduralPetalGeometry({
        length: 0.65,
        width: 0.42,
        curvature: 0.75,
        cupDepth: 0.55,
        ruffleIntensity: 0.04,
        ruffleFrequency: 3,
        randomSeed: i * 5.5,
      });
      items.push({ angle, geom, radius: 0.08, isInner: true });
    }
    // 3 outer tepals
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + Math.PI / 3;
      const geom = createProceduralPetalGeometry({
        length: 0.72,
        width: 0.46,
        curvature: 0.65,
        cupDepth: 0.48,
        ruffleIntensity: 0.05,
        ruffleFrequency: 3.5,
        randomSeed: i * 8.3 + 2,
      });
      items.push({ angle, geom, radius: 0.12, isInner: false });
    }
    return items;
  }, []);

  useFrame(({ clock }) => {
    if (headRef.current) {
      const t = clock.getElapsedTime();
      headRef.current.rotation.x = rotation[0] + Math.cos(t * 1.2) * 0.02;
      headRef.current.rotation.y = rotation[1];
      headRef.current.rotation.z = rotation[2] + Math.sin(t * 0.9 + 1.5) * 0.025;
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
      {/* Graceful Stem */}
      <mesh geometry={stemGeometry} castShadow>
        <meshStandardMaterial color={colors.stem} roughness={0.65} />
      </mesh>

      {/* Broad Tulip Leaf emerging above paper wrap */}
      <group position={[-0.45, -0.10, -0.12]} rotation={[0.2, -0.5, 0.4]}>
        <mesh geometry={bigLeafGeometry} castShadow>
          <meshStandardMaterial color={colors.leaf} roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Flower Head with dedicated rotation orientation */}
      <group ref={headRef} position={tipPos}>
        {/* Pistil & Stamen core */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.025, 0.02, 0.18, 6]} />
          <meshStandardMaterial color={colors.center} roughness={0.3} />
        </mesh>

        {/* 6 Cupped Chalice Tepals */}
        {tepals.map((tepal, idx) => {
          const openTilt = (tepal.isInner ? 0.35 : 0.48) + bloom * 0.35;
          return (
            <mesh
              key={idx}
              geometry={tepal.geom}
              rotation={[-Math.cos(tepal.angle) * openTilt, tepal.angle, Math.sin(tepal.angle) * openTilt]}
              position={[Math.sin(tepal.angle) * tepal.radius, 0, Math.cos(tepal.angle) * tepal.radius]}
              castShadow
            >
              <meshStandardMaterial
                color={tepal.isInner ? colors.secondary : colors.primary}
                roughness={0.38}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
