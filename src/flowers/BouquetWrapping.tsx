import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface BouquetWrappingProps {
  progress?: number; // 0 to 1 reveal animation
}

/**
 * Procedural Artisan Bouquet Paper Wrap
 * Wraps the stems together in a layered florist paper cone with kraft paper,
 * soft inner tissue paper, and a satin ribbon knot with draping tails.
 */
export const BouquetWrapping: React.FC<BouquetWrappingProps> = ({ progress = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);

  // 1. Procedural ribbon curve geometry
  const { ribbonGeomLeft, ribbonGeomRight } = useMemo(() => {
    // Left draping ribbon tail
    const leftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0.24),
      new THREE.Vector3(-0.06, -0.25, 0.26),
      new THREE.Vector3(-0.12, -0.65, 0.22),
      new THREE.Vector3(-0.09, -1.05, 0.16),
    ]);
    const ribbonGeomLeft = new THREE.TubeGeometry(leftCurve, 24, 0.022, 8, false);

    // Right draping ribbon tail
    const rightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0.24),
      new THREE.Vector3(0.08, -0.28, 0.25),
      new THREE.Vector3(0.14, -0.7, 0.20),
      new THREE.Vector3(0.11, -1.15, 0.14),
    ]);
    const ribbonGeomRight = new THREE.TubeGeometry(rightCurve, 24, 0.02, 8, false);

    return { ribbonGeomLeft, ribbonGeomRight };
  }, []);

  // 2. Materials
  const materials = useMemo(() => {
    // Outer natural textured kraft paper
    const outerKraft = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#b89d82'), // Warm natural kraft paper
      roughness: 0.92,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // Secondary folded craft paper flap (slightly darker shade for depth)
    const foldKraft = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a88b70'),
      roughness: 0.95,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // Soft inner delicate tissue lining (creamy off-white)
    const innerTissue = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f2ece1'),
      roughness: 0.85,
      metalness: 0.01,
      side: THREE.DoubleSide,
    });

    // Warm champagne silk satin ribbon
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#dfc39a'),
      roughness: 0.38,
      metalness: 0.22,
    });

    return { outerKraft, foldKraft, innerTissue, ribbonMaterial };
  }, []);

  // Smooth entrance animation
  useFrame(() => {
    if (groupRef.current) {
      const p = Math.max(0.001, Math.min(1, progress));
      // Ease out cubic
      const ease = 1 - Math.pow(1 - p, 3);
      groupRef.current.scale.set(ease, ease, ease);
      groupRef.current.position.y = -1.40 + (1 - ease) * -0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.40, 0]}>
      {/* 1. Main outer kraft paper cone */}
      {/* Top radius: 0.75, Bottom radius: 0.26, Height: 1.85 */}
      <mesh
        position={[0, 0, 0]}
        rotation={[0.08, 0, 0]}
        material={materials.outerKraft}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.75, 0.26, 1.85, 36, 1, true]} />
      </mesh>

      {/* 2. Delicate inner tissue paper peaking out at the top */}
      <mesh
        position={[0, 0.14, 0]}
        rotation={[0.08, 0.45, 0]}
        material={materials.innerTissue}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.78, 0.27, 1.75, 36, 1, true]} />
      </mesh>

      {/* 3. Angled front folding flap (the classic artisanal florist fold) */}
      <group position={[0.02, 0.04, 0.04]} rotation={[0.12, -0.3, 0.08]}>
        <mesh material={materials.foldKraft} castShadow receiveShadow>
          <cylinderGeometry
            args={[0.76, 0.265, 1.80, 24, 1, true, -Math.PI * 0.45, Math.PI * 0.9]}
          />
        </mesh>
      </group>

      {/* 4. Second asymmetric wrap flap */}
      <group position={[-0.03, 0.06, 0.03]} rotation={[0.05, 0.5, -0.06]}>
        <mesh material={materials.outerKraft} castShadow receiveShadow>
          <cylinderGeometry
            args={[0.77, 0.268, 1.82, 24, 1, true, Math.PI * 0.25, Math.PI * 0.85]}
          />
        </mesh>
      </group>

      {/* 5. Satin Ribbon & Bow at the bouquet waist */}
      <group position={[0, -0.35, 0]} rotation={[0.08, 0, 0]}>
        {/* Main Ribbon Ring */}
        <mesh position={[0, 0, 0]} material={materials.ribbonMaterial} castShadow>
          <torusGeometry args={[0.33, 0.04, 16, 40]} />
        </mesh>

        {/* Central Bow Knot */}
        <mesh position={[0, 0, 0.34]} material={materials.ribbonMaterial} castShadow>
          <sphereGeometry args={[0.055, 16, 16]} />
        </mesh>

        {/* Bow Loop Left */}
        <mesh
          position={[-0.09, 0.02, 0.35]}
          rotation={[0.2, 0.4, 0.3]}
          material={materials.ribbonMaterial}
          castShadow
        >
          <torusGeometry args={[0.075, 0.025, 12, 24]} />
        </mesh>

        {/* Bow Loop Right */}
        <mesh
          position={[0.09, 0.02, 0.35]}
          rotation={[0.2, -0.4, -0.3]}
          material={materials.ribbonMaterial}
          castShadow
        >
          <torusGeometry args={[0.075, 0.025, 12, 24]} />
        </mesh>

        {/* Draping Ribbon Tail Left */}
        <mesh geometry={ribbonGeomLeft} material={materials.ribbonMaterial} castShadow />

        {/* Draping Ribbon Tail Right */}
        <mesh geometry={ribbonGeomRight} material={materials.ribbonMaterial} castShadow />
      </group>
    </group>
  );
};
