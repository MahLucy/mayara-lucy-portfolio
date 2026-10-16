/**
 * Runs `cb` when the main thread is idle (or soon after, at most `timeout` ms).
 * Used to set up below-the-fold scroll scenes after hydration, so they don't
 * add to the initial blocking time. Their scroll room is reserved in CSS, so
 * creating them later never shifts the layout.
 */
/** Runs each task in its own idle callback, so no single task blocks for long. */
export function eachIdle<T>(items: T[], task: (item: T) => void): () => void {
  let cancel = () => {};
  let i = 0;
  const next = () => {
    if (i >= items.length) return;
    const item = items[i++] as T;
    task(item);
    cancel = onIdle(next, 800);
  };
  cancel = onIdle(next, 800);
  return () => cancel();
}

export function onIdle(cb: () => void, timeout = 1500): () => void {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = globalThis.setTimeout(cb, 300);
  return () => globalThis.clearTimeout(id);
}
