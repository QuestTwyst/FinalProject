import { useNavigate } from 'react-router-dom';
import styles from './About.module.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className={styles.aboutPage}>
      <div className={`${styles.gradientLayer} ${styles.gradientLayerOne}`}></div>
      <div className={`${styles.gradientLayer} ${styles.gradientLayerTwo}`}></div>

      <div className={styles.heroPanel}>
        <nav className={styles.navBar}>
          <button
            className={styles.navBtn}
            type="button"
            aria-label="Back to home"
            title="Back to home"
            onClick={() => navigate('/')}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </nav>

        <div className={styles.contentRow}>
          <div className={styles.card}>
            <h1 className={styles.title}>About Questwyst</h1>

            <p className={styles.text}>
              Questwyst is an interactive fiction project where every scene ends in a
              choice. Read a short paragraph, pick between two options, and watch the
              story branch based on what you chose.
            </p>

            <p className={styles.text}>
              <strong>How it works:</strong> pick a genre from the home page — Comedy,
              Horror, Romance, Sci-Fi, or Western — then read through short scenes. At
              the end of each one, two choices sit side by side. There's no
              &quot;correct&quot; pick, just a different path and a different ending.
            </p>

            <p className={styles.text}>
              Stories are short by design, so going back and choosing differently
              isn&apos;t a chore — it&apos;s the whole point. No two readers necessarily
              land on the same ending twice.
            </p>

            <button className={styles.backBtn} type="button" onClick={() => navigate('/')}>
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
