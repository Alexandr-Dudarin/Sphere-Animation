import type { CustomSelectOption } from '../shared/ui/CustomSelect';

export type DemoStageBackground = 'studio' | 'space' | 'tech';

export const demoStageBackgroundNames: readonly DemoStageBackground[] = [
  'studio',
  'space',
  'tech',
];

export const demoStageBackgroundOptions: readonly CustomSelectOption<DemoStageBackground>[] = [
  { value: 'studio', label: 'studio — студийное свечение' },
  { value: 'space', label: 'space — глубокий космос' },
  { value: 'tech', label: 'tech — технологическая сетка' },
];
