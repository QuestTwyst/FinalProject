import { useEffect } from 'react';

/**
 * Once a submit button is clicked, it's disabled permanently via the
 * DOM directly -- not just while a request is in flight. This is
 * separate from (and stacks with) any existing disabled={isSaving}
 * logic already in a component; this hook guarantees the "stays
 * disabled after click" behavior even after that saving state clears.
 */
export function usePersistentDisableOnSubmit() {
  useEffect(() => {
    const handleClick = (event) => {
      const target = event.target.closest('button[type="submit"]');
      if (target && !target.disabled) {
        // Let the click's own handler fire first (form submit, etc.)
        // before locking the button.
        setTimeout(() => {
          target.disabled = true;
        }, 0);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);
}
