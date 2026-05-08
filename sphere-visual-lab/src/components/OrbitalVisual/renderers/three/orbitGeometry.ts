import * as THREE from 'three';

interface OrbitPointOptions {
  radius: number;
  wobble: number;
  seed: number;
  ellipseX: number;
  ellipseY: number;
}

export function sampleOrbitPoint(
  t: number,
  { radius, wobble, seed, ellipseX, ellipseY }: OrbitPointOptions,
) {
  const harmonicA = Math.sin(t * 2 + seed * 0.67) * wobble * 0.008;
  const harmonicB = Math.cos(t * 4 - seed * 0.41) * wobble * 0.0025;
  const radial = radius * (1 + harmonicA + harmonicB);

  const x = Math.cos(t) * radial * ellipseX;
  const y = Math.sin(t) * radial * ellipseY;
  const z =
    Math.sin(t * 2 + seed * 0.31) * radius * wobble * 0.008 +
    Math.cos(t * 3 - seed * 0.19) * radius * wobble * 0.002;

  return new THREE.Vector3(x, y, z);
}

export function createOrbitCurve(options: OrbitPointOptions) {
  const points: THREE.Vector3[] = [];
  const segments = 220;

  for (let i = 0; i < segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    points.push(sampleOrbitPoint(t, options));
  }

  return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.2);
}

export function createOrbitGeometry(
  radius: number,
  thickness: number,
  wobble: number,
  seed: number,
  ellipseX: number,
  ellipseY: number,
) {
  const curve = createOrbitCurve({
    radius,
    wobble,
    seed,
    ellipseX,
    ellipseY,
  });

  return new THREE.TubeGeometry(curve, 280, thickness, 20, true);
}