import type { OrbitalPresetName } from '../components/OrbitalVisual';
import type { CustomSelectOption } from '../shared/ui/CustomSelect';

export type OrbitalObjectId =
  | 'atomic-orb'
  | 'ring-planet'
  | 'gyro-core'
  | 'portal-gate';
export type OrbitalPreviewKind = 'atom' | 'planet' | 'gyro' | 'portal';

export interface PreviewPalette {
  core: string;
  glow: string;
  accent: string;
}

export interface OrbitalPresetCatalogItem {
  preset: OrbitalPresetName;
  title: string;
  selectLabel: string;
  text: string;
  previewKind: OrbitalPreviewKind;
  palette: PreviewPalette;
}

export interface OrbitalObjectCatalogItem {
  id: OrbitalObjectId;
  title: string;
  selectLabel: string;
  eyebrow: string;
  description: string;
  defaultPreset: OrbitalPresetName;
  presets: readonly OrbitalPresetCatalogItem[];
}

const atomicPresets: readonly OrbitalPresetCatalogItem[] = [
  {
    preset: 'atomic-orb',
    title: 'atomic-orb',
    selectLabel: 'atomic-orb — базовый атом',
    text: 'Базовый атомный пресет: симметричные орбиты, яркое ядро и читаемые электроны.',
    previewKind: 'atom',
    palette: { core: '#ffffff', glow: '#75e9ff', accent: '#3f8fff' },
  },
  {
    preset: 'atomic-orb-no-electrons',
    title: 'atomic-orb-no-electrons',
    selectLabel: 'atomic-orb-no-electrons — без электронов',
    text: 'Тот же базовый атом, но без электронов — более чистый и графичный orbital-вариант.',
    previewKind: 'atom',
    palette: { core: '#effcff', glow: '#70dcff', accent: '#3976df' },
  },
  {
    preset: 'atomic-orb-more-electrons',
    title: 'atomic-orb-more-electrons',
    selectLabel: 'atomic-orb-more-electrons — больше электронов',
    text: 'Версия с заметно большим количеством электронов и более активным визуальным ритмом.',
    previewKind: 'atom',
    palette: { core: '#ffffff', glow: '#8cf4ff', accent: '#4f91ff' },
  },
  {
    preset: 'atomic-orb-white',
    title: 'atomic-orb-white',
    selectLabel: 'atomic-orb-white — белый вариант',
    text: 'Более белый и холодный вариант атома — светлый, аккуратный и почти crystalline по настроению.',
    previewKind: 'atom',
    palette: { core: '#ffffff', glow: '#e5f7ff', accent: '#7fbce2' },
  },
  {
    preset: 'atomic-orb-violet',
    title: 'atomic-orb-violet',
    selectLabel: 'atomic-orb-violet — фиолетовый вариант',
    text: 'Фиолетовый вариант атома с более мягким sci-fi / tech-art характером.',
    previewKind: 'atom',
    palette: { core: '#fff8ff', glow: '#e092ff', accent: '#725dff' },
  },
];

const planetPresets: readonly OrbitalPresetCatalogItem[] = [
  {
    preset: 'ring-planet',
    title: 'ring-planet',
    selectLabel: 'ring-planet — сдержанная планета',
    text: 'Сдержанная планета без частиц: крупное ядро, читаемые кольца и более спокойный космический характер.',
    previewKind: 'planet',
    palette: { core: '#4ea7ff', glow: '#2d72ff', accent: '#173f9e' },
  },
  {
    preset: 'ring-planet-stardust',
    title: 'ring-planet-stardust',
    selectLabel: 'ring-planet-stardust — планета со звёздной пылью',
    text: 'Декоративная версия планеты с мерцающей пылью на передней и задней частях колец.',
    previewKind: 'planet',
    palette: { core: '#58b0ff', glow: '#7edfff', accent: '#2857d1' },
  },
  {
    preset: 'ring-planet-sand',
    title: 'ring-planet-sand',
    selectLabel: 'ring-planet-sand — песочная планета',
    text: 'Тёплая песочно-карамельная планета без частиц — спокойный и более премиальный вариант.',
    previewKind: 'planet',
    palette: { core: '#d89442', glow: '#bd6c2f', accent: '#6b321d' },
  },
  {
    preset: 'ring-planet-sand-stardust',
    title: 'ring-planet-sand-stardust',
    selectLabel: 'ring-planet-sand-stardust — песочная планета с пылью',
    text: 'Песочная планета с редкой кремово-золотистой пылью и более медленным движением.',
    previewKind: 'planet',
    palette: { core: '#e4a04d', glow: '#ffd58a', accent: '#7d4325' },
  },
  {
    preset: 'ring-planet-ice',
    title: 'ring-planet-ice',
    selectLabel: 'ring-planet-ice — ледяная планета',
    text: 'Ледяная версия с меньшим ядром, более широкими тонкими кольцами и редкой холодной пылью.',
    previewKind: 'planet',
    palette: { core: '#b8eaff', glow: '#61cfff', accent: '#28678f' },
  },
  {
    preset: 'ring-planet-eclipse',
    title: 'ring-planet-eclipse',
    selectLabel: 'ring-planet-eclipse — затмение',
    text: 'Тёмная драматичная планета с близкими бронзовыми кольцами и редкими янтарными искрами.',
    previewKind: 'planet',
    palette: { core: '#8b3a1d', glow: '#f1722d', accent: '#32150f' },
  },
];

