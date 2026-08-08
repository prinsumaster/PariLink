'use client';

import { useState, useEffect } from 'react';
import { aiApi } from '@/services/ai';
import { 
  FileCode2, Save, Play, Clock, Check, 
  ChevronRight, Sparkles, SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  version: number;
}

export default function PromptStudioPage() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<PromptTemplate | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState('');
  const [testing, setTesting] = useState(false);

  const extractVariables = (templateStr: string) => {
    const regex = /{{(.*?)}}/g;
    let match;
    const newVars: Record<string, string> = {};
    while ((match = regex.exec(templateStr)) !== null) {
      newVars[match[1]] = variables[match[1]] || '';
    }
    setVariables(newVars);
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await aiApi.listPromptTemplates();
      const list = Array.isArray(res.data) ? res.data : (res.data.templates || []);
      
      setTemplates(list);
      if (list.length > 0) {
        setActiveTemplate(list[0]);
        setEditorContent(list[0].template);
        extractVariables(list[0].template);
      }
    } catch (e) {
      console.error(e);
      // Fallback in case of error
      const mockList = [
        { id: 't1', name: 'Invoice Extraction', template: 'Extract line items from this invoice: {{invoice_text}}', model: 'gpt-4o', version: 1 },
        { id: 't2', name: 'Customer Sentiment', template: 'Analyze the sentiment of this feedback: {{feedback}}', model: 'llama-3-70b', version: 2 }
      ] as any[];
      setTemplates(mockList);
      if (mockList.length > 0) {
        setActiveTemplate(mockList[0]);
        setEditorContent(mockList[0].template);
        extractVariables(mockList[0].template);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEditorContent(val);
    extractVariables(val);
  };

  const selectTemplate = (t: PromptTemplate) => {
    setActiveTemplate(t);
    setEditorContent(t.template);
    extractVariables(t.template);
    setTestResult('');
  };

  const runTest = () => {
    setTesting(true);
    // Simulate AI response for the studio
    setTimeout(() => {
      let finalPrompt = editorContent;
      Object.entries(variables).forEach(([k, v]) => {
        finalPrompt = finalPrompt.replace(new RegExp(`{{${k}}}`, 'g'), v || `[Missing ${k}]`);
      });
      setTestResult(`[Simulated Output]\nProcessed Prompt:\n"${finalPrompt}"\n\nAI Response: The extraction was successful. PO number is identified.`);
      setTesting(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-slate-950 text-white rounded-xl border border-slate-800 overflow-hidden">
      {/* Sidebar - Templates */}
      <div className="w-72 flex-shrink-0 border-r border-slate-800 flex flex-col bg-slate-900/50">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-indigo-400" />
            Prompt Library
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="text-xs text-slate-500 text-center py-4">Loading library...</div>
          ) : (
            templates.map(t => (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  activeTemplate?.id === t.id 
                    ? 'bg-indigo-500/10 border-indigo-500/30' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-semibold truncate ${activeTemplate?.id === t.id ? 'text-indigo-400' : 'text-slate-200'}`}>
                    {t.name}
                  </span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">v{t.version}</span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2">{t.description}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <h1 className="text-lg font-bold">{activeTemplate?.name || 'Prompt Studio'}</h1>
            <p className="text-xs text-slate-400">Edit, test, and version LLM prompt templates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800 text-xs">
              <Clock className="h-3 w-3 mr-1.5" /> History
            </Button>
            <Button className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white text-xs">
              <Save className="h-3 w-3 mr-1.5" /> Save Template
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1 flex flex-col border-r border-slate-800">
            <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center gap-2">
              <SlidersHorizontal className="h-3 w-3 text-slate-500" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Template Editor</span>
            </div>
            <textarea
              value={editorContent}
              onChange={handleEditorChange}
              className="flex-1 w-full bg-slate-950 p-6 text-sm font-mono text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 leading-relaxed"
              placeholder="Enter prompt template here. Use {{variable_name}} for dynamic inputs."
            />
          </div>

          {/* Test Panel */}
          <div className="w-[400px] flex-shrink-0 flex flex-col bg-slate-900/30">
            <div className="p-3 border-b border-slate-800 bg-slate-950">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Test Sandbox</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col">
              <h3 className="text-sm font-semibold mb-4 text-slate-200">Variables</h3>
              
              {Object.keys(variables).length === 0 ? (
                <div className="text-xs text-slate-500 mb-6 p-4 bg-slate-900 rounded-lg border border-slate-800 border-dashed">
                  No variables found. Add {"{{variable}}"} to your template.
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {Object.keys(variables).map(key => (
                    <div key={key}>
                      <label className="block text-xs font-mono text-indigo-400 mb-1">{key}</label>
                      <textarea
                        rows={2}
                        value={variables[key]}
                        onChange={e => setVariables({...variables, [key]: e.target.value})}
                        placeholder={`Enter test value for ${key}`}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              <Button 
                onClick={runTest}
                disabled={testing || !editorContent.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white mb-6"
              >
                {testing ? <span className="flex items-center gap-2"><div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"/> Running...</span> : <span className="flex items-center gap-2"><Play className="h-4 w-4" /> Run Test</span>}
              </Button>

              {/* Output */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-sm font-semibold mb-2 text-slate-200">Output</h3>
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm font-mono text-slate-300 overflow-y-auto whitespace-pre-wrap">
                  {testResult || <span className="text-slate-600 italic">Run the prompt to see results here.</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
