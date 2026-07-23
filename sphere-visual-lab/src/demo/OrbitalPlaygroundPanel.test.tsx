import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import OrbitalPlaygroundPanel from './OrbitalPlaygroundPanel';

function createProps(): ComponentProps<typeof OrbitalPlaygroundPanel> {
  return {
    size: 440,
    onSizeChange: vi.fn(),
    preset: 'atomic-orb',
    onPresetChange: vi.fn(),
    quality: 'high',
    onQualityChange: vi.fn(),
    glowIntensity: 'high',
    onGlowIntensityChange: vi.fn(),
    speed: 1,
    onSpeedChange: vi.fn(),
    stageBackground: 'space',
    onStageBackgroundChange: vi.fn(),
    background: 'transparent',
    onBackgroundChange: vi.fn(),
  };
}

describe('OrbitalPlaygroundPanel', () => {
  it('shows the family resolved from the current preset', () => {
    render(<OrbitalPlaygroundPanel {...createProps()} />);

    expect(screen.getByText(/Выбрано семейство/)).toHaveTextContent(
      'Atomic Orb',
    );
    expect(screen.getByText(/Выбрано семейство/)).toHaveTextContent(
      'доступно пресетов: 5',
    );
  });

  it('switches to the default preset when another family is selected', async () => {
    const user = userEvent.setup();
    const props = createProps();

    render(<OrbitalPlaygroundPanel {...props} />);

    await user.click(screen.getByLabelText('Объект'));
    await user.click(
      screen.getByRole('option', {
        name: 'ring-planet — кольцевые планеты',
      }),
    );

    expect(props.onPresetChange).toHaveBeenCalledWith('ring-planet');
  });

  it('offers and selects presets only from the active family', async () => {
    const user = userEvent.setup();
    const props = {
      ...createProps(),
      preset: 'ring-planet' as const,
    };

    render(<OrbitalPlaygroundPanel {...props} />);

    await user.click(screen.getByLabelText('Пресет'));

    expect(
      screen.getByRole('option', {
        name: 'ring-planet-stardust — планета со звёздной пылью',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', {
        name: 'portal-gate — базовый энергетический портал',
      }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('option', {
        name: 'ring-planet-stardust — планета со звёздной пылью',
      }),
    );

    expect(props.onPresetChange).toHaveBeenCalledWith(
      'ring-planet-stardust',
    );
  });

  it('reports size slider changes as numbers', () => {
    const props = createProps();

    render(<OrbitalPlaygroundPanel {...props} />);
    fireEvent.change(screen.getByLabelText('Размер'), {
      target: { value: '500' },
    });

    expect(props.onSizeChange).toHaveBeenCalledWith(500);
  });

  it('reports speed slider changes as numbers', () => {
    const props = createProps();

    render(<OrbitalPlaygroundPanel {...props} />);
    fireEvent.change(screen.getByLabelText('Скорость'), {
      target: { value: '1.7' },
    });

    expect(props.onSpeedChange).toHaveBeenCalledWith(1.7);
  });

  it('changes quality through the custom select', async () => {
    const user = userEvent.setup();
    const props = createProps();

    render(<OrbitalPlaygroundPanel {...props} />);

    await user.click(screen.getByLabelText('Качество'));
    await user.click(screen.getByRole('option', { name: 'medium — среднее' }));

    expect(props.onQualityChange).toHaveBeenCalledWith('medium');
  });

  it('changes the demo stage background through the custom select', async () => {
    const user = userEvent.setup();
    const props = createProps();

    render(<OrbitalPlaygroundPanel {...props} />);

    await user.click(screen.getByLabelText('Фон сцены'));
    await user.click(
      screen.getByRole('option', {
        name: 'tech — технологическая сетка',
      }),
    );

    expect(props.onStageBackgroundChange).toHaveBeenCalledWith('tech');
  });

  it('changes the component background through the custom select', async () => {
    const user = userEvent.setup();
    const props = createProps();

    render(<OrbitalPlaygroundPanel {...props} />);

    await user.click(screen.getByLabelText('Фон компонента'));
    await user.click(screen.getByRole('option', { name: 'dark — тёмный' }));

    expect(props.onBackgroundChange).toHaveBeenCalledWith('dark');
  });
});
