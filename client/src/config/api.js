const configuredUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = (configuredUrl || "http://localhost:3001").replace(
  /\/+$/,
  "",
);

// Fetch a single story from backend including its primary genre.
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
}

// Fetch a single passage from backend.
// Replaces old story.passages[currentPassageId] lookup.
export async function getPassageById(passageId) {
  const res = await fetch(`${API_BASE_URL}/stories/passages/${passageId}`);
  if (!res.ok) throw new Error("Failed to load passage");
  return res.json(); // backend returns passage object
}

// Fetch choices for a passage from backend.
// Replaces old currentPassage.choices array.
export async function getChoicesForPassage(passageId) {
  const res = await fetch(`${API_BASE_URL}/passages/${passageId}/choices`);
  if (!res.ok) throw new Error("Failed to load choices");
  return res.json(); // backend returns array of choices
}
