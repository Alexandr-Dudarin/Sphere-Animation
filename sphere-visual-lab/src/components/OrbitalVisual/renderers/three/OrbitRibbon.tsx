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
  splitDepthLayers?: boolean;
  nodes?: OrbitNodeConfig[];
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  varying float vViewZ;
  varying float vCenterViewZ;

  void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 centerMvPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);

    vViewZ = mvPosition.z;
    vCenterViewZ = centerMvPosition.z;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uFlowSpeed;
  uniform float uShimmerSpeed;
  uniform float uOffset;
  uniform float uDepthSide;
  uniform vec3 uBaseColor;
  uniform vec3 uHotColor;

  varying vec2 vUv;
  varying float vViewZ;
  varying float vCenterViewZ;

  float loopDistance(float a, float b) {
    float d = abs(a - b);
    return min(d, 1.0 - d);
  }

  void main() {
    // uDepthSide:
    //  0.0  -> full ring
    //  1.0  -> front half only
    // -1.0  -> back half only

    if (uDepthSide > 0.5) {
      // Front: ближе к камере, чем центр планеты
      if (vViewZ < vCenterViewZ) {
        discard;
      }
    } else if (uDepthSide < -0.5) {
      // Back: дальше от камеры, чем центр планеты
      if (vViewZ >= vCenterViewZ) {
        discard;
      }
    }

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

function createUniforms(
  opacity: number,
  glowFactor: number,
  flowSpeed: number,
  shimmerSpeed: number,
  offset: number,
  baseColor: THREE.Color,
  hotColor: THREE.Color,
  depthSide: number,
) {
  return {
    uTime: { value: 0 },
    uOpacity: { value: opacity * glowFactor },
    uFlowSpeed: { value: flowSpeed },
    uShimmerSpeed: { value: shimmerSpeed },
    uOffset: { value: offset },
    uDepthSide: { value: depthSide },
    uBaseColor: { value: baseColor.clone() },
    uHotColor: { value: hotColor.clone() },
  };
}

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
  // rotationSpeed,
  offset,
  speed,
  glowFactor,
  splitDepthLayers = false,
  nodes = [],
}: OrbitRibbonProps) {
  const groupRef = useRef<THREE.Group>(null);

  const fullMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const frontMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const backMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(
    () =>
      createOrbitGeometry(radius, thickness, wobble, seed, ellipseX, ellipseY),
    [radius, thickness, wobble, seed, ellipseX, ellipseY],
  );

  const fullUniforms = useMemo(
    () =>
      createUniforms(
        opacity,
        glowFactor,
        flowSpeed,
        shimmerSpeed,
        offset,
        baseColor,
        hotColor,
        0,
      ),
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

  const frontUniforms = useMemo(
    () =>
      createUniforms(
        opacity,
        glowFactor,
        flowSpeed,
        shimmerSpeed,
        offset,
        baseColor,
        hotColor,
        1,
      ),
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

  const backUniforms = useMemo(
    () =>
      createUniforms(
        opacity,
        glowFactor,
        flowSpeed,
        shimmerSpeed,
        offset,
        baseColor,
        hotColor,
        -1,
      ),
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
    const animatedOpacity =
      opacity *
      glowFactor *
      (0.992 + Math.sin(elapsed * 0.24 * safeSpeed + phase) * 0.01);

    if (groupRef.current) {
      // Для static object фиксируем ориентацию орбиты.
      groupRef.current.rotation.set(tiltX, tiltY, tiltZ);
      groupRef.current.scale.setScalar(1);
    }

    if (fullMaterialRef.current) {
      fullMaterialRef.current.uniforms.uTime.value = elapsed * safeSpeed;
      fullMaterialRef.current.uniforms.uOpacity.value = animatedOpacity;
    }

    if (frontMaterialRef.current) {
      frontMaterialRef.current.uniforms.uTime.value = elapsed * safeSpeed;
      frontMaterialRef.current.uniforms.uOpacity.value = animatedOpacity;
    }

    if (backMaterialRef.current) {
      backMaterialRef.current.uniforms.uTime.value = elapsed * safeSpeed;
      backMaterialRef.current.uniforms.uOpacity.value = animatedOpacity;
    }
  });

  return (
    <group ref={groupRef}>
      {!splitDepthLayers ? (
        <mesh geometry={geometry} renderOrder={6}>
          <shaderMaterial
            ref={fullMaterialRef}
            uniforms={fullUniforms}
            vertexShader={VERTEX_SHADER}
            fragmentShader={FRAGMENT_SHADER}
            transparent
            depthWrite={false}
            depthTest
            toneMapped={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ) : (
        <>
          {/* Задняя половина кольца */}
          <mesh geometry={geometry} renderOrder={6}>
            <shaderMaterial
              ref={backMaterialRef}
              uniforms={backUniforms}
              vertexShader={VERTEX_SHADER}
              fragmentShader={FRAGMENT_SHADER}
              transparent
              depthWrite={false}
              depthTest
              toneMapped={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Передняя половина кольца */}
          <mesh geometry={geometry} renderOrder={18}>
            <shaderMaterial
              ref={frontMaterialRef}
              uniforms={frontUniforms}
              vertexShader={VERTEX_SHADER}
              fragmentShader={FRAGMENT_SHADER}
              transparent
              depthWrite={false}
              depthTest={false}
              toneMapped={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      )}

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