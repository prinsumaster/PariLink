import { api } from './api';

export const biltyService = {
  getBilty: async (id: string) => {
    const { data } = await api.get(`/lorry-receipts/${id}`);
    return data;
  },

  downloadPdf: async (id: string, copyType: string = 'OFFICE') => {
    const response = await api.get(`/bilty/${id}/pdf`, {
      params: { copy: copyType },
      responseType: 'blob', // crucial for pdfs
    });
    return response.data;
  },
};
