with open('client/src/components/StoryReader.jsx') as f:
    content = f.read()

# 1. Add isProcessing state
old_state = 'const [importMessage, setImportMessage] = useState("");'
new_state = ('const [importMessage, setImportMessage] = useState("");\n'
             '  const [isProcessing, setIsProcessing] = useState(false);\n'
             '  const [processingLabel, setProcessingLabel] = useState("");')
assert content.count(old_state) == 1, "state anchor not found"
content = content.replace(old_state, new_state)

# 2. Start of handleSaveProgress -- add the forced-spinner start
old_save_start = 'const handleSaveProgress = () => {\n    if (!story) return;'
new_save_start = ('const handleSaveProgress = () => {\n'
                   '    if (!story) return;\n'
                   '    setIsProcessing(true);\n'
                   '    setProcessingLabel("Saving your progress...");')
assert content.count(old_save_start) == 1, "save start anchor not found"
content = content.replace(old_save_start, new_save_start)

# 3. End of handleSaveProgress -- add the 30-second timeout before the closing brace
old_save_end = 'URL.revokeObjectURL(url);\n  };'
new_save_end = ('URL.revokeObjectURL(url);\n'
                 '    setTimeout(() => setIsProcessing(false), 30000);\n'
                 '  };')
assert content.count(old_save_end) == 1, "save end anchor not found"
content = content.replace(old_save_end, new_save_end)

# 4. Start of handleImportProgress -- add the forced-spinner start
old_import_start = 'const handleImportProgress = (file) => {\n    parseSaveFile('
new_import_start = ('const handleImportProgress = (file) => {\n'
                     '    setIsProcessing(true);\n'
                     '    setProcessingLabel("Importing your progress...");\n'
                     '    parseSaveFile(')
assert content.count(old_import_start) == 1, "import start anchor not found"
content = content.replace(old_import_start, new_import_start)

# 5. End of handleImportProgress -- add the 30-second timeout before the closing brace
old_import_end = ('setImportMessage("That file doesn\'t look like a valid Questwyst save."),\n'
                   '    );\n'
                   '  };')
new_import_end = ('setImportMessage("That file doesn\'t look like a valid Questwyst save."),\n'
                   '    );\n'
                   '    setTimeout(() => setIsProcessing(false), 30000);\n'
                   '  };')
assert content.count(old_import_end) == 1, "import end anchor not found"
content = content.replace(old_import_end, new_import_end)

# 6. Add the overlay JSX right after <main className={pageClass}>
old_main_open = 'return (\n    <main className={pageClass}>\n      {soundSrc'
new_main_open = ('return (\n'
                  '    <main className={pageClass}>\n'
                  '      {isProcessing && (\n'
                  '        <div className={styles.processingOverlay} role="status" aria-live="polite">\n'
                  '          <LoadingSpinner label={processingLabel} />\n'
                  '        </div>\n'
                  '      )}\n\n'
                  '      {soundSrc')
assert content.count(old_main_open) == 1, "main open anchor not found"
content = content.replace(old_main_open, new_main_open)

# Note: LoadingSpinner import was already added in an earlier fix this
# session, so it's intentionally not re-added here.

with open('client/src/components/StoryReader.jsx', 'w') as f:
    f.write(content)

print("Fixed.")
