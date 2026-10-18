"use client";

import { useId } from "react";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { Input } from "@/components/atoms/Input";
import { Link } from "@/components/atoms/Link";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { Textarea } from "@/components/atoms/Textarea";
import { VisuallyHidden } from "@/components/atoms/VisuallyHidden";
import { FormField } from "@/components/molecules/FormField";
import { useContactForm } from "@/hooks/useContactForm";
import type { ContactSettings } from "@/lib/schemas/siteSettings";
import { cn } from "@/lib/utils/cn";

export interface ContactSectionProps {
  contact: ContactSettings;
  className?: string;
}

const selectClasses =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-text transition-colors duration-fast ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-50";

export function ContactSection({ contact, className }: ContactSectionProps) {
  const id = useId();
  const nameId = `${id}-name`;
  const emailId = `${id}-email`;
  const topicId = `${id}-topic`;
  const messageId = `${id}-message`;
  const websiteId = `${id}-website`;
  const {
    values,
    errors,
    submitting,
    status,
    submitError,
    setField,
    handleSubmit,
  } = useContactForm(contact.options);

  return (
    <section
      id="contact"
      className={cn("border-t border-border py-16 md:py-20", className)}
      aria-labelledby="contact-section-label"
    >
      <Container>
        <div className="mx-auto mb-10 max-w-xl text-center">
          <MonoLabel id="contact-section-label" as="p" className="mb-2">
            05 · Work with me
          </MonoLabel>
          <Heading level={2} className="mb-4">
            Got something to build?
          </Heading>
          <Text variant="muted" className="mb-6">
            {contact.intro}
          </Text>
          <Link
            href={`mailto:${contact.email}`}
            className="inline-flex items-center rounded-full border border-accent px-4 py-2 text-accent no-underline hover:opacity-90"
          >
            {contact.email}
          </Link>
        </div>

        {status === "success" ? (
          <Text
            className="mx-auto max-w-xl text-center"
            role="status"
            aria-live="polite"
          >
            Thanks. Your message is on its way.
          </Text>
        ) : (
          <form
            className="relative mx-auto flex max-w-xl flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={submitting}
          >
            <FormField id={nameId} label="Name" error={errors.name}>
              <Input
                name="name"
                autoComplete="name"
                value={values.name}
                disabled={submitting}
                onChange={(event) => setField("name", event.target.value)}
              />
            </FormField>
            <FormField id={emailId} label="Email" error={errors.email}>
              <Input
                type="email"
                name="email"
                autoComplete="email"
                value={values.email}
                disabled={submitting}
                onChange={(event) => setField("email", event.target.value)}
              />
            </FormField>
            <FormField id={topicId} label="Topic" error={errors.topic}>
              <select
                name="topic"
                value={values.topic}
                disabled={submitting}
                className={selectClasses}
                onChange={(event) => setField("topic", event.target.value)}
              >
                {contact.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id={messageId} label="Message" error={errors.message}>
              <Textarea
                name="message"
                value={values.message}
                disabled={submitting}
                rows={6}
                onChange={(event) => setField("message", event.target.value)}
              />
            </FormField>
            <VisuallyHidden as="div">
              <label htmlFor={websiteId}>Website</label>
              <input
                id={websiteId}
                name="website"
                value={values.honeypot}
                tabIndex={-1}
                autoComplete="off"
                onChange={(event) => setField("honeypot", event.target.value)}
              />
            </VisuallyHidden>
            {status === "error" && submitError ? (
              <Text variant="small" role="alert">
                {submitError}
              </Text>
            ) : null}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending" : "Send message"}
            </Button>
          </form>
        )}
      </Container>
    </section>
  );
}
