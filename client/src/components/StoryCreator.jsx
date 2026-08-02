import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { useBackgroundAudio } from "../utils/useBackgroundAudio";
import { usePersistedAudioSettings } from "../utils/usePersistedAudioSettings";
import NavBar from "./NavBar";
import styles from "./StoryCreator.module.css";

function StoryCreator() {
  const navigate = useNavigate();

  const { storyId: routeStoryId } = useParams();

  const isEditingExistingStory = Boolean(routeStoryId);

  const [isDark, setIsDark] = useState(false);
  const { isMuted, setIsMuted, volume, setVolume } = usePersistedAudioSettings();
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
  const [storyId, setStoryId] = useState(
    routeStoryId ? Number(routeStoryId) : null,
  );
  const [storyTitle, setStoryTitle] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [storyError, setStoryError] = useState("");
  const [isSavingStory, setIsSavingStory] = useState(false);
  const [isLoadingExistingStory, setIsLoadingExistingStory] =
    useState(isEditingExistingStory);

  const [existingStoryError, setExistingStoryError] =
    useState("");

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
  const [editingPassageId, setEditingPassageId] = useState(null);
  const [editedPassageContent, setEditedPassageContent] = useState("");
  const [passageActionError, setPassageActionError] = useState("");

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
      setStoryError("You must log in before creating a story.");
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

      const normalizedPassage = {
        ...passage,
        is_ending:
          passage.is_ending === true ||
          passage.is_ending === "true",
      };

      setWrittenPassages((previousPassages) => [
        ...previousPassages,
        normalizedPassage,
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
    (passage) =>
      passage.is_ending !== true &&
      passage.is_ending !== "true",
  );

  // ---------- Phase 2: connecting choices ----------
  const [choiceDrafts, setChoiceDrafts] = useState({});
  const [linkError, setLinkError] = useState("");
  const [savingPassageId, setSavingPassageId] = useState(null);

  useEffect(() => {
    if (!isEditingExistingStory || !routeStoryId) {
      return;
    }

    let isCancelled = false;

    const loadExistingStory = async () => {
      setIsLoadingExistingStory(true);
      setExistingStoryError("");

      try {
        const [storyResponse, passagesResponse, genresResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/stories/${routeStoryId}`),
            fetch(`${API_BASE_URL}/stories/${routeStoryId}/passages`),
            fetch(`${API_BASE_URL}/api/stories/${routeStoryId}/genres`),
          ]);

        if (!storyResponse.ok) {
          throw new Error(
            `Unable to load story (${storyResponse.status})`,
          );
        }

        if (!passagesResponse.ok) {
          throw new Error(
            `Unable to load passages (${passagesResponse.status})`,
          );
        }

        if (!genresResponse.ok) {
          throw new Error(
            `Unable to load story genres (${genresResponse.status})`,
          );
        }

        const story = await storyResponse.json();
        const passages = await passagesResponse.json();
        const storyGenres = await genresResponse.json();



        const normalizedPassages = Array.isArray(passages)
          ? passages
          : [];

        const choiceResults = await Promise.all(
          normalizedPassages
            .filter(
              (passage) =>
                passage.is_ending !== true &&
                passage.is_ending !== "true",
            )
            .map(async (passage) => {
              const response = await fetch(
                `${API_BASE_URL}/passages/${passage.id}/choices`,
              );

              if (!response.ok) {
                throw new Error(
                  `Unable to load choices for passage ${passage.id}`,
                );
              }

              const choices = await response.json();

              return {
                passageId: passage.id,
                choices: Array.isArray(choices) ? choices : [],
              };
            }),
        );

        const loadedChoiceDrafts = {};

        choiceResults.forEach(({ passageId, choices }) => {
          const choiceA = choices[0];
          const choiceB = choices[1];

          loadedChoiceDrafts[passageId] = {
            choiceAId: choiceA?.id || null,
            choiceAText: choiceA?.choice_text || "",
            choiceANext:
              choiceA?.next_passage_id !== null &&
                choiceA?.next_passage_id !== undefined
                ? String(choiceA.next_passage_id)
                : "",

            choiceBId: choiceB?.id || null,
            choiceBText: choiceB?.choice_text || "",
            choiceBNext:
              choiceB?.next_passage_id !== null &&
                choiceB?.next_passage_id !== undefined
                ? String(choiceB.next_passage_id)
                : "",

            isSaved: Boolean(choiceA && choiceB),
            isEditing: false,
          };
        });

        const isAdmin = currentUser?.role === "admin";

        const isOwner =
          story.creator_id !== null &&
          Number(story.creator_id) === Number(currentUser?.id);

        if (!isAdmin && !isOwner) {
          throw new Error(
            "You are not authorized to continue editing this story.",
          );
        }

        if (!isCancelled) {
          setStoryId(Number(story.id));
          setStoryTitle(story.title || "");
          setStoryDescription(story.description || "");

          setWrittenPassages(normalizedPassages);
          setChoiceDrafts(loadedChoiceDrafts);

          if (Array.isArray(storyGenres) && storyGenres.length > 0) {
            setSelectedGenreId(String(storyGenres[0].id));
          }
        }
      } catch (error) {
        console.error("Unable to load existing story:", error);

        if (!isCancelled) {
          setExistingStoryError(
            error.message ||
            "Something went wrong loading this story.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingExistingStory(false);
        }
      }
    };

    loadExistingStory();

    return () => {
      isCancelled = true;
    };
  }, [
    isEditingExistingStory,
    routeStoryId,
    currentUser?.id,
    currentUser?.role,
  ]);

  const getDraft = (passageId) =>
    choiceDrafts[passageId] || {
      choiceAId: null,
      choiceAText: "",
      choiceANext: "",
      choiceBId: null,
      choiceBText: "",
      choiceBNext: "",
      isSaved: false,
      isEditing: false,
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

  const handleEditConnections = (passageId) => {
    setChoiceDrafts((previousDrafts) => ({
      ...previousDrafts,
      [passageId]: {
        ...getDraft(passageId),
        isEditing: true,
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
          id: draft.choiceAId,
          text: draft.choiceAText.trim(),
          next: draft.choiceANext,
        },
        {
          id: draft.choiceBId,
          text: draft.choiceBText.trim(),
          next: draft.choiceBNext,
        },
      ];

      const savedChoices = [];

      for (const { id, text, next } of choicePairs) {
        const isExistingChoice = Boolean(id);

        const url = isExistingChoice
          ? `${API_BASE_URL}/passages/choices/${id}`
          : `${API_BASE_URL}/passages/${passage.id}/choices`;

        const response = await fetch(url, {
          method: isExistingChoice ? "PATCH" : "POST",
          headers: authHeaders,
          body: JSON.stringify({
            choice_text: text,
            next_passage_id: Number(next),
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));

          throw new Error(
            data.error ||
            `Failed to save choice (${response.status})`,
          );
        }

        const savedChoice = await response.json();
        savedChoices.push(savedChoice);
      }

      setChoiceDrafts((previousDrafts) => ({
        ...previousDrafts,
        [passage.id]: {
          ...draft,
          choiceAId:
            savedChoices[0]?.id || draft.choiceAId,
          choiceBId:
            savedChoices[1]?.id || draft.choiceBId,
          isSaved: true,
          isEditing: false,
        },
      }));
    } catch (error) {
      setLinkError(
        error.message ||
        "Something went wrong connecting that passage.",
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
      className={`${styles.creatorPage} ${isDark ? styles.themeDark : ""
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

        {isLoadingExistingStory ? (
          <section className={styles.card}>
            <p className={styles.helperText}>
              Loading existing story...
            </p>
          </section>
        ) : existingStoryError ? (
          <section className={styles.card}>
            <p className={styles.errorText}>
              {existingStoryError}
            </p>

            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate("/library")}
            >
              Back to Story Library
            </button>
          </section>
        ) : !storyId ? (
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

                {passageActionError && (
                  <p className={styles.errorText}>{passageActionError}</p>
                )}
                {writtenPassages.map((passage, index) => {
                  const isEditingThis = editingPassageId === passage.id;
                  const handleStartEdit = () => {
                    setEditingPassageId(passage.id);
                    setEditedPassageContent(passage.content);
                    setPassageActionError("");
                  };
                  const handleCancelEdit = () => {
                    setEditingPassageId(null);
                    setEditedPassageContent("");
                  };
                  const handleSaveEdit = async () => {
                    setPassageActionError("");
                    try {
                      const response = await fetch(
                        `${API_BASE_URL}/stories/passages/${passage.id}`,
                        {
                          method: "PATCH",
                          headers: authHeaders,
                          body: JSON.stringify({
                            content: editedPassageContent,
                          }),
                        },
                      );
                      if (!response.ok) {
                        const data = await response.json().catch(() => ({}));
                        throw new Error(
                          data.error ||
                            `Failed to update passage (${response.status})`,
                        );
                      }
                      setWrittenPassages((prev) =>
                        prev.map((p) =>
                          p.id === passage.id
                            ? { ...p, content: editedPassageContent }
                            : p,
                        ),
                      );
                      setEditingPassageId(null);
                      setEditedPassageContent("");
                    } catch (error) {
                      setPassageActionError(
                        error.message ||
                          "Something went wrong updating that passage.",
                      );
                    }
                  };
                  const handleDeletePassage = async () => {
                    if (
                      !window.confirm(
                        `Delete Passage #${index + 1}? This cannot be undone.`,
                      )
                    ) {
                      return;
                    }
                    setPassageActionError("");
                    try {
                      const response = await fetch(
                        `${API_BASE_URL}/stories/passages/${passage.id}`,
                        {
                          method: "DELETE",
                          headers: authHeaders,
                        },
                      );
                      if (!response.ok) {
                        const data = await response.json().catch(() => ({}));
                        throw new Error(
                          data.error ||
                            `Failed to delete passage (${response.status})`,
                        );
                      }
                      setWrittenPassages((prev) =>
                        prev.filter((p) => p.id !== passage.id),
                      );
                    } catch (error) {
                      setPassageActionError(
                        error.message ||
                          "Something went wrong deleting that passage.",
                      );
                    }
                  };
                  return (
                    <article
                      key={passage.id}
                      className={styles.previewCard}
                    >
                      <p className={styles.previewLabel}>
                        Passage #{index + 1}
                        {passage.is_ending && " \u00b7 ENDING"}
                      </p>
                      {isEditingThis ? (
                        <>
                          <textarea
                            className={styles.textArea}
                            value={editedPassageContent}
                            onChange={(event) =>
                              setEditedPassageContent(event.target.value)
                            }
                            rows={4}
                          />
                          <div className={styles.previewActions}>
                            <button
                              type="button"
                              className={styles.secondaryButton}
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className={styles.primaryButton}
                              onClick={handleSaveEdit}
                            >
                              Save changes
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className={styles.previewContent}>
                            {passage.content}
                          </p>
                          <div className={styles.previewActions}>
                            <button
                              type="button"
                              className={styles.secondaryButton}
                              onClick={handleStartEdit}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className={styles.dangerButton}
                              onClick={handleDeletePassage}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </article>
                  );
                })}
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
            <button
              type="button"
              className={styles.backButton}
              onClick={() => {
                setLinkError("");
                setPhase("writing");
              }}
            >
              ← Back to add more passages
            </button>

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

                    {(!draft.isSaved || draft.isEditing) && (
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
                            : draft.isEditing
                              ? "Save connections"
                              : "Connect this passage"}
                        </button>
                      </>
                    )}
                    {draft.isSaved && !draft.isEditing && (
                      <button
                        type="button"
                        className={styles.backButton}
                        onClick={() =>
                          handleEditConnections(passage.id)
                        }
                      >
                        Edit connections
                      </button>
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
