export const ADMIN_EMAIL = "hunainhumail786@gmail.com";

export interface AdminIdentity {
  email: string | null;
  emailVerified: boolean;
}

export function isAdmin(user: AdminIdentity | null | undefined): boolean {
  if (!user?.email || !user.emailVerified) {
    return false;
  }

  return user.email.toLowerCase() === ADMIN_EMAIL;
}
