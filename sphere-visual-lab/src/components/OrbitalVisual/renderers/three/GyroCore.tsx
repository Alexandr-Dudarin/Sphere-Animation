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
    'rgba(255,255,255,0.96)',
  );

  gradient.addColorStop(
    0.12,
    'rgba(255,255,255,0.82)',
  );

  gradient.addColorStop(
    0.3,
    'rgba(255,255,255,0.34)',
  );

  gradient.addColorStop(
    0.58,
    'rgba(255,255,255,0.07)',
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
            0.12,
          )
          .multiplyScalar(
            1.02,
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
            0.58,
          )
          .multiplyScalar(
            0.78,
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
            0.16,
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
            0.18,
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
            0.58 *
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
            0.11 *
            safeSpeed,
        ) *
        0.014;
    }

    if (shellRef.current) {
      shellRef.current.rotation.x =
        elapsed *
        0.035 *
        safeSpeed;

      shellRef.current.rotation.y =
        -elapsed *
        0.052 *
        safeSpeed;
    }
  });

  const resolvedCoreSize =
    coreSize *
    config.coreScale;

  return (
    <group>
      <hemisphereLight
        color={colors.hot}
        groundColor={
          colors.accent
        }
        intensity={1.15}
      />

      <directionalLight
        position={[
          2.8,
          2.3,
          3.6,
        ]}
        color={colors.hot}
        intensity={2.4}
      />

      <directionalLight
        position={[
          -2.3,
          -1.2,
          2.1,
        ]}
        color={colors.glow}
        intensity={1.25}
      />

      <pointLight
        position={[
          0,
          0,
          0.24,
        ]}
        color={colors.glow}
        intensity={
          1.35 *
          glowFactor
        }
        distance={3.5}
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
                4.5,
              resolvedCoreSize *
                4.5,
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
              0.26 *
              glowFactor
            }
            metalness={0.18}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.86}
            depthWrite
            depthTest
            toneMapped={false}
          />
        </mesh>

        <mesh
          renderOrder={26}
          scale={0.62}
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
              1.1 *
              glowFactor
            }
            metalness={0.02}
            roughness={0.14}
            clearcoat={0.9}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.92}
            depthWrite={false}
            depthTest
            toneMapped={false}
          />
        </mesh>

        <mesh
          renderOrder={27}
          scale={0.24}
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
            opacity={0.88}
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
          renderOrder={28}
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
