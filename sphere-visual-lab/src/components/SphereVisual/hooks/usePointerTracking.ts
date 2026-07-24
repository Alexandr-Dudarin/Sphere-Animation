import { useEffect, useRef, useState } from 'react';
import { lerp } from '../utils/lerp';
import { normalizePointer } from '../utils/normalizePointer';

interface PointerState {
  x: number;
  y: number;
}

const POINTER_LERP_AMOUNT = 0.12;
const POINTER_SETTLE_EPSILON = 0.001;
const CENTER_POINTER: PointerState = { x: 0, y: 0 };

export function usePointerTracking<T extends HTMLElement>(enabled: boolean) {
  const containerRef = useRef<T | null>(null);
  const targetRef = useRef<PointerState>(CENTER_POINTER);
  const currentRef = useRef<PointerState>(CENTER_POINTER);
  const animationFrameRef = useRef<number | null>(null);
  const [pointer, setPointer] = useState<PointerState>(CENTER_POINTER);

  useEffect(() => {
    const node = containerRef.current;

    if (!node || !enabled) {
      targetRef.current = CENTER_POINTER;
      currentRef.current = CENTER_POINTER;
      setPointer((current) =>
        current.x === 0 && current.y === 0 ? current : CENTER_POINTER,
      );
      return;
    }

    let isDisposed = false;

    const animate = () => {
      animationFrameRef.current = null;

      if (isDisposed) {
        return;
      }

      const current = currentRef.current;
      const target = targetRef.current;
      const interpolatedX = lerp(
        current.x,
        target.x,
        POINTER_LERP_AMOUNT,
      );
      const interpolatedY = lerp(
        current.y,
        target.y,
        POINTER_LERP_AMOUNT,
      );
      const hasSettled =
        Math.abs(target.x - interpolatedX) <= POINTER_SETTLE_EPSILON &&
        Math.abs(target.y - interpolatedY) <= POINTER_SETTLE_EPSILON;
      const nextPointer = hasSettled
        ? { x: target.x, y: target.y }
        : { x: interpolatedX, y: interpolatedY };

      currentRef.current = nextPointer;
      setPointer(nextPointer);

      if (!hasSettled) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const startAnimation = () => {
      if (isDisposed || animationFrameRef.current !== null) {
        return;
      }

      const current = currentRef.current;
      const target = targetRef.current;
      const isAlreadySettled =
        Math.abs(target.x - current.x) <= POINTER_SETTLE_EPSILON &&
        Math.abs(target.y - current.y) <= POINTER_SETTLE_EPSILON;

      if (!isAlreadySettled) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const normalized = normalizePointer(event.clientX, event.clientY, rect);

      targetRef.current = {
        x: normalized.x,
        y: normalized.y,
      };
      startAnimation();
    };

    const handlePointerLeave = () => {
      targetRef.current = CENTER_POINTER;
      startAnimation();
    };

    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      isDisposed = true;
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerleave', handlePointerLeave);

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [enabled]);

  return {
    containerRef,
    pointerX: pointer.x,
    pointerY: pointer.y,
  };
}
