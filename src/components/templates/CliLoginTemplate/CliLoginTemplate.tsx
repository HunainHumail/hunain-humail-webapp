import { CliLogin, type CliLoginProps } from "@/components/organisms/CliLogin";
import { cn } from "@/lib/utils/cn";

export interface CliLoginTemplateProps extends CliLoginProps {
  className?: string;
}

export function CliLoginTemplate({
  className,
  ...login
}: CliLoginTemplateProps) {
  return (
    <div className={cn("flex min-h-full flex-col bg-grid", className)}>
      <CliLogin {...login} />
    </div>
  );
}
