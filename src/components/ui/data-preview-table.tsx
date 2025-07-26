"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileSpreadsheet } from "lucide-react"

interface DataPreviewTableProps {
    data: any[]
    headers: string[]
    maxRows?: number
    className?: string
}

export function DataPreviewTable({ data, headers, maxRows = 15, className }: DataPreviewTableProps) {
    const displayData = data.slice(0, maxRows)

    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No data available</p>
            </div>
        )
    }

    return (
        <div className={`space-y-4 ${className}`}>
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
                            {displayData.map((row, rowIndex) => (
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

            {data.length > maxRows && (
                <div className="text-center py-3 text-sm text-muted-foreground bg-muted/30 rounded-lg">
                    Showing {maxRows} of {data.length} rows • {headers.length} columns
                </div>
            )}
        </div>
    )
}
