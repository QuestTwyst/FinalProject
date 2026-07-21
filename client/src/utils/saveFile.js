import { storyGraph } from '../data/storyData';

/**
 * Reads and validates a Questwyst save file, then hands the parsed
 * { storyId, passageId, ... } back via onValid. Used from Home,
 * Library, and the Story Reader so Import behaves the same everywhere.
 */
export function parseSaveFile(file, onValid, onError) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const targetStory = storyGraph[data.storyId];
      if (!targetStory || data.passageId == null || !targetStory.passages[data.passageId]) {
        throw new Error('Invalid save file');
      }
      onValid(data);
    } catch (err) {
      onError();
    }
  };
  reader.onerror = () => onError();
  reader.readAsText(file);
}
