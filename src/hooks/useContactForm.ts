"use client";

import { useCallback, useState, type FormEvent } from "react";
import { contactMessageSchema } from "@/lib/schemas/contactMessage";
import { submitContactMessage } from "@/services/contact";

export type ContactFormStatus = "idle" | "success" | "error";
export type ContactFormField = "name" | "email" | "topic" | "message";

export interface ContactFormValues {
  name: string;
  email: string;
  topic: string;
  message: string;
  honeypot: string;
}

export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

export interface UseContactFormResult {
  values: ContactFormValues;
  errors: ContactFormErrors;
  submitting: boolean;
  status: ContactFormStatus;
  submitError: string | null;
  setField: (field: keyof ContactFormValues, value: string) => void;
  handleSubmit: (event?: FormEvent<HTMLFormElement>) => Promise<void>;
}

const FORM_FIELDS: ContactFormField[] = ["name", "email", "topic", "message"];

function emptyValues(topic: string): ContactFormValues {
  return {
    name: "",
    email: "",
    topic,
    message: "",
    honeypot: "",
  };
}

function fieldErrorsFromZod(error: {
  issues: { path: (string | number)[]; message: string }[];
}): ContactFormErrors {
  const fieldErrors: ContactFormErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (
      typeof key === "string" &&
      FORM_FIELDS.includes(key as ContactFormField) &&
      fieldErrors[key as ContactFormField] === undefined
    ) {
      fieldErrors[key as ContactFormField] = issue.message;
    }
  }
  return fieldErrors;
}

export function useContactForm(
  options: readonly string[],
): UseContactFormResult {
  const initialTopic = options[0] ?? "";
  const [values, setValues] = useState<ContactFormValues>(() =>
    emptyValues(initialTopic),
  );
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = useCallback(
    (field: keyof ContactFormValues, value: string) => {
      setValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      setStatus("idle");
      setSubmitError(null);

      const parsed = contactMessageSchema.safeParse(values);
      if (!parsed.success) {
        setErrors(fieldErrorsFromZod(parsed.error));
        return;
      }

      setErrors({});
      setSubmitting(true);
      try {
        await submitContactMessage(parsed.data);
        setStatus("success");
        setValues(emptyValues(initialTopic));
      } catch {
        setStatus("error");
        setSubmitError(
          "Something went wrong. Try again or email me directly.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [initialTopic, values],
  );

  return {
    values,
    errors,
    submitting,
    status,
    submitError,
    setField,
    handleSubmit,
  };
}
