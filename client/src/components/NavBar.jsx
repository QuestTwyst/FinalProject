import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';

function NavBar({ isDark, onThemeToggle, isMuted, onSoundToggle, onSaveProgress, onImportProgress }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const hasProgressActions = Boolean(onSaveProgress || onImportProgress);

  const handleFileButtonClick = () => {
    if (hasProgressActions) {
      setShowFileMenu((prev) => !prev);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleSaveClick = () => {
    setShowFileMenu(false);
    onSaveProgress?.();
  };

  const handleImportClick = () => {
    setShowFileMenu(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (onImportProgress) {
      onImportProgress(file);
    } else {
      console.log('File selected:', file.name);
    }
    e.target.value = '';
  };

  const handleReturn = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.reload();
    }
  };

  return (
    <nav className={`${styles.navBar} ${isDark ? styles.themeDark : ''}`}>
      <button
        className={styles.navBtn}
        type="button"
        aria-label="Toggle dark and light mode"
        title="Dark / light mode"
        onClick={onThemeToggle}
      >
        <svg className={`${styles.icon} ${styles.iconSun}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <line x1="12" y1="2" x2="12" y2="4"></line>
          <line x1="12" y1="20" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
          <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="4" y2="12"></line>
          <line x1="20" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
          <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>
        </svg>
        <svg className={`${styles.icon} ${styles.iconMoon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>

      <button
        className={`${styles.navBtn}${isMuted ? ` ${styles.isMuted}` : ''}`}
        type="button"
        aria-label="Toggle music and sound"
        title="Music / sound"
        onClick={onSoundToggle}
      >
        <svg className={`${styles.icon} ${styles.iconSoundOn}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        <svg className={`${styles.icon} ${styles.iconSoundOff}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      </button>

      <div className={styles.fileMenuWrapper}>
        <button
          className={styles.navBtn}
          type="button"
          aria-label={hasProgressActions ? 'Save or import progress' : 'Import or save file'}
          title={hasProgressActions ? 'Save or import progress' : 'Import / save file'}
          onClick={handleFileButtonClick}
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>

        {showFileMenu && hasProgressActions && (
          <>
            <div className={styles.fileMenuOverlay} onClick={() => setShowFileMenu(false)} />
            <div className={styles.fileMenu}>
              <button className={styles.fileMenuItem} type="button" onClick={handleSaveClick}>
                Save progress
              </button>
              <button className={styles.fileMenuItem} type="button" onClick={handleImportClick}>
                Import progress
              </button>
            </div>
          </>
        )}
      </div>
      <input type="file" accept="application/json" ref={fileInputRef} hidden onChange={handleFileChange} />

      <button
        className={styles.navBtn}
        type="button"
        aria-label="Return"
        title="Return"
        onClick={handleReturn}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      <button
        className={`${styles.navBtn} ${styles.navTextBtn}`}
        type="button"
        aria-label="Open story library"
        title="Story Library"
        onClick={() => navigate('/library')}
      >
        Library
      </button>

      <button
        className={styles.navBtn}
        type="button"
        aria-label="Log In"
        title="Log In"
        onClick={() => navigate('/login')}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
      </button>

      <button
        className={styles.navBtn}
        type="button"
        aria-label="Create Account"
        title="Create Account"
        onClick={() => navigate('/create-account')}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-3-3.87"></path>
          <polyline points="4 15 4 21 8 21"></polyline>
          <line x1="4" y1="12" x2="4" y2="12"></line>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </button>
    </nav>
  );
}

export default NavBar;