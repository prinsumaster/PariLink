"use client";

import React, { useCallback, useState } from 'react';
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
  Node,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Trip Created (Trigger)' },
    position: { x: 250, y: 5 },
    className: 'bg-slate-900 border-slate-700 text-white rounded-md p-4 w-48 text-center border'
  },
];

const initialEdges: Edge[] = [];

export function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(2);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addActionNode = () => {
    const newNode: Node = {
      id: nodeId.toString(),
      data: { label: 'Send Email Action' },
      position: { x: 250, y: nodeId * 100 },
      className: 'bg-slate-800 border-slate-600 text-slate-200 rounded-md p-4 w-48 text-center border',
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeId((id) => id + 1);
  };

  const addConditionNode = () => {
    const newNode: Node = {
      id: nodeId.toString(),
      data: { label: 'If Delay > 30m' },
      position: { x: 250, y: nodeId * 100 },
      className: 'bg-indigo-900 border-indigo-700 text-indigo-100 rounded-md p-4 w-48 text-center border',
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeId((id) => id + 1);
  };

  const saveWorkflow = () => {
    // Removed console.log for production safety
  };

  return (
    <div className="h-[calc(100vh-10rem)] w-full bg-slate-950 flex flex-col relative rounded-xl border border-slate-800 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        colorMode="dark"
        className="bg-slate-950"
      >
        <Controls className="bg-slate-800 border-slate-700 text-white fill-white" />
        <MiniMap className="bg-slate-900" maskColor="rgba(0,0,0,0.5)" />
        <Background color="#334155" gap={16} />
        <Panel position="top-right" className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addConditionNode} className="bg-indigo-950 hover:bg-indigo-900 border-indigo-800 text-indigo-100">
            <PlusCircle className="mr-2 h-4 w-4" />
            Condition
          </Button>
          <Button variant="outline" size="sm" onClick={addActionNode} className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200">
            <PlusCircle className="mr-2 h-4 w-4" />
            Action
          </Button>
          <Button variant="default" size="sm" onClick={saveWorkflow}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
