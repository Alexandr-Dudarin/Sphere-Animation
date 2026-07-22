import type {
  GlowIntensity,
  SphereBackground,
  SphereMode,
  SpherePresetName,
  SphereQuality,
} from '../components/SphereVisual';
import {
  CustomSelect,
  type CustomSelectOption,
} from '../shared/ui/CustomSelect';

interface PlaygroundPanelProps {
  size: number;
  onSizeChange: (value: number) => void;
  mode: SphereMode;
  onModeChange: (value: SphereMode) => void;
  preset: SpherePresetName;
  onPresetChange: (value: SpherePresetName) => void;
  quality: SphereQuality;
  onQualityChange: (value: SphereQuality) => void;
  glowIntensity: GlowIntensity;
  onGlowIntensityChange: (value: GlowIntensity) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  background: SphereBackground;
  onBackgroundChange: (value: SphereBackground) => void;
  interactive: boolean;
  onInteractiveChange: (value: boolean) => void;
}

const modeOptions: readonly CustomSelectOption<SphereMode>[] = [
  { value: 'idle', label: 'idle — спокойный' },
  { value: 'thinking', label: 'thinking — размышление' },
  { value: 'searching', label: 'searching — поиск' },
];

const presetOptions: readonly CustomSelectOption<SpherePresetName>[] = [
  { value: 'glass-petal', label: 'glass-petal — базовый petal' },
  { value: 'thinking-blue', label: 'thinking-blue — синий thinking' },
  {
    value: 'searching-violet',
    label: 'searching-violet — фиолетовый поиск',
  },
  { value: 'calm-pearl', label: 'calm-pearl — спокойный премиальный' },
  { value: 'neon-core', label: 'neon-core — яркий tech' },
  { value: 'bio-glow', label: 'bio-glow — биолюминесцентный' },
  { value: 'soft-ai', label: 'soft-ai — мягкий AI' },
  { value: 'prism-bloom', label: 'prism-bloom — яркий multicolor' },
];

const qualityOptions: readonly CustomSelectOption<SphereQuality>[] = [
  { value: 'low', label: 'low — низкое' },
  { value: 'medium', label: 'medium — среднее' },
  { value: 'high', label: 'high — высокое' },
];

const glowOptions: readonly CustomSelectOption<GlowIntensity>[] = [
  { value: 'low', label: 'low — слабое' },
  { value: 'medium', label: 'medium — среднее' },
  { value: 'high', label: 'high — сильное' },
];

const backgroundOptions: readonly CustomSelectOption<SphereBackground>[] = [
  { value: 'dark', label: 'dark — тёмный' },
  { value: 'transparent', label: 'transparent — прозрачный' },
];

export default function PlaygroundPanel({
  size,
  onSizeChange,
  mode,
  onModeChange,
  preset,
  onPresetChange,
  quality,
  onQualityChange,
  glowIntensity,
  onGlowIntensityChange,
  speed,
  onSpeedChange,
  background,
  onBackgroundChange,
  interactive,
  onInteractiveChange,
}: PlaygroundPanelProps) {
  return (
    <aside>
      <h2 className="panelTitle">Панель настройки</h2>
      <p className="panelText">
        Это первая база для нашей сферы. Здесь уже можно менять размер,
        режим, пресет, интенсивность свечения и включать реакцию на курсор.
      </p>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="size" className="controlLabel">
            Размер
          </label>
          <span className="controlValue">{size}px</span>
        </div>

        <input
          id="size"
          className="controlRange"
          type="range"
          min="220"
          max="530"
          step="1"
          value={size}
          onChange={(event) => onSizeChange(Number(event.target.value))}
        />
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="mode" className="controlLabel">
            Режим
          </label>
        </div>

        <CustomSelect<SphereMode>
          id="mode"
          value={mode}
          options={modeOptions}
          onChange={onModeChange}
        />
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="preset" className="controlLabel">
            Пресет
          </label>
        </div>

        <CustomSelect<SpherePresetName>
          id="preset"
          value={preset}
          options={presetOptions}
          onChange={onPresetChange}
        />
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="quality" className="controlLabel">
            Качество
          </label>
        </div>

        <CustomSelect<SphereQuality>
          id="quality"
          value={quality}
          options={qualityOptions}
          onChange={onQualityChange}
        />
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="glow" className="controlLabel">
            Свечение
          </label>
        </div>

        <CustomSelect<GlowIntensity>
          id="glow"
          value={glowIntensity}
          options={glowOptions}
          onChange={onGlowIntensityChange}
        />
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="speed" className="controlLabel">
            Скорость
          </label>
          <span className="controlValue">{speed.toFixed(1)}x</span>
        </div>

        <input
          id="speed"
          className="controlRange"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
        />
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="background" className="controlLabel">
            Фон компонента
          </label>
        </div>

        <CustomSelect<SphereBackground>
          id="background"
          value={background}
          options={backgroundOptions}
          onChange={onBackgroundChange}
        />
      </div>

      <div className="controlGroup">
        <div className="checkboxRow">
          <input
            id="interactive"
            type="checkbox"
            checked={interactive}
            onChange={(event) => onInteractiveChange(event.target.checked)}
          />
          <label htmlFor="interactive" className="controlLabel">
            Реакция на курсор
          </label>
        </div>
      </div>

      <div className="infoBox">
        Следующий шаг после этой базы — либо усиливать CSS-версию, либо позже
        заменить внутренний рендер на более сложный, не ломая внешний
        интерфейс компонента.
      </div>
    </aside>
  );
}
