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

    const measure = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
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

        frameId = null;
      });
    };

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(stage);

      return () => {
        resizeObserver.disconnect();

        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
        }
      };
    }

    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
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
