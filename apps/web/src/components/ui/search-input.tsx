"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  isLoading?: boolean;
  onClear?: () => void;
  wrapperClassName?: string;
}

export function SearchInput({
  value = "",
  onChange,
  debounceMs = 300,
  isLoading = false,
  onClear,
  wrapperClassName,
  className,
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce logic
  useEffect(() => {
    if (!onChange) return;
    const timeout = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);
    return () => clearTimeout(timeout);
  }, [localValue, onChange, debounceMs, value]);

  const handleClear = () => {
    setLocalValue("");
    if (onChange) onChange("");
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-full group",
        wrapperClassName
      )}
    >
      <div className="absolute left-3 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>

      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          "pl-9 pr-9 h-10 w-full transition-all duration-200",
          isFocused ? "shadow-sm border-blue-500 ring-4 ring-blue-500/10" : "bg-slate-50 dark:bg-slate-900/50",
          className
        )}
        {...props}
      />

      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 flex items-center justify-center h-6 w-6 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
