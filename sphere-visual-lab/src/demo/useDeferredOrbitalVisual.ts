import { useEffect, useState, type RefObject } from 'react';
import { preloadOrbitalVisual } from './LazyOrbitalVisual';

type IdleCapableWindow = {
  requestIdleCallback?: (
    callback: (deadline: IdleDeadline) => void,
    options?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const PRELOAD_ROOT_MARGIN = '180px 0px';
const IDLE_DELAY_MS = 900;
const IDLE_TIMEOUT_MS = 1200;

/**
 * Mounts the heavy Orbital canvas shortly before the Orbital header reaches
 * the viewport. If the visitor does not scroll, an idle fallback still warms
 * the chunk after the Sphere has had time to initialise.
 */
export function useDeferredOrbitalVisual(
  preloadTargetRef: RefObject<HTMLElement | null>,
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

    const activate = () => {
      if (isDisposed) {
        return;
      }

      void preloadOrbitalVisual();
      setShouldMount(true);
    };

    const target = preloadTargetRef.current;
    const observer =
      target && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                activate();
              }
            },
            {
              root: null,
              rootMargin: PRELOAD_ROOT_MARGIN,
              threshold: 0,
            },
          )
        : null;

    if (target) {
      observer?.observe(target);
    }

    idleDelayHandle = window.setTimeout(() => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(activate, {
          timeout: IDLE_TIMEOUT_MS,
        });
        return;
      }

      activate();
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
  }, [preloadTargetRef, shouldMount]);

  return shouldMount;
}
