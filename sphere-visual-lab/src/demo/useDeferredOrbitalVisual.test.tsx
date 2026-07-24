import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDeferredOrbitalVisual } from './useDeferredOrbitalVisual';

const { preloadOrbitalVisualMock } = vi.hoisted(() => ({
  preloadOrbitalVisualMock: vi.fn(() => Promise.resolve()),
}));

vi.mock('./LazyOrbitalVisual', () => ({
  preloadOrbitalVisual: preloadOrbitalVisualMock,
}));

let intersectionCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '180px 0px';
  readonly thresholds = [0];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

describe('useDeferredOrbitalVisual', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    preloadOrbitalVisualMock.mockClear();
    intersectionCallback = null;

    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: MockIntersectionObserver,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('activates and preloads when the Orbital header approaches the viewport', () => {
    const target = document.createElement('header');
    const ref = { current: target };
    const { result } = renderHook(() => useDeferredOrbitalVisual(ref));

    expect(result.current).toBe(false);

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(result.current).toBe(true);
    expect(preloadOrbitalVisualMock).toHaveBeenCalledOnce();
  });

  it('uses the idle fallback when the visitor does not scroll', () => {
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: undefined,
    });

    let idleCallback: (() => void) | null = null;
    const requestIdleCallback = vi.fn((callback: () => void) => {
      idleCallback = callback;
      return 7;
    });

    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: requestIdleCallback,
    });

    const ref = { current: document.createElement('header') };
    const { result } = renderHook(() => useDeferredOrbitalVisual(ref));

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(requestIdleCallback).toHaveBeenCalledOnce();
    expect(result.current).toBe(false);

    act(() => {
      idleCallback?.();
    });

    expect(result.current).toBe(true);
    expect(preloadOrbitalVisualMock).toHaveBeenCalledOnce();
  });
});
