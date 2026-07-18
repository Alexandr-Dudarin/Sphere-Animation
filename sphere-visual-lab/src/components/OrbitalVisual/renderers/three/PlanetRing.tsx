import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

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
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  varying float vViewZ;
  varying float vCenterViewZ;

  void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 centerMvPosition =
      modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);

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

  varying vec2 vUv;
  varying float vViewZ;
  varying float vCenterViewZ;

  void main() {
    if (uDepthSide > 0.5) {
      if (vViewZ < vCenterViewZ) {
        discard;
      }
    } else if (uDepthSide < -0.5) {
      if (vViewZ >= vCenterViewZ) {
        discard;
      }
    }

    float radial = clamp(vUv.y, 0.0, 1.0);

    float outerFade = 1.0 - smoothstep(0.88, 1.0, radial);
    float innerFade = smoothstep(0.0, 0.12, radial);
    float edgeMask = outerFade * innerFade;

    float broadBands =
      0.5 +
      0.5 *
        sin(
          radial * 34.0 +
          sin(radial * 9.0 + uOffset * 5.0) * 1.8
        );

    float mediumBands =
      0.5 +
      0.5 *
        sin(
          radial * 79.0 +
          vUv.x * 5.0 +
          uOffset * 9.0
        );

    float fineBands =
      0.5 +
      0.5 *
        sin(
          radial * 157.0 -
          vUv.x * 8.0 +
          uOffset * 13.0
        );

    float angularDrift =
      0.5 +
      0.5 *
        sin(
          vUv.x * 18.8496 -
          uTime * uFlowSpeed * 0.22 +
          uOffset * 6.2831
        );

    float softShimmer =
      0.5 +
      0.5 *
        sin(
          vUv.x * 31.4159 -
          uTime * uShimmerSpeed * 0.08 +
          radial * 8.0
        );

    float darkGapA =
      1.0 -
      smoothstep(
        0.0,
        0.035,
        abs(radial - 0.33)
      );

    float darkGapB =
      1.0 -
      smoothstep(
        0.0,
        0.026,
        abs(radial - 0.69)
      );

    float bandStructure =
      broadBands * 0.5 +
      mediumBands * 0.33 +
      fineBands * 0.17;

    float gapMask =
      1.0 -
      darkGapA * 0.72 -
      darkGapB * 0.5;

    vec3 deepColor = uBaseColor * 0.28;

    vec3 middleColor =
      uBaseColor * 0.58 +
      vec3(0.0, 0.025, 0.065);

    vec3 brightColor =
      uBaseColor * 0.92 +
      vec3(0.015, 0.08, 0.14);

    vec3 color = mix(
      deepColor,
      middleColor,
      smoothstep(0.18, 0.72, bandStructure)
    );

    color = mix(
      color,
      brightColor,
      smoothstep(0.67, 0.94, bandStructure) * 0.58
    );

    color *=
      0.82 +
      angularDrift * 0.11 +
      softShimmer * 0.035;

    float alpha =
      uOpacity *
      edgeMask *
      gapMask *
      (
        0.24 +
        broadBands * 0.42 +
        mediumBands * 0.18 +
        fineBands * 0.07
      );

    alpha *= 0.92 + angularDrift * 0.08;

    gl_FragColor = vec4(color, alpha);
  }
`;

function createPlanetRingGeometry(
  radius: number,
  thickness: number,
  ellipseX: number,
  ellipseY: number,
  wobble: number,
  seed: number,
) {
  const angularSegments = 256;
  const radialSegments = 18;

  /*
   * Намеренно агрессивный pass:
   * вместо круглой TubeGeometry создаётся широкая плоская лента.
   */
  const ringWidth = Math.max(
    thickness * 5.2,
    radius * 0.07,
  );

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (
    let radialIndex = 0;
    radialIndex <= radialSegments;
    radialIndex += 1
  ) {
    const radialProgress = radialIndex / radialSegments;
    const radialOffset = radialProgress - 0.5;
    const localRadius = radius + radialOffset * ringWidth;

    for (
      let angularIndex = 0;
      angularIndex <= angularSegments;
      angularIndex += 1
    ) {
      const angularProgress = angularIndex / angularSegments;
      const angle = angularProgress * Math.PI * 2;

      const localWobble =
        Math.sin(
          angle * 3 +
          seed * 0.73 +
          radialProgress * Math.PI,
        ) *
        wobble *
        0.55;

      positions.push(
        Math.cos(angle) * localRadius * ellipseX,
        Math.sin(angle) * localRadius * ellipseY,
        localWobble,
      );

      uvs.push(angularProgress, radialProgress);
    }
  }

  const rowLength = angularSegments + 1;

  for (
    let radialIndex = 0;
    radialIndex < radialSegments;
    radialIndex += 1
  ) {
    for (
      let angularIndex = 0;
      angularIndex < angularSegments;
      angularIndex += 1
    ) {
      const a =
        radialIndex * rowLength +
        angularIndex;
      const b = a + rowLength;
      const c = b + 1;
      const d = a + 1;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      positions,
      3,
    ),
  );

  geometry.setAttribute(
    'uv',
    new THREE.Float32BufferAttribute(
      uvs,
      2,
    ),
  );

  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return geometry;
}

function createUniforms(
  opacity: number,
  glowFactor: number,
  flowSpeed: number,
  shimmerSpeed: number,
  offset: number,
  baseColor: THREE.Color,
  depthSide: number,
) {
  return {
    uTime: { value: 0 },
    uOpacity: {
      value: opacity * glowFactor,
    },
    uFlowSpeed: { value: flowSpeed },
    uShimmerSpeed: {
      value: shimmerSpeed,
    },
    uOffset: { value: offset },
    uDepthSide: { value: depthSide },
    uBaseColor: {
      value: baseColor.clone(),
    },
  };
}

function createMaterial(
  uniforms: ReturnType<typeof createUniforms>,
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
    blending: THREE.NormalBlending,
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
      ),
    [
      opacity,
      glowFactor,
      flowSpeed,
      shimmerSpeed,
      offset,
      baseColor,
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
      ),
    [
      opacity,
      glowFactor,
      flowSpeed,
      shimmerSpeed,
      offset,
      baseColor,
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
      ),
    [
      opacity,
      glowFactor,
      flowSpeed,
      shimmerSpeed,
      offset,
      baseColor,
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
      groupRef.current.scale.setScalar(1);
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
    </group>
  );
}