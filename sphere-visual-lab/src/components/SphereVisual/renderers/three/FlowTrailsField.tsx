import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type FlowColors = {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
};

type FlowTrailsFieldProps = {
  speed?: number;
  reducedMotion?: boolean;
  interactive?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high' | number;
  colors?: Partial<FlowColors>;
};

type FlowLayer = 'core' | 'mid' | 'shell';

type TrailSpec = {
  id: string;
  points: THREE.Vector3[];
  width: number;
  opacity: number;
  baseRotation: [number, number, number];
  orbit: [number, number, number];
  phase: number;
  palette: [string, string, string, string];
};

type GradientTrailProps = {
  points: THREE.Vector3[];
  width: number;
  opacity: number;
  baseRotation: [number, number, number];
  orbit: [number, number, number];
  phase: number;
  palette: [string, string, string, string];
  speed: number;
  reducedMotion: boolean;
};

function resolveGlowFactor(glowIntensity: FlowTrailsFieldProps['glowIntensity']) {
  if (typeof glowIntensity === 'number') {
    return THREE.MathUtils.clamp(glowIntensity, 0.5, 2);
  }

  switch (glowIntensity) {
    case 'low':
      return 0.8;
    case 'high':
      return 1.35;
    case 'medium':
    default:
      return 1;
  }
}

function resolvePalette(
  colors?: Partial<FlowColors>,
): [string, string, string, string] {
  const c1 = colors?.halo?.getStyle() ?? colors?.accent?.getStyle() ?? '#8EEBFF';
  const c2 = colors?.violet?.getStyle() ?? '#A88BFF';
  const c3 = colors?.mint?.getStyle() ?? '#8FFFE1';
  const c4 = colors?.pink?.getStyle() ?? '#FF8BEF';

  return [c1, c2, c3, c4];
}

function rotatePalette(
  palette: [string, string, string, string],
  shift: number,
): [string, string, string, string] {
  const arr = [...palette];
  const normalized = ((shift % 4) + 4) % 4;

  return [
    arr[normalized]!,
    arr[(normalized + 1) % 4]!,
    arr[(normalized + 2) % 4]!,
    arr[(normalized + 3) % 4]!,
  ];
}

function pseudoNoise(seedA: number, seedB: number, t: number) {
  return (
    Math.sin(t * 6.1 + seedA * 1.37) * 0.55 +
    Math.cos(t * 10.3 + seedB * 0.91) * 0.3 +
    Math.sin(t * 18.7 + (seedA + seedB) * 0.41) * 0.15
  );
}

function createAxis(seed: number, offset: number) {
  return new THREE.Vector3(
    Math.sin(seed * 1.37 + offset),
    Math.cos(seed * 0.93 + offset * 1.7) * 0.92,
    Math.sin(seed * 1.91 + offset * 0.6),
  ).normalize();
}

function makeStartPoint(seed: number, layer: FlowLayer) {
  const u = 0.5 + 0.5 * Math.sin(seed * 2.17 + 0.4);
  const v = 0.5 + 0.5 * Math.cos(seed * 3.93 + 1.2);

  const polar = Math.acos(1 - 2 * THREE.MathUtils.clamp(u, 0.001, 0.999));
  const azimuth = v * Math.PI * 2;

  const baseRadius =
    layer === 'core'
      ? 0.22 + 0.08 * (0.5 + 0.5 * Math.sin(seed * 1.7))
      : layer === 'mid'
        ? 0.44 + 0.14 * (0.5 + 0.5 * Math.cos(seed * 1.9))
        : 0.68 + 0.14 * (0.5 + 0.5 * Math.sin(seed * 2.4));

  return new THREE.Vector3(
    baseRadius * Math.sin(polar) * Math.cos(azimuth),
    baseRadius * Math.cos(polar),
    baseRadius * Math.sin(polar) * Math.sin(azimuth),
  );
}

