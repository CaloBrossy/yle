import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createStemGeometry } from './math/proceduralStem';
import { FLOWERS_DATA } from '../data/flowersData';

interface GypsophilaProps {
  bloomProgress?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  stemCurve?: [number, number, number][];
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export const Gypsophila: React.FC<GypsophilaProps> = ({
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
  const colors = FLOWERS_DATA.gypsophila.colorPalette;

  const defaultStem: [number, number, number][] = useMemo(() => stemCurve || [
    [0.0, -2.4, -0.02],
    [0.0, -1.4, -0.06],
    [0.0, -0.45, -0.14],
    [0.0, 0.45, -0.25],
    [0.0, 1.25, -0.35],
  ], [stemCurve]);

  const mainStemGeometry = useMemo(() => createStemGeometry(defaultStem, 0.025, 0.015, 6, 24), [defaultStem]);

  // Cloud spray of tiny florets on delicate branched twigs
  const florets = useMemo(() => {
    const items = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.25 + Math.random() * 0.45;

      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = (r * Math.cos(phi)) * 0.6 + 0.1;
      const z = (r * sinPhi * Math.sin(theta)) * 0.7;

      items.push({
        pos: [x, y, z] as [number, number, number],
        size: 0.025 + Math.random() * 0.02,
      });
    }
    return items;
  }, []);

  useFrame(({ clock }) => {
    if (headRef.current) {
      const t = clock.getElapsedTime();
      headRef.current.rotation.x = rotation[0] + Math.cos(t * 0.85) * 0.015;
      headRef.current.rotation.y = rotation[1];
      headRef.current.rotation.z = rotation[2] + Math.sin(t * 1.05 + 0.4) * 0.02;
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
      {/* Delicate central branch stem */}
      <mesh geometry={mainStemGeometry} castShadow>
        <meshStandardMaterial color={colors.stem} roughness={0.7} />
      </mesh>

      {/* Cloud of starry button blossoms with dedicated rotation orientation */}
      <group ref={headRef} position={tipPos}>
        {florets.map((floret, idx) => (
          <group key={idx} position={floret.pos} scale={bloom}>
            {/* Tiny fine connector wire to center */}
            <mesh position={[-floret.pos[0] * 0.3, -floret.pos[1] * 0.3, -floret.pos[2] * 0.3]}>
              <cylinderGeometry args={[0.003, 0.003, 0.1, 4]} />
              <meshStandardMaterial color={colors.stem} roughness={0.8} />
            </mesh>
            {/* Tiny floret */}
            <mesh castShadow>
              <sphereGeometry args={[floret.size, 6, 6]} />
              <meshStandardMaterial
                color={colors.primary}
                roughness={0.4}
                emissive={colors.primary}
                emissiveIntensity={0.12}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
