"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Download, Eye, Settings2, Sparkles, ArrowLeft, FileJson, Zap } from "lucide-react"
import FileUploader from "@/components/file-uploader"
import ExcelPreview from "@/components/excel-preview"
import SheetSelector from "@/components/sheet-selector"
import AdvancedSettings from "@/components/advanced-settings"
import ColorConfig from "@/components/color-config"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useMemoryWarning } from "@/hooks/use-memory-warning"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import MemoryStatus from "@/components/memory-status"
import KeyMapping from "@/components/kpi-mapping"

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

export default function ConverterPage() {
    const [file, setFile] = useState<File | null>(null)
    const [sheetData, setSheetData] = useState<any>(null)
    const [selectedSheet, setSelectedSheet] = useState<string>("")
    const [sheets, setSheets] = useState<string[]>([])
    const [startRow, setStartRow] = useState<number>(1)
    const [endRow, setEndRow] = useState<number | null>(null)
    const [mappings, setMappings] = useState<MappingItem[]>([])
    const [convertedData, setConvertedData] = useState<any[] | null>(null)
    const [conversionId, setConversionId] = useState<string>("")
    const [copied, setCopied] = useState(false)
    const [customColors, setCustomColors] = useState<Record<string, string>>({})
    const { showMemoryWarning, memoryUsage } = useMemoryWarning()
    const { saveToLocalStorage, getLocalStorageSize } = useLocalStorage()
    const searchParams = useSearchParams()
    const router = useRouter()

    // Add this after the existing useState declarations
    useEffect(() => {
        // Check for sheet parameter in URL on component mount
        const sheetFromUrl = searchParams.get("sheet")
        if (sheetFromUrl && sheets.includes(sheetFromUrl)) {
            setSelectedSheet(sheetFromUrl)
        }
    }, [searchParams, sheets])

    // Reset state when file changes
    useEffect(() => {
        if (file) {
            setSheetData(null)
            setSelectedSheet("")
            setSheets([])
            setStartRow(1)
            setEndRow(null)
            setMappings([])
            setConvertedData(null)
            setConversionId("")
        }
    }, [file])

    const handleFileUpload = (uploadedFile: File) => {
        setFile(uploadedFile)
    }

    // Update the handleSheetSelect function to update URL
    const handleSheetSelect = (sheetName: string, data: any) => {
        setSelectedSheet(sheetName)
        setSheetData(data)

        // Update URL with selected sheet
        const params = new URLSearchParams(searchParams.toString())
        params.set("sheet", sheetName)
        router.replace(`/converter?${params.toString()}`, { scroll: false })
    }

    const handleSheetsLoaded = (sheetNames: string[]) => {
        setSheets(sheetNames)
        if (sheetNames.length > 0) {
            setSelectedSheet(sheetNames[0])
        }
    }

    const handleConvert = () => {
        if (!sheetData || !selectedSheet) return

        // Apply mappings
        const autoIncrementCounters: Record<string, number> = {}

        // Initialize counters for auto-increment fields
        mappings.forEach((mapping) => {
            if (mapping.autoIncrement && mapping.type === "manual") {
                autoIncrementCounters[mapping.id] = 1
            }
        })

        const converted = sheetData
            .map((row: any, index: number) => {
                // Skip rows before startRow
                if (index < startRow - 1) return null

                // Stop at endRow if specified
                if (endRow !== null && index >= endRow) return null

                const newRow: Record<string, any> = {}

                // Apply mappings
                mappings.forEach((mapping) => {
                    if (mapping.type === "excel" && mapping.excelColumn) {
                        // Excel column mapping
                        let value = row[mapping.excelColumn]

                        switch (mapping.dataType) {
                            case "string":
                                value = String(value ?? "")
                                break
                            case "number":
                                value = Number(value)
                                if (isNaN(value)) value = 0
                                break
                            case "boolean":
                                if (typeof value === "string") {
                                    value = value.toLowerCase()
                                    value = value === "true" || value === "yes" || value === "1"
                                } else {
                                    value = Boolean(value)
                                }
                                break
                            case "auto":
                            default:
                                // Try to infer the type
                                if (typeof value === "string") {
                                    if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
                                        value = value.toLowerCase() === "true"
                                    } else if (!isNaN(Number(value)) && value.trim() !== "") {
                                        value = Number(value)
                                    }
                                }
                                break
                        }

                        newRow[mapping.jsonKey] = value
                    } else if (mapping.type === "manual") {
                        // Manual value mapping
                        if (mapping.autoIncrement) {
                            newRow[mapping.jsonKey] = autoIncrementCounters[mapping.id]++
                        } else {
                            newRow[mapping.jsonKey] = mapping.manualValue
                        }
                    }
                })

                return newRow
            })
            .filter(Boolean)

        setConvertedData(converted)

        // Generate a unique ID for this conversion
        const id = `conversion_${Date.now()}`
        setConversionId(id)

        // Save to local storage
        saveToLocalStorage(id, {
            timestamp: Date.now(),
            filename: file?.name || "unknown",
            sheet: selectedSheet,
            data: converted,
        })
    }

    const handleClearLocalStorage = () => {
        localStorage.clear()
        alert("Local storage has been cleared")
    }

    const handleCopyJson = () => {
        if (!convertedData) return

        const jsonString = JSON.stringify(convertedData, null, 2)
        navigator.clipboard.writeText(jsonString)

        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleColorChange = (colors: Record<string, string>) => {
        setCustomColors(colors)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Modern Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">XLSX to JSON</h1>
                            <p className="text-xs text-muted-foreground">Advanced Converter</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ColorConfig onColorChange={handleColorChange} />
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl">
                {/* Memory Warning */}
                <MemoryStatus showNodejsBanner={true} />

                {/* File Upload Section */}
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Transform Your Excel Data</h2>
                        <p className="text-muted-foreground text-lg">
                            Convert Excel files to JSON with advanced mapping and customization options
                        </p>
                    </div>

                    <FileUploader onFileUpload={handleFileUpload} />
                </div>

                {/* Sheet Selection - Moved above Basic section */}
                {file && sheets.length > 0 && (
                    <SheetSelector
                        sheets={sheets}
                        selectedSheet={selectedSheet}
                        onSheetChange={(sheet) => {
                            // Re-parse the file for the new sheet
                            const reader = new FileReader()
                            reader.onload = (e) => {
                                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                                const XLSX = require("xlsx")
                                const workbook = XLSX.read(data, { type: "array" })
                                const worksheet = workbook.Sheets[sheet]
                                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

                                if (jsonData.length > 0) {
                                    const headers = jsonData[0] as string[]
                                    const processedData = []
                                    for (let i = 1; i < jsonData.length; i++) {
                                        const row = jsonData[i] as any[]
                                        const obj: Record<string, any> = {}
                                        for (let j = 0; j < headers.length; j++) {
                                            obj[headers[j]] = row[j]
                                        }
                                        processedData.push(obj)
                                    }
                                    handleSheetSelect(sheet, processedData)
                                }
                            }
                            reader.readAsArrayBuffer(file)
                        }}
                        fileName={file.name}
                        isLoading={false}
                    />
                )}

                {/* Main Content Tabs */}
                {file && (
                    <Tabs defaultValue="preview" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
                            <TabsTrigger value="preview" className="gap-2">
                                <Eye className="h-4 w-4" />
                                Preview
                            </TabsTrigger>
                            <TabsTrigger value="mapping" className="gap-2">
                                <Settings2 className="h-4 w-4" />
                                Mapping
                            </TabsTrigger>
                            <TabsTrigger value="convert" className="gap-2">
                                <Zap className="h-4 w-4" />
                                Convert
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="preview" className="space-y-6">
                            <ExcelPreview
                                file={file}
                                selectedSheet={selectedSheet}
                                sheetData={sheetData}
                                onSheetSelect={handleSheetSelect}
                                onSheetsLoaded={handleSheetsLoaded}
                            />
                        </TabsContent>

                        <TabsContent value="mapping" className="space-y-6">
                            <div className="grid gap-6">
                                <AdvancedSettings
                                    startRow={startRow}
                                    endRow={endRow}
                                    onStartRowChange={setStartRow}
                                    onEndRowChange={setEndRow}
                                    totalRows={sheetData?.length || 0}
                                />

                                {sheetData && (
                                    <KeyMapping
                                        columns={Object.keys(sheetData[0] || {})}
                                        mappings={mappings}
                                        onMappingsChange={setMappings}
                                    />
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="convert" className="space-y-6">
                            <Card className="glass-card">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Zap className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle>Convert to JSON</CardTitle>
                                                <CardDescription>Transform your Excel data using the configured mappings</CardDescription>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="gap-1">
                                            Storage: {getLocalStorageSize()} MB
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        onClick={handleConvert}
                                        disabled={mappings.length === 0}
                                        className="w-full h-12 text-lg hover-glow"
                                        size="lg"
                                    >
                                        <FileJson className="h-5 w-5 mr-2" />
                                        Convert to JSON
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Conversion Result */}
                            {convertedData && (
                                <Card className="glass-card">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <Check className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-green-800">Conversion Complete</CardTitle>
                                                    <CardDescription>Successfully converted {convertedData.length} records</CardDescription>
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleCopyJson}
                                                className={`gap-2 transition-all duration-200 ${copied ? "bg-green-50 border-green-200 text-green-700" : ""
                                                    }`}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="h-4 w-4" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4" />
                                                        Copy JSON
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-muted/30 p-4 rounded-lg overflow-auto max-h-96 custom-scrollbar">
                                            <pre className="text-sm font-mono">{JSON.stringify(convertedData, null, 2)}</pre>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            onClick={() => {
                                                const dataStr = JSON.stringify(convertedData, null, 2)
                                                const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
                                                const downloadLink = document.createElement("a")
                                                downloadLink.setAttribute("href", dataUri)
                                                downloadLink.setAttribute("download", `${file?.name.replace(".xlsx", "")}.json`)
                                                document.body.appendChild(downloadLink)
                                                downloadLink.click()
                                                document.body.removeChild(downloadLink)
                                            }}
                                            className="gap-2 hover-glow"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download JSON
                                        </Button>

                                        <Button variant="outline" onClick={() => router.push("/dashboard")} className="gap-2">
                                            <Eye className="h-4 w-4" />
                                            View in Dashboard
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </main>
        </div>
    )
}
