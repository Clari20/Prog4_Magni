import { useState, useEffect } from 'react';

/**
 * Hook personalizado para retrasar la actualización de un valor (ideal para búsquedas).
 * Esto evita hacer cálculos pesados o peticiones mientras el usuario sigue escribiendo.
 * @param value - El valor a observar
 * @param delay - Tiempo en milisegundos a esperar
 * @returns El valor una vez transcurrido el tiempo sin cambios
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configuramos un temporizador que actualiza el valor después del tiempo indicado
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Si el valor cambia antes de que termine el tiempo, limpiamos el temporizador anterior
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
