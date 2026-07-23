import { useEffect, useRef, useState, type CSSProperties } from 'react';
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
  orbitalPresetNames,
  type OrbitalPresetCatalogItem,
  type OrbitalPreviewKind,
} from '../components/OrbitalVisual/catalog';
import {
  spherePresetCatalog,
  spherePresetNames,
  type SpherePresetCatalogItem,
} from '../components/SphereVisual/catalog';
import type { PreviewPalette } from '../shared/catalog/visualCatalog.types';
import {
  demoStageBackgroundNames,
  type DemoStageBackground,
} from './demoBackgrounds';
import {
  useStageAvailableSize,
  useStageBoundVisualSize,
} from './useStageBoundVisualSize';

type PreviewKind = 'sphere' | OrbitalPreviewKind;


interface StaticPresetPreviewProps {
  kind: PreviewKind;
  palette: PreviewPalette;
}

const STORAGE_KEYS = {
  spherePreset: 'sphere-visual-lab:sphere-preset',
  sphereMode: 'sphere-visual-lab:sphere-mode',
  sphereStageBackground: 'sphere-visual-lab:sphere-stage-background',
  orbitalPreset: 'sphere-visual-lab:orbital-preset',
  orbitalStageBackground: 'sphere-visual-lab:orbital-stage-background',
} as const;

const sphereModeNames: readonly SphereMode[] = [
  'idle',
  'thinking',
  'searching',
];

function readStoredValue<T extends string>(
  key: string,
  allowedValues: readonly T[],
  fallback: T,
): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);

    return allowedValues.includes(storedValue as T)
      ? (storedValue as T)
      : fallback;
  } catch {
    return fallback;
  }
}

function persistValue(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // В приватном режиме или при запрете storage демо продолжает работать
    // без сохранения состояния.
  }
}

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

      {kind === 'portal' && (
        <>
          <span className="miniPreviewPortalHalo" />
          <span className="miniPreviewPortalFrame miniPreviewPortalFrame--outer" />
          <span className="miniPreviewPortalFrame miniPreviewPortalFrame--middle" />
          <span className="miniPreviewPortalFrame miniPreviewPortalFrame--inner" />
          <span className="miniPreviewPortalTrack miniPreviewPortalTrack--outer" />
          <span className="miniPreviewPortalTrack miniPreviewPortalTrack--inner" />
          <span className="miniPreviewPortalMembrane" />
          <span className="miniPreviewPortalAperture" />
        </>
      )}
    </div>
  );
}

