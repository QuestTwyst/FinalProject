with open('client/src/components/StoryCreator.jsx') as f:
    content = f.read()

start_marker = "const story = await response.json();"
start_idx = content.find(start_marker)
assert start_idx != -1, "start marker not found"

end_marker = "setStoryId(story.id);"
end_idx = content.find(end_marker, start_idx)
assert end_idx != -1, "end marker not found"
end_idx += len(end_marker)

new_block = """const story = await response.json();
      for (const genreId of selectedGenreIds) {
        const genreResponse = await fetch(
          `${API_BASE_URL}/api/stories/${story.id}/genres`,
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
              genre_id: Number(genreId),
            }),
          },
        );
        if (!genreResponse.ok) {
          const data = await genreResponse.json().catch(() => ({}));
          throw new Error(
            data.error ||
              `Story created, but genre assignment failed (${genreResponse.status})`,
          );
        }
      }
      setStoryId(story.id);"""

content = content[:start_idx] + new_block + content[end_idx:]

with open('client/src/components/StoryCreator.jsx', 'w') as f:
    f.write(content)

print("Genre assignment loop added (index-based).")
