import { useEffect, useState, type RefObject } from 'react';

export type DemoFrameloop = 'always' | 'demand';

const DEFAULT_ROOT_MARGIN = '720px 0px';

/**
 * Keeps an approaching WebGL scene animated and lets an offscreen scene
 * render only on demand. Browsers without IntersectionObserver stay in the
 * regular continuous mode.
 */
export function useViewportRenderMode(
  targetRef: RefObject<HTMLElement | null>,
  rootMargin = DEFAULT_ROOT_MARGIN,
): DemoFrameloop {
  const [frameloop, setFrameloop] =
    useState<DemoFrameloop>('always');

  useEffect(() => {
    const target = targetRef.current;

    if (!target || typeof IntersectionObserver === 'undefined') {
      setFrameloop('always');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isNearViewport = entries.some(
          (entry) => entry.isIntersecting,
        );

        setFrameloop(isNearViewport ? 'always' : 'demand');
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, targetRef]);

  return frameloop;
}
