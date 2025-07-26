"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, PlusCircle } from "lucide-react"
import type { DataType, MappingType } from "@/types"

interface MappingFormProps {
    columns: string[]
    onAddMapping: (
        type: MappingType,
        jsonKey: string,
        excelColumn?: string,
        manualValue?: string,
        dataType?: DataType,
    ) => boolean
}

export function MappingForm({ columns, onAddMapping }: MappingFormProps) {
    const [jsonKey, setJsonKey] = useState("")
    const [mappingType, setMappingType] = useState<MappingType>("excel")
    const [excelColumn, setExcelColumn] = useState("")
    const [manualValue, setManualValue] = useState("")
    const [dataType, setDataType] = useState<DataType>("auto")

    const handleSubmit = () => {
        const success = onAddMapping(
            mappingType,
            jsonKey,
            mappingType === "excel" ? excelColumn : undefined,
            mappingType === "manual" ? manualValue : undefined,
            dataType,
        )

        if (success) {
            // Reset form
            setJsonKey("")
            setExcelColumn("")
            setManualValue("")
            setDataType("auto")
        }
    }

    const isValid = jsonKey.trim() && (mappingType === "manual" || excelColumn)

    return (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-dashed">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4 text-primary" />
                    <Label className="font-medium">Add New Mapping</Label>
                </div>
                <Select value={mappingType} onValueChange={(value: MappingType) => setMappingType(value)}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="excel">Excel Column</SelectItem>
                        <SelectItem value="manual">Manual Value</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {mappingType === "excel" ? (
                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Excel Column</Label>
                        <Select value={excelColumn} onValueChange={setExcelColumn}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                                {columns.map((column) => (
                                    <SelectItem key={column} value={column}>
                                        {column}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Manual Value</Label>
                        <Input value={manualValue} onChange={(e) => setManualValue(e.target.value)} placeholder="Enter value" />
                    </div>
                )}

                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">JSON Key</Label>
                    <Input value={jsonKey} onChange={(e) => setJsonKey(e.target.value)} placeholder="key_name" />
                </div>

                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Data Type</Label>
                    <Select value={dataType} onValueChange={(value: DataType) => setDataType(value)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {mappingType === "excel" && <SelectItem value="auto">Auto</SelectItem>}
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-end">
                    <Button onClick={handleSubmit} disabled={!isValid} className="w-full hover-glow">
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                    </Button>
                </div>
            </div>
        </div>
    )
}
