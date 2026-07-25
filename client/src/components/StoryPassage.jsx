import styles from './StoryReader.module.css';

function StoryPassage({ passage }) {
  return (
    <div className={styles.storyCardScroll}>
      <p className={styles.passageText}>{passage.content}</p>
    </div>
  );
}

export default StoryPassage;