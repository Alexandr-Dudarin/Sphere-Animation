import type {
  OrbitalBackground,
  OrbitalGlowIntensity,
  OrbitalPresetName,
  OrbitalQuality,
} from '../components/OrbitalVisual';

interface OrbitalPlaygroundPanelProps {
  size: number;
  onSizeChange: (value: number) => void;
  preset: OrbitalPresetName;
  onPresetChange: (value: OrbitalPresetName) => void;
  quality: OrbitalQuality;
  onQualityChange: (value: OrbitalQuality) => void;
  glowIntensity: OrbitalGlowIntensity;
  onGlowIntensityChange: (value: OrbitalGlowIntensity) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  background: OrbitalBackground;
  onBackgroundChange: (value: OrbitalBackground) => void;
}

export default function OrbitalPlaygroundPanel({
  size,
  onSizeChange,
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
}: OrbitalPlaygroundPanelProps) {
  return (
    <aside>
      <h2 className="panelTitle">Панель orbital-настройки</h2>
      <p className="panelText">
        Это первая база для orbital / ring visual family. Здесь можно менять
        размер, пресет, качество, свечение и скорость движения орбит.
      </p>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="orbital-size" className="controlLabel">
            Размер
          </label>
          <span className="controlValue">{size}px</span>
        </div>

        <input
          id="orbital-size"
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
          <label htmlFor="orbital-preset" className="controlLabel">
            Пресет
          </label>
        </div>

        <select
          id="orbital-preset"
          className="controlSelect"
          value={preset}
          onChange={(event) =>
            onPresetChange(event.target.value as OrbitalPresetName)
          }
        >
          <option value="atomic-orb">atomic-orb — базовый атом</option>
          <option value="atomic-orb-no-electrons">
            atomic-orb-no-electrons — без электронов
          </option>
          <option value="atomic-orb-more-electrons">
            atomic-orb-more-electrons — больше электронов
          </option>
          <option value="atomic-orb-white">
            atomic-orb-white — белый вариант
          </option>
          <option value="atomic-orb-violet">
            atomic-orb-violet — фиолетовый вариант
          </option>
          <option value="ring-planet">ring-planet — планета с кольцом</option>
        </select>
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="orbital-quality" className="controlLabel">
            Качество
          </label>
        </div>

        <select
          id="orbital-quality"
          className="controlSelect"
          value={quality}
          onChange={(event) =>
            onQualityChange(event.target.value as OrbitalQuality)
          }
        >
          <option value="low">low — низкое</option>
          <option value="medium">medium — среднее</option>
          <option value="high">high — высокое</option>
        </select>
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="orbital-glow" className="controlLabel">
            Свечение
          </label>
        </div>

        <select
          id="orbital-glow"
          className="controlSelect"
          value={glowIntensity}
          onChange={(event) =>
            onGlowIntensityChange(event.target.value as OrbitalGlowIntensity)
          }
        >
          <option value="low">low — слабое</option>
          <option value="medium">medium — среднее</option>
          <option value="high">high — сильное</option>
        </select>
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="orbital-speed" className="controlLabel">
            Скорость
          </label>
          <span className="controlValue">{speed.toFixed(1)}x</span>
        </div>

        <input
          id="orbital-speed"
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
          <label htmlFor="orbital-background" className="controlLabel">
            Фон компонента
          </label>
        </div>

        <select
          id="orbital-background"
          className="controlSelect"
          value={background}
          onChange={(event) =>
            onBackgroundChange(event.target.value as OrbitalBackground)
          }
        >
          <option value="dark">dark — тёмный</option>
          <option value="transparent">transparent — прозрачный</option>
        </select>
      </div>

      <div className="infoBox">
        Сейчас в orbital-family уже есть атомные варианты и первый ring-planet.
        Следующий шаг для этой ветки — gyro-core, portal-gate и другие
        orbital-объекты на том же фундаменте.
      </div>
    </aside>
  );
}