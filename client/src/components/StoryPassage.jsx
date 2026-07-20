import styles from './StoryReader.module.css';

function StoryPassage({ passage }) {
  return (
    <section className={styles.passagePanel}>
      <div className={styles.passageMeta}>
        <span className={styles.passageLabel}>Current Passage</span>
      </div>
      <p className={styles.passageText}>{passage.content}</p>
      {passage.isEnding && (
        <div className={styles.endingNote}>
          <strong>This is the end of this story path.</strong>
        </div>
      )}
    </section>
  );
}

export default StoryPassage;
