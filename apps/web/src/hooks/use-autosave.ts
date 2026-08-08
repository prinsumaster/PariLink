import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * useAutosave - A robust hook for automatically saving and restoring form drafts.
 * Crucial for enterprise apps where operators might lose 30 minutes of data entry on a browser crash.
 */
export function useAutosave<T>(
  key: string,
  initialData: T,
  delay: number = 2000
) {
  const [data, setData] = useState<T>(initialData);
  const [isRestored, setIsRestored] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // 1. Restore from local storage on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem(`draft_${key}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        setData(parsed.data);
        setLastSaved(new Date(parsed.timestamp));
        setIsRestored(true);
      }
    } catch (error) {
      console.warn(`Failed to restore draft for ${key}`, error);
    }
  }, [key]);

  // 2. Debounced save to local storage
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          `draft_${key}`,
          JSON.stringify({
            data,
            timestamp: new Date().toISOString(),
          })
        );
        setLastSaved(new Date());
      } catch (error) {
        console.warn(`Failed to save draft for ${key}`, error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, key, delay]);

  // 3. Clear draft when form is successfully submitted
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`draft_${key}`);
      setLastSaved(null);
      setIsRestored(false);
    } catch (error) {
      console.warn(`Failed to clear draft for ${key}`, error);
    }
  }, [key]);

  return {
    data,
    setData,
    isRestored,
    lastSaved,
    clearDraft,
  };
}
