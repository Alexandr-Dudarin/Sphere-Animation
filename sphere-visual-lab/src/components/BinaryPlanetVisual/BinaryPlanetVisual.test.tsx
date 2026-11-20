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
    size: 400, speed: 0.65, separation: 2.5, tilt: 70, preset: 'ice-twins',
  });
});

it('stops orbit and spin together for pause, zero speed and reduced motion', () => {
  const view = render(<BinaryPlanetVisual paused />);
  expect(screen.getByTestId('canvas')).toHaveAttribute('data-loop', 'demand');
  view.rerender(<BinaryPlanetVisual speed={0} />);
  expect(JSON.parse(screen.getByTestId('scene').textContent!).paused).toBe(true);
  view.rerender(<BinaryPlanetVisual paused frameloop="never" />);
  expect(screen.getByTestId('canvas')).toHaveAttribute('data-loop', 'never');
  const original = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mock = vi.spyOn(window, 'matchMedia').mockReturnValue({ ...original, matches: true });
  try {
    view.unmount();
    render(<BinaryPlanetVisual />);
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-loop', 'demand');
    expect(JSON.parse(screen.getByTestId('scene').textContent!).paused).toBe(true);
  } finally { mock.mockRestore(); }
});
