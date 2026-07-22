import { useFrame } from '@react-three/fiber';
import {
  useEffect,
  useMemo,
  useRef,
} from 'react';
import * as THREE from 'three';
import type {
  OrbitalPortalPresetConfig,
  OrbitalQuality,
} from '../../OrbitalVisual.types';
import PortalMembrane from './PortalMembrane';
import PortalRing from './PortalRing';

interface PortalGateColors {
  core: THREE.Color;
  glow: THREE.Color;
  accent: THREE.Color;
  hot: THREE.Color;
}

interface PortalGateProps {
  config: OrbitalPortalPresetConfig;
  colors: PortalGateColors;
  quality: OrbitalQuality;
  speed: number;
  glowFactor: number;
}

function createPortalGlowTexture() {
  if (typeof document === 'undefined') {
    return null;
  }

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const center = size / 2;
  const gradient = context.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    center,
  );

  gradient.addColorStop(
    0,
    'rgba(255,255,255,0.72)',
  );
  gradient.addColorStop(
    0.28,
    'rgba(255,255,255,0.34)',
  );
  gradient.addColorStop(
    0.62,
    'rgba(255,255,255,0.08)',
  );
  gradient.addColorStop(
    1,
    'rgba(255,255,255,0)',
  );

  context.clearRect(0, 0, size, size);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return texture;
}

function getTorusSegments(quality: OrbitalQuality) {
  return {
    radial:
      quality === 'high'
        ? 14
        : quality === 'low'
          ? 7
          : 10,
    tubular:
      quality === 'high'
        ? 128
        : quality === 'low'
          ? 56
          : 88,
  };
}

