'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, UploadCloud, Search, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

export default function AiKnowledgeHubPage() {
  const [documents, setDocuments] = useState([
    { id: '1', title: 'Driver Conduct Policy 2026', type: 'MANUAL', chunks: 14, date: '2026-07-20' },
    { id: '2', title: 'Fuel Card Procedures', type: 'SOP', chunks: 8, date: '2026-07-21' },
    { id: '3', title: 'Warehouse Safety Guidelines', type: 'POLICY', chunks: 25, date: '2026-07-22' },
  ]);
  
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    toast.info('Processing document with Enterprise RAG pipeline...');
    
    // Simulate RAG pipeline latency (chunking and vector embedding)
    setTimeout(() => {
      setDocuments([
        { id: Date.now().toString(), title: 'Q3 Financial Guidelines.pdf', type: 'UPLOAD', chunks: 32, date: new Date().toISOString().split('T')[0] },
        ...documents
      ]);
      setIsUploading(false);
      toast.success('Document indexed successfully into Vector Database');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Knowledge Hub" 
        description="Enterprise RAG Document Store. Upload policies, SOPs, and manuals to teach your AI Copilot."
      >
        <Button onClick={handleUpload} disabled={isUploading} className="bg-indigo-600">
          <UploadCloud className="mr-2 h-4 w-4" /> 
          {isUploading ? 'Indexing...' : 'Upload Document'}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Analytics Card */}
        <Card className="p-6 md:col-span-1 bg-white dark:bg-slate-950 flex flex-col justify-center">
           <h3 className="text-lg font-bold mb-4">Vector Database Status</h3>
           <div className="space-y-4">
             <div>
               <p className="text-sm text-slate-500">Total Documents</p>
               <p className="text-2xl font-bold">{documents.length}</p>
             </div>
             <div>
               <p className="text-sm text-slate-500">Indexed Vectors</p>
               <p className="text-2xl font-bold text-indigo-600">{documents.reduce((sum, d) => sum + d.chunks, 0) * 1536}</p>
             </div>
             <div>
               <Badge className="bg-emerald-100 text-emerald-800 border-0 hover:bg-emerald-100">
                 <CheckCircle2 className="w-3 h-3 mr-1" /> Embedding Pipeline Healthy
               </Badge>
             </div>
           </div>
        </Card>

        {/* Document List */}
        <Card className="p-0 md:col-span-3 bg-white dark:bg-slate-950 overflow-hidden">
          <div className="p-4 border-b dark:border-slate-800 flex items-center bg-slate-50 dark:bg-slate-900/50">
            <Search className="h-4 w-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search Knowledge Base (Semantic Search)..." 
              className="bg-transparent border-none outline-none flex-1 text-sm text-slate-700 dark:text-slate-300"
            />
          </div>
          
          <div className="divide-y dark:divide-slate-800">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg flex items-center justify-center mr-4">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">{doc.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                      <span className="text-xs text-slate-500">{doc.chunks} Semantic Chunks</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Indexed on</p>
                  <p className="text-sm font-medium">{doc.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
