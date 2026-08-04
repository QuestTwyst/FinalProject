import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseSaveFile } from '../utils/saveFile';
import { useBackgroundAudio } from '../utils/useBackgroundAudio';
import { usePersistedAudioSettings } from '../utils/usePersistedAudioSettings';
import NavBar from './NavBar';
import styles from './StoryIntro.module.css';

function StoryIntro() {
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch (error) {
    currentUser = null;
  }
  const isLoggedIn = Boolean(currentUser);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const { isMuted, setIsMuted, volume, setVolume } = usePersistedAudioSettings();
  const [selectedStory, setSelectedStory] = useState(null);
  const [importMessage, setImportMessage] = useState('');
  const audioRef = useRef(null);

  useBackgroundAudio(audioRef, isMuted, volume);

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

  const stories = ['adventure', 'comedy', 'horror', 'mystery', 'romance', 'scifi', 'western'];
  const storyLabels = {
    adventure: 'Adventure',
    comedy: 'Comedy',
    horror: 'Horror',
    mystery: 'Mystery',
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
      <audio ref={audioRef} src="/sounds/main.wav" loop />
      <div className={`${styles.stage} ${isDark ? styles.themeDark : ''}`}>
        <div className={`${styles.gradientLayer} ${styles.gradientLayerOne}`}></div>
        <div className={`${styles.gradientLayer} ${styles.gradientLayerTwo}`}></div>

        <div className={styles.navBarWrapper}>
          <NavBar
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            isMuted={isMuted}
            onSoundToggle={handleSoundToggle}
            volume={volume}
            onVolumeChange={setVolume}
            onImportProgress={handleImportProgress}
          />
          {importMessage && <p className={styles.importMessage}>{importMessage}</p>}
        </div>

        <div className={styles.contentRow}>
          <div className={styles.cloudColumn}>
          <div className={styles.cloud}>
            <span className={`${styles.puff} ${styles.puffBody}`}></span>
            <span className={`${styles.puff} ${styles.puffLeft}`}></span>
            <span className={`${styles.puff} ${styles.puffMid}`}></span>
            <span className={`${styles.puff} ${styles.puffRight}`}></span>
            <img className={styles.cloudLogo} src="/qt-logo.png" alt="QT logo" />
          </div>
          <p className={styles.slogan}>Where every choice writes a new world.</p>
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
            {isLoggedIn && (
              <button
                type="button"
                className={`${styles.storyBtn} ${styles.createStoryBtn}`}
                onClick={() => navigate('/create')}
              >
                + Create your own story
              </button>
            )}
          </div>
        </div>
        <img
          className={styles.qrCode}
          src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://questtwyst-frontend.onrender.com/"
          alt="QR code linking to the live QuestTwyst site"
        />
      </div>
    </div>
  );
}

export default StoryIntro;