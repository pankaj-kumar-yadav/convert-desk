"use client";

export function useLocalStorage() {
  // Get item from local storage
  const getFromLocalStorage = <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  };

  // Save item to local storage
  const saveToLocalStorage = <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving item ${key} to localStorage:`, error);

      // If we hit the storage limit, show a warning
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        alert(
          "Local storage is full. Please clear some data before saving more."
        );
      }
    }
  };

  // Remove item from local storage
  const removeFromLocalStorage = (key: string): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
    }
  };

  // Get the size of local storage in MB
  const getLocalStorageSize = (): string => {
    if (typeof window === "undefined") return "0";

    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const value = localStorage.getItem(key);
      if (value) {
        total += key.length + value.length;
      }
    }

    // Convert to MB
    return (total / 1024 / 1024).toFixed(2);
  };

  return {
    getFromLocalStorage,
    saveToLocalStorage,
    removeFromLocalStorage,
    getLocalStorageSize,
  };
}
