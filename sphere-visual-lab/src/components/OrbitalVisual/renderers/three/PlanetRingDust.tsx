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
  density: number;
  size: number;
  brightness: number;
  motion: number;
  splitDepthLayers: boolean;
}

interface DustSeed {
  angle: number;
  radialProgress: number;
  phase: number;
  orbitSpeed: number;
  radialPulse: number;
  depth: number;
  color: THREE.Color;
}

interface DustLayerConfig {
  name: string;
  count: number;
  size: number;
  opacity: number;
  colorMix: number;
  whiteMix: number;
  backRenderOrder: number;
  frontRenderOrder: number;
  clusterChance: number;
}

interface DustLayerRuntime {
  frontGeometry: THREE.BufferGeometry;
  backGeometry: THREE.BufferGeometry;
  frontMaterial: THREE.PointsMaterial;
  backMaterial: THREE.PointsMaterial;
  frontPositions: Float32Array;
  backPositions: Float32Array;
  frontColors: Float32Array;
  backColors: Float32Array;
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
    backRenderOrder: 7,
    frontRenderOrder: 20,
    clusterChance: 0.42,
  },
  {
    name: 'glow',
    count: 42,
    size: 2.8,
    opacity: 0.72,
    colorMix: 0.8,
    whiteMix: 0.22,
    backRenderOrder: 8,
    frontRenderOrder: 21,
    clusterChance: 0.58,
  },
  {
    name: 'spark',
    count: 14,
    size: 4.4,
    opacity: 0.88,
    colorMix: 0.88,
    whiteMix: 0.52,
    backRenderOrder: 9,
    frontRenderOrder: 22,
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

  const textureSize = 64;
  const canvas =
    document.createElement('canvas');

  canvas.width = textureSize;
  canvas.height = textureSize;

  const context =
    canvas.getContext('2d');

  if (!context) {
    return null;
  }

  const center =
    textureSize / 2;

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
    textureSize,
    textureSize,
  );

  context.fillStyle =
    gradient;

  context.fillRect(
    0,
    0,
    textureSize,
    textureSize,
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
  target: THREE.Vector3,
  particle: DustSeed,
  time: number,
  radius: number,
  ringWidth: number,
  ellipseX: number,
  ellipseY: number,
  wobble: number,
  seed: number,
) {
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

  target.set(
    Math.cos(angle) *
      localRadius *
      ellipseX,
    Math.sin(angle) *
      localRadius *
      ellipseY,
    localWobble +
      particle.depth +
      depthBreath,
  );
}

function createDynamicGeometry(
  particleCount: number,
) {
  const positions =
    new Float32Array(
      particleCount * 3,
    );

  const colors =
    new Float32Array(
      particleCount * 3,
    );

  const positionAttribute =
    new THREE.BufferAttribute(
      positions,
      3,
    );

  const colorAttribute =
    new THREE.BufferAttribute(
      colors,
      3,
    );

  positionAttribute.setUsage(
    THREE.DynamicDrawUsage,
  );

  colorAttribute.setUsage(
    THREE.DynamicDrawUsage,
  );

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    positionAttribute,
  );

  geometry.setAttribute(
    'color',
    colorAttribute,
  );

  geometry.setDrawRange(
    0,
    0,
  );

  return {
    geometry,
    positions,
    colors,
  };
}

function createDustMaterial(
  name: string,
  pointTexture: THREE.Texture | null,
  size: number,
  opacity: number,
  depthTest: boolean,
) {
  return new THREE.PointsMaterial({
    name,
    map:
      pointTexture ?? undefined,
    color:
      0xffffff,
    vertexColors: true,
    size,
    sizeAttenuation: false,
    transparent: true,
    opacity,
    alphaTest:
      pointTexture
        ? 0.012
        : 0,
    depthWrite: false,
    depthTest,
    blending:
      THREE.AdditiveBlending,
    toneMapped: false,
  });
}

function createLayerRuntime(
  config: DustLayerConfig,
  layerIndex: number,
  pointTexture: THREE.Texture | null,
  baseColor: THREE.Color,
  ringWidth: number,
  seed: number,
  opacity: number,
  glowFactor: number,
  density: number,
  size: number,
  brightness: number,
): DustLayerRuntime {
  const random =
    createSeededRandom(
      seed +
      41.73 +
      layerIndex * 17.19,
    );

  const particleCount =
    Math.max(
      1,
      Math.round(
        config.count *
        Math.max(
          density,
          0,
        ),
      ),
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
    index < particleCount;
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

    const randomBrightness =
      random();

    const particleColor =
      baseColor
        .clone()
        .lerp(
          paleCyan,
          THREE.MathUtils.clamp(
            config.colorMix +
              randomBrightness * 0.08,
            0,
            1,
          ),
        )
        .lerp(
          softWhite,
          THREE.MathUtils.clamp(
            config.whiteMix +
              randomBrightness * 0.08,
            0,
            1,
          ),
        );

    particles.push({
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
      color:
        particleColor,
    });
  }

  const front =
    createDynamicGeometry(
      particleCount,
    );

  const back =
    createDynamicGeometry(
      particleCount,
    );

  const baseOpacity =
    THREE.MathUtils.clamp(
      config.opacity *
      opacity *
      glowFactor *
      brightness *
      1.36,
      0,
      0.95,
    );

  const pointSize =
    config.size *
    Math.max(
      size,
      0,
    );

  const frontMaterial =
    createDustMaterial(
      `PlanetRingDust-${config.name}-front`,
      pointTexture,
      pointSize,
      baseOpacity,
      false,
    );

  const backMaterial =
    createDustMaterial(
      `PlanetRingDust-${config.name}-back`,
      pointTexture,
      pointSize,
      baseOpacity,
      true,
    );

  return {
    frontGeometry:
      front.geometry,
    backGeometry:
      back.geometry,
    frontMaterial,
    backMaterial,
    frontPositions:
      front.positions,
    backPositions:
      back.positions,
    frontColors:
      front.colors,
    backColors:
      back.colors,
    particles,
    baseOpacity,
    phase:
      seed * 0.37 +
      layerIndex * 1.91,
  };
}

