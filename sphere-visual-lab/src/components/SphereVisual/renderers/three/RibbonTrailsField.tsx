import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type RibbonColors = {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
};

type RibbonTrailsFieldProps = {
  speed?: number;
  reducedMotion?: boolean;
  interactive?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high' | number;
  colors?: Partial<RibbonColors>;
};

type RibbonLayer = 'core' | 'mid' | 'shell';

type RibbonSpec = {
  id: string;
  points: THREE.Vector3[];
  width: number;
  opacity: number;
  baseRotation: [number, number, number];
  orbit: [number, number, number];
  phase: number;
  palette: [string, string, string];
};

type GradientRibbonProps = {
  points: THREE.Vector3[];
  width: number;
  opacity: number;
  baseRotation: [number, number, number];
  orbit: [number, number, number];
  phase: number;
  palette: [string, string, string];
  speed: number;
  reducedMotion: boolean;
};

function resolveGlowFactor(glowIntensity: RibbonTrailsFieldProps['glowIntensity']) {
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

function resolvePalette(colors?: Partial<RibbonColors>): [string, string, string] {
  const c1 = colors?.halo?.getStyle() ?? colors?.accent?.getStyle() ?? '#8EEBFF';
  const c2 = colors?.violet?.getStyle() ?? colors?.mint?.getStyle() ?? '#A88BFF';
  const c3 = colors?.pink?.getStyle() ?? colors?.accent?.getStyle() ?? '#FF8BEF';

  return [c1, c2, c3];
}

function rotatePalette(
  palette: [string, string, string],
  shift: number,
): [string, string, string] {
  const arr = [...palette];
  const normalized = ((shift % 3) + 3) % 3;

  return [
    arr[normalized]!,
    arr[(normalized + 1) % 3]!,
    arr[(normalized + 2) % 3]!,
  ];
}

function buildRibbonPoints(
  familyIndex: number,
  echoIndex: number,
  phase: number,
  layer: RibbonLayer,
) {
  const points: THREE.Vector3[] = [];

  const count = layer === 'shell' ? 180 : layer === 'mid' ? 150 : 130;

  const layerRadius =
    layer === 'core' ? 0.28 : layer === 'mid' ? 0.5 : 0.78;

  const echoShrink =
    layer === 'core' ? 0.008 : layer === 'mid' ? 0.01 : 0.012;

  const baseRadius = layerRadius + familyIndex * 0.028 - echoIndex * echoShrink;

  const turns =
    (layer === 'core' ? 1.55 : layer === 'mid' ? 1.95 : 2.35) +
    familyIndex * 0.12;

  const familySeed = familyIndex * 1.371;
  const echoSeed = echoIndex * 0.241;

  const elevationScale =
    layer === 'core' ? 0.55 : layer === 'mid' ? 0.82 : 1.05;

  const shellSpread = layer === 'shell' ? 0.14 : 0.05;
  const centerPull = layer === 'core' ? 0.09 : 0.03;

  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const centered = t * 2 - 1;

    const azimuth =
      phase +
      t * Math.PI * 2 * turns +
      0.28 * Math.sin(t * Math.PI * 4 + familySeed) +
      0.14 * Math.cos(t * Math.PI * 8 + echoSeed) +
      0.08 * Math.sin(t * Math.PI * 14 + familySeed * 0.7);

    const elevation =
      centered * 0.42 +
      elevationScale * 0.36 * Math.sin(t * Math.PI * 1.6 + familySeed) +
      elevationScale * 0.18 * Math.cos(t * Math.PI * 3.4 + echoSeed) +
      0.08 * Math.sin(t * Math.PI * 8 + phase * 1.7);

    const radialEnvelope =
      0.9 +
      0.1 * Math.sin(t * Math.PI) +
      0.05 * Math.sin(t * Math.PI * 6 + familySeed) +
      0.04 * Math.cos(t * Math.PI * 10 + echoSeed);

    const radius =
      baseRadius * radialEnvelope +
      shellSpread * Math.sin(t * Math.PI) -
      centerPull * Math.sin(t * Math.PI * 2) * 0.25;

    let x =
      radius * Math.cos(azimuth) * Math.cos(elevation) +
      0.09 * Math.sin(azimuth * 0.7 + familySeed) +
      0.04 * Math.cos(t * Math.PI * 6 + echoSeed);

    let y =
      radius * Math.sin(elevation) * 0.96 +
      0.08 * Math.cos(azimuth * 1.1 + echoSeed) +
      0.03 * Math.sin(t * Math.PI * 5 + familySeed);

    let z =
      radius * Math.sin(azimuth) * Math.cos(elevation) +
      0.09 * Math.cos(azimuth * 0.8 + familySeed * 0.6) +
      0.04 * Math.sin(t * Math.PI * 7 + echoSeed);

    const inwardTwist =
      (layer === 'core' ? 0.07 : layer === 'mid' ? 0.05 : 0.035) *
      Math.sin(t * Math.PI) *
      Math.sin(azimuth * 1.25 + familySeed * 0.8);

    x += inwardTwist * Math.cos(azimuth + 1.2);
    z += inwardTwist * Math.sin(azimuth + 1.2);

    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
}

function GradientRibbon({
  points,
  width,
  opacity,
  baseRotation,
  orbit,
  phase,
  palette,
  speed,
  reducedMotion,
}: GradientRibbonProps) {
  const groupRef = useRef<THREE.Group>(null);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.65);
  }, [points]);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 260, width, 14, false);
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
        uniform float uShift;

        varying vec2 vUv;

        void main() {
          float along = fract(vUv.y + uShift + uTime * 0.035);

          vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 0.48, along));
          color = mix(color, uColorC, smoothstep(0.42, 1.0, along));

          float edge = 1.0 - pow(abs(vUv.x * 2.0 - 1.0), 1.85);
          float pulse = 0.82 + 0.18 * sin(vUv.y * 20.0 - uTime * 1.35 + uShift * 6.2831);
          float shimmer = 0.92 + 0.08 * sin(vUv.y * 36.0 + uTime * 1.05 + uShift * 4.5);

          float alpha = uOpacity * edge * pulse * shimmer;
          vec3 finalColor = color * (1.0 + 0.12 * pulse);

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
      baseRotation[0] + Math.sin(t * orbit[0] + phase) * 0.22;
    groupRef.current.rotation.y =
      baseRotation[1] + t * orbit[1] + phase * 0.9;
    groupRef.current.rotation.z =
      baseRotation[2] + Math.cos(t * orbit[2] + phase) * 0.18;

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

