"use client";

import { useState, useCallback } from "react";
import type { ColorTheme } from "@/types";

const DEFAULT_THEMES: Record<string, ColorTheme> = {
  grayscale: {
    background: "#f8f9fa",
    foreground: "#212529",
    primary: "#343a40",
    secondary: "#adb5bd",
    accent: "#6c757d",
    border: "#dee2e6",
  },
  blue: {
    background: "#caf0f8",
    foreground: "#03045e",
    primary: "#0077b6",
    secondary: "#90e0ef",
    accent: "#0096c7",
    border: "#ade8f4",
  },
  dark: {
    background: "#212529",
    foreground: "#f8f9fa",
    primary: "#e9ecef",
    secondary: "#495057",
    accent: "#6c757d",
    border: "#343a40",
  },
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(
    DEFAULT_THEMES.grayscale
  );

  const applyTheme = useCallback((theme: ColorTheme) => {
    setCurrentTheme(theme);

    // Apply CSS custom properties
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}-custom`, value);
    });
  }, []);

  const applyPreset = useCallback(
    (presetName: string) => {
      const preset = DEFAULT_THEMES[presetName];
      if (preset) {
        applyTheme(preset);
      }
    },
    [applyTheme]
  );

  return {
    currentTheme,
    presets: DEFAULT_THEMES,
    applyTheme,
    applyPreset,
  };
}
