import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type DarkVortexMaskProps = {
  radius?: number;
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
  radius = 1.02,
  opacity = 0.28,
  color = '#050814',
  innerClearRadius = 0.2,
  outerRadius = 0.9,
  softness = 0.18,
  swirlStrength = 0.3,
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
      <circleGeometry args={[radius, 192]} />
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

            if (r > 1.0) {
              discard;
            }

            float swirlA = sin(a * 4.8 - r * 8.2 + uTime * 0.52) * 0.5 + 0.5;
            float swirlB = sin(a * 3.1 + r * 9.6 - uTime * 0.31) * 0.5 + 0.5;
            float swirl = mix(swirlA, swirlB, 0.42);

            float outerFade = 1.0 - smoothstep(
              uOuterRadius,
              uOuterRadius + uSoftness,
              r
            );

            float innerFade = smoothstep(
              uInnerClearRadius,
              uInnerClearRadius + uSoftness * 0.9,
              r
            );

            float baseMask = outerFade * innerFade;

            float structuredMask = mix(
              1.0,
              0.9 + swirl * 0.18,
              uSwirlStrength
            );

            float alpha = uOpacity * baseMask * structuredMask;

            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </mesh>
  );
}