import { describe, expect, it } from 'vitest';
import {
  spherePresetCatalog,
  spherePresetNames,
  spherePresetOptions,
} from './sphereCatalog';

const hexColorPattern = /^#[0-9a-f]{6}$/i;
const allowedModes = ['idle', 'thinking', 'searching'];

describe('spherePresetCatalog', () => {
  it('contains unique preset identifiers', () => {
    const presets = spherePresetCatalog.map((item) => item.preset);

    expect(new Set(presets).size).toBe(presets.length);
  });

  it('keeps spherePresetNames synchronized with the catalog', () => {
    expect(spherePresetNames).toEqual(
      spherePresetCatalog.map((item) => item.preset),
    );
  });

  it('builds select options from the same catalog data', () => {
    expect(spherePresetOptions).toEqual(
      spherePresetCatalog.map((item) => ({
        value: item.preset,
        label: item.selectLabel,
      })),
    );
  });

  it('keeps every preset connected to a supported sphere mode', () => {
    for (const item of spherePresetCatalog) {
      expect(allowedModes).toContain(item.mode);
    }
  });

  it('provides complete card text for every preset', () => {
    for (const item of spherePresetCatalog) {
      expect(item.title.trim()).not.toBe('');
      expect(item.selectLabel.trim()).not.toBe('');
      expect(item.text.trim()).not.toBe('');
    }
  });

  it('provides valid preview colors for every preset', () => {
    for (const item of spherePresetCatalog) {
      expect(item.palette.core).toMatch(hexColorPattern);
      expect(item.palette.glow).toMatch(hexColorPattern);
      expect(item.palette.accent).toMatch(hexColorPattern);
    }
  });

  it('contains the baseline glass-petal preset', () => {
    expect(spherePresetNames).toContain('glass-petal');
  });
});
