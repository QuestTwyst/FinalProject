with open('client/src/config/api.js') as f:
    content = f.read()

old1 = "export async function getStoryById(storyId) {"
new1 = "export async function getStoryById(storyId, preferredGenre) {"

count1 = content.count(old1)
assert count1 == 1, f"signature anchor: expected 1, found {count1}"
content = content.replace(old1, new1)

old2 = "genre = genres[0]?.name || null;"
new2 = """const matched = preferredGenre
        ? genres.find((g) => g.name === preferredGenre)
        : null;
      genre = matched?.name || genres[0]?.name || null;"""

count2 = content.count(old2)
assert count2 == 1, f"genre assignment anchor: expected 1, found {count2}"
content = content.replace(old2, new2)

with open('client/src/config/api.js', 'w') as f:
    f.write(content)

print("api.js updated with small anchors.")
