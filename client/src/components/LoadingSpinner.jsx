import styles from './LoadingSpinner.module.css';

/**
 * A colorful, continuously-spinning loading indicator. Use this
 * anywhere the app is waiting on something of unpredictable duration
 * (a fetch, a save, etc.) instead of a plain "Loading..." line of text.
 *
 * <LoadingSpinner label="Loading the first passage of this story..." />
 */
function LoadingSpinner({ label }) {
  return (
    <div className={styles.spinnerWrap} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true"></div>
      {label && <span className={styles.spinnerLabel}>{label}</span>}
    </div>
  );
}

export default LoadingSpinner;
