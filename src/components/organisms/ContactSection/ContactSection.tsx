"use client";

import { useId } from "react";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Input } from "@/components/atoms/Input";
import { Link } from "@/components/atoms/Link";
import { Text } from "@/components/atoms/Text";
import { Textarea } from "@/components/atoms/Textarea";
import { VisuallyHidden } from "@/components/atoms/VisuallyHidden";
import { FormField } from "@/components/molecules/FormField";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { useContactForm } from "@/hooks/useContactForm";
import type { ContactSettings } from "@/lib/schemas/siteSettings";
import { cn } from "@/lib/utils/cn";

export interface ContactSectionProps {
  contact: ContactSettings;
  index?: string;
  label?: string;
  className?: string;
}

const selectClasses =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-text transition-colors duration-fast ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-50";

export function ContactSection({
  contact,
  index = "05",
  label = "Contact",
  className,
}: ContactSectionProps) {
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
      className={cn("border-t border-border py-section md:py-section-lg", className)}
      aria-labelledby="contact-heading"
    >
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <SectionHeader
            index={index}
            eyebrow={label}
            title="Got something to build?"
            titleId="contact-heading"
            className="mb-6 justify-center sm:justify-center"
          />
          <Text variant="muted" className="mb-6">
            {contact.intro}
          </Text>
          <Link
            href={`mailto:${contact.email}`}
            className="inline-flex items-center rounded-full border border-accent bg-transparent px-5 py-2.5 text-accent no-underline hover:bg-accent hover:text-accent-contrast"
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
