"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings2, RowsIcon } from "lucide-react"

interface AdvancedSettingsProps {
    startRow: number
    endRow: number | null
    totalRows: number
    onStartRowChange: (value: number) => void
    onEndRowChange: (value: number | null) => void
}

export default function AdvancedSettings({
    startRow,
    endRow,
    totalRows,
    onStartRowChange,
    onEndRowChange,
}: AdvancedSettingsProps) {
    const handleStartRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value)
        if (!isNaN(value) && value >= 1 && value <= totalRows) {
            onStartRowChange(value)
        }
    }

    const handleEndRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? null : Number.parseInt(e.target.value)
        if (value === null || (!isNaN(value) && value >= startRow && value <= totalRows)) {
            onEndRowChange(value)
        }
    }

    const handleStartSliderChange = (value: number[]) => {
        onStartRowChange(value[0])
    }

    const handleEndSliderChange = (value: number[]) => {
        onEndRowChange(value[0])
    }

    const selectedRows = endRow ? endRow - startRow + 1 : totalRows - startRow + 1

    return (
        <Card className="glass-card hover-lift">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Settings2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Row Range Settings</CardTitle>
                        <CardDescription>Configure which rows to include in the conversion</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="startRow" className="font-medium">
                                Start Row
                            </Label>
                            <Badge variant="outline" className="gap-1">
                                <RowsIcon className="h-3 w-3" />
                                Row {startRow}
                            </Badge>
                        </div>
                        <div className="space-y-3">
                            <Input
                                id="startRow"
                                type="number"
                                min={1}
                                max={totalRows}
                                value={startRow}
                                onChange={handleStartRowChange}
                                className="w-24 modern-input"
                            />
                            <Slider
                                value={[startRow]}
                                min={1}
                                max={totalRows || 100}
                                step={1}
                                onValueChange={handleStartSliderChange}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="endRow" className="font-medium">
                                End Row
                            </Label>
                            <Badge variant="outline" className="gap-1">
                                <RowsIcon className="h-3 w-3" />
                                {endRow ? `Row ${endRow}` : "All"}
                            </Badge>
                        </div>
                        <div className="space-y-3">
                            <Input
                                id="endRow"
                                type="number"
                                min={startRow}
                                max={totalRows}
                                value={endRow === null ? "" : endRow}
                                onChange={handleEndRowChange}
                                placeholder="All rows"
                                className="w-24 modern-input"
                            />
                            <Slider
                                value={[endRow || totalRows]}
                                min={startRow}
                                max={totalRows || 100}
                                step={1}
                                onValueChange={handleEndSliderChange}
                                disabled={!endRow}
                                className="flex-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Selection Summary:</span>
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary">Total: {totalRows} rows</Badge>
                            <Badge variant="default">Selected: {selectedRows} rows</Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
