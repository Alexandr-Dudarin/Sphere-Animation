import {
  useLayoutEffect,
  useState,
  type RefObject,
} from 'react';

function readPixelValue(value: string) {
  const parsedValue = Number.parseFloat(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

/**
 * Measures the largest square that fits inside the real inner stage bounds.
 * This remains demo-only and does not change the public visual components.
 */
export function useStageAvailableSize(
  stageRef: RefObject<HTMLElement | null>,
  fallbackSize: number,
) {
  const [availableSize, setAvailableSize] = useState(fallbackSize);

  useLayoutEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    let frameId: number | null = null;
    let settleTimeoutId: number | null = null;

    const readStageSize = () => {
      const computedStyle = window.getComputedStyle(stage);
      const horizontalPadding =
        readPixelValue(computedStyle.paddingLeft) +
        readPixelValue(computedStyle.paddingRight);
      const verticalPadding =
        readPixelValue(computedStyle.paddingTop) +
        readPixelValue(computedStyle.paddingBottom);

      const innerWidth = Math.max(1, stage.clientWidth - horizontalPadding);
      const innerHeight = Math.max(1, stage.clientHeight - verticalPadding);
      const nextAvailableSize = Math.max(
        1,
        Math.floor(Math.min(innerWidth, innerHeight)),
      );

      setAvailableSize((currentSize) =>
        currentSize === nextAvailableSize ? currentSize : nextAvailableSize,
      );
    };

    const measure = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        readStageSize();
        frameId = null;
      });
    };

    const measureAfterLayoutSettles = () => {
      measure();

      if (settleTimeoutId !== null) {
        window.clearTimeout(settleTimeoutId);
      }

      // Device emulation and breakpoint changes can settle over more than one
      // layout pass. A delayed second read prevents stale stage dimensions.
      settleTimeoutId = window.setTimeout(() => {
        measure();
        settleTimeoutId = null;
      }, 120);
    };

    measureAfterLayoutSettles();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(measureAfterLayoutSettles)
        : null;

    resizeObserver?.observe(stage);
    window.addEventListener('resize', measureAfterLayoutSettles);
    window.addEventListener('orientationchange', measureAfterLayoutSettles);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measureAfterLayoutSettles);
      window.removeEventListener('orientationchange', measureAfterLayoutSettles);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      if (settleTimeoutId !== null) {
        window.clearTimeout(settleTimeoutId);
      }
    };
  }, [stageRef]);

  return availableSize;
}

/**
 * Keeps a requested visual size inside the measured stage bounds.
 */
export function useStageBoundVisualSize(
  requestedSize: number,
  stageRef: RefObject<HTMLElement | null>,
) {
  const availableSize = useStageAvailableSize(stageRef, requestedSize);

  return Math.min(requestedSize, availableSize);
}
