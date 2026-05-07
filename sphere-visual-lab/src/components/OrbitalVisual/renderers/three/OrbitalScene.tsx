import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
    OrbitalGlowIntensity,
    OrbitalPresetConfig,
    OrbitalQuality,
} from '../../OrbitalVisual.types';
import OrbitRibbon from './OrbitRibbon';

interface OrbitalSceneProps {
    presetConfig: OrbitalPresetConfig;
    quality: OrbitalQuality;
    glowIntensity: OrbitalGlowIntensity;
    speed: number;
}

interface OrbitConfig {
    radius: number;
    thickness: number;
    tiltX: number;
    tiltY: number;
    tiltZ: number;
    wobble: number;
    opacity: number;
    flowSpeed: number;
    rotationSpeed: number;
    seed: number;
    offset: number;
    baseColor: THREE.Color;
    hotColor: THREE.Color;
}

interface OrbitFamily {
    radius: number;
    tiltX: number;
    tiltY: number;
    tiltZ: number;
    wobble: number;
    heroColor: THREE.Color;
    heroHot: THREE.Color;
    echoColor: THREE.Color;
    echoHot: THREE.Color;
    seedBase: number;
}

interface OrbitFamilyGroupConfig {
    key: string;
    phase: number;
    driftX: number;
    driftY: number;
    driftZ: number;
    breath: number;
    orbits: OrbitConfig[];
}

function rgbStringToColor(value: string) {
    return new THREE.Color(`rgb(${value.split(' ').join(', ')})`);
}

function getGlowFactor(glowIntensity: OrbitalGlowIntensity) {
    switch (glowIntensity) {
        case 'low':
            return 0.82;
        case 'high':
            return 1.24;
        default:
            return 1;
    }
}

function OrbitFamilyGroup({
    family,
    speed,
    glowFactor,
}: {
    family: OrbitFamilyGroupConfig;
    speed: number;
    glowFactor: number;
}) {
    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        const elapsed = state.clock.getElapsedTime();
        const safeSpeed = Math.max(speed, 0.15);

        if (ref.current) {
            ref.current.rotation.x =
                Math.sin(elapsed * 0.22 * safeSpeed + family.phase) * family.driftX;
            ref.current.rotation.y =
                Math.cos(elapsed * 0.19 * safeSpeed + family.phase * 1.2) *
                family.driftY;
            ref.current.rotation.z =
                Math.sin(elapsed * 0.15 * safeSpeed + family.phase * 0.8) *
                family.driftZ;

            const scale =
                1 + Math.sin(elapsed * 0.38 * safeSpeed + family.phase) * family.breath;
            ref.current.scale.setScalar(scale);
        }
    });

    return (
        <group ref={ref}>
            {family.orbits.map((orbit, index) => (
                <OrbitRibbon
                    key={`${family.key}-${index}`}
                    radius={orbit.radius}
                    thickness={orbit.thickness}
                    tiltX={orbit.tiltX}
                    tiltY={orbit.tiltY}
                    tiltZ={orbit.tiltZ}
                    wobble={orbit.wobble}
                    seed={orbit.seed}
                    baseColor={orbit.baseColor}
                    hotColor={orbit.hotColor}
                    opacity={orbit.opacity}
                    flowSpeed={orbit.flowSpeed}
                    rotationSpeed={orbit.rotationSpeed}
                    offset={orbit.offset}
                    speed={speed}
                    glowFactor={glowFactor}
                />
            ))}
        </group>
    );
}

