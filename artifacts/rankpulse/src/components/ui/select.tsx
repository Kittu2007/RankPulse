"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SelectContextValue = {
  value: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  setValue: (value: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within <Select>");
  }
  return context;
}

export interface SelectProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ defaultValue = "", value, onValueChange, children }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const selected = value ?? internalValue;

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [onValueChange, value]
  );

  return (
    <SelectContext.Provider value={{ value: selected, open, setOpen, setValue }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, children, ...props }, ref) => {
    const { open, setOpen } = useSelectContext();

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
          className
        )}
        onClick={(event) => {
          onClick?.(event);
          setOpen(!open);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export function SelectValue({ placeholder, className }: { placeholder?: string; className?: string }) {
  const { value } = useSelectContext();
  return <span className={cn("truncate", className)}>{value || placeholder || "Select"}</span>;
}

export const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { open } = useSelectContext();
    if (!open) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn("absolute z-50 mt-2 w-full rounded-md border bg-popover p-1 shadow-md", className)}
        {...props}
      />
    );
  }
);
SelectContent.displayName = "SelectContent";

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, value, onClick, children, ...props }, ref) => {
    const { setValue, setOpen } = useSelectContext();

    return (
      <button
        ref={ref}
        type="button"
        className={cn("flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent", className)}
        onClick={(event) => {
          onClick?.(event);
          setValue(value);
          setOpen(false);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SelectItem.displayName = "SelectItem";
