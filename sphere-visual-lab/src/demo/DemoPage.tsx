import { useRef, useState, type CSSProperties } from 'react';
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
import {
  orbitalObjectCatalog,
  type OrbitalPresetCatalogItem,
  type OrbitalPreviewKind,
  type PreviewPalette,
} from './orbitalCatalog';

type PreviewKind = 'sphere' | OrbitalPreviewKind;

interface PresetCard {
  preset: SpherePresetName;
  mode: SphereMode;
  title: string;
  text: string;
  palette: PreviewPalette;
}

interface StaticPresetPreviewProps {
  kind: PreviewKind;
  palette: PreviewPalette;
}

const presetCards: PresetCard[] = [
  {
    preset: 'glass-petal',
    mode: 'thinking',
    title: 'glass-petal',
    text: 'Наша текущая сильная baseline-версия: стеклянная оболочка, лепестковая структура и мягкий внутренний haze.',
    palette: { core: '#f7fbff', glow: '#72ddff', accent: '#9b83ff' },
  },
  {
    preset: 'thinking-blue',
    mode: 'thinking',
    title: 'thinking-blue',
    text: 'Более собранный и холодный характер с ощущением концентрации и размышления.',
    palette: { core: '#f4fbff', glow: '#66c8ff', accent: '#4078ff' },
  },
  {
    preset: 'searching-violet',
    mode: 'searching',
    title: 'searching-violet',
    text: 'Более активный и выразительный вариант, хорошо подходящий под поиск, AI и lab-настроение.',
    palette: { core: '#fff7ff', glow: '#d477ff', accent: '#6b54ff' },
  },
  {
    preset: 'calm-pearl',
    mode: 'idle',
    title: 'calm-pearl',
    text: 'Спокойный премиальный пресет: мягкий, светлый и деликатный, почти luxury-настроение.',
    palette: { core: '#ffffff', glow: '#d9ecff', accent: '#aab7d7' },
  },
  {
    preset: 'neon-core',
    mode: 'searching',
    title: 'neon-core',
    text: 'Яркий технологичный вариант с более контрастным свечением и выраженным AI/tech-характером.',
    palette: { core: '#ffffff', glow: '#69f3ff', accent: '#d24cff' },
  },
  {
    preset: 'bio-glow',
    mode: 'thinking',
    title: 'bio-glow',
    text: 'Более органичный и биолюминесцентный вариант: живой, мягкий и мятно-лазурный.',
    palette: { core: '#effff9', glow: '#6fffd2', accent: '#3ba9c9' },
  },
  {
    preset: 'soft-ai',
    mode: 'idle',
    title: 'soft-ai',
    text: 'Мягкий базовый AI-вариант: спокойный, светящийся, универсальный для нейтральных интерфейсов.',
    palette: { core: '#ffffff', glow: '#9fdfff', accent: '#7e91ff' },
  },
  {
    preset: 'prism-bloom',
    mode: 'searching',
    title: 'prism-bloom',
    text: 'Более яркий и насыщенный вариант с усиленным внутренним glow и более спектральным характером.',
    palette: { core: '#ffffff', glow: '#8cf5ff', accent: '#bd69ff' },
  },
];

function StaticPresetPreview({ kind, palette }: StaticPresetPreviewProps) {
  const style = {
    '--preview-core': palette.core,
    '--preview-glow': palette.glow,
    '--preview-accent': palette.accent,
  } as CSSProperties;

  return (
    <div
      className={`miniStaticPreview miniStaticPreview--${kind}`}
      style={style}
      aria-hidden="true"
    >
      <span className="miniPreviewAura" />

      {kind === 'sphere' && (
        <>
          <span className="miniPreviewSphereShell" />
          <span className="miniPreviewPetal miniPreviewPetal--1" />
          <span className="miniPreviewPetal miniPreviewPetal--2" />
          <span className="miniPreviewPetal miniPreviewPetal--3" />
          <span className="miniPreviewPetal miniPreviewPetal--4" />
          <span className="miniPreviewPetal miniPreviewPetal--5" />
          <span className="miniPreviewPetal miniPreviewPetal--6" />
          <span className="miniPreviewCore" />
        </>
      )}

      {kind === 'atom' && (
        <>
          <span className="miniPreviewOrbit miniPreviewOrbit--1" />
          <span className="miniPreviewOrbit miniPreviewOrbit--2" />
          <span className="miniPreviewOrbit miniPreviewOrbit--3" />
          <span className="miniPreviewCore" />
          <span className="miniPreviewElectron miniPreviewElectron--1" />
          <span className="miniPreviewElectron miniPreviewElectron--2" />
          <span className="miniPreviewElectron miniPreviewElectron--3" />
        </>
      )}

      {kind === 'planet' && (
        <>
          <span className="miniPreviewPlanet" />
          <span className="miniPreviewPlanetRing miniPreviewPlanetRing--back" />
          <span className="miniPreviewPlanetRing miniPreviewPlanetRing--front" />
          <span className="miniPreviewPlanetSpark miniPreviewPlanetSpark--1" />
          <span className="miniPreviewPlanetSpark miniPreviewPlanetSpark--2" />
          <span className="miniPreviewPlanetSpark miniPreviewPlanetSpark--3" />
        </>
      )}

      {kind === 'gyro' && (
        <>
          <span className="miniPreviewGyroRing miniPreviewGyroRing--1" />
          <span className="miniPreviewGyroRing miniPreviewGyroRing--2" />
          <span className="miniPreviewGyroRing miniPreviewGyroRing--3" />
          <span className="miniPreviewCore" />
        </>
      )}
    </div>
  );
}