export default function DemoPage() {
  const sphereSectionRef = useRef<HTMLElement>(null);
  const orbitalSectionRef = useRef<HTMLElement>(null);
  const sphereStageRef = useRef<HTMLDivElement>(null);
  const orbitalStageRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);

  const [size, setSize] = useState(440);
  const [mode, setMode] = useState<SphereMode>(() =>
    readStoredValue(
      STORAGE_KEYS.sphereMode,
      sphereModeNames,
      'thinking',
    ),
  );
  const [preset, setPreset] = useState<SpherePresetName>(() =>
    readStoredValue(
      STORAGE_KEYS.spherePreset,
      spherePresetNames,
      'glass-petal',
    ),
  );
  const [quality, setQuality] = useState<SphereQuality>('high');
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>('high');
  const [speed, setSpeed] = useState(1.1);
  const [background, setBackground] =
    useState<SphereBackground>('transparent');
  const [interactive, setInteractive] = useState(true);
  const [sphereStageBackground, setSphereStageBackground] =
    useState<DemoStageBackground>(() =>
      readStoredValue(
        STORAGE_KEYS.sphereStageBackground,
        demoStageBackgroundNames,
        'studio',
      ),
    );

  const [orbitalSize, setOrbitalSize] = useState(440);
  const [orbitalPreset, setOrbitalPreset] =
    useState<OrbitalPresetName>(() =>
      readStoredValue(
        STORAGE_KEYS.orbitalPreset,
        orbitalPresetNames,
        'atomic-orb',
      ),
    );
  const [orbitalQuality, setOrbitalQuality] =
    useState<OrbitalQuality>('high');
  const [orbitalGlowIntensity, setOrbitalGlowIntensity] =
    useState<OrbitalGlowIntensity>('high');
  const [orbitalSpeed, setOrbitalSpeed] = useState(1);
  const [orbitalBackground, setOrbitalBackground] =
    useState<OrbitalBackground>('transparent');
  const [orbitalStageBackground, setOrbitalStageBackground] =
    useState<DemoStageBackground>(() =>
      readStoredValue(
        STORAGE_KEYS.orbitalStageBackground,
        demoStageBackgroundNames,
        'space',
      ),
    );

  const sphereCanvasSize = useStageAvailableSize(sphereStageRef, size);
  const renderedSphereSize = Math.min(size, sphereCanvasSize);
  const renderedOrbitalSize = useStageBoundVisualSize(
    orbitalSize,
    orbitalStageRef,
  );

  useEffect(() => {
    persistValue(STORAGE_KEYS.spherePreset, preset);
  }, [preset]);

  useEffect(() => {
    persistValue(STORAGE_KEYS.sphereMode, mode);
  }, [mode]);

  useEffect(() => {
    persistValue(STORAGE_KEYS.orbitalPreset, orbitalPreset);
  }, [orbitalPreset]);

  useEffect(() => {
    persistValue(
      STORAGE_KEYS.sphereStageBackground,
      sphereStageBackground,
    );
  }, [sphereStageBackground]);

  useEffect(() => {
    persistValue(
      STORAGE_KEYS.orbitalStageBackground,
      orbitalStageBackground,
    );
  }, [orbitalStageBackground]);

  useEffect(
    () => () => {
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    },
    [],
  );

  const scrollToSection = (element: HTMLElement | null) => {
    if (!element) {
      return;
    }

    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches;

        element.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
          inline: 'nearest',
        });

        scrollFrameRef.current = null;
      });

      scrollTimeoutRef.current = null;
    }, 140);
  };

  const openSpherePreset = (card: SpherePresetCatalogItem) => {
    setPreset(card.preset);
    setMode(card.mode);
    scrollToSection(sphereSectionRef.current);
  };

  const openOrbitalPreset = (card: OrbitalPresetCatalogItem) => {
    setOrbitalPreset(card.preset);
    scrollToSection(orbitalSectionRef.current);
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
            <div
              ref={sphereStageRef}
              className={`previewStage previewStage--${sphereStageBackground}`}
              data-stage-background={sphereStageBackground}
              data-rendered-size={renderedSphereSize}
              data-canvas-size={sphereCanvasSize}
            >
              <span className="previewStageBackdrop" aria-hidden="true" />
              <SphereVisual
                renderer="three"
                width={sphereCanvasSize}
                height={sphereCanvasSize}
                size={renderedSphereSize}
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
              stageBackground={sphereStageBackground}
              onStageBackgroundChange={setSphereStageBackground}
              background={background}
              onBackgroundChange={setBackground}
              interactive={interactive}
              onInteractiveChange={setInteractive}
            />
          </div>
        </section>

        <section className="miniGrid" aria-label="Пресеты сферы">
          {spherePresetCatalog.map((card) => {
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
            систем, кольцевых планет, механических ядер и энергетических порталов.
          </p>
        </header>

        <section ref={orbitalSectionRef} className="demoLayout demoAnchor">
          <div className="panel previewPanel">
            <div
              ref={orbitalStageRef}
              className={`previewStage previewStage--${orbitalStageBackground}`}
              data-stage-background={orbitalStageBackground}
              data-rendered-size={renderedOrbitalSize}
            >
              <span className="previewStageBackdrop" aria-hidden="true" />
              <OrbitalVisual
                width="100%"
                height="100%"
                size={renderedOrbitalSize}
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
              stageBackground={orbitalStageBackground}
              onStageBackgroundChange={setOrbitalStageBackground}
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