export function RibbonTrailsField({
  speed = 1,
  reducedMotion = false,
  glowIntensity = 'medium',
  colors,
}: RibbonTrailsFieldProps) {
  const rootRef = useRef<THREE.Group>(null);

  const glowFactor = resolveGlowFactor(glowIntensity);
  const basePalette = useMemo(() => resolvePalette(colors), [colors]);

  const ribbons = useMemo<RibbonSpec[]>(() => {
    const families: {
      layer: RibbonLayer;
      echoes: number;
      baseRotation: [number, number, number];
      orbit: [number, number, number];
      paletteShift: number;
      widthBase: number;
      opacityBase: number;
    }[] = [
      {
        layer: 'core',
        echoes: 7,
        baseRotation: [0.2, 0.1, -0.25],
        orbit: [0.7, 0.18, 0.62],
        paletteShift: 0,
        widthBase: 0.0095,
        opacityBase: 0.1,
      },
      {
        layer: 'core',
        echoes: 6,
        baseRotation: [-0.35, 0.8, 0.4],
        orbit: [0.64, 0.22, 0.58],
        paletteShift: 1,
        widthBase: 0.009,
        opacityBase: 0.09,
      },
      {
        layer: 'mid',
        echoes: 8,
        baseRotation: [0.55, 0.3, -0.4],
        orbit: [0.78, 0.24, 0.72],
        paletteShift: 2,
        widthBase: 0.0105,
        opacityBase: 0.1,
      },
      {
        layer: 'mid',
        echoes: 8,
        baseRotation: [-0.2, 1.05, 0.55],
        orbit: [0.72, 0.21, 0.68],
        paletteShift: 0,
        widthBase: 0.0105,
        opacityBase: 0.1,
      },
      {
        layer: 'mid',
        echoes: 7,
        baseRotation: [0.85, -0.7, 1.1],
        orbit: [0.8, 0.26, 0.74],
        paletteShift: 1,
        widthBase: 0.0102,
        opacityBase: 0.095,
      },
      {
        layer: 'shell',
        echoes: 8,
        baseRotation: [0.9, -0.45, 0.2],
        orbit: [0.74, 0.2, 0.65],
        paletteShift: 2,
        widthBase: 0.0092,
        opacityBase: 0.08,
      },
      {
        layer: 'shell',
        echoes: 7,
        baseRotation: [-0.55, 0.65, 0.95],
        orbit: [0.69, 0.17, 0.6],
        paletteShift: 0,
        widthBase: 0.009,
        opacityBase: 0.075,
      },
      {
        layer: 'shell',
        echoes: 7,
        baseRotation: [0.28, 1.2, -0.85],
        orbit: [0.76, 0.19, 0.67],
        paletteShift: 1,
        widthBase: 0.009,
        opacityBase: 0.075,
      },
    ];

    const items: RibbonSpec[] = [];

    families.forEach((family, familyIndex) => {
      for (let echo = 0; echo < family.echoes; echo += 1) {
        const echoStrength = 1 - echo / (family.echoes + 1);
        const phase = familyIndex * 0.73 + echo * 0.085;

        const points = buildRibbonPoints(familyIndex, echo, phase, family.layer);

        const widthBoost =
          family.layer === 'core' ? 1.08 : family.layer === 'mid' ? 1 : 0.92;

        const opacityBoost =
          family.layer === 'core' ? 1.06 : family.layer === 'mid' ? 1 : 0.9;

        items.push({
          id: `${family.layer}-${familyIndex}-echo-${echo}`,
          points,
          width:
            (family.widthBase + echoStrength * 0.0032) *
            widthBoost *
            glowFactor,
          opacity:
            (family.opacityBase + echoStrength * 0.045) *
            opacityBoost *
            glowFactor,
          baseRotation: [
            family.baseRotation[0] + echo * 0.045,
            family.baseRotation[1] - echo * 0.032,
            family.baseRotation[2] + echo * 0.026,
          ],
          orbit: family.orbit,
          phase,
          palette: rotatePalette(basePalette, family.paletteShift + echo),
        });
      }
    });

    return items;
  }, [basePalette, glowFactor]);

  useFrame((state) => {
    if (!rootRef.current) return;

    const motionFactor = reducedMotion ? 0.2 : 1;
    const t = state.clock.getElapsedTime() * speed * motionFactor;

    rootRef.current.rotation.y = t * 0.1;
    rootRef.current.rotation.x = Math.sin(t * 0.38) * 0.06;
    rootRef.current.rotation.z = Math.cos(t * 0.24) * 0.04;
  });

  return (
    <group ref={rootRef}>
      {ribbons.map((ribbon) => (
        <GradientRibbon
          key={ribbon.id}
          points={ribbon.points}
          width={ribbon.width}
          opacity={ribbon.opacity}
          baseRotation={ribbon.baseRotation}
          orbit={ribbon.orbit}
          phase={ribbon.phase}
          palette={ribbon.palette}
          speed={speed}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}