import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createProceduralPetalGeometry } from './math/proceduralPetal';
import { createStemGeometry, createLeafGeometry } from './math/proceduralStem';

interface YellowBouquetProps {
  bloomProgress: number;     // 0 to 1
  revealedCount: number;     // 1 to 5 progressive appearance
  onFlowerClick?: (flowerName: string) => void;
}

export const YellowBouquet: React.FC<YellowBouquetProps> = ({
  bloomProgress = 1,
  revealedCount = 5,
  onFlowerClick,
}) => {
  const bouquetGroupRef = useRef<THREE.Group>(null);

  // Palettes of yellow: soft yellow, warm gold, cream yellow, tender spring leaves
  const colors = useMemo(() => ({
    warmYellow: '#fed049',
    lemonCream: '#fff3b0',
    goldenAmber: '#fdb827',
    butterSoft: '#ffea79',
    sunlitWhite: '#fffdf0',
    centerDeep: '#e69500',
    freshStem: '#3a5335',
    tenderLeaf: '#4a6741',
  }), []);

  // 1. Stems for the yellow bouquet arrangement
  const stem1 = useMemo(() => createStemGeometry([
    [0, -2.4, 0],
    [0.02, -1.5, 0.02],
    [0, -0.6, 0.05],
    [0, 0.1, 0.1],
  ], 0.048, 0.032, 10, 32), []);

  const stem2 = useMemo(() => createStemGeometry([
    [0.05, -2.4, 0.05],
    [0.35, -1.4, 0.1],
    [0.65, -0.4, 0.2],
    [0.85, 0.3, 0.25],
  ], 0.04, 0.025, 8, 30), []);

  const stem3 = useMemo(() => createStemGeometry([
    [-0.05, -2.4, -0.05],
    [-0.35, -1.4, -0.05],
    [-0.6, -0.4, 0.05],
    [-0.75, 0.45, 0.1],
  ], 0.04, 0.025, 8, 30), []);

  const stem4 = useMemo(() => createStemGeometry([
    [-0.02, -2.4, 0.02],
    [-0.15, -1.2, -0.1],
    [-0.25, 0.1, -0.2],
    [-0.3, 0.95, -0.25],
  ], 0.038, 0.022, 8, 30), []);

  const stem5 = useMemo(() => createStemGeometry([
    [0.02, -2.4, -0.02],
    [0.15, -1.2, -0.1],
    [0.3, 0.2, -0.2],
    [0.35, 1.05, -0.25],
  ], 0.038, 0.022, 8, 30), []);

  const leafGeom = useMemo(() => createLeafGeometry(0.55, 0.22, 0.35, 10, 14), []);

  // 2. Central Golden Ranunculus / Yellow Peony Petals
  const centralPetals = useMemo(() => {
    const list: { angle: number; r: number; tilt: number; geom: THREE.BufferGeometry; col: string }[] = [];
    const tiers = [
      { count: 7, r: 0.05, len: 0.32, wid: 0.24, cur: 0.25, cup: 0.28, tilt: 0.25, col: colors.goldenAmber },
      { count: 9, r: 0.10, len: 0.45, wid: 0.34, cur: 0.30, cup: 0.26, tilt: 0.42, col: colors.warmYellow },
      { count: 11, r: 0.17, len: 0.58, wid: 0.46, cur: 0.32, cup: 0.22, tilt: 0.60, col: colors.butterSoft },
      { count: 10, r: 0.25, len: 0.72, wid: 0.56, cur: 0.26, cup: 0.18, tilt: 0.78, col: colors.lemonCream },
    ];
    let seed = 100;
    tiers.forEach((tier, tIdx) => {
      for (let i = 0; i < tier.count; i++) {
        seed++;
        const angle = i * ((Math.PI * 2) / tier.count) + tIdx * 2.399;
        const geom = createProceduralPetalGeometry({
          length: tier.len,
          width: tier.wid,
          curvature: tier.cur,
          cupDepth: tier.cup,
          ruffleIntensity: 0.03,
          randomSeed: seed,
        });
        list.push({ angle, r: tier.r, tilt: tier.tilt, geom, col: tier.col });
      }
    });
    return list;
  }, [colors]);

  // 3. Daffodil / Narcissus (Flower 2, right side)
  const narcissusTepals = useMemo(() => {
    const list: { angle: number; geom: THREE.BufferGeometry }[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const geom = createProceduralPetalGeometry({
        length: 0.55,
        width: 0.30,
        curvature: 0.15,
        cupDepth: 0.16,
        ruffleIntensity: 0.02,
        randomSeed: i * 11.3,
      });
      list.push({ angle, geom });
    }
    return list;
  }, []);

  // 4. Yellow Spring Tulip (Flower 3, left side)
  const tulipTepals = useMemo(() => {
    const list: { angle: number; isInner: boolean; geom: THREE.BufferGeometry }[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + (i % 2 === 0 ? 0 : Math.PI / 6);
      const isInner = i % 2 === 0;
      const geom = createProceduralPetalGeometry({
        length: 0.65,
        width: 0.42,
        curvature: 0.55,
        cupDepth: 0.40,
        ruffleIntensity: 0.02,
        randomSeed: i * 14.7 + 3,
      });
      list.push({ angle, isInner, geom });
    }
    return list;
  }, []);

  // 5. Golden Mimosa floral bursts (Flowers 4 & 5)
  const mimosaBursts = useMemo(() => {
    const points = [];
    for (let i = 0; i < 36; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.15 + Math.random() * 0.35;
      points.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi) * 0.7 + 0.1,
          r * Math.sin(phi) * Math.sin(theta),
        ] as [number, number, number],
        size: 0.035 + Math.random() * 0.025,
        color: Math.random() > 0.4 ? colors.warmYellow : colors.goldenAmber,
      });
    }
    return points;
  }, [colors]);

  // Gentle spring wind sway
  useFrame(({ clock }) => {
    if (bouquetGroupRef.current) {
      const t = clock.getElapsedTime();
      bouquetGroupRef.current.rotation.z = Math.sin(t * 0.9) * 0.025;
      bouquetGroupRef.current.rotation.x = Math.cos(t * 0.8) * 0.018;
      bouquetGroupRef.current.rotation.y = Math.sin(t * 0.4) * 0.012;
    }
  });

  const bloom = Math.max(0.01, Math.min(1, bloomProgress));

  return (
    <group ref={bouquetGroupRef} position={[0, -0.35, 0]}>
      {/* 1. Protagonist: Central Golden Ranunculus / Yellow Peony */}
      {revealedCount >= 1 && (
        <group onClick={() => onFlowerClick?.('Peonía Dorada')}>
          <mesh geometry={stem1} castShadow>
            <meshStandardMaterial color={colors.freshStem} roughness={0.65} />
          </mesh>
          <group position={[0.02, -0.8, 0.03]} rotation={[0.3, 0.7, -0.2]}>
            <mesh geometry={leafGeom} castShadow>
              <meshStandardMaterial color={colors.tenderLeaf} roughness={0.5} side={THREE.DoubleSide} />
            </mesh>
          </group>

          <group position={[0, 0.15, 0.1]} scale={bloom}>
            {/* Center golden heart */}
            <mesh position={[0, 0.04, 0]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color={colors.centerDeep} roughness={0.35} emissive={colors.centerDeep} emissiveIntensity={0.25} />
            </mesh>
            {/* Layers of golden petals */}
            {centralPetals.map((p, idx) => {
              const openTilt = p.tilt * bloom;
              return (
                <mesh
                  key={idx}
                  geometry={p.geom}
                  position={[Math.cos(p.angle) * p.r * bloom, 0.02, Math.sin(p.angle) * p.r * bloom]}
                  rotation={[-Math.sin(p.angle) * openTilt, -p.angle - Math.PI / 2, Math.cos(p.angle) * openTilt]}
                  castShadow
                >
                  <meshStandardMaterial
                    color={p.col}
                    roughness={0.36}
                    metalness={0.02}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              );
            })}
          </group>
        </group>
      )}

      {/* 2. Daffodil / Narcissus (Warm golden corona) */}
      {revealedCount >= 2 && (
        <group onClick={() => onFlowerClick?.('Narciso de Primavera')}>
          <mesh geometry={stem2} castShadow>
            <meshStandardMaterial color={colors.freshStem} roughness={0.65} />
          </mesh>
          <group position={[0.4, -1.0, 0.1]} rotation={[0.4, 0.5, -0.3]}>
            <mesh geometry={leafGeom} scale={0.9} castShadow>
              <meshStandardMaterial color={colors.tenderLeaf} roughness={0.5} side={THREE.DoubleSide} />
            </mesh>
          </group>

          <group position={[0.85, 0.35, 0.25]} rotation={[0.3, 0.4, -0.2]} scale={bloom * 0.9}>
            {/* Central trumpet corona */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.09, 0.05, 0.18, 16, 1, true]} />
              <meshStandardMaterial color={colors.goldenAmber} roughness={0.35} side={THREE.DoubleSide} />
            </mesh>
            {/* 6 Starry Tepals */}
            {narcissusTepals.map((p, idx) => {
              const tilt = 1.35 * bloom;
              return (
                <mesh
                  key={idx}
                  geometry={p.geom}
                  position={[Math.cos(p.angle) * 0.05, 0.02, Math.sin(p.angle) * 0.05]}
                  rotation={[-Math.sin(p.angle) * tilt, -p.angle - Math.PI / 2, Math.cos(p.angle) * tilt]}
                  castShadow
                >
                  <meshStandardMaterial color={colors.lemonCream} roughness={0.35} side={THREE.DoubleSide} />
                </mesh>
              );
            })}
          </group>
        </group>
      )}

      {/* 3. Yellow Tulip (Left side) */}
      {revealedCount >= 3 && (
        <group onClick={() => onFlowerClick?.('Tulipán Dorado')}>
          <mesh geometry={stem3} castShadow>
            <meshStandardMaterial color={colors.freshStem} roughness={0.65} />
          </mesh>
          <group position={[-0.4, -0.9, 0.05]} rotation={[0.3, -0.6, 0.3]}>
            <mesh geometry={leafGeom} scale={1.2} castShadow>
              <meshStandardMaterial color={colors.tenderLeaf} roughness={0.5} side={THREE.DoubleSide} />
            </mesh>
          </group>

          <group position={[-0.75, 0.5, 0.1]} rotation={[-0.2, -0.3, 0.2]} scale={bloom * 0.92}>
            {tulipTepals.map((p, idx) => {
              const tilt = (p.isInner ? 0.32 : 0.45) + bloom * 0.25;
              const radius = p.isInner ? 0.07 : 0.11;
              return (
                <mesh
                  key={idx}
                  geometry={p.geom}
                  position={[Math.cos(p.angle) * radius, 0, Math.sin(p.angle) * radius]}
                  rotation={[-Math.sin(p.angle) * tilt, -p.angle - Math.PI / 2, Math.cos(p.angle) * tilt]}
                  castShadow
                >
                  <meshStandardMaterial
                    color={p.isInner ? colors.warmYellow : colors.butterSoft}
                    roughness={0.38}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              );
            })}
          </group>
        </group>
      )}

      {/* 4. Golden Mimosa Sprig (Upper left) */}
      {revealedCount >= 4 && (
        <group position={[-0.3, 1.0, -0.25]} scale={bloom}>
          <mesh geometry={stem4} position={[0.3, -1.0, 0.25]} castShadow>
            <meshStandardMaterial color={colors.freshStem} roughness={0.7} />
          </mesh>
          {mimosaBursts.map((b, idx) => (
            <mesh key={`m1-${idx}`} position={b.pos} scale={bloom}>
              <sphereGeometry args={[b.size, 8, 8]} />
              <meshStandardMaterial color={b.color} roughness={0.4} emissive={b.color} emissiveIntensity={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* 5. Golden Mimosa Sprig (Upper right) */}
      {revealedCount >= 5 && (
        <group position={[0.35, 1.1, -0.25]} scale={bloom}>
          <mesh geometry={stem5} position={[-0.35, -1.1, 0.25]} castShadow>
            <meshStandardMaterial color={colors.freshStem} roughness={0.7} />
          </mesh>
          {mimosaBursts.map((b, idx) => (
            <mesh key={`m2-${idx}`} position={[b.pos[0] * 0.9, b.pos[1] * 0.9, b.pos[2] * 0.9]} scale={bloom}>
              <sphereGeometry args={[b.size * 0.9, 8, 8]} />
              <meshStandardMaterial color={b.color} roughness={0.4} emissive={b.color} emissiveIntensity={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* Spring golden ribbon at the waist */}
      <group position={[0, -2.1, 0]} rotation={[0.08, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.17, 0.035, 12, 32]} />
          <meshStandardMaterial color="#c2a649" roughness={0.6} metalness={0.15} />
        </mesh>
      </group>
    </group>
  );
};
