import styles from './StoryLibrary.module.css';

function StoryCard({ story, onOpen }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>{story.title}</h2>
          <p className={styles.cardGenre}>{story.genre}</p>
        </div>
      </div>

      <p className={styles.cardDescription}>{story.description}</p>

      <button
        type="button"
        className={styles.openButton}
        onClick={() => onOpen(story.id)}
      >
        Open story
      </button>
    </article>
  );
}

export default StoryCard;
