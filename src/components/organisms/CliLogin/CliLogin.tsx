import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import type { CliLoginStatus } from "@/hooks/useCliLogin";
import { cn } from "@/lib/utils/cn";

export interface CliLoginProps {
  status: CliLoginStatus;
  code: string;
  error: string | null;
  onConfirm: () => void;
  className?: string;
}

function headingFor(status: CliLoginStatus): string {
  switch (status) {
    case "unconfigured":
      return "Firebase not configured";
    case "invalid":
      return "Missing login details";
    case "done":
      return "Done — return to the terminal";
    case "error":
      return "Could not authorize";
    default:
      return "Confirm this code";
  }
}

export function CliLogin({
  status,
  code,
  error,
  onConfirm,
  className,
}: CliLoginProps) {
  const showCode = status === "confirm" || status === "signing-in";
  const showConfirm = status === "confirm" || status === "signing-in";

  return (
    <Container
      as="main"
      className={cn(
        "flex min-h-full flex-1 flex-col justify-center py-20",
        className,
      )}
    >
      <MonoLabel>CMS CLI</MonoLabel>
      <Heading level={1} size="section" className="mt-4 max-w-3xl">
        {headingFor(status)}
      </Heading>
      {status === "loading" ? (
        <Text variant="muted" className="mt-6" role="status">
          Loading login request
        </Text>
      ) : null}
      {status === "unconfigured" ? (
        <Text variant="muted" className="mt-6">
          Add the Firebase web environment variables, then reload this page.
        </Text>
      ) : null}
      {status === "invalid" ? (
        <Text variant="muted" className="mt-6">
          Open the URL printed by <span className="font-mono">cms login</span>{" "}
          so this page can confirm the session and user code.
        </Text>
      ) : null}
      {showCode ? (
        <>
          <Text variant="muted" className="mt-6 max-w-xl">
            Check that this code matches the one in your terminal before
            signing in.
          </Text>
          <p
            className="mt-8 font-mono text-4xl tracking-wide text-accent"
            aria-label={`User code ${code}`}
          >
            {code}
          </p>
        </>
      ) : null}
      {showConfirm ? (
        <Button
          type="button"
          className="mt-10 self-start"
          disabled={status === "signing-in"}
          onClick={onConfirm}
        >
          {status === "signing-in"
            ? "Signing in"
            : "Code matches — continue with Google"}
        </Button>
      ) : null}
      {status === "done" ? (
        <Text variant="muted" className="mt-6" role="status">
          The terminal can finish login. You can close this tab.
        </Text>
      ) : null}
      {status === "error" && error ? (
        <Text variant="muted" className="mt-6" role="alert">
          {error}
        </Text>
      ) : null}
    </Container>
  );
}
