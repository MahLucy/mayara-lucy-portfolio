"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Renders the visitor's current year, so a static build never shows a stale one. */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => new Date().getFullYear(),
  );
  return <span suppressHydrationWarning>{year}</span>;
}
