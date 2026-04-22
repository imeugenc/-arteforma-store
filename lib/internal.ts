import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { env, isProduction } from "@/lib/env";

export function requireInternalAccess(token?: string) {
  if (isProduction && env.INTERNAL_ORDERS_TOKEN && token !== env.INTERNAL_ORDERS_TOKEN) {
    notFound();
  }
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
