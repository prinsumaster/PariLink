import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-6">
        <FileQuestion className="h-12 w-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">The route you are trying to access does not exist, has been moved, or you lack the correct RBAC permissions.</p>
      <Link href="/">
        <Button size="lg">Return to Control Tower</Button>
      </Link>
    </div>
  );
}
