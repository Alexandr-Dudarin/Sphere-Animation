import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePointerTracking } from './usePointerTracking';

function PointerHarness({ enabled = true }: { enabled?: boolean }) {
  const { containerRef, pointerX, pointerY } =
    usePointerTracking<HTMLDivElement>(enabled);

  return (
    <div
      ref={containerRef}
      data-testid="pointer-stage"
      data-pointer-x={pointerX}
      data-pointer-y={pointerY}
    />
  );
}

describe('usePointerTracking', () => {
  let nextFrameId = 1;
  let frameCallbacks: Map<number, FrameRequestCallback>;

  beforeEach(() => {
    nextFrameId = 1;
    frameCallbacks = new Map();

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      const frameId = nextFrameId;
      nextFrameId += 1;
      frameCallbacks.set(frameId, callback);
      return frameId;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((frameId) => {
      frameCallbacks.delete(frameId);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const flushAnimation = () => {
    let frameCount = 0;

    while (frameCallbacks.size > 0 && frameCount < 160) {
      const nextFrame = frameCallbacks.entries().next().value as
        | [number, FrameRequestCallback]
        | undefined;

      if (!nextFrame) {
        break;
      }

      const [frameId, callback] = nextFrame;
      frameCallbacks.delete(frameId);

      act(() => {
        callback(frameCount * 16.67);
      });

      frameCount += 1;
    }

    expect(frameCount).toBeLessThan(160);
  };

  it('starts on pointer movement and stops after reaching the target', () => {
    render(<PointerHarness />);

    const stage = screen.getByTestId('pointer-stage');
    vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 100,
      bottom: 100,
      left: 0,
      width: 100,
      height: 100,
      toJSON: () => ({}),
    });

    expect(window.requestAnimationFrame).not.toHaveBeenCalled();

    fireEvent.pointerMove(stage, { clientX: 100, clientY: 0 });
    expect(frameCallbacks.size).toBe(1);

    flushAnimation();

    expect(stage).toHaveAttribute('data-pointer-x', '1');
    expect(stage).toHaveAttribute('data-pointer-y', '-1');
    expect(frameCallbacks.size).toBe(0);

    const requestCountAfterSettle = vi.mocked(window.requestAnimationFrame).mock
      .calls.length;

    fireEvent.pointerMove(stage, { clientX: 100, clientY: 0 });

    expect(vi.mocked(window.requestAnimationFrame).mock.calls.length).toBe(
      requestCountAfterSettle,
    );

    fireEvent.pointerLeave(stage);
    expect(frameCallbacks.size).toBe(1);

    flushAnimation();

    expect(stage).toHaveAttribute('data-pointer-x', '0');
    expect(stage).toHaveAttribute('data-pointer-y', '0');
    expect(frameCallbacks.size).toBe(0);
  });

  it('cancels an active frame when tracking is disabled', () => {
    const { rerender } = render(<PointerHarness />);
    const stage = screen.getByTestId('pointer-stage');

    vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 100,
      bottom: 100,
      left: 0,
      width: 100,
      height: 100,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(stage, { clientX: 100, clientY: 0 });
    expect(frameCallbacks.size).toBe(1);

    rerender(<PointerHarness enabled={false} />);

    expect(window.cancelAnimationFrame).toHaveBeenCalledOnce();
    expect(frameCallbacks.size).toBe(0);
    expect(stage).toHaveAttribute('data-pointer-x', '0');
    expect(stage).toHaveAttribute('data-pointer-y', '0');
  });
});