export default function DemoPage() {
  const sphereSectionRef = useRef<HTMLElement>(null);
  const orbitalSectionRef = useRef<HTMLElement>(null);

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

  const openSpherePreset = (card: PresetCard) => {
    setPreset(card.preset);
    setMode(card.mode);

    window.requestAnimationFrame(() => {
      sphereSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const openOrbitalPreset = (card: OrbitalPresetCatalogItem) => {
    setOrbitalPreset(card.preset);

    window.requestAnimationFrame(() => {
      orbitalSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
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
            будущие режимы, новые пресеты и другие visual family.
          </p>
        </header>

        <section ref={sphereSectionRef} className="demoLayout demoAnchor">
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

        <section className="miniGrid" aria-label="Пресеты сферы">
          {presetCards.map((card) => {
            const isSelected = preset === card.preset;

            return (
              <button
                key={card.preset}
                type="button"
                className={`miniCard miniCardButton${
                  isSelected ? ' miniCard--selected' : ''
                }`}
                onClick={() => openSpherePreset(card)}
                aria-pressed={isSelected}
              >
                <StaticPresetPreview kind="sphere" palette={card.palette} />

                <span className="miniCardContent">
                  <span className="miniLabel">{card.title}</span>
                  <span className="miniText">{card.text}</span>
                  <span className="miniAction">
                    {isSelected
                      ? 'Открыто на основной сцене'
                      : 'Открыть на основной сцене'}
                  </span>
                </span>
              </button>
            );
          })}
        </section>

        <header className="pageHeader orbitalHeader">
          <p className="eyebrow">Orbital Visual Lab</p>
          <h2 className="pageTitle orbitalTitle">
            Reusable Orbital Visual v1
          </h2>
          <p className="pageSubtitle">
            Отдельная ветка orbital / ring / ribbon объектов: гладкие
            светящиеся орбиты без point-look, на базе TubeGeometry и flow по
            линии. Общая база для orbital / ring / ribbon объектов: атомных
            систем, кольцевых планет и будущих механических visual family.
          </p>
        </header>

        <section ref={orbitalSectionRef} className="demoLayout demoAnchor">
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

        <section
          className="presetFamilies"
          aria-label="Orbital-пресеты по семействам"
        >
          {orbitalObjectCatalog.map((object) => {
            const headingId = `orbital-family-${object.id}`;

            return (
              <section
                key={object.id}
                className="presetFamilySection"
                aria-labelledby={headingId}
              >
                <div className="presetFamilyHeader">
                  <div>
                    <p className="presetFamilyEyebrow">{object.eyebrow}</p>
                    <h3 id={headingId} className="presetFamilyTitle">
                      {object.title}
                    </h3>
                    <p className="presetFamilyDescription">
                      {object.description}
                    </p>
                  </div>

                  <span className="presetFamilyCount">
                    {object.presets.length} пресетов
                  </span>
                </div>

                <div className="miniGrid presetFamilyGrid">
                  {object.presets.map((card) => {
                    const isSelected = orbitalPreset === card.preset;

                    return (
                      <button
                        key={card.preset}
                        type="button"
                        className={`miniCard miniCardButton${
                          isSelected ? ' miniCard--selected' : ''
                        }`}
                        onClick={() => openOrbitalPreset(card)}
                        aria-pressed={isSelected}
                      >
                        <StaticPresetPreview
                          kind={card.previewKind}
                          palette={card.palette}
                        />

                        <span className="miniCardContent">
                          <span className="miniLabel">{card.title}</span>
                          <span className="miniText">{card.text}</span>
                          <span className="miniAction">
                            {isSelected
                              ? 'Открыто на основной сцене'
                              : 'Открыть на основной сцене'}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </section>
      </div>
    </main>
  );
}