import { useEffect, useState } from 'react';
import styles from './CustomCursor.module.css';

/**
 * Renders a small colorful spinning wheel that follows the real mouse
 * position, used in place of the OS's own cursor while something is
 * processing. CSS `cursor: wait` can't do this -- browsers only let
 * CSS show a static cursor image, never an animated one -- so this
 * hides the real cursor and tracks the mouse with a real element
 * instead.
 */
function CustomCursor({ active }) {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    if (!active) return undefined;

    const handleMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener('mousemove', handleMove);
    return () => {
      document.removeEventListener('mousemove', handleMove);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className={styles.customCursor}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      aria-hidden="true"
    />
  );
}

export default CustomCursor;
