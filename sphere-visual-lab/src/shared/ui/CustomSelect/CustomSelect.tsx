import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { CUSTOM_SELECT_KEYS } from './CustomSelect.constants';
import styles from './CustomSelect.module.css';

export interface CustomSelectOption<Value extends string = string> {
  value: Value;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps<Value extends string> {
  id: string;
  value: Value;
  options: readonly CustomSelectOption<Value>[];
  onChange: (value: Value) => void;
  disabled?: boolean;
  className?: string;
}

export default function CustomSelect<Value extends string>({
  id,
  value,
  options,
  onChange,
  disabled = false,
  className,
}: CustomSelectProps<Value>) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedIndex = useMemo(
    () => Math.max(0, options.findIndex((option) => option.value === value)),
    [options, value],
  );

  const selectedOption = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setActiveIndex(selectedIndex);
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    optionRefs.current[activeIndex]?.scrollIntoView({
      block: 'nearest',
    });
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  const findNextEnabledIndex = (startIndex: number, direction: 1 | -1) => {
    if (options.length === 0) {
      return 0;
    }

    let index = startIndex;

    for (let step = 0; step < options.length; step += 1) {
      index = (index + direction + options.length) % options.length;

      if (!options[index]?.disabled) {
        return index;
      }
    }

    return startIndex;
  };

  const selectOption = (index: number) => {
    const option = options[index];

    if (!option || option.disabled) {
      return;
    }

    onChange(option.value);
    setActiveIndex(index);
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || options.length === 0) {
      return;
    }

    switch (event.key) {
      case CUSTOM_SELECT_KEYS.arrowDown: {
        event.preventDefault();

        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(selectedIndex);
          return;
        }

        setActiveIndex((current) => findNextEnabledIndex(current, 1));
        break;
      }

      case CUSTOM_SELECT_KEYS.arrowUp: {
        event.preventDefault();

        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(selectedIndex);
          return;
        }

        setActiveIndex((current) => findNextEnabledIndex(current, -1));
        break;
      }

      case CUSTOM_SELECT_KEYS.home: {
        if (!isOpen) {
          return;
        }

        event.preventDefault();
        const firstEnabledIndex = options.findIndex((option) => !option.disabled);
        setActiveIndex(Math.max(0, firstEnabledIndex));
        break;
      }

      case CUSTOM_SELECT_KEYS.end: {
        if (!isOpen) {
          return;
        }

        event.preventDefault();
        const lastEnabledIndex = [...options]
          .map((option, index) => ({ option, index }))
          .reverse()
          .find(({ option }) => !option.disabled)?.index;
        setActiveIndex(lastEnabledIndex ?? selectedIndex);
        break;
      }

      case CUSTOM_SELECT_KEYS.enter:
      case CUSTOM_SELECT_KEYS.space: {
        event.preventDefault();

        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(selectedIndex);
          return;
        }

        selectOption(activeIndex);
        break;
      }

      case CUSTOM_SELECT_KEYS.escape: {
        if (!isOpen) {
          return;
        }

        event.preventDefault();
        setIsOpen(false);
        break;
      }

      case CUSTOM_SELECT_KEYS.tab: {
        setIsOpen(false);
        break;
      }

      default:
        break;
    }
  };

  const rootClassName = [
    styles.root,
    isOpen ? styles.rootOpen : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const activeOptionId = isOpen
    ? `${listboxId}-option-${activeIndex}`
    : undefined;

  return (
    <div ref={rootRef} className={rootClassName}>
      <button
        id={id}
        type="button"
        className={`${styles.trigger}${isOpen ? ` ${styles.triggerOpen}` : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.value}>{selectedOption?.label ?? '—'}</span>
        <svg
          className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`}
          width="18"
          height="18"
          viewBox="0 0 18 18"
          aria-hidden="true"
        >
          <path d="M4.5 6.75 9 11.25l4.5-4.5" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={listboxId}
          className={styles.dropdown}
          role="listbox"
          aria-labelledby={id}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <button
                key={option.value}
                id={`${listboxId}-option-${index}`}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                className={[
                  styles.option,
                  isActive ? styles.optionActive : '',
                  isSelected ? styles.optionSelected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => selectOption(index)}
              >
                <span>{option.label}</span>
                <span className={styles.check} aria-hidden="true">
                  {isSelected ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
