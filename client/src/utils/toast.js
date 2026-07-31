// A minimal pub-sub so any component can trigger a toast without
// needing prop-drilling or a heavier state management setup. The
// ToastContainer component (mounted once in App.jsx) is the only
// subscriber.

const listeners = new Set();

export function showToast(message, type = 'info') {
  const toast = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    message,
    type, // 'info' | 'success' | 'error'
  };
  listeners.forEach((listener) => listener(toast));
}

export function subscribeToToasts(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
