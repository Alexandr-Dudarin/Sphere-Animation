import { describe, expect, expectTypeOf, it } from 'vitest';
import * as publicApi from './index';
import {
  getOrbitalObjectById,
  getOrbitalObjectIdForPreset,
  getOrbitalPresetOptions,
  OrbitalVisual,
  orbitalObjectCatalog,
  orbitalObjectOptions,
  orbitalPresetNames,
  SphereVisual,
  spherePresetCatalog,
  spherePresetNames,
  spherePresetOptions,
} from './index';
import type {
  OrbitalObjectId,
  OrbitalPresetName,
  OrbitalVisualProps,
  SpherePresetName,
  SphereVisualProps,
} from './index';

describe('public library API', () => {
  it('exports both visual components from one entry point', () => {
    expect(SphereVisual).toBeTypeOf('function');
    expect(OrbitalVisual).toBeTypeOf('function');
  });

  it('exports the SphereVisual catalog through the public entry point', () => {
    expect(spherePresetNames).toEqual(
      spherePresetCatalog.map((item) => item.preset),
    );
    expect(spherePresetOptions).toEqual(
      spherePresetCatalog.map((item) => ({
        value: item.preset,
        label: item.selectLabel,
      })),
    );
  });

  it('exports the OrbitalVisual catalog and lookup helpers', () => {
    const catalogPresetNames: OrbitalPresetName[] = [];

    for (const object of orbitalObjectCatalog) {
      for (const item of object.presets) {
        catalogPresetNames.push(item.preset);
      }
    }

    expect(orbitalPresetNames).toEqual(catalogPresetNames);
    expect(orbitalObjectOptions).toHaveLength(orbitalObjectCatalog.length);

    for (const object of orbitalObjectCatalog) {
      expect(getOrbitalObjectById(object.id)).toBe(object);
      expect(getOrbitalObjectIdForPreset(object.defaultPreset)).toBe(object.id);
      expect(getOrbitalPresetOptions(object.id).map((option) => option.value)).toEqual(
        object.presets.map((item) => item.preset),
      );
    }
  });

  it('keeps internal renderers out of the public API', () => {
    expect(publicApi).not.toHaveProperty('ThreeSphereRenderer');
    expect(publicApi).not.toHaveProperty('ThreeOrbitalCanvas');
    expect(publicApi).not.toHaveProperty('OrbitalScene');
    expect(publicApi).not.toHaveProperty('PortalGate');
  });

  it('exports the consumer-facing prop and identifier types', () => {
    expectTypeOf<SphereVisualProps['preset']>().toEqualTypeOf<
      SpherePresetName | undefined
    >();
    expectTypeOf<OrbitalVisualProps['preset']>().toEqualTypeOf<
      OrbitalPresetName | undefined
    >();
    expectTypeOf<ReturnType<typeof getOrbitalObjectIdForPreset>>().toEqualTypeOf<
      OrbitalObjectId
    >();
  });
});
