import { useFrame } from '@react-three/fiber';
import {
  useEffect,
  useMemo,
  useRef,
} from 'react';
import * as THREE from 'three';
import type { OrbitalQuality } from '../../OrbitalVisual.types';

interface PortalMembraneColors {
  core: THREE.Color;
  glow: THREE.Color;
  accent: THREE.Color;
  hot: THREE.Color;
}

interface PortalMembraneProps {
  radius: number;
  opacity: number;
  flowSpeed: number;
  turbulence: number;
  pulse: number;
  depth: number;
  colors: PortalMembraneColors;
  quality: OrbitalQuality;
  speed: number;
  glowFactor: number;
}

interface PortalLayerOptions {
  name: string;
  opacityScale: number;
  flowScale: number;
  turbulenceScale: number;
  pulseScale: number;
  layer: number;
  phase: number;
  direction: 1 | -1;
  blending: THREE.Blending;
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uFlowSpeed;
  uniform float uTurbulence;
  uniform float uPulse;
  uniform float uLayer;
  uniform float uPhase;
  uniform float uDirection;
  uniform vec3 uCoreColor;
  uniform vec3 uGlowColor;
  uniform vec3 uAccentColor;
  uniform vec3 uHotColor;

  varying vec2 vUv;
  varying vec3 vViewPosition;

  float hash21(vec2 pointValue) {
    pointValue = fract(pointValue * vec2(123.34, 345.45));
    pointValue += dot(pointValue, pointValue + 34.345);
    return fract(pointValue.x * pointValue.y);
  }

  float noise21(vec2 pointValue) {
    vec2 integerPart = floor(pointValue);
    vec2 fractionalPart = fract(pointValue);
    fractionalPart =
      fractionalPart *
      fractionalPart *
      (3.0 - 2.0 * fractionalPart);

    float a = hash21(integerPart);
    float b = hash21(integerPart + vec2(1.0, 0.0));
    float c = hash21(integerPart + vec2(0.0, 1.0));
    float d = hash21(integerPart + vec2(1.0, 1.0));

    return mix(
      mix(a, b, fractionalPart.x),
      mix(c, d, fractionalPart.x),
      fractionalPart.y
    );
  }

