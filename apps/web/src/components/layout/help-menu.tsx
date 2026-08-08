'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HelpCircle, BookOpen, MessageSquare, PlayCircle, GraduationCap } from 'lucide-react';

export function HelpMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help & Support</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Customer Success</p>
            <p className="text-xs leading-none text-muted-foreground">
              We're here to help you grow.
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>First Login Guide</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlayCircle className="mr-2 h-4 w-4" />
            <span>Video Tutorials</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Request Training</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Raise Support Ticket</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
