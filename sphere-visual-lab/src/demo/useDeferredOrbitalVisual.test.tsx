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
  readonly rootMargin = '1400px 0px';
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

  it('mounts immediately when the Orbital section approaches the viewport', () => {
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

  it('preloads and warm-mounts the scene during idle', async () => {
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
      vi.advanceTimersByTime(500);
    });

    expect(requestIdleCallback).toHaveBeenCalledOnce();
    expect(result.current).toBe(false);

    await act(async () => {
      idleCallback?.();
      await Promise.resolve();
    });

    expect(preloadOrbitalVisualMock).toHaveBeenCalledOnce();
    expect(result.current).toBe(true);
  });

  it('warm-mounts during idle when IntersectionObserver is unavailable', async () => {
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: undefined,
    });

    let idleCallback: (() => void) | null = null;
    const requestIdleCallback = vi.fn((callback: () => void) => {
      idleCallback = callback;
      return 9;
    });

    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: requestIdleCallback,
    });

    const ref = { current: document.createElement('header') };
    const { result } = renderHook(() => useDeferredOrbitalVisual(ref));

    await act(async () => {
      vi.advanceTimersByTime(500);
      idleCallback?.();
      await Promise.resolve();
    });

    expect(preloadOrbitalVisualMock).toHaveBeenCalledOnce();
    expect(result.current).toBe(true);
  });
});
