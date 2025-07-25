"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileSpreadsheet, Eye } from "lucide-react"
import * as XLSX from "xlsx"

interface ExcelPreviewProps {
    file: File
    selectedSheet: string
    sheetData: any[] | null
    onSheetSelect: (sheetName: string, data: any[]) => void
    onSheetsLoaded: (sheetNames: string[]) => void
}

export default function ExcelPreview({
    file,
    selectedSheet,
    sheetData,
    onSheetSelect,
    onSheetsLoaded,
}: ExcelPreviewProps) {
    const [loading, setLoading] = useState(true)
    const [sheets, setSheets] = useState<string[]>([])
    const [headers, setHeaders] = useState<string[]>([])

    useEffect(() => {
        if (file) {
            parseExcel(file)
        }
    }, [file])

    const parseExcel = async (file: File) => {
        setLoading(true)

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: "array" })

                const sheetNames = workbook.SheetNames
                setSheets(sheetNames)
                onSheetsLoaded(sheetNames)

                if (sheetNames.length > 0) {
                    loadSheetData(workbook, sheetNames[0])
                }
            } catch (error) {
                console.error("Error parsing Excel file:", error)
                alert("Error parsing Excel file. Please try another file.")
            } finally {
                setLoading(false)
            }
        }

        reader.readAsArrayBuffer(file)
    }

    const loadSheetData = (workbook: XLSX.WorkBook, sheetName: string) => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length > 0) {
            // Extract headers from first row
            const headers = jsonData[0] as string[]
            setHeaders(headers)

            // Convert to array of objects with headers as keys
            const data = []
            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i] as any[]
                const obj: Record<string, any> = {}

                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = row[j]
                }

                data.push(obj)
            }

            onSheetSelect(sheetName, data)
        }
    }

    if (loading) {
        return (
            <Card className="glass-card">
                <CardContent className="flex justify-center items-center py-12">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                        <div>
                            <p className="font-medium">Loading Excel data...</p>
                            <p className="text-sm text-muted-foreground">Parsing {file.name}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="glass-card hover-lift">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Eye className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Data Preview</CardTitle>
                            <CardDescription>Preview of {selectedSheet} worksheet</CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="gap-1">
                        <FileSpreadsheet className="h-3 w-3" />
                        {sheetData?.length || 0} rows
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {sheetData && sheetData.length > 0 ? (
                    <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden bg-background">
                            <div className="overflow-auto max-h-[500px] custom-scrollbar">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            {headers.map((header, index) => (
                                                <TableHead
                                                    key={index}
                                                    className="font-semibold text-foreground whitespace-nowrap min-w-[120px] sticky top-0 bg-muted/80 backdrop-blur-sm"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                                        {header}
                                                    </div>
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sheetData.slice(0, 15).map((row, rowIndex) => (
                                            <TableRow key={rowIndex} className="hover:bg-muted/30">
                                                {headers.map((header, colIndex) => (
                                                    <TableCell key={colIndex} className="whitespace-nowrap min-w-[120px] font-mono text-sm">
                                                        <div className="max-w-[200px] truncate" title={String(row[header] || "")}>
                                                            {row[header] !== undefined ? (
                                                                String(row[header])
                                                            ) : (
                                                                <span className="text-muted-foreground italic">empty</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {sheetData.length > 15 && (
                            <div className="text-center py-3 text-sm text-muted-foreground bg-muted/30 rounded-lg">
                                Showing 15 of {sheetData.length} rows • {headers.length} columns
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No data available in this worksheet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