export default function OrbitalScene({
    presetConfig,
    quality,
    glowIntensity,
    speed,
}: OrbitalSceneProps) {
    const rootRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Group>(null);

    const glowFactor = getGlowFactor(glowIntensity);

    const colors = useMemo(() => {
        return {
            core: rgbStringToColor(presetConfig.coreRgb),
            glow: rgbStringToColor(presetConfig.glowRgb),
            accent: rgbStringToColor(presetConfig.accentRgb),
            hot: rgbStringToColor(presetConfig.hotRgb),
        };
    }, [presetConfig]);

    const familyGroups = useMemo<OrbitFamilyGroupConfig[]>(() => {
        const baseRadius = presetConfig.baseRadius * 0.82;
        const heroThickness = presetConfig.ringThickness * 1.28;
        const echoThickness = presetConfig.ringThickness * 0.92;
        const faintThickness = presetConfig.ringThickness * 0.72;

        const families: OrbitFamily[] = [
            {
                radius: baseRadius * 1.0,
                tiltX: 0.18,
                tiltY: 0.08,
                tiltZ: 0.1,
                wobble: 0.12,
                heroColor: colors.glow.clone().lerp(colors.accent, 0.08),
                heroHot: colors.hot.clone().lerp(colors.glow, 0.06),
                echoColor: colors.glow.clone().lerp(colors.core, 0.1),
                echoHot: colors.hot.clone().lerp(colors.glow, 0.04),
                seedBase: 1,
            },
            {
                radius: baseRadius * 1.02,
                tiltX: 1.1,
                tiltY: 0.24,
                tiltZ: -0.14,
                wobble: 0.11,
                heroColor: colors.accent.clone().lerp(colors.glow, 0.28),
                heroHot: colors.hot.clone().lerp(colors.accent, 0.08),
                echoColor: colors.accent.clone().lerp(colors.glow, 0.46),
                echoHot: colors.hot.clone().lerp(colors.accent, 0.04),
                seedBase: 11,
            },
            {
                radius: baseRadius * 0.97,
                tiltX: 0.56,
                tiltY: 1.04,
                tiltZ: 0.18,
                wobble: 0.1,
                heroColor: colors.glow.clone().lerp(colors.accent, 0.16),
                heroHot: colors.hot.clone().lerp(colors.glow, 0.05),
                echoColor: colors.glow.clone().lerp(colors.accent, 0.24),
                echoHot: colors.hot.clone().lerp(colors.glow, 0.04),
                seedBase: 21,
            },
        ];

        return families.map((family, familyIndex) => {
            const offsetBase = familyIndex * 0.19;
            const orbits: OrbitConfig[] = [];

            orbits.push({
                radius: family.radius,
                thickness: heroThickness,
                tiltX: family.tiltX,
                tiltY: family.tiltY,
                tiltZ: family.tiltZ,
                wobble: family.wobble,
                opacity: 0.42,
                flowSpeed: 0.28 + familyIndex * 0.03,
                rotationSpeed: familyIndex % 2 === 0 ? 0.028 : -0.03,
                seed: family.seedBase,
                offset: offsetBase + 0.04,
                baseColor: family.heroColor,
                hotColor: family.heroHot,
            });

            orbits.push({
                radius: family.radius * 1.032,
                thickness: echoThickness,
                tiltX: family.tiltX + 0.045,
                tiltY: family.tiltY + 0.035,
                tiltZ: family.tiltZ + 0.05,
                wobble: family.wobble * 0.82,
                opacity: 0.24,
                flowSpeed: 0.24 + familyIndex * 0.025,
                rotationSpeed: familyIndex % 2 === 0 ? -0.024 : 0.026,
                seed: family.seedBase + 1,
                offset: offsetBase + 0.28,
                baseColor: family.echoColor,
                hotColor: family.echoHot,
            });

            if (quality !== 'low') {
                orbits.push({
                    radius: family.radius * 0.97,
                    thickness: faintThickness,
                    tiltX: family.tiltX - 0.04,
                    tiltY: family.tiltY + 0.03,
                    tiltZ: family.tiltZ - 0.045,
                    wobble: family.wobble * 0.72,
                    opacity: 0.16,
                    flowSpeed: 0.31 + familyIndex * 0.02,
                    rotationSpeed: familyIndex % 2 === 0 ? 0.022 : -0.022,
                    seed: family.seedBase + 2,
                    offset: offsetBase + 0.48,
                    baseColor: family.echoColor.clone().lerp(family.heroColor, 0.25),
                    hotColor: family.echoHot,
                });
            }

            if (quality === 'high') {
                orbits.push({
                    radius: family.radius * 1.055,
                    thickness: faintThickness * 0.92,
                    tiltX: family.tiltX + 0.07,
                    tiltY: family.tiltY - 0.03,
                    tiltZ: family.tiltZ + 0.08,
                    wobble: family.wobble * 0.58,
                    opacity: 0.1,
                    flowSpeed: 0.22 + familyIndex * 0.015,
                    rotationSpeed: familyIndex % 2 === 0 ? -0.018 : 0.018,
                    seed: family.seedBase + 3,
                    offset: offsetBase + 0.66,
                    baseColor: family.echoColor.clone().lerp(colors.core, 0.1),
                    hotColor: family.echoHot,
                });
            }

            return {
                key: `family-${familyIndex}`,
                phase: familyIndex * 1.7,
                driftX: 0.046 + familyIndex * 0.006,
                driftY: 0.04 + familyIndex * 0.005,
                driftZ: 0.03 + familyIndex * 0.004,
                breath: 0.01 + familyIndex * 0.0015,
                orbits,
            };
        });
    }, [colors, presetConfig.baseRadius, presetConfig.ringThickness, quality]);

    useFrame((state) => {
        const elapsed = state.clock.getElapsedTime();
        const safeSpeed = Math.max(speed, 0.15);

        if (rootRef.current) {
            rootRef.current.rotation.x = Math.sin(elapsed * 0.08 * safeSpeed) * 0.03;
            rootRef.current.rotation.y = Math.cos(elapsed * 0.07 * safeSpeed) * 0.04;
            rootRef.current.rotation.z = Math.sin(elapsed * 0.05 * safeSpeed) * 0.012;
        }

        if (coreRef.current) {
            const breath = 1 + Math.sin(elapsed * 0.82 * safeSpeed) * 0.024;
            coreRef.current.scale.setScalar(breath);
            coreRef.current.rotation.z =
                Math.sin(elapsed * 0.14 * safeSpeed) * 0.045;
        }
    });

    return (
        <group ref={rootRef}>
            <mesh renderOrder={1}>
                <sphereGeometry args={[presetConfig.haloSize * 1.45, 28, 28]} />
                <meshBasicMaterial
                    color={colors.glow}
                    transparent
                    opacity={0.03 * glowFactor}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            <mesh renderOrder={2} scale={[1.22, 0.9, 1]}>
                <sphereGeometry args={[presetConfig.haloSize * 0.92, 24, 24]} />
                <meshBasicMaterial
                    color={colors.glow.clone().lerp(colors.accent, 0.14)}
                    transparent
                    opacity={0.075 * glowFactor}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {familyGroups.map((family) => (
                <OrbitFamilyGroup
                    key={family.key}
                    family={family}
                    speed={speed}
                    glowFactor={glowFactor}
                />
            ))}

            <group ref={coreRef}>
                <mesh renderOrder={10} scale={[1.14, 0.92, 1]}>
                    <sphereGeometry args={[presetConfig.coreSize * 1.72, 24, 24]} />
                    <meshBasicMaterial
                        color={colors.glow.clone().lerp(colors.accent, 0.12)}
                        transparent
                        opacity={0.1 * glowFactor}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        toneMapped={false}
                    />
                </mesh>

                <mesh renderOrder={11}>
                    <sphereGeometry args={[presetConfig.coreSize * 1.1, 22, 22]} />
                    <meshBasicMaterial
                        color={colors.core.clone().lerp(colors.glow, 0.18)}
                        transparent
                        opacity={0.2 * glowFactor}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        toneMapped={false}
                    />
                </mesh>

                <mesh renderOrder={12}>
                    <sphereGeometry args={[presetConfig.coreSize * 0.68, 20, 20]} />
                    <meshBasicMaterial
                        color={colors.hot.clone().lerp(colors.glow, 0.04)}
                        transparent
                        opacity={0.98}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        toneMapped={false}
                    />
                </mesh>
            </group>
        </group>
    );
}