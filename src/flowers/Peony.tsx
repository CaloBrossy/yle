import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createProceduralPetalGeometry } from './math/proceduralPetal';
import { createStemGeometry, createLeafGeometry } from './math/proceduralStem';
import { FLOWERS_DATA } from '../data/flowersData';

interface PeonyProps {
  bloomProgress: number;          // 0 (closed bud) to 1 (full romantic bloom)
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  interactive?: boolean;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  showStem?: boolean;
  stemGrowProgress?: number;      // 0 to 1 for stem upward birth
  isBouquetMode?: boolean;
}

interface PetalConfig {
  geometry: THREE.BufferGeometry;
  layerIndex: number;
  theta: number;
  closedRadius: number;
  openRadius: number;
  closedHeight: number;
  openHeight: number;
  closedTilt: number;             // Radians from vertical
  openTilt: number;
  yawOffset: number;              // Subtle organic azimuth adjustment (±3°)
  rollOffset: number;             // Subtle tilt variance
  baseScale: number;
  bloomStart: number;
  bloomEnd: number;
  color: THREE.Color;
  roughness: number;
}

export const Peony: React.FC<PeonyProps> = ({
  bloomProgress = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  onPointerOver,
  onPointerOut,
  showStem = true,
  stemGrowProgress = 1,
  isBouquetMode = false,
}) => {
  const flowerGroupRef = useRef<THREE.Group>(null);
  const stemMeshRef = useRef<THREE.Mesh>(null);
  const petalMeshesRef = useRef<(THREE.Mesh | null)[]>([]);

  const colors = FLOWERS_DATA.peony.colorPalette;

  // 1. Procedural Stem and Calyx
  const stemPoints: [number, number, number][] = useMemo(() => [
    [0, -2.4, -0.06],
    [0.03, -1.6, -0.02],
    [-0.02, -0.8, 0.04],
    [0.01, -0.2, 0.06],
    [0, 0, 0.08],
  ], []);

  const stemGeometry = useMemo(() => {
    return createStemGeometry(stemPoints, 0.05, 0.035, 12, 36);
  }, [stemPoints]);

  const leafGeometry = useMemo(() => {
    return createLeafGeometry(0.5, 0.22, 0.32, 10, 14);
  }, []);

  // 2. Structured Botanical Layers for the Peony
  // Exterior: large, broad, open outward gracefully
  // Mid: medium, more vertical, gently cupped
  // Interior: small, dense, compressed center
  const petalInstances = useMemo(() => {
    const instances: PetalConfig[] = [];
    const goldenAngle = 2.39996323; // ~137.5 degrees

    const tiers = [
      // Tier 0: Deep compact spiral core (dense center, vertical)
      { count: 8, radiusC: 0.035, radiusO: 0.06, heightC: 0.02, heightO: 0.04, length: 0.32, width: 0.24, curve: 0.22, cup: 0.30, ruffle: 0.01, closeTilt: 0.06, openTilt: 0.22, startB: 0.45, endB: 1.0, col: colors.deep },
      // Tier 1: Inner whorl (hugging the heart)
      { count: 10, radiusC: 0.065, radiusO: 0.11, heightC: 0.01, heightO: 0.035, length: 0.46, width: 0.34, curve: 0.28, cup: 0.28, ruffle: 0.02, closeTilt: 0.12, openTilt: 0.36, startB: 0.35, endB: 0.90, col: colors.secondary },
      // Tier 2: Mid-inner petals (voluptuous body)
      { count: 12, radiusC: 0.11, radiusO: 0.18, heightC: 0.0, heightO: 0.025, length: 0.62, width: 0.46, curve: 0.32, cup: 0.25, ruffle: 0.03, closeTilt: 0.18, openTilt: 0.52, startB: 0.22, endB: 0.80, col: colors.primary },
      // Tier 3: Mid-outer petals
      { count: 12, radiusC: 0.16, radiusO: 0.25, heightC: -0.01, heightO: 0.015, length: 0.74, width: 0.56, curve: 0.30, cup: 0.22, ruffle: 0.035, closeTilt: 0.24, openTilt: 0.68, startB: 0.10, endB: 0.70, col: colors.primary },
      // Tier 4: Outer guard petals (broad, open, gentle reflex)
      { count: 10, radiusC: 0.22, radiusO: 0.33, heightC: -0.02, heightO: 0.005, length: 0.86, width: 0.68, curve: 0.25, cup: 0.18, ruffle: 0.035, closeTilt: 0.30, openTilt: 0.82, startB: 0.0, endB: 0.60, col: colors.subsurface },
    ];

    let seedCounter = 1;

    tiers.forEach((tier, tierIdx) => {
      for (let i = 0; i < tier.count; i++) {
        seedCounter++;
        // Base azimuthal angle with golden angle progression
        const baseAngle = i * ((Math.PI * 2) / tier.count) + tierIdx * goldenAngle;
        
        // Controlled, subtle deterministic variations:
        // Scale ±4%
        const scaleVar = 1.0 + (Math.sin(seedCounter * 12.3) * 0.04);
        // Angle ±3° (0.05 rad)
        const yawVar = Math.sin(seedCounter * 7.7) * 0.05;
        // Tilt ±3° (0.05 rad)
        const rollVar = Math.cos(seedCounter * 5.1) * 0.04;

        const geom = createProceduralPetalGeometry({
          length: tier.length * scaleVar,
          width: tier.width * scaleVar,
          curvature: tier.curve,
          cupDepth: tier.cup,
          ruffleIntensity: tier.ruffle,
          ruffleFrequency: 3.5,
          tipNotch: 0.04,
          randomSeed: seedCounter * 31.7,
        });

        const petalCol = new THREE.Color(tier.col);
        petalCol.offsetHSL(0, 0, Math.sin(seedCounter * 3) * 0.02);

        instances.push({
          geometry: geom,
          layerIndex: tierIdx,
          theta: baseAngle,
          closedRadius: tier.radiusC,
          openRadius: tier.radiusO,
          closedHeight: tier.heightC,
          openHeight: tier.heightO,
          closedTilt: tier.closeTilt,
          openTilt: tier.openTilt,
          yawOffset: yawVar,
          rollOffset: rollVar,
          baseScale: scaleVar,
          bloomStart: tier.startB,
          bloomEnd: tier.endB,
          color: petalCol,
          roughness: 0.36 + tierIdx * 0.02,
        });
      }
    });

    return instances;
  }, [colors]);

  // 3. Central Stamens with golden pollen tips
  const stamens = useMemo(() => {
    const list: { pos: [number, number, number]; rot: [number, number, number]; height: number }[] = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const theta = i * 2.39996;
      const r = 0.015 + Math.sqrt(i / count) * 0.07;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const y = 0.07 - r * 0.2;
      const tilt = r * 1.8;
      list.push({
        pos: [x, y, z],
        rot: [Math.sin(theta) * tilt, theta, Math.cos(theta) * tilt],
        height: 0.12 + Math.sin(i * 3.5) * 0.025,
      });
    }
    return list;
  }, []);

  // 4. Sepals (Calyx green base support)
  const sepals = useMemo(() => {
    const list: { geom: THREE.BufferGeometry; rot: [number, number, number] }[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const geom = createLeafGeometry(0.32, 0.15, 0.45, 8, 10);
      list.push({
        geom,
        rot: [-Math.cos(angle) * 1.1, angle + Math.PI, Math.sin(angle) * 1.1],
      });
    }
    return list;
  }, []);

  // Materials
  const stemMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(colors.stem),
    roughness: 0.65,
    metalness: 0.04,
    side: THREE.DoubleSide,
  }), [colors.stem]);

  const leafMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(colors.leaf),
    roughness: 0.52,
    metalness: 0.06,
    side: THREE.DoubleSide,
  }), [colors.leaf]);

  const stamenMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(colors.center),
    roughness: 0.4,
    metalness: 0.15,
    emissive: new THREE.Color('#d4a017'),
    emissiveIntensity: 0.2,
  }), [colors.center]);

  // Frame Loop: Smooth blooming and air movement
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Gentle organic breathing / wind
    if (flowerGroupRef.current) {
      const windX = Math.sin(t * 0.85 + position[0]) * 0.025;
      const windZ = Math.cos(t * 0.7 + position[2]) * 0.02;
      const windY = Math.sin(t * 0.4) * 0.01;

      flowerGroupRef.current.rotation.x = rotation[0] + windX;
      flowerGroupRef.current.rotation.z = rotation[2] + windZ;
      flowerGroupRef.current.rotation.y = rotation[1] + windY;
    }

    // Unfold petals cleanly in their local reference frames
    petalInstances.forEach((petal, idx) => {
      const mesh = petalMeshesRef.current[idx];
      if (!mesh) return;

      const { bloomStart, bloomEnd } = petal;
      let rawT = (bloomProgress - bloomStart) / Math.max(0.001, bloomEnd - bloomStart);
      rawT = Math.max(0, Math.min(1, rawT));
      // Smooth cubic ease
      const easeT = rawT * rawT * (3 - 2 * rawT);

      // Interpolate radius and height
      const currentRadius = THREE.MathUtils.lerp(petal.closedRadius, petal.openRadius, easeT);
      const currentHeight = THREE.MathUtils.lerp(petal.closedHeight, petal.openHeight, easeT);

      const angle = petal.theta + petal.yawOffset;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      mesh.position.set(
        cosA * currentRadius,
        currentHeight,
        sinA * currentRadius
      );

      // Clean local rotation:
      // Y-axis faces radially outward: (-angle - Math.PI / 2)
      // X-axis tilts outward: currentTilt
      const currentTilt = THREE.MathUtils.lerp(petal.closedTilt, petal.openTilt, easeT);
      const flutter = Math.sin(t * 1.6 + idx * 0.5) * 0.012 * easeT;

      mesh.rotation.order = 'YXZ';
      mesh.rotation.set(
        currentTilt + flutter,
        Math.PI / 2 - angle,
        petal.rollOffset
      );

      const scaleF = petal.baseScale * (0.65 + 0.35 * easeT);
      mesh.scale.set(scaleF, scaleF, scaleF);
    });

    if (stemMeshRef.current) {
      const grow = Math.max(0.001, Math.min(1, stemGrowProgress));
      stemMeshRef.current.scale.set(1, grow, 1);
    }
  });

  return (
    <group
      ref={flowerGroupRef}
      position={position}
      scale={scale}
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
      {/* Procedural Stem & Foliage */}
      {showStem && (
        <group>
          <mesh
            ref={stemMeshRef}
            geometry={stemGeometry}
            material={stemMaterial}
            castShadow
            receiveShadow
          />
          {/* Leaves along the stem (arranged gracefully above wrapping in bouquet mode) */}
          {isBouquetMode ? (
            <>
              <group position={[0.02, -0.22, 0.03]} rotation={[0.3, 0.7, -0.2]}>
                <mesh geometry={leafGeometry} material={leafMaterial} castShadow />
              </group>
              <group position={[-0.02, -0.36, -0.02]} rotation={[-0.25, -1.1, 0.25]}>
                <mesh geometry={leafGeometry} material={leafMaterial} scale={0.9} castShadow />
              </group>
            </>
          ) : (
            <>
              <group position={[0.02, -0.7 * stemGrowProgress, 0.03]} rotation={[0.3, 0.7, -0.2]}>
                <mesh geometry={leafGeometry} material={leafMaterial} castShadow />
              </group>
              <group position={[-0.02, -1.3 * stemGrowProgress, -0.02]} rotation={[-0.25, -1.1, 0.25]}>
                <mesh geometry={leafGeometry} material={leafMaterial} scale={1.1} castShadow />
              </group>
              <group position={[0.03, -1.85 * stemGrowProgress, 0.02]} rotation={[0.2, 2.0, -0.3]}>
                <mesh geometry={leafGeometry} material={leafMaterial} scale={0.9} castShadow />
              </group>
            </>
          )}
        </group>
      )}

      {/* Flower Blossom Head */}
      <group position={[0, 0.06, 0.08]}>
        {/* Calyx / Sepals */}
        {sepals.map((sepal, idx) => (
          <mesh
            key={`sepal-${idx}`}
            geometry={sepal.geom}
            material={stemMaterial}
            rotation={sepal.rot}
            position={[0, -0.02, 0]}
            scale={0.7}
          />
        ))}

        {/* Central Golden Stamens */}
        <group scale={0.3 + 0.7 * Math.min(1, bloomProgress * 1.2)}>
          {stamens.map((stamen, idx) => (
            <group key={`stamen-${idx}`} position={stamen.pos} rotation={stamen.rot}>
              <mesh position={[0, stamen.height * 0.5, 0]}>
                <cylinderGeometry args={[0.0035, 0.005, stamen.height, 5]} />
                <primitive object={stamenMaterial} attach="material" />
              </mesh>
              <mesh position={[0, stamen.height, 0]}>
                <sphereGeometry args={[0.011, 7, 7]} />
                <primitive object={stamenMaterial} attach="material" />
              </mesh>
            </group>
          ))}
        </group>

        {/* The Clean, Unbroken Peony Petals */}
        {petalInstances.map((petal, idx) => (
          <mesh
            key={`peony-petal-${idx}`}
            ref={(el) => {
              petalMeshesRef.current[idx] = el;
            }}
            geometry={petal.geometry}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={petal.color}
              roughness={petal.roughness}
              metalness={0.02}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
