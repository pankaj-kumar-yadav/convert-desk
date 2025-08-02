import type { ConversionConfig } from "@/types";

export const ConversionService = {
  convertData(sheetData: any[], config: ConversionConfig): any[] {
    const { startRow, endRow, mappings } = config;
    const autoIncrementCounters: Record<string, number> = {};

    // Initialize auto-increment counters
    mappings.forEach((mapping) => {
      if (mapping.autoIncrement && mapping.type === "manual") {
        autoIncrementCounters[mapping.id] = 1;
      }
    });

    return sheetData
      .map((row: any, index: number) => {
        if (index < startRow - 1) return null;
        if (endRow !== null && index >= endRow) return null;

        const newRow: Record<string, any> = {};

        mappings.forEach((mapping) => {
          if (mapping.type === "excel" && mapping.excelColumn) {
            newRow[mapping.jsonKey] = processExcelValue(
              row[mapping.excelColumn],
              mapping.dataType
            );
          } else if (mapping.type === "manual") {
            newRow[mapping.jsonKey] = mapping.autoIncrement
              ? autoIncrementCounters[mapping.id]++
              : mapping.manualValue;
          }
        });

        return newRow;
      })
      .filter(Boolean);
  },
};

// Helpers
function processExcelValue(value: any, dataType: string): any {
  switch (dataType) {
    case "string":
      return String(value ?? "");
    case "number":
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    case "boolean":
      if (typeof value === "string") {
        const lower = value.toLowerCase();
        return lower === "true" || lower === "yes" || lower === "1";
      }
      return Boolean(value);
    case "auto":
    default:
      return inferType(value);
  }
}

function inferType(value: any): any {
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower === "true" || lower === "false") {
      return lower === "true";
    }
    if (!isNaN(Number(value)) && value.trim() !== "") {
      return Number(value);
    }
  }
  return value;
}