function buildFlowTrail(
  seed: number,
  layer: FlowLayer,
  pointCount: number,
  phase: number,
) {
  const points: THREE.Vector3[] = [];

  const pos = makeStartPoint(seed, layer);

  const axisA = createAxis(seed, 0.15);
  const axisB = createAxis(seed, 1.6);
  const axisC = createAxis(seed, 2.8);

  const shellTarget = layer === 'core' ? 0.34 : layer === 'mid' ? 0.59 : 0.84;
  const maxRadius = layer === 'core' ? 0.62 : layer === 'mid' ? 0.88 : 1.01;
  const minRadius = layer === 'core' ? 0.08 : layer === 'mid' ? 0.14 : 0.22;

  const baseStep = layer === 'core' ? 0.031 : layer === 'mid' ? 0.033 : 0.031;

  for (let i = 0; i < pointCount; i += 1) {
    const t = i / (pointCount - 1);

    const radius = Math.max(pos.length(), 0.0001);
    const radial = pos.clone().normalize();

    const liveAxis = axisA
      .clone()
      .lerp(axisB, 0.5 + 0.5 * Math.sin(t * 3.8 + phase * 0.9))
      .lerp(axisC, 0.18 + 0.18 * Math.cos(t * 5.2 + seed * 0.2))
      .normalize();

    let tangent = new THREE.Vector3().crossVectors(liveAxis, radial);
    if (tangent.lengthSq() < 1e-5) {
      tangent = new THREE.Vector3().crossVectors(axisB, radial);
    }
    tangent.normalize();

    let binormal = new THREE.Vector3().crossVectors(radial, tangent);
    if (binormal.lengthSq() < 1e-5) {
      binormal = new THREE.Vector3(0, 1, 0);
    }
    binormal.normalize();

    const shellDelta = shellTarget - radius;

    const tangentForce =
      0.94 +
      0.18 * Math.sin(t * 6.4 + phase * 3.1) +
      0.1 * pseudoNoise(seed, phase, t);

    const binormalForce =
      0.28 * Math.cos(t * 7.1 + seed * 0.7) +
      0.14 * Math.sin(t * 3.6 + phase * 2.3);

    const radialForce =
      shellDelta * (layer === 'shell' ? 0.78 : 0.58) +
      (layer === 'core' ? 0.03 : 0.015) * Math.sin(t * Math.PI * 4 + seed);

    const planePull =
      (-pos.z * (layer === 'shell' ? 0.16 : layer === 'mid' ? 0.12 : 0.09)) *
      (0.72 + 0.28 * Math.sin(t * Math.PI));

    const centerWave =
      (layer === 'core' ? 0.08 : layer === 'mid' ? 0.045 : 0.02) *
      Math.sin(t * Math.PI * 2.4 + phase * 2.8);

    const forwardBias = THREE.MathUtils.lerp(0.12, -0.06, t);
    const shellBloom =
      layer === 'shell' ? 0.06 * Math.sin(t * Math.PI) : 0.02 * Math.sin(t * Math.PI);

    const flow = new THREE.Vector3()
      .addScaledVector(tangent, tangentForce)
      .addScaledVector(binormal, binormalForce)
      .addScaledVector(radial, radialForce + centerWave + shellBloom)
      .add(new THREE.Vector3(0, 0, planePull))
      .addScaledVector(axisC, forwardBias * 0.06);

    const stepEnvelope =
      0.88 +
      0.22 * Math.sin(t * Math.PI) +
      0.08 * Math.cos(t * Math.PI * 3 + seed * 0.4);

    pos.add(flow.normalize().multiplyScalar(baseStep * stepEnvelope));

    const nextRadius = pos.length();

    if (nextRadius > maxRadius) {
      pos.setLength(THREE.MathUtils.lerp(nextRadius, maxRadius, 0.62));
    }

    if (nextRadius < minRadius) {
      pos.setLength(minRadius);
    }

    const renderPos = pos.clone();

    renderPos.z *= 0.78;
    renderPos.x *= layer === 'shell' ? 1.03 : 1.01;
    renderPos.y *= layer === 'core' ? 0.98 : 1.0;

    points.push(renderPos);
  }

  return points;
}

function GradientTrail({
  points,
  width,
  opacity,
  baseRotation,
  orbit,
  phase,
  palette,
  speed,
  reducedMotion,
}: GradientTrailProps) {
  const groupRef = useRef<THREE.Group>(null);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.6);
  }, [points]);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 220, width, 12, false);
  }, [curve, width]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: opacity },
        uColorA: { value: new THREE.Color(palette[0]) },
        uColorB: { value: new THREE.Color(palette[1]) },
        uColorC: { value: new THREE.Color(palette[2]) },
        uColorD: { value: new THREE.Color(palette[3]) },
        uShift: { value: phase },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        uniform vec3 uColorD;
        uniform float uShift;

        varying vec2 vUv;

        void main() {
          float along = fract(vUv.y * 0.96 + uShift + uTime * 0.032);

          vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 0.3, along));
          color = mix(color, uColorC, smoothstep(0.24, 0.68, along));
          color = mix(color, uColorD, smoothstep(0.62, 1.0, along));

          float edge = 1.0 - pow(abs(vUv.x * 2.0 - 1.0), 1.85);
          float pulse = 0.84 + 0.16 * sin(vUv.y * 18.0 - uTime * 1.15 + uShift * 6.2831);
          float shimmer = 0.93 + 0.07 * sin(vUv.y * 34.0 + uTime * 0.9 + uShift * 4.2);

          float alpha = uOpacity * edge * pulse * shimmer;
          vec3 finalColor = color * (1.0 + 0.13 * pulse);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    });
  }, [opacity, palette, phase]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const motionFactor = reducedMotion ? 0.22 : 1;
    const t = state.clock.getElapsedTime() * speed * motionFactor;

    groupRef.current.rotation.x =
      baseRotation[0] + Math.sin(t * orbit[0] + phase) * 0.14;
    groupRef.current.rotation.y =
      baseRotation[1] + t * orbit[1] + Math.sin(t * 0.42 + phase) * 0.05;
    groupRef.current.rotation.z =
      baseRotation[2] + Math.cos(t * orbit[2] + phase) * 0.12;

    material.uniforms.uTime.value = t;
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} frustumCulled={false}>
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}

