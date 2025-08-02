"use client";

import { useState, useCallback } from "react";
import type { MappingItem, DataType, MappingType } from "@/types";

export function useMappings() {
  const [mappings, setMappings] = useState<MappingItem[]>([]);

  const addMapping = useCallback(
    (
      type: MappingType,
      jsonKey: string,
      excelColumn?: string,
      manualValue?: string,
      dataType: DataType = "auto"
    ) => {
      if (!jsonKey.trim()) return false;
      if (type === "excel" && !excelColumn) return false;

      const newMapping: MappingItem = {
        id: `mapping_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        jsonKey,
        dataType:
          type === "excel"
            ? dataType
            : dataType === "auto"
            ? "string"
            : dataType,
        ...(type === "excel" ? { excelColumn } : { manualValue }),
      };

      setMappings((prev) => [...prev, newMapping]);
      return true;
    },
    []
  );

  const updateMapping = useCallback((updatedItem: MappingItem) => {
    if (!updatedItem || !updatedItem.id) return;

    setMappings((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  const deleteMapping = useCallback((id: string) => {
    setMappings((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setMappingsDirectly = useCallback((newMappings: MappingItem[]) => {
    // Filter out any invalid mappings
    const validMappings = newMappings.filter(
      (mapping): mapping is MappingItem =>
        !!(mapping && typeof mapping === "object" && mapping.id)
    );
    setMappings(validMappings);
  }, []);

  const reorderMappings = useCallback((oldIndex: number, newIndex: number) => {
    setMappings((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      return result;
    });
  }, []);

  const clearMappings = useCallback(() => {
    setMappings([]);
  }, []);

  return {
    mappings,
    addMapping,
    updateMapping,
    deleteMapping,
    setMappingsDirectly,
    reorderMappings,
    clearMappings,
  };
}
