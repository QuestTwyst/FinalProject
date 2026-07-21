import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseSaveFile } from '../utils/saveFile';
import NavBar from './NavBar';
import styles from './StoryIntro.module.css';

function StoryIntro() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [importMessage, setImportMessage] = useState('');

  const handleThemeToggle = () => {
    setIsDark((prev) => !prev);
  };

  const handleSoundToggle = () => {
    setIsMuted((prev) => !prev);
  };

  const handleImportProgress = (file) => {
    parseSaveFile(
      file,
      (data) => {
        setImportMessage('');
        navigate(`/stories/${data.storyId}`, { state: { resumePassageId: data.passageId } });
      },
      () => setImportMessage("That file doesn't look like a valid Questwyst save.")
    );
  };

  const stories = ['comedy', 'horror', 'romance', 'scifi', 'western'];
  const storyLabels = {
    comedy: 'Comedy',
    horror: 'Horror',
    romance: 'Romance',
    scifi: 'Sci-Fi',
    western: 'Western',
  };

  const handleGenreSelect = (story) => {
    setSelectedStory(story);
    navigate(`/library?genre=${encodeURIComponent(storyLabels[story])}`);
  };

  return (
    <div className={`${styles.storyIntro} ${isDark ? styles.themeDark : ''}`}>
      <div className={`${styles.stage} ${isDark ? styles.themeDark : ''}`}>
        <div className={`${styles.gradientLayer} ${styles.gradientLayerOne}`}></div>
        <div className={`${styles.gradientLayer} ${styles.gradientLayerTwo}`}></div>

        <div className={styles.navBarWrapper}>
          <NavBar
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            isMuted={isMuted}
            onSoundToggle={handleSoundToggle}
            onImportProgress={handleImportProgress}
          />
          {importMessage && <p className={styles.importMessage}>{importMessage}</p>}
        </div>

        <div className={styles.contentRow}>
          <div className={styles.cloud}>
            <span className={`${styles.puff} ${styles.puffBody}`}></span>
            <span className={`${styles.puff} ${styles.puffLeft}`}></span>
            <span className={`${styles.puff} ${styles.puffMid}`}></span>
            <span className={`${styles.puff} ${styles.puffRight}`}></span>
            <img className={styles.cloudLogo} src="/qt-logo.png" alt="QT logo" />
          </div>

          <div className={styles.storyMenu}>
            <h2 className={styles.storyMenuTitle}>Choose a story to tell</h2>
            {stories.map((story) => (
              <button
                key={story}
                type="button"
                className={`${styles.storyBtn}${selectedStory === story ? ` ${styles.isActive}` : ''}`}
                onClick={() => handleGenreSelect(story)}
              >
                {storyLabels[story]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryIntro;