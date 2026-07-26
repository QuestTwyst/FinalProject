import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { useBackgroundAudio } from '../utils/useBackgroundAudio';
import NavBar from './NavBar';
import styles from './StoryCreator.module.css';

function StoryCreator() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  useBackgroundAudio(audioRef, isMuted, volume);

  const handleThemeToggle = () => setIsDark((prev) => !prev);
  const handleSoundToggle = () => setIsMuted((prev) => !prev);

  // ---------- Genres (fetched once on load) ----------
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState('');

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/genres`);
        if (response.ok) {
          setGenres(await response.json());
        }
      } catch (error) {
        // If this fails, the genre dropdown will just be empty --
        // the rest of the Creator still works without it.
      }
    };
    loadGenres();
  }, []);

  // ---------- Story-level state ----------
  const [storyId, setStoryId] = useState(null);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const [storyError, setStoryError] = useState('');
  const [isSavingStory, setIsSavingStory] = useState(false);

  // ---------- Passage-level state ----------
  const [passageContent, setPassageContent] = useState('');
  const [isEnding, setIsEnding] = useState(false);
  const [choiceAText, setChoiceAText] = useState('');
  const [choiceANext, setChoiceANext] = useState('');
  const [choiceBText, setChoiceBText] = useState('');
  const [choiceBNext, setChoiceBNext] = useState('');
  const [passageError, setPassageError] = useState('');
  const [isSavingPassage, setIsSavingPassage] = useState(false);

  // ---------- Saved passages (for the running list + previews) ----------
  const [savedPassages, setSavedPassages] = useState([]);

  const handleCreateStory = async (event) => {
    event.preventDefault();
    setStoryError('');

    if (!storyTitle.trim()) {
      setStoryError('A story title is required.');
      return;
    }
    if (!storyDescription.trim()) {
      setStoryError('A short description is required.');
      return;
    }
    if (!selectedGenreId) {
      setStoryError('Please choose a genre.');
      return;
    }

    setIsSavingStory(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: storyTitle.trim(),
          description: storyDescription.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Failed to create story (${response.status})`);
      }

      const story = await response.json();

      // Link the chosen genre to the new story.
      await fetch(`${API_BASE_URL}/api/stories/${story.id}/genres`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre_id: Number(selectedGenreId) }),
      });

      setStoryId(story.id);
    } catch (error) {
      setStoryError(error.message || 'Something went wrong creating the story.');
    } finally {
      setIsSavingStory(false);
    }
  };

  const resetPassageForm = () => {
    setPassageContent('');
    setIsEnding(false);
    setChoiceAText('');
    setChoiceANext('');
    setChoiceBText('');
    setChoiceBNext('');
  };

  const handleSavePassage = async (event) => {
    event.preventDefault();
    setPassageError('');

    if (!passageContent.trim()) {
      setPassageError('Passage content is required.');
      return;
    }
    if (!isEnding && (!choiceAText.trim() || !choiceBText.trim())) {
      setPassageError('Both choices are required, unless this passage is marked as an ending.');
      return;
    }

    setIsSavingPassage(true);
    try {
      // 1. Create the passage itself.
      const passageResponse = await fetch(`${API_BASE_URL}/stories/${storyId}/passages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: passageContent.trim(),
          is_ending: isEnding,
        }),
      });

      if (!passageResponse.ok) {
        const data = await passageResponse.json().catch(() => ({}));
        throw new Error(data.error || `Failed to create passage (${passageResponse.status})`);
      }

      const passage = await passageResponse.json();

      // 2. If it's not an ending, create both choices under it, linking
      //    each one to whichever existing passage was picked (if any).
      if (!isEnding) {
        const choicePairs = [
          { text: choiceAText.trim(), next: choiceANext },
          { text: choiceBText.trim(), next: choiceBNext },
        ];
        for (const { text, next } of choicePairs) {
          const choiceResponse = await fetch(`${API_BASE_URL}/passages/${passage.id}/choices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              choice_text: text,
              next_passage_id: next ? Number(next) : null,
            }),
          });

          if (!choiceResponse.ok) {
            const data = await choiceResponse.json().catch(() => ({}));
            throw new Error(data.error || `Failed to create choice (${choiceResponse.status})`);
          }
        }
      }

      // 3. Re-fetch the passage WITH its choices joined, straight from
      //    the database, so the preview shows exactly what was saved
      //    (not just what's in local form state).
      const previewResponse = await fetch(`${API_BASE_URL}/stories/passages/${passage.id}`);
      const previewData = previewResponse.ok ? await previewResponse.json() : passage;

      setSavedPassages((prev) => [...prev, previewData]);
      resetPassageForm();
    } catch (error) {
      setPassageError(error.message || 'Something went wrong saving the passage.');
    } finally {
      setIsSavingPassage(false);
    }
  };

  return (
    <div className={`${styles.creatorPage} ${isDark ? styles.themeDark : ''}`}>
      <audio ref={audioRef} src="/sounds/main.wav" loop />
      <div className={styles.navBarWrapper}>
        <NavBar
          isDark={isDark}
          onThemeToggle={handleThemeToggle}
          isMuted={isMuted}
          onSoundToggle={handleSoundToggle}
          volume={volume}
          onVolumeChange={setVolume}
        />
      </div>

      <div className={styles.contentArea}>
        <section className={styles.pageHeader}>
          <div>
            <p className={styles.breadcrumb}>Home / Story Creator</p>
            <h1 className={styles.pageTitle}>Story Creator</h1>
            <p className={styles.pageSubtitle}>
              Write your own branching story, one passage at a time.
            </p>
          </div>
          <button type="button" className={styles.backButton} onClick={() => navigate('/')}>
            Back to home
          </button>
        </section>

        <section className={styles.instructionsCard}>
          <h2 className={styles.instructionsTitle}>How to create your own story</h2>
          <ol className={styles.instructionsList}>
            <li>
              <strong>Start your story.</strong> Give it a title, a short description, and pick a
              genre.
            </li>
            <li>
              <strong>Write your ending(s) first.</strong> This is the one tricky part: a choice
              can only link to a passage that already exists, so build backward &mdash; write the
              scene(s) where your story ends before you write anything earlier.
            </li>
            <li>
              <strong>Add earlier passages.</strong> For each one, write two choices and use the
              "Leads to" dropdown on each choice to link it to a passage you already saved.
            </li>
            <li>
              <strong>Keep going backward</strong> until you've written the very first passage
              &mdash; the one readers will actually start on.
            </li>
            <li>
              <strong>You're done!</strong> Head to the Library and find your story to read it.
            </li>
          </ol>
        </section>

        {!storyId ? (
          <form className={styles.card} onSubmit={handleCreateStory}>
            <h2 className={styles.cardTitle}>Step 1 &middot; Start your story</h2>

            <label className={styles.fieldLabel} htmlFor="story-title">
              Title
            </label>
            <input
              id="story-title"
              className={styles.textInput}
              type="text"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              placeholder="e.g. The Clockmaker's Secret"
            />

            <label className={styles.fieldLabel} htmlFor="story-description">
              Short description
            </label>
            <textarea
              id="story-description"
              className={styles.textArea}
              value={storyDescription}
              onChange={(e) => setStoryDescription(e.target.value)}
              placeholder="One or two sentences describing the story."
              rows={3}
            />

            <label className={styles.fieldLabel} htmlFor="story-genre">
              Genre
            </label>
            <select
              id="story-genre"
              className={styles.textInput}
              value={selectedGenreId}
              onChange={(e) => setSelectedGenreId(e.target.value)}
            >
              <option value="">Choose a genre...</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>

            {storyError && <p className={styles.errorText}>{storyError}</p>}

            <button type="submit" className={styles.primaryButton} disabled={isSavingStory}>
              {isSavingStory ? 'Creating...' : 'Create story'}
            </button>
          </form>
        ) : (
          <form className={styles.card} onSubmit={handleSavePassage}>
            <h2 className={styles.cardTitle}>
              Step 2 &middot; Add a passage ({savedPassages.length} saved so far)
            </h2>

            <label className={styles.fieldLabel} htmlFor="passage-content">
              Passage content
            </label>
            <textarea
              id="passage-content"
              className={styles.textArea}
              value={passageContent}
              onChange={(e) => setPassageContent(e.target.value)}
              placeholder="What happens in this part of the story?"
              rows={5}
            />

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isEnding}
                onChange={(e) => setIsEnding(e.target.checked)}
              />
              Mark this passage as an ending
            </label>

            {!isEnding && (
              <>
                <p className={styles.helperText}>
                  A choice can only lead to a passage that already exists. If
                  you're building a branching story, save your endings first,
                  then work backward toward the passage readers start on.
                </p>

                <label className={styles.fieldLabel} htmlFor="choice-a">
                  Choice A
                </label>
                <input
                  id="choice-a"
                  className={styles.textInput}
                  type="text"
                  value={choiceAText}
                  onChange={(e) => setChoiceAText(e.target.value)}
                  placeholder="e.g. Open the door"
                />
                <select
                  className={styles.textInput}
                  value={choiceANext}
                  onChange={(e) => setChoiceANext(e.target.value)}
                  aria-label="Choice A leads to"
                >
                  <option value="">Leads to: not linked yet</option>
                  {savedPassages.map((p, index) => (
                    <option key={p.id} value={p.id}>
                      Leads to: Passage #{index + 1} ({p.content.slice(0, 40)}...)
                    </option>
                  ))}
                </select>

                <label className={styles.fieldLabel} htmlFor="choice-b">
                  Choice B
                </label>
                <input
                  id="choice-b"
                  className={styles.textInput}
                  type="text"
                  value={choiceBText}
                  onChange={(e) => setChoiceBText(e.target.value)}
                  placeholder="e.g. Walk away"
                />
                <select
                  className={styles.textInput}
                  value={choiceBNext}
                  onChange={(e) => setChoiceBNext(e.target.value)}
                  aria-label="Choice B leads to"
                >
                  <option value="">Leads to: not linked yet</option>
                  {savedPassages.map((p, index) => (
                    <option key={p.id} value={p.id}>
                      Leads to: Passage #{index + 1} ({p.content.slice(0, 40)}...)
                    </option>
                  ))}
                </select>
              </>
            )}

            {passageError && <p className={styles.errorText}>{passageError}</p>}

            <button type="submit" className={styles.primaryButton} disabled={isSavingPassage}>
              {isSavingPassage ? 'Saving...' : 'Save passage'}
            </button>
          </form>
        )}

        {savedPassages.length > 0 && (
          <section className={styles.previewSection}>
            <h2 className={styles.previewHeading}>Saved passages (confirmed from the database)</h2>
            {savedPassages.map((passage, index) => (
              <article key={passage.id} className={styles.previewCard}>
                <p className={styles.previewLabel}>
                  Passage #{index + 1} &middot; database id {passage.id}
                  {passage.is_ending && ' · ENDING'}
                </p>
                <p className={styles.previewContent}>{passage.content}</p>
                {passage.choices && passage.choices.length > 0 && (
                  <ul className={styles.previewChoiceList}>
                    {passage.choices.map((choice) => (
                      <li key={choice.id}>
                        {choice.choice_text}
                        {choice.next_passage_id
                          ? ` (leads to passage ${choice.next_passage_id})`
                          : ' (not linked yet)'}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default StoryCreator;