export const FIELD_TYPES = [
  "text",
  "textarea",
  "markdown",
  "tags",
  "select",
  "image",
  "url",
  "date",
  "switch",
  "records",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: readonly FieldOption[];
  optional?: boolean;
  fields?: readonly FieldConfig[];
  description?: string;
}
