with open('client/src/config/api.js') as f:
    content = f.read()

old = """// Fetch a single story from backend including its primary genre.
// Replaces old storyGraph[storyId] lookup.
export async function getStoryById(storyId) {
  // Base story row
  const storyRes = await fetch(`${API_BASE_URL}/stories/${storyId}`);
  if (!storyRes.ok) throw new Error("Failed to load story");
  const story = await storyRes.json();
  // Genre(s) for this story
  let genre = null;
  try {
    const genreRes = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/genres`,
    );
    if (genreRes.ok) {
      const genres = await genreRes.json();
      genre = genres[0]?.name || null;
      // The theme/sound lookups elsewhere in the app expect "Sci-Fi",
      // but the genres table stores the full "Science Fiction" name.
      if (genre === "Science Fiction") {
        genre = "Sci-Fi";
      }
    }
  } catch {
    genre = null;
  }
  // Return story object with genre attached
  return { ...story, genre };
}"""

new = """// Fetch a single story from backend including its display genre.
// Replaces old storyGraph[storyId] lookup.
//
// preferredGenre: if the reader arrived here via a specific genre
// filter (e.g. clicked "Open story" while filtered to "Romance" on
// a story tagged both Romance and Horror), pass that name so the
// theme matches what they expected instead of always defaulting to
// whichever genre happens to be first in this story's genre list.
export async function getStoryById(storyId, preferredGenre) {
  // Base story row
  const storyRes = await fetch(`${API_BASE_URL}/stories/${storyId}`);
  if (!storyRes.ok) throw new Error("Failed to load story");
  const story = await storyRes.json();
  // Genre(s) for this story
  let genre = null;
  try {
    const genreRes = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/genres`,
    );
    if (genreRes.ok) {
      const genres = await genreRes.json();
      const matched = preferredGenre
        ? genres.find((g) => g.name === preferredGenre)
        : null;
      genre = matched?.name || genres[0]?.name || null;
      // The theme/sound lookups elsewhere in the app expect "Sci-Fi",
      // but the genres table stores the full "Science Fiction" name.
      if (genre === "Science Fiction") {
        genre = "Sci-Fi";
      }
    }
  } catch {
    genre = null;
  }
  // Return story object with genre attached
  return { ...story, genre };
}"""

count = content.count(old)
assert count == 1, f"expected 1 match, found {count}"
content = content.replace(old, new)

with open('client/src/config/api.js', 'w') as f:
    f.write(content)

print("api.js updated to accept preferredGenre.")
