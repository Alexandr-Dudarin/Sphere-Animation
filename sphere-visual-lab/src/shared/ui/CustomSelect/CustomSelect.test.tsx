import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CustomSelect, { type CustomSelectOption } from './CustomSelect';

const options = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta', disabled: true },
  { value: 'gamma', label: 'Gamma' },
] as const satisfies readonly CustomSelectOption[];

function renderSelect({
  value = 'alpha',
  onChange = vi.fn(),
  disabled = false,
}: {
  value?: 'alpha' | 'beta' | 'gamma';
  onChange?: (value: 'alpha' | 'beta' | 'gamma') => void;
  disabled?: boolean;
} = {}) {
  render(
    <>
      <label htmlFor="test-select">Тестовый выбор</label>
      <CustomSelect
        id="test-select"
        value={value}
        options={options}
        onChange={onChange}
        disabled={disabled}
      />
    </>,
  );

  return screen.getByLabelText('Тестовый выбор');
}

describe('CustomSelect', () => {
  it('shows the selected option while closed', () => {
    const trigger = renderSelect({ value: 'gamma' });

    expect(trigger).toHaveTextContent('Gamma');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens the listbox and marks the current option as selected', async () => {
    const user = userEvent.setup();
    const trigger = renderSelect({ value: 'gamma' });

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Gamma' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('selects an enabled option by pointer and closes the listbox', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const trigger = renderSelect({ onChange });

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Gamma' }));

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('gamma');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not select a disabled option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const trigger = renderSelect({ onChange });

    await user.click(trigger);
    const disabledOption = screen.getByRole('option', { name: 'Beta' });

    expect(disabledOption).toBeDisabled();
    fireEvent.click(disabledOption);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('supports keyboard navigation and skips disabled options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const trigger = renderSelect({ onChange });

    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('gamma');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on Escape without changing the value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const trigger = renderSelect({ onChange });

    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes after a pointer event outside the component', async () => {
    const user = userEvent.setup();
    const trigger = renderSelect();

    await user.click(trigger);
    fireEvent.pointerDown(document.body);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('cannot be opened when disabled', async () => {
    const user = userEvent.setup();
    const trigger = renderSelect({ disabled: true });

    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
