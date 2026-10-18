"use client";

import ReactMarkdown from "react-markdown";
import { Label } from "@/components/admin/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { Textarea } from "@/components/admin/ui/textarea";
import { cn } from "@/lib/utils/cn";

export interface MarkdownEditorProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
}

export function MarkdownEditor({
  id,
  label,
  value,
  onChange,
  invalid,
  describedBy,
  className,
}: MarkdownEditorProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Tabs defaultValue="write">
        <TabsList aria-label={`${label} editor`}>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write">
          <Textarea
            id={id}
            value={value}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-40"
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="min-h-40 rounded-lg border border-border bg-surface p-3 text-text">
            {value.trim() ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted">Nothing to preview.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
