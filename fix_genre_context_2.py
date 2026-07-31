with open('client/src/components/StoryLibrary.jsx') as f:
    content = f.read()

old = """const handleOpenStory = (storyId) => {
    navigate(`/stories/${storyId}`);
  };"""

new = """const handleOpenStory = (storyId) => {
    navigate(`/stories/${storyId}`, {
      state: { genreContext: selectedGenre !== 'All' ? selectedGenre : null },
    });
  };"""

count = content.count(old)
assert count == 1, f"expected 1 match, found {count}"
content = content.replace(old, new)

with open('client/src/components/StoryLibrary.jsx', 'w') as f:
    f.write(content)

print("handleOpenStory now passes genreContext.")
