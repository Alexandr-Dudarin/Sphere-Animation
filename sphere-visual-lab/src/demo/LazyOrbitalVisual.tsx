import { lazy, type ComponentType } from 'react';
import type { OrbitalVisualProps } from '../components/OrbitalVisual';

type OrbitalVisualModule = {
  default: ComponentType<OrbitalVisualProps>;
};

let orbitalVisualPromise: Promise<OrbitalVisualModule> | null = null;

/**
 * Uses one cached dynamic import for both preload and React.lazy.
 * The heavy Orbital renderers stay outside the initial demo chunk.
 */
export function preloadOrbitalVisual(): Promise<OrbitalVisualModule> {
  if (!orbitalVisualPromise) {
    orbitalVisualPromise = import('../components/OrbitalVisual').then(
      ({ OrbitalVisual }) => ({ default: OrbitalVisual }),
    );
  }

  return orbitalVisualPromise;
}

const LazyOrbitalVisual = lazy(preloadOrbitalVisual);

export default LazyOrbitalVisual;
