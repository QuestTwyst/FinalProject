import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  getStoryById,
  getPassageById,
  getReadingProgress,
  createReadingProgress,
  updateReadingProgress,
} from "../config/api";

import { parseSaveFile } from "../utils/saveFile";
import { useBackgroundAudio } from "../utils/useBackgroundAudio";
import { usePersistedAudioSettings } from "../utils/usePersistedAudioSettings";
import NavBar from "./NavBar";
import LoadingSpinner from "./LoadingSpinner";
import CustomCursor from "./CustomCursor";
import StoryPassage from "./StoryPassage";
import ChoiceButton from "./ChoiceButton";
import styles from "./StoryReader.module.css";

// Genre -> background sound file. Comedy is handled separately since it
// picks randomly between two tracks each time you visit.
const GENRE_SOUND_MAP = {
  Mystery: "/sounds/mystery.wav",
  "Sci-Fi": "/sounds/scifi.mp3",
  Romance: "/sounds/romantic.wav",
  Western: "/sounds/western.wav",
  Horror: "/sounds/horror.wav",
  Adventure: "/sounds/adventure.mp3",
};

function StoryReader() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Story loaded from backend
  const [story, setStory] = useState(null);

  // Passage ID we should load next
  const [currentPassageId, setCurrentPassageId] = useState(null);

  // Passage object loaded from backend
  const [currentPassage, setCurrentPassage] = useState(null);

  // Choices for the current passage (from backend)
  const [choices, setChoices] = useState([]);

  // Track the choices the reader made this session
  const [choiceHistory, setChoiceHistory] = useState([]);

  const [isDark, setIsDark] = useState(false);
  const { isMuted, setIsMuted, volume, setVolume } = usePersistedAudioSettings();
  const [importMessage, setImportMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState("");

  useEffect(() => {
    document.body.classList.toggle("qtProcessingCursor", isProcessing);
    return () => {
      document.body.classList.remove("qtProcessingCursor");
    };
  }, [isProcessing]);
  const audioRef = useRef(null);

  console.log("StoryReader storyId param:", storyId);

  // Load story from backend
  useEffect(() => {
    async function loadStory() {
      try {
        const s = await getStoryById(storyId, location.state?.genreContext);
        setStory(s);
      } catch (err) {
        console.error("Failed to load story", err);
        setStory(null);
      }
    }

    loadStory();
  }, [storyId]);

  // Determine starting passage or resume from save file
  useEffect(() => {
    if (!story) return;

    const resumePassageId = location.state?.resumePassageId;
    setChoiceHistory([]);

    if (resumePassageId != null) {
      // Resume from saved passage
      setCurrentPassageId(resumePassageId);

      // Clear router state so it doesn't re-trigger
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      // Use backend start_passage_id when not resuming
      setCurrentPassageId(story.start_passage_id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId, story?.start_passage_id]);

  // Auto-generate reading progress the first time a logged-in user
  // opens this story -- see issue #72 (auto-generated data on a user
  // action). If no progress exists yet for this user + story, create
  // one automatically; the user never has to ask for this separately.
  useEffect(() => {
    if (!story || !currentPassageId) return;

    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );

    if (!currentUser) return; // only track progress for logged-in users

    async function ensureReadingProgress() {
      try {
        const existing = await getReadingProgress(currentUser.id, story.id);

        if (!existing) {
          await createReadingProgress(
            currentUser.id,
            story.id,
            currentPassageId,
          );
        }
      } catch (err) {
        console.error("Failed to set up reading progress", err);
      }
    }

    ensureReadingProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id, currentPassageId]);

  // Load passage + choices from backend whenever currentPassageId changes
  useEffect(() => {
    if (!currentPassageId) return;

    async function loadPassage() {
      try {
        const p = await getPassageById(currentPassageId);

        // Passage object from backend
        setCurrentPassage(p);

        // Choices come inside passage response as "choices"
        // Only choices that actually point somewhere are shown --
        // an unlinked choice would otherwise lead to a blank passage.
        setChoices((p.choices || []).filter((c) => c.next_passage_id != null));
      } catch (err) {
        console.error("Failed to load passage", err);
        setCurrentPassage(null);
        setChoices([]);
      }
    }

    loadPassage();
  }, [currentPassageId]);

  // Pick the background sound for this genre. Comedy alternates randomly
  // between its two tracks each time you land on a Comedy story.
  const soundSrc = useMemo(() => {
    if (!story) return null;
    if (story.genre === "Comedy") {
      return Math.random() < 0.5 ? "/sounds/Comdey.wav" : "/sounds/Comdey2.wav";
    }
    return GENRE_SOUND_MAP[story.genre] ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.genre]);

  useBackgroundAudio(audioRef, isMuted, volume);

  const handleThemeToggle = () => setIsDark((prev) => !prev);
  const handleSoundToggle = () => setIsMuted((prev) => !prev);

  // Move to next passage using backend field names
  const handleChoiceSelect = (choice) => {
    if (!choice?.next_passage_id) return;
    setChoiceHistory((prev) => [...prev, choice.choice_text]);
    setCurrentPassageId(choice.next_passage_id);

    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );

    if (currentUser && story) {
      updateReadingProgress(currentUser.id, story.id, choice.next_passage_id).catch(
        (err) => console.error("Failed to update reading progress", err),
      );
    }
  };

  // Restart story
  const handleRestart = () => {
    if (story) {
      setChoiceHistory([]);
      setCurrentPassageId(story.start_passage_id);

      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );

      if (currentUser) {
        updateReadingProgress(
          currentUser.id,
          story.id,
          story.start_passage_id,
        ).catch((err) =>
          console.error("Failed to reset reading progress", err),
        );
      }
    }
  };

  // Save progress to file
  const handleSaveProgress = () => {
    if (!story) return;
    setIsProcessing(true);
    setProcessingLabel("Saving your progress...");
    const saveData = {
      app: "Questwyst",
      version: 1,
      storyId: story.id,
      title: story.title,
      passageId: currentPassageId,
      savedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeTitle = story.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    link.download = `questwyst-save-${safeTitle}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => setIsProcessing(false), 30000);
  };

  // Import progress from saved file
  const handleImportProgress = (file) => {
    setIsProcessing(true);
    setProcessingLabel("Importing your progress...");
    parseSaveFile(
      file,
      (data) => {
        setImportMessage("");

        // If same story, jump to passage
        if (String(data.storyId) === String(storyId)) {
          setCurrentPassageId(data.passageId);
        } else {
          // Navigate to different story and resume there
          navigate(`/stories/${data.storyId}`, {
            state: { resumePassageId: data.passageId },
          });
        }
      },
      () =>
        setImportMessage("That file doesn't look like a valid Questwyst save."),
    );
    setTimeout(() => setIsProcessing(false), 30000);
  };

  const isRomance = story?.genre === "Romance";
  const isMystery = story?.genre === "Mystery";
  const isAdventure = story?.genre === "Adventure";
  const isSciFi = story?.genre === "Sci-Fi";
  const isWestern = story?.genre === "Western";
  const isComedy = story?.genre === "Comedy";
  const isHorror = story?.genre === "Horror";
  const pageClass = `${styles.readerPage} ${isRomance ? styles.themeRomance : ""} ${isMystery ? styles.themeMystery : ""} ${isAdventure ? styles.themeAdventure : ""} ${isSciFi ? styles.themeSciFi : ""} ${isWestern ? styles.themeWestern : ""} ${isComedy ? styles.themeComedy : ""} ${isHorror ? styles.themeHorror : ""} ${isDark ? styles.themeDark : ""}`;

  // If story failed to load
  if (!story) {
    return (
      <main className={pageClass}>
        <div
          className={`${styles.gradientLayer} ${styles.gradientLayerOne}`}
          aria-hidden="true"
        />
        <div
          className={`${styles.gradientLayer} ${styles.gradientLayerTwo}`}
          aria-hidden="true"
        />

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
                  The story you selected does not exist. Use the Library button
                  above to choose another tale.
                </p>
              </div>
            </article>
          </section>
        </div>
      </main>
    );
  }

  // Main render
  return (
    <main className={pageClass}>
      <CustomCursor active={isProcessing} />

      {soundSrc && <audio ref={audioRef} src={soundSrc} loop />}

      {/* Background layers */}
      <div
        className={`${styles.gradientLayer} ${styles.gradientLayerOne}`}
        aria-hidden="true"
      />
      <div
        className={`${styles.gradientLayer} ${styles.gradientLayerTwo}`}
        aria-hidden="true"
      />
      <div
        className={`${styles.gradientLayer} ${styles.gradientLayerGround}`}
        aria-hidden="true"
      />

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
          <img
            className={`${styles.dataImg} ${styles.data1}`}
            src="/scifi-data-1.png"
            alt=""
          />
          <img
            className={`${styles.dataImg} ${styles.data2}`}
            src="/scifi-data-2.png"
            alt=""
          />
          <img
            className={`${styles.dataImg} ${styles.data3}`}
            src="/scifi-data-3.png"
            alt=""
          />
          <img
            className={`${styles.dataImg} ${styles.data4}`}
            src="/scifi-data-4.png"
            alt=""
          />
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
            <line
              x1="78"
              y1="150"
              x2="132"
              y2="175"
              strokeWidth="4"
              stroke="currentColor"
            />
            <line
              x1="132"
              y1="150"
              x2="78"
              y2="175"
              strokeWidth="4"
              stroke="currentColor"
            />

            {/* Saloon with false front */}
            <rect x="230" y="90" width="260" height="130" />
            <rect x="230" y="60" width="260" height="35" />
            <rect x="340" y="150" width="40" height="70" fill="#1a0f08" />
            <line
              x1="230"
              y1="120"
              x2="490"
              y2="120"
              strokeWidth="3"
              stroke="#1a0f08"
            />
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
            <circle
              cx="993"
              cy="120"
              r="34"
              fill="none"
              strokeWidth="3"
              stroke="currentColor"
            />
            <line
              x1="993"
              y1="86"
              x2="993"
              y2="154"
              strokeWidth="3"
              stroke="currentColor"
            />
            <line
              x1="959"
              y1="120"
              x2="1027"
              y2="120"
              strokeWidth="3"
              stroke="currentColor"
            />

            {/* Far shack */}
            <rect x="1080" y="150" width="110" height="70" />
            <polygon points="1072,150 1198,150 1135,118" />
          </svg>

          <div className={styles.tumbleweedField} aria-hidden="true">
            <svg className={styles.tumbleweed} viewBox="0 0 60 60">
              <path d="M8,30 Q20,10 32,28 Q44,46 52,28 Q44,14 30,20 Q16,26 22,40 Q30,52 40,36" fill="none" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" />
              <path d="M15,14 Q32,26 46,13 Q34,30 47,44 Q30,34 14,46 Q26,30 15,14" fill="none" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" />
              <path d="M10,20 Q26,7 41,19 Q53,29 42,42 Q29,53 16,42 Q5,31 10,20" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" />
              <path d="M12,12 Q30,30 48,48" fill="none" strokeWidth="1.2" stroke="currentColor" strokeLinecap="round" opacity="0.7" />
              <path d="M48,12 Q30,30 12,48" fill="none" strokeWidth="1.2" stroke="currentColor" strokeLinecap="round" opacity="0.7" />
              <path d="M5,30 Q30,20 55,30 Q30,40 5,30" fill="none" strokeWidth="1.3" stroke="currentColor" strokeLinecap="round" opacity="0.75" />
              <path d="M30,5 Q40,30 30,55 Q20,30 30,5" fill="none" strokeWidth="1.3" stroke="currentColor" strokeLinecap="round" opacity="0.75" />
              <path d="M20,9 Q27,17 21,25 Q14,20 20,9" fill="none" strokeWidth="1.2" stroke="currentColor" strokeLinecap="round" />
              <path d="M44,11 Q51,19 45,27 Q38,21 44,11" fill="none" strokeWidth="1.2" stroke="currentColor" strokeLinecap="round" />
              <path d="M9,44 Q17,51 25,44 Q17,39 9,44" fill="none" strokeWidth="1.2" stroke="currentColor" strokeLinecap="round" />
              <path d="M38,44 Q46,50 51,42 Q44,38 38,44" fill="none" strokeWidth="1.2" stroke="currentColor" strokeLinecap="round" />
              <path d="M25,22 Q30,17 35,22 Q40,27 35,32 Q30,37 25,32 Q20,27 25,22" fill="none" strokeWidth="1.1" stroke="currentColor" strokeLinecap="round" opacity="0.85" />
              <path d="M4,25 Q9,29 4,33 M56,25 Q51,29 56,33 M25,4 Q29,9 33,4 M25,56 Q29,51 33,56" fill="none" strokeWidth="1.1" stroke="currentColor" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
        </>
      )}

      {isHorror && (
        <>
          <div className={styles.starField} aria-hidden="true">
            <span className={`${styles.star} ${styles.star1}`}></span>
            <span className={`${styles.star} ${styles.star2}`}></span>
            <span className={`${styles.star} ${styles.star3}`}></span>
            <span className={`${styles.star} ${styles.star4}`}></span>
            <span className={`${styles.star} ${styles.star5}`}></span>
            <span className={`${styles.star} ${styles.star6}`}></span>
            <span className={`${styles.star} ${styles.star7}`}></span>
            <span className={`${styles.star} ${styles.star8}`}></span>
          </div>

          <svg className={styles.moon} viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="42" />
            <circle cx="38" cy="36" r="7" opacity="0.18" />
            <circle cx="60" cy="55" r="10" opacity="0.14" />
            <circle cx="45" cy="65" r="5" opacity="0.16" />
          </svg>

          <svg
            className={styles.hauntedMansion}
            viewBox="0 0 1280 420"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,420 L0,340 Q320,300 640,335 T1280,330 L1280,420 Z" className={styles.hillShape} />

            <path
              d="M70,420 L70,270 L45,235 M70,270 L100,225 M70,310 L30,290 M70,325 L110,300 M70,240 L55,200"
              fill="none"
              strokeWidth="6"
              stroke="currentColor"
              strokeLinecap="round"
              className={styles.treeShape}
            />
            <path
              d="M1195,420 L1195,255 L1230,210 M1195,255 L1160,195 M1195,300 L1240,280 M1195,320 L1150,295 M1195,225 L1215,180"
              fill="none"
              strokeWidth="6"
              stroke="currentColor"
              strokeLinecap="round"
              className={styles.treeShape}
            />

            <g className={styles.fenceShape}>
              <rect x="130" y="360" width="7" height="60" />
              <rect x="180" y="355" width="7" height="65" />
              <rect x="230" y="360" width="7" height="60" />
              <rect x="1040" y="360" width="7" height="60" />
              <rect x="1090" y="355" width="7" height="65" />
              <rect x="1140" y="360" width="7" height="60" />
              <line x1="130" y1="378" x2="237" y2="378" strokeWidth="4" stroke="currentColor" />
              <line x1="1040" y1="378" x2="1147" y2="378" strokeWidth="4" stroke="currentColor" />
            </g>

            <g className={styles.mansionShape}>
              <polygon points="360,420 360,220 430,220 430,420" />
              <polygon points="352,220 395,150 438,220" />
              <rect x="388" y="175" width="14" height="30" className={styles.towerWindowDark} />
            </g>

            <g className={styles.mansionShape}>
              <polygon points="430,420 430,180 560,90 690,180 690,420" />
              <polygon points="560,90 500,140 620,140" />
              <rect x="600" y="60" width="26" height="70" />
            </g>

            <rect x="465" y="220" width="30" height="42" className={styles.windowLit} />
            <rect x="625" y="220" width="30" height="42" className={styles.windowDark} />
            <rect x="465" y="300" width="30" height="42" className={styles.windowDark} />
            <rect x="625" y="300" width="30" height="42" className={styles.windowLit} />
            <rect x="540" y="330" width="40" height="60" className={styles.doorShape} />

            <polygon points="430,340 560,300 690,340 690,352 430,352" className={styles.mansionShape} />

            <g className={styles.mansionShape}>
              <polygon points="760,420 760,260 820,260 820,420" />
              <polygon points="754,260 790,210 826,260" />
              <rect x="783" y="290" width="14" height="26" className={styles.towerWindowDark} />
            </g>
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
            <button
              className={styles.restartButton}
              type="button"
              onClick={handleRestart}
            >
              Restart story
            </button>
          </div>

          {importMessage && (
            <p className={styles.importMessage}>{importMessage}</p>
          )}

          <article className={styles.storyCard}>
            <header className={styles.storyMeta}>
              <p className={styles.storyMetaDetails}>
                {story.genre && (
                  <span className={styles.storyMetaGenre}>{story.genre}</span>
                )}
                {story.genre && (
                  <span
                    className={styles.storyMetaSeparator}
                    aria-hidden="true"
                  >
                    ·
                  </span>
                )}
                <span className={styles.storyMetaAuthor}>
                  by {story.author || "Questwyst Team"}
                </span>
              </p>
              {story.description && (
                <p className={styles.storyMetaDescription}>
                  {story.description}
                </p>
              )}
            </header>

            {currentPassage ? (
              <>
                <StoryPassage passage={currentPassage} />

                {choices.length > 0 ? (
                  <div className={styles.choiceRow}>
                    {choices.map((choice, index) => (
                      <ChoiceButton
                        key={choice.id}
                        choice={choice}
                        label={String.fromCharCode(65 + index)}
                        onSelect={handleChoiceSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.recapSection}>
                    <h3 className={styles.recapTitle}>
                      Your path through this story
                    </h3>
                    {choiceHistory.length > 0 ? (
                      <ol className={styles.recapList}>
                        {choiceHistory.map((choiceText, index) => (
                          <li key={index} className={styles.recapItem}>
                            {choiceText}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className={styles.recapEmpty}>
                        You reached this ending without making any choices yet
                        this session.
                      </p>
                    )}
                    <div className={styles.choiceRow}>
                      <button
                        className={`${styles.choiceButton} ${styles.choiceButtonEnd}`}
                        type="button"
                        onClick={handleRestart}
                      >
                        <span className={styles.choiceText}>
                          Restart with different choices
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.storyCardScroll}>
                <LoadingSpinner label="Loading the first passage of this story..." />
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}

export default StoryReader;
