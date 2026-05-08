import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
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

    const pulse = 0.99 + Math.sin(elapsed * 1.2 + pulseOffset) * 0.045;

    ref.current.position.copy(point);
    ref.current.scale.setScalar(pulse);
  });

  return (
    <group ref={ref}>
      <mesh renderOrder={8} scale={glowSize}>
        <sphereGeometry args={[size, 14, 14]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh renderOrder={9}>
        <sphereGeometry args={[size * 0.5, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.96}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}