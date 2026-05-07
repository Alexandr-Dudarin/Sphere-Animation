import { Canvas } from '@react-three/fiber';
import type {
  OrbitalGlowIntensity,
  OrbitalPresetConfig,
  OrbitalQuality,
} from '../OrbitalVisual.types';
import OrbitalScene from './three/OrbitalScene';

interface ThreeOrbitalCanvasProps {
  presetConfig: OrbitalPresetConfig;
  quality: OrbitalQuality;
  glowIntensity: OrbitalGlowIntensity;
  speed: number;
}

const dprMap: Record<OrbitalQuality, number | [number, number]> = {
  low: 1,
  medium: [1, 1.5],
  high: [1, 2],
};

export default function ThreeOrbitalCanvas({
  quality,
  ...sceneProps
}: ThreeOrbitalCanvasProps) {
  return (
    <Canvas
      dpr={dprMap[quality]}
      camera={{ position: [0, 0, 5.6], fov: 34 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <OrbitalScene quality={quality} {...sceneProps} />
    </Canvas>
  );
}