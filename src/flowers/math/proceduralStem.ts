import * as THREE from 'three';

/**
 * Creates a procedural stem tube geometry from a 3D spline curve
 * with natural tapering and organic slight irregularities.
 */
export function createStemGeometry(
  points: [number, number, number][],
  baseRadius: number = 0.045,
  tipRadius: number = 0.03,
  radialSegments: number = 10,
  tubularSegments: number = 32
): THREE.BufferGeometry {
  const vPoints = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
  const curve = new THREE.CatmullRomCurve3(vPoints, false, 'centripetal');

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const frames = curve.computeFrenetFrames(tubularSegments, false);

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const point = curve.getPointAt(t);
    const radius = THREE.MathUtils.lerp(baseRadius, tipRadius, t);
    
    // Add micro organic bumps along stem
    const bump = 1.0 + Math.sin(t * 30.0) * 0.04;

    const normal = frames.normals[i];
    const binormal = frames.binormals[i];

    for (let j = 0; j <= radialSegments; j++) {
      const theta = (j / radialSegments) * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);

      const vx = cos * normal.x + sin * binormal.x;
      const vy = cos * normal.y + sin * binormal.y;
      const vz = cos * normal.z + sin * binormal.z;

      const px = point.x + vx * radius * bump;
      const py = point.y + vy * radius * bump;
      const pz = point.z + vz * radius * bump;

      positions.push(px, py, pz);
      normals.push(vx, vy, vz);
      uvs.push(j / radialSegments, t);
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const p1 = i * (radialSegments + 1) + j;
      const p2 = p1 + 1;
      const p3 = (i + 1) * (radialSegments + 1) + j;
      const p4 = p3 + 1;

      indices.push(p1, p3, p2);
      indices.push(p2, p3, p4);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates an organic curved leaf geometry with longitudinal spine fold
 */
export function createLeafGeometry(
  length: number = 0.45,
  width: number = 0.22,
  curvature: number = 0.35,
  segmentsU: number = 10,
  segmentsV: number = 14
): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let v = 0; v <= segmentsV; v++) {
    const tV = v / segmentsV;
    // Width envelope: narrow stem attach, widest around 45%, pointed tip
    const wFactor = Math.sin(Math.PI * Math.pow(tV, 0.6)) * (1 - tV * 0.4);
    const currWidth = width * Math.max(0.01, wFactor);

    // Arching arch along leaf spine
    const y = tV * length;
    const zArch = -Math.sin(tV * Math.PI * 0.8) * curvature * length;

    for (let u = 0; u <= segmentsU; u++) {
      const tU = u / segmentsU;
      const normU = (tU - 0.5) * 2; // -1 to 1

      // Central vein fold (V-shape crevice down middle)
      const veinV = Math.abs(normU) * 0.05 * length;

      const posX = normU * currWidth * 0.5;
      const posY = y;
      const posZ = zArch + veinV;

      positions.push(posX, posY, posZ);
      normals.push(0, 1, 0);
      uvs.push(tU, tV);
    }
  }

  for (let v = 0; v < segmentsV; v++) {
    for (let u = 0; u < segmentsU; u++) {
      const p1 = v * (segmentsU + 1) + u;
      const p2 = p1 + 1;
      const p3 = (v + 1) * (segmentsU + 1) + u;
      const p4 = p3 + 1;

      indices.push(p1, p3, p2);
      indices.push(p2, p3, p4);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
