'use client';

import { useState, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { bulkImportService, ImportType, ImportReport } from '@/services/bulk-import';
import { 
  FileUp, Download, CheckCircle2, XCircle, ChevronRight, 
  Truck, Users, Building2, PackageSearch, DollarSign, AlertTriangle, UploadCloud
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

const IMPORT_TYPES: { value: ImportType; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'vehicles', label: 'Vehicles', icon: Truck, description: 'Import your truck fleet — plates, make, model, type' },
  { value: 'drivers', label: 'Drivers', icon: Users, description: 'Import driver profiles — name, license, phone' },
  { value: 'customers', label: 'Customers', icon: Building2, description: 'Import customer master — name, GST, contacts' },
  { value: 'vendors', label: 'Vendors', icon: PackageSearch, description: 'Import vendor/carrier master with GST validation' },
  { value: 'opening-balances', label: 'Opening Balances', icon: DollarSign, description: 'Import opening A/R A/P ledger balances' },
];

// ─── Step indicator ──────────────────────────────────────────────────────────

function Step({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
        done ? 'bg-emerald-500 border-emerald-500 text-white' :
        active ? 'bg-blue-600 border-blue-600 text-white' :
        'border-slate-300 text-slate-400'
      }`}>
        {done ? '✓' : n}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-slate-900' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BulkImportPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedType, setSelectedType] = useState<ImportType | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useMutation({
    mutationFn: () => bulkImportService.uploadFile(selectedType!, uploadedFile!),
    onSuccess: (data) => {
      setReport(data);
      setStep(4);
      toast.success(`Import complete: ${data.imported} imported, ${data.skipped} skipped`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Import failed. Please check the file and try again.');
    },
  });

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setUploadedFile(file); setStep(3); }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setUploadedFile(file); setStep(3); }
  };

  const reset = () => {
    setStep(1); setSelectedType(null); setUploadedFile(null); setReport(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <UploadCloud className="h-9 w-9 text-blue-600" />
            Bulk Import
          </h1>
          <p className="text-slate-500 mt-2">
            Import your existing data via Excel or CSV. Download a template, fill it, upload — done.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4">
          <Step n={1} label="Pick Type" active={step === 1} done={step > 1} />
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <Step n={2} label="Download Template" active={step === 2} done={step > 2} />
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <Step n={3} label="Upload & Preview" active={step === 3} done={step > 3} />
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <Step n={4} label="Summary" active={step === 4} done={false} />
        </div>

        {/* ─── Step 1: Pick Type ────────────────────────────────── */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {IMPORT_TYPES.map(({ value, label, icon: Icon, description }) => (
              <button
                key={value}
                id={`import-type-${value}`}
                onClick={() => { setSelectedType(value); setStep(2); }}
                className="text-left p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-lg font-bold text-slate-900">{label}</span>
                </div>
                <p className="text-sm text-slate-500">{description}</p>
              </button>
            ))}
          </div>
        )}

        {/* ─── Step 2: Download Template ───────────────────────── */}
        {step === 2 && selectedType && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Download the Template</h2>
              <p className="text-slate-500 mt-1">
                Fill in your data in the <strong>{selectedType}</strong> template. Required columns are
                marked in the header row.
              </p>
            </div>

            <a
              id="download-template-btn"
              href={bulkImportService.downloadTemplate(selectedType)}
              download
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow"
            >
              <Download className="h-4 w-4" />
              Download {selectedType}-template.xlsx
            </a>

            <div className="pt-4 border-t border-slate-100">
              <button
                id="go-to-upload-btn"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                I've filled the template → Upload now
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3: Upload & Preview ─────────────────────────── */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Upload your filled file</h2>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-3 transition-all ${
                dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              <FileUp className="h-10 w-10 text-slate-400" />
              <div className="text-center">
                <p className="font-semibold text-slate-700">
                  {uploadedFile ? uploadedFile.name : 'Drop your .xlsx or .csv here'}
                </p>
                <p className="text-sm text-slate-400 mt-1">or click to browse files</p>
              </div>
              {uploadedFile && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />
            </div>

            {uploadedFile && (
              <div className="flex items-center gap-3">
                <button
                  id="confirm-import-btn"
                  onClick={() => importMutation.mutate()}
                  disabled={importMutation.isPending}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow disabled:opacity-60"
                >
                  {importMutation.isPending ? 'Importing…' : `Import ${selectedType}`}
                </button>
                <button onClick={() => setUploadedFile(null)} className="text-slate-400 hover:text-slate-600 text-sm">
                  Remove file
                </button>
              </div>
            )}

            {importMutation.isPending && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl animate-pulse">
                <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                <p className="text-blue-700 font-medium">Parsing and validating rows…</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 4: Summary ──────────────────────────────────── */}
        {step === 4 && report && (
          <div className="space-y-6">
            {/* Stats banner */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Rows', value: report.totalRows, color: 'bg-slate-100 text-slate-800' },
                { label: 'Imported', value: report.imported, color: 'bg-emerald-100 text-emerald-800' },
                { label: 'Skipped', value: report.skipped, color: 'bg-red-100 text-red-700' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`${color} rounded-2xl p-5 text-center`}>
                  <div className="text-4xl font-black">{value}</div>
                  <div className="text-sm font-semibold mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Row results table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Row-by-row results</h3>
                <span className="text-sm text-slate-400">{report.results.length} rows</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
                {report.results.map((r) => (
                  <div key={r.row} className="flex items-start gap-3 px-6 py-3">
                    {r.status === 'imported' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">Row {r.row}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          r.status === 'imported' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {r.status.toUpperCase()}
                        </span>
                      </div>
                      {r.reason && (
                        <p className="text-sm text-red-600 mt-0.5 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          {r.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                id="import-again-btn"
                onClick={reset}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Import another file
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
