"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Download, Eye, Settings2, Sparkles, ArrowLeft, FileJson, Zap } from "lucide-react"
import { FileDropZone } from "@/components/ui/file-drop-zone"
import { DataPreviewTable } from "@/components/ui/data-preview-table"
import SheetSelector from "@/components/sheet-selector"
import AdvancedSettings from "@/components/advanced-settings"
import ColorConfig from "@/components/color-config"
import MemoryStatus from "@/components/memory-status"
import { useExcelParser } from "@/hooks/use-excel-parser"
import { useConversion } from "@/hooks/use-conversion"
import { useMappings } from "@/hooks/use-mappings"
import { useTheme } from "@/hooks/use-theme"
import { StorageService } from "@/services/storage-service"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import KeyMapping from "@/components/kpi-mapping"
import { ColorTheme } from "@/types"

export default function ConverterPage() {
    const [file, setFile] = useState<File | null>(null)
    const [startRow, setStartRow] = useState<number>(1)
    const [endRow, setEndRow] = useState<number | null>(null)
    const [copied, setCopied] = useState(false)

    const { sheets, currentSheet, isLoading, error, parseFile, selectSheet, reset } = useExcelParser()
    const { convertedData, isConverting, convert, reset: resetConversion } = useConversion()
    const { mappings, addMapping, updateMapping, deleteMapping, setMappingsDirectly } = useMappings()
    const { currentTheme, applyTheme } = useTheme()

    const searchParams = useSearchParams()
    const router = useRouter()

    // Handle sheet persistence
    useEffect(() => {
        const sheetFromUrl = searchParams.get("sheet")
        if (sheetFromUrl && sheets.some((s) => s.name === sheetFromUrl)) {
            selectSheet(sheetFromUrl)
        }
    }, [searchParams, sheets, selectSheet])

    // Reset state when file changes
    useEffect(() => {
        if (file) {
            reset()
            resetConversion()
        }
    }, [file, reset, resetConversion])

    const handleFileUpload = async (uploadedFile: File) => {
        setFile(uploadedFile)
        await parseFile(uploadedFile)
    }

    const handleSheetSelect = (sheetName: string) => {
        selectSheet(sheetName)

        // Update URL
        const params = new URLSearchParams(searchParams.toString())
        params.set("sheet", sheetName)
        router.replace(`/xlsx-to-json?${params.toString()}`, { scroll: false })
    }

    const handleConvert = async () => {
        if (!currentSheet || !file) return

        try {
            await convert(currentSheet.data, { startRow, endRow, mappings }, file.name, currentSheet.name)
        } catch (error) {
            alert(error instanceof Error ? error.message : "Conversion failed")
        }
    }

    const handleCopyJson = async () => {
        if (!convertedData) return

        try {
            await navigator.clipboard.writeText(JSON.stringify(convertedData, null, 2))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            alert("Failed to copy to clipboard")
        }
    }

    const handleDownloadJson = () => {
        if (!convertedData || !file) return

        const dataStr = JSON.stringify(convertedData, null, 2)
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
        const downloadLink = document.createElement("a")
        downloadLink.setAttribute("href", dataUri)
        downloadLink.setAttribute("download", `${file.name.replace(".xlsx", "")}.json`)
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header */}
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
                        <ColorConfig onColorChange={(colors) => applyTheme(colors as ColorTheme)} />
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
                <MemoryStatus showNodejsBanner={true} />

                {/* File Upload Section */}
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Transform Your Excel Data</h2>
                        <p className="text-muted-foreground text-lg">
                            Convert Excel files to JSON with advanced mapping and customization options
                        </p>
                    </div>

                    <FileDropZone onFileSelect={handleFileUpload} selectedFile={file} />

                    {error && <div className="text-center text-destructive">{error}</div>}
                </div>

                {/* Sheet Selection */}
                {file && sheets.length > 0 && (
                    <SheetSelector
                        sheets={sheets.map((s) => s.name)}
                        selectedSheet={currentSheet?.name || ""}
                        onSheetChange={handleSheetSelect}
                        fileName={file.name}
                        isLoading={isLoading}
                    />
                )}

                {/* Main Content Tabs */}
                {file && currentSheet && (
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
                            <Card className="glass-card hover-lift">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Eye className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">Data Preview</CardTitle>
                                                <CardDescription>Preview of {currentSheet.name} worksheet</CardDescription>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="gap-1">
                                            {currentSheet.data.length} rows
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <DataPreviewTable data={currentSheet.data} headers={currentSheet.headers} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="mapping" className="space-y-6">
                            <AdvancedSettings
                                startRow={startRow}
                                endRow={endRow}
                                onStartRowChange={setStartRow}
                                onEndRowChange={setEndRow}
                                totalRows={currentSheet.data.length}
                            />

                            <KeyMapping columns={currentSheet.headers} mappings={mappings} onMappingsChange={setMappingsDirectly} />
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
                                            Storage: {StorageService.getStorageSize()} MB
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        onClick={handleConvert}
                                        disabled={mappings.length === 0 || isConverting}
                                        className="w-full h-12 text-lg hover-glow"
                                        size="lg"
                                    >
                                        <FileJson className="h-5 w-5 mr-2" />
                                        {isConverting ? "Converting..." : "Convert to JSON"}
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
                                    <CardContent className="flex justify-between pt-0">
                                        <Button onClick={handleDownloadJson} className="gap-2 hover-glow">
                                            <Download className="h-4 w-4" />
                                            Download JSON
                                        </Button>

                                        <Button variant="outline" onClick={() => router.push("/dashboard")} className="gap-2">
                                            <Eye className="h-4 w-4" />
                                            View in Dashboard
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </main>
        </div>
    )
}
