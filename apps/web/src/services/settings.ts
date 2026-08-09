import { api } from '@/services/api';
import { OrganizationSettings, SecuritySettings } from '@/types/settings';

export const settingsService = {
  getOrganizationSettings: async (): Promise<OrganizationSettings> => {
    const { data } = await api.get('/settings/organization');
    return data;
  },

  updateOrganizationSettings: async (settings: OrganizationSettings): Promise<OrganizationSettings> => {
    const { data } = await api.patch('/settings/organization', settings);
    return data;
  },

  getSecuritySettings: async (): Promise<SecuritySettings> => {
    const { data } = await api.get('/settings/security');
    return data;
  },

  updateSecuritySettings: async (settings: SecuritySettings): Promise<SecuritySettings> => {
    const { data } = await api.patch('/settings/security', settings);
    return data;
  },

  completeOnboarding: async (dto: any) => {
    const { data } = await api.post('/saas/tenant/onboarding/complete', dto);
    return data;
  },

  provisionDefaults: async () => {
    const { data } = await api.post('/saas/tenant/provisioning/defaults');
    return data;
  },

  updateLogo: async (logoUrl: string) => {
    const { data } = await api.patch('/saas/tenant/branding/logo', { logoUrl });
    return data;
  },

  getBillingInfo: async () => {
    const { data } = await api.get('/saas/billing/info');
    return data;
  },

  upgradePlan: async (planId: string) => {
    const { data } = await api.post('/saas/billing/checkout', {
      planId,
      successUrl: window.location.origin + '/settings/billing?success=true',
      cancelUrl: window.location.origin + '/settings/billing?canceled=true',
    });
    return data;
  }
};
