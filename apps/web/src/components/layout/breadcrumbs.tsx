'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0 || pathname === '/dashboard') {
    return null; // Don't show breadcrumbs on root dashboard
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        <li>
          <div>
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-500">
              <Home className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          
          return (
            <li key={path}>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <Link
                  href={href}
                  className={`ml-2 text-sm font-medium ${
                    isLast ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
