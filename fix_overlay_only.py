with open('client/src/components/StoryReader.jsx') as f:
    content = f.read()

old = '{isProcessing && (\n        <div className={styles.processingOverlay} role="status" aria-live="polite">\n          <LoadingSpinner label={processingLabel} />\n        </div>\n      )}\n\n      {soundSrc'
new = '{soundSrc'

assert content.count(old) == 1, "overlay pattern not found: " + repr(old[:80])
content = content.replace(old, new)

with open('client/src/components/StoryReader.jsx', 'w') as f:
    f.write(content)

print("Overlay removed.")
