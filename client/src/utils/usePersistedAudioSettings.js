import { useEffect, useState } from 'react';

const MUTE_KEY = 'questwyst_isMuted';
const VOLUME_KEY = 'questwyst_volume';

/**
 * Keeps mute/volume settings consistent across every page. Each page
 * still gets its own React state (needed since components remount on
 * navigation), but that state is seeded from localStorage on load and
 * written back to localStorage on every change -- so switching pages,
 * or reloading the browser, keeps whatever the reader last set.
 */
export function usePersistedAudioSettings() {
  const [isMuted, setIsMuted] = useState(() => {
    try {
      const saved = localStorage.getItem(MUTE_KEY);
      return saved === null ? false : saved === 'true';
    } catch (error) {
      return false;
    }
  });

  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem(VOLUME_KEY);
      const parsed = saved === null ? 0.5 : Number(saved);
      return Number.isFinite(parsed) ? parsed : 0.5;
    } catch (error) {
      return 0.5;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MUTE_KEY, String(isMuted));
    } catch (error) {
      // If localStorage is unavailable, the setting just won't persist
      // across pages -- not worth failing the page over.
    }
  }, [isMuted]);

  useEffect(() => {
    try {
      localStorage.setItem(VOLUME_KEY, String(volume));
    } catch (error) {
      // Same as above -- fail silently.
    }
  }, [volume]);

  return { isMuted, setIsMuted, volume, setVolume };
}
