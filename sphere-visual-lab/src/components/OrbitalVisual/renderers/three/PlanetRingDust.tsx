import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface PlanetRingDustProps {
  radius: number;
  thickness: number;
  ellipseX: number;
  ellipseY: number;
  wobble: number;
  seed: number;
  baseColor: THREE.Color;
  opacity: number;
  speed: number;
  glowFactor: number;
}

interface DustSeed {
  angle: number;
  radialProgress: number;
  phase: number;
  orbitSpeed: number;
  radialPulse: number;
  depth: number;
}

interface DustLayerConfig {
  name: string;
  count: number;
  size: number;
  opacity: number;
  colorMix: number;
  whiteMix: number;
  renderOrder: number;
  clusterChance: number;
}

interface DustLayerRuntime {
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  positions: Float32Array;
  particles: DustSeed[];
  baseOpacity: number;
  phase: number;
}

const DUST_LAYERS: DustLayerConfig[] = [
  {
    name: 'fine',
    count: 96,
    size: 1.7,
    opacity: 0.58,
    colorMix: 0.7,
    whiteMix: 0.08,
    renderOrder: 20,
    clusterChance: 0.42,
  },
  {
    name: 'glow',
    count: 42,
    size: 2.8,
    opacity: 0.72,
    colorMix: 0.8,
    whiteMix: 0.22,
    renderOrder: 21,
    clusterChance: 0.58,
  },
  {
    name: 'spark',
    count: 14,
    size: 4.4,
    opacity: 0.88,
    colorMix: 0.88,
    whiteMix: 0.52,
    renderOrder: 22,
    clusterChance: 0.72,
  },
];

function createSeededRandom(seed: number) {
  let value =
    Math.floor(
      Math.abs(seed) * 100000,
    ) || 1;

  return () => {
    value += 0x6d2b79f5;

    let result = value;

    result =
      Math.imul(
        result ^ (result >>> 15),
        result | 1,
      );

    result ^=
      result +
      Math.imul(
        result ^ (result >>> 7),
        result | 61,
      );

    return (
      (
        result ^
        (result >>> 14)
      ) >>>
      0
    ) /
      4294967296;
  };
}

function randomRange(
  random: () => number,
  min: number,
  max: number,
) {
  return (
    min +
    (max - min) *
      random()
  );
}

function chooseRingBand(
  random: () => number,
) {
  const centers = [
    0.13,
    0.35,
    0.63,
    0.87,
  ];

  const spreads = [
    0.052,
    0.072,
    0.078,
    0.048,
  ];

  const weights = [
    0.2,
    0.28,
    0.32,
    0.2,
  ];

  const selection =
    random();

  let accumulated = 0;
  let bandIndex = 0;

  for (
    let index = 0;
    index < weights.length;
    index += 1
  ) {
    accumulated +=
      weights[index]!;

    if (selection <= accumulated) {
      bandIndex = index;
      break;
    }
  }

  return THREE.MathUtils.clamp(
    centers[bandIndex]! +
      randomRange(
        random,
        -spreads[bandIndex]!,
        spreads[bandIndex]!,
      ),
    0.025,
    0.975,
  );
}

function createSoftPointTexture() {
  if (typeof document === 'undefined') {
    return null;
  }

  const size = 64;
  const canvas =
    document.createElement('canvas');

  canvas.width = size;
  canvas.height = size;

  const context =
    canvas.getContext('2d');

  if (!context) {
    return null;
  }

  const center = size / 2;

  const gradient =
    context.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      center,
    );

  gradient.addColorStop(
    0,
    'rgba(255,255,255,1)',
  );

  gradient.addColorStop(
    0.18,
    'rgba(255,255,255,0.98)',
  );

  gradient.addColorStop(
    0.44,
    'rgba(255,255,255,0.62)',
  );

  gradient.addColorStop(
    0.72,
    'rgba(255,255,255,0.16)',
  );

  gradient.addColorStop(
    1,
    'rgba(255,255,255,0)',
  );

  context.clearRect(
    0,
    0,
    size,
    size,
  );

  context.fillStyle =
    gradient;

  context.fillRect(
    0,
    0,
    size,
    size,
  );

  const texture =
    new THREE.CanvasTexture(canvas);

  texture.needsUpdate = true;
  texture.minFilter =
    THREE.LinearFilter;
  texture.magFilter =
    THREE.LinearFilter;

  return texture;
}

