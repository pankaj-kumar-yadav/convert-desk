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

type DataType = "string" | "number" | "boolean" | "auto"
type MappingType = "excel" | "manual"

interface MappingItem {
    id: string
    type: MappingType
    excelColumn?: string
    jsonKey: string
    dataType: DataType
    manualValue?: string | number | boolean
    autoIncrement?: boolean
}

interface KeyMappingProps {
    columns: string[]
    mappings: MappingItem[]
    onMappingsChange: (mappings: MappingItem[]) => void
}

function SortableItem({
    item,
    onUpdate,
    onDelete,
    columns,
}: {
    item: MappingItem
    onUpdate: (item: MappingItem) => void
    onDelete: (id: string) => void
    columns: string[]
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
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
                                        <Select
                                            value={item.excelColumn || ""}
                                            onValueChange={(value) => onUpdate({ ...item, excelColumn: value })}
                                        >
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
                                        value={item.jsonKey}
                                        onChange={(e) => onUpdate({ ...item, jsonKey: e.target.value })}
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

export default function KeyMapping({ columns, mappings, onMappingsChange }: KeyMappingProps) {
    const [newJsonKey, setNewJsonKey] = useState("")
    const [newMappingType, setNewMappingType] = useState<MappingType>("excel")
    const [newExcelColumn, setNewExcelColumn] = useState("")
    const [newManualValue, setNewManualValue] = useState("")
    const [newDataType, setNewDataType] = useState<DataType>("auto")

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = mappings.findIndex((item) => item.id === active.id)
            const newIndex = mappings.findIndex((item) => item.id === over.id)

            onMappingsChange(arrayMove(mappings, oldIndex, newIndex))
        }
    }

    const handleAddMapping = () => {
        if (!newJsonKey.trim()) return
        if (newMappingType === "excel" && !newExcelColumn) return

        const newMapping: MappingItem = {
            id: `mapping_${Date.now()}`,
            type: newMappingType,
            jsonKey: newJsonKey,
            dataType: newMappingType === "excel" ? newDataType : newDataType === "auto" ? "string" : newDataType,
            ...(newMappingType === "excel" ? { excelColumn: newExcelColumn } : { manualValue: newManualValue }),
        }

        onMappingsChange([...mappings, newMapping])

        // Reset form
        setNewJsonKey("")
        setNewExcelColumn("")
        setNewManualValue("")
        setNewDataType("auto")
    }

    const handleUpdateMapping = (updatedItem: MappingItem) => {
        onMappingsChange(mappings.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    }

    const handleDeleteMapping = (id: string) => {
        onMappingsChange(mappings.filter((item) => item.id !== id))
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
                                <Button
                                    onClick={handleAddMapping}
                                    disabled={!newJsonKey.trim() || (newMappingType === "excel" && !newExcelColumn)}
                                    className="w-full hover-glow"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Existing mappings */}
                    {mappings.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="font-medium">Current Mappings ({mappings.length})</Label>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <GripVertical className="h-3 w-3" />
                                    Drag to reorder
                                </div>
                            </div>

                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={mappings.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-3">
                                        {mappings.map((item) => (
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
