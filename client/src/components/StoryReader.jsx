import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storyGraph } from '../data/storyData';
import NavBar from './NavBar';
import StoryPassage from './StoryPassage';
import ChoiceButton from './ChoiceButton';
import styles from './StoryReader.module.css';

function StoryReader() {
  const { storyId } = useParams();
  const story = storyGraph[storyId];
  const [currentPassageId, setCurrentPassageId] = useState(story?.startPassageId ?? null);
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setCurrentPassageId(story?.startPassageId ?? null);
  }, [storyId, story?.startPassageId]);

  const currentPassage = useMemo(() => {
    if (!story || currentPassageId == null) return null;
    return story.passages[currentPassageId];
  }, [story, currentPassageId]);

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

  const isRomance = story?.genre === 'Romance';
  const pageClass = `${styles.readerPage} ${isRomance ? styles.themeRomance : ''} ${isDark ? styles.themeDark : ''}`;

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

      <div className={styles.pageContent}>
        <NavBar
          isDark={isDark}
          onThemeToggle={handleThemeToggle}
          isMuted={isMuted}
          onSoundToggle={handleSoundToggle}
        />

        <section className={styles.storyPage}>
          <div className={styles.storyPageTop}>
            <h1 className={styles.storyPageTitle}>{story.title}</h1>
            <button className={styles.restartButton} type="button" onClick={handleRestart}>
              Restart story
            </button>
          </div>

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
