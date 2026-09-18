'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { biltyService } from '@/services/bilty';
import { api } from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download, Printer, Send, FileText, AlertCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function BiltyDetailPage({ params }: { params: { id: string } }) {
  const [copyType, setCopyType] = useState('OFFICE');
  const [isDownloading, setIsDownloading] = useState(false);
  const [ewayInput, setEwayInput] = useState('');
  const [ewayLoading, setEwayLoading] = useState(false);
  const qc = useQueryClient();

  const { data: lr, isLoading } = useQuery({
    queryKey: ['bilty', params.id],
    queryFn: () => biltyService.getBilty(params.id),
  });

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const blob = await biltyService.downloadPdf(params.id, copyType);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bilty_${lr?.lrNumber}_${copyType}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF Downloaded successfully');
    } catch (err) {
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsDownloading(true);
      const blob = await biltyService.downloadPdf(params.id, copyType);
      
      const url = window.URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        iframe.contentWindow?.print();
      };
      
    } catch (err) {
      toast.error('Failed to prepare print');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleWhatsApp = () => {
    // Stub for now. Real implementation in Prompt 10/Later.
    toast.info('Preparing WhatsApp message with PDF...');
    setTimeout(() => {
      toast.success('Sent on WhatsApp successfully (Stub)');
    }, 1500);
  };

  if (isLoading) return <div className="p-8 animate-pulse text-slate-500">Loading Bilty Details...</div>;
  if (!lr) return <div className="p-8 text-red-500">Lorry Receipt not found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <FileText className="h-6 w-6 text-blue-600" />
            LR No: {lr.lrNumber}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Generated on {new Date(lr.date).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="bg-slate-100 text-slate-800 text-sm">
            Status: {lr.status}
          </Badge>
          
          <select 
            value={copyType} 
            onChange={(e) => setCopyType(e.target.value)}
            className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded p-1.5 text-sm"
          >
            <option value="CONSIGNOR">Consignor Copy</option>
            <option value="CONSIGNEE">Consignee Copy</option>
            <option value="DRIVER">Driver Copy</option>
            <option value="OFFICE">Office Copy</option>
            <option value="POD">POD Copy</option>
          </select>
          
          <Button variant="outline" size="sm" onClick={handlePrint} disabled={isDownloading}>
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button variant="default" size="sm" onClick={handleDownload} disabled={isDownloading}>
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
          <Button variant="secondary" size="sm" onClick={handleWhatsApp} className="bg-green-600 hover:bg-green-700 text-white">
            <Send className="h-4 w-4 mr-2" /> Send on WhatsApp
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500 uppercase">Consignor (From)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-lg">{lr.consignorName}</p>
            <p className="text-sm text-slate-600 mt-1">{lr.consignorAddress}</p>
            <p className="text-sm mt-3"><span className="text-slate-500">GSTIN:</span> {lr.consignorGstin || 'URD'}</p>
            <p className="text-sm mt-1"><span className="text-slate-500">From:</span> {lr.fromStation}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500 uppercase">Consignee (To)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-lg">{lr.consigneeName}</p>
            <p className="text-sm text-slate-600 mt-1">{lr.consigneeAddress}</p>
            <p className="text-sm mt-3"><span className="text-slate-500">GSTIN:</span> {lr.consigneeGstin || 'URD'}</p>
            <p className="text-sm mt-1"><span className="text-slate-500">To:</span> {lr.toStation}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Consignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-500">Vehicle / Truck No</p>
              <p className="font-medium mt-1">{lr.vehicleNumber || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">E-Way Bill</p>
              <p className="font-medium mt-1">{lr.ewayBillNumber || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Packages</p>
              <p className="font-medium mt-1">{lr.packagesCount} {lr.packingType}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Actual Weight</p>
              <p className="font-medium mt-1">{lr.actualWeightKg} kg</p>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-slate-500">Description of Goods (HSN/SAC 9965)</p>
            <p className="font-medium mt-1 p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
              {lr.goodsDescription}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Details</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Freight Amount:</span>
                <span className="font-medium">₹ {lr.freightAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Hamali Charges:</span>
                <span className="font-medium">₹ {lr.hamaliCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Other Charges:</span>
                <span className="font-medium">₹ {lr.otherCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-slate-500">Taxable Amount:</span>
                <span className="font-medium">₹ {(lr.freightAmount + lr.hamaliCharges + lr.otherCharges).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Payment Type:</span>
                <span className="font-medium px-2 py-0.5 bg-blue-100 text-blue-800 rounded">{lr.paymentType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">GST Computed:</span>
                <span className="font-medium">₹ {lr.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-300 dark:border-slate-700 mt-2">
                <span>Grand Total:</span>
                <span className="text-blue-600 dark:text-blue-400">₹ {lr.totalAmount.toFixed(2)}</span>
              </div>
            </div>
           </div>
        </CardContent>
      </Card>

      {/* E-Way Bill — Manual Entry Only */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            E-Way Bill
            <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-xs font-normal">
              Manual entry — portal integration coming soon
            </Badge>
          </CardTitle>
          <CardDescription className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <span>
              Enter the E-Way Bill number as generated on the{' '}
              <a href="https://ewaybillgst.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                NIC e-way bill portal
              </a>
              . This system does <strong>not</strong> generate or file e-way bills automatically.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-slate-500 mb-1">Current E-Way Bill No.</p>
              <p className="font-mono text-base font-semibold">{lr.ewayBillNumber || <span className="text-muted-foreground font-normal">Not entered</span>}</p>
            </div>
            <div className="flex gap-2 items-end">
              <div>
                <p className="text-sm text-slate-500 mb-1">Update E-Way Bill Number</p>
                <Input
                  id="eway-bill-input"
                  placeholder="e.g. 281001234567"
                  value={ewayInput}
                  onChange={(e) => setEwayInput(e.target.value)}
                  className="w-52 font-mono"
                  maxLength={15}
                />
              </div>
              <Button
                id="eway-bill-save-btn"
                variant="outline"
                size="sm"
                disabled={ewayLoading || !ewayInput.trim()}
                onClick={async () => {
                  setEwayLoading(true);
                  try {
                    await api.patch(`/lorry-receipts/${params.id}/eway-bill`, {
                      ewayBillNumber: ewayInput.trim(),
                    });
                    toast.success('E-Way Bill number saved');
                    setEwayInput('');
                    qc.invalidateQueries({ queryKey: ['bilty', params.id] });
                  } catch {
                    toast.error('Failed to save E-Way Bill number');
                  } finally {
                    setEwayLoading(false);
                  }
                }}
              >
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
