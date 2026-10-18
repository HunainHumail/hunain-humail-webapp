import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Link } from "@/components/atoms/Link";
import { cn } from "@/lib/utils/cn";
import type { NavItem as NavItemData } from "@/lib/schemas/siteSettings";

export interface NavItemProps {
  item: NavItemData;
  active?: boolean;
  className?: string;
  onNavigate?: () => void;
}

export function NavItem({
  item,
  active = false,
  className,
  onNavigate,
}: NavItemProps) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex items-baseline gap-1.5 no-underline transition-colors duration-fast ease-default",
        active ? "text-accent" : "text-muted hover:text-text",
        className,
      )}
      onClick={onNavigate}
    >
      <MonoLabel
        as="span"
        className={active ? "text-accent" : "text-accent/80"}
      >
        {item.number}
      </MonoLabel>
      <MonoLabel as="span" className={active ? "text-accent" : undefined}>
        {item.label}
      </MonoLabel>
    </Link>
  );
}
