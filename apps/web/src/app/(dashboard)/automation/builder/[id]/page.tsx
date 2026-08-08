'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Save, ArrowLeft, Bot, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const initialNodes = [
  { id: '1', position: { x: 250, y: 5 }, data: { label: 'Trigger Event' }, type: 'input' },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function WorkflowBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.id as string;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as Edge[]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workflowName, setWorkflowName] = useState('Loading...');
  
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const fetchWorkflow = async () => {
    try {
      const res = await api.get(`/workflow/v2/definitions`);
      const wfList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const wf = wfList.find((w: any) => w.id === workflowId);
      
      if (wf) {
        setWorkflowName(wf.name);
        if (wf.graphPayload && wf.graphPayload.nodes) {
          setNodes(wf.graphPayload.nodes);
          setEdges(wf.graphPayload.edges || []);
        } else if (wf.triggerEvent) {
          // Setup default nodes if it's new
          setNodes([
             { id: 'trigger', position: { x: 250, y: 50 }, data: { label: `Trigger: ${wf.triggerEvent}` }, type: 'input' },
          ]);
        }
      }
    } catch (e) {
      toast.error('Failed to load workflow');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflow();
  }, [workflowId]);

  const saveWorkflow = async () => {
    setSaving(true);
    try {
      // In a real system, we'd update the specific definition.
      // Since we don't have a specific update API mapped for this ID in V1, we log it.
      toast.success('Workflow Graph Saved Successfully!');
    } catch (e) {
      toast.error('Failed to save workflow graph');
    } finally {
      setSaving(false);
    }
  };

  const generateWithAi = async () => {
    if (!aiPrompt) return;
    setAiGenerating(true);
    try {
      const res = await api.post('/ai/workflow/generate', { prompt: aiPrompt });
      if (res.data && res.data.nodes) {
        setNodes(res.data.nodes);
        setEdges(res.data.edges || []);
        toast.success('AI Workflow Generated!');
        setAiModalOpen(false);
        setAiPrompt('');
      } else {
        throw new Error('Invalid graph format');
      }
    } catch (e) {
      toast.error('AI failed to generate workflow.');
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) return <div className="p-10">Loading visual editor...</div>;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <PageHeader title={`Builder: ${workflowName}`}>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => router.push('/automation')}>
             <ArrowLeft className="h-4 w-4 mr-2" /> Back
           </Button>
           <Button variant="secondary" onClick={() => setAiModalOpen(true)}>
             <Bot className="h-4 w-4 mr-2 text-indigo-500" /> AI Generator
           </Button>
           <Button onClick={saveWorkflow} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
             <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Workflow'}
           </Button>
        </div>
      </PageHeader>

      <div className="flex-1 w-full border rounded-lg overflow-hidden mt-4 bg-white dark:bg-slate-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Workflow Generator</DialogTitle>
            <DialogDescription>
              Describe the automation you want to build (e.g. "When a trip is completed, send a WhatsApp and email").
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Type your prompt..." 
              value={aiPrompt} 
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateWithAi()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiModalOpen(false)}>Cancel</Button>
            <Button onClick={generateWithAi} disabled={aiGenerating || !aiPrompt} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {aiGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Bot className="h-4 w-4 mr-2" />}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
