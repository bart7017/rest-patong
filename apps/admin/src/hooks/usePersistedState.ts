'use client';

import { useState, useEffect } from 'react';

export function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      } else {
        // Force save default value to localStorage if not present
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
        setState(defaultValue);
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      // On error, reset to default and save it
      window.localStorage.setItem(key, JSON.stringify(defaultValue));
      setState(defaultValue);
    } finally {
      setIsLoaded(true);
    }
  }, [key, defaultValue]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [state, setValue, isLoaded] as const;
}