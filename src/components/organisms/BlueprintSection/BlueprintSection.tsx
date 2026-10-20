"use client";

import { useId, useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Input } from "@/components/atoms/Input";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { Textarea } from "@/components/atoms/Textarea";
import { BlueprintLoading } from "@/components/molecules/BlueprintLoading";
import { FilterTabs } from "@/components/molecules/FilterTabs";
import { FormField } from "@/components/molecules/FormField";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { BlueprintCanvas } from "@/components/organisms/BlueprintCanvas";
import { useBlueprintGenerator } from "@/hooks/useBlueprintGenerator";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { BlueprintContent, ContactPrefill } from "@/lib/schemas/blueprint";
import { cn } from "@/lib/utils/cn";

export interface BlueprintSectionProps {
  content: BlueprintContent;
  onDiscuss: (prefill: ContactPrefill) => void;
  index?: string;
  className?: string;
}

const PLATFORM_TABS = [
  { value: "mobile" as const, label: "Mobile" },
  { value: "web" as const, label: "Web" },
];

export function BlueprintSection({
  content,
  onDiscuss,
  index = "AI",
  className,
}: BlueprintSectionProps) {
  const id = useId();
  const emailId = `${id}-email`;
  const ideaId = `${id}-idea`;
  const counterId = `${id}-counter`;
  const resultRef = useRef<HTMLDivElement>(null);
  useScrollReveal(resultRef);

  const {
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
  } = useBlueprintGenerator();

  const errorMessage =
    errorKind !== null ? content.errors[errorKind] : content.errors.unknown;

  return (
    <section
      id="blueprint"
      aria-labelledby="blueprint-heading"
      className={cn(
        "border-t border-border py-section md:py-section-lg",
        className,
      )}
    >
      <Container>
        <SectionHeader
          index={index}
          eyebrow={content.eyebrow}
          title={content.title}
          titleId="blueprint-heading"
          className="mb-6"
        />
        <Text variant="muted" className="mb-8 max-w-2xl">
          {content.intro}
        </Text>

        <form
          className="mb-10 grid max-w-3xl gap-4 md:grid-cols-2"
          onSubmit={submit}
          noValidate
          aria-busy={status === "loading"}
        >
          <FormField
            id={emailId}
            label={content.emailLabel}
            error={errors.email}
            className="md:col-span-2"
          >
            <Input
              id={emailId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              className="min-h-11"
              value={email}
              disabled={status === "loading"}
              onFocus={warmUp}
              onBlur={() => validateField("email")}
              onChange={(event) => setField("email", event.target.value)}
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField
              id={ideaId}
              label={content.ideaLabel}
              error={errors.idea}
            >
              <Textarea
                id={ideaId}
                name="idea"
                rows={5}
                maxLength={1000}
                value={idea}
                disabled={status === "loading"}
                aria-describedby={counterId}
                onFocus={warmUp}
                onChange={(event) => setField("idea", event.target.value)}
              />
            </FormField>
            <MonoLabel id={counterId} className="mt-1 block text-right">
              {`${idea.length}/1000`}
            </MonoLabel>
          </div>

          <div className="md:col-span-2">
            <Text as="p" variant="muted" className="mb-2 text-sm">
              {content.platformLabel}
            </Text>
            <FilterTabs
              aria-label="Platform"
              tabs={PLATFORM_TABS}
              value={platform}
              onChange={setPlatform}
            />
          </div>

          <Text as="p" variant="muted" className="text-sm md:col-span-2">
            {content.consent}
          </Text>

          <Button
            type="submit"
            size="lg"
            className="w-full md:col-span-2 md:w-auto"
            disabled={status === "loading"}
          >
            {content.submitLabel}
          </Button>
        </form>

        {status === "idle" ? (
          <div className="space-y-8">
            <div>
              <MonoLabel className="mb-3 block">Try an idea</MonoLabel>
              <div className="flex flex-wrap gap-2">
                {content.examples.map((example) => (
                  <Button
                    key={example}
                    type="button"
                    variant="pill"
                    size="sm"
                    aria-label={`Use example: ${example}`}
                    onClick={() => pickExample(example)}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <MonoLabel className="mb-4 block">Sample blueprint</MonoLabel>
              <BlueprintCanvas spec={content.sample} copyLabel={content.copyLabel} />
            </div>
          </div>
        ) : null}

        {status === "loading" ? (
          <BlueprintLoading platform={platform} label={content.loadingLabel} />
        ) : null}

        {status === "error" ? (
          <div className="space-y-4">
            <Text role="alert">{errorMessage}</Text>
            <Button type="button" variant="ghost" onClick={() => void retry()}>
              {content.retryLabel}
            </Button>
          </div>
        ) : null}

        {status === "success" && result ? (
          <div ref={resultRef} data-reveal>
            <BlueprintCanvas
              spec={result.spec}
              copyLabel={content.copyLabel}
              copied={copied}
              onCopy={() => void copyPlan()}
              actions={
                <Button
                  type="button"
                  onClick={() => {
                    const prefill = discussPrefill();
                    if (prefill) {
                      onDiscuss(prefill);
                    }
                  }}
                >
                  {content.discussLabel}
                </Button>
              }
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
