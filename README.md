# XLSX to JSON Converter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC)](https://tailwindcss.com/)

A modern, client-side Excel to JSON converter built with Next.js 15, featuring advanced mapping capabilities, drag-and-drop functionality, and real-time preview. Transform your Excel data with custom key mapping, data type conversion, and manual value insertion - all processed securely in your browser.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)
- [Project Status](#project-status)

## Project Overview

The XLSX to JSON Converter is a powerful, privacy-focused web application that allows users to convert Excel files (.xlsx, .xls) to JSON format with advanced customization options. Built with modern web technologies, it processes files entirely on the client-side, ensuring your data never leaves your browser.

### Goals
- Provide a secure, client-side Excel to JSON conversion tool
- Offer advanced mapping and customization capabilities
- Deliver a modern, intuitive user experience
- Support large file processing with memory management
- Enable batch operations and conversion history

### Target Audience
- Data analysts and scientists
- Developers working with Excel data
- Business users needing data format conversion
- Anyone requiring secure, offline data processing

### Problem It Solves
Traditional Excel to JSON converters often require uploading sensitive data to external servers, lack advanced mapping features, or have poor user experiences. This tool addresses these issues by providing:
- 100% client-side processing for maximum privacy
- Advanced key mapping with drag-and-drop reordering
- Real-time preview and validation
- Memory management for large files
- Persistent conversion history

## Features

### Core Functionality
- **Drag & Drop File Upload**: Intuitive file selection with visual feedback
- **Multi-Sheet Support**: Select and convert specific worksheets
- **Real-time Excel Preview**: View your data before conversion
- **Advanced Key Mapping**: Map Excel columns to custom JSON keys
- **Data Type Conversion**: Automatic or manual data type selection (string, number, boolean)
- **Manual Value Insertion**: Add custom values and auto-increment fields
- **Row Range Selection**: Convert specific row ranges with slider controls

### Advanced Features
- **Drag & Drop Reordering**: Reorganize JSON field order with intuitive drag-and-drop
- **Conversion History**: Local storage-based history with download capabilities
- **Memory Management**: Built-in memory monitoring and optimization suggestions
- **Theme Customization**: Multiple color themes and custom color configuration
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Persistent State**: Maintains selected worksheet across browser sessions

### User Experience
- **Modern UI**: Glass-morphism design with smooth animations
- **Progress Indicators**: Visual feedback for all operations
- **Error Handling**: Comprehensive error messages and recovery options
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Performance Optimized**: Efficient rendering for large datasets

## Technologies Used

### Frontend Framework
- **Next.js** `15.4.4` - React framework with App Router
- **React** `18.x` - UI library
- **TypeScript** `5.x` - Type safety and developer experience

### Styling & UI
- **Tailwind CSS** `3.3.x` - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **Radix UI** - Accessible component primitives
- **Lucide React** `0.363.x` - Icon library
- **class-variance-authority** `0.7.x` - Component variant management

### Data Processing
- **SheetJS (xlsx)** `0.18.5` - Excel file parsing and processing
- **@dnd-kit** `6.1.x` - Drag and drop functionality

### Development Tools
- **ESLint** - Code linting
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS processing

## Installation

### Prerequisites
- **Node.js** 18.x or higher
- **npm** 9.x or higher (or **yarn** 1.22.x)

### Step-by-Step Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/xlsx-to-json-converter.git
   cd xlsx-to-json-converter
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

\`\`\`bash
# Build the application
npm run build

# Start the production server
npm run start
\`\`\`

### Environment Variables

Create a `.env.local` file in the root directory (optional):

\`\`\`env
# Optional: Analytics or monitoring services
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
\`\`\`

## Usage

### Basic Conversion

1. **Upload Excel File**
   - Drag and drop your `.xlsx` or `.xls` file onto the upload area
   - Or click to browse and select your file

2. **Select Worksheet**
   - Choose the specific worksheet you want to convert
   - Preview the data in the table view

3. **Configure Mapping**
   - Add mappings for Excel columns to JSON keys
   - Set data types (auto, string, number, boolean)
   - Add manual values or auto-increment fields

4. **Convert and Download**
   - Click "Convert to JSON" to process your data
   - Copy the JSON output or download as a file

### Advanced Features

#### Custom Key Mapping
\`\`\`javascript
// Example mapping configuration
{
  "excel_column": "Name",
  "json_key": "full_name",
  "data_type": "string"
}
\`\`\`

#### Manual Values
\`\`\`javascript
// Add custom fields
{
  "json_key": "created_at",
  "manual_value": "2024-01-01",
  "data_type": "string"
}
\`\`\`

#### Auto-increment Fields
\`\`\`javascript
// Auto-incrementing ID field
{
  "json_key": "id",
  "auto_increment": true,
  "data_type": "number"
}
\`\`\`

### Screenshots

![Main Interface](docs/images/main-interface.png)
*Main conversion interface with file upload*

![Mapping Configuration](docs/images/mapping-config.png)
*Advanced key mapping with drag-and-drop*

![Conversion Results](docs/images/conversion-results.png)
*JSON output with copy and download options*

## Project Structure

\`\`\`
xlsx-to-json-converter/
├── app/                          # Next.js App Router
│   ├── converter/               # Converter page
│   ├── dashboard/              # Dashboard page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── advanced-settings.tsx   # Row range settings
│   ├── excel-preview.tsx       # Excel data preview
│   ├── file-uploader.tsx       # File upload component
│   ├── key-mapping.tsx         # Mapping configuration
│   └── ...                     # Other components
├── hooks/                       # Custom React hooks
│   ├── use-excel-parser.ts     # Excel parsing logic
│   ├── use-conversion.ts       # Conversion logic
│   ├── use-mappings.ts         # Mapping management
│   └── ...                     # Other hooks
├── services/                    # Business logic services
│   ├── excel-service.ts        # Excel processing
│   ├── conversion-service.ts   # Data conversion
│   └── storage-service.ts      # Local storage management
├── types/                       # TypeScript type definitions
│   └── index.ts                # Main type definitions
├── lib/                         # Utility functions
│   └── utils.ts                # Common utilities
├── public/                      # Static assets
└── docs/                        # Documentation assets
\`\`\`

## API Reference

### Core Services

#### ExcelService
\`\`\`typescript
class ExcelService {
  static async parseFile(file: File): Promise<ExcelSheet[]>
  static validateFile(file: File): boolean
  static formatFileSize(bytes: number): string
}
\`\`\`

#### ConversionService
\`\`\`typescript
class ConversionService {
  static convertData(sheetData: any[], config: ConversionConfig): any[]
}
\`\`\`

#### StorageService
\`\`\`typescript
class StorageService {
  static saveConversion(id: string, data: ConversionData): void
  static getConversion(id: string): ConversionData | null
  static getAllConversions(): Record<string, ConversionData>
  static deleteConversion(id: string): void
}
\`\`\`

### Custom Hooks

#### useExcelParser
\`\`\`typescript
const {
  sheets,
  currentSheet,
  isLoading,
  error,
  parseFile,
  selectSheet,
  reset
} = useExcelParser()
\`\`\`

#### useConversion
\`\`\`typescript
const {
  convertedData,
  isConverting,
  convert,
  reset
} = useConversion()
\`\`\`

## Contributing

We welcome contributions from the community! Here's how you can help:

### Reporting Issues

1. **Search existing issues** to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Feature Requests

1. **Check the roadmap** to see if the feature is already planned
2. **Open a feature request** with detailed description
3. **Explain the use case** and potential implementation

### Pull Requests

1. **Fork the repository** and create a feature branch
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Follow the coding standards**
   - Use TypeScript for type safety
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   \`\`\`bash
   npm run lint
   npm run build
   \`\`\`

4. **Submit a pull request**
   - Use a clear, descriptive title
   - Reference related issues
   - Provide a detailed description of changes

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Please report unacceptable behavior to [maintainer@example.com].

### Development Guidelines

- **Commit Messages**: Use conventional commits format
- **Branch Naming**: Use `feature/`, `bugfix/`, or `hotfix/` prefixes
- **Code Style**: Follow the ESLint configuration
- **Testing**: Add tests for new features and bug fixes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

\`\`\`
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

## Acknowledgments

### Libraries and Frameworks
- **Next.js Team** - For the amazing React framework
- **Vercel** - For hosting and deployment platform
- **shadcn** - For the beautiful UI component library
- **SheetJS** - For Excel file processing capabilities
- **Tailwind CSS** - For the utility-first CSS framework

### Design Inspiration
- **Linear** - For clean, modern interface design
- **Figma** - For design system inspiration
- **Dribbble Community** - For UI/UX inspiration

### Contributors
- **[Your Name]** - Project creator and maintainer
- **Community Contributors** - Thank you to all who have contributed!

### Special Thanks
- **Open Source Community** - For the amazing tools and libraries
- **Beta Testers** - For feedback and bug reports
- **Documentation Contributors** - For improving project documentation

## Contact

### Maintainer
- **Name**: [Your Name]
- **Email**: [your.email@example.com]
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Twitter**: [@yourusername](https://twitter.com/yourusername)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourusername)

### Project Links
- **Repository**: [https://github.com/yourusername/xlsx-to-json-converter](https://github.com/yourusername/xlsx-to-json-converter)
- **Live Demo**: [https://xlsx-to-json-converter.vercel.app](https://xlsx-to-json-converter.vercel.app)
- **Documentation**: [https://docs.xlsx-to-json-converter.com](https://docs.xlsx-to-json-converter.com)
- **Issues**: [https://github.com/yourusername/xlsx-to-json-converter/issues](https://github.com/yourusername/xlsx-to-json-converter/issues)

### Community
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/xlsx-to-json-converter/discussions)
- **Discord**: [Join our Discord](https://discord.gg/your-invite)

## Project Status

🟢 **Active Development** - This project is actively maintained and developed.

### Current Version
- **Version**: 2.0.0
- **Last Updated**: January 2024
- **Next Release**: Q2 2024

### Roadmap

#### Version 2.1 (Q2 2024)
- [ ] Batch file processing
- [ ] CSV export support
- [ ] Advanced filtering options
- [ ] Performance optimizations

#### Version 2.2 (Q3 2024)
- [ ] Cloud storage integration
- [ ] Collaboration features
- [ ] API endpoints
- [ ] Mobile app companion

#### Version 3.0 (Q4 2024)
- [ ] AI-powered data mapping
- [ ] Advanced data validation
- [ ] Plugin system
- [ ] Enterprise features

### Recent Updates
- **v2.0.0** - Complete rewrite with Next.js 15, improved UI/UX
- **v1.5.0** - Added drag-and-drop mapping, memory management
- **v1.4.0** - Multi-sheet support, advanced settings
- **v1.3.0** - Theme customization, responsive design

---

**Made with ❤️ by [Your Name]**

*If you find this project helpful, please consider giving it a ⭐ on GitHub!*