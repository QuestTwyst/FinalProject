import { useState } from 'react';
import styles from './EditStoryModal.module.css';

function EditStoryModal({ story, genres, onSave, onCancel, isSaving, error }) {
  const [title, setTitle] = useState(story.title || '');
  const [description, setDescription] = useState(story.description || '');
  const [selectedGenreId, setSelectedGenreId] = useState(
    story.genres?.[0]?.id ? String(story.genres[0].id) : ''
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      title: title.trim(),
      description: description.trim(),
      genreId: selectedGenreId,
    });
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Edit story">
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Edit story</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.fieldLabel} htmlFor="edit-title">
            Title
          </label>
          <input
            id="edit-title"
            className={styles.textInput}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className={styles.fieldLabel} htmlFor="edit-description">
            Description
          </label>
          <textarea
            id="edit-description"
            className={styles.textArea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />

          <label className={styles.fieldLabel} htmlFor="edit-genre">
            Genre
          </label>
          <select
            id="edit-genre"
            className={styles.textInput}
            value={selectedGenreId}
            onChange={(e) => setSelectedGenreId(e.target.value)}
          >
            <option value="">Choose a genre...</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStoryModal;
