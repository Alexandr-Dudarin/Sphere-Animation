import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { OrbitalPlanetDustPresetConfig } from '../../OrbitalVisual.types';
import PlanetRingDust from './PlanetRingDust';
import { createPlanetRingGeometry } from '../../../shared/planetRing/planetRingGeometry';
import { planetRingVertex as VERTEX_SHADER, planetRingFragment as FRAGMENT_SHADER } from '../../../shared/planetRing/planetRingShaders';

interface PlanetRingProps {
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
  opacity: number;
  flowSpeed: number;
  shimmerSpeed: number;
  offset: number;
  speed: number;
  glowFactor: number;
  splitDepthLayers?: boolean;
  dust?: OrbitalPlanetDustPresetConfig;
}

function createUniforms(
  opacity: number,
  glowFactor: number,
  flowSpeed: number,
  shimmerSpeed: number,
  offset: number,
  baseColor: THREE.Color,
  depthSide: number,
  depthFeather: number,
) {
  return {
    uTime: {
      value: 0,
    },
    uOpacity: {
      value:
        opacity *
        glowFactor,
    },
    uFlowSpeed: {
      value:
        flowSpeed,
    },
    uShimmerSpeed: {
      value:
        shimmerSpeed,
    },
    uOffset: {
      value:
        offset,
    },
    uDepthSide: {
      value:
        depthSide,
    },
    uDepthFeather: {
      value:
        depthFeather,
    },
    uBaseColor: {
      value:
        baseColor.clone(),
    },
  };
}

function createMaterial(
  uniforms: ReturnType<
    typeof createUniforms
  >,
  depthTest: boolean,
  name: string,
) {
  const material =
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader:
        VERTEX_SHADER,
      fragmentShader:
        FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest,
      side:
        THREE.DoubleSide,
      blending:
        THREE.NormalBlending,
    });

  material.name = name;
  material.toneMapped = false;

  return material;
}

export default function PlanetRing({
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
  opacity,
  flowSpeed,
  shimmerSpeed,
  offset,
  speed,
  glowFactor,
  splitDepthLayers = true,
  dust,
}: PlanetRingProps) {
  const groupRef =
    useRef<THREE.Group>(null);

  const geometry = useMemo(
    () =>
      createPlanetRingGeometry(
        radius,
        thickness,
        ellipseX,
        ellipseY,
        wobble,
        seed,
      ),
    [
      radius,
      thickness,
      ellipseX,
      ellipseY,
      wobble,
      seed,
    ],
  );

  const depthFeather = useMemo(
    () =>
      Math.max(
        thickness * 1.6,
        radius * 0.035,
      ),
    [
      thickness,
      radius,
    ],
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
        0,
        depthFeather,
      ),
    [
      opacity,
      glowFactor,
      flowSpeed,
      shimmerSpeed,
      offset,
      baseColor,
      depthFeather,
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
        1,
        depthFeather,
      ),
    [
      opacity,
      glowFactor,
      flowSpeed,
      shimmerSpeed,
      offset,
      baseColor,
      depthFeather,
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
        -1,
        depthFeather,
      ),
    [
      opacity,
      glowFactor,
      flowSpeed,
      shimmerSpeed,
      offset,
      baseColor,
      depthFeather,
    ],
  );

  const fullMaterial = useMemo(
    () =>
      createMaterial(
        fullUniforms,
        true,
        'PlanetRingFullMaterial',
      ),
    [
      fullUniforms,
      VERTEX_SHADER,
      FRAGMENT_SHADER,
    ],
  );

  const frontMaterial = useMemo(
    () =>
      createMaterial(
        frontUniforms,
        false,
        'PlanetRingFrontMaterial',
      ),
    [
      frontUniforms,
      VERTEX_SHADER,
      FRAGMENT_SHADER,
    ],
  );

  const backMaterial = useMemo(
    () =>
      createMaterial(
        backUniforms,
        true,
        'PlanetRingBackMaterial',
      ),
    [
      backUniforms,
      VERTEX_SHADER,
      FRAGMENT_SHADER,
    ],
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
    const elapsed =
      state.clock.getElapsedTime();

    const safeSpeed =
      Math.max(speed, 0.2);

    if (groupRef.current) {
      groupRef.current.rotation.set(
        tiltX,
        tiltY,
        tiltZ,
      );

      groupRef.current.scale.setScalar(
        1,
      );
    }

    const shaderTime =
      elapsed * safeSpeed;

    fullMaterial.uniforms.uTime.value =
      shaderTime;

    frontMaterial.uniforms.uTime.value =
      shaderTime;

    backMaterial.uniforms.uTime.value =
      shaderTime;
  });

  return (
    <group ref={groupRef}>
      {!splitDepthLayers ? (
        <mesh
          geometry={geometry}
          renderOrder={6}
        >
          <primitive
            key={fullMaterial.uuid}
            object={fullMaterial}
            attach="material"
          />
        </mesh>
      ) : (
        <>
          <mesh
            geometry={geometry}
            renderOrder={6}
          >
            <primitive
              key={backMaterial.uuid}
              object={backMaterial}
              attach="material"
            />
          </mesh>

          <mesh
            geometry={geometry}
            renderOrder={18}
          >
            <primitive
              key={frontMaterial.uuid}
              object={frontMaterial}
              attach="material"
            />
          </mesh>
        </>
      )}

      {dust?.enabled ? (
        <PlanetRingDust
          radius={radius}
          thickness={thickness}
          ellipseX={ellipseX}
          ellipseY={ellipseY}
          wobble={wobble}
          seed={seed}
          baseColor={baseColor}
          opacity={opacity}
          speed={speed}
          glowFactor={glowFactor}
          density={dust.density}
          size={dust.size}
          brightness={dust.brightness}
          motion={dust.motion}
          tintRgb={dust.tintRgb}
          splitDepthLayers={splitDepthLayers}
        />
      ) : null}
    </group>
  );
}
