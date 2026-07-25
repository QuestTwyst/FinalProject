import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { storyGraph } from '../data/storyData';
import { parseSaveFile } from '../utils/saveFile';
import { useBackgroundAudio } from '../utils/useBackgroundAudio';
import NavBar from './NavBar';
import StoryPassage from './StoryPassage';
import ChoiceButton from './ChoiceButton';
import styles from './StoryReader.module.css';

// Genre -> background sound file. Comedy is handled separately since it
// picks randomly between two tracks each time you visit.
const GENRE_SOUND_MAP = {
  Mystery: '/sounds/mystery.wav',
  'Sci-Fi': '/sounds/scifi.mp3',
  Romance: '/sounds/romantic.wav',
  Western: '/sounds/western.wav',
  Horror: '/sounds/horror.wav',
  Adventure: '/sounds/main.wav',
};

function StoryReader() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const story = storyGraph[storyId];
  const [currentPassageId, setCurrentPassageId] = useState(story?.startPassageId ?? null);
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [importMessage, setImportMessage] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    const resumePassageId = location.state?.resumePassageId;
    if (resumePassageId != null && story?.passages[resumePassageId]) {
      setCurrentPassageId(resumePassageId);
      // Clear the router state so a later plain navigation to this
      // story doesn't accidentally "resume" again from a stale value.
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      setCurrentPassageId(story?.startPassageId ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId, story?.startPassageId]);

  const currentPassage = useMemo(() => {
    if (!story || currentPassageId == null) return null;
    return story.passages[currentPassageId];
  }, [story, currentPassageId]);

  // Pick the background sound for this genre. Comedy alternates randomly
  // between its two tracks each time you land on a Comedy story.
  const soundSrc = useMemo(() => {
    if (!story) return null;
    if (story.genre === 'Comedy') {
      return Math.random() < 0.5 ? '/sounds/Comdey.wav' : '/sounds/Comdey2.wav';
    }
    return GENRE_SOUND_MAP[story.genre] ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id]);

  useBackgroundAudio(audioRef, isMuted, volume);

  const handleThemeToggle = () => setIsDark((prev) => !prev);
  const handleSoundToggle = () => setIsMuted((prev) => !prev);

  const handleChoiceSelect = (nextPassageId) => {
    setCurrentPassageId(nextPassageId);
  };

  const handleRestart = () => {
    if (story) {
      setCurrentPassageId(story.startPassageId);
    }
  };

  const handleSaveProgress = () => {
    if (!story) return;
    const saveData = {
      app: 'Questwyst',
      version: 1,
      storyId: story.id,
      title: story.title,
      passageId: currentPassageId,
      savedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    link.download = `questwyst-save-${safeTitle}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportProgress = (file) => {
    parseSaveFile(
      file,
      (data) => {
        setImportMessage('');
        if (String(data.storyId) === String(storyId)) {
          setCurrentPassageId(data.passageId);
        } else {
          navigate(`/stories/${data.storyId}`, { state: { resumePassageId: data.passageId } });
        }
      },
      () => setImportMessage("That file doesn't look like a valid Questwyst save.")
    );
  };

  const isRomance = story?.genre === 'Romance';
  const isMystery = story?.genre === 'Mystery';
  const isAdventure = story?.genre === 'Adventure';
  const isSciFi = story?.genre === 'Sci-Fi';
  const isWestern = story?.genre === 'Western';
  const isComedy = story?.genre === 'Comedy';
  const isHorror = story?.genre === 'Horror';
  const pageClass = `${styles.readerPage} ${isRomance ? styles.themeRomance : ''} ${isMystery ? styles.themeMystery : ''} ${isAdventure ? styles.themeAdventure : ''} ${isSciFi ? styles.themeSciFi : ''} ${isWestern ? styles.themeWestern : ''} ${isComedy ? styles.themeComedy : ''} ${isHorror ? styles.themeHorror : ''} ${isDark ? styles.themeDark : ''}`;

  if (!story) {
    return (
      <main className={pageClass}>
        <div className={`${styles.gradientLayer} ${styles.gradientLayerOne}`} aria-hidden="true" />
        <div className={`${styles.gradientLayer} ${styles.gradientLayerTwo}`} aria-hidden="true" />

        <div className={styles.pageContent}>
          <NavBar
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            isMuted={isMuted}
            onSoundToggle={handleSoundToggle}
            volume={volume}
            onVolumeChange={setVolume}
          />
          <section className={styles.storyPage}>
            <article className={styles.storyCard}>
              <div className={styles.storyCardScroll}>
                <p className={styles.passageText}>
                  The story you selected does not exist. Use the Library button above to choose another tale.
                </p>
              </div>
            </article>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={pageClass}>
      {soundSrc && <audio ref={audioRef} src={soundSrc} loop />}
      <div className={`${styles.gradientLayer} ${styles.gradientLayerOne}`} aria-hidden="true" />
      <div className={`${styles.gradientLayer} ${styles.gradientLayerTwo}`} aria-hidden="true" />
      <div className={`${styles.gradientLayer} ${styles.gradientLayerGround}`} aria-hidden="true" />

      {isRomance && (
        <>
          <div className={styles.rippleField} aria-hidden="true">
            <span className={`${styles.ripple} ${styles.ripple1}`}></span>
            <span className={`${styles.ripple} ${styles.ripple2}`}></span>
            <span className={`${styles.ripple} ${styles.ripple3}`}></span>
            <span className={`${styles.ripple} ${styles.ripple4}`}></span>
            <span className={`${styles.ripple} ${styles.ripple5}`}></span>
            <span className={`${styles.ripple} ${styles.ripple6}`}></span>
            <span className={`${styles.ripple} ${styles.ripple7}`}></span>
          </div>
          <div className={styles.heartsField} aria-hidden="true">
            <span className={`${styles.heart} ${styles.heart1}`}></span>
            <span className={`${styles.heart} ${styles.heart2}`}></span>
            <span className={`${styles.heart} ${styles.heart3}`}></span>
            <span className={`${styles.heart} ${styles.heart4}`}></span>
            <span className={`${styles.heart} ${styles.heart5}`}></span>
            <span className={`${styles.heart} ${styles.heart6}`}></span>
            <span className={`${styles.heart} ${styles.heart7}`}></span>
          </div>
        </>
      )}

      {isSciFi && (
        <div className={styles.dataField} aria-hidden="true">
          <img className={`${styles.dataImg} ${styles.data1}`} src="/scifi-data-1.png" alt="" />
          <img className={`${styles.dataImg} ${styles.data2}`} src="/scifi-data-2.png" alt="" />
          <img className={`${styles.dataImg} ${styles.data3}`} src="/scifi-data-3.png" alt="" />
          <img className={`${styles.dataImg} ${styles.data4}`} src="/scifi-data-4.png" alt="" />
        </div>
      )}

      {isWestern && (
        <>
          <svg
            className={styles.ghostTownSkyline}
            viewBox="0 0 1280 220"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Water tower */}
            <rect x="60" y="70" width="90" height="60" />
            <polygon points="55,70 155,70 105,20" />
            <rect x="70" y="130" width="8" height="90" />
            <rect x="132" y="130" width="8" height="90" />
            <line x1="78" y1="150" x2="132" y2="175" strokeWidth="4" stroke="currentColor" />
            <line x1="132" y1="150" x2="78" y2="175" strokeWidth="4" stroke="currentColor" />

            {/* Saloon with false front */}
            <rect x="230" y="90" width="260" height="130" />
            <rect x="230" y="60" width="260" height="35" />
            <rect x="340" y="150" width="40" height="70" fill="#1a0f08" />
            <line x1="230" y1="120" x2="490" y2="120" strokeWidth="3" stroke="#1a0f08" />
            <rect x="255" y="20" width="10" height="45" />
            <circle cx="260" cy="15" r="10" />

            {/* Small shack */}
            <rect x="540" y="140" width="120" height="80" />
            <polygon points="530,140 670,140 600,105" />
            <rect x="580" y="170" width="30" height="50" fill="#1a0f08" />

            {/* General store */}
            <rect x="720" y="110" width="200" height="110" />
            <rect x="720" y="85" width="200" height="28" />
            <rect x="790" y="150" width="35" height="70" fill="#1a0f08" />

            {/* Windmill */}
            <rect x="990" y="130" width="6" height="90" />
            <circle cx="993" cy="120" r="34" fill="none" strokeWidth="3" stroke="currentColor" />
            <line x1="993" y1="86" x2="993" y2="154" strokeWidth="3" stroke="currentColor" />
            <line x1="959" y1="120" x2="1027" y2="120" strokeWidth="3" stroke="currentColor" />

            {/* Far shack */}
            <rect x="1080" y="150" width="110" height="70" />
            <polygon points="1072,150 1198,150 1135,118" />
          </svg>

          <div className={styles.tumbleweedField} aria-hidden="true">
            <svg className={styles.tumbleweed} viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="24" fill="none" strokeWidth="3.5" stroke="currentColor" />
              <path d="M8,20 Q30,5 52,20" fill="none" strokeWidth="2.8" stroke="currentColor" />
              <path d="M8,40 Q30,55 52,40" fill="none" strokeWidth="2.8" stroke="currentColor" />
              <path d="M10,10 Q35,30 10,50" fill="none" strokeWidth="2.8" stroke="currentColor" />
              <path d="M50,10 Q25,30 50,50" fill="none" strokeWidth="2.8" stroke="currentColor" />
              <path d="M6,30 Q30,15 54,30 Q30,45 6,30 Z" fill="none" strokeWidth="2.2" stroke="currentColor" />
            </svg>
          </div>
        </>
      )}

      {isHorror && (
        <>
          <svg
            className={styles.moon}
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="42" />
          </svg>

          <svg
            className={styles.hauntedSkyline}
            viewBox="0 0 1280 240"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Bare twisted trees */}
            <path d="M40,240 L40,150 L20,120 M40,150 L60,110 M40,180 L15,170 M40,190 L65,175" fill="none" strokeWidth="5" stroke="currentColor" strokeLinecap="round" />
            <path d="M1220,240 L1220,140 L1245,105 M1220,140 L1195,100 M1220,170 L1250,160 M1220,185 L1190,165" fill="none" strokeWidth="5" stroke="currentColor" strokeLinecap="round" />

            {/* Crooked mansion */}
            <polygon points="380,240 380,110 480,60 580,110 580,240" />
            <polygon points="420,60 480,30 540,60" />
            <rect x="455" y="20" width="10" height="45" />
            <rect x="440" y="150" width="30" height="90" fill="#050403" />
            <circle cx="410" cy="140" r="10" fill="#e8c94a" opacity="0.6" />
            <circle cx="545" cy="140" r="10" fill="#e8c94a" opacity="0.35" />
            <circle cx="480" cy="95" r="12" fill="#e8c94a" opacity="0.5" />

            {/* Iron fence */}
            <rect x="620" y="200" width="8" height="40" />
            <rect x="660" y="195" width="8" height="45" />
            <rect x="700" y="200" width="8" height="40" />
            <rect x="740" y="195" width="8" height="45" />
            <line x1="620" y1="210" x2="748" y2="210" strokeWidth="4" stroke="currentColor" />
          </svg>

          <div className={styles.fogField} aria-hidden="true">
            <div className={`${styles.fogLayer} ${styles.fogOne}`}></div>
            <div className={`${styles.fogLayer} ${styles.fogTwo}`}></div>
          </div>

          <div className={styles.batField} aria-hidden="true">
            <svg className={`${styles.bat} ${styles.bat1}`} viewBox="0 0 60 30">
              <path d="M30,15 C22,2 8,2 2,12 C10,10 18,13 26,20 C18,15 8,18 4,24 C14,22 24,20 30,20 C36,20 46,22 56,24 C52,18 42,15 34,20 C42,13 50,10 58,12 C52,2 38,2 30,15 Z" />
            </svg>
            <svg className={`${styles.bat} ${styles.bat2}`} viewBox="0 0 60 30">
              <path d="M30,15 C22,2 8,2 2,12 C10,10 18,13 26,20 C18,15 8,18 4,24 C14,22 24,20 30,20 C36,20 46,22 56,24 C52,18 42,15 34,20 C42,13 50,10 58,12 C52,2 38,2 30,15 Z" />
            </svg>
            <svg className={`${styles.bat} ${styles.bat3}`} viewBox="0 0 60 30">
              <path d="M30,15 C22,2 8,2 2,12 C10,10 18,13 26,20 C18,15 8,18 4,24 C14,22 24,20 30,20 C36,20 46,22 56,24 C52,18 42,15 34,20 C42,13 50,10 58,12 C52,2 38,2 30,15 Z" />
            </svg>
          </div>
        </>
      )}

      <div className={styles.pageContent}>
        <NavBar
          isDark={isDark}
          onThemeToggle={handleThemeToggle}
          isMuted={isMuted}
          onSoundToggle={handleSoundToggle}
          volume={volume}
          onVolumeChange={setVolume}
          onSaveProgress={handleSaveProgress}
          onImportProgress={handleImportProgress}
        />

        <section className={styles.storyPage}>
          <div className={styles.storyPageTop}>
            <h1 className={styles.storyPageTitle}>{story.title}</h1>
            <button className={styles.restartButton} type="button" onClick={handleRestart}>
              Restart story
            </button>
          </div>

          {importMessage && <p className={styles.importMessage}>{importMessage}</p>}

          <article className={styles.storyCard}>
            <header className={styles.storyMeta}>
              <p className={styles.storyMetaDetails}>
                {story.genre && <span className={styles.storyMetaGenre}>{story.genre}</span>}
                {story.genre && <span className={styles.storyMetaSeparator} aria-hidden="true">·</span>}
                <span className={styles.storyMetaAuthor}>by {story.author || 'Questwyst Team'}</span>
              </p>
              {story.description && (
                <p className={styles.storyMetaDescription}>{story.description}</p>
              )}
            </header>

            {currentPassage ? (
              <>
                <StoryPassage passage={currentPassage} />

                {currentPassage.choices?.length > 0 ? (
                  <div className={styles.choiceRow}>
                    {currentPassage.choices.map((choice, index) => (
                      <ChoiceButton
                        key={choice.text}
                        choice={choice}
                        label={String.fromCharCode(65 + index)}
                        onSelect={handleChoiceSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.choiceRow}>
                    <button
                      className={`${styles.choiceButton} ${styles.choiceButtonEnd}`}
                      type="button"
                      onClick={handleRestart}
                    >
                      <span className={styles.choiceText}>Restart story</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.storyCardScroll}>
                <p className={styles.passageText}>Loading the first passage of this story...</p>
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}

export default StoryReader;