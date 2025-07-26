"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle } from "lucide-react"
import { ExcelService } from "@/services/excel-service"

interface FileDropZoneProps {
    onFileSelect: (file: File) => void
    selectedFile?: File | null
    className?: string
}

export function FileDropZone({ onFileSelect, selectedFile, className }: FileDropZoneProps) {
    const [dragActive, setDragActive] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(e.type === "dragenter" || e.type === "dragover")
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleFileSelection(file)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileSelection(file)
        }
    }

    const handleFileSelection = (file: File) => {
        setError(null)

        if (!ExcelService.validateFile(file)) {
            setError("Please select a valid Excel file (.xlsx or .xls)")
            return
        }

        onFileSelect(file)
    }

    const handleClick = () => {
        inputRef.current?.click()
    }

    return (
        <Card
            className={`glass-card hover-lift transition-all duration-300 ${dragActive ? "ring-2 ring-primary ring-offset-2 scale-105" : ""
                } ${selectedFile ? "ring-2 ring-green-500 ring-offset-2" : ""} ${className}`}
        >
            <CardContent className="p-0">
                <div
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${dragActive
                            ? "border-primary bg-primary/5"
                            : selectedFile
                                ? "border-green-500 bg-green-50"
                                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <input ref={inputRef} type="file" className="hidden" accept=".xlsx,.xls" onChange={handleChange} />

                    {selectedFile ? (
                        <FileSelectedContent file={selectedFile} onChangeFile={handleClick} />
                    ) : (
                        <FilePromptContent dragActive={dragActive} />
                    )}

                    {error && <div className="mt-4 text-sm text-destructive text-center">{error}</div>}
                </div>
            </CardContent>
        </Card>
    )
}

function FileSelectedContent({ file, onChangeFile }: { file: File; onChangeFile: () => void }) {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center space-y-2">
                <p className="font-semibold text-lg">{file.name}</p>
                <div className="flex items-center gap-2 justify-center">
                    <Badge variant="secondary">{ExcelService.formatFileSize(file.size)}</Badge>
                    <Badge variant="outline">Excel File</Badge>
                </div>
            </div>
            <Button
                variant="outline"
                onClick={(e) => {
                    e.stopPropagation()
                    onChangeFile()
                }}
                className="hover-glow"
            >
                <Upload className="h-4 w-4 mr-2" />
                Change File
            </Button>
        </div>
    )
}

function FilePromptContent({ dragActive }: { dragActive: boolean }) {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full transition-colors ${dragActive ? "bg-primary/20" : "bg-muted"}`}>
                <Upload className={`h-10 w-10 transition-colors ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="text-center space-y-2">
                <p className="text-xl font-semibold">{dragActive ? "Drop your file here" : "Upload Excel File"}</p>
                <p className="text-muted-foreground">Drag and drop your .xlsx or .xls file, or click to browse</p>
            </div>
            <div className="flex gap-2">
                <Badge variant="outline">.xlsx</Badge>
                <Badge variant="outline">.xls</Badge>
            </div>
        </div>
    )
}
