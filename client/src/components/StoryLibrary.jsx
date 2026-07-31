import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { parseSaveFile } from '../utils/saveFile';
import { useBackgroundAudio } from '../utils/useBackgroundAudio';
import { usePersistedAudioSettings } from '../utils/usePersistedAudioSettings';
import NavBar from './NavBar';
import LoadingSpinner from './LoadingSpinner';
import StoryCard from './StoryCard';
import EditStoryModal from './EditStoryModal';
import { showToast } from '../utils/toast';
import styles from './StoryLibrary.module.css';

function StoryLibrary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const genreFromUrl = searchParams.get('genre');
  const [selectedGenre, setSelectedGenre] = useState(genreFromUrl || 'All');
  const [isDark, setIsDark] = useState(false);
  const { isMuted, setIsMuted, volume, setVolume } = usePersistedAudioSettings();
  const [importMessage, setImportMessage] = useState('');
  const [stories, setStories] = useState([]);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [editingStory, setEditingStory] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const audioRef = useRef(null);

  const [currentUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );
    } catch (error) {
      console.error("Unable to read current user:", error);
      return null;
    }
  });

  const isAdmin = currentUser?.role === "admin";

  useBackgroundAudio(audioRef, isMuted, volume);

  useEffect(() => {
    let isCancelled = false;

    const loadLibraryData = async () => {
      try {
        setIsLoading(true);
        setLoadError('');

        const [storiesResponse, genresResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/stories`),
          fetch(`${API_BASE_URL}/api/genres`),
        ]);

        if (!storiesResponse.ok) {
          throw new Error(
            `Unable to retrieve stories: ${storiesResponse.status}`
          );
        }

        if (!genresResponse.ok) {
          throw new Error(
            `Unable to retrieve genres: ${genresResponse.status}`
          );
        }

        const [storyRows, genreRows] = await Promise.all([
          storiesResponse.json(),
          genresResponse.json(),
        ]);

        const storiesWithGenres = await Promise.all(
          storyRows.map(async (story) => {
            try {
              const storyGenresResponse = await fetch(
                `${API_BASE_URL}/api/stories/${story.id}/genres`
              );

              if (!storyGenresResponse.ok) {
                throw new Error(
                  `Unable to retrieve genres for story ${story.id}`
                );
              }

              const storyGenresData = await storyGenresResponse.json();

              const storyGenres = Array.isArray(storyGenresData)
                ? storyGenresData
                : [];

              return {
                ...story,
                genres: storyGenres,
                genre:
                  storyGenres.map((genre) => genre.name).join(', ') ||
                  'Uncategorized',
              };
            } catch (error) {
              console.error(
                `Error loading genres for story ${story.id}:`,
                error
              );

              return {
                ...story,
                genres: [],
                genre: 'Uncategorized',
              };
            }
          })
        );

        if (!isCancelled) {
          setAvailableGenres(
            Array.isArray(genreRows) ? genreRows : []
          );
          setStories(storiesWithGenres);
        }
      } catch (error) {
        console.error('Error loading Story Library:', error);

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

    loadLibraryData();

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

  const genres = [
    'All',
    ...availableGenres.map((genre) => genre.name).sort(),
  ];

  const filteredStories =
    selectedGenre === 'All'
      ? stories
      : stories.filter(
        (story) =>
          Array.isArray(story.genres) &&
          story.genres.some(
            (genre) => genre.name === selectedGenre
          )
      );

  const handleOpenStory = (storyId) => {
    navigate(`/stories/${storyId}`, {
      state: { genreContext: selectedGenre !== 'All' ? selectedGenre : null },
    });
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const authToken = localStorage.getItem('authToken');

      const response = await fetch(`${API_BASE_URL}/stories/${storyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
      },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete story (${response.status})`);
      }
      setStories((prev) => prev.filter((story) => story.id !== storyId));
      showToast('Story deleted.', 'success');
    } catch (error) {
      console.error('Error deleting story:', error);
      showToast('Something went wrong deleting that story. Please try again.', 'error');
    }
  };

  const handleEditClick = (story) => {
    setEditingStory(story);
    setEditError('');
  };

  const handleSaveEdit = async ({ title, description, genreIds }) => {
    if (!editingStory) return;
    setEditError('');
    setIsSavingEdit(true);
    try {
      const authToken = localStorage.getItem('authToken');

      const patchResponse = await fetch(`${API_BASE_URL}/stories/${editingStory.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!patchResponse.ok) {
        throw new Error(`Failed to update story (${patchResponse.status})`);
      }

      // Diff the old genre list against the new selection -- remove
      // whatever was dropped, add whatever is newly checked. Genre is
      // a many-to-many relationship (story_genres), not a single field.
      const oldGenreIds = (editingStory.genres || []).map((g) => g.id);
      const newGenreIds = (genreIds || []).map(Number);

      const toRemove = oldGenreIds.filter((id) => !newGenreIds.includes(id));
      const toAdd = newGenreIds.filter((id) => !oldGenreIds.includes(id));

      for (const genreId of toRemove) {
        await fetch(`${API_BASE_URL}/api/stories/${editingStory.id}/genres/${genreId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }

      for (const genreId of toAdd) {
        await fetch(`${API_BASE_URL}/api/stories/${editingStory.id}/genres`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ genre_id: genreId }),
        });
      }

      const updatedGenres = availableGenres.filter((g) => newGenreIds.includes(g.id));

      setStories((prev) =>
        prev.map((story) =>
          story.id === editingStory.id
            ? {
              ...story,
              title,
              description,
              genres: updatedGenres,
              genre: updatedGenres.map((g) => g.name).join(', ') || 'Uncategorized',
            }
            : story
        )
      );

      setEditingStory(null);
    } catch (error) {
      console.error('Error updating story:', error);
      setEditError('Something went wrong saving your changes. Please try again.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingStory(null);
    setEditError('');
  };

  return (
    <>
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
                <LoadingSpinner label="Loading stories..." />
              ) : loadError ? (
                <p className={styles.noResults}>{loadError}</p>
              ) : filteredStories.length > 0 ? (
                filteredStories.map((story) => {
                  const isOwner =
                    story.creator_id !== null &&
                    Number(story.creator_id) === Number(currentUser?.id);

                  const canManageStory = isAdmin || isOwner;

                  return (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onOpen={handleOpenStory}
                      onDelete={
                        canManageStory
                          ? handleDeleteStory
                          : undefined
                      }
                      onEdit={canManageStory ? handleEditClick : undefined}
                    />
                  );
                })
              ) : (
                <p className={styles.noResults}>
                  No stories match the selected genre.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
      {editingStory && (
        <EditStoryModal
          story={editingStory}
          genres={availableGenres}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          isSaving={isSavingEdit}
          error={editError}
        />
      )}
    </>
  );
}

export default StoryLibrary;