function writePackedParticle(
  positions: Float32Array,
  colors: Float32Array,
  packedIndex: number,
  position: THREE.Vector3,
  color: THREE.Color,
) {
  const index3 =
    packedIndex * 3;

  positions[index3] =
    position.x;

  positions[index3 + 1] =
    position.y;

  positions[index3 + 2] =
    position.z;

  colors[index3] =
    color.r;

  colors[index3 + 1] =
    color.g;

  colors[index3 + 2] =
    color.b;
}

function markGeometryUpdated(
  geometry: THREE.BufferGeometry,
  count: number,
) {
  geometry.setDrawRange(
    0,
    count,
  );

  const positionAttribute =
    geometry.getAttribute(
      'position',
    );

  const colorAttribute =
    geometry.getAttribute(
      'color',
    );

  positionAttribute.needsUpdate =
    true;

  colorAttribute.needsUpdate =
    true;
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
  density,
  size,
  brightness,
  motion,
  splitDepthLayers,
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
              ringWidth,
              seed,
              opacity,
              glowFactor,
              density,
              size,
              brightness,
            ),
        ),
      [
        pointTexture,
        baseColor,
        radius,
        ringWidth,
        seed,
        opacity,
        glowFactor,
        density,
        size,
        brightness,
      ],
    );

  useEffect(() => {
    return () => {
      for (
        const layer of layers
      ) {
        layer.frontGeometry.dispose();
        layer.backGeometry.dispose();
        layer.frontMaterial.dispose();
        layer.backMaterial.dispose();
      }
    };
  }, [layers]);

  useEffect(() => {
    return () => {
      pointTexture?.dispose();
    };
  }, [pointTexture]);

  const localPosition =
    useMemo(
      () =>
        new THREE.Vector3(),
      [],
    );

  const worldPosition =
    useMemo(
      () =>
        new THREE.Vector3(),
      [],
    );

  const viewPosition =
    useMemo(
      () =>
        new THREE.Vector3(),
      [],
    );

  const centerViewPosition =
    useMemo(
      () =>
        new THREE.Vector3(),
      [],
    );

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed =
      state.clock.getElapsedTime();

    const safeSpeed =
      Math.max(
        speed,
        0.2,
      );

    const safeMotion =
      Math.max(
        motion,
        0,
      );

    const time =
      elapsed *
      safeSpeed *
      safeMotion;

    groupRef.current.rotation.z =
      Math.sin(
        time * 0.05 +
        seed,
      ) *
      0.002;

    groupRef.current.updateWorldMatrix(
      true,
      false,
    );

    centerViewPosition
      .set(0, 0, 0)
      .applyMatrix4(
        groupRef.current.matrixWorld,
      )
      .applyMatrix4(
        state.camera.matrixWorldInverse,
      );

    for (
      let layerIndex = 0;
      layerIndex < layers.length;
      layerIndex += 1
    ) {
      const layer =
        layers[layerIndex]!;

      let frontCount = 0;
      let backCount = 0;

      for (
        let index = 0;
        index < layer.particles.length;
        index += 1
      ) {
        const particle =
          layer.particles[index]!;

        writeDustPosition(
          localPosition,
          particle,
          time,
          radius,
          ringWidth,
          ellipseX,
          ellipseY,
          wobble,
          seed,
        );

        worldPosition
          .copy(localPosition)
          .applyMatrix4(
            groupRef.current.matrixWorld,
          );

        viewPosition
          .copy(worldPosition)
          .applyMatrix4(
            state.camera.matrixWorldInverse,
          );

        const isFront =
          splitDepthLayers &&
          viewPosition.z -
            centerViewPosition.z >=
            0;

        if (isFront) {
          writePackedParticle(
            layer.frontPositions,
            layer.frontColors,
            frontCount,
            localPosition,
            particle.color,
          );

          frontCount += 1;
        } else {
          writePackedParticle(
            layer.backPositions,
            layer.backColors,
            backCount,
            localPosition,
            particle.color,
          );

          backCount += 1;
        }
      }

      markGeometryUpdated(
        layer.frontGeometry,
        frontCount,
      );

      markGeometryUpdated(
        layer.backGeometry,
        backCount,
      );

      const pulse =
        0.72 +
        0.28 *
          (
            0.5 +
            0.5 *
              Math.sin(
                elapsed *
                  safeSpeed *
                  (
                    0.42 +
                    layerIndex * 0.09
                  ) +
                layer.phase,
              )
          );

      const currentOpacity =
        layer.baseOpacity *
        pulse;

      layer.frontMaterial.opacity =
        currentOpacity;

      layer.backMaterial.opacity =
        currentOpacity;
    }
  });

  return (
    <group ref={groupRef}>
      {layers.map(
        (
          layer,
          layerIndex,
        ) => {
          const config =
            DUST_LAYERS[
              layerIndex
            ]!;

          return (
            <group
              key={config.name}
            >
              <points
                geometry={
                  layer.backGeometry
                }
                material={
                  layer.backMaterial
                }
                renderOrder={
                  config.backRenderOrder
                }
                frustumCulled={false}
              />

              <points
                geometry={
                  layer.frontGeometry
                }
                material={
                  layer.frontMaterial
                }
                renderOrder={
                  config.frontRenderOrder
                }
                frustumCulled={false}
              />
            </group>
          );
        },
      )}
    </group>
  );
}
