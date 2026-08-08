import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadsService, type ListParams } from '@/services';
import type { CreateLoadDto } from '@/types';

export const loadKeys = {
  all: ['loads'] as const,
  lists: () => [...loadKeys.all, 'list'] as const,
  list: (params: ListParams) => [...loadKeys.lists(), params] as const,
  details: () => [...loadKeys.all, 'detail'] as const,
  detail: (id: string) => [...loadKeys.details(), id] as const,
};

export function useLoads(params: ListParams = {}) {
  return useQuery({
    queryKey: loadKeys.list(params),
    queryFn: () => loadsService.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useLoad(id: string) {
  return useQuery({
    queryKey: loadKeys.detail(id),
    queryFn: () => loadsService.get(id),
    enabled: !!id,
  });
}

export function useCreateLoad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateLoadDto) => loadsService.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: loadKeys.lists() });
    },
  });
}

export function useUpdateLoad(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<CreateLoadDto> & { status?: string; tripId?: string; driverId?: string; vehicleId?: string }) =>
      loadsService.update(id, dto),
    onSuccess: (updated) => {
      // Optimistically update the specific list cache entry (if it matches)
      qc.setQueryData(['loads', 'list', { limit: 100 }], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((load: any) => load.id === id ? { ...load, ...updated } : load)
        };
      });

      // Invalidate all list queries to guarantee fresh data on refetch
      qc.invalidateQueries({ queryKey: loadKeys.lists() });
      // Invalidate specific detail
      qc.invalidateQueries({ queryKey: loadKeys.detail(id) });
    },
  });
}

export function useDeleteLoad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => loadsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: loadKeys.lists() });
    },
  });
}
