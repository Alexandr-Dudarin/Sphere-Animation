import { useEffect, useState, type RefObject } from 'react';
import { preloadOrbitalVisual } from './LazyOrbitalVisual';

type IdleCapableWindow = {
  requestIdleCallback?: (
    callback: (deadline: IdleDeadline) => void,
    options?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const MOUNT_ROOT_MARGIN = '1400px 0px';
const IDLE_DELAY_MS = 500;
const IDLE_TIMEOUT_MS = 1200;

/**
 * Starts loading Orbital shortly after the initial Sphere render. Once the
 * chunk is ready, the scene is mounted offscreen so WebGL resources can warm
 * up before the user reaches it. The demo controls its frameloop separately,
 * therefore this warm mount does not keep an offscreen animation running.
 */
export function useDeferredOrbitalVisual(
  mountTargetRef: RefObject<HTMLElement | null>,
) {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (shouldMount) {
      return;
    }

    let isDisposed = false;
    let idleHandle: number | null = null;
    let idleDelayHandle: number | null = null;
    const idleWindow = window as unknown as IdleCapableWindow;

    const mountVisual = () => {
      if (isDisposed) {
        return;
      }

      void preloadOrbitalVisual();
      setShouldMount(true);
    };

    const warmAndMountVisual = () => {
      void preloadOrbitalVisual().then(() => {
        if (!isDisposed) {
          setShouldMount(true);
        }
      });
    };

    const target = mountTargetRef.current;
    const canObserve =
      Boolean(target) && typeof IntersectionObserver !== 'undefined';

    const observer = canObserve
      ? new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              mountVisual();
            }
          },
          {
            root: null,
            rootMargin: MOUNT_ROOT_MARGIN,
            threshold: 0,
          },
        )
      : null;

    if (target) {
      observer?.observe(target);
    }

    idleDelayHandle = window.setTimeout(() => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(warmAndMountVisual, {
          timeout: IDLE_TIMEOUT_MS,
        });
        return;
      }

      warmAndMountVisual();
    }, IDLE_DELAY_MS);

    return () => {
      isDisposed = true;
      observer?.disconnect();

      if (idleDelayHandle !== null) {
        window.clearTimeout(idleDelayHandle);
      }

      if (idleHandle !== null) {
        idleWindow.cancelIdleCallback?.(idleHandle);
      }
    };
  }, [mountTargetRef, shouldMount]);

  return shouldMount;
}
