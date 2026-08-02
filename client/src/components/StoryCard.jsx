import styles from './StoryCard.module.css';

function StoryCard({ story, onOpen, onDelete, onEdit,}) {
  const { id, title, genre, description } = story;

  const canEdit = typeof onEdit === 'function';
  const canDelete = typeof onDelete === 'function';


  const handleDeleteClick = (event) => {
    event.stopPropagation();

    if (
      canDelete &&
      window.confirm(`Delete "${title}"? This cannot be undone.`)
    ) {
      onDelete(id);
    }
  };

  const handleEditClick = (event) => {
    event.stopPropagation();

    if (canEdit) {
      onEdit(story);
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



        {canEdit && (
          <button
            type="button"
            className={styles.editButton}
            onClick={handleEditClick}
            aria-label={`Edit ${title}`}
            title="Edit this story"
          >
            Edit Details
          </button>
        )}

        {canDelete && (
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