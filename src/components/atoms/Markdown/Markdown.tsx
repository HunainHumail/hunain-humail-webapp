import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Divider } from "@/components/atoms/Divider";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/utils/cn";

export interface MarkdownProps {
  source: string;
  className?: string;
}

const ALLOWED_ELEMENTS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "ul",
  "ol",
  "li",
  "a",
  "strong",
  "em",
  "code",
  "pre",
  "blockquote",
  "hr",
] as const;

const components: Components = {
  h1: ({ children }) => (
    <Heading level={2} className="text-2xl">
      {children}
    </Heading>
  ),
  h2: ({ children }) => (
    <Heading level={2} className="text-2xl">
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading level={3} className="text-xl">
      {children}
    </Heading>
  ),
  h4: ({ children }) => (
    <Heading level={4} className="text-lg">
      {children}
    </Heading>
  ),
  p: ({ children }) => <Text>{children}</Text>,
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-6 text-text">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 pl-6 text-text">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children }) =>
    href ? <Link href={href}>{children}</Link> : <span>{children}</span>,
  strong: ({ children }) => (
    <strong className="font-semibold text-text">{children}</strong>
  ),
  em: ({ children }) => <em>{children}</em>,
  code: ({ children }) => (
    <code className="rounded-sm bg-elevated px-1 font-mono text-sm text-accent">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg border border-border bg-elevated p-4 font-mono text-sm text-text">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent pl-4 text-muted">
      {children}
    </blockquote>
  ),
  hr: () => <Divider />,
};

export function Markdown({ source, className }: MarkdownProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <ReactMarkdown
        allowedElements={[...ALLOWED_ELEMENTS]}
        unwrapDisallowed
        components={components}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