export function FlowTrailsField({
  speed = 1,
  reducedMotion = false,
  glowIntensity = 'medium',
  colors,
}: FlowTrailsFieldProps) {
  const rootRef = useRef<THREE.Group>(null);

  const glowFactor = resolveGlowFactor(glowIntensity);
  const basePalette = useMemo(() => resolvePalette(colors), [colors]);

  const trails = useMemo<TrailSpec[]>(() => {
    const configs: {
      layer: FlowLayer;
      count: number;
      pointCount: number;
      baseRotation: [number, number, number];
      orbit: [number, number, number];
      paletteShift: number;
      widthBase: number;
      opacityBase: number;
    }[] = [
      {
        layer: 'core',
        count: 12,
        pointCount: 78,
        baseRotation: [0.12, 0.05, -0.2],
        orbit: [0.38, 0.11, 0.34],
        paletteShift: 0,
        widthBase: 0.0102,
        opacityBase: 0.105,
      },
      {
        layer: 'mid',
        count: 16,
        pointCount: 92,
        baseRotation: [0.5, 0.28, -0.35],
        orbit: [0.32, 0.1, 0.28],
        paletteShift: 1,
        widthBase: 0.0104,
        opacityBase: 0.098,
      },
      {
        layer: 'mid',
        count: 14,
        pointCount: 94,
        baseRotation: [-0.28, 0.88, 0.44],
        orbit: [0.3, 0.09, 0.27],
        paletteShift: 2,
        widthBase: 0.0102,
        opacityBase: 0.094,
      },
      {
        layer: 'shell',
        count: 18,
        pointCount: 108,
        baseRotation: [0.72, -0.42, 0.18],
        orbit: [0.28, 0.08, 0.24],
        paletteShift: 3,
        widthBase: 0.0096,
        opacityBase: 0.082,
      },
      {
        layer: 'shell',
        count: 14,
        pointCount: 104,
        baseRotation: [-0.52, 0.74, 0.92],
        orbit: [0.26, 0.075, 0.22],
        paletteShift: 0,
        widthBase: 0.0092,
        opacityBase: 0.078,
      },
    ];

    const items: TrailSpec[] = [];

    configs.forEach((config, configIndex) => {
      for (let i = 0; i < config.count; i += 1) {
        const seed = configIndex * 11.37 + i * 0.93 + 0.4;
        const phase = configIndex * 0.49 + i * 0.067;

        const points = buildFlowTrail(
          seed,
          config.layer,
          config.pointCount,
          phase,
        );

        const weight =
          config.layer === 'core' ? 1.06 : config.layer === 'mid' ? 1 : 0.92;

        const brightness =
          config.layer === 'core' ? 1.05 : config.layer === 'mid' ? 1 : 0.9;

        const densityOffset = 0.5 + 0.5 * Math.sin(seed * 1.73);

        items.push({
          id: `${config.layer}-${configIndex}-${i}`,
          points,
          width:
            (config.widthBase + densityOffset * 0.0026) * weight * glowFactor,
          opacity:
            (config.opacityBase + densityOffset * 0.04) *
            brightness *
            glowFactor,
          baseRotation: [
            config.baseRotation[0] + i * 0.028,
            config.baseRotation[1] - i * 0.021,
            config.baseRotation[2] + i * 0.018,
          ],
          orbit: config.orbit,
          phase,
          palette: rotatePalette(basePalette, config.paletteShift + i),
        });
      }
    });

    return items;
  }, [basePalette, glowFactor]);

  useFrame((state) => {
    if (!rootRef.current) return;

    const motionFactor = reducedMotion ? 0.2 : 1;
    const t = state.clock.getElapsedTime() * speed * motionFactor;

    rootRef.current.rotation.y = t * 0.07;
    rootRef.current.rotation.x = Math.sin(t * 0.26) * 0.04;
    rootRef.current.rotation.z = Math.cos(t * 0.22) * 0.03;
  });

  return (
    <group ref={rootRef}>
      {trails.map((trail) => (
        <GradientTrail
          key={trail.id}
          points={trail.points}
          width={trail.width}
          opacity={trail.opacity}
          baseRotation={trail.baseRotation}
          orbit={trail.orbit}
          phase={trail.phase}
          palette={trail.palette}
          speed={speed}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}