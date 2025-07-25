"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Trash2, Download, ArrowLeft } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useMemoryWarning } from "@/hooks/use-memory-warning"
import ColorConfig from "@/components/color-config"
import Link from "next/link"

type ConversionData = {
    timestamp: number
    filename: string
    sheet: string
    data: any[]
}

export default function DashboardPage() {
    const [conversions, setConversions] = useState<Record<string, ConversionData>>({})
    const { getFromLocalStorage, removeFromLocalStorage, getLocalStorageSize } = useLocalStorage()
    const { showMemoryWarning, memoryUsage } = useMemoryWarning()
    const [showClearWarning, setShowClearWarning] = useState(true)
    const [customColors, setCustomColors] = useState<Record<string, string>>({})

    useEffect(() => {
        loadConversions()

        // Check if we should hide the clear warning
        const clearWarningDate = localStorage.getItem("clearWarningHideUntil")
        if (clearWarningDate) {
            const hideUntil = Number.parseInt(clearWarningDate)
            if (Date.now() < hideUntil) {
                setShowClearWarning(false)
            } else {
                // Reset if the date has passed
                localStorage.removeItem("clearWarningHideUntil")
            }
        }
    }, [])

    const loadConversions = () => {
        const allConversions: Record<string, ConversionData> = {}

        // Find all conversion entries in local storage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith("conversion_")) {
                const data = getFromLocalStorage(key)
                if (data) {
                    allConversions[key] = data
                }
            }
        }

        // Sort by timestamp (newest first)
        const sortedKeys = Object.keys(allConversions).sort(
            (a, b) => allConversions[b].timestamp - allConversions[a].timestamp,
        )

        const sortedConversions: Record<string, ConversionData> = {}
        sortedKeys.forEach((key) => {
            sortedConversions[key] = allConversions[key]
        })

        setConversions(sortedConversions)
    }

    const handleDeleteConversion = (id: string) => {
        removeFromLocalStorage(id)
        loadConversions()
    }

    const handleDownloadJson = (id: string) => {
        const conversion = conversions[id]
        if (!conversion) return

        const dataStr = JSON.stringify(conversion.data, null, 2)
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
        const downloadLink = document.createElement("a")
        downloadLink.setAttribute("href", dataUri)
        downloadLink.setAttribute("download", `${conversion.filename.replace(".xlsx", "")}.json`)
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    const handleClearLocalStorage = () => {
        // Clear only conversion data
        Object.keys(conversions).forEach((key) => {
            removeFromLocalStorage(key)
        })
        setConversions({})
    }

    const handleHideClearWarning = () => {
        // Hide for 30 days
        const thirtyDaysFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000
        localStorage.setItem("clearWarningHideUntil", thirtyDaysFromNow.toString())
        setShowClearWarning(false)
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString()
    }

    const handleColorChange = (colors: Record<string, string>) => {
        setCustomColors(colors)
    }

    // Apply custom colors from state
    const getCustomStyle = (colorKey: string) => {
        if (customColors[colorKey]) {
            return { backgroundColor: customColors[colorKey] }
        }
        return {}
    }

    const getCustomTextStyle = (colorKey: string) => {
        if (customColors[colorKey]) {
            return { color: customColors[colorKey] }
        }
        return {}
    }

    return (
        <div className="min-h-screen bg-gray-100" style={getCustomStyle("background")}>
            <header className="bg-gray-800 text-white p-4 shadow-md" style={getCustomStyle("primary")}>
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold" style={getCustomTextStyle("foreground")}>
                        Dashboard
                    </h1>
                    <div className="flex items-center gap-2">
                        <ColorConfig onColorChange={handleColorChange} />
                        <Link href="/">
                            <Button variant="outline" className="text-white border-white hover:bg-gray-700 bg-transparent">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8 max-w-full overflow-x-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800" style={getCustomTextStyle("foreground")}>
                        Your Conversions
                    </h2>
                    <Badge
                        variant="outline"
                        className="bg-gray-200 text-gray-800 border-gray-400"
                        style={getCustomStyle("secondary")}
                    >
                        Storage: {getLocalStorageSize()} MB
                    </Badge>
                </div>

                {showMemoryWarning && (
                    <Alert className="mb-6 bg-gray-200 border-gray-600" style={getCustomStyle("secondary")}>
                        <AlertCircle className="h-4 w-4 text-gray-800" />
                        <AlertTitle className="text-gray-800" style={getCustomTextStyle("foreground")}>
                            Memory Usage Warning
                        </AlertTitle>
                        <AlertDescription className="text-gray-700" style={getCustomTextStyle("foreground")}>
                            Your device is using {memoryUsage}% of available memory. Consider clearing local storage if you experience
                            performance issues.
                        </AlertDescription>
                    </Alert>
                )}

                {showClearWarning && (
                    <Alert className="mb-6 bg-gray-200 border-gray-600" style={getCustomStyle("secondary")}>
                        <AlertCircle className="h-4 w-4 text-gray-800" />
                        <AlertTitle className="text-gray-800" style={getCustomTextStyle("foreground")}>
                            Local Storage Notice
                        </AlertTitle>
                        <AlertDescription
                            className="text-gray-700 flex flex-col sm:flex-row sm:items-center gap-4"
                            style={getCustomTextStyle("foreground")}
                        >
                            <span>Please clear local storage periodically to prevent performance issues.</span>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleClearLocalStorage}
                                    className="bg-gray-800 hover:bg-gray-900"
                                >
                                    Clear Now
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleHideClearWarning}
                                    className="border-gray-600 text-gray-700 bg-transparent"
                                >
                                    Hide for 30 days
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {Object.keys(conversions).length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <p className="text-lg text-gray-700 mb-4" style={getCustomTextStyle("foreground")}>
                                No conversions found
                            </p>
                            <Link href="/xlsx-to-json">
                                <Button className="bg-gray-700 hover:bg-gray-800" style={getCustomStyle("accent")}>
                                    Create Your First Conversion
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(conversions).map(([id, conversion]) => (
                            <Card key={id} className="overflow-hidden">
                                <CardHeader className="bg-gray-200 pb-2" style={getCustomStyle("secondary")}>
                                    <CardTitle className="text-gray-800 truncate" style={getCustomTextStyle("foreground")}>
                                        {conversion.filename}
                                    </CardTitle>
                                    <CardDescription className="text-gray-700" style={getCustomTextStyle("foreground")}>
                                        Sheet: {conversion.sheet}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="text-sm text-gray-600 mb-2">Created: {formatDate(conversion.timestamp)}</div>
                                    <div className="text-sm text-gray-600">Records: {conversion.data.length}</div>
                                </CardContent>
                                <CardFooter className="bg-gray-50 flex justify-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteConversion(id)}
                                        className="text-red-500 border-red-200 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleDownloadJson(id)}
                                        className="bg-gray-700 hover:bg-gray-800 text-white"
                                        style={getCustomStyle("accent")}
                                    >
                                        <Download className="h-4 w-4 mr-1" /> Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
