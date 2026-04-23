'use client';

import { useState, useEffect, useRef, useCallback, TextareaHTMLAttributes } from 'react';

interface DebouncedTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
}

/**
 * A textarea that debounces onChange calls to prevent excessive re-renders
 * when editing large content (HTML editors, product descriptions, etc.).
 */
export function DebouncedTextarea({ value, onChange, delay = 300, ...props }: DebouncedTextareaProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, delay);
  }, [onChange, delay]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return <textarea {...props} value={localValue} onChange={handleChange} />;
}
