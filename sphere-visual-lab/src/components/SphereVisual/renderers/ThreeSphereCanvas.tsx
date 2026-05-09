import { Canvas } from '@react-three/fiber';
import type {
  GlowIntensity,
  SphereMode,
  SpherePresetConfig,
  SphereQuality,
} from '../SphereVisual.types';
import SphereScene from './three/SphereScene';

interface ThreeSphereCanvasProps {
  presetConfig: SpherePresetConfig;
  mode: SphereMode;
  quality: SphereQuality;
  interactive: boolean;
  glowIntensity: GlowIntensity;
  speed: number;
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
  visualScale: number;
}

const dprMap: Record<SphereQuality, number | [number, number]> = {
  low: 1,
  medium: [1, 1.5],
  high: [1, 2],
};

export default function ThreeSphereCanvas({
  quality,
  visualScale,
  ...sceneProps
}: ThreeSphereCanvasProps) {
  return (
    <Canvas
      dpr={dprMap[quality]}
      camera={{ position: [0, 0, 5.05], fov: 32 }}
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
      <SphereScene
        quality={quality}
        visualScale={visualScale}
        {...sceneProps}
      />
    </Canvas>
  );
}