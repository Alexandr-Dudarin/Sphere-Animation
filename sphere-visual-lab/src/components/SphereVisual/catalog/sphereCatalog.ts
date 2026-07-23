import type {
  SphereMode,
  SpherePresetName,
} from '../SphereVisual.types';
import type {
  PreviewPalette,
  VisualCatalogOption,
} from '../../../shared/catalog/visualCatalog.types';

export interface SpherePresetCatalogItem {
  preset: SpherePresetName;
  mode: SphereMode;
  title: string;
  selectLabel: string;
  text: string;
  palette: PreviewPalette;
}

export const spherePresetCatalog: readonly SpherePresetCatalogItem[] = [
  {
    preset: 'glass-petal',
    mode: 'thinking',
    title: 'glass-petal',
    selectLabel: 'glass-petal — базовый petal',
    text: 'Наша текущая сильная baseline-версия: стеклянная оболочка, лепестковая структура и мягкий внутренний haze.',
    palette: { core: '#f7fbff', glow: '#72ddff', accent: '#9b83ff' },
  },
  {
    preset: 'thinking-blue',
    mode: 'thinking',
    title: 'thinking-blue',
    selectLabel: 'thinking-blue — синий thinking',
    text: 'Более собранный и холодный характер с ощущением концентрации и размышления.',
    palette: { core: '#f4fbff', glow: '#66c8ff', accent: '#4078ff' },
  },
  {
    preset: 'searching-violet',
    mode: 'searching',
    title: 'searching-violet',
    selectLabel: 'searching-violet — фиолетовый поиск',
    text: 'Более активный и выразительный вариант, хорошо подходящий под поиск, AI и lab-настроение.',
    palette: { core: '#fff7ff', glow: '#d477ff', accent: '#6b54ff' },
  },
  {
    preset: 'calm-pearl',
    mode: 'idle',
    title: 'calm-pearl',
    selectLabel: 'calm-pearl — спокойный премиальный',
    text: 'Спокойный премиальный пресет: мягкий, светлый и деликатный, почти luxury-настроение.',
    palette: { core: '#ffffff', glow: '#d9ecff', accent: '#aab7d7' },
  },
  {
    preset: 'neon-core',
    mode: 'searching',
    title: 'neon-core',
    selectLabel: 'neon-core — яркий tech',
    text: 'Яркий технологичный вариант с более контрастным свечением и выраженным AI/tech-характером.',
    palette: { core: '#ffffff', glow: '#69f3ff', accent: '#d24cff' },
  },
  {
    preset: 'bio-glow',
    mode: 'thinking',
    title: 'bio-glow',
    selectLabel: 'bio-glow — биолюминесцентный',
    text: 'Более органичный и биолюминесцентный вариант: живой, мягкий и мятно-лазурный.',
    palette: { core: '#effff9', glow: '#6fffd2', accent: '#3ba9c9' },
  },
  {
    preset: 'soft-ai',
    mode: 'idle',
    title: 'soft-ai',
    selectLabel: 'soft-ai — мягкий AI',
    text: 'Мягкий базовый AI-вариант: спокойный, светящийся, универсальный для нейтральных интерфейсов.',
    palette: { core: '#ffffff', glow: '#9fdfff', accent: '#7e91ff' },
  },
  {
    preset: 'prism-bloom',
    mode: 'searching',
    title: 'prism-bloom',
    selectLabel: 'prism-bloom — яркий multicolor',
    text: 'Более яркий и насыщенный вариант с усиленным внутренним glow и более спектральным характером.',
    palette: { core: '#ffffff', glow: '#8cf5ff', accent: '#bd69ff' },
  },
];

export const spherePresetNames: readonly SpherePresetName[] =
  spherePresetCatalog.map((item) => item.preset);

export const spherePresetOptions: readonly VisualCatalogOption<SpherePresetName>[] =
  spherePresetCatalog.map((item) => ({
    value: item.preset,
    label: item.selectLabel,
  }));
