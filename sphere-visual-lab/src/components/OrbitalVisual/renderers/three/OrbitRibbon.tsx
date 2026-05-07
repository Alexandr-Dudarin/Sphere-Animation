import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface OrbitRibbonProps {
  radius: number;
  thickness: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  wobble: number;
  seed: number;
  baseColor: THREE.Color;
  hotColor: THREE.Color;
  opacity: number;
  flowSpeed: number;
  rotationSpeed: number;
  offset: number;
  speed: number;
  glowFactor: number;
}

const VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uFlowSpeed;
  uniform float uOffset;
  uniform vec3 uBaseColor;
  uniform vec3 uHotColor;

  varying vec2 vUv;

  float loopDistance(float a, float b) {
    float d = abs(a - b);
    return min(d, 1.0 - d);
  }

  void main() {
    float along = fract(vUv.x - uTime * uFlowSpeed + uOffset);

    float head = exp(-pow(loopDistance(along, 0.18) / 0.05, 2.0));
    float tail = exp(-pow(loopDistance(along, 0.26) / 0.16, 2.0)) * 0.58;
    float pulse = clamp(head + tail, 0.0, 1.0);

    float band = pow(1.0 - abs(vUv.y - 0.5) * 2.0, 0.58);
    float body =
      0.86 +
      0.14 * sin(vUv.x * 18.0 - uTime * 0.9 + uOffset * 6.2831);
    float shimmer =
      0.96 +
      0.04 * sin(vUv.x * 32.0 - uTime * 1.15 + uOffset * 4.0);

    vec3 color = mix(uBaseColor, uHotColor, pulse * 0.92);
    float alpha = uOpacity * band * (0.78 + pulse * 0.9) * body * shimmer;

    gl_FragColor = vec4(color, alpha);
  }
`;

function createOrbitGeometry(
  radius: number,
  thickness: number,
  wobble: number,
  seed: number,
) {
  const points: THREE.Vector3[] = [];
  const segments = 200;

  const ellipseX = 1 + Math.sin(seed * 0.61) * 0.035;
  const ellipseY = 1 + Math.cos(seed * 0.53) * 0.03;

  for (let i = 0; i < segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;

    const harmonicA = Math.sin(t * 2 + seed * 0.73) * wobble * 0.035;
    const harmonicB = Math.cos(t * 4 - seed * 0.41) * wobble * 0.018;
    const radial = radius * (1 + harmonicA + harmonicB);

    const x = Math.cos(t) * radial * ellipseX;
    const y = Math.sin(t) * radial * ellipseY;
    const z =
      Math.sin(t * 2 + seed * 0.37) * radius * wobble * 0.045 +
      Math.cos(t * 3 - seed * 0.21) * radius * wobble * 0.018;

    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.42);

  return new THREE.TubeGeometry(curve, 260, thickness, 18, true);
}

export default function OrbitRibbon({
  radius,
  thickness,
  tiltX,
  tiltY,
  tiltZ,
  wobble,
  seed,
  baseColor,
  hotColor,
  opacity,
  flowSpeed,
  rotationSpeed,
  offset,
  speed,
  glowFactor,
}: OrbitRibbonProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(
    () => createOrbitGeometry(radius, thickness, wobble, seed),
    [radius, thickness, wobble, seed],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity * glowFactor },
      uFlowSpeed: { value: flowSpeed },
      uOffset: { value: offset },
      uBaseColor: { value: baseColor.clone() },
      uHotColor: { value: hotColor.clone() },
    }),
    [opacity, glowFactor, flowSpeed, offset, baseColor, hotColor],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const safeSpeed = Math.max(speed, 0.15);
    const phase = seed * 0.17;

    if (groupRef.current) {
      groupRef.current.rotation.x =
        tiltX + Math.sin(elapsed * 0.22 + phase) * 0.012;
      groupRef.current.rotation.y =
        tiltY + Math.cos(elapsed * 0.2 + phase * 1.3) * 0.012;
      groupRef.current.rotation.z = tiltZ + elapsed * rotationSpeed * safeSpeed;

      const scale = 1 + Math.sin(elapsed * 0.48 + phase) * 0.004;
      groupRef.current.scale.setScalar(scale);
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed * safeSpeed;
      materialRef.current.uniforms.uOpacity.value =
        opacity *
        glowFactor *
        (0.98 + Math.sin(elapsed * 0.55 + phase) * 0.03);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} renderOrder={6}>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}