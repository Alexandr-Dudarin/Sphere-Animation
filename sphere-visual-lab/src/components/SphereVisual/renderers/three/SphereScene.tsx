import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type {
  GlowIntensity,
  SphereMode,
  SpherePresetConfig,
  SphereQuality,
} from '../../SphereVisual.types';

interface SphereSceneProps {
  presetConfig: SpherePresetConfig;
  mode: SphereMode;
  quality: SphereQuality;
  interactive: boolean;
  glowIntensity: GlowIntensity;
  speed: number;
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
}

export default function SphereScene({
  mode,
  speed,
  pointerX,
  pointerY,
  interactive,
  reducedMotion,
}: SphereSceneProps) {
  const rootRef = useRef<THREE.Group>(null);
  const discARef = useRef<THREE.Mesh>(null);
  const discBRef = useRef<THREE.Mesh>(null);
  const discCRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const safeSpeed = Math.max(speed, 0.15);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const pointerFactor = reducedMotion ? 0.06 : interactive ? 1 : 0.18;

    const targetRotX = pointerY * 0.28 * pointerFactor;
    const targetRotY = pointerX * 0.36 * pointerFactor;

    if (rootRef.current) {
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        targetRotX,
        0.08,
      );
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        targetRotY,
        0.08,
      );
      rootRef.current.rotation.z = THREE.MathUtils.lerp(
        rootRef.current.rotation.z,
        Math.sin(elapsed * 0.5 * safeSpeed) * 0.08,
        0.06,
      );
    }

    if (discARef.current) {
      discARef.current.rotation.z += delta * 1.2 * safeSpeed;
      discARef.current.rotation.x = Math.sin(elapsed * 0.8) * 0.25;
    }

    if (discBRef.current) {
      discBRef.current.rotation.z -= delta * 0.9 * safeSpeed;
      discBRef.current.rotation.y = Math.cos(elapsed * 0.7) * 0.22;
    }

    if (discCRef.current) {
      discCRef.current.rotation.z += delta * 1.6 * safeSpeed;
      discCRef.current.rotation.x = Math.cos(elapsed * 0.9) * 0.2;
    }

    if (knotRef.current) {
      knotRef.current.rotation.x += delta * 0.7 * safeSpeed;
      knotRef.current.rotation.y -= delta * 1.1 * safeSpeed;
      knotRef.current.rotation.z += delta * 0.45 * safeSpeed;
    }

    if (coreRef.current) {
      const pulse =
        1 + Math.sin(elapsed * 3.4 * safeSpeed) * 0.18 * (mode === 'idle' ? 0.5 : 1);
      coreRef.current.scale.setScalar(pulse);
    }

    if (haloRef.current) {
      const haloScale =
        1.02 + Math.sin(elapsed * 1.8 * safeSpeed) * 0.08 * (mode === 'searching' ? 1.2 : 1);
      haloRef.current.scale.setScalar(haloScale);
    }
  });

  return (
    <>
      <color attach="background" args={['#050813']} />

      <ambientLight intensity={0.5} />
      <pointLight position={[2.5, 2.2, 3]} color="#7ee7ff" intensity={3.4} />
      <pointLight position={[-2, -1.8, 2.4]} color="#b47cff" intensity={2.8} />
      <pointLight position={[0, 0, 1.6]} color="#ff63c7" intensity={2.2} />

      <group ref={rootRef}>
        <mesh ref={haloRef}>
          <sphereGeometry args={[1.45, 40, 40]} />
          <meshBasicMaterial
            color="#7ee7ff"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={discARef} position={[0, 0, -0.28]} rotation={[0.6, 0.1, 0]}>
          <circleGeometry args={[1.08, 80]} />
          <meshBasicMaterial
            color="#7ee7ff"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={discBRef} position={[0, 0, 0]} rotation={[-0.5, 0.2, 0.4]}>
          <circleGeometry args={[0.82, 80]} />
          <meshBasicMaterial
            color="#9d7bff"
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={discCRef} position={[0, 0, 0.22]} rotation={[0.3, -0.4, 0.2]}>
          <circleGeometry args={[0.56, 80]} />
          <meshBasicMaterial
            color="#ff63c7"
            transparent
            opacity={0.26}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={knotRef} scale={[1, 1, 0.65]}>
          <torusKnotGeometry args={[0.24, 0.07, 220, 28, 2, 3]} />
          <meshBasicMaterial
            color="#ffd166"
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.34, 28, 28]} />
          <meshBasicMaterial
            color="#7ee7ff"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={coreRef}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={new THREE.Color('#5dd9ff')}
            emissiveIntensity={3.4}
            roughness={0.06}
            metalness={0.02}
          />
        </mesh>
      </group>
    </>
  );
}