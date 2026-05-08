import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { sampleOrbitPoint } from './orbitGeometry';

interface OrbitalNodeProps {
  radius: number;
  wobble: number;
  seed: number;
  ellipseX: number;
  ellipseY: number;
  size: number;
  glowSize: number;
  speed: number;
  offset: number;
  pulseOffset: number;
  color: THREE.Color;
  glowColor: THREE.Color;
  opacity: number;
}

function createNodeGlowTexture() {
  if (typeof document === 'undefined') {
    return null;
  }

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const center = size / 2;
  const gradient = context.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    center,
  );

  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.16, 'rgba(255,255,255,0.98)');
  gradient.addColorStop(0.34, 'rgba(255,255,255,0.58)');
  gradient.addColorStop(0.62, 'rgba(255,255,255,0.18)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  context.clearRect(0, 0, size, size);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return texture;
}

export default function OrbitalNode({
  radius,
  wobble,
  seed,
  ellipseX,
  ellipseY,
  size,
  glowSize,
  speed,
  offset,
  pulseOffset,
  color,
  glowColor,
  opacity,
}: OrbitalNodeProps) {
  const ref = useRef<THREE.Group>(null);
  const glowMaterialRef = useRef<THREE.SpriteMaterial>(null);
  const shellMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const coreMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  const glowTexture = useMemo(() => createNodeGlowTexture(), []);

  useEffect(() => {
    return () => {
      glowTexture?.dispose();
    };
  }, [glowTexture]);

  const auraColor = useMemo(
    () => glowColor.clone().lerp(color, 0.12),
    [glowColor, color],
  );

  const shellColor = useMemo(
    () => glowColor.clone().lerp(color, 0.38),
    [glowColor, color],
  );

  const coreColor = useMemo(
    () => color.clone().lerp(new THREE.Color(1, 1, 1), 0.28),
    [color],
  );

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    const progress = (elapsed * speed + offset) % 1;

    const point = sampleOrbitPoint(progress * Math.PI * 2, {
      radius,
      wobble,
      seed,
      ellipseX,
      ellipseY,
    });

    const pulse = 1 + Math.sin(elapsed * 1.55 + pulseOffset) * 0.055;
    const flicker = 0.96 + Math.sin(elapsed * 2.3 + pulseOffset * 1.7) * 0.05;

    ref.current.position.copy(point);
    ref.current.scale.setScalar(pulse);

    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = opacity * 1.12 * flicker;
    }

    if (shellMaterialRef.current) {
      shellMaterialRef.current.opacity = 0.92 * flicker;
    }

    if (coreMaterialRef.current) {
      coreMaterialRef.current.opacity = 0.98 * flicker;
    }
  });

  return (
    <group ref={ref}>
      {glowTexture ? (
        <sprite
          renderOrder={8}
          scale={[size * glowSize * 10, size * glowSize * 10, 1]}
        >
          <spriteMaterial
            ref={glowMaterialRef}
            map={glowTexture}
            color={auraColor}
            transparent
            opacity={opacity * 1.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      ) : null}

      <mesh renderOrder={9}>
        <sphereGeometry args={[size * 2.5, 20, 20]} />
        <meshBasicMaterial
          ref={shellMaterialRef}
          color={shellColor}
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh renderOrder={10}>
        <sphereGeometry args={[size * 1.5, 18, 18]} />
        <meshBasicMaterial
          ref={coreMaterialRef}
          color={coreColor}
          transparent
          opacity={0.98}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}