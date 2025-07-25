"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ExternalLink, Server, Monitor } from "lucide-react"
import { useMemoryWarning } from "@/hooks/use-memory-warning"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface MemoryStatusProps {
    showNodejsBanner?: boolean
}

export default function MemoryStatus({ showNodejsBanner = true }: MemoryStatusProps) {
    const { showMemoryWarning, memoryUsage } = useMemoryWarning()
    const { getLocalStorageSize } = useLocalStorage()
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        // Check if banner was dismissed recently (24 hours)
        const dismissedTime = localStorage.getItem("nodejs-banner-dismissed")
        if (dismissedTime) {
            const dismissedDate = new Date(dismissedTime)
            const now = new Date()
            const hoursDiff = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60)
            if (hoursDiff < 24) {
                setDismissed(true)
            }
        }
    }, [])

    const handleClearLocalStorage = () => {
        localStorage.clear()
        window.location.reload()
    }

    const handleDismissBanner = () => {
        setDismissed(true)
        localStorage.setItem("nodejs-banner-dismissed", new Date().toISOString())
    }

    const storageSize = Number.parseFloat(getLocalStorageSize())
    const isHighStorage = storageSize > 2 // More than 2MB

    return (
        <div className="space-y-4">
            {/* Memory Warning */}
            {showMemoryWarning && (
                <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 flex items-center gap-2">
                        Memory Usage Warning
                        <Badge variant="destructive" className="text-xs">
                            {memoryUsage}%
                        </Badge>
                    </AlertTitle>
                    <AlertDescription className="text-amber-700 space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <Progress value={memoryUsage} className="h-2" />
                            </div>
                            <span className="text-sm font-mono">{memoryUsage}%</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearLocalStorage}
                                className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
                            >
                                <Monitor className="h-4 w-4 mr-2" />
                                Clear Storage ({getLocalStorageSize()} MB)
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Node.js Promotional Banner */}
            {showNodejsBanner && !dismissed && (showMemoryWarning || isHighStorage) && (
                <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover-lift relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDismissBanner}
                        className="absolute top-2 right-2 h-6 w-6 p-0 text-blue-400 hover:text-blue-600"
                    >
                        ×
                    </Button>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Server className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <AlertTitle className="text-blue-800 flex items-center gap-2">
                                Performance Boost Available
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                    Recommended
                                </Badge>
                            </AlertTitle>
                            <AlertDescription className="text-blue-700">
                                <div className="space-y-3">
                                    <p>
                                        Your device has limited memory or large storage usage. Our Node.js version can handle larger Excel
                                        files more efficiently with server-side processing.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 gap-2"
                                            onClick={() => window.open("https://github.com/your-repo/xlsx-to-json-nodejs", "_blank")}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            Try Node.js Version
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleDismissBanner}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Maybe Later
                                        </Button>
                                    </div>
                                </div>
                            </AlertDescription>
                        </div>
                    </div>
                </Alert>
            )}

            {/* Storage Status Card */}
            {storageSize > 0 && (
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Local Storage</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={isHighStorage ? "destructive" : "secondary"} className="text-xs">
                                    {getLocalStorageSize()} MB
                                </Badge>
                                {isHighStorage && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearLocalStorage}
                                        className="h-6 text-xs text-destructive hover:text-destructive"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
