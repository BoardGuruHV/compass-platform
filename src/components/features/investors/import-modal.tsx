'use client'

import { useState, useRef } from 'react'
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImportResult } from '@/types/investor'

interface ImportModalProps {
  onClose: () => void
  onImportComplete: () => void
}

export function ImportModal({ onClose, onImportComplete }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        alert('Please select a CSV file')
        return
      }
      setFile(selectedFile)
      setResult(null)
    }
  }

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'))
    
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      return row
    })
    
    return data
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setResult(null)

    try {
      const text = await file.text()
      const data = parseCSV(text)

      const response = await fetch('/api/investors/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      })

      if (!response.ok) {
        throw new Error('Import failed')
      }

      const importResult: ImportResult = await response.json()
      setResult(importResult)

      if (importResult.success) {
        setTimeout(() => {
          onImportComplete()
        }, 2000)
      }
    } catch (error) {
      console.error('Import error:', error)
      setResult({
        success: false,
        imported: 0,
        failed: 0,
        errors: [{
          row: 0,
          field: 'general',
          message: 'Failed to import file. Please check the format and try again.',
        }],
      })
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = `Name,Type,Website,Description,Investment Size Min,Investment Size Max,Regions,Sectors,Stage Focus,Contact Name,Contact Email,Contact Phone,Contact Title
Acme Ventures,equity,https://acmeventures.com,"Leading early-stage investor",500000,5000000,"North America,Europe","FinTech,SaaS","seed,series_a",John Smith,john@acmeventures.com,+1234567890,Partner
Global Impact Fund,grant,https://globalimpact.org,"Social impact focused fund",100000,1000000,Global,"Healthcare,Education,Agriculture",seed,Jane Doe,jane@globalimpact.org,+9876543210,Director`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'investor_import_template.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Import Investors
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!result && (
            <>
              {/* Instructions */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-2">
                  Import Instructions
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Upload a CSV file with investor data</li>
                  <li>• Required fields: Name, Type (debt/equity/grant/hybrid)</li>
                  <li>• Optional fields: Website, Description, Investment Size, Regions, Sectors, etc.</li>
                  <li>• Multiple values should be comma-separated (e.g., "FinTech,SaaS")</li>
                </ul>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {file ? (
                  <div className="border-2 border-green-500 border-dashed rounded-lg p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3"
                    >
                      Choose Different File
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      CSV files only
                    </p>
                  </div>
                )}
              </div>

              {/* Template Download */}
              <div className="flex items-center justify-center mb-6">
                <button
                  onClick={downloadTemplate}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Download CSV Template
                </button>
              </div>
            </>
          )}

          {/* Import Result */}
          {result && (
            <div className={`p-6 rounded-lg ${result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="flex items-start">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div className="ml-3 flex-1">
                  <h3 className={`text-lg font-medium ${result.success ? 'text-green-900 dark:text-green-400' : 'text-red-900 dark:text-red-400'}`}>
                    {result.success ? 'Import Successful' : 'Import Completed with Errors'}
                  </h3>
                  <div className="mt-2 text-sm">
                    <p className={result.success ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}>
                      • Successfully imported: {result.imported} investors
                    </p>
                    {result.failed > 0 && (
                      <p className="text-red-800 dark:text-red-300">
                        • Failed to import: {result.failed} investors
                      </p>
                    )}
                  </div>

                  {result.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-red-900 dark:text-red-400 mb-2">
                        Errors:
                      </h4>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {result.errors.slice(0, 10).map((error, index) => (
                          <p key={index} className="text-xs text-red-700 dark:text-red-300">
                            Row {error.row}: {error.message}
                          </p>
                        ))}
                        {result.errors.length > 10 && (
                          <p className="text-xs text-red-700 dark:text-red-300">
                            ... and {result.errors.length - 10} more errors
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          {!result && (
            <Button
              onClick={handleImport}
              disabled={!file || importing}
            >
              {importing ? 'Importing...' : 'Import'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}