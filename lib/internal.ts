import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { env, isProduction } from "@/lib/env";

export const INTERNAL_ACCESS_COOKIE = "arteforma_internal_access";

export async function requireInternalAccess(token?: string, path = "/internal") {
  if (!isProduction || !env.INTERNAL_ORDERS_TOKEN) {
    return;
  }

  if (token === env.INTERNAL_ORDERS_TOKEN) {
    return;
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(INTERNAL_ACCESS_COOKIE)?.value;

  if (cookieToken === env.INTERNAL_ORDERS_TOKEN) {
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
