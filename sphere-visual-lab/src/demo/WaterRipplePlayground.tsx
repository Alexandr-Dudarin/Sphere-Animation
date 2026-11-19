import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useViewportRenderMode } from './useViewportRenderMode';
import type { WaterRippleQuality, WaterRippleVariant } from '../components/WaterRippleVisual';
import { rippleDefaults } from '../components/WaterRippleVisual/rippleConfig';
import { waterVariants } from './waterVariants';
import './waterRippleDemo.css';

const LazyWaterRipple = lazy(() => import('../components/WaterRippleVisual/WaterRippleVisual'));

export default function WaterRipplePlayground() {
  const stage = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [speed, setSpeed] = useState<number>(rippleDefaults.speed);
  const [lineWidth, setLineWidth] = useState<number>(rippleDefaults.lineWidth);
  const [variant, setVariant] = useState<WaterRippleVariant>('droplet');
  const [intensity, setIntensity] = useState(1);
  const [glow, setGlow] = useState(1.3);
  const [tilt, setTilt] = useState(22);
  const [dropInterval, setDropInterval] = useState(4);
  const [ringInterval, setRingInterval] = useState<number>(rippleDefaults.rippleInterval);
  const [damping, setDamping] = useState(0.55);
  const [paused, setPaused] = useState(false);
  const [dropKey, setDropKey] = useState(0);
  const [quality, setQuality] = useState<WaterRippleQuality>('medium');
  const [transparent, setTransparent] = useState(false);
  const frameloop = useViewportRenderMode(stage, '200px 0px');
  const selected = waterVariants.find((item) => item.id === variant)!;
  const isClassic = variant === 'droplet' || variant === 'ripples' || variant === 'crown';
  const interval = variant === 'ripples' ? ringInterval : dropInterval;
  const setInterval = variant === 'ripples' ? setRingInterval : setDropInterval;
  const intensityTitle = variant === 'rain' ? 'Плотность дождя' : 'Сила потока';
  const action = isClassic ? 'Новая капля' : variant === 'interactive' ? 'Новая волна' : 'Начать заново';

  useEffect(() => {
    if (!stage.current || typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setMounted(true);
        observer.disconnect();
      }
    }, { rootMargin: '400px 0px' });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  const controls = [
    { id: 'water-speed', title: 'Скорость', value: speed, set: setSpeed, min: 0.2, max: 2, step: 0.1, suffix: '×' },
    { id: 'water-glow', title: 'Свечение', value: glow, set: setGlow, min: 0.2, max: 2, step: 0.1, suffix: '' },
    { id: 'water-line-width', title: 'Толщина линий', value: Number((lineWidth / rippleDefaults.lineWidth).toFixed(2)), set: (value: number) => setLineWidth(value * rippleDefaults.lineWidth), min: 0.2, max: 2, step: 0.05, suffix: '×' },
    { id: 'water-tilt', title: 'Угол обзора', value: tilt, set: setTilt, min: 10, max: 75, step: 1, suffix: '°' },
    ...(isClassic ? [{ id: 'water-interval', title: 'Интервал между каплями', value: interval, set: setInterval, min: 3, max: 10, step: 0.1, suffix: ' с' }] : []),
    { id: 'water-damping', title: 'Затухание', value: damping, set: setDamping, min: 0.2, max: 2, step: 0.05, suffix: '' },
    ...(!isClassic && variant !== 'interactive' ? [{ id: 'water-intensity', title: intensityTitle, value: intensity, set: setIntensity, min: 0.3, max: 2, step: 0.1, suffix: '×' }] : []),
  ];

  return (
    <section id="water-ripple" className="waterSection" aria-labelledby="water-title">
      <header className="pageHeader">
        <p className="eyebrow">Water Visual Lab</p>
        <h2 id="water-title" className="pageTitle orbitalTitle">Движение воды</h2>
        <p className="pageSubtitle">От одной капли до целого водопада. Шесть способов оживить воду тонкими светящимися линиями.</p>
      </header>
      <div className="demoLayout">
        <div className="panel previewPanel">
          <div ref={stage} className={`waterStage${transparent ? ' waterStage--transparent' : ''}`}>
            {mounted ? <Suspense fallback={<p className="waterLoading">Подготавливаем поверхность…</p>}>
              <LazyWaterRipple width="100%" height="100%" size={700} quality={quality} variant={variant} lineWidth={lineWidth}
                speed={speed} glowIntensity={glow} tilt={tilt} rippleInterval={interval} intensity={intensity}
                damping={damping} paused={paused} dropKey={dropKey} frameloop={frameloop}
                background={transparent ? 'transparent' : 'dark'} />
            </Suspense> : <p className="waterLoading">Водная поверхность</p>}
            <span className="waterStageLabel" aria-hidden="true">{selected.label}</span>
          </div>
          <p className="waterCaption" aria-live="polite">{selected.description}</p>
        </div>
        <aside className="panel controlPanel" aria-label="Настройки ряби">
          <h3 className="panelTitle">Выбери свой ритм</h3>
          <p className="panelText">Варианты воды</p>
          <div className="waterVariants" role="group" aria-label="Вариант воды">
            {waterVariants.map((item) => <button key={item.id} type="button" aria-pressed={variant === item.id}
              onClick={() => { setVariant(item.id); setPaused(false); }}>{item.title}</button>)}
          </div>
          <div className="waterActions">
            <button type="button" onClick={() => { setDropKey((v) => v + 1); setPaused(false); }}>{action}</button>
            <button type="button" aria-pressed={paused} onClick={() => setPaused((v) => !v)}>{paused ? 'Продолжить' : 'Пауза'}</button>
          </div>
          {controls.map((control) => <div className="controlGroup" key={control.id}>
            <div className="controlLabelRow">
              <label htmlFor={control.id} className="controlLabel">{control.title}</label>
              <output htmlFor={control.id} className="controlValue">{control.value}{control.suffix}</output>
            </div>
            <input id={control.id} className="controlRange" type="range" min={control.min} max={control.max}
              step={control.step} value={control.value} onChange={(e) => control.set(Number(e.target.value))} />
          </div>)}
          <div className="controlGroup">
            <label htmlFor="water-quality" className="controlLabel">Качество</label>
            <select id="water-quality" className="controlSelect" value={quality}
              onChange={(e) => setQuality(e.target.value as WaterRippleQuality)}>
              <option value="low">Низкое</option><option value="medium">Среднее</option><option value="high">Высокое</option>
            </select>
          </div>
          <label className="checkboxRow controlLabel"><input type="checkbox" checked={transparent}
            onChange={(e) => setTransparent(e.target.checked)} />Прозрачный фон</label>
        </aside>
      </div>
    </section>
  );
}
