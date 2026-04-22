import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateValue = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateValue();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateValue);

      return () => {
        mediaQuery.removeEventListener('change', updateValue);
      };
    }

    mediaQuery.addListener(updateValue);

    return () => {
      mediaQuery.removeListener(updateValue);
    };
  }, []);

  return reducedMotion;
}