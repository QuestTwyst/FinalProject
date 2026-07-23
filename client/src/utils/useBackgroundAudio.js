import { useEffect, useState } from 'react';

/**
 * Manages a background <audio> element for a page: keeps it in sync
 * with mute state and volume, and works around browser autoplay
 * restrictions.
 *
 * Design note: play()/pause() are called from EXACTLY ONE effect below,
 * driven purely by [isMuted, hasInteracted]. An earlier version also
 * called play() directly from a raw "first click anywhere" listener,
 * which caused a race: if your very first click was the mute button
 * itself, that stale listener could start playback right after you'd
 * just asked to mute it. Now the "first interaction" listener only
 * flips a flag — it never touches playback directly — so there's only
 * ever one place deciding whether audio should be playing, and it
 * always sees the current isMuted value.
 */
export function useBackgroundAudio(audioRef, isMuted, volume) {
  const [hasInteracted, setHasInteracted] = useState(false);

  // Volume: use a squared curve instead of mapping the 0-1 slider
  // straight to audio.volume. Human hearing is roughly logarithmic, so
  // a linear mapping still sounds fairly loud even in the lower half
  // of the slider. Squaring keeps the top of the range (near 1) almost
  // unchanged but makes the bottom third genuinely quiet.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume * volume;
    }
  }, [audioRef, volume]);

  // Wait for the first interaction anywhere on the page (browsers block
  // audio-with-sound before that). This ONLY sets a flag — it never
  // calls play() itself.
  useEffect(() => {
    if (hasInteracted) return undefined;
    const markInteracted = () => setHasInteracted(true);
    document.addEventListener('click', markInteracted);
    document.addEventListener('keydown', markInteracted);
    document.addEventListener('touchstart', markInteracted);
    return () => {
      document.removeEventListener('click', markInteracted);
      document.removeEventListener('keydown', markInteracted);
      document.removeEventListener('touchstart', markInteracted);
    };
  }, [hasInteracted]);

  // The single source of truth for play/pause. Always reflects the
  // current isMuted value at the time it runs — no race possible.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    if (isMuted) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Still blocked (hasInteracted hasn't flipped yet) — this
        // effect will run again once it does.
      });
    }
    return undefined;
  }, [isMuted, hasInteracted, audioRef]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}