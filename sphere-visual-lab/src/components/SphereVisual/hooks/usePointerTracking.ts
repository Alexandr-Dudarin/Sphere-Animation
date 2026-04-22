import { useEffect, useRef, useState } from 'react';
import { lerp } from '../utils/lerp';
import { normalizePointer } from '../utils/normalizePointer';

interface PointerState {
  x: number;
  y: number;
}

export function usePointerTracking<T extends HTMLElement>(enabled: boolean) {
  const containerRef = useRef<T | null>(null);
  const targetRef = useRef<PointerState>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });

  useEffect(() => {
    const node = containerRef.current;

    if (!node || !enabled) {
      targetRef.current = { x: 0, y: 0 };
      setPointer({ x: 0, y: 0 });
      return;
    }

    const animate = () => {
      setPointer((prev) => {
        const nextX = lerp(prev.x, targetRef.current.x, 0.12);
        const nextY = lerp(prev.y, targetRef.current.y, 0.12);

        return {
          x: nextX,
          y: nextY,
        };
      });

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const normalized = normalizePointer(event.clientX, event.clientY, rect);

      targetRef.current = {
        x: normalized.x,
        y: normalized.y,
      };
    };

    const handlePointerLeave = () => {
      targetRef.current = { x: 0, y: 0 };
    };

    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerleave', handlePointerLeave);
    animationFrameRef.current = window.requestAnimationFrame(animate);

    return () => {
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerleave', handlePointerLeave);

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled]);

  return {
    containerRef,
    pointerX: pointer.x,
    pointerY: pointer.y,
  };
}