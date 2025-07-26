"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Trash2, GripVertical, Database, Settings2, FileSpreadsheet, PlusCircle } from "lucide-react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { DataType, MappingType, MappingItem } from "@/types"

interface KeyMappingProps {
    columns: string[]
    mappings: MappingItem[]
    onMappingsChange: (mappings: MappingItem[]) => void
}

interface SortableItemProps {
    item: MappingItem
    onUpdate: (item: MappingItem) => void
    onDelete: (id: string) => void
    columns: string[]
}

function SortableItem({ item, onUpdate, onDelete, columns }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item?.id || `fallback-${Date.now()}`,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    // Safety check - if item is undefined, render nothing
    if (!item || !item.id) {
        return null
    }

    const handleDataTypeChange = (dataType: DataType) => {
        onUpdate({ ...item, dataType })
    }

    const handleManualValueChange = (value: string) => {
        let convertedValue: string | number | boolean = value

        if (item.dataType === "number") {
            convertedValue = Number(value) || 0
        } else if (item.dataType === "boolean") {
            convertedValue = value.toLowerCase() === "true"
        }

        onUpdate({ ...item, manualValue: convertedValue })
    }

    const handleAutoIncrementChange = (checked: boolean) => {
        onUpdate({ ...item, autoIncrement: checked })
    }

    const handleExcelColumnChange = (value: string) => {
        onUpdate({ ...item, excelColumn: value })
    }

    const handleJsonKeyChange = (value: string) => {
        onUpdate({ ...item, jsonKey: value })
    }

    return (
        <div ref={setNodeRef} style={style} className={`sortable-item ${isDragging ? "dragging" : ""}`}>
            <Card className="hover-lift">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab hover:cursor-grabbing p-1 hover:bg-muted rounded"
                        >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Badge variant={item.type === "excel" ? "default" : "secondary"} className="shrink-0">
                                {item.type === "excel" ? (
                                    <>
                                        <FileSpreadsheet className="h-3 w-3 mr-1" /> Excel
                                    </>
                                ) : (
                                    <>
                                        <Settings2 className="h-3 w-3 mr-1" /> Manual
                                    </>
                                )}
                            </Badge>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 flex-1 min-w-0">
                                {item.type === "excel" ? (
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Source Column</Label>
                                        <Select value={item.excelColumn || ""} onValueChange={handleExcelColumnChange}>
                                            <SelectTrigger className="h-9">
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
                                        <Input
                                            value={String(item.manualValue || "")}
                                            onChange={(e) => handleManualValueChange(e.target.value)}
                                            placeholder="Enter value"
                                            className="h-9"
                                        />
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">JSON Key</Label>
                                    <Input
                                        value={item.jsonKey || ""}
                                        onChange={(e) => handleJsonKeyChange(e.target.value)}
                                        placeholder="key_name"
                                        className="h-9"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Data Type</Label>
                                    <Select value={item.dataType} onValueChange={handleDataTypeChange}>
                                        <SelectTrigger className="h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {item.type === "excel" && <SelectItem value="auto">Auto</SelectItem>}
                                            <SelectItem value="string">String</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="boolean">Boolean</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    {item.type === "manual" && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`auto-${item.id}`}
                                                            checked={item.autoIncrement || false}
                                                            onCheckedChange={handleAutoIncrementChange}
                                                        />
                                                        <Label htmlFor={`auto-${item.id}`} className="text-xs cursor-pointer">
                                                            Auto++
                                                        </Label>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Auto-increment this value</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(item.id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function MappingForm({
    columns,
    onAddMapping,
}: {
    columns: string[]
    onAddMapping: (
        type: MappingType,
        jsonKey: string,
        excelColumn?: string,
        manualValue?: string,
        dataType?: DataType,
    ) => boolean
}) {
    const [newJsonKey, setNewJsonKey] = useState("")
    const [newMappingType, setNewMappingType] = useState<MappingType>("excel")
    const [newExcelColumn, setNewExcelColumn] = useState("")
    const [newManualValue, setNewManualValue] = useState("")
    const [newDataType, setNewDataType] = useState<DataType>("auto")

    const handleAddMapping = () => {
        const success = onAddMapping(
            newMappingType,
            newJsonKey,
            newMappingType === "excel" ? newExcelColumn : undefined,
            newMappingType === "manual" ? newManualValue : undefined,
            newDataType,
        )

        if (success) {
            // Reset form
            setNewJsonKey("")
            setNewExcelColumn("")
            setNewManualValue("")
            setNewDataType("auto")
        }
    }

    const isValid = newJsonKey.trim() && (newMappingType === "manual" || newExcelColumn)

    return (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-dashed">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4 text-primary" />
                    <Label className="font-medium">Add New Mapping</Label>
                </div>
                <Select value={newMappingType} onValueChange={(value: MappingType) => setNewMappingType(value)}>
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
                {newMappingType === "excel" ? (
                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Excel Column</Label>
                        <Select value={newExcelColumn} onValueChange={setNewExcelColumn}>
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
                        <Input
                            value={newManualValue}
                            onChange={(e) => setNewManualValue(e.target.value)}
                            placeholder="Enter value"
                        />
                    </div>
                )}

                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">JSON Key</Label>
                    <Input value={newJsonKey} onChange={(e) => setNewJsonKey(e.target.value)} placeholder="key_name" />
                </div>

                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Data Type</Label>
                    <Select value={newDataType} onValueChange={(value: DataType) => setNewDataType(value)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {newMappingType === "excel" && <SelectItem value="auto">Auto</SelectItem>}
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-end">
                    <Button onClick={handleAddMapping} disabled={!isValid} className="w-full hover-glow">
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function KeyMapping({ columns, mappings, onMappingsChange }: KeyMappingProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    // Filter out any undefined or invalid mappings
    const validMappings = mappings.filter(
        (mapping): mapping is MappingItem => mapping && typeof mapping === "object" && mapping.id,
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = validMappings.findIndex((item) => item.id === active.id)
            const newIndex = validMappings.findIndex((item) => item.id === over.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                onMappingsChange(arrayMove(validMappings, oldIndex, newIndex))
            }
        }
    }

    const handleAddMapping = (
        type: MappingType,
        jsonKey: string,
        excelColumn?: string,
        manualValue?: string,
        dataType: DataType = "auto",
    ): boolean => {
        if (!jsonKey.trim()) return false
        if (type === "excel" && !excelColumn) return false

        const newMapping: MappingItem = {
            id: `mapping_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            jsonKey,
            dataType: type === "excel" ? dataType : dataType === "auto" ? "string" : dataType,
            ...(type === "excel" ? { excelColumn } : { manualValue }),
        }

        onMappingsChange([...validMappings, newMapping])
        return true
    }

    const handleUpdateMapping = (updatedItem: MappingItem) => {
        if (!updatedItem || !updatedItem.id) return

        onMappingsChange(validMappings.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    }

    const handleDeleteMapping = (id: string) => {
        onMappingsChange(validMappings.filter((item) => item.id !== id))
    }

    return (
        <div className="space-y-6">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">JSON Key Mapping</CardTitle>
                            <CardDescription>Map Excel columns or create manual values for your JSON output</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add new mapping form */}
                    <MappingForm columns={columns} onAddMapping={handleAddMapping} />

                    <Separator />

                    {/* Existing mappings */}
                    {validMappings.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="font-medium">Current Mappings ({validMappings.length})</Label>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <GripVertical className="h-3 w-3" />
                                    Drag to reorder
                                </div>
                            </div>

                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={validMappings.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-3">
                                        {validMappings.map((item) => (
                                            <SortableItem
                                                key={item.id}
                                                item={item}
                                                onUpdate={handleUpdateMapping}
                                                onDelete={handleDeleteMapping}
                                                columns={columns}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No mappings created yet</p>
                            <p className="text-sm">Add your first mapping above to get started</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
