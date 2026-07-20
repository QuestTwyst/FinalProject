import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from './NavBar';
import StoryCard from './StoryCard';
import styles from './StoryLibrary.module.css';
import { storyList } from '../data/storyData';

function StoryLibrary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const genreFromUrl = searchParams.get('genre');
  const [selectedGenre, setSelectedGenre] = useState(genreFromUrl || 'All');
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleThemeToggle = () => {
    setIsDark((prev) => !prev);
  };

  const handleSoundToggle = () => {
    setIsMuted((prev) => !prev);
  };

  const genres = ['All', ...Array.from(new Set(storyList.map((story) => story.genre))).sort()];
  const filteredStories =
    selectedGenre === 'All'
      ? storyList
      : storyList.filter((story) => story.genre === selectedGenre);

  const handleOpenStory = (storyId) => {
    navigate(`/stories/${storyId}`);
  };

  return (
    <div className={`${styles.libraryPage} ${isDark ? styles.themeDark : ''}`}>
      <div className={`${styles.stage} ${isDark ? styles.themeDark : ''}`}>
        <div className={`${styles.gradientLayer} ${styles.gradientLayerOne}`} aria-hidden="true" />
        <div className={`${styles.gradientLayer} ${styles.gradientLayerTwo}`} aria-hidden="true" />

        <div className={styles.navBarWrapper}>
          <NavBar
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            isMuted={isMuted}
            onSoundToggle={handleSoundToggle}
          />
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
            {filteredStories.length > 0 ? (
              filteredStories.map((story) => (
                <StoryCard key={story.id} story={story} onOpen={handleOpenStory} />
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
