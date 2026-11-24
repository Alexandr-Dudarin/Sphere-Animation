import type { BinaryPlanetPreset } from './BinaryPlanetVisual.types';

export interface PlanetAppearance {
  color: string;
  accent: string;
  atmosphere: string;
  radius: number;
  bands: number;
  seed: number;
}

export interface BinaryPresetConfig {
  id: BinaryPlanetPreset;
  title: string;
  description: string;
  /** Secondary mass divided by primary mass. */
  massRatio: number;
  eccentricity: number;
  ringColor: string;
  planets: readonly [PlanetAppearance, PlanetAppearance];
}

export const binaryPlanetPresets: readonly BinaryPresetConfig[] = [
  { id: 'ice-twins', title: 'Ледяные близнецы',
    description: 'Два близких ледяных мира внутри общего голубого кольца. Каждый вращается вокруг своей оси, а вместе они движутся вокруг центра.',
    massRatio: 0.92, eccentricity: 0.08, ringColor: '#408aff',
    planets: [
      { color: '#147db5', accent: '#b5e9f2', atmosphere: '#46cfff', radius: 0.51, bands: 0, seed: 1.4 },
      { color: '#6550aa', accent: '#d0ccf9', atmosphere: '#b2a0ff', radius: 0.49, bands: 0.15, seed: 7.3 },
    ] },
  { id: 'ice-fire', title: 'Лёд и пламя',
    description: 'Синяя и янтарная планеты в одном светящемся поясе. Компактная пара плавно обходит общий центр.',
    massRatio: 0.62, eccentricity: 0.19, ringColor: '#568fe8',
    planets: [
      { color: '#096f9e', accent: '#9ddfe1', atmosphere: '#42cfff', radius: 0.54, bands: 0.08, seed: 2.1 },
      { color: '#a54c1b', accent: '#ffd295', atmosphere: '#ff9c51', radius: 0.41, bands: 0.45, seed: 5.8 },
    ] },
  { id: 'violet-duet', title: 'Фиолетовый дуэт',
    description: 'Фиолетовая и жемчужная планеты внутри общего сиреневого кольца. Разные размеры, мягкое свечение и неспешное вращение.',
    massRatio: 0.48, eccentricity: 0.13, ringColor: '#9472ec',
    planets: [
      { color: '#493580', accent: '#bf91cf', atmosphere: '#ae7fff', radius: 0.58, bands: 0.95, seed: 3.2 },
      { color: '#687d9e', accent: '#e3e8f1', atmosphere: '#a5d8ff', radius: 0.37, bands: 0.25, seed: 9.1 },
    ] },
];

export function getBinaryPreset(id: BinaryPlanetPreset) {
  return binaryPlanetPresets.find((preset) => preset.id === id) ?? binaryPlanetPresets[0];
}
