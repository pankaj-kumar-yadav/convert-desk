"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, type File, CheckCircle } from "lucide-react"

interface FileUploaderProps {
    onFileUpload: (file: File) => void
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (validateFile(file)) {
                setSelectedFile(file)
                onFileUpload(file)
                setUploadStatus("success")
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (validateFile(file)) {
                setSelectedFile(file)
                onFileUpload(file)
                setUploadStatus("success")
            }
        }
    }

    const validateFile = (file: File) => {
        const validTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]
        if (!validTypes.includes(file.type)) {
            setUploadStatus("error")
            alert("Please select an Excel file (.xlsx or .xls)")
            return false
        }
        return true
    }

    const onButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <Card
            className={`glass-card hover-lift transition-all duration-300 ${dragActive ? "ring-2 ring-primary ring-offset-2 scale-105" : ""
                } ${uploadStatus === "success" ? "ring-2 ring-green-500 ring-offset-2" : ""}`}
        >
            <CardContent className="p-0">
                <div
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${dragActive
                            ? "border-primary bg-primary/5"
                            : uploadStatus === "success"
                                ? "border-green-500 bg-green-50"
                                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={onButtonClick}
                >
                    <input ref={inputRef} type="file" className="hidden" accept=".xlsx,.xls" onChange={handleChange} />

                    {selectedFile ? (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>

                            <div className="text-center space-y-2">
                                <p className="font-semibold text-lg">{selectedFile.name}</p>
                                <div className="flex items-center gap-2 justify-center">
                                    <Badge variant="secondary">{formatFileSize(selectedFile.size)}</Badge>
                                    <Badge variant="outline">Excel File</Badge>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onButtonClick()
                                }}
                                className="hover-glow"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Change File
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4">
                            <div className={`p-4 rounded-full transition-colors ${dragActive ? "bg-primary/20" : "bg-muted"}`}>
                                <Upload
                                    className={`h-10 w-10 transition-colors ${dragActive ? "text-primary" : "text-muted-foreground"}`}
                                />
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
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
