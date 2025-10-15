import type { ConversionConfig } from "@/types";

export const ConversionService = {
  convertData(sheetData: any[], config: ConversionConfig): any[] {
    const {
      startRow,
      endRow,
      mappings,
      preserveEmpty = true, // ✅ new flag
    } = config;

    const autoIncrementCounters: Record<string, number> = {};

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
          let value: any = "";

          if (mapping.type === "excel" && mapping.excelColumn) {
            value = row?.[mapping.excelColumn];
            if (
              !preserveEmpty &&
              (value === undefined || value === null || value === "")
            )
              return;

            newRow[mapping.jsonKey] = processExcelValue(
              value === undefined || value === null ? "" : value,
              mapping.dataType
            );
          } else if (mapping.type === "manual") {
            const manualVal = mapping.autoIncrement
              ? autoIncrementCounters[mapping.id]++
              : mapping.manualValue ?? "";

            if (!preserveEmpty && manualVal === "") return;

            newRow[mapping.jsonKey] = manualVal;
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
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower === "true" || lower === "false") return lower === "true";
    if (!isNaN(Number(value)) && value.trim() !== "") return Number(value);
  }
  return value;
}
