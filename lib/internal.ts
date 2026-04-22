import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { env, isProduction } from "@/lib/env";

export const INTERNAL_ACCESS_COOKIE = "arteforma_internal_access";

export function getInternalSecret() {
  return env.ADMIN_PASSWORD || env.INTERNAL_ORDERS_TOKEN;
}

export function isInternalProtectionEnabled() {
  return Boolean(isProduction && getInternalSecret());
}

export function hasValidInternalSecret(value?: string | null) {
  const secret = getInternalSecret();

  if (!secret) {
    return true;
  }

  return value === secret;
}

export async function requireInternalAccess(token?: string, path = "/internal") {
  const secret = getInternalSecret();

  if (!isProduction || !secret) {
    return;
  }

  if (token === secret) {
    return;
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(INTERNAL_ACCESS_COOKIE)?.value;

  if (cookieToken === secret) {
    return;
  }

  redirect(`/internal/login?next=${encodeURIComponent(path)}`);
}

export function buildInternalMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    alternates: {
      canonical: path,
    },
  };
}
