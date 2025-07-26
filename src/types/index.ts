export type DataType = "string" | "number" | "boolean" | "auto";
export type MappingType = "excel" | "manual";

export interface MappingItem {
  id: string;
  type: MappingType;
  excelColumn?: string;
  jsonKey: string;
  dataType: DataType;
  manualValue?: string | number | boolean;
  autoIncrement?: boolean;
}

export interface ConversionData {
  timestamp: number;
  filename: string;
  sheet: string;
  data: any[];
}

export interface ExcelSheet {
  name: string;
  data: any[];
  headers: string[];
}

export interface ConversionConfig {
  startRow: number;
  endRow: number | null;
  mappings: MappingItem[];
}

export interface ColorTheme {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
}

export interface MemoryStatus {
  usage: number;
  showWarning: boolean;
  storageSize: string;
}
