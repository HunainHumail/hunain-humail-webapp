import {
  cloneElement,
  type ReactElement,
} from "react";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/utils/cn";

type ControlProps = {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactElement<ControlProps>;
}

export function FormField({
  id,
  label,
  error,
  className,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const describedBy = [children.props["aria-describedby"], error ? errorId : undefined]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  const control = cloneElement(children, {
    id,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy.length > 0 ? describedBy : undefined,
  });

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id}>
        <MonoLabel as="span" className="text-text">
          {label}
        </MonoLabel>
      </label>
      {control}
      {error ? (
        <Text id={errorId} variant="small">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
