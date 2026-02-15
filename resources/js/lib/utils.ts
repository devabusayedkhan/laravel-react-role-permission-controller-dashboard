import type { InertiaLinkProps } from "@inertiajs/react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toUrl(
  url?: InertiaLinkProps["href"]
): string {
  if (!url) return "";

  // string href
  if (typeof url === "string") return url;

  // object href (Inertia)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyUrl = url as any;

  if (typeof anyUrl?.url === "string") {
    return anyUrl.url;
  }

  // fallback
  return "";
}
