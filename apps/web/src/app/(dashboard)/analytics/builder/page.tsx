'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Save, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

const AVAILABLE_WIDGETS = [
  { id: 'rev-trend', type: 'LINE_CHART', title: 'Revenue Trend', dataSource: 'REVENUE' },
  { id: 'fleet-util', type: 'GAUGE', title: 'Fleet Utilization', dataSource: 'FLEET' },
  { id: 'trip-volume', type: 'BAR_CHART', title: 'Daily Trips', dataSource: 'TRIPS' },
  { id: 'customer-growth', type: 'KPI_CARD', title: 'Customer Growth', dataSource: 'CUSTOMERS' },
];

function SortableWidget({ widget, onRemove }: { widget: any, onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: widget.instanceId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-4 flex items-center justify-between mb-3 shadow-sm">
      <div className="flex items-center">
        <button {...attributes} {...listeners} className="cursor-grab mr-3 text-slate-400 hover:text-slate-600">
          <GripVertical className="h-5 w-5" />
        </button>
        <div>
          <h4 className="font-medium text-slate-800 dark:text-slate-200">{widget.title}</h4>
          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{widget.type}</span>
        </div>
      </div>
      <button onClick={() => onRemove(widget.instanceId)} className="text-red-500 hover:bg-red-50 p-2 rounded">
        <Trash className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function DashboardBuilderPage() {
  const [dashboardName, setDashboardName] = useState('My Custom Executive View');
  const [activeWidgets, setActiveWidgets] = useState<any[]>([]);
  const [widgetCounter, setWidgetCounter] = useState(0);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setActiveWidgets((items) => {
        const oldIndex = items.findIndex(i => i.instanceId === active.id);
        const newIndex = items.findIndex(i => i.instanceId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addWidget = (widgetInfo: any) => {
    const nextCounter = widgetCounter + 1;
    setWidgetCounter(nextCounter);
    setActiveWidgets([
      ...activeWidgets,
      { ...widgetInfo, instanceId: `${widgetInfo.id}-${nextCounter}` }
    ]);
  };

  const removeWidget = (instanceId: string) => {
    setActiveWidgets(activeWidgets.filter(w => w.instanceId !== instanceId));
  };

  const saveDashboard = async () => {
    try {
      if (activeWidgets.length === 0) return toast.error('Add at least one widget.');
      
      await api.post('/analytics/dashboards', {
        name: dashboardName,
        description: 'Custom user built dashboard',
        layoutType: 'GRID',
        widgets: activeWidgets.map(w => ({
          title: w.title,
          type: w.type,
          dataSource: w.dataSource,
          config: {},
          position: {} // simplified for v1
        }))
      });
      toast.success('Dashboard layout saved successfully!');
    } catch (e) {
      toast.error('Failed to save dashboard');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Custom Dashboard Builder" description="Drag and drop widgets to build your BI view">
        <Button onClick={saveDashboard} className="bg-indigo-600 text-white">
          <Save className="h-4 w-4 mr-2" /> Save Dashboard
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar: Widget Library */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-lg">Widget Library</h3>
          {AVAILABLE_WIDGETS.map(widget => (
            <Card key={widget.id} className="p-4 cursor-pointer hover:border-indigo-500 transition-colors" onClick={() => addWidget(widget)}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{widget.title}</p>
                  <p className="text-xs text-slate-500">{widget.type}</p>
                </div>
                <Plus className="h-4 w-4 text-indigo-500" />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-slate-50 dark:bg-slate-950/50 min-h-[500px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <input 
                type="text" 
                value={dashboardName}
                onChange={e => setDashboardName(e.target.value)}
                className="bg-transparent text-xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none px-2 py-1 transition-colors"
              />
              <span className="text-sm text-slate-500">{activeWidgets.length} widgets</span>
            </div>

            {activeWidgets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                <GripVertical className="h-10 w-10 mb-2 opacity-20" />
                <p>Click widgets from the library to add them here</p>
              </div>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={activeWidgets.map(w => w.instanceId)} strategy={verticalListSortingStrategy}>
                  {activeWidgets.map(widget => (
                    <SortableWidget key={widget.instanceId} widget={widget} onRemove={removeWidget} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
