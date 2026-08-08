'use client';

import { Menu, Bell, Search } from 'lucide-react';
import { ProfileMenu } from './profile-menu';
import { ThemeSwitcher } from './theme-switcher';
import { Breadcrumbs } from './breadcrumbs';
import { HelpMenu } from './help-menu';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 w-full bg-white dark:bg-slate-950 border-b-0">
      <button
        type="button"
        className="px-4 border-r border-slate-200 dark:border-slate-800 text-slate-500 focus:outline-none md:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <Breadcrumbs />
        </div>
        
        <div className="ml-4 flex items-center md:ml-6 space-x-2">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hidden sm:flex">
            <span className="sr-only">Global Search</span>
            <Search className="h-4 w-4" aria-hidden="true" />
          </Button>

          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
            <span className="sr-only">View notifications</span>
            <Bell className="h-4 w-4" aria-hidden="true" />
          </Button>

          <ThemeSwitcher />
          <HelpMenu />
          
          <div className="ml-3 relative">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
