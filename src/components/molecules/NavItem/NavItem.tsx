import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Link } from "@/components/atoms/Link";
import { cn } from "@/lib/utils/cn";
import type { NavItem as NavItemData } from "@/lib/schemas/siteSettings";

export interface NavItemProps {
  item: NavItemData;
  className?: string;
  onNavigate?: () => void;
}

export function NavItem({ item, className, onNavigate }: NavItemProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "inline-flex items-baseline gap-1.5 text-muted no-underline transition-colors duration-fast hover:text-text",
        className,
      )}
      onClick={onNavigate}
    >
      <MonoLabel as="span" className="text-accent">
        {item.number}
      </MonoLabel>
      <MonoLabel as="span">{item.label}</MonoLabel>
    </Link>
  );
}
