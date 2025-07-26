import * as XLSX from "xlsx";
import type { ExcelSheet } from "@/types";

export class ExcelService {
  static async parseFile(file: File): Promise<ExcelSheet[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          const sheets: ExcelSheet[] = workbook.SheetNames.map((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length === 0) {
              return { name: sheetName, data: [], headers: [] };
            }

            const headers = jsonData[0] as string[];
            const data = jsonData.slice(1).map((row: any[]) => {
              const obj: Record<string, any> = {};
              headers.forEach((header, index) => {
                obj[header] = row[index];
              });
              return obj;
            });

            return { name: sheetName, data, headers };
          });

          resolve(sheets);
        } catch (error) {
          reject(new Error(`Failed to parse Excel file: ${error}`));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  }

  static validateFile(file: File): boolean {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    return validTypes.includes(file.type);
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  }
}
