"use client";

import { useState, useCallback } from "react";
import { ConversionService } from "@/services/conversion-service";
import { StorageService } from "@/services/storage-service";
import type { ConversionConfig, ConversionData } from "@/types";

export function useConversion() {
  const [convertedData, setConvertedData] = useState<any[] | null>(null);
  const [conversionId, setConversionId] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);

  const convert = useCallback(
    async (
      sheetData: any[],
      config: ConversionConfig,
      filename: string,
      sheetName: string
    ) => {
      setIsConverting(true);

      try {
        const result = ConversionService.convertData(sheetData, config);
        setConvertedData(result);

        // Save to storage
        const id = `conversion_${Date.now()}`;
        const conversionData: ConversionData = {
          timestamp: Date.now(),
          filename,
          sheet: sheetName,
          data: result,
        };

        StorageService.saveConversion(id, conversionData);
        setConversionId(id);

        return result;
      } catch (error) {
        throw new Error(`Conversion failed: ${error}`);
      } finally {
        setIsConverting(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setConvertedData(null);
    setConversionId("");
  }, []);

  return {
    convertedData,
    conversionId,
    isConverting,
    convert,
    reset,
  };
}
