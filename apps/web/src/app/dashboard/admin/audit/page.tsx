import { Metadata } from 'next';
import { AuditClient } from './audit-client';

export const metadata: Metadata = {
  title: 'Audit Logs | PariLink Enterprise',
  description: 'Enterprise immutable audit logging and compliance monitoring',
};

export default function AuditPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Audit Logs</h2>
        <div className="flex items-center space-x-2">
          {/* Export action available inside client */}
        </div>
      </div>
      <p className="text-muted-foreground text-zinc-400">
        Immutable, cryptographic event logging for SOC2 and ISO 27001 compliance.
      </p>
      
      <AuditClient />
    </div>
  );
}
