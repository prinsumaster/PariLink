import { redirect } from 'next/navigation';

export default function SettingsRootPage() {
  // Redirect root settings to the first tab (Organization)
  redirect('/settings/organization');
}