function writeDustPosition(
  positions: Float32Array,
  index: number,
  particle: DustSeed,
  time: number,
  radius: number,
  ringWidth: number,
  ellipseX: number,
  ellipseY: number,
  wobble: number,
  seed: number,
) {
  const index3 =
    index * 3;

  const angle =
    particle.angle +
    time *
      particle.orbitSpeed +
    Math.sin(
      time * 0.18 +
      particle.phase,
    ) *
      0.012;

  const radialProgress =
    THREE.MathUtils.clamp(
      particle.radialProgress +
        Math.sin(
          time * 0.28 +
          particle.phase,
        ) *
          particle.radialPulse,
      0.015,
      0.985,
    );

  const localRadius =
    radius +
    (
      radialProgress -
      0.5
    ) *
      ringWidth;

  const localWobble =
    Math.sin(
      angle * 3 +
      seed * 0.73 +
      radialProgress * Math.PI,
    ) *
      wobble *
      0.4;

  const depthBreath =
    Math.sin(
      time * 0.22 +
      particle.phase,
    ) *
      ringWidth *
      0.02;

  positions[index3] =
    Math.cos(angle) *
    localRadius *
    ellipseX;

  positions[index3 + 1] =
    Math.sin(angle) *
    localRadius *
    ellipseY;

  positions[index3 + 2] =
    localWobble +
    particle.depth +
    depthBreath;
}

function createLayerRuntime(
  config: DustLayerConfig,
  layerIndex: number,
  pointTexture: THREE.Texture | null,
  baseColor: THREE.Color,
  radius: number,
  ringWidth: number,
  ellipseX: number,
  ellipseY: number,
  wobble: number,
  seed: number,
  opacity: number,
  glowFactor: number,
): DustLayerRuntime {
  const random =
    createSeededRandom(
      seed +
      41.73 +
      layerIndex * 17.19,
    );

  const positions =
    new Float32Array(
      config.count * 3,
    );

  const colors =
    new Float32Array(
      config.count * 3,
    );

  const particles:
    DustSeed[] = [];

  const paleCyan =
    new THREE.Color(
      0.68,
      0.92,
      1,
    );

  const softWhite =
    new THREE.Color(
      0.98,
      0.995,
      1,
    );

  const clusterCenters = [
    0.06,
    0.24,
    0.48,
    0.72,
    0.91,
  ];

  for (
    let index = 0;
    index < config.count;
    index += 1
  ) {
    const useCluster =
      random() <
      config.clusterChance;

    const clusterCenter =
      clusterCenters[
        Math.min(
          clusterCenters.length - 1,
          Math.floor(
            random() *
            clusterCenters.length,
          ),
        )
      ]!;

    const angleProgress =
      useCluster
        ? clusterCenter +
          randomRange(
            random,
            -0.038,
            0.038,
          )
        : random();

    const particle: DustSeed = {
      angle:
        angleProgress *
        Math.PI *
        2,
      radialProgress:
        chooseRingBand(random),
      phase:
        random() *
        Math.PI *
        2,
      orbitSpeed:
        randomRange(
          random,
          0.003,
          0.011,
        ) *
        (
          random() < 0.5
            ? -1
            : 1
        ),
      radialPulse:
        randomRange(
          random,
          0.002,
          0.008,
        ),
      depth:
        randomRange(
          random,
          -ringWidth * 0.12,
          ringWidth * 0.12,
        ),
    };

    particles.push(
      particle,
    );

    writeDustPosition(
      positions,
      index,
      particle,
      0,
      radius,
      ringWidth,
      ellipseX,
      ellipseY,
      wobble,
      seed,
    );

    const brightness =
      random();

    const particleColor =
      baseColor
        .clone()
        .lerp(
          paleCyan,
          THREE.MathUtils.clamp(
            config.colorMix +
              brightness * 0.08,
            0,
            1,
          ),
        )
        .lerp(
          softWhite,
          THREE.MathUtils.clamp(
            config.whiteMix +
              brightness * 0.08,
            0,
            1,
          ),
        );

    const index3 =
      index * 3;

    colors[index3] =
      particleColor.r;

    colors[index3 + 1] =
      particleColor.g;

    colors[index3 + 2] =
      particleColor.b;
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      positions,
      3,
    ),
  );

  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(
      colors,
      3,
    ),
  );

  geometry.computeBoundingSphere();

  const baseOpacity =
    THREE.MathUtils.clamp(
      config.opacity *
      opacity *
      glowFactor *
      1.36,
      0.18,
      0.92,
    );

  const material =
    new THREE.PointsMaterial({
      name:
        `PlanetRingDust-${config.name}`,
      map:
        pointTexture ?? undefined,
      color:
        0xffffff,
      vertexColors: true,
      size:
        config.size,
      sizeAttenuation: false,
      transparent: true,
      opacity:
        baseOpacity,
      alphaTest:
        pointTexture
          ? 0.012
          : 0,
      depthWrite: false,
      depthTest: true,
      blending:
        THREE.AdditiveBlending,
      toneMapped: false,
    });

  return {
    geometry,
    material,
    positions,
    particles,
    baseOpacity,
    phase:
      seed * 0.37 +
      layerIndex * 1.91,
  };
}