const gyroPresets: readonly OrbitalPresetCatalogItem[] = [
  {
    preset: 'gyro-core',
    title: 'gyro-core',
    selectLabel: 'gyro-core — базовое гироскопическое ядро',
    text: 'Базовое механическое ядро: три сегментированных кольца в разных плоскостях, холодные световые дорожки и независимое контрвращение.',
    previewKind: 'gyro',
    palette: { core: '#eaffff', glow: '#64efff', accent: '#1b6977' },
  },
  {
    preset: 'gyro-core-precision',
    title: 'gyro-core-precision',
    selectLabel: 'gyro-core-precision — ледяное ядро',
    text: 'Ледяной вариант: более тонкие кольца, мягкое бело-голубое ядро и спокойная механическая хореография.',
    previewKind: 'gyro',
    palette: { core: '#f3fcff', glow: '#9fe8ff', accent: '#6e91a8' },
  },
  {
    preset: 'gyro-core-reactor',
    title: 'gyro-core-reactor',
    selectLabel: 'gyro-core-reactor — реакторное ядро',
    text: 'Активный реакторный вариант: увеличенное фиолетово-лазурное ядро, яркие дорожки и более энергичное движение.',
    previewKind: 'gyro',
    palette: { core: '#eee5ff', glow: '#68e9ff', accent: '#764cb2' },
  },
  {
    preset: 'gyro-core-amber',
    title: 'gyro-core-amber',
    selectLabel: 'gyro-core-amber — янтарное ядро',
    text: 'Тёплый механический вариант: бронзовые кольца, янтарное ядро и более тяжёлое, размеренное вращение.',
    previewKind: 'gyro',
    palette: { core: '#ffe1ad', glow: '#f4a348', accent: '#75472b' },
  },
];

const portalPresets: readonly OrbitalPresetCatalogItem[] = [
  {
    preset: 'portal-gate',
    title: 'portal-gate',
    selectLabel: 'portal-gate — базовый энергетический портал',
    text: 'Базовый холодный портал: сегментированные концентрические кольца, живая энергетическая мембрана и независимое вращение слоёв.',
    previewKind: 'portal',
    palette: { core: '#efffff', glow: '#4ee1ff', accent: '#2d5bd6' },
  },
  {
    preset: 'portal-gate-violet',
    title: 'portal-gate-violet',
    selectLabel: 'portal-gate-violet — фиолетовый портал',
    text: 'Более активный фиолетово-лазурный портал с усиленной турбулентностью мембраны и более быстрым движением колец.',
    previewKind: 'portal',
    palette: { core: '#fff5ff', glow: '#b969ff', accent: '#454fe8' },
  },
  {
    preset: 'portal-gate-ember',
    title: 'portal-gate-ember',
    selectLabel: 'portal-gate-ember — янтарный портал',
    text: 'Тёплый тяжёлый вариант: массивные янтарно-бронзовые сегменты, более медленное вращение и огненная энергетическая глубина.',
    previewKind: 'portal',
    palette: { core: '#fff0c2', glow: '#ff9234', accent: '#8e3020' },
  },
];

export const orbitalObjectCatalog: readonly OrbitalObjectCatalogItem[] = [
  {
    id: 'atomic-orb',
    title: 'Atomic Orb',
    selectLabel: 'atomic-orb — атомные системы',
    eyebrow: 'Orbital family 01',
    description: 'Светящиеся атомные системы с энергетическими орбитами, ядром и настраиваемыми электронами.',
    defaultPreset: 'atomic-orb',
    presets: atomicPresets,
  },
  {
    id: 'ring-planet',
    title: 'Ring Planet',
    selectLabel: 'ring-planet — кольцевые планеты',
    eyebrow: 'Orbital family 02',
    description: 'Кольцевые планеты с отдельным планетарным ядром, слоями колец и декоративной звёздной пылью.',
    defaultPreset: 'ring-planet',
    presets: planetPresets,
  },
  {
    id: 'gyro-core',
    title: 'Gyro Core',
    selectLabel: 'gyro-core — механические ядра',
    eyebrow: 'Orbital family 03',
    description: 'Механические ядра с сегментированными кольцами, световыми дорожками и независимой пространственной хореографией.',
    defaultPreset: 'gyro-core',
    presets: gyroPresets,
  },
  {
    id: 'portal-gate',
    title: 'Portal Gate',
    selectLabel: 'portal-gate — энергетические порталы',
    eyebrow: 'Orbital family 04',
    description: 'Энергетические порталы с объёмной сегментированной рамой, независимыми кольцами и процедурной мембраной.',
    defaultPreset: 'portal-gate',
    presets: portalPresets,
  },
];

export const orbitalObjectOptions: readonly CustomSelectOption<OrbitalObjectId>[] =
  orbitalObjectCatalog.map((object) => ({
    value: object.id,
    label: object.selectLabel,
  }));

export function getOrbitalObjectById(objectId: OrbitalObjectId) {
  return (
    orbitalObjectCatalog.find((object) => object.id === objectId) ??
    orbitalObjectCatalog[0]
  );
}

export function getOrbitalObjectIdForPreset(
  preset: OrbitalPresetName,
): OrbitalObjectId {
  return (
    orbitalObjectCatalog.find((object) =>
      object.presets.some((item) => item.preset === preset),
    )?.id ?? 'atomic-orb'
  );
}

export function getOrbitalPresetOptions(
  objectId: OrbitalObjectId,
): readonly CustomSelectOption<OrbitalPresetName>[] {
  return getOrbitalObjectById(objectId).presets.map((item) => ({
    value: item.preset,
    label: item.selectLabel,
  }));
}
