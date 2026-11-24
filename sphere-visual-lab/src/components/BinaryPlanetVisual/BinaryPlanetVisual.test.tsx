import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import BinaryPlanetVisual from './BinaryPlanetVisual';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, frameloop }: { children: ReactNode; frameloop: string }) =>
    <div data-testid="canvas" data-loop={frameloop}>{children}</div>,
}));
vi.mock('./BinaryPlanetScene', () => ({ default: (props: object) => <span data-testid="scene">{JSON.stringify(props)}</span> }));

it('keeps canvas dimensions separate from the visual size and bounds invalid controls', () => {
  render(<BinaryPlanetVisual width="100%" height={340} size={400} speed={NaN} separation={0} tilt={90} />);
  expect(screen.getByRole('img')).toHaveStyle({ width: '100%', height: '340px' });
  expect(JSON.parse(screen.getByTestId('scene').textContent!)).toMatchObject({
    size: 400, speed: 0.65, separation: 1.35, tilt: 80, preset: 'ice-twins',
  });
});

it('stops orbit and spin together for pause, zero speed and reduced motion', () => {
  const view = render(<BinaryPlanetVisual paused />);
  expect(screen.getByTestId('canvas')).toHaveAttribute('data-loop', 'demand');
  view.rerender(<BinaryPlanetVisual speed={0} />);
  expect(JSON.parse(screen.getByTestId('scene').textContent!).paused).toBe(true);
  view.rerender(<BinaryPlanetVisual paused frameloop="never" />);
  expect(screen.getByTestId('canvas')).toHaveAttribute('data-loop', 'never');
  const matchMedia = window.matchMedia;
  const original = matchMedia('(prefers-reduced-motion: reduce)');
  window.matchMedia = vi.fn().mockReturnValue({ ...original, matches: true });
  try {
    view.unmount();
    render(<BinaryPlanetVisual />);
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-loop', 'demand');
    expect(JSON.parse(screen.getByTestId('scene').textContent!).paused).toBe(true);
  } finally { window.matchMedia = matchMedia; }
});

it('shows a compact pair inside the common ring by default and accepts the old visibility alias', () => {
  const view = render(<BinaryPlanetVisual />);
  const props = () => JSON.parse(screen.getByTestId('scene').textContent!);
  expect(props()).toMatchObject({ separation: 1.5, tilt: 68, showRing: true });
  view.rerender(<BinaryPlanetVisual showOrbits={false} />);
  expect(props().showRing).toBe(false);
  view.rerender(<BinaryPlanetVisual showRing showOrbits={false} />);
  expect(props().showRing).toBe(true);
});
