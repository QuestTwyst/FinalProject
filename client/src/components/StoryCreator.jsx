import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { useBackgroundAudio } from "../utils/useBackgroundAudio";
import NavBar from "./NavBar";
import styles from "./StoryCreator.module.css";

function StoryCreator() {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null",
  );

  const authToken = localStorage.getItem("authToken");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  useBackgroundAudio(audioRef, isMuted, volume);

  const handleThemeToggle = () => {
    setIsDark((previousValue) => !previousValue);
  };

  const handleSoundToggle = () => {
    setIsMuted((previousValue) => !previousValue);
  };

  // ---------- Genres ----------
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState("");

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/genres`);

        if (response.ok) {
          const genreData = await response.json();
          setGenres(genreData);
        }
      } catch (error) {
        console.error("Unable to load genres:", error);
      }
    };

    loadGenres();
  }, []);

  // ---------- Story-level state ----------
  const [storyId, setStoryId] = useState(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [storyError, setStoryError] = useState("");
  const [isSavingStory, setIsSavingStory] = useState(false);

  // ---------- Phase control ----------
  // "writing" -> add all passages first
  // "linking" -> connect choices between written passages
  const [phase, setPhase] = useState("writing");

  // ---------- Phase 1: writing passages ----------
  const [passageContent, setPassageContent] = useState("");
  const [isEnding, setIsEnding] = useState(false);
  const [passageError, setPassageError] = useState("");
  const [isSavingPassage, setIsSavingPassage] = useState(false);
  const [writtenPassages, setWrittenPassages] = useState([]);

  const handleCreateStory = async (event) => {
    event.preventDefault();
    setStoryError("");

    if (!storyTitle.trim()) {
      setStoryError("A story title is required.");
      return;
    }

    if (!storyDescription.trim()) {
      setStoryError("A short description is required.");
      return;
    }

    if (!selectedGenreId) {
      setStoryError("Please choose a genre.");
      return;
    }

    if (!authToken || !currentUser) {
      setStoryError("You must log in as an administrator first.");
      return;
    }

    if (currentUser.role !== "admin") {
      setStoryError("Administrator access is required.");
      return;
    }

    setIsSavingStory(true);

    try {
      const response = await fetch(`${API_BASE_URL}/stories`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: storyTitle.trim(),
          description: storyDescription.trim(),
          creator_id: currentUser.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.error || `Failed to create story (${response.status})`,
        );
      }

      const story = await response.json();

      const genreResponse = await fetch(
        `${API_BASE_URL}/api/stories/${story.id}/genres`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            genre_id: Number(selectedGenreId),
          }),
        },
      );

      if (!genreResponse.ok) {
        const data = await genreResponse.json().catch(() => ({}));

        throw new Error(
          data.error ||
            `Story created, but genre assignment failed (${genreResponse.status})`,
        );
      }

      setStoryId(story.id);
    } catch (error) {
      setStoryError(
        error.message || "Something went wrong creating the story.",
      );
    } finally {
      setIsSavingStory(false);
    }
  };

  const handleSavePassage = async (event) => {
    event.preventDefault();
    setPassageError("");

    if (!passageContent.trim()) {
      setPassageError("Passage content is required.");
      return;
    }

    if (!authToken) {
      setPassageError("Your login session is missing. Please log in again.");
      return;
    }

    setIsSavingPassage(true);

    try {
      const passageResponse = await fetch(
        `${API_BASE_URL}/stories/${storyId}/passages`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            content: passageContent.trim(),
            is_ending: isEnding,
          }),
        },
      );

      if (!passageResponse.ok) {
        const data = await passageResponse.json().catch(() => ({}));

        throw new Error(
          data.error ||
            `Failed to create passage (${passageResponse.status})`,
        );
      }

      const passage = await passageResponse.json();

      // If this is the first passage written for this story, set it as
      // the story's starting passage so the reader knows where to begin.
      if (writtenPassages.length === 0) {
        const startPassageResponse = await fetch(
          `${API_BASE_URL}/stories/${storyId}`,
          {
            method: "PATCH",
            headers: authHeaders,
            body: JSON.stringify({
              start_passage_id: passage.id,
            }),
          },
        );

        if (!startPassageResponse.ok) {
          console.error("Failed to set starting passage for this story.");
        }
      }

      setWrittenPassages((previousPassages) => [
        ...previousPassages,
        passage,
      ]);

      setPassageContent("");
      setIsEnding(false);
    } catch (error) {
      setPassageError(
        error.message || "Something went wrong saving the passage.",
      );
    } finally {
      setIsSavingPassage(false);
    }
  };

  const nonEndingPassages = writtenPassages.filter(
    (passage) => !passage.is_ending,
  );

  // ---------- Phase 2: connecting choices ----------
  const [choiceDrafts, setChoiceDrafts] = useState({});
  const [linkError, setLinkError] = useState("");
  const [savingPassageId, setSavingPassageId] = useState(null);

  const getDraft = (passageId) =>
    choiceDrafts[passageId] || {
      choiceAText: "",
      choiceANext: "",
      choiceBText: "",
      choiceBNext: "",
    };

  const updateDraft = (passageId, field, value) => {
    setChoiceDrafts((previousDrafts) => ({
      ...previousDrafts,
      [passageId]: {
        ...getDraft(passageId),
        [field]: value,
      },
    }));
  };

  const handleSaveChoices = async (passage) => {
    setLinkError("");

    const draft = getDraft(passage.id);

    if (!draft.choiceAText.trim() || !draft.choiceBText.trim()) {
      setLinkError(
        "Both choices need their own text before you can connect them.",
      );
      return;
    }

    if (!draft.choiceANext || !draft.choiceBNext) {
      setLinkError("Pick a destination passage for both choices.");
      return;
    }

    if (!authToken) {
      setLinkError("Your login session is missing. Please log in again.");
      return;
    }

    setSavingPassageId(passage.id);

    try {
      const choicePairs = [
        {
          text: draft.choiceAText.trim(),
          next: draft.choiceANext,
        },
        {
          text: draft.choiceBText.trim(),
          next: draft.choiceBNext,
        },
      ];

      for (const { text, next } of choicePairs) {
        const response = await fetch(
          `${API_BASE_URL}/passages/${passage.id}/choices`,
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
              choice_text: text,
              next_passage_id: Number(next),
            }),
          },
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));

          throw new Error(
            data.error || `Failed to save choice (${response.status})`,
          );
        }
      }

      setChoiceDrafts((previousDrafts) => ({
        ...previousDrafts,
        [passage.id]: {
          ...getDraft(passage.id),
          isSaved: true,
        },
      }));
    } catch (error) {
      setLinkError(
        error.message || "Something went wrong connecting that passage.",
      );
    } finally {
      setSavingPassageId(null);
    }
  };

  const allLinked =
    nonEndingPassages.length > 0 &&
    nonEndingPassages.every(
      (passage) => choiceDrafts[passage.id]?.isSaved,
    );

  return (
    <div
      className={`${styles.creatorPage} ${
        isDark ? styles.themeDark : ""
      }`}
    >
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
              Write your own branching story in two easy steps.
            </p>
          </div>

          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/")}
          >
            Back to home
          </button>
        </section>

        <section className={styles.instructionsCard}>
          <h2 className={styles.instructionsTitle}>
            How to create your own story
          </h2>

          <ol className={styles.instructionsList}>
            <li>
              <strong>Start your story.</strong> Give it a title, a short
              description, and pick a genre.
            </li>

            <li>
              <strong>Write all your scenes.</strong> Add as many passages
              as you want, in whatever order you think of them. Check the
              box for any that are endings.
            </li>

            <li>
              <strong>Connect the choices.</strong> Once everything is
              written, go through each non-ending passage and choose where
              its two choices lead.
            </li>

            <li>
              <strong>You&apos;re done!</strong> Head to the Library and
              find your story to read it.
            </li>
          </ol>
        </section>

        {!storyId ? (
          <form
            className={styles.card}
            onSubmit={handleCreateStory}
          >
            <h2 className={styles.cardTitle}>
              Step 1 &middot; Start your story
            </h2>

            <label
              className={styles.fieldLabel}
              htmlFor="story-title"
            >
              Title
            </label>

            <input
              id="story-title"
              className={styles.textInput}
              type="text"
              value={storyTitle}
              onChange={(event) => setStoryTitle(event.target.value)}
              placeholder="e.g. The Clockmaker's Secret"
            />

            <label
              className={styles.fieldLabel}
              htmlFor="story-description"
            >
              Short description
            </label>

            <textarea
              id="story-description"
              className={styles.textArea}
              value={storyDescription}
              onChange={(event) =>
                setStoryDescription(event.target.value)
              }
              placeholder="One or two sentences describing the story."
              rows={3}
            />

            <label
              className={styles.fieldLabel}
              htmlFor="story-genre"
            >
              Genre
            </label>

            <select
              id="story-genre"
              className={styles.textInput}
              value={selectedGenreId}
              onChange={(event) =>
                setSelectedGenreId(event.target.value)
              }
            >
              <option value="">Choose a genre...</option>

              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>

            {storyError && (
              <p className={styles.errorText}>{storyError}</p>
            )}

            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSavingStory}
            >
              {isSavingStory ? "Creating..." : "Create story"}
            </button>
          </form>
        ) : phase === "writing" ? (
          <>
            <form
              className={styles.card}
              onSubmit={handleSavePassage}
            >
              <h2 className={styles.cardTitle}>
                Step 2 &middot; Write your scenes (
                {writtenPassages.length} written so far)
              </h2>

              <label
                className={styles.fieldLabel}
                htmlFor="passage-content"
              >
                Passage content
              </label>

              <textarea
                id="passage-content"
                className={styles.textArea}
                value={passageContent}
                onChange={(event) =>
                  setPassageContent(event.target.value)
                }
                placeholder="What happens in this part of the story?"
                rows={5}
              />

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isEnding}
                  onChange={(event) =>
                    setIsEnding(event.target.checked)
                  }
                />
                This is an ending
              </label>

              {passageError && (
                <p className={styles.errorText}>{passageError}</p>
              )}

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSavingPassage}
              >
                {isSavingPassage
                  ? "Saving..."
                  : "Add this passage"}
              </button>
            </form>

            {writtenPassages.length > 0 && (
              <section className={styles.previewSection}>
                <h2 className={styles.previewHeading}>
                  Passages written so far
                </h2>

                {writtenPassages.map((passage, index) => (
                  <article
                    key={passage.id}
                    className={styles.previewCard}
                  >
                    <p className={styles.previewLabel}>
                      Passage #{index + 1}
                      {passage.is_ending && " · ENDING"}
                    </p>

                    <p className={styles.previewContent}>
                      {passage.content}
                    </p>
                  </article>
                ))}
              </section>
            )}

            {nonEndingPassages.length > 0 && (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setPhase("linking")}
              >
                I&apos;m done writing &mdash; connect the choices
              </button>
            )}
          </>
        ) : (
          <>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                Step 3 &middot; Connect the choices
              </h2>

              <p className={styles.helperText}>
                For each passage below, write its two choices and pick
                which passage each one leads to.
              </p>

              {linkError && (
                <p className={styles.errorText}>{linkError}</p>
              )}

              {nonEndingPassages.map((passage, index) => {
                const draft = getDraft(passage.id);

                return (
                  <div
                    key={passage.id}
                    className={styles.linkingRow}
                  >
                    <p className={styles.previewLabel}>
                      Passage #{index + 1}
                      {draft.isSaved && " · CONNECTED"}
                    </p>

                    <p className={styles.previewContent}>
                      {passage.content}
                    </p>

                    {!draft.isSaved && (
                      <>
                        <input
                          className={styles.textInput}
                          type="text"
                          value={draft.choiceAText}
                          onChange={(event) =>
                            updateDraft(
                              passage.id,
                              "choiceAText",
                              event.target.value,
                            )
                          }
                          placeholder="Choice A text, e.g. Open the door"
                        />

                        <select
                          className={styles.textInput}
                          value={draft.choiceANext}
                          onChange={(event) =>
                            updateDraft(
                              passage.id,
                              "choiceANext",
                              event.target.value,
                            )
                          }
                        >
                          <option value="">
                            Choice A leads to...
                          </option>

                          {writtenPassages
                            .filter(
                              (destinationPassage) =>
                                destinationPassage.id !== passage.id,
                            )
                            .map((destinationPassage) => (
                              <option
                                key={destinationPassage.id}
                                value={destinationPassage.id}
                              >
                                Passage #
                                {writtenPassages.indexOf(
                                  destinationPassage,
                                ) + 1}{" "}
                                (
                                {destinationPassage.content.slice(
                                  0,
                                  30,
                                )}
                                ...)
                              </option>
                            ))}
                        </select>

                        <input
                          className={styles.textInput}
                          type="text"
                          value={draft.choiceBText}
                          onChange={(event) =>
                            updateDraft(
                              passage.id,
                              "choiceBText",
                              event.target.value,
                            )
                          }
                          placeholder="Choice B text, e.g. Walk away"
                        />

                        <select
                          className={styles.textInput}
                          value={draft.choiceBNext}
                          onChange={(event) =>
                            updateDraft(
                              passage.id,
                              "choiceBNext",
                              event.target.value,
                            )
                          }
                        >
                          <option value="">
                            Choice B leads to...
                          </option>

                          {writtenPassages
                            .filter(
                              (destinationPassage) =>
                                destinationPassage.id !== passage.id,
                            )
                            .map((destinationPassage) => (
                              <option
                                key={destinationPassage.id}
                                value={destinationPassage.id}
                              >
                                Passage #
                                {writtenPassages.indexOf(
                                  destinationPassage,
                                ) + 1}{" "}
                                (
                                {destinationPassage.content.slice(
                                  0,
                                  30,
                                )}
                                ...)
                              </option>
                            ))}
                        </select>

                        <button
                          type="button"
                          className={styles.primaryButton}
                          onClick={() =>
                            handleSaveChoices(passage)
                          }
                          disabled={
                            savingPassageId === passage.id
                          }
                        >
                          {savingPassageId === passage.id
                            ? "Connecting..."
                            : "Connect this passage"}
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </section>

            {allLinked && (
              <p className={styles.instructionsCard}>
                🎉 Every passage is connected! Head to the Library to
                read your story.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StoryCreator;
