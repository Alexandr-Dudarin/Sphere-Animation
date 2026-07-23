import { describe, expect, it } from 'vitest';
import {
  getOrbitalObjectById,
  getOrbitalObjectIdForPreset,
  getOrbitalPresetOptions,
  orbitalObjectCatalog,
  orbitalObjectOptions,
  orbitalPresetNames,
  type OrbitalObjectId,
  type OrbitalPresetCatalogItem,
  type OrbitalPresetName,
  type OrbitalPreviewKind,
} from './orbitalCatalog';

const allPresets = orbitalObjectCatalog.reduce<OrbitalPresetCatalogItem[]>(
  (items, object) => {
    items.push(...object.presets);
    return items;
  },
  [],
);
const hexColorPattern = /^#[0-9a-f]{6}$/i;

describe('orbitalObjectCatalog', () => {
  it('contains unique object identifiers', () => {
    const ids = orbitalObjectCatalog.map((object) => object.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains unique preset identifiers across all families', () => {
    const presets = allPresets.map((item) => item.preset);

    expect(new Set(presets).size).toBe(presets.length);
  });

  it('keeps orbitalPresetNames synchronized with the catalog', () => {
    expect(orbitalPresetNames).toEqual(
      allPresets.map((item) => item.preset),
    );
  });

  it('keeps every default preset inside its own family', () => {
    for (const object of orbitalObjectCatalog) {
      expect(
        object.presets.some((item) => item.preset === object.defaultPreset),
      ).toBe(true);
    }
  });

  it('maps every preset back to its owning family', () => {
    for (const object of orbitalObjectCatalog) {
      for (const item of object.presets) {
        expect(getOrbitalObjectIdForPreset(item.preset)).toBe(object.id);
      }
    }
  });

  it('returns the requested family by id', () => {
    for (const object of orbitalObjectCatalog) {
      expect(getOrbitalObjectById(object.id)).toBe(object);
    }
  });

  it('falls back to Atomic Orb for an unknown family id', () => {
    expect(
      getOrbitalObjectById('unknown-family' as OrbitalObjectId),
    ).toBe(orbitalObjectCatalog[0]);
  });

  it('falls back to Atomic Orb for an unknown preset', () => {
    expect(
      getOrbitalObjectIdForPreset('unknown-preset' as OrbitalPresetName),
    ).toBe('atomic-orb');
  });

  it('builds family select options from the same catalog data', () => {
    expect(orbitalObjectOptions).toEqual(
      orbitalObjectCatalog.map((object) => ({
        value: object.id,
        label: object.selectLabel,
      })),
    );
  });

  it('builds preset options only for the requested family', () => {
    for (const object of orbitalObjectCatalog) {
      expect(getOrbitalPresetOptions(object.id)).toEqual(
        object.presets.map((item) => ({
          value: item.preset,
          label: item.selectLabel,
        })),
      );
    }
  });

  it('keeps preview kinds aligned with their families', () => {
    const expectedKinds: Record<OrbitalObjectId, OrbitalPreviewKind> = {
      'atomic-orb': 'atom',
      'ring-planet': 'planet',
      'gyro-core': 'gyro',
      'portal-gate': 'portal',
    };

    for (const object of orbitalObjectCatalog) {
      for (const item of object.presets) {
        expect(item.previewKind).toBe(expectedKinds[object.id]);
      }
    }
  });

  it('provides complete display data and valid preview colors', () => {
    for (const object of orbitalObjectCatalog) {
      expect(object.title.trim()).not.toBe('');
      expect(object.selectLabel.trim()).not.toBe('');
      expect(object.eyebrow.trim()).not.toBe('');
      expect(object.description.trim()).not.toBe('');
      expect(object.presets.length).toBeGreaterThan(0);

      for (const item of object.presets) {
        expect(item.title.trim()).not.toBe('');
        expect(item.selectLabel.trim()).not.toBe('');
        expect(item.text.trim()).not.toBe('');
        expect(item.palette.core).toMatch(hexColorPattern);
        expect(item.palette.glow).toMatch(hexColorPattern);
        expect(item.palette.accent).toMatch(hexColorPattern);
      }
    }
  });
});