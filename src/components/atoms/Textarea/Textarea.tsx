import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const fieldClasses =
  "w-full min-h-24 rounded-md border border-border bg-surface px-3 py-2 text-base text-text placeholder:text-muted transition-colors duration-fast ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea ref={ref} className={cn(fieldClasses, className)} {...props} />
    );
  },
);
