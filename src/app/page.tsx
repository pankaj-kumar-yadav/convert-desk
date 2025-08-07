import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileSpreadsheet, Database, Zap, Shield } from "lucide-react"
import Link from "next/link"
import { appName } from "@/constants/app-constants"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{appName}</h1>
                <p className="text-sm text-muted-foreground">Advanced Excel Converter</p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              v2.0
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <Shield className="h-4 w-4" />
              100% Client-Side Processing
            </Badge>
            <h2 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Transform Excel Data to JSON
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Convert your Excel files to JSON format with advanced customization options, drag-and-drop mapping, and
              real-time preview.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-2 mt-16">
            <Card className="glass-card hover-lift group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <FileSpreadsheet className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <CardTitle className="text-xl">XLSX to JSON Converter</CardTitle>
                    <CardDescription className="text-base">Advanced conversion with custom mapping</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Drag & drop file upload
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Real-time Excel preview
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Custom key mapping with data types
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Manual value insertion
                  </div>
                </div>
                <Link href="/xlsx-to-json" className="block">
                  <Button className="w-full h-12 text-lg hover-glow group-hover:shadow-lg transition-all duration-300">
                    Start Converting
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <CardTitle className="text-xl">Conversion Dashboard</CardTitle>
                    <CardDescription className="text-base">Manage and download your conversions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    View conversion history
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Download JSON files
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Storage management
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Batch operations
                  </div>
                </div>
                <Link href="/dashboard" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-lg hover-glow group-hover:shadow-lg transition-all duration-300 bg-transparent"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid gap-4 md:grid-cols-3 mt-16">
            <div className="text-center space-y-2 p-6 rounded-lg bg-muted/30">
              <div className="p-2 bg-primary/10 rounded-lg w-fit mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Process large Excel files instantly with client-side conversion
              </p>
            </div>

            <div className="text-center space-y-2 p-6 rounded-lg bg-muted/30">
              <div className="p-2 bg-primary/10 rounded-lg w-fit mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your data never leaves your browser - 100% client-side processing
              </p>
            </div>

            <div className="text-center space-y-2 p-6 rounded-lg bg-muted/30">
              <div className="p-2 bg-primary/10 rounded-lg w-fit mx-auto">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Advanced Mapping</h3>
              <p className="text-sm text-muted-foreground">
                Drag-and-drop reordering with custom data types and manual values
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-24">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} {appName}. Built with Next.js and shadcn/ui.
          </p>
        </div>
      </footer>
    </div>
  )
}