  float fbm(vec2 pointValue) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int index = 0; index < 6; index++) {
      value += noise21(pointValue) * amplitude;
      pointValue =
        pointValue * 2.03 +
        vec2(17.1, 11.7);
      amplitude *= 0.5;
    }

    return value;
  }

  float softBand(float value, float center, float width) {
    return exp(-pow((value - center) / width, 2.0));
  }

  void main() {
    vec2 pointValue = (vUv - 0.5) * 2.0;
    float radiusValue = length(pointValue);

    if (radiusValue > 1.0) {
      discard;
    }

    float safeRadius = max(radiusValue, 0.045);
    float angleValue = atan(pointValue.y, pointValue.x);

    float timeValue =
      uTime *
      uFlowSpeed *
      uDirection +
      uPhase;

    float inwardAcceleration =
      1.0 +
      pow(1.0 - radiusValue, 1.55) * 2.85;

    float advectedAngle =
      angleValue +
      timeValue *
        (0.92 + uLayer * 0.42) *
        inwardAcceleration;

    vec2 rotatedPoint =
      vec2(
        cos(advectedAngle),
        sin(advectedAngle)
      ) * radiusValue;

    vec2 broadPoint =
      rotatedPoint *
      (2.1 + uTurbulence * 1.45);

    broadPoint += vec2(
      cos(
        advectedAngle * 3.0 -
        timeValue * 0.55
      ),
      sin(
        advectedAngle * 4.0 +
        timeValue * 0.43
      )
    ) * (0.085 + uTurbulence * 0.075);

    float broadNoise = fbm(
      broadPoint +
      timeValue * vec2(0.13, -0.09)
    );

    float detailNoise = fbm(
      broadPoint * 2.55 -
      timeValue * vec2(0.21, 0.12)
    );

    float microNoise = fbm(
      broadPoint * 5.4 +
      timeValue * vec2(-0.34, 0.24)
    );

    float spiralCoordinate =
      advectedAngle * 5.35 -
      log(safeRadius + 0.06) * 12.7 +
      broadNoise * 4.9 +
      detailNoise * 1.55;

    float spiralWave =
      0.5 +
      0.5 * sin(spiralCoordinate);

    float spiralWaveTwo =
      0.5 +
      0.5 * sin(
        advectedAngle * 8.2 -
        log(safeRadius + 0.085) * 18.4 +
        timeValue * 1.7 * inwardAcceleration +
        detailNoise * 4.1
      );

    float primaryFilament =
      smoothstep(0.48, 0.92, spiralWave) *
      (0.54 + spiralWaveTwo * 0.46);

    float sharpFilament =
      pow(
        smoothstep(0.58, 0.96, spiralWaveTwo),
        1.55
      ) *
      (0.62 + microNoise * 0.38);

    float suctionPhase = fract(
      radiusValue * 9.2 +
      timeValue *
        (1.34 + uLayer * 0.34) +
      angleValue * 0.38 +
      broadNoise * 0.48
    );

    float suctionBand =
      softBand(suctionPhase, 0.86, 0.075) *
      smoothstep(0.13, 0.95, radiusValue);

    float fastSuctionPhase = fract(
      radiusValue * 15.0 +
      timeValue *
        (2.05 + uLayer * 0.48) +
      advectedAngle * 0.24 +
      detailNoise * 0.34
    );

    float fastSuctionBand =
      softBand(
        fastSuctionPhase,
        0.9,
        0.055
      ) *
      smoothstep(0.18, 0.92, radiusValue);

    float inwardStreaks =
      (
        suctionBand * 0.68 +
        fastSuctionBand * 0.42
      ) *
      (
        0.34 +
        primaryFilament * 0.42 +
        sharpFilament * 0.34
      ) *
      (
        0.72 +
        (1.0 - radiusValue) * 0.9
      );

    float angularStreaks =
      pow(
        0.5 +
        0.5 * sin(
          advectedAngle * 34.0 +
          detailNoise * 4.2 -
          timeValue * 2.4
        ),
        5.0
      ) *
      inwardStreaks;

    float softCloud =
      broadNoise * 0.58 +
      detailNoise * 0.3 +
      microNoise * 0.12;

    float centerVoid =
      smoothstep(0.065, 0.235, radiusValue);

    float horizonRadius =
      0.205 +
      (broadNoise - 0.5) * 0.018 +
      sin(
        timeValue * 2.15 +
        angleValue * 5.0
      ) * 0.0045;

    float eventHorizon =
      1.0 -
      smoothstep(
        0.012,
        0.052,
        abs(radiusValue - horizonRadius)
      );

    float innerHalo =
      softBand(radiusValue, 0.34, 0.19);

    float sinkGlow =
      softBand(radiusValue, 0.275, 0.105) *
      (
        0.66 +
        primaryFilament * 0.34
      );

    float outerRim =
      1.0 -
      smoothstep(
        0.014,
        0.052,
        abs(radiusValue - 0.92)
      );

    float outerFalloff =
      1.0 -
      smoothstep(0.84, 1.0, radiusValue);

    float perspectiveShade =
      0.93 +
      clamp(
        -vViewPosition.z * 0.015,
        -0.05,
        0.08
      );

    float pulseValue =
      1.0 +
      sin(
        uTime * 1.16 +
        broadNoise * 2.4 +
        uPhase
      ) *
      uPulse;

    float energy =
      softCloud * 0.16 +
      primaryFilament * 0.48 +
      sharpFilament * 0.24 +
      innerHalo * 0.12 +
      inwardStreaks * 0.58 +
      angularStreaks * 0.28 +
      sinkGlow * 0.22;

    vec3 deepColor = mix(
      uAccentColor * 0.075,
      uCoreColor * 0.14,
      0.32
    );

    vec3 color = mix(
      deepColor,
      uGlowColor,
      clamp(energy, 0.0, 1.0)
    );

    color = mix(
      color,
      uCoreColor,
      sinkGlow * 0.34 +
      innerHalo * 0.16
    );

    color = mix(
      color,
      uHotColor,
      eventHorizon *
        (0.76 + uLayer * 0.1) +
      inwardStreaks * 0.15 +
      angularStreaks * 0.18 +
      outerRim * 0.12 +
      sharpFilament * 0.08 * uLayer
    );

    float centerDarkening =
      mix(0.028, 1.0, centerVoid);

    color *=
      centerDarkening *
      perspectiveShade *
      pulseValue;

    float bodyAlpha =
      outerFalloff *
      centerVoid *
      (
        0.08 +
        softCloud * 0.16 +
        primaryFilament * 0.31 +
        sharpFilament * 0.18 +
        innerHalo * 0.11 +
        inwardStreaks * 0.37 +
        angularStreaks * 0.18
      );

    float alpha =
      uOpacity *
      (
        bodyAlpha +
        eventHorizon * 0.34 +
        outerRim * 0.14
      ) *
      pulseValue;

    gl_FragColor = vec4(color, alpha);
  }
