import { useState } from 'react';
import PlaygroundPanel from './PlaygroundPanel';
import {
  SphereVisual,
  type GlowIntensity,
  type SphereBackground,
  type SphereMode,
  type SpherePresetName,
  type SphereQuality,
} from '../components/SphereVisual';

export default function DemoPage() {
  const [size, setSize] = useState(440);
  const [mode, setMode] = useState<SphereMode>('thinking');
  const [preset, setPreset] = useState<SpherePresetName>('soft-ai');
  const [quality, setQuality] = useState<SphereQuality>('high');
  const [glowIntensity, setGlowIntensity] =
    useState<GlowIntensity>('high');
  const [speed, setSpeed] = useState(1.1);
  const [background, setBackground] = useState<SphereBackground>('transparent');
  const [interactive, setInteractive] = useState(true);

  const previewModes: SphereMode[] = ['idle', 'thinking', 'searching'];

  const getPreviewPreset = (previewMode: SphereMode): SpherePresetName => {
    if (previewMode === 'searching') {
      return 'searching-violet';
    }

    if (previewMode === 'thinking') {
      return 'thinking-blue';
    }

    return 'soft-ai';
  };

  const getPreviewText = (previewMode: SphereMode) => {
    if (previewMode === 'idle') {
      return 'Спокойный базовый режим, когда визуал просто живёт и мягко дышит.';
    }

    if (previewMode === 'thinking') {
      return 'Более собранный и концентрированный режим с ощущением размышления.';
    }

    return 'Чуть более активный характер, который можно дальше развивать под поиск.';
  };

  return (
    <main className="pageShell">
      <div className="pageContainer">
        <header className="pageHeader">
          <p className="eyebrow">Sphere Visual Lab</p>
          <h1 className="pageTitle">Reusable AI Sphere v1</h1>
          <p className="pageSubtitle">
            Первая база отдельного проекта со сферой: без привязки к лендингу,
            с настраиваемыми параметрами, чистой архитектурой и заделом на
            будущие режимы, более сложную анимацию и другой внутренний рендер.
          </p>
        </header>

        <section className="demoLayout">
          <div className="panel previewPanel">
            <div className="previewStage">
              <SphereVisual
                size={size}
                mode={mode}
                preset={preset}
                quality={quality}
                glowIntensity={glowIntensity}
                speed={speed}
                background={background}
                interactive={interactive}
              />
            </div>
          </div>

          <div className="panel controlPanel">
            <PlaygroundPanel
              size={size}
              onSizeChange={setSize}
              mode={mode}
              onModeChange={setMode}
              preset={preset}
              onPresetChange={setPreset}
              quality={quality}
              onQualityChange={setQuality}
              glowIntensity={glowIntensity}
              onGlowIntensityChange={setGlowIntensity}
              speed={speed}
              onSpeedChange={setSpeed}
              background={background}
              onBackgroundChange={setBackground}
              interactive={interactive}
              onInteractiveChange={setInteractive}
            />
          </div>
        </section>

        <section className="miniGrid">
          {previewModes.map((previewMode) => (
            <article key={previewMode} className="miniCard">
              <div className="miniSphereWrap">
                <SphereVisual
                  size={156}
                  mode={previewMode}
                  preset={getPreviewPreset(previewMode)}
                  quality="medium"
                  glowIntensity="medium"
                  speed={1}
                  background="transparent"
                  interactive={false}
                />
              </div>

              <h2 className="miniLabel">{previewMode}</h2>
              <p className="miniText">{getPreviewText(previewMode)}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}