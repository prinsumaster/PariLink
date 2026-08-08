"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-200">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
        <p className="text-sm text-slate-400 animate-pulse tracking-widest uppercase">Initializing Workspace...</p>
      </div>
    </div>
  );
}
