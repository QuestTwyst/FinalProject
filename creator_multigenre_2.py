with open('client/src/components/StoryCreator.jsx') as f:
    content = f.read()

old = '''const story = await response.json();
      const genreResponse = await fetch(
        `${API_BASE_URL}/api/stories/${story.id}/genres`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            genre_id: Number(selectedGenreId),
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
      setStoryId(story.id);'''

new = '''const story = await response.json();
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
      setStoryId(story.id);'''

count = content.count(old)
assert count == 1, f"expected 1 match, found {count}"
content = content.replace(old, new)

with open('client/src/components/StoryCreator.jsx', 'w') as f:
    f.write(content)

print("Genre assignment loop added.")
