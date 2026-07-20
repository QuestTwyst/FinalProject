import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storyGraph } from '../data/storyData';
import StoryPassage from './StoryPassage';
import ChoiceButton from './ChoiceButton';
import styles from './StoryReader.module.css';

function StoryReader() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const story = storyGraph[storyId];
  const [currentPassageId, setCurrentPassageId] = useState(story?.startPassageId ?? null);

  useEffect(() => {
    setCurrentPassageId(story?.startPassageId ?? null);
  }, [storyId, story?.startPassageId]);

  const currentPassage = useMemo(() => {
    if (!story || currentPassageId == null) return null;
    return story.passages[currentPassageId];
  }, [story, currentPassageId]);

  const handleChoiceSelect = (nextPassageId) => {
    setCurrentPassageId(nextPassageId);
  };

  const handleRestart = () => {
    if (story) {
      setCurrentPassageId(story.startPassageId);
    }
  };

  if (!story) {
    return (
      <main className={styles.readerPage}>
        <div className={styles.noStory}>
          <h1>Story not found</h1>
          <p>The story you selected does not exist. Please return to the library and choose another tale.</p>
          <button className={styles.actionButton} type="button" onClick={() => navigate('/library')}>
            Back to library
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.readerPage}>
      <header className={styles.readerHeader}>
        <div className={styles.readerTitleGroup}>
          <h1 className={styles.readerTitle}>{story.title}</h1>
          <p className={styles.readerSubtitle}>{story.description}</p>
        </div>
        <div className={styles.readerActions}>
          <button className={styles.actionButton} type="button" onClick={() => navigate('/library')}>
            Back to library
          </button>
          <button className={styles.actionButton} type="button" onClick={handleRestart}>
            Restart story
          </button>
        </div>
      </header>

      {currentPassage ? (
        <>
          <StoryPassage passage={currentPassage} />

          {currentPassage.choices?.length > 0 ? (
            <div className={styles.choiceRow}>
              {currentPassage.choices.map((choice) => (
                <ChoiceButton key={choice.text} choice={choice} onSelect={handleChoiceSelect} />
              ))}
            </div>
          ) : (
            <div className={styles.endingNote}>
              <strong>This path is finished.</strong> Use the restart button to explore a different ending.
            </div>
          )}
        </>
      ) : (
        <div className={styles.noStory}>
          <p>Loading the first passage of this story...</p>
        </div>
      )}
    </main>
  );
}

export default StoryReader;
