import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { parseSaveFile } from '../utils/saveFile';
import { useBackgroundAudio } from '../utils/useBackgroundAudio';
import NavBar from './NavBar';
import StoryCard from './StoryCard';
import styles from './StoryLibrary.module.css';
import { API_BASE_URL } from '../config/api';

function StoryLibrary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const genreFromUrl = searchParams.get('genre');
  const [selectedGenre, setSelectedGenre] = useState(genreFromUrl || 'All');
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [importMessage, setImportMessage] = useState('');
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const audioRef = useRef(null);

  useBackgroundAudio(audioRef, isMuted, volume);

  useBackgroundAudio(audioRef, isMuted, volume);

  useEffect(() => {
    let isCancelled = false;

    const loadStories = async () => {
      try {
        setIsLoading(true);
        setLoadError('');

        const storiesResponse = await fetch(`${API_BASE_URL}/stories`);

        if (!storiesResponse.ok) {
          throw new Error(
            `Unable to retrieve stories: ${storiesResponse.status}`
          );
        }

        const storyRows = await storiesResponse.json();

        const storiesWithGenres = await Promise.all(
          storyRows.map(async (story) => {
            try {
              const genreResponse = await fetch(
                `${API_BASE_URL}/api/stories/${story.id}/genres`
              );

              if (!genreResponse.ok) {
                return {
                  ...story,
                  genre: 'Uncategorized',
                };
              }

              const genres = await genreResponse.json();

              return {
                ...story,
                genre: genres[0]?.name || 'Uncategorized',
              };
            } catch {
              return {
                ...story,
                genre: 'Uncategorized',
              };
            }
          })
        );

        if (!isCancelled) {
          setStories(storiesWithGenres);
        }
      } catch (error) {
        console.error('Error loading stories:', error);

        if (!isCancelled) {
          setLoadError(
            'The Story Library could not connect to the QuestTwyst backend.'
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadStories();

    return () => {
      isCancelled = true;
    };
  }, []);

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

  const genres = ['All', ...Array.from(new Set(stories.map((story) => story.genre))).sort(),];
  const filteredStories =
    selectedGenre === 'All'
      ? stories
      : stories.filter((story) => story.genre === selectedGenre);

  const handleOpenStory = (storyId) => {
    navigate(`/stories/${storyId}`);
  };

  return (
    <div className={`${styles.libraryPage} ${isDark ? styles.themeDark : ''}`}>
      <audio ref={audioRef} src="/sounds/main.wav" loop />
      <div className={`${styles.stage} ${isDark ? styles.themeDark : ''}`}>
        <div className={`${styles.gradientLayer} ${styles.gradientLayerOne}`} aria-hidden="true" />
        <div className={`${styles.gradientLayer} ${styles.gradientLayerTwo}`} aria-hidden="true" />

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

        <div className={styles.contentArea}>
          <section className={styles.pageHeader}>
            <div>
              <p className={styles.breadcrumb}>Home / Story Library</p>
              <h1 className={styles.pageTitle}>Story Library</h1>
              <p className={styles.pageSubtitle}>
                Browse available adventures and choose the story you want to read.
              </p>
            </div>

            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate('/')}
            >
              Back to home
            </button>
          </section>

          <section className={styles.filterRow}>
            <label htmlFor="genre-filter" className={styles.filterLabel}>
              Filter by genre
            </label>
            <select
              id="genre-filter"
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
              className={styles.genreSelect}
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </section>

          <section className={styles.storyGrid}>
            {isLoading ? (
              <p className={styles.noResults}>Loading stories...</p>
            ) : loadError ? (
              <p className={styles.noResults}>{loadError}</p>
            ) : filteredStories.length > 0 ? (
              filteredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onOpen={handleOpenStory}
                />
              ))
            ) : (
              <p className={styles.noResults}>
                No stories match the selected genre.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default StoryLibrary;
