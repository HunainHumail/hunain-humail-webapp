"use client";

import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { AdminShell } from "../AdminShell";

export function AdminGuard() {
  const {
    configured,
    loading,
    user,
    isAdmin: admin,
    error,
    signInWithGoogle,
    signOut,
  } = useAuth();

  if (!configured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-grid px-6">
        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">
            Admin
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight">
            Firebase not configured
          </h1>
          <p className="mt-4 text-muted">
            Add the Firebase web environment variables, then reload this page.
          </p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-grid px-6">
        <h1 className="font-display text-4xl tracking-tight">Admin</h1>
        <p
          role="status"
          className="font-mono text-xs uppercase tracking-wide text-muted"
        >
          Checking access
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-grid px-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              Admin
            </p>
            <CardTitle>
              <h1 className="font-display text-4xl tracking-tight">Sign in</h1>
            </CardTitle>
            <CardDescription>
              Use the Google account that manages this site.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button type="button" onClick={() => void signInWithGoogle()}>
              Sign in with Google
            </Button>
            {error ? (
              <p role="alert" className="text-sm text-muted">
                {error}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!admin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-grid px-6">
        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">
            Admin
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight">
            Access denied
          </h1>
          <p className="mt-4 text-muted">
            This Google account cannot open the admin.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() => void signOut()}
          >
            Sign out
          </Button>
        </div>
      </main>
    );
  }

  return <AdminShell onSignOut={() => void signOut()} />;
}
