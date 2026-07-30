with open('client/src/components/StoryLibrary.jsx') as f:
    content = f.read()

start_marker = "const handleSaveEdit = async ({ title, description, genreId }) => {"
start_idx = content.find(start_marker)
assert start_idx != -1, "start marker not found"

end_marker = "setEditingStory(null);"
end_idx = content.find(end_marker, start_idx)
assert end_idx != -1, "end marker not found"
end_idx += len(end_marker)

new_function = """const handleSaveEdit = async ({ title, description, genreIds }) => {
    if (!editingStory) return;
    setEditError('');
    setIsSavingEdit(true);
    try {
      const authToken = localStorage.getItem('authToken');

      const patchResponse = await fetch(`${API_BASE_URL}/stories/${editingStory.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          creator_id: editingStory.creator_id,
        }),
      });

      if (!patchResponse.ok) {
        throw new Error(`Failed to update story (${patchResponse.status})`);
      }

      // Diff the old genre list against the new selection -- remove
      // whatever was dropped, add whatever is newly checked. Genre is
      // a many-to-many relationship (story_genres), not a single field.
      const oldGenreIds = (editingStory.genres || []).map((g) => g.id);
      const newGenreIds = (genreIds || []).map(Number);

      const toRemove = oldGenreIds.filter((id) => !newGenreIds.includes(id));
      const toAdd = newGenreIds.filter((id) => !oldGenreIds.includes(id));

      for (const genreId of toRemove) {
        await fetch(`${API_BASE_URL}/api/stories/${editingStory.id}/genres/${genreId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }

      for (const genreId of toAdd) {
        await fetch(`${API_BASE_URL}/api/stories/${editingStory.id}/genres`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ genre_id: genreId }),
        });
      }

      const updatedGenres = availableGenres.filter((g) => newGenreIds.includes(g.id));

      setStories((prev) =>
        prev.map((story) =>
          story.id === editingStory.id
            ? {
                ...story,
                title,
                description,
                genres: updatedGenres,
                genre: updatedGenres.map((g) => g.name).join(', ') || 'Uncategorized',
              }
            : story
        )
      );

      setEditingStory(null);"""

content = content[:start_idx] + new_function + content[end_idx:]

with open('client/src/components/StoryLibrary.jsx', 'w') as f:
    f.write(content)

print("Multi-genre save logic added via index-based replacement.")
