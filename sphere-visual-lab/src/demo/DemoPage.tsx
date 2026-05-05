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

interface PresetCard {
  preset: SpherePresetName;
  mode: SphereMode;
  title: string;
  text: string;
}

const presetCards: PresetCard[] = [
  {
    preset: 'glass-petal',
    mode: 'thinking',
    title: 'glass-petal',
    text: 'Наша текущая сильная baseline-версия: стеклянная оболочка, лепестковая структура и мягкий внутренний haze.',
  },
  {
    preset: 'soft-ai',
    mode: 'idle',
    title: 'soft-ai',
    text: 'Мягкий базовый AI-вариант: спокойный, светящийся, универсальный для нейтральных интерфейсов.',
  },
  {
    preset: 'thinking-blue',
    mode: 'thinking',
    title: 'thinking-blue',
    text: 'Более собранный и холодный характер с ощущением концентрации и размышления.',
  },
  {
    preset: 'searching-violet',
    mode: 'searching',
    title: 'searching-violet',
    text: 'Более активный и выразительный вариант, хорошо подходящий под поиск, AI и lab-настроение.',
  },
  {
    preset: 'calm-pearl',
    mode: 'idle',
    title: 'calm-pearl',
    text: 'Спокойный премиальный пресет: мягкий, светлый и деликатный, почти luxury-настроение.',
  },
  {
    preset: 'neon-core',
    mode: 'searching',
    title: 'neon-core',
    text: 'Яркий технологичный вариант с более контрастным свечением и выраженным AI/tech-характером.',
  },
  {
    preset: 'bio-glow',
    mode: 'thinking',
    title: 'bio-glow',
    text: 'Более органичный и биолюминесцентный вариант: живой, мягкий и мятно-лазурный.',
  },
];

export default function DemoPage() {
  const [size, setSize] = useState(440);
  const [mode, setMode] = useState<SphereMode>('thinking');
  const [preset, setPreset] = useState<SpherePresetName>('glass-petal');
  const [quality, setQuality] = useState<SphereQuality>('high');
  const [glowIntensity, setGlowIntensity] =
    useState<GlowIntensity>('high');
  const [speed, setSpeed] = useState(1.1);
  const [background, setBackground] = useState<SphereBackground>('transparent');
  const [interactive, setInteractive] = useState(true);

  return (
    <main className="pageShell">
      <div className="pageContainer">
        <header className="pageHeader">
          <p className="eyebrow">Sphere Visual Lab</p>
          <h1 className="pageTitle">Reusable AI Sphere v1</h1>
          <p className="pageSubtitle">
            Первая база отдельного проекта со сферой: без привязки к лендингу,
            с настраиваемыми параметрами, чистой архитектурой и заделом на
            будущие режимы, новые пресеты и другие visual family.
          </p>
        </header>

        <section className="demoLayout">
          <div className="panel previewPanel">
            <div className="previewStage">
              <SphereVisual
                renderer="three"
                width="100%"
                height="100%"
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
          {presetCards.map((card) => (
            <article key={card.preset} className="miniCard">
              <div className="miniSphereWrap">
                <SphereVisual
                  width="100%"
                  height="100%"
                  size={156}
                  mode={card.mode}
                  preset={card.preset}
                  quality="medium"
                  glowIntensity="medium"
                  speed={1}
                  background="transparent"
                  interactive={false}
                />
              </div>

              <h2 className="miniLabel">{card.title}</h2>
              <p className="miniText">{card.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}