export default function PlanetRingDust({
  radius,
  thickness,
  ellipseX,
  ellipseY,
  wobble,
  seed,
  baseColor,
  opacity,
  speed,
  glowFactor,
}: PlanetRingDustProps) {
  const groupRef =
    useRef<THREE.Group>(null);

  const ringWidth =
    Math.max(
      thickness * 8.4,
      radius * 0.112,
    );

  const pointTexture =
    useMemo(
      () =>
        createSoftPointTexture(),
      [],
    );

  const layers =
    useMemo(
      () =>
        DUST_LAYERS.map(
          (
            config,
            layerIndex,
          ) =>
            createLayerRuntime(
              config,
              layerIndex,
              pointTexture,
              baseColor,
              radius,
              ringWidth,
              ellipseX,
              ellipseY,
              wobble,
              seed,
              opacity,
              glowFactor,
            ),
        ),
      [
        pointTexture,
        baseColor,
        radius,
        ringWidth,
        ellipseX,
        ellipseY,
        wobble,
        seed,
        opacity,
        glowFactor,
      ],
    );

  useEffect(() => {
    return () => {
      for (
        const layer of layers
      ) {
        layer.geometry.dispose();
        layer.material.dispose();
      }
    };
  }, [layers]);

  useEffect(() => {
    return () => {
      pointTexture?.dispose();
    };
  }, [pointTexture]);

  useFrame((state) => {
    const elapsed =
      state.clock.getElapsedTime();

    const safeSpeed =
      Math.max(
        speed,
        0.2,
      );

    const time =
      elapsed *
      safeSpeed;

    for (
      let layerIndex = 0;
      layerIndex < layers.length;
      layerIndex += 1
    ) {
      const layer =
        layers[layerIndex]!;

      for (
        let index = 0;
        index < layer.particles.length;
        index += 1
      ) {
        writeDustPosition(
          layer.positions,
          index,
          layer.particles[index]!,
          time,
          radius,
          ringWidth,
          ellipseX,
          ellipseY,
          wobble,
          seed,
        );
      }

      const positionAttribute =
        layer.geometry.getAttribute(
          'position',
        );

      positionAttribute.needsUpdate =
        true;

      const pulse =
        0.72 +
        0.28 *
          (
            0.5 +
            0.5 *
              Math.sin(
                time *
                  (
                    0.42 +
                    layerIndex * 0.09
                  ) +
                layer.phase,
              )
          );

      layer.material.opacity =
        layer.baseOpacity *
        pulse;
    }

    if (groupRef.current) {
      groupRef.current.rotation.z =
        Math.sin(
          time * 0.05 +
          seed,
        ) *
        0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {layers.map(
        (
          layer,
          layerIndex,
        ) => (
          <points
            key={
              DUST_LAYERS[
                layerIndex
              ]!.name
            }
            geometry={
              layer.geometry
            }
            material={
              layer.material
            }
            renderOrder={
              DUST_LAYERS[
                layerIndex
              ]!.renderOrder
            }
            frustumCulled={false}
          />
        ),
      )}
    </group>
  );
}