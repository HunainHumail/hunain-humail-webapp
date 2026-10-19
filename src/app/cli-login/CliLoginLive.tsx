"use client";

import { CliLoginTemplate } from "@/components/templates/CliLoginTemplate";
import { useCliLogin } from "@/hooks/useCliLogin";

export function CliLoginLive() {
  const { status, code, error, confirmAndSignIn } = useCliLogin();

  return (
    <CliLoginTemplate
      status={status}
      code={code}
      error={error}
      onConfirm={() => {
        void confirmAndSignIn();
      }}
    />
  );
}
