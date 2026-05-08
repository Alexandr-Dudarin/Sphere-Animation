import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import OrbitalNode from './OrbitalNode';
import { createOrbitGeometry } from './orbitGeometry';

interface OrbitNodeConfig {
  size: number;
  glowSize: number;
  speed: number;
  offset: number;
  pulseOffset: number;
  opacity: number;
}

interface OrbitRibbonProps {
  radius: number;
  thickness: number;
  ellipseX: number;
  ellipseY: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  wobble: number;
  seed: number;
  baseColor: THREE.Color;
  hotColor: THREE.Color;
  opacity: number;
  flowSpeed: number;
  shimmerSpeed: number;
  rotationSpeed: number;
  offset: number;
  speed: number;
  glowFactor: number;
  nodes?: OrbitNodeConfig[];
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
  uniform float uShimmerSpeed;
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
      0.9 +
      0.1 * sin(vUv.x * 18.0 - uTime * uShimmerSpeed + uOffset * 6.2831);
    float shimmer =
      0.98 +
      0.02 *
        sin(vUv.x * 32.0 - uTime * (uShimmerSpeed + 0.22) + uOffset * 4.0);

    vec3 color = mix(uBaseColor, uHotColor, pulse * 0.9);
    float alpha = uOpacity * band * (0.86 + pulse * 0.76) * body * shimmer;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function OrbitRibbon({
  radius,
  thickness,
  ellipseX,
  ellipseY,
  tiltX,
  tiltY,
  tiltZ,
  wobble,
  seed,
  baseColor,
  hotColor,
  opacity,
  flowSpeed,
  shimmerSpeed,
  //rotationSpeed,
  offset,
  speed,
  glowFactor,
  nodes = [],
}: OrbitRibbonProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(
    () =>
      createOrbitGeometry(radius, thickness, wobble, seed, ellipseX, ellipseY),
    [radius, thickness, wobble, seed, ellipseX, ellipseY],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity * glowFactor },
      uFlowSpeed: { value: flowSpeed },
      uShimmerSpeed: { value: shimmerSpeed },
      uOffset: { value: offset },
      uBaseColor: { value: baseColor.clone() },
      uHotColor: { value: hotColor.clone() },
    }),
    [
      opacity,
      glowFactor,
      flowSpeed,
      shimmerSpeed,
      offset,
      baseColor,
      hotColor,
    ],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const safeSpeed = Math.max(speed, 0.2);
    const phase = seed * 0.17;

    if (groupRef.current) {
      // Для static atom полностью фиксируем ориентацию орбиты.
      groupRef.current.rotation.set(tiltX, tiltY, tiltZ);
      groupRef.current.scale.setScalar(1);
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed * safeSpeed;
      materialRef.current.uniforms.uOpacity.value =
        opacity *
        glowFactor *
        (0.992 + Math.sin(elapsed * 0.24 * safeSpeed + phase) * 0.01);
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

      {nodes.map((node, index) => (
        <OrbitalNode
          key={`${seed}-node-${index}`}
          radius={radius}
          wobble={wobble}
          seed={seed}
          ellipseX={ellipseX}
          ellipseY={ellipseY}
          size={node.size}
          glowSize={node.glowSize}
          speed={node.speed * speed}
          offset={node.offset}
          pulseOffset={node.pulseOffset}
          color={hotColor}
          glowColor={baseColor}
          opacity={node.opacity * glowFactor}
        />
      ))}
    </group>
  );
}