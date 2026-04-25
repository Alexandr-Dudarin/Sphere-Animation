import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type DarkVortexMaskProps = {
  size?: number;
  opacity?: number;
  color?: string;
  innerClearRadius?: number;
  outerRadius?: number;
  softness?: number;
  swirlStrength?: number;
  speed?: number;
  reducedMotion?: boolean;
  zOffset?: number;
};

export function DarkVortexMask({
  size = 1.9,
  opacity = 0.34,
  color = '#050814',
  innerClearRadius = 0.2,
  outerRadius = 0.92,
  softness = 0.22,
  swirlStrength = 0.42,
  speed = 1,
  reducedMotion = false,
  zOffset = 0.018,
}: DarkVortexMaskProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uColor: { value: new THREE.Color(color) },
      uInnerClearRadius: { value: innerClearRadius },
      uOuterRadius: { value: outerRadius },
      uSoftness: { value: softness },
      uSwirlStrength: { value: swirlStrength },
    }),
    [opacity, color, innerClearRadius, outerRadius, softness, swirlStrength],
  );

  useFrame((state) => {
    if (!materialRef.current) return;

    const motionFactor = reducedMotion ? 0.2 : 1;
    materialRef.current.uniforms.uTime.value =
      state.clock.getElapsedTime() * speed * motionFactor;
  });

  return (
    <mesh
      position={[0, 0, zOffset]}
      renderOrder={2}
      frustumCulled={false}
    >
      <planeGeometry args={[size, size, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        depthTest={true}
        blending={THREE.NormalBlending}
        side={THREE.DoubleSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uOpacity;
          uniform vec3 uColor;
          uniform float uInnerClearRadius;
          uniform float uOuterRadius;
          uniform float uSoftness;
          uniform float uSwirlStrength;

          varying vec2 vUv;

          void main() {
            vec2 uv = vUv * 2.0 - 1.0;
            float r = length(uv);
            float a = atan(uv.y, uv.x);

            float swirlA = sin(a * 5.0 - r * 8.5 + uTime * 0.55) * 0.5 + 0.5;
            float swirlB = sin(a * 3.2 + r * 10.0 - uTime * 0.32) * 0.5 + 0.5;
            float swirl = mix(swirlA, swirlB, 0.4);

            float ringStart = smoothstep(
              uInnerClearRadius,
              uInnerClearRadius + uSoftness * 0.45,
              r
            );

            float ringBody = smoothstep(uInnerClearRadius, uOuterRadius, r);
            float ringFade = 1.0 - smoothstep(
              uOuterRadius,
              uOuterRadius + uSoftness,
              r
            );

            float baseMask = ringBody * ringFade;
            float structuredMask = mix(1.0, 0.86 + swirl * 0.28, uSwirlStrength);

            float alpha = uOpacity * baseMask * structuredMask;

            // Центр оставляем в основном открытым
            alpha *= ringStart;

            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </mesh>
  );
}