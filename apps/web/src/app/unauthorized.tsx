import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <Lock className="h-8 w-8 text-yellow-600 dark:text-yellow-500" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">401</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Unauthorized Access</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You must be logged in to view this page. Please authenticate to continue.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/login" passHref>
            <Button>
              Sign In
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outline">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
