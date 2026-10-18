import { Chip } from "@/components/atoms/Chip";
import { cn } from "@/lib/utils/cn";

export interface ChipListProps {
  items: string[];
  className?: string;
  "aria-label"?: string;
}

export function ChipList({
  items,
  className,
  "aria-label": ariaLabel = "Roles and focus areas",
}: ChipListProps) {
  return (
    <ul
      className={cn("flex flex-wrap gap-2", className)}
      aria-label={ariaLabel}
    >
      {items.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}
