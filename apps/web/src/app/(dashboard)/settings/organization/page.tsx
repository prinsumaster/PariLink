'use client';

import React from 'react';
import { OrganizationSettingsForm } from '@/components/settings/organization-settings';
import { SettingsLayout } from '@/components/settings/settings-layout';
import { RoleGuard } from '@/components/auth/role-guard';

export default function OrganizationSettingsPage() {
  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN']}>
      <SettingsLayout>
        <div className="space-y-6 flex flex-col">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-medium text-slate-900 dark:text-white">Organization Settings</h3>
              <p className="text-base font-medium text-slate-500">Manage your company's profile and global defaults.</p>
            </div>
          </div>
          
          <OrganizationSettingsForm />
        </div>
      </SettingsLayout>
    </RoleGuard>
  );
}
