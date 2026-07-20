import styles from './StoryReader.module.css';

function ChoiceButton({ choice, onSelect }) {
  return (
    <button className={styles.choiceButton} type="button" onClick={() => onSelect(choice.next)}>
      <span className={styles.choiceText}>{choice.text}</span>
    </button>
  );
}

export default ChoiceButton;
