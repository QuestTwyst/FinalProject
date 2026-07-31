with open('client/src/components/StoryReader.jsx') as f:
    content = f.read()

old = "const s = await getStoryById(storyId);"
new = "const s = await getStoryById(storyId, location.state?.genreContext);"

count = content.count(old)
assert count == 1, f"expected 1 match, found {count}"
content = content.replace(old, new)

with open('client/src/components/StoryReader.jsx', 'w') as f:
    f.write(content)

print("StoryReader.jsx now passes genreContext to getStoryById.")