export default function PortalGate({
  config,
  colors,
  quality,
  speed,
  glowFactor,
}: PortalGateProps) {
  const rootRef = useRef<THREE.Group>(null);
  const housingRef = useRef<THREE.Group>(null);
  const innerHousingRef =
    useRef<THREE.Group>(null);
  const energyRimRef = useRef<THREE.Group>(null);
  const rimPulseARef = useRef<THREE.Group>(null);
  const rimPulseBRef = useRef<THREE.Group>(null);
  const rimPulseCRef = useRef<THREE.Group>(null);

  const portalGlowTexture = useMemo(
    () => createPortalGlowTexture(),
    [],
  );

  const outerRingRadius =
    config.rings[0]?.radius ??
    config.membraneRadius * 1.64;

  const middleRingRadius =
    config.rings[1]?.radius ??
    config.membraneRadius * 1.33;

  const innerRingRadius =
    config.rings[2]?.radius ??
    config.membraneRadius * 1.11;

  const outerPanelCount = Math.max(
    6,
    Math.round(
      config.rings[0]?.segments ?? 10,
    ),
  );

  const innerPanelCount = Math.max(
    8,
    Math.round(
      (config.rings[1]?.segments ?? 16) *
        0.75,
    ),
  );

  const outerPanelStep =
    (Math.PI * 2) / outerPanelCount;

  const innerPanelStep =
    (Math.PI * 2) / innerPanelCount;

  const outerPanelArc =
    outerPanelStep * 0.73;

  const innerPanelArc =
    innerPanelStep * 0.62;

  const outerPanelGlowArc =
    outerPanelArc * 0.72;

  const innerPanelGlowArc =
    innerPanelArc * 0.68;

  const outerPanelInnerRadius =
    middleRingRadius +
    Math.max(
      config.rings[1]?.thickness ?? 0.04,
      0.035,
    ) *
      1.35;

  const outerPanelOuterRadius =
    outerRingRadius -
    Math.max(
      config.rings[0]?.thickness ?? 0.08,
      0.06,
    ) *
      1.28;

  const innerPanelInnerRadius =
    config.membraneRadius * 1.055;

  const innerPanelOuterRadius = Math.max(
    innerRingRadius -
      Math.max(
        config.rings[2]?.thickness ?? 0.018,
        0.016,
      ) *
        1.8,
    innerPanelInnerRadius + 0.045,
  );

  const outerPanelGeometry = useMemo(
    () =>
      new THREE.RingGeometry(
        outerPanelInnerRadius,
        outerPanelOuterRadius,
        quality === 'high' ? 48 : 30,
        1,
        0,
        outerPanelArc,
      ),
    [
      outerPanelArc,
      outerPanelInnerRadius,
      outerPanelOuterRadius,
      quality,
    ],
  );

  const innerPanelGeometry = useMemo(
    () =>
      new THREE.RingGeometry(
        innerPanelInnerRadius,
        innerPanelOuterRadius,
        quality === 'high' ? 42 : 26,
        1,
        0,
        innerPanelArc,
      ),
    [
      innerPanelArc,
      innerPanelInnerRadius,
      innerPanelOuterRadius,
      quality,
    ],
  );

  const outerPanelGlowGeometry = useMemo(
    () =>
      new THREE.RingGeometry(
        Math.max(
          outerPanelOuterRadius - 0.024,
          outerPanelInnerRadius + 0.01,
        ),
        Math.max(
          outerPanelOuterRadius - 0.005,
          outerPanelInnerRadius + 0.027,
        ),
        quality === 'high' ? 48 : 30,
        1,
        0,
        outerPanelGlowArc,
      ),
    [
      outerPanelGlowArc,
      outerPanelInnerRadius,
      outerPanelOuterRadius,
      quality,
    ],
  );

  const innerPanelGlowGeometry = useMemo(
    () =>
      new THREE.RingGeometry(
        innerPanelInnerRadius + 0.005,
        Math.min(
          innerPanelInnerRadius + 0.022,
          innerPanelOuterRadius - 0.007,
        ),
        quality === 'high' ? 42 : 26,
        1,
        0,
        innerPanelGlowArc,
      ),
    [
      innerPanelGlowArc,
      innerPanelInnerRadius,
      innerPanelOuterRadius,
      quality,
    ],
  );

  const bridgeInset = 0.03;
  const bridgeLength = Math.max(
    outerPanelInnerRadius -
      innerPanelOuterRadius -
      bridgeInset * 2,
    0.05,
  );

  const bridgeGeometry = useMemo(
    () =>
      new THREE.BoxGeometry(
        bridgeLength,
        0.026,
        0.02,
      ),
    [bridgeLength],
  );

  const bridgeLightGeometry = useMemo(
    () =>
      new THREE.BoxGeometry(
        bridgeLength * 0.58,
        0.008,
        0.006,
      ),
    [bridgeLength],
  );

  const bridgeHotGeometry = useMemo(
    () =>
      new THREE.BoxGeometry(
        bridgeLength * 0.2,
        0.012,
        0.008,
      ),
    [bridgeLength],
  );

  const innerRimColor = useMemo(
    () =>
      colors.glow
        .clone()
        .lerp(colors.hot, 0.34),
    [colors.glow, colors.hot],
  );

  const housingColor = useMemo(
    () =>
      colors.accent
        .clone()
        .multiplyScalar(0.16)
        .lerp(
          colors.glow
            .clone()
            .multiplyScalar(0.12),
          0.26,
        ),
    [colors.accent, colors.glow],
  );

  const housingEdgeColor = useMemo(
    () =>
      colors.accent
        .clone()
        .lerp(colors.glow, 0.22)
        .multiplyScalar(0.56),
    [colors.accent, colors.glow],
  );

  const shadowColor = useMemo(
    () =>
      colors.accent
        .clone()
        .multiplyScalar(0.055),
    [colors.accent],
  );

  const panelGlowColor = useMemo(
    () =>
      colors.glow
        .clone()
        .lerp(colors.hot, 0.38),
    [colors.glow, colors.hot],
  );

  const bridgeHotColor = useMemo(
    () =>
      colors.hot
        .clone()
        .lerp(colors.glow, 0.12),
    [colors.glow, colors.hot],
  );

  const housingMaterial = useMemo(() => {
    const material =
      new THREE.MeshBasicMaterial({
        color: housingColor,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: true,
        toneMapped: false,
      });

    material.name =
      'PortalGateHousingMaterial';

    return material;
  }, [housingColor]);

  const innerHousingMaterial = useMemo(() => {
    const material =
      new THREE.MeshBasicMaterial({
        color: housingEdgeColor,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: false,
        toneMapped: false,
      });

    material.name =
      'PortalGateInnerHousingMaterial';

    return material;
  }, [housingEdgeColor]);

  const bridgeMaterial = useMemo(() => {
    const material =
      new THREE.MeshBasicMaterial({
        color: housingColor
          .clone()
          .multiplyScalar(0.8),
        transparent: true,
        opacity: 0.82,
        depthTest: true,
        depthWrite: true,
        toneMapped: false,
      });

    material.name =
      'PortalGateBridgeMaterial';

    return material;
  }, [housingColor]);

  const bridgeLightMaterial = useMemo(() => {
    const material =
      new THREE.MeshBasicMaterial({
        color: innerRimColor,
        transparent: true,
        opacity: 0.52 * glowFactor,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        toneMapped: false,
      });

    material.name =
      'PortalGateBridgeLightMaterial';

    return material;
  }, [glowFactor, innerRimColor]);

  const bridgeHotMaterial = useMemo(() => {
    const material =
      new THREE.MeshBasicMaterial({
        color: bridgeHotColor,
        transparent: true,
        opacity: 0.64 * glowFactor,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        toneMapped: false,
      });

    material.name =
      'PortalGateBridgeHotMaterial';

    return material;
  }, [bridgeHotColor, glowFactor]);

  const outerPanelGlowMaterial = useMemo(() => {
    const material =
      new THREE.MeshBasicMaterial({
        color: panelGlowColor,
        transparent: true,
        opacity: 0.4 * glowFactor,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        toneMapped: false,
      });

    material.name =
      'PortalGateOuterPanelGlowMaterial';

    return material;
  }, [glowFactor, panelGlowColor]);

  const innerPanelGlowMaterial = useMemo(() => {
    const material =
      new THREE.MeshBasicMaterial({
        color: innerRimColor,
        transparent: true,
        opacity: 0.44 * glowFactor,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        toneMapped: false,
      });

    material.name =
      'PortalGateInnerPanelGlowMaterial';

    return material;
  }, [glowFactor, innerRimColor]);

  const rimPulseMaterialA = useMemo(() => {
    const material =
      new THREE.MeshBasicMaterial({
        color: colors.hot,
        transparent: true,
        opacity: 0.62 * glowFactor,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        toneMapped: false,
      });

    material.name =
      'PortalGateRimPulseMaterialA';

    return material;
  }, [colors.hot, glowFactor]);

  const rimPulseMaterialB = useMemo(() => {
    const material =
      new THREE.MeshBasicMaterial({
        color: innerRimColor,
        transparent: true,
        opacity: 0.46 * glowFactor,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        toneMapped: false,
      });

    material.name =
      'PortalGateRimPulseMaterialB';

    return material;
  }, [glowFactor, innerRimColor]);

  const rimPulseMaterialC = useMemo(() => {
    const material =
      new THREE.MeshBasicMaterial({
        color: colors.glow,
        transparent: true,
        opacity: 0.34 * glowFactor,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        toneMapped: false,
      });

    material.name =
      'PortalGateRimPulseMaterialC';

    return material;
  }, [colors.glow, glowFactor]);

  useEffect(() => {
    return () => {
      portalGlowTexture?.dispose();
      outerPanelGeometry.dispose();
      innerPanelGeometry.dispose();
      outerPanelGlowGeometry.dispose();
      innerPanelGlowGeometry.dispose();
      bridgeGeometry.dispose();
      bridgeLightGeometry.dispose();
      bridgeHotGeometry.dispose();
      housingMaterial.dispose();
      innerHousingMaterial.dispose();
      bridgeMaterial.dispose();
      bridgeLightMaterial.dispose();
      bridgeHotMaterial.dispose();
      outerPanelGlowMaterial.dispose();
      innerPanelGlowMaterial.dispose();
      rimPulseMaterialA.dispose();
      rimPulseMaterialB.dispose();
      rimPulseMaterialC.dispose();
    };
  }, [
    bridgeGeometry,
    bridgeHotGeometry,
    bridgeHotMaterial,
    bridgeLightGeometry,
    bridgeLightMaterial,
    bridgeMaterial,
    housingMaterial,
    innerHousingMaterial,
    innerPanelGeometry,
    innerPanelGlowGeometry,
    innerPanelGlowMaterial,
    outerPanelGeometry,
    outerPanelGlowGeometry,
    outerPanelGlowMaterial,
    portalGlowTexture,
    rimPulseMaterialA,
    rimPulseMaterialB,
    rimPulseMaterialC,
  ]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const safeSpeed = Math.max(speed, 0.2);

    if (rootRef.current) {
      rootRef.current.rotation.set(
        config.frameTiltX +
          Math.sin(
            elapsed * 0.13 * safeSpeed,
          ) *
            0.007,
        config.frameTiltY +
          Math.cos(
            elapsed * 0.1 * safeSpeed,
          ) *
            0.009,
        config.frameTiltZ +
          elapsed *
            config.frameRotationSpeed *
            safeSpeed +
          Math.sin(
            elapsed * 0.08 * safeSpeed,
          ) *
            0.006,
      );
    }

    if (housingRef.current) {
      housingRef.current.rotation.z =
        -elapsed * 0.008 * safeSpeed;
    }

    if (innerHousingRef.current) {
      innerHousingRef.current.rotation.z =
        elapsed * 0.014 * safeSpeed;
    }

    if (energyRimRef.current) {
      energyRimRef.current.rotation.z =
        elapsed * 0.11 * safeSpeed;
    }

    if (rimPulseARef.current) {
      rimPulseARef.current.rotation.z =
        elapsed * 0.58 * safeSpeed;
    }

    if (rimPulseBRef.current) {
      rimPulseBRef.current.rotation.z =
        elapsed * 0.39 * safeSpeed +
        2.2;
    }

    if (rimPulseCRef.current) {
      rimPulseCRef.current.rotation.z =
        elapsed * 0.76 * safeSpeed +
        4.1;
    }

    const pulse =
      0.5 +
      0.5 *
        Math.sin(
          elapsed * 0.84 * safeSpeed,
        );

    const secondaryPulse =
      0.5 +
      0.5 *
        Math.sin(
          elapsed * 1.22 * safeSpeed + 1.7,
        );

    innerHousingMaterial.opacity =
      0.27 + pulse * 0.09;

    bridgeLightMaterial.opacity =
      (0.4 + pulse * 0.3) *
      glowFactor;

    bridgeHotMaterial.opacity =
      (0.36 + secondaryPulse * 0.46) *
      glowFactor;

    outerPanelGlowMaterial.opacity =
      (0.3 + pulse * 0.28) *
      glowFactor;

    innerPanelGlowMaterial.opacity =
      (0.32 + secondaryPulse * 0.3) *
      glowFactor;

    rimPulseMaterialA.opacity =
      (0.44 + pulse * 0.34) *
      glowFactor;

    rimPulseMaterialB.opacity =
      (0.3 + secondaryPulse * 0.3) *
      glowFactor;

    rimPulseMaterialC.opacity =
      (0.2 + pulse * 0.22) *
      glowFactor;
  });

  const torusDetail =
    getTorusSegments(quality);

  const bridgeCount = 6;
  const bridgeMidRadius =
    (
      innerPanelOuterRadius +
      outerPanelInnerRadius
    ) /
    2;

  const bridgeAngleOffset =
    outerPanelStep * 0.5 + 0.02;

  const rimRadius =
    config.membraneRadius * 1.005;

  return (
    <group ref={rootRef}>
      {portalGlowTexture ? (
        <sprite
          position={[
            0,
            0,
            -config.membraneDepth * 0.92,
          ]}
          scale={[
            config.membraneRadius * 3.45,
            config.membraneRadius * 3.45,
            1,
          ]}
          renderOrder={1}
        >
          <spriteMaterial
            map={portalGlowTexture}
            color={colors.glow
              .clone()
              .lerp(colors.accent, 0.2)}
            transparent
            opacity={0.15 * glowFactor}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      ) : null}

      <mesh
        position={[
          0,
          0,
          -config.membraneDepth * 0.7,
        ]}
        renderOrder={2}
      >
        <circleGeometry
          args={[
            config.membraneRadius * 1.025,
            quality === 'high' ? 128 : 72,
          ]}
        />

        <meshBasicMaterial
          color={shadowColor}
          transparent
          opacity={0.9}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      <PortalMembrane
        radius={config.membraneRadius}
        opacity={config.membraneOpacity}
        flowSpeed={config.membraneFlowSpeed}
        turbulence={config.membraneTurbulence}
        pulse={config.membranePulse}
        depth={config.membraneDepth}
        colors={colors}
        quality={quality}
        speed={speed}
        glowFactor={glowFactor}
      />

      <group
        ref={innerHousingRef}
        position={[
          0,
          0,
          -config.membraneDepth * 0.03,
        ]}
        renderOrder={7}
      >
        {Array.from(
          { length: innerPanelCount },
          (_, index) => {
            const panelRotation =
              index * innerPanelStep + 0.08;

            const glowRotation =
              panelRotation +
              (innerPanelArc -
                innerPanelGlowArc) /
                2;

            return (
              <group
                key={`portal-inner-panel-${index}`}
              >
                <mesh
                  geometry={innerPanelGeometry}
                  rotation={[0, 0, panelRotation]}
                >
                  <primitive
                    object={innerHousingMaterial}
                    attach="material"
                  />
                </mesh>

                <mesh
                  geometry={innerPanelGlowGeometry}
                  rotation={[0, 0, glowRotation]}
                  position={[0, 0, 0.006]}
                  renderOrder={13}
                >
                  <primitive
                    object={innerPanelGlowMaterial}
                    attach="material"
                  />
                </mesh>
              </group>
            );
          },
        )}
      </group>

      <group
        ref={housingRef}
        position={[
          0,
          0,
          -config.membraneDepth * 0.2,
        ]}
        renderOrder={6}
      >
        {Array.from(
          { length: outerPanelCount },
          (_, index) => {
            const panelRotation =
              index * outerPanelStep + 0.025;

            const glowRotation =
              panelRotation +
              (outerPanelArc -
                outerPanelGlowArc) /
                2;

            return (
              <group
                key={`portal-outer-panel-${index}`}
              >
                <mesh
                  geometry={outerPanelGeometry}
                  rotation={[0, 0, panelRotation]}
                >
                  <primitive
                    object={housingMaterial}
                    attach="material"
                  />
                </mesh>

                <mesh
                  geometry={outerPanelGlowGeometry}
                  rotation={[0, 0, glowRotation]}
                  position={[0, 0, 0.008]}
                  renderOrder={12}
                >
                  <primitive
                    object={outerPanelGlowMaterial}
                    attach="material"
                  />
                </mesh>
              </group>
            );
          },
        )}

        {Array.from(
          { length: bridgeCount },
          (_, index) => {
            const angle =
              index *
                (
                  (Math.PI * 2) /
                  bridgeCount
                ) +
              bridgeAngleOffset;

            const useHotLight =
              index % 2 === 0;

            return (
              <group
                key={`portal-bridge-${index}`}
                rotation={[0, 0, angle]}
              >
                <mesh
                  geometry={bridgeGeometry}
                  position={[
                    bridgeMidRadius,
                    0,
                    -0.014,
                  ]}
                  renderOrder={5}
                >
                  <primitive
                    object={bridgeMaterial}
                    attach="material"
                  />
                </mesh>

                <mesh
                  geometry={bridgeLightGeometry}
                  position={[
                    bridgeMidRadius,
                    0,
                    0.004,
                  ]}
                  renderOrder={13}
                >
                  <primitive
                    object={bridgeLightMaterial}
                    attach="material"
                  />
                </mesh>

                {useHotLight ? (
                  <mesh
                    geometry={bridgeHotGeometry}
                    position={[
                      bridgeMidRadius +
                        bridgeLength * 0.12,
                      0,
                      0.009,
                    ]}
                    renderOrder={15}
                  >
                    <primitive
                      object={bridgeHotMaterial}
                      attach="material"
                    />
                  </mesh>
                ) : null}
              </group>
            );
          },
        )}
      </group>

      <group
        ref={energyRimRef}
        position={[
          0,
          0,
          config.membraneDepth * 0.34,
        ]}
        renderOrder={17}
      >
        <mesh>
          <torusGeometry
            args={[
              rimRadius,
              0.015,
              torusDetail.radial,
              torusDetail.tubular,
            ]}
          />

          <meshBasicMaterial
            color={innerRimColor}
            transparent
            opacity={0.48 * glowFactor}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh
          scale={[1.028, 1.028, 1]}
          renderOrder={16}
        >
          <torusGeometry
            args={[
              rimRadius,
              0.006,
              torusDetail.radial,
              torusDetail.tubular,
            ]}
          />

          <meshBasicMaterial
            color={colors.glow}
            transparent
            opacity={0.24 * glowFactor}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <group ref={rimPulseARef}>
          <mesh renderOrder={22}>
            <torusGeometry
              args={[
                rimRadius,
                0.012,
                torusDetail.radial,
                Math.max(
                  Math.round(
                    torusDetail.tubular * 0.42,
                  ),
                  28,
                ),
                0.58,
              ]}
            />

            <primitive
              object={rimPulseMaterialA}
              attach="material"
            />
          </mesh>
        </group>

        <group ref={rimPulseBRef}>
          <mesh renderOrder={21}>
            <torusGeometry
              args={[
                rimRadius * 1.018,
                0.008,
                torusDetail.radial,
                Math.max(
                  Math.round(
                    torusDetail.tubular * 0.36,
                  ),
                  24,
                ),
                0.4,
              ]}
            />

            <primitive
              object={rimPulseMaterialB}
              attach="material"
            />
          </mesh>
        </group>

        <group ref={rimPulseCRef}>
          <mesh renderOrder={20}>
            <torusGeometry
              args={[
                rimRadius * 0.987,
                0.006,
                torusDetail.radial,
                Math.max(
                  Math.round(
                    torusDetail.tubular * 0.28,
                  ),
                  20,
                ),
                0.28,
              ]}
            />

            <primitive
              object={rimPulseMaterialC}
              attach="material"
            />
          </mesh>
        </group>
      </group>

      <mesh
        position={[
          0,
          0,
          config.membraneDepth * 0.21,
        ]}
        renderOrder={15}
      >
        <torusGeometry
          args={[
            config.membraneRadius * 0.938,
            0.0065,
            torusDetail.radial,
            torusDetail.tubular,
          ]}
        />

        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.14 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {config.rings.map((ring, index) => (
        <PortalRing
          key={`portal-ring-${index}`}
          config={ring}
          colors={colors}
          quality={quality}
          speed={speed}
          glowFactor={glowFactor}
          index={index}
        />
      ))}
    </group>
  );
}
