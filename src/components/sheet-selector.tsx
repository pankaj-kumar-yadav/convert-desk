"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SheetSelectorProps {
    sheets: string[]
    selectedSheet: string
    onSheetChange: (sheet: string) => void
    fileName?: string
    isLoading?: boolean
}

export default function SheetSelector({
    sheets,
    selectedSheet,
    onSheetChange,
    fileName,
    isLoading = false,
}: SheetSelectorProps) {
    return (
        <Card className="glass-card hover-lift">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <FileSpreadsheet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Select Worksheet</CardTitle>
                        <CardDescription>
                            {fileName ? `Choose a sheet from ${fileName}` : "Choose a worksheet to preview"}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Select value={selectedSheet} onValueChange={onSheetChange} disabled={isLoading}>
                        <SelectTrigger className={`w-full h-11 modern-input ${isLoading ? "opacity-50" : ""}`}>
                            <SelectValue placeholder={isLoading ? "Loading worksheets..." : "Select a worksheet"} />
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </SelectTrigger>
                        <SelectContent>
                            {sheets.map((sheet) => (
                                <SelectItem key={sheet} value={sheet} className="cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-2 h-2 rounded-full ${sheet === selectedSheet ? "bg-primary" : "bg-muted-foreground/30"}`}
                                        />
                                        {sheet}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {sheets.length > 0 && (
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                                {sheets.length} worksheet{sheets.length !== 1 ? "s" : ""} available
                            </span>
                            {selectedSheet && (
                                <Badge variant="outline" className="text-xs">
                                    Current: {selectedSheet}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
