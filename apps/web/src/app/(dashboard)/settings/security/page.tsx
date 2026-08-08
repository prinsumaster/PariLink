'use client';

import { SecuritySettingsForm } from '@/components/settings/security-settings';
import { SettingsLayout } from '@/components/settings/settings-layout';
import { RoleGuard } from '@/components/auth/role-guard';

export default function SecuritySettingsPage() {
  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN']}>
      <SettingsLayout>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-slate-900 dark:text-white">Security & Access</h3>
            <p className="text-base font-medium text-slate-500">Configure authentication policies and SSO integrations.</p>
          </div>
          <SecuritySettingsForm />
        </div>
      </SettingsLayout>
    </RoleGuard>
  );
}
