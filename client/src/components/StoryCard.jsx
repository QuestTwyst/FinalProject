import styles from './StoryCard.module.css';

function StoryCard({ story, onOpen }) {
  const { id, title, genre, description } = story;

  return (
    <article className={styles.storyCard}>
      <span className={styles.genreTag}>{genre}</span>
      <h2 className={styles.storyTitle}>{title}</h2>
      <p className={styles.storyDescription}>{description}</p>
      <button
        type="button"
        className={styles.openButton}
        onClick={() => onOpen(id)}
      >
        Open story
      </button>
    </article>
  );
}

export default StoryCard;