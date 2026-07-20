import { useNavigate } from 'react-router-dom';
import StoryCard from './StoryCard';
import styles from './StoryLibrary.module.css';
import { storyList } from '../data/storyData';

function StoryLibrary() {
  const navigate = useNavigate();

  const handleOpenStory = (storyId) => {
    navigate(`/stories/${storyId}`);
  };

  return (
    <main className={styles.libraryPage}>
      <section className={styles.pageHeader}>
        <div>
          <p className={styles.breadcrumb}>Home / Story Library</p>
          <h1 className={styles.pageTitle}>Story Library</h1>
          <p className={styles.pageSubtitle}>
            Browse available adventures and choose the story you want to read.
          </p>
        </div>

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          Back to home
        </button>
      </section>

      <section className={styles.storyGrid}>
        {storyList.map((story) => (
          <StoryCard key={story.id} story={story} onOpen={handleOpenStory} />
        ))}
      </section>
    </main>
  );
}

export default StoryLibrary;
