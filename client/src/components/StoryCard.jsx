import styles from './StoryCard.module.css';

function StoryCard({ story, onOpen, onDelete }) {
  const { id, title, genre, description, creator_id } = story;
  const isCustomStory = creator_id != null;

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      onDelete(id);
    }
  };

  return (
    <article className={styles.storyCard}>
      <span className={styles.genreTag}>{genre}</span>
      <h2 className={styles.storyTitle}>{title}</h2>
      <p className={styles.storyDescription}>{description}</p>
      <div className={styles.cardActions}>
        <button
          type="button"
          className={styles.openButton}
          onClick={() => onOpen(id)}
        >
          Open story
        </button>
        {isCustomStory && (
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            aria-label={`Delete ${title}`}
            title="Delete this story"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}

export default StoryCard;