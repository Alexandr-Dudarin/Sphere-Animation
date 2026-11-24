import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react';
import type { BinaryPlanetPreset, BinaryPlanetQuality } from '../components/BinaryPlanetVisual/BinaryPlanetVisual.types';
import { binaryPlanetPresets, getBinaryPreset } from '../components/BinaryPlanetVisual/binaryPresets';
import { useViewportRenderMode } from './useViewportRenderMode';
import './binaryPlanetDemo.css';

const LazyBinaryPlanet = lazy(() => import('../components/BinaryPlanetVisual/BinaryPlanetVisual'));

export default function BinaryPlanetPlayground() {
  const stage = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [preset, setPreset] = useState<BinaryPlanetPreset>('ice-twins');
  const [size, setSize] = useState(680);
  const [speed, setSpeed] = useState(0.65);
  const [separation, setSeparation] = useState(1.5);
  const [tilt, setTilt] = useState(68);
  const [glow, setGlow] = useState(1);
  const [paused, setPaused] = useState(false);
  const [showRing, setShowRing] = useState(true);
  const [transparent, setTransparent] = useState(false);
  const [quality, setQuality] = useState<BinaryPlanetQuality>('medium');
  const [resetKey, setResetKey] = useState(0);
  const frameloop = useViewportRenderMode(stage, '200px 0px');
  const selected = getBinaryPreset(preset);

  useEffect(() => {
    if (!stage.current || typeof IntersectionObserver === 'undefined') { setMounted(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setMounted(true); observer.disconnect(); }
    }, { rootMargin: '400px 0px' });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  const controls = [
    { id: 'binary-size', title: 'Размер системы', value: size, set: setSize, min: 280, max: 800, step: 10, suffix: ' px' },
    { id: 'binary-speed', title: 'Скорость движения', value: speed, set: setSpeed, min: 0, max: 2, step: 0.05, suffix: '×' },
    { id: 'binary-separation', title: 'Расстояние между планетами', value: separation, set: setSeparation, min: 1.35, max: 1.9, step: 0.05, suffix: '' },
    { id: 'binary-tilt', title: 'Наклон общего кольца', value: tilt, set: setTilt, min: 10, max: 80, step: 1, suffix: '°' },
    { id: 'binary-glow', title: 'Свечение', value: glow, set: setGlow, min: 0, max: 2, step: 0.1, suffix: '' },
  ];
  return <section id="binary-planets" className="binarySection" aria-labelledby="binary-title">
    <header className="pageHeader">
      <p className="eyebrow">Two worlds · one shared ring</p>
      <h2 id="binary-title" className="pageTitle orbitalTitle">Binary Planet System</h2>
      <p className="pageSubtitle">Две планеты внутри одного широкого кольца. Вращение вокруг своих осей и плавный полёт вокруг общего центра.</p>
    </header>
    <div className="demoLayout">
      <div className="panel previewPanel">
        <div ref={stage} className={`binaryStage${transparent ? ' binaryStage--transparent' : ''}`}>
          {mounted ? <Suspense fallback={<p className="binaryLoading">Подготавливаем планеты…</p>}>
            <LazyBinaryPlanet width="100%" height="100%" size={size} preset={preset} speed={speed}
              separation={separation} tilt={tilt} glowIntensity={glow} quality={quality} paused={paused}
              showRing={showRing} resetKey={resetKey} frameloop={frameloop}
              background={transparent ? 'transparent' : 'dark'} />
          </Suspense> : <p className="binaryLoading">Две планеты · общий центр</p>}
          <span className="binaryStageLabel" aria-hidden="true">BINARY / {preset.replaceAll('-', ' ').toUpperCase()}</span>
        </div>
        <p className="binaryCaption" aria-live="polite">{selected.description}</p>
      </div>
      <aside className="panel controlPanel" aria-label="Настройки системы планет">
        <h3 className="panelTitle">Два мира рядом</h3>
        <p className="panelText">Выбери характер системы</p>
        <div className="binaryPresets" role="group" aria-label="Оформление двух планет">
          {binaryPlanetPresets.map((item) => <button type="button" key={item.id}
            aria-pressed={item.id === preset} onClick={() => setPreset(item.id)}>
            <span className="binarySwatches" aria-hidden="true" style={{ '--planet-a': item.planets[0].atmosphere,
              '--planet-b': item.planets[1].atmosphere } as CSSProperties}><i /><i /></span>
            <span>{item.title}</span>
          </button>)}
        </div>
        <div className="binaryActions">
          <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? 'Продолжить' : 'Пауза'}</button>
          <button type="button" onClick={() => setResetKey((value) => value + 1)}>В начало орбиты</button>
        </div>
        {controls.map((control) => <div className="controlGroup" key={control.id}>
          <div className="controlLabelRow">
            <label htmlFor={control.id} className="controlLabel">{control.title}</label>
            <output htmlFor={control.id} className="controlValue">{control.value}{control.suffix}</output>
          </div>
          <input id={control.id} className="controlRange" type="range" min={control.min} max={control.max}
            step={control.step} value={control.value} onChange={(event) => control.set(Number(event.target.value))} />
        </div>)}
        <div className="controlGroup">
          <label htmlFor="binary-quality" className="controlLabel">Качество планет</label>
          <select id="binary-quality" className="controlSelect" value={quality}
            onChange={(event) => setQuality(event.target.value as BinaryPlanetQuality)}>
            <option value="low">Низкое</option><option value="medium">Среднее</option><option value="high">Высокое</option>
          </select>
        </div>
        <label className="binaryCheck"><input type="checkbox" checked={showRing}
          onChange={(event) => setShowRing(event.target.checked)} />Показывать общее кольцо</label>
        <label className="binaryCheck"><input type="checkbox" checked={transparent}
          onChange={(event) => setTransparent(event.target.checked)} />Прозрачный фон</label>
      </aside>
    </div>
  </section>;
}
