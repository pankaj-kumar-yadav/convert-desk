"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function usePersistentState<T>(
  key: string,
  defaultValue: T,
  options: {
    useUrl?: boolean;
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
) {
  const {
    useUrl = false,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;

    // Try to get from URL first if useUrl is enabled
    if (useUrl) {
      const urlValue = searchParams.get(key);
      if (urlValue) {
        try {
          return deserialize(urlValue);
        } catch {
          // Fall through to localStorage or default
        }
      }
    }

    // Try localStorage
    try {
      const item = localStorage.getItem(key);
      return item ? deserialize(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(key, serialize(valueToStore));
      }

      // Update URL if enabled
      if (useUrl && typeof window !== "undefined") {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, serialize(valueToStore));
        router.replace(`${window.location.pathname}?${params.toString()}`, {
          scroll: false,
        });
      }
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  };

  // Sync with URL changes
  useEffect(() => {
    if (useUrl) {
      const urlValue = searchParams.get(key);
      if (urlValue) {
        try {
          const parsedValue = deserialize(urlValue);
          setState(parsedValue);
        } catch {
          // Invalid URL value, ignore
        }
      }
    }
  }, [searchParams, key, useUrl, deserialize]);

  return [state, setValue] as const;
}
