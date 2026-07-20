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
    'rgba(255,255,255,1)',
  );

  gradient.addColorStop(
    0.15,
    'rgba(255,255,255,0.96)',
  );

  gradient.addColorStop(
    0.35,
    'rgba(255,255,255,0.46)',
  );

  gradient.addColorStop(
    0.64,
    'rgba(255,255,255,0.1)',
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
            0.16,
          )
          .multiplyScalar(
            0.92,
          ),
      [
        colors.accent,
        colors.glow,
      ],
    );

  const coreColor =
    useMemo(
      () =>
        colors.core
          .clone()
          .lerp(
            colors.hot,
            0.1,
          ),
      [
        colors.core,
        colors.hot,
      ],
    );

  const shellColor =
    useMemo(
      () =>
        colors.glow
          .clone()
          .lerp(
            colors.hot,
            0.06,
          ),
      [
        colors.glow,
        colors.hot,
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
            0.72 *
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
            0.14 *
            safeSpeed,
        ) *
        0.022;
    }

    if (shellRef.current) {
      shellRef.current.rotation.x =
        elapsed *
        0.055 *
        safeSpeed;

      shellRef.current.rotation.y =
        -elapsed *
        0.08 *
        safeSpeed;
    }
  });

  const resolvedCoreSize =
    coreSize *
    config.coreScale;

  return (
    <group>
      <ambientLight
        intensity={1.02}
      />

      <pointLight
        position={[
          2.4,
          1.8,
          3.2,
        ]}
        color={colors.hot}
        intensity={5.8}
        distance={7}
        decay={2}
      />

      <pointLight
        position={[
          -2.2,
          -1.3,
          2.5,
        ]}
        color={colors.glow}
        intensity={3.4}
        distance={6}
        decay={2}
      />

      <pointLight
        position={[
          0,
          0,
          0.25,
        ]}
        color={colors.glow}
        intensity={
          2.8 *
          glowFactor
        }
        distance={4.2}
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
                5.8,
              resolvedCoreSize *
                5.8,
              1,
            ]}
          >
            <spriteMaterial
              map={glowTexture}
              color={
                colors.glow
                  .clone()
                  .lerp(
                    colors.hot,
                    0.12,
                  )
              }
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
        >
          <sphereGeometry
            args={[
              resolvedCoreSize,
              sphereSegments,
              sphereSegments,
            ]}
          />

          <meshStandardMaterial
            color={coreColor}
            emissive={
              colors.glow
            }
            emissiveIntensity={
              1.55 *
              glowFactor
            }
            metalness={0.16}
            roughness={0.22}
            toneMapped={false}
          />
        </mesh>

        <mesh
          renderOrder={26}
          scale={1.24}
        >
          <sphereGeometry
            args={[
              resolvedCoreSize,
              sphereSegments,
              sphereSegments,
            ]}
          />

          <meshBasicMaterial
            color={shellColor}
            transparent
            opacity={
              0.075 *
              glowFactor
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
          ref={shellRef}
          renderOrder={27}
          scale={1.15}
        >
          <icosahedronGeometry
            args={[
              resolvedCoreSize,
              shellDetail,
            ]}
          />

          <meshPhysicalMaterial
            color={shellColor}
            emissive={
              colors.accent
            }
            emissiveIntensity={
              0.14 *
              glowFactor
            }
            metalness={0.24}
            roughness={0.18}
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

        <mesh
          renderOrder={28}
          scale={0.33}
        >
          <sphereGeometry
            args={[
              resolvedCoreSize,
              32,
              32,
            ]}
          />

          <meshBasicMaterial
            color={colors.hot}
            transparent
            opacity={0.9}
            blending={
              THREE.AdditiveBlending
            }
            depthWrite={false}
            depthTest
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}
