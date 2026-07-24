import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useViewportRenderMode } from './useViewportRenderMode';

let intersectionCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '720px 0px';
  readonly thresholds = [0];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

describe('useViewportRenderMode', () => {
  beforeEach(() => {
    intersectionCallback = null;

    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: MockIntersectionObserver,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('pauses a scene outside the extended viewport and resumes it nearby', () => {
    const ref = { current: document.createElement('section') };
    const { result } = renderHook(() => useViewportRenderMode(ref));

    expect(result.current).toBe('always');

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(result.current).toBe('demand');

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(result.current).toBe('always');
  });

  it('keeps continuous rendering when IntersectionObserver is unavailable', () => {
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: undefined,
    });

    const ref = { current: document.createElement('section') };
    const { result } = renderHook(() => useViewportRenderMode(ref));

    expect(result.current).toBe('always');
  });
});
