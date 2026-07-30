with open('client/src/components/StoryCreator.jsx') as f:
    content = f.read()

old = '''<select
              id="story-genre"
              className={styles.textInput}
              value={selectedGenreId}
              onChange={(event) =>
                setSelectedGenreId(event.target.value)
              }
            >
              <option value="">Choose a genre...</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>'''

new = '''<div className={styles.genreCheckboxGroup}>
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
            </div>'''

count = content.count(old)
assert count == 1, f"expected 1 match, found {count}"
content = content.replace(old, new)

with open('client/src/components/StoryCreator.jsx', 'w') as f:
    f.write(content)

print("Genre checkboxes added to Creator form.")
