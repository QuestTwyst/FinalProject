with open('client/src/components/StoryReader.jsx') as f:
    content = f.read()

# 1. Add isProcessing state, right after the LoadingSpinner import area
# is safest to anchor near existing state -- use the importMessage
# state declaration as the anchor since it's unique and nearby.
old_state = '  const [importMessage, setImportMessage] = useState("");'
new_state = '''  const [importMessage, setImportMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState("");'''

assert content.count(old_state) == 1, "state anchor not found"
content = content.replace(old_state, new_state)

# 2. Wrap handleSaveProgress with the forced 30-second spinner
old_save = '''  const handleSaveProgress = () => {
    if (!story) return;
    const saveData = {
      app: "Questwyst",
      version: 1,
      storyId: story.id,
      title: story.title,
      passageId: currentPassageId,
      savedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeTitle = story.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    link.download = `questwyst-save-${safeTitle}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };'''

new_save = '''  const handleSaveProgress = () => {
    if (!story) return;
    setIsProcessing(true);
    setProcessingLabel("Saving your progress...");
    const saveData = {
      app: "Questwyst",
      version: 1,
      storyId: story.id,
      title: story.title,
      passageId: currentPassageId,
      savedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeTitle = story.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    link.download = `questwyst-save-${safeTitle}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    // Forced minimum spinner duration, regardless of how fast the
    // actual save finished (which is near-instant, since it's just a
    // local file download).
    setTimeout(() => setIsProcessing(false), 30000);
  };'''

assert content.count(old_save) == 1, "save handler not found"
content = content.replace(old_save, new_save)

# 3. Wrap handleImportProgress with the forced 30-second spinner
old_import = '''  const handleImportProgress = (file) => {
    parseSaveFile(
      file,
      (data) => {
        setImportMessage("");
        // If same story, jump to passage
        if (String(data.storyId) === String(storyId)) {
          setCurrentPassageId(data.passageId);
        } else {
          // Navigate to different story and resume there
          navigate(`/stories/${data.storyId}`, {
            state: { resumePassageId: data.passageId },
          });
        }
      },
      () =>
        setImportMessage("That file doesn't look like a valid Questwyst save."),
    );
  };'''

new_import = '''  const handleImportProgress = (file) => {
    setIsProcessing(true);
    setProcessingLabel("Importing your progress...");
    parseSaveFile(
      file,
      (data) => {
        setImportMessage("");
        // If same story, jump to passage
        if (String(data.storyId) === String(storyId)) {
          setCurrentPassageId(data.passageId);
        } else {
          // Navigate to different story and resume there
          navigate(`/stories/${data.storyId}`, {
            state: { resumePassageId: data.passageId },
          });
        }
      },
      () =>
        setImportMessage("That file doesn't look like a valid Questwyst save."),
    );
    // Forced minimum spinner duration, regardless of how fast the
    // actual import/parse finished.
    setTimeout(() => setIsProcessing(false), 30000);
  };'''

assert content.count(old_import) == 1, "import handler not found"
content = content.replace(old_import, new_import)

# 4. Add the overlay JSX, right after the <main className={pageClass}> opening tag
old_main_open = '''  return (
    <main className={pageClass}>
      {soundSrc && <audio ref={audioRef} src={soundSrc} loop />}'''

new_main_open = '''  return (
    <main className={pageClass}>
      {isProcessing && (
        <div className={styles.processingOverlay} role="status" aria-live="polite">
          <LoadingSpinner label={processingLabel} />
        </div>
      )}

      {soundSrc && <audio ref={audioRef} src={soundSrc} loop />}'''

assert content.count(old_main_open) == 1, "main open tag not found"
content = content.replace(old_main_open, new_main_open)

with open('client/src/components/StoryReader.jsx', 'w') as f:
    f.write(content)

print("Fixed.")
