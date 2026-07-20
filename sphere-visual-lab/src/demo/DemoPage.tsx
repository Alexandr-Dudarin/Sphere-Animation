import { useState } from 'react';
import PlaygroundPanel from './PlaygroundPanel';
import OrbitalPlaygroundPanel from './OrbitalPlaygroundPanel';
import {
  SphereVisual,
  type GlowIntensity,
  type SphereBackground,
  type SphereMode,
  type SpherePresetName,
  type SphereQuality,
} from '../components/SphereVisual';
import {
  OrbitalVisual,
  type OrbitalBackground,
  type OrbitalGlowIntensity,
  type OrbitalPresetName,
  type OrbitalQuality,
} from '../components/OrbitalVisual';

interface PresetCard {
  preset: SpherePresetName;
  mode: SphereMode;
  title: string;
  text: string;
}

interface OrbitalPresetCard {
  preset: OrbitalPresetName;
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
  {
    preset: 'soft-ai',
    mode: 'idle',
    title: 'soft-ai',
    text: 'Мягкий базовый AI-вариант: спокойный, светящийся, универсальный для нейтральных интерфейсов.',
  },
  {
    preset: 'prism-bloom',
    mode: 'searching',
    title: 'prism-bloom',
    text: 'Более яркий и насыщенный вариант с усиленным внутренним glow и более спектральным характером.',
  },
];

const orbitalPresetCards: OrbitalPresetCard[] = [
  {
    preset: 'atomic-orb',
    title: 'atomic-orb',
    text: 'Базовый атомный пресет: симметричные орбиты, яркое ядро и читаемые электроны.',
  },
  {
    preset: 'atomic-orb-no-electrons',
    title: 'atomic-orb-no-electrons',
    text: 'Тот же базовый атом, но без электронов — более чистый и графичный orbital-вариант.',
  },
  {
    preset: 'atomic-orb-more-electrons',
    title: 'atomic-orb-more-electrons',
    text: 'Версия с заметно большим количеством электронов и более активным визуальным ритмом.',
  },
  {
    preset: 'atomic-orb-white',
    title: 'atomic-orb-white',
    text: 'Более белый и холодный вариант атома — светлый, аккуратный и почти crystalline по настроению.',
  },
  {
    preset: 'atomic-orb-violet',
    title: 'atomic-orb-violet',
    text: 'Фиолетовый вариант атома с более мягким sci-fi / tech-art характером.',
  },
  {
    preset: 'ring-planet',
    title: 'ring-planet',
    text: 'Сдержанная планета без частиц: крупное ядро, читаемые кольца и более спокойный космический характер.',
  },
  {
    preset: 'ring-planet-stardust',
    title: 'ring-planet-stardust',
    text: 'Декоративная версия планеты с мерцающей пылью на передней и задней частях колец.',
  },
  {
    preset: 'ring-planet-sand',
    title: 'ring-planet-sand',
    text: 'Тёплая песочно-карамельная планета без частиц — спокойный и более премиальный вариант.',
  },
  {
    preset: 'ring-planet-sand-stardust',
    title: 'ring-planet-sand-stardust',
    text: 'Песочная планета с редкой кремово-золотистой пылью и более медленным движением.',
  },
  {
    preset: 'ring-planet-ice',
    title: 'ring-planet-ice',
    text: 'Ледяная версия с меньшим ядром, более широкими тонкими кольцами и редкой холодной пылью.',
  },
  {
    preset: 'ring-planet-eclipse',
    title: 'ring-planet-eclipse',
    text: 'Тёмная драматичная планета с близкими бронзовыми кольцами и редкими янтарными искрами.',
  },
  {
    preset: 'gyro-core',
    title: 'gyro-core',
    text: 'Базовое механическое ядро: три сегментированных кольца в разных плоскостях, холодные световые дорожки и независимое контрвращение.',
  },
];

export default function DemoPage() {
  const [size, setSize] = useState(440);
  const [mode, setMode] = useState<SphereMode>('thinking');
  const [preset, setPreset] = useState<SpherePresetName>('glass-petal');
  const [quality, setQuality] = useState<SphereQuality>('high');
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>('high');
  const [speed, setSpeed] = useState(1.1);
  const [background, setBackground] =
    useState<SphereBackground>('transparent');
  const [interactive, setInteractive] = useState(true);

  const [orbitalSize, setOrbitalSize] = useState(440);
  const [orbitalPreset, setOrbitalPreset] =
    useState<OrbitalPresetName>('atomic-orb');
  const [orbitalQuality, setOrbitalQuality] =
    useState<OrbitalQuality>('high');
  const [orbitalGlowIntensity, setOrbitalGlowIntensity] =
    useState<OrbitalGlowIntensity>('high');
  const [orbitalSpeed, setOrbitalSpeed] = useState(1);
  const [orbitalBackground, setOrbitalBackground] =
    useState<OrbitalBackground>('transparent');

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
                  size={240}
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

        <header className="pageHeader" style={{ marginTop: 36 }}>
          <p className="eyebrow">Orbital Visual Lab</p>
          <h2
            className="pageTitle"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
          >
            Reusable Orbital Visual v1
          </h2>
          <p className="pageSubtitle">
            Отдельная ветка orbital / ring / ribbon объектов: гладкие
            светящиеся орбиты без point-look, на базе TubeGeometry и flow по
            линии. Общая база для orbital / ring / ribbon объектов: атомных систем, кольцевых планет и будущих механических visual family.
          </p>
        </header>

        <section className="demoLayout">
          <div className="panel previewPanel">
            <div className="previewStage">
              <OrbitalVisual
                width="100%"
                height="100%"
                size={orbitalSize}
                preset={orbitalPreset}
                quality={orbitalQuality}
                glowIntensity={orbitalGlowIntensity}
                speed={orbitalSpeed}
                background={orbitalBackground}
              />
            </div>
          </div>

          <div className="panel controlPanel">
            <OrbitalPlaygroundPanel
              size={orbitalSize}
              onSizeChange={setOrbitalSize}
              preset={orbitalPreset}
              onPresetChange={setOrbitalPreset}
              quality={orbitalQuality}
              onQualityChange={setOrbitalQuality}
              glowIntensity={orbitalGlowIntensity}
              onGlowIntensityChange={setOrbitalGlowIntensity}
              speed={orbitalSpeed}
              onSpeedChange={setOrbitalSpeed}
              background={orbitalBackground}
              onBackgroundChange={setOrbitalBackground}
            />
          </div>
        </section>

        <section className="miniGrid">
          {orbitalPresetCards.map((card) => (
            <article key={card.preset} className="miniCard">
              <div className="miniSphereWrap">
                <OrbitalVisual
                  width="100%"
                  height="100%"
                  size={240}
                  preset={card.preset}
                  quality="high"
                  glowIntensity="medium"
                  speed={1}
                  background="transparent"
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
