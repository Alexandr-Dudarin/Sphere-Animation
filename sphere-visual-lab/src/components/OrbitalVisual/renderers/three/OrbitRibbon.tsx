import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { OrbitalRingStyle } from '../../OrbitalVisual.types';
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
  ringStyle?: OrbitalRingStyle;
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
  uniform float uRingStyle;
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

    /*
     * Energy-style остаётся прежним:
     * яркая бегущая голова, хвост, shimmer и additive glow.
     * Именно этот путь продолжают использовать атомные пресеты.
     */
    float head = exp(-pow(loopDistance(along, 0.18) / 0.05, 2.0));
    float tail = exp(-pow(loopDistance(along, 0.26) / 0.16, 2.0)) * 0.58;
    float pulse = clamp(head + tail, 0.0, 1.0);

    float energyBand = pow(
      max(1.0 - abs(vUv.y - 0.5) * 2.0, 0.0),
      0.58
    );

    float energyBody =
      0.9 +
      0.1 *
        sin(
          vUv.x * 18.0 -
          uTime * uShimmerSpeed +
          uOffset * 6.2831
        );

    float energyShimmer =
      0.98 +
      0.02 *
        sin(
          vUv.x * 32.0 -
          uTime * (uShimmerSpeed + 0.22) +
          uOffset * 4.0
        );

    vec3 energyColor = mix(
      uBaseColor,
      uHotColor,
      pulse * 0.9
    );

    float energyAlpha =
      uOpacity *
      energyBand *
      (0.86 + pulse * 0.76) *
      energyBody *
      energyShimmer;

    /*
     * Planetary-style:
     * без белой бегущей головы и без ощущения электрического кабеля.
     * Вместо неё — широкая спокойная полоса, тонкие слои и очень
     * медленный неоднородный световой дрейф.
     */
    float crossSection = abs(vUv.y - 0.5) * 2.0;

    float planetaryBand = pow(
      max(1.0 - crossSection, 0.0),
      0.3
    );

    float planetaryEdge =
      1.0 - smoothstep(0.76, 1.0, crossSection);

    float broadLayer =
      0.5 +
      0.5 *
        sin(
          vUv.y * 18.0 +
          vUv.x * 3.2 +
          uOffset * 7.0
        );

    float fineLayer =
      0.5 +
      0.5 *
        sin(
          vUv.y * 46.0 -
          vUv.x * 5.4 +
          uOffset * 11.0
        );

    float layerStructure =
      broadLayer * 0.68 +
      fineLayer * 0.32;

    float slowDrift =
      0.5 +
      0.5 *
        sin(
          vUv.x * 9.0 -
          uTime * uFlowSpeed * 0.34 +
          uOffset * 6.2831
        );

    float softVariation =
      0.5 +
      0.5 *
        sin(
          vUv.x * 21.0 -
          uTime * uShimmerSpeed * 0.12 +
          vUv.y * 5.0 +
          uOffset * 4.0
        );

    float planetaryHotMix =
      0.035 +
      slowDrift * 0.085 +
      layerStructure * 0.025;

    vec3 planetaryColor = mix(
      uBaseColor * (0.9 + layerStructure * 0.12),
      uHotColor,
      planetaryHotMix
    );

    float planetaryAlpha =
      uOpacity *
      planetaryBand *
      planetaryEdge *
      (
        0.76 +
        layerStructure * 0.14 +
        slowDrift * 0.07 +
        softVariation * 0.03
      );

    vec3 color = mix(
      energyColor,
      planetaryColor,
      uRingStyle
    );

    float alpha = mix(
      energyAlpha,
      planetaryAlpha,
      uRingStyle
    );

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
  ringStyle: OrbitalRingStyle,
) {
  return {
    uTime: { value: 0 },
    uOpacity: { value: opacity * glowFactor },
    uFlowSpeed: { value: flowSpeed },
    uShimmerSpeed: { value: shimmerSpeed },
    uOffset: { value: offset },
    uDepthSide: { value: depthSide },
    uRingStyle: { value: ringStyle === 'planetary' ? 1 : 0 },
    uBaseColor: { value: baseColor.clone() },
    uHotColor: { value: hotColor.clone() },
  };
}

