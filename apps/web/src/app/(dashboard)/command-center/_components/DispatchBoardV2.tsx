'use client';

import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from '@/services/api';
import { Loader2, Package, MapPin, Truck, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const BOARD_COLUMNS = [
  { id: 'PENDING', title: 'Pending Dispatch' },
  { id: 'IN_TRANSIT', title: 'In Transit' },
  { id: 'DELIVERED', title: 'Delivered' },
];

function SortableLoadCard({ load }: { load: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: load.id, data: load });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing mb-3 group transition-shadow hover:shadow-md",
        isDragging && "opacity-50 ring-2 ring-indigo-500"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">{load.referenceNumber}</span>
        {load.anomalies?.length > 0 && (
          <span className="flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
            <AlertTriangle className="h-3 w-3" />
            Alert
          </span>
        )}
      </div>
      
      <div className="space-y-1.5 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5 text-indigo-400" />
          <span className="truncate">{load.originCity}, {load.originState}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 pl-[3px]">
          <div className="w-[1px] h-3 bg-slate-300 dark:bg-slate-700 ml-1"></div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5 text-rose-400" />
          <span className="truncate">{load.destinationCity}, {load.destinationState}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="text-[10px] text-slate-400 uppercase font-medium">
          {load.pickupDate ? format(new Date(load.pickupDate), 'MMM d, h:mm a') : 'TBD'}
        </div>
        <div className="font-medium text-xs text-slate-700 dark:text-slate-300">
          ${load.rate}
        </div>
      </div>
    </div>
  );
}

function BoardColumn({ id, title, loads }: { id: string, title: string, loads: any[] }) {
  return (
    <div className="flex flex-col w-[320px] shrink-0 bg-slate-100 dark:bg-slate-950/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-tight">{title}</h3>
        <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium px-2 py-0.5 rounded-full">
          {loads.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-[150px]">
        <SortableContext items={loads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {loads.map(load => (
            <SortableLoadCard key={load.id} load={load} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function DispatchBoardV2() {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['dispatch', 'board'],
    queryFn: async () => {
      const res = await api.get('/dispatch/board');
      // For the board, we want ALL loads but they are paginated, for this MVP we just fetch the pending/active from the dispatch service
      return res.data;
    },
    refetchInterval: 10000,
  });

  const moveCardMutation = useMutation({
    mutationFn: async ({ loadId, status, boardPosition }: { loadId: string, status: string, boardPosition: number }) => {
      return api.put('/dispatch/board/move', { loadId, status, boardPosition });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch', 'board'] });
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const boardData = useMemo(() => {
    if (!data) return { PENDING: [], IN_TRANSIT: [], DELIVERED: [] };
    
    // We are pulling active trips which contains loads, and pendingLoads
    const pending = (data.pendingLoads || []).sort((a: any, b: any) => (a.boardPosition || 0) - (b.boardPosition || 0));
    
    const inTransit: any[] = [];
    const delivered: any[] = [];
    
    if (data.activeTrips) {
      data.activeTrips.forEach((trip: any) => {
        if (trip.loads) {
          trip.loads.forEach((l: any) => {
            if (l.status === 'IN_TRANSIT') inTransit.push(l);
            else if (l.status === 'DELIVERED') delivered.push(l);
            else if (l.status === 'PENDING') pending.push(l);
          });
        }
      });
    }
    
    inTransit.sort((a: any, b: any) => (a.boardPosition || 0) - (b.boardPosition || 0));
    delivered.sort((a: any, b: any) => (a.boardPosition || 0) - (b.boardPosition || 0));

    // Deduplicate pending just in case
    const uniquePending = Array.from(new Map(pending.map((item: any) => [item.id, item])).values());

    return {
      PENDING: uniquePending,
      IN_TRANSIT: inTransit,
      DELIVERED: delivered,
    };
  }, [data]);

  const activeLoad = useMemo(() => {
    if (!activeId) return null;
    return [...boardData.PENDING, ...boardData.IN_TRANSIT, ...boardData.DELIVERED].find(l => l.id === activeId);
  }, [activeId, boardData]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = active.data.current.status || 'PENDING';
    const overContainer = over.data.current?.status || over.id; // over can be a column id or a card

    // Just basic update to new status for MVP
    if (activeContainer !== overContainer) {
      let targetStatus = overContainer;
      if (['PENDING', 'IN_TRANSIT', 'DELIVERED'].includes(over.id)) {
        targetStatus = over.id;
      }
      
      // Calculate a new board position (just appending for now)
      const targetList = boardData[targetStatus as keyof typeof boardData] || [];
      const newPos = targetList.length > 0 ? (targetList[targetList.length - 1].boardPosition || 0) + 1 : 0;

      moveCardMutation.mutate({
        loadId: active.id,
        status: targetStatus,
        boardPosition: newPos
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-x-auto overflow-y-hidden p-6 gap-6 bg-slate-50 dark:bg-slate-900 custom-scrollbar">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {BOARD_COLUMNS.map(col => (
          <BoardColumn 
            key={col.id}
            id={col.id}
            title={col.title}
            loads={boardData[col.id as keyof typeof boardData] || []}
          />
        ))}

        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
          {activeLoad ? <SortableLoadCard load={activeLoad} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
