import { useEffect, type DependencyList } from 'react';

/** Ejecuta `fn` tras `delay` ms sin cambios en `deps`. `fn` puede devolver una función de limpieza. */
export function useDebouncedEffect(fn: () => void | (() => void), deps: DependencyList, delay: number) {
  useEffect(() => {
    let cleanup: void | (() => void);
    const id = window.setTimeout(() => { cleanup = fn(); }, delay);
    return () => { window.clearTimeout(id); if (typeof cleanup === 'function') cleanup(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