function createRibbonMaterial(
  uniforms: ReturnType<typeof createUniforms>,
  ringStyle: OrbitalRingStyle,
  depthTest: boolean,
  name: string,
) {
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    depthTest,
    side: THREE.DoubleSide,
    blending:
      ringStyle === 'planetary'
        ? THREE.NormalBlending
        : THREE.AdditiveBlending,
  });

  material.name = name;
  material.toneMapped = false;

  return material;
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
  ringStyle = 'energy',
  splitDepthLayers = false,
  nodes = [],
}: OrbitRibbonProps) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(
    () =>
      createOrbitGeometry(
        radius,
        thickness,
        wobble,
        seed,
        ellipseX,
        ellipseY,
      ),
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
        ringStyle,
      ),
    [
      opacity,
      glowFactor,
      flowSpeed,
      shimmerSpeed,
      offset,
      baseColor,
      hotColor,
      ringStyle,
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
        ringStyle,
      ),
    [
      opacity,
      glowFactor,
      flowSpeed,
      shimmerSpeed,
      offset,
      baseColor,
      hotColor,
      ringStyle,
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
        ringStyle,
      ),
    [
      opacity,
      glowFactor,
      flowSpeed,
      shimmerSpeed,
      offset,
      baseColor,
      hotColor,
      ringStyle,
    ],
  );

  /*
   * Материалы создаются самостоятельными THREE-объектами.
   * Это сохраняет корректный HMR для GLSL: после Ctrl + S новый shader
   * сразу заменяет старый, без переключения пресета и перезапуска сервера.
   */
  const fullMaterial = useMemo(
    () =>
      createRibbonMaterial(
        fullUniforms,
        ringStyle,
        true,
        'OrbitalRibbonFullMaterial',
      ),
    [fullUniforms, ringStyle, VERTEX_SHADER, FRAGMENT_SHADER],
  );

  const frontMaterial = useMemo(
    () =>
      createRibbonMaterial(
        frontUniforms,
        ringStyle,
        false,
        'OrbitalRibbonFrontMaterial',
      ),
    [frontUniforms, ringStyle, VERTEX_SHADER, FRAGMENT_SHADER],
  );

  const backMaterial = useMemo(
    () =>
      createRibbonMaterial(
        backUniforms,
        ringStyle,
        true,
        'OrbitalRibbonBackMaterial',
      ),
    [backUniforms, ringStyle, VERTEX_SHADER, FRAGMENT_SHADER],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useEffect(() => {
    return () => {
      fullMaterial.dispose();
    };
  }, [fullMaterial]);

  useEffect(() => {
    return () => {
      frontMaterial.dispose();
    };
  }, [frontMaterial]);

  useEffect(() => {
    return () => {
      backMaterial.dispose();
    };
  }, [backMaterial]);

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

    fullMaterial.uniforms.uTime.value = elapsed * safeSpeed;
    fullMaterial.uniforms.uOpacity.value = animatedOpacity;

    frontMaterial.uniforms.uTime.value = elapsed * safeSpeed;
    frontMaterial.uniforms.uOpacity.value = animatedOpacity;

    backMaterial.uniforms.uTime.value = elapsed * safeSpeed;
    backMaterial.uniforms.uOpacity.value = animatedOpacity;
  });

  return (
    <group ref={groupRef}>
      {!splitDepthLayers ? (
        <mesh geometry={geometry} renderOrder={6}>
          <primitive
            key={fullMaterial.uuid}
            object={fullMaterial}
            attach="material"
          />
        </mesh>
      ) : (
        <>
          {/* Задняя половина кольца */}
          <mesh geometry={geometry} renderOrder={6}>
            <primitive
              key={backMaterial.uuid}
              object={backMaterial}
              attach="material"
            />
          </mesh>

          {/* Передняя половина кольца */}
          <mesh geometry={geometry} renderOrder={18}>
            <primitive
              key={frontMaterial.uuid}
              object={frontMaterial}
              attach="material"
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
