import styles from './StoryReader.module.css';

function ChoiceButton({ choice, label, onSelect }) {
  return (
    <button className={styles.choiceButton} type="button" onClick={() => onSelect(choice.next)}>
      <span className={styles.choiceLabel}>{label}</span>
      <span className={styles.choiceText}>{choice.text}</span>
    </button>
  );
}

export default ChoiceButton;
