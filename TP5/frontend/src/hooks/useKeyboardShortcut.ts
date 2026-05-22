import { useEffect } from 'react';

/**
 * Hook personalizado para ejecutar una función al presionar una combinación de teclas.
 * @param key - La tecla principal a escuchar (ej. 'b')
 * @param ctrlKey - Si debe estar presionada la tecla Ctrl
 * @param callback - Función a ejecutar cuando se detecta la combinación
 */
export function useKeyboardShortcut(key: string, ctrlKey: boolean, callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Verificar la combinación de teclas
      if (event.key.toLowerCase() === key.toLowerCase() && event.ctrlKey === ctrlKey) {
        event.preventDefault(); // Evitar acción por defecto (ej. abrir marcadores del navegador con Ctrl+B)
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Limpieza del listener al desmontar
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, ctrlKey, callback]);
}
