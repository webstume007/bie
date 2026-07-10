'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useFormDraft<T extends Record<string, any>>(
  storageKey: string,
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);
  const [isDirty, setIsDirty] = useState(false);
  const isLoaded = useRef(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`draft_${storageKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setValues((prev) => ({ ...prev, ...parsed }));
        setIsDirty(true);
      }
    } catch (e) {
      console.error('Failed to load draft form values', e);
    }
    isLoaded.current = true;
  }, [storageKey]);

  // Save to localStorage on values change
  useEffect(() => {
    if (!isLoaded.current) return;
    try {
      // Check if values differ from initial values to establish dirty state
      const hasChanges = Object.keys(initialValues).some(
        (key) => values[key] !== initialValues[key]
      );
      
      setIsDirty(hasChanges);

      if (hasChanges) {
        localStorage.setItem(`draft_${storageKey}`, JSON.stringify(values));
      } else {
        localStorage.removeItem(`draft_${storageKey}`);
      }
    } catch (e) {
      console.error('Failed to save draft form values', e);
    }
  }, [values, storageKey, initialValues]);

  // Before unload handler (warn user on page exit/refresh if dirty)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // Generic input change handler
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }, []);

  // Update a single field manually
  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Clear draft from storage
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`draft_${storageKey}`);
      setValues(initialValues);
      setIsDirty(false);
    } catch (e) {
      console.error('Failed to clear draft', e);
    }
  }, [storageKey, initialValues]);

  return {
    values,
    setValues,
    handleChange,
    setFieldValue,
    clearDraft,
    isDirty,
  };
}
