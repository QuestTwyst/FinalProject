with open('client/src/utils/saveFile.js') as f:
    content = f.read()

old = "import { storyGraph } from '../data/storyData';\n/**\n * Reads and validates a Questwyst save file, then hands the parsed\n * { storyId, passageId, ... } back via onValid. Used from Home,\n * Library, and the Story Reader so Import behaves the same everywhere.\n */\nexport function parseSaveFile(file, onValid, onError) {\n  const reader = new FileReader();\n  reader.onload = (e) => {\n    try {\n      const data = JSON.parse(e.target.result);\n      const targetStory = storyGraph[data.storyId];\n      if (!targetStory || data.passageId == null || !targetStory.passages[data.passageId]) {\n        throw new Error('Invalid save file');\n      }\n      onValid(data);\n    } catch (err) {\n      onError();\n    }\n  };\n  reader.onerror = () => onError();\n  reader.readAsText(file);\n}"
new = '/**\n * Reads and validates a Questwyst save file, then hands the parsed\n * { storyId, passageId, ... } back via onValid. Used from Home,\n * Library, and the Story Reader so Import behaves the same everywhere.\n *\n * NOTE: this only checks that the file has the right SHAPE (a real\n * storyId and passageId present) -- it no longer checks those IDs\n * against the local storyData.js file, since stories are now loaded\n * from the real backend/database and use database IDs that were\n * never in that local file to begin with. If the IDs turn out not to\n * exist, the actual navigation/fetch that follows will fail on its\n * own and show the normal "story not found" state.\n */\nexport function parseSaveFile(file, onValid, onError) {\n  const reader = new FileReader();\n  reader.onload = (e) => {\n    try {\n      const data = JSON.parse(e.target.result);\n      if (data.storyId == null || data.passageId == null) {\n        throw new Error(\'Invalid save file\');\n      }\n      onValid(data);\n    } catch (err) {\n      onError();\n    }\n  };\n  reader.onerror = () => onError();\n  reader.readAsText(file);\n}'

assert content == old, "file content does not match expected exactly"
content = new

with open('client/src/utils/saveFile.js', 'w') as f:
    f.write(content)

print("saveFile.js fixed.")
