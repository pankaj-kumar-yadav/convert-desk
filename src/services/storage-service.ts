import type { ConversionData } from "@/types";

export class StorageService {
  private static readonly CONVERSION_PREFIX = "conversion_";
  private static readonly CLEAR_WARNING_KEY = "clearWarningHideUntil";
  private static readonly NODEJS_BANNER_KEY = "nodejs-banner-dismissed";

  static saveConversion(id: string, data: ConversionData): void {
    try {
      localStorage.setItem(id, JSON.stringify(data));
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        throw new Error("Storage quota exceeded. Please clear some data.");
      }
      throw new Error(`Failed to save conversion: ${error}`);
    }
  }

  static getConversion(id: string): ConversionData | null {
    try {
      const item = localStorage.getItem(id);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error retrieving conversion ${id}:`, error);
      return null;
    }
  }

  static getAllConversions(): Record<string, ConversionData> {
    const conversions: Record<string, ConversionData> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.CONVERSION_PREFIX)) {
        const data = this.getConversion(key);
        if (data) {
          conversions[key] = data;
        }
      }
    }

    return this.sortConversionsByDate(conversions);
  }

  static deleteConversion(id: string): void {
    localStorage.removeItem(id);
  }

  static clearAllConversions(): void {
    const keys = Object.keys(this.getAllConversions());
    keys.forEach((key) => this.deleteConversion(key));
  }

  static getStorageSize(): string {
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
  }

  static setClearWarningDismissed(): void {
    const thirtyDaysFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem(this.CLEAR_WARNING_KEY, thirtyDaysFromNow.toString());
  }

  static isClearWarningDismissed(): boolean {
    const dismissedTime = localStorage.getItem(this.CLEAR_WARNING_KEY);
    if (!dismissedTime) return false;

    const hideUntil = Number.parseInt(dismissedTime);
    return Date.now() < hideUntil;
  }

  static setNodejsBannerDismissed(): void {
    localStorage.setItem(this.NODEJS_BANNER_KEY, new Date().toISOString());
  }

  static isNodejsBannerDismissed(): boolean {
    const dismissedTime = localStorage.getItem(this.NODEJS_BANNER_KEY);
    if (!dismissedTime) return false;

    const dismissedDate = new Date(dismissedTime);
    const now = new Date();
    const hoursDiff =
      (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  }

  private static sortConversionsByDate(
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
}
