import { useEffect } from 'react';
import useLocalStorageState from './useLocalStorageState';

export default function useDarkMode() {
  // Initialize the dark mode state with the user's system theme.
  const mediaQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );
  const [darkMode, setDarkMode] = useLocalStorageState(
    'dark-mode',
    mediaQueryList.matches
  );

  // Set the dark mode class on the html element when the dark mode state changes.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Watch for changes in the user's system theme and update the dark mode state.
  useEffect(() => {
    const handleChange = (e: MediaQueryListEvent) =>
      setDarkMode(e.matches);
    mediaQueryList.addEventListener('change', handleChange);
    return () =>
      mediaQueryList.removeEventListener('change', handleChange);
  }, [mediaQueryList, setDarkMode]);

  // Synchronize dark mode when there are multiple tabs open.
  useEffect(() => {
    window.addEventListener('storage', (e) => {
      if (e.key === 'dark-mode' && e.newValue) {
        const parseValue = JSON.parse(e.newValue) as boolean;
        setDarkMode(parseValue);
      }
    });
  }, [setDarkMode]);

  return {
    darkMode: darkMode,
    toggleDarkMode: () => {
      setDarkMode(!darkMode);
    },
  };
}
