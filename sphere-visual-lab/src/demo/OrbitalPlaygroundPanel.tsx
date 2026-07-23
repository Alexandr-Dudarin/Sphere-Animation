import type {
  OrbitalBackground,
  OrbitalGlowIntensity,
  OrbitalPresetName,
  OrbitalQuality,
} from '../components/OrbitalVisual';
import {
  CustomSelect,
  type CustomSelectOption,
} from '../shared/ui/CustomSelect';
import {
  getOrbitalObjectById,
  getOrbitalObjectIdForPreset,
  getOrbitalPresetOptions,
  orbitalObjectOptions,
  type OrbitalObjectId,
} from '../components/OrbitalVisual/catalog';
import {
  demoStageBackgroundOptions,
  type DemoStageBackground,
} from './demoBackgrounds';

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
  stageBackground: DemoStageBackground;
  onStageBackgroundChange: (value: DemoStageBackground) => void;
  background: OrbitalBackground;
  onBackgroundChange: (value: OrbitalBackground) => void;
}

const qualityOptions: readonly CustomSelectOption<OrbitalQuality>[] = [
  { value: 'low', label: 'low — низкое' },
  { value: 'medium', label: 'medium — среднее' },
  { value: 'high', label: 'high — высокое' },
];

const glowOptions: readonly CustomSelectOption<OrbitalGlowIntensity>[] = [
  { value: 'low', label: 'low — слабое' },
  { value: 'medium', label: 'medium — среднее' },
  { value: 'high', label: 'high — сильное' },
];

const backgroundOptions: readonly CustomSelectOption<OrbitalBackground>[] = [
  { value: 'dark', label: 'dark — тёмный' },
  { value: 'transparent', label: 'transparent — прозрачный' },
];

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
  stageBackground,
  onStageBackgroundChange,
  background,
  onBackgroundChange,
}: OrbitalPlaygroundPanelProps) {
  const objectId = getOrbitalObjectIdForPreset(preset);
  const selectedObject = getOrbitalObjectById(objectId);
  const presetOptions = getOrbitalPresetOptions(objectId);

  const handleObjectChange = (nextObjectId: OrbitalObjectId) => {
    onPresetChange(getOrbitalObjectById(nextObjectId).defaultPreset);
  };

  return (
    <aside>
      <h2 className="panelTitle">Панель orbital-настройки</h2>
      <p className="panelText">
        Сначала выберите объект, затем его конкретный пресет. Размер,
        качество, свечение и общая скорость применяются к текущему варианту.
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
          <label htmlFor="orbital-object" className="controlLabel">
            Объект
          </label>
        </div>

        <CustomSelect<OrbitalObjectId>
          id="orbital-object"
          value={objectId}
          options={orbitalObjectOptions}
          onChange={handleObjectChange}
        />
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="orbital-preset" className="controlLabel">
            Пресет
          </label>
        </div>

        <CustomSelect<OrbitalPresetName>
          id="orbital-preset"
          value={preset}
          options={presetOptions}
          onChange={onPresetChange}
        />
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="orbital-quality" className="controlLabel">
            Качество
          </label>
        </div>

        <CustomSelect<OrbitalQuality>
          id="orbital-quality"
          value={quality}
          options={qualityOptions}
          onChange={onQualityChange}
        />
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="orbital-glow" className="controlLabel">
            Свечение
          </label>
        </div>

        <CustomSelect<OrbitalGlowIntensity>
          id="orbital-glow"
          value={glowIntensity}
          options={glowOptions}
          onChange={onGlowIntensityChange}
        />
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
          <label htmlFor="orbital-stage-background" className="controlLabel">
            Фон сцены
          </label>
        </div>

        <CustomSelect<DemoStageBackground>
          id="orbital-stage-background"
          value={stageBackground}
          options={demoStageBackgroundOptions}
          onChange={onStageBackgroundChange}
        />
      </div>

      <div className="controlGroup">
        <div className="controlLabelRow">
          <label htmlFor="orbital-background" className="controlLabel">
            Фон компонента
          </label>
        </div>

        <CustomSelect<OrbitalBackground>
          id="orbital-background"
          value={background}
          options={backgroundOptions}
          onChange={onBackgroundChange}
        />
      </div>

      <div className="infoBox">
        Выбрано семейство <strong>{selectedObject.title}</strong>. В нём
        доступно пресетов: {selectedObject.presets.length}. Карточки ниже
        остаются синхронизированы с обоими селектами.
      </div>
    </aside>
  );
}
