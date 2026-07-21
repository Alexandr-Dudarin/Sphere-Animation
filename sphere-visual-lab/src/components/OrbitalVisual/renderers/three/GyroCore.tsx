import { useFrame } from '@react-three/fiber';
import {
  useEffect,
  useMemo,
  useRef,
} from 'react';
import * as THREE from 'three';
import type {
  OrbitalGyroPresetConfig,
  OrbitalQuality,
} from '../../OrbitalVisual.types';
import GyroRing from './GyroRing';

interface GyroCoreColors {
  core: THREE.Color;
  glow: THREE.Color;
  accent: THREE.Color;
  hot: THREE.Color;
}

interface GyroCoreProps {
  coreSize: number;
  config: OrbitalGyroPresetConfig;
  colors: GyroCoreColors;
  quality: OrbitalQuality;
  speed: number;
  glowFactor: number;
}

function createCoreGlowTexture() {
  if (
    typeof document ===
    'undefined'
  ) {
    return null;
  }

  const textureSize = 256;
  const canvas =
    document.createElement(
      'canvas',
    );

  canvas.width =
    textureSize;

  canvas.height =
    textureSize;

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
    'rgba(255,255,255,0.9)',
  );

  gradient.addColorStop(
    0.12,
    'rgba(255,255,255,0.76)',
  );

  gradient.addColorStop(
    0.3,
    'rgba(255,255,255,0.28)',
  );

  gradient.addColorStop(
    0.58,
    'rgba(255,255,255,0.055)',
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
    new THREE.CanvasTexture(
      canvas,
    );

  texture.needsUpdate =
    true;

  texture.minFilter =
    THREE.LinearFilter;

  texture.magFilter =
    THREE.LinearFilter;

  return texture;
}

function getSphereSegments(
  quality: OrbitalQuality,
) {
  switch (quality) {
    case 'low':
      return 32;

    case 'high':
      return 64;

    default:
      return 48;
  }
}

function getShellDetail(
  quality: OrbitalQuality,
) {
  switch (quality) {
    case 'low':
      return 1;

    case 'high':
      return 2;

    default:
      return 1;
  }
}

export default function GyroCore({
  coreSize,
  config,
  colors,
  quality,
  speed,
  glowFactor,
}: GyroCoreProps) {
  const coreRef =
    useRef<THREE.Group>(null);

  const shellRef =
    useRef<THREE.Mesh>(null);

  const energyRef =
    useRef<THREE.Group>(null);

  const glowTexture =
    useMemo(
      () =>
        createCoreGlowTexture(),
      [],
    );

  const sphereSegments =
    getSphereSegments(quality);

  const shellDetail =
    getShellDetail(quality);

  const metalColor =
    useMemo(
      () =>
        colors.accent
          .clone()
          .lerp(
            colors.glow,
            0.16,
          )
          .multiplyScalar(
            1.12,
          ),
      [
        colors.accent,
        colors.glow,
      ],
    );

  const shellSurfaceColor =
    useMemo(
      () =>
        colors.accent
          .clone()
          .lerp(
            colors.glow,
            0.5,
          )
          .multiplyScalar(
            0.82,
          ),
      [
        colors.accent,
        colors.glow,
      ],
    );

  const energyColor =
    useMemo(
      () =>
        colors.core
          .clone()
          .lerp(
            colors.hot,
            0.18,
          ),
      [
        colors.core,
        colors.hot,
      ],
    );

  const hotColor =
    useMemo(
      () =>
        colors.hot
          .clone()
          .lerp(
            colors.glow,
            0.16,
          ),
      [
        colors.hot,
        colors.glow,
      ],
    );

  useEffect(() => {
    return () => {
      glowTexture?.dispose();
    };
  }, [glowTexture]);

  useFrame((state) => {
    const elapsed =
      state.clock.getElapsedTime();

    const safeSpeed =
      Math.max(
        speed,
        0.2,
      );

    if (coreRef.current) {
      const pulse =
        1 +
        Math.sin(
          elapsed *
            0.54 *
            safeSpeed,
        ) *
          config.corePulse;

      coreRef.current.scale.setScalar(
        pulse,
      );

      coreRef.current.rotation.y =
        elapsed *
        config.coreRotationSpeed *
        safeSpeed;

      coreRef.current.rotation.z =
        Math.sin(
          elapsed *
            0.1 *
            safeSpeed,
        ) *
        0.012;
    }

    if (shellRef.current) {
      shellRef.current.rotation.x =
        elapsed *
        0.032 *
        safeSpeed;

      shellRef.current.rotation.y =
        -elapsed *
        0.046 *
        safeSpeed;
    }

    if (energyRef.current) {
      energyRef.current.rotation.x =
        elapsed *
        0.16 *
        safeSpeed;

      energyRef.current.rotation.y =
        -elapsed *
        0.21 *
        safeSpeed;

      energyRef.current.rotation.z =
        elapsed *
        0.11 *
        safeSpeed;
    }
  });

  const resolvedCoreSize =
    coreSize *
    config.coreScale;

  const energyLoopRadius =
    resolvedCoreSize * 0.42;

  const energyLoopThickness =
    Math.max(
      resolvedCoreSize * 0.018,
      0.004,
    );

  return (
    <group>
      <hemisphereLight
        color={colors.hot}
        groundColor={
          colors.accent
        }
        intensity={1.32}
      />

      <directionalLight
        position={[
          2.8,
          2.3,
          3.6,
        ]}
        color={colors.hot}
        intensity={2.75}
      />

      <directionalLight
        position={[
          -2.3,
          -1.2,
          2.1,
        ]}
        color={colors.glow}
        intensity={1.45}
      />

      <pointLight
        position={[
          0,
          0,
          0.24,
        ]}
        color={colors.glow}
        intensity={
          1.55 *
          glowFactor
        }
        distance={3.8}
        decay={2}
      />

      {config.rings.map(
        (
          ring,
          ringIndex,
        ) => (
          <GyroRing
            key={ringIndex}
            config={ring}
            colors={{
              metal:
                metalColor,
              glow:
                colors.glow,
              hot:
                colors.hot,
            }}
            quality={quality}
            speed={speed}
            glowFactor={
              glowFactor
            }
            index={ringIndex}
          />
        ),
      )}

      <group ref={coreRef}>
        {glowTexture ? (
          <sprite
            renderOrder={24}
            scale={[
              resolvedCoreSize *
                4.25,
              resolvedCoreSize *
                4.25,
              1,
            ]}
          >
            <spriteMaterial
              map={glowTexture}
              color={colors.glow}
              transparent
              opacity={
                config.coreGlowOpacity *
                glowFactor
              }
              blending={
                THREE.AdditiveBlending
              }
              depthWrite={false}
              depthTest
              toneMapped={false}
            />
          </sprite>
        ) : null}

        <mesh
          renderOrder={25}
          scale={1.08}
        >
          <sphereGeometry
            args={[
              resolvedCoreSize,
              sphereSegments,
              sphereSegments,
            ]}
          />

          <meshPhysicalMaterial
            color={
              shellSurfaceColor
            }
            emissive={
              colors.glow
            }
            emissiveIntensity={
              0.2 *
              glowFactor
            }
            metalness={0.14}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.74}
            depthWrite={false}
            depthTest
            toneMapped={false}
          />
        </mesh>

        <group ref={energyRef}>
          <mesh
            rotation={[
              Math.PI / 2,
              0,
              0,
            ]}
            renderOrder={26}
          >
            <torusGeometry
              args={[
                energyLoopRadius,
                energyLoopThickness,
                8,
                48,
              ]}
            />

            <meshBasicMaterial
              color={colors.glow}
              transparent
              opacity={
                THREE.MathUtils.clamp(
                  0.46 *
                    glowFactor,
                  0,
                  0.68,
                )
              }
              blending={
                THREE.AdditiveBlending
              }
              depthWrite={false}
              depthTest
              toneMapped={false}
            />
          </mesh>

          <mesh
            rotation={[
              0.82,
              0.62,
              0.34,
            ]}
            renderOrder={26}
          >
            <torusGeometry
              args={[
                energyLoopRadius *
                  0.92,
                energyLoopThickness,
                8,
                48,
              ]}
            />

            <meshBasicMaterial
              color={hotColor}
              transparent
              opacity={
                THREE.MathUtils.clamp(
                  0.34 *
                    glowFactor,
                  0,
                  0.52,
                )
              }
              blending={
                THREE.AdditiveBlending
              }
              depthWrite={false}
              depthTest
              toneMapped={false}
            />
          </mesh>

          <mesh
            rotation={[
              -0.66,
              0.3,
              -0.72,
            ]}
            renderOrder={26}
          >
            <torusGeometry
              args={[
                energyLoopRadius *
                  0.78,
                energyLoopThickness *
                  0.86,
                8,
                44,
              ]}
            />

            <meshBasicMaterial
              color={colors.core}
              transparent
              opacity={
                THREE.MathUtils.clamp(
                  0.3 *
                    glowFactor,
                  0,
                  0.46,
                )
              }
              blending={
                THREE.AdditiveBlending
              }
              depthWrite={false}
              depthTest
              toneMapped={false}
            />
          </mesh>
        </group>

        <mesh
          renderOrder={27}
          scale={0.58}
        >
          <icosahedronGeometry
            args={[
              resolvedCoreSize,
              quality === 'high'
                ? 2
                : 1,
            ]}
          />

          <meshPhysicalMaterial
            color={energyColor}
            emissive={
              colors.glow
            }
            emissiveIntensity={
              0.9 *
              glowFactor
            }
            metalness={0.02}
            roughness={0.14}
            clearcoat={0.88}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.82}
            depthWrite={false}
            depthTest
            toneMapped={false}
          />
        </mesh>

        <mesh
          renderOrder={28}
          scale={0.18}
        >
          <sphereGeometry
            args={[
              resolvedCoreSize,
              32,
              32,
            ]}
          />

          <meshBasicMaterial
            color={hotColor}
            transparent
            opacity={0.82}
            blending={
              THREE.AdditiveBlending
            }
            depthWrite={false}
            depthTest
            toneMapped={false}
          />
        </mesh>

        <mesh
          ref={shellRef}
          renderOrder={29}
          scale={1.18}
        >
          <icosahedronGeometry
            args={[
              resolvedCoreSize,
              shellDetail,
            ]}
          />

          <meshBasicMaterial
            color={colors.glow}
            transparent
            opacity={
              config.coreShellOpacity
            }
            wireframe
            depthWrite={false}
            depthTest
            blending={
              THREE.AdditiveBlending
            }
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}
