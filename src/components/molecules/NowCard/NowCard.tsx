import { Heading } from "@/components/atoms/Heading";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/utils/cn";

export interface NowCardProps {
  label: string;
  title: string;
  body: string;
  className?: string;
}

export function NowCard({ label, title, body, className }: NowCardProps) {
  return (
    <article
      className={cn(
        "card-lift rounded-xl border border-border bg-surface p-5",
        className,
      )}
    >
      <MonoLabel className="mb-2 block">{label}</MonoLabel>
      <Heading level={3} className="text-xl">
        {title}
      </Heading>
      <Text variant="muted" className="mt-2 text-sm">
        {body}
      </Text>
    </article>
  );
}