`;

function getCircleSegments(quality: OrbitalQuality) {
  switch (quality) {
    case 'low':
      return 56;
    case 'high':
      return 160;
    default:
      return 96;
  }
}

function createLayerUniforms(
  options: PortalLayerOptions,
  opacity: number,
  flowSpeed: number,
  turbulence: number,
  pulse: number,
  colors: PortalMembraneColors,
  glowFactor: number,
) {
  return {
    uTime: { value: 0 },
    uOpacity: {
      value:
        opacity *
        glowFactor *
        options.opacityScale,
    },
    uFlowSpeed: {
      value: flowSpeed * options.flowScale,
    },
    uTurbulence: {
      value:
        turbulence *
        options.turbulenceScale,
    },
    uPulse: {
      value: pulse * options.pulseScale,
    },
    uLayer: { value: options.layer },
    uPhase: { value: options.phase },
    uDirection: { value: options.direction },
    uCoreColor: { value: colors.core.clone() },
    uGlowColor: { value: colors.glow.clone() },
    uAccentColor: { value: colors.accent.clone() },
    uHotColor: { value: colors.hot.clone() },
  };
}

function createMaterial(
  uniforms: ReturnType<typeof createLayerUniforms>,
  options: PortalLayerOptions,
) {
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: options.blending,
  });

  material.name = `PortalMembrane-${options.name}`;
  material.toneMapped = false;

  return material;
}

const BACK_LAYER: PortalLayerOptions = {
  name: 'back',
  opacityScale: 0.96,
  flowScale: 1.08,
  turbulenceScale: 0.9,
  pulseScale: 0.55,
  layer: 0.08,
  phase: 0,
  direction: 1,
  blending: THREE.NormalBlending,
};

const MIDDLE_LAYER: PortalLayerOptions = {
  name: 'middle',
  opacityScale: 0.64,
  flowScale: 1.58,
  turbulenceScale: 1.02,
  pulseScale: 0.72,
  layer: 0.56,
  phase: 2.15,
  direction: 1,
  blending: THREE.AdditiveBlending,
};

const FRONT_LAYER: PortalLayerOptions = {
  name: 'front',
  opacityScale: 0.44,
  flowScale: 2.08,
  turbulenceScale: 1.12,
  pulseScale: 0.84,
  layer: 1,
  phase: 4.35,
  direction: 1,
  blending: THREE.AdditiveBlending,
};

export default function PortalMembrane({
  radius,
  opacity,
  flowSpeed,
  turbulence,
  pulse,
  depth,
  colors,
  quality,
  speed,
  glowFactor,
}: PortalMembraneProps) {
  const backRef = useRef<THREE.Mesh>(null);
  const middleRef = useRef<THREE.Mesh>(null);
  const frontRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () =>
      new THREE.CircleGeometry(
        radius,
        getCircleSegments(quality),
      ),
    [quality, radius],
  );

  const backUniforms = useMemo(
    () =>
      createLayerUniforms(
        BACK_LAYER,
        opacity,
        flowSpeed,
        turbulence,
        pulse,
        colors,
        glowFactor,
      ),
    [
      colors,
      flowSpeed,
      glowFactor,
      opacity,
      pulse,
      turbulence,
    ],
  );

  const middleUniforms = useMemo(
    () =>
      createLayerUniforms(
        MIDDLE_LAYER,
        opacity,
        flowSpeed,
        turbulence,
        pulse,
        colors,
        glowFactor,
      ),
    [
      colors,
      flowSpeed,
      glowFactor,
      opacity,
      pulse,
      turbulence,
    ],
  );

  const frontUniforms = useMemo(
    () =>
      createLayerUniforms(
        FRONT_LAYER,
        opacity,
        flowSpeed,
        turbulence,
        pulse,
        colors,
        glowFactor,
      ),
    [
      colors,
      flowSpeed,
      glowFactor,
      opacity,
      pulse,
      turbulence,
    ],
  );

  const backMaterial = useMemo(
    () => createMaterial(backUniforms, BACK_LAYER),
    [backUniforms],
  );

  const middleMaterial = useMemo(
    () => createMaterial(middleUniforms, MIDDLE_LAYER),
    [middleUniforms],
  );

  const frontMaterial = useMemo(
    () => createMaterial(frontUniforms, FRONT_LAYER),
    [frontUniforms],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      backMaterial.dispose();
      middleMaterial.dispose();
      frontMaterial.dispose();
    };
  }, [
    backMaterial,
    frontMaterial,
    geometry,
    middleMaterial,
  ]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const safeSpeed = Math.max(speed, 0.2);
    const timeValue = elapsed * safeSpeed;

    backMaterial.uniforms.uTime.value = timeValue;
    middleMaterial.uniforms.uTime.value = timeValue + 1.25;
    frontMaterial.uniforms.uTime.value = timeValue + 2.7;

    if (backRef.current) {
      backRef.current.rotation.z =
        elapsed * 0.034 * safeSpeed;
    }

    if (middleRef.current) {
      middleRef.current.rotation.z =
        elapsed * 0.061 * safeSpeed;

      const middleScale =
        0.975 +
        Math.sin(elapsed * 0.94 * safeSpeed) *
          0.0045;

      middleRef.current.scale.set(
        middleScale,
        middleScale,
        1,
      );
    }

    if (frontRef.current) {
      frontRef.current.rotation.z =
        elapsed * 0.092 * safeSpeed;

      const frontScale =
        0.94 +
        Math.sin(
          elapsed * 1.24 * safeSpeed + 1.2,
        ) *
          0.006;

      frontRef.current.scale.set(
        frontScale,
        frontScale,
        1,
      );
    }
  });

  return (
    <group>
      <mesh
        ref={backRef}
        geometry={geometry}
        position={[0, 0, -depth * 0.5]}
        renderOrder={4}
      >
        <primitive
          object={backMaterial}
          attach="material"
        />
      </mesh>

      <mesh
        ref={middleRef}
        geometry={geometry}
        position={[0, 0, -depth * 0.06]}
        scale={[0.975, 0.975, 1]}
        renderOrder={9}
      >
        <primitive
          object={middleMaterial}
          attach="material"
        />
      </mesh>

      <mesh
        ref={frontRef}
        geometry={geometry}
        position={[0, 0, depth * 0.28]}
        scale={[0.94, 0.94, 1]}
        renderOrder={14}
      >
        <primitive
          object={frontMaterial}
          attach="material"
        />
      </mesh>
    </group>
  );
}
