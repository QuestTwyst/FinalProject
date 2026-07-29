with open('client/src/components/StoryReader.jsx') as f:
    content = f.read()

old_main = 'className={pageClass}>\n      {soundSrc'
new_main = 'className={pageClass}>\n      <CustomCursor active={isProcessing} />\n\n      {soundSrc'
old_import = 'import LoadingSpinner from "./LoadingSpinner";'
new_import = 'import LoadingSpinner from "./LoadingSpinner";\nimport CustomCursor from "./CustomCursor";'

assert content.count(old_main) == 1, "main anchor not found"
assert content.count(old_import) == 1, "import anchor not found"

content = content.replace(old_main, new_main)
content = content.replace(old_import, new_import)

with open('client/src/components/StoryReader.jsx', 'w') as f:
    f.write(content)

print("CustomCursor wired in.")
