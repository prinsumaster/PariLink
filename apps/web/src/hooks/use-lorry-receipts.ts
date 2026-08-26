import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useLorryReceipts(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['lorry-receipts', params],
    queryFn: async () => {
      const { data } = await api.get('/lorry-receipts', { params });
      return data;
    },
  });
}

export function useGenerateLorryReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/lorry-receipts', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lorry-receipts'] });
    },
  });
}

export function useUpdateLorryReceiptStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch(`/lorry-receipts/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lorry-receipts'] });
    },
  });
}
