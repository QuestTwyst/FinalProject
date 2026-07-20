import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StoryCard from './StoryCard';
import styles from './StoryLibrary.module.css';
import { storyList } from '../data/storyData';

function StoryLibrary() {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', ...Array.from(new Set(storyList.map((story) => story.genre))).sort()];
  const filteredStories =
    selectedGenre === 'All'
      ? storyList
      : storyList.filter((story) => story.genre === selectedGenre);

  const handleOpenStory = (storyId) => {
    navigate(`/stories/${storyId}`);
  };

  return (
    <main className={styles.libraryPage}>
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
    </main>
  );
}

export default StoryLibrary;
