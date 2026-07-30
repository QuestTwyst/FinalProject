with open('client/src/components/StoryCreator.jsx') as f:
    content = f.read()

start_idx = content.find('<select\n              id="story-genre"')
assert start_idx != -1, "start marker not found"

end_marker = "</select>"
end_idx = content.find(end_marker, start_idx)
assert end_idx != -1, "end marker not found"
end_idx += len(end_marker)

new_block = """<div className={styles.genreCheckboxGroup}>
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
            </div>"""

content = content[:start_idx] + new_block + content[end_idx:]

with open('client/src/components/StoryCreator.jsx', 'w') as f:
    f.write(content)

print("Genre checkboxes added (index-based).")
