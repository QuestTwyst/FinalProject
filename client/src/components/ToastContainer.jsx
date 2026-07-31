import { useEffect, useState } from 'react';
import { subscribeToToasts } from '../utils/toast';
import styles from './ToastContainer.module.css';

const AUTO_DISMISS_MS = 3200;

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, AUTO_DISMISS_MS);
    });
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastStack} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type] || ''}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
