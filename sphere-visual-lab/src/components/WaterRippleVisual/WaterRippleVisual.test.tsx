import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import WaterRippleVisual from './WaterRippleVisual';
import { advanceRippleTime } from './rippleTiming';
import { getRippleDiameter, rippleDefaults } from './rippleConfig';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, frameloop, orthographic }: { children: ReactNode; frameloop: string; orthographic?: boolean }) =>
    <div data-testid="canvas" data-loop={frameloop} data-orthographic={String(orthographic)}>{children}</div>,
}));
vi.mock('./WaterRippleScene', () => ({
  default: (props: object) => <span data-testid="scene">{JSON.stringify(props)}</span>,
}));

describe('WaterRippleVisual', () => {
  it('uses a stable orthographic camera and supports the falling-drop variant', () => {
    render(<WaterRippleVisual variant="droplet" dropKey={2} />);
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-orthographic', 'true');
    expect(screen.getByRole('img')).toHaveAttribute('data-water-variant', 'droplet');
    expect(JSON.parse(screen.getByTestId('scene').textContent!)).toMatchObject({
      variant: 'droplet', dropKey: 2, speed: 0.7, lineWidth: 0.02,
    });
  });
  it('keeps container dimensions separate from the object size', () => {
    render(<WaterRippleVisual size={400} width="100%" height={260} />);
    expect(screen.getByRole('img')).toHaveStyle({ width: '100%', height: '260px' });
    expect(JSON.parse(screen.getByTestId('scene').textContent!).size).toBe(400);
  });

  it('stops continuous rendering when paused or when speed is zero', () => {
    const view = render(<WaterRippleVisual paused />);
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-loop', 'demand');
    view.rerender(<WaterRippleVisual speed={0} />);
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-loop', 'demand');
    view.rerender(<WaterRippleVisual paused frameloop="never" />);
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-loop', 'never');
    view.rerender(<WaterRippleVisual />);
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-loop', 'always');
  });

  it('bounds invalid values before passing them to the GPU', () => {
    render(<WaterRippleVisual speed={NaN} amplitude={Infinity} rippleInterval={0} tilt={90} />);
    expect(JSON.parse(screen.getByTestId('scene').textContent!)).toMatchObject({
      speed: rippleDefaults.speed, amplitude: rippleDefaults.amplitude, rippleInterval: 3, tilt: 75,
    });
  });

  it('respects the operating system reduced-motion preference', () => {
    const original = window.matchMedia;
    const query = original('(prefers-reduced-motion: reduce)');
    const mock = vi.spyOn(window, 'matchMedia').mockReturnValue({ ...query, matches: true });
    try {
      render(<WaterRippleVisual />);
      expect(screen.getByTestId('canvas')).toHaveAttribute('data-loop', 'demand');
      expect(JSON.parse(screen.getByTestId('scene').textContent!).paused).toBe(true);
    } finally { mock.mockRestore(); }
  });
});

describe('water camera framing', () => {
  it('fits the surface and falling drop on narrow screens at every allowed tilt', () => {
    for (const tilt of [10, 22, 75]) {
      for (const withDrop of [false, true]) {
        const diameter = getRippleDiameter(700, 300, 200, tilt, withDrop);
        expect(diameter).toBeLessThanOrEqual(300 * 0.94);
        const radians = tilt * Math.PI / 180;
        const top = Math.max(2.8 * Math.sin(radians) + 0.15 * Math.cos(radians),
          withDrop ? 1.73 * Math.cos(radians) : 0);
        expect(top * diameter / 5.6).toBeLessThanOrEqual(200 * 0.44 + 0.001);
      }
    }
  });
});

describe('water animation clock', () => {
  it('freezes at zero speed and advances continuously after speed changes', () => {
    expect(advanceRippleTime(2, 1 / 60, 0)).toBe(2);
    expect(advanceRippleTime(2, 1 / 60, 2)).toBeCloseTo(2 + 2 / 60);
  });
  it('does not jump across an entire drop after a suspended tab', () => {
    expect(advanceRippleTime(2, 45, 1)).toBeCloseTo(2.05);
    expect(advanceRippleTime(2, NaN, 1)).toBe(2);
  });
});
