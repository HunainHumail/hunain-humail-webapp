"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import { BlueprintError } from "@/lib/blueprint/errors";
import { buildContactPrefill, specToText } from "@/lib/blueprint/specToText";
import {
  blueprintRequestSchema,
  type BlueprintPlatform,
  type BlueprintSpec,
  type ContactPrefill,
} from "@/lib/schemas/blueprint";
import { generateBlueprint, warmUpBlueprint } from "@/services/blueprint";

export type BlueprintFormField = "email" | "idea";
export type BlueprintGeneratorStatus = "idle" | "loading" | "success" | "error";

export interface UseBlueprintGeneratorResult {
  email: string;
  idea: string;
  platform: BlueprintPlatform;
  errors: Partial<Record<BlueprintFormField, string>>;
  status: BlueprintGeneratorStatus;
  errorKind: BlueprintError["kind"] | null;
  result: { leadId: string; spec: BlueprintSpec } | null;
  copied: boolean;
  setField: (field: BlueprintFormField, value: string) => void;
  setPlatform: (platform: BlueprintPlatform) => void;
  validateField: (field: BlueprintFormField) => void;
  pickExample: (text: string) => void;
  warmUp: () => void;
  submit: (event?: FormEvent<HTMLFormElement>) => Promise<void>;
  retry: () => Promise<void>;
  copyPlan: () => Promise<void>;
  discussPrefill: () => ContactPrefill | null;
}

function fieldErrorsFromZod(error: {
  issues: { path: (string | number)[]; message: string }[];
}): Partial<Record<BlueprintFormField, string>> {
  const out: Partial<Record<BlueprintFormField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if ((key === "email" || key === "idea") && out[key] === undefined) {
      out[key] = issue.message;
    }
  }
  return out;
}

export function useBlueprintGenerator(): UseBlueprintGeneratorResult {
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [platform, setPlatformState] = useState<BlueprintPlatform>("mobile");
  const [errors, setErrors] = useState<
    Partial<Record<BlueprintFormField, string>>
  >({});
  const [status, setStatus] = useState<BlueprintGeneratorStatus>("idle");
  const [errorKind, setErrorKind] = useState<BlueprintError["kind"] | null>(
    null,
  );
  const [result, setResult] = useState<{
    leadId: string;
    spec: BlueprintSpec;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const inFlight = useRef(false);
  const warmedUp = useRef(false);

  const warmUp = useCallback(() => {
    if (warmedUp.current) {
      return;
    }
    warmedUp.current = true;
    void warmUpBlueprint();
  }, []);

  const setField = useCallback((field: BlueprintFormField, value: string) => {
    if (field === "email") {
      setEmail(value);
    } else {
      setIdea(value);
    }
    setErrors((current) => ({ ...current, [field]: undefined }));
  }, []);

  const setPlatform = useCallback((next: BlueprintPlatform) => {
    setPlatformState(next);
  }, []);

  const validateField = useCallback(
    (field: BlueprintFormField) => {
      const parsed = blueprintRequestSchema.safeParse({ email, idea, platform });
      if (parsed.success) {
        setErrors((current) => ({ ...current, [field]: undefined }));
        return;
      }
      const fieldErrors = fieldErrorsFromZod(parsed.error);
      if (fieldErrors[field]) {
        setErrors((current) => ({ ...current, [field]: fieldErrors[field] }));
      }
    },
    [email, idea, platform],
  );

  const pickExample = useCallback((text: string) => {
    setIdea(text);
    setErrors((current) => ({ ...current, idea: undefined }));
  }, []);

  const submit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      if (inFlight.current) {
        return;
      }

      const parsed = blueprintRequestSchema.safeParse({ email, idea, platform });
      if (!parsed.success) {
        setErrors(fieldErrorsFromZod(parsed.error));
        return;
      }

      setErrors({});
      setErrorKind(null);
      setCopied(false);
      inFlight.current = true;
      setStatus("loading");

      try {
        const response = await generateBlueprint(parsed.data);
        setResult(response);
        setStatus("success");
      } catch (error: unknown) {
        setStatus("error");
        setErrorKind(
          error instanceof BlueprintError ? error.kind : "unknown",
        );
      } finally {
        inFlight.current = false;
      }
    },
    [email, idea, platform],
  );

  const retry = useCallback(async () => {
    await submit();
  }, [submit]);

  const copyPlan = useCallback(async () => {
    if (!result?.spec) {
      return;
    }
    await navigator.clipboard.writeText(specToText(result.spec));
    setCopied(true);
  }, [result]);

  const discussPrefill = useCallback((): ContactPrefill | null => {
    if (!result) {
      return null;
    }
    return {
      email,
      blueprintLeadId: result.leadId,
      message: buildContactPrefill(result.spec, idea),
    };
  }, [email, idea, result]);

  return {
    email,
    idea,
    platform,
    errors,
    status,
    errorKind,
    result,
    copied,
    setField,
    setPlatform,
    validateField,
    pickExample,
    warmUp,
    submit,
    retry,
    copyPlan,
    discussPrefill,
  };
}
