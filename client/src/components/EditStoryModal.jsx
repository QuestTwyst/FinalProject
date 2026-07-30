import { useState } from 'react';
import styles from './EditStoryModal.module.css';

function EditStoryModal({ story, genres, onSave, onCancel, isSaving, error }) {
  const [title, setTitle] = useState(story.title || '');
  const [description, setDescription] = useState(story.description || '');
  const [selectedGenreIds, setSelectedGenreIds] = useState(
    (story.genres || []).map((genre) => String(genre.id))
  );

  const toggleGenre = (id) => {
    const idStr = String(id);
    setSelectedGenreIds((prev) =>
      prev.includes(idStr)
        ? prev.filter((existing) => existing !== idStr)
        : [...prev, idStr]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      title: title.trim(),
      description: description.trim(),
      genreIds: selectedGenreIds,
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

          <span className={styles.fieldLabel}>Genres</span>
          <div className={styles.genreCheckboxGroup}>
            {genres.map((genre) => (
              <label key={genre.id} className={styles.genreCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedGenreIds.includes(String(genre.id))}
                  onChange={() => toggleGenre(genre.id)}
                />
                {genre.name}
              </label>
            ))}
          </div>

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
