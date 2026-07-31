import { useEffect } from 'react';

let audioContext = null;

function playClickSound() {
  try {
    // Respect the site's existing mute toggle (persisted the same way
    // as the background music mute setting).
    const isMuted = localStorage.getItem('questwyst_isMuted') === 'true';
    if (isMuted) return;

    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(720, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.07, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08);
  } catch (error) {
    // Some browsers block audio until the user has interacted with the
    // page at all -- safe to ignore, since this only ever fires on a
    // click, which is itself a user interaction.
  }
}

/**
 * Plays a short click sound whenever the user clicks any button or
 * button-like link, anywhere on the site. Uses event delegation on
 * document so it works for every button automatically, including ones
 * added later, without needing to touch each individual component.
 */
export function useGlobalClickSound() {
  useEffect(() => {
    const handleClick = (event) => {
      const target = event.target.closest('button, a[role="button"]');
      if (target) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);
}
