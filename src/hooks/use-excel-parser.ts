"use client";

import { useState, useCallback } from "react";
import { ExcelService } from "@/services/excel-service";
import type { ExcelSheet } from "@/types";

export function useExcelParser() {
  const [sheets, setSheets] = useState<ExcelSheet[]>([]);
  const [currentSheet, setCurrentSheet] = useState<ExcelSheet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback(async (file: File) => {
    if (!ExcelService.validateFile(file)) {
      setError("Please select a valid Excel file (.xlsx or .xls)");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const parsedSheets = await ExcelService.parseFile(file);
      setSheets(parsedSheets);

      if (parsedSheets.length > 0) {
        setCurrentSheet(parsedSheets[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to parse Excel file"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectSheet = useCallback(
    (sheetName: string) => {
      const sheet = sheets.find((s) => s.name === sheetName);
      if (sheet) {
        setCurrentSheet(sheet);
      }
    },
    [sheets]
  );

  const reset = useCallback(() => {
    setSheets([]);
    setCurrentSheet(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    sheets,
    currentSheet,
    isLoading,
    error,
    parseFile,
    selectSheet,
    reset,
  };
}
