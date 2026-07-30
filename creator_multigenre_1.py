with open('client/src/components/StoryCreator.jsx') as f:
    content = f.read()

old_state = 'const [selectedGenreId, setSelectedGenreId] = useState("");'
new_state = '''const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const toggleGenre = (id) => {
    const idStr = String(id);
    setSelectedGenreIds((prev) =>
      prev.includes(idStr)
        ? prev.filter((existing) => existing !== idStr)
        : [...prev, idStr]
    );
  };'''

assert content.count(old_state) == 1, "state anchor not found"
content = content.replace(old_state, new_state)

old_validation = '''if (!selectedGenreId) {
      setStoryError("Please choose a genre.");
      return;
    }'''
new_validation = '''if (selectedGenreIds.length === 0) {
      setStoryError("Please choose at least one genre.");
      return;
    }'''

assert content.count(old_validation) == 1, "validation anchor not found"
content = content.replace(old_validation, new_validation)

with open('client/src/components/StoryCreator.jsx', 'w') as f:
    f.write(content)

print("State and validation updated.")
