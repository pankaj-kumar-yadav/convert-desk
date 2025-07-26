"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings } from "lucide-react"
import { ColorTheme } from "@/types"

interface ColorConfigProps {
    onColorChange: (colors: ColorTheme) => void
}

export default function ColorConfig({ onColorChange }: ColorConfigProps) {
    const [colors, setColors] = useState({
        background: "#f8f9fa",
        foreground: "#212529",
        primary: "#343a40",
        secondary: "#adb5bd",
        accent: "#6c757d",
        border: "#dee2e6",
    })

    const handleColorChange = (key: string, value: string) => {
        const newColors = { ...colors, [key]: value }
        setColors(newColors)
    }

    const applyColors = () => {
        // Apply colors to CSS variables
        document.documentElement.style.setProperty("--background-custom", colors.background)
        document.documentElement.style.setProperty("--foreground-custom", colors.foreground)
        document.documentElement.style.setProperty("--primary-custom", colors.primary)
        document.documentElement.style.setProperty("--secondary-custom", colors.secondary)
        document.documentElement.style.setProperty("--accent-custom", colors.accent)
        document.documentElement.style.setProperty("--border-custom", colors.border)

        // Notify parent component
        onColorChange(colors)
    }

    const presets = [
        {
            name: "Grayscale",
            colors: {
                background: "#f8f9fa",
                foreground: "#212529",
                primary: "#343a40",
                secondary: "#adb5bd",
                accent: "#6c757d",
                border: "#dee2e6",
            },
        },
        {
            name: "Blue",
            colors: {
                background: "#caf0f8",
                foreground: "#03045e",
                primary: "#0077b6",
                secondary: "#90e0ef",
                accent: "#0096c7",
                border: "#ade8f4",
            },
        },
        {
            name: "Dark",
            colors: {
                background: "#212529",
                foreground: "#f8f9fa",
                primary: "#e9ecef",
                secondary: "#495057",
                accent: "#6c757d",
                border: "#343a40",
            },
        },
    ]

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Color settings</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Color Configuration</DialogTitle>
                    <DialogDescription>Customize the application colors using hex codes.</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="custom" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="custom">Custom Colors</TabsTrigger>
                        <TabsTrigger value="presets">Presets</TabsTrigger>
                    </TabsList>

                    <TabsContent value="custom" className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="background">Background</Label>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: colors.background }}></div>
                                    <Input
                                        id="background"
                                        value={colors.background}
                                        onChange={(e) => handleColorChange("background", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foreground">Foreground</Label>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: colors.foreground }}></div>
                                    <Input
                                        id="foreground"
                                        value={colors.foreground}
                                        onChange={(e) => handleColorChange("foreground", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="primary">Primary</Label>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: colors.primary }}></div>
                                    <Input
                                        id="primary"
                                        value={colors.primary}
                                        onChange={(e) => handleColorChange("primary", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="secondary">Secondary</Label>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: colors.secondary }}></div>
                                    <Input
                                        id="secondary"
                                        value={colors.secondary}
                                        onChange={(e) => handleColorChange("secondary", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accent">Accent</Label>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: colors.accent }}></div>
                                    <Input
                                        id="accent"
                                        value={colors.accent}
                                        onChange={(e) => handleColorChange("accent", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="border">Border</Label>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: colors.border }}></div>
                                    <Input
                                        id="border"
                                        value={colors.border}
                                        onChange={(e) => handleColorChange("border", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="presets" className="py-4">
                        <div className="grid grid-cols-1 gap-4">
                            {presets.map((preset) => (
                                <Button
                                    key={preset.name}
                                    variant="outline"
                                    className="justify-start h-auto p-4 bg-transparent"
                                    onClick={() => setColors(preset.colors)}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{preset.name}</span>
                                        <div className="flex gap-1 mt-2">
                                            {Object.values(preset.colors).map((color, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full border" style={{ backgroundColor: color }}></div>
                                            ))}
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button onClick={applyColors}>Apply Colors</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
