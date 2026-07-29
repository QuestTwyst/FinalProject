with open('client/src/utils/saveFile.js') as f:
    content = f.read()

old1 = "import { storyGraph } from '../data/storyData';\n\n"
new1 = ''
old2 = 'const targetStory = storyGraph[data.storyId];\n      if (!targetStory || data.passageId == null || !targetStory.passages[data.passageId]) {'
new2 = 'if (data.storyId == null || data.passageId == null) {'

assert content.count(old1) == 1, "import anchor not found"
assert content.count(old2) == 1, "validation anchor not found"

content = content.replace(old1, new1)
content = content.replace(old2, new2)

with open('client/src/utils/saveFile.js', 'w') as f:
    f.write(content)

print("saveFile.js fixed.")
