import styles from './StoryReader.module.css';

function StoryPassage({ passage }) {
  return (
    <div className={styles.storyCardScroll}>
      <p className={styles.passageText}>{passage.content}</p>
      {passage.isEnding && (
        <p className={styles.endingNote}>
          <strong>This path is finished.</strong> Use the restart button above to explore a different ending.
        </p>
      )}
    </div>
  );
}

export default StoryPassage;
