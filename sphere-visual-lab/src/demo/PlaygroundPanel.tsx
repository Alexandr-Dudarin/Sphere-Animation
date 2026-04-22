import type {
  GlowIntensity,
  SphereBackground,
  SphereMode,
  SpherePresetName,
  SphereQuality,
} from '../components/SphereVisual';

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
          max="560"
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

        <select
          id="mode"
          className="controlSelect"
          value={mode}
          onChange={(event) => onModeChange(event.target.value as SphereMode)}
        >
          <option value="idle">idle — спокойный</option>
          <option value="thinking">thinking — размышление</option>
          <option value="searching">searching — поиск</option>
        </select>
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="preset" className="controlLabel">
            Пресет
          </label>
        </div>

        <select
          id="preset"
          className="controlSelect"
          value={preset}
          onChange={(event) =>
            onPresetChange(event.target.value as SpherePresetName)
          }
        >
          <option value="soft-ai">soft-ai — мягкий AI</option>
          <option value="thinking-blue">thinking-blue — синий thinking</option>
          <option value="searching-violet">
            searching-violet — фиолетовый поиск
          </option>
        </select>
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="quality" className="controlLabel">
            Качество
          </label>
        </div>

        <select
          id="quality"
          className="controlSelect"
          value={quality}
          onChange={(event) =>
            onQualityChange(event.target.value as SphereQuality)
          }
        >
          <option value="low">low — низкое</option>
          <option value="medium">medium — среднее</option>
          <option value="high">high — высокое</option>
        </select>
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="glow" className="controlLabel">
            Свечение
          </label>
        </div>

        <select
          id="glow"
          className="controlSelect"
          value={glowIntensity}
          onChange={(event) =>
            onGlowIntensityChange(event.target.value as GlowIntensity)
          }
        >
          <option value="low">low — слабое</option>
          <option value="medium">medium — среднее</option>
          <option value="high">high — сильное</option>
        </select>
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

        <select
          id="background"
          className="controlSelect"
          value={background}
          onChange={(event) =>
            onBackgroundChange(event.target.value as SphereBackground)
          }
        >
          <option value="dark">dark — тёмный</option>
          <option value="transparent">transparent — прозрачный</option>
        </select>
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
        заменить внутренний рендер (способ отрисовки) на более сложный, не
        ломая внешний интерфейс компонента.
      </div>
    </aside>
  );
}