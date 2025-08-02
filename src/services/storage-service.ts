import type { ConversionData } from "@/types";

const CONVERSION_PREFIX = "conversion_";
const CLEAR_WARNING_KEY = "clearWarningHideUntil";
const NODEJS_BANNER_KEY = "nodejs-banner-dismissed";

export const StorageService = {
  saveConversion(id: string, data: ConversionData): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(id, JSON.stringify(data));
    } catch (error: any) {
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        throw new Error("Storage quota exceeded. Please clear some data.");
      }
      throw new Error(`Failed to save conversion: ${error}`);
    }
  },

  getConversion(id: string): ConversionData | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(id);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error retrieving conversion ${id}:`, error);
      return null;
    }
  },

  getAllConversions(): Record<string, ConversionData> {
    if (typeof window === "undefined") return {};
    const conversions: Record<string, ConversionData> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CONVERSION_PREFIX)) {
        const data = StorageService.getConversion(key);
        if (data) {
          conversions[key] = data;
        }
      }
    }

    return sortConversionsByDate(conversions);
  },

  deleteConversion(id: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(id);
  },

  clearAllConversions(): void {
    const keys = Object.keys(StorageService.getAllConversions());
    keys.forEach((key) => StorageService.deleteConversion(key));
  },

  getStorageSize(): string {
    if (typeof window === "undefined") return "0.00";
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key);
      if (value) {
        total += key.length + value.length;
      }
    }
    return (total / 1024 / 1024).toFixed(2);
  },

  setClearWarningDismissed(): void {
    if (typeof window === "undefined") return;
    const thirtyDaysFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem(CLEAR_WARNING_KEY, thirtyDaysFromNow.toString());
  },

  isClearWarningDismissed(): boolean {
    if (typeof window === "undefined") return false;
    const dismissedTime = localStorage.getItem(CLEAR_WARNING_KEY);
    if (!dismissedTime) return false;
    const hideUntil = Number.parseInt(dismissedTime);
    return Date.now() < hideUntil;
  },

  setNodejsBannerDismissed(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(NODEJS_BANNER_KEY, new Date().toISOString());
  },

  isNodejsBannerDismissed(): boolean {
    if (typeof window === "undefined") return false;
    const dismissedTime = localStorage.getItem(NODEJS_BANNER_KEY);
    if (!dismissedTime) return false;

    const dismissedDate = new Date(dismissedTime);
    const now = new Date();
    const hoursDiff =
      (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  },
};

// Sort conversions by timestamp (newest first)
function sortConversionsByDate(
  conversions: Record<string, ConversionData>
): Record<string, ConversionData> {
  const sortedKeys = Object.keys(conversions).sort(
    (a, b) => conversions[b].timestamp - conversions[a].timestamp
  );

  const sorted: Record<string, ConversionData> = {};
  sortedKeys.forEach((key) => {
    sorted[key] = conversions[key];
  });

  return sorted;
}
