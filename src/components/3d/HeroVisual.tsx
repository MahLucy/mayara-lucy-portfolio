"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { sceneStore } from "@/lib/scene-store";
import { canUseWebGL, prefersReducedMotion } from "@/lib/webgl";

const StrataScene = dynamic(() => import("./StrataScene"), { ssr: false });

/** If the WebGL scene throws, keep the static illustration instead of breaking the page. */
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

let webgl: boolean | null = null;

/** Media query where the WebGL opening runs; smaller screens use the SVG illustration. */
export const scene3dQuery = "(min-width: 1024px)";

function can3d(): boolean {
  webgl ??= canUseWebGL();
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  // Phones and tablets get the SVG version of the opening: same choreography, no Three.js cost.
  return webgl && !prefersReducedMotion() && !saveData && window.matchMedia(scene3dQuery).matches;
}

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

let startRequested = false;
const startListeners = new Set<() => void>();

function subscribeStart(fn: () => void) {
  startListeners.add(fn);
  return () => startListeners.delete(fn);
}

function requestStart() {
  if (startRequested) return;
  startRequested = true;
  startListeners.forEach((fn) => fn());
}

function scheduleStart() {
  if (startRequested) return;
  const idle = (cb: () => void) =>
    "requestIdleCallback" in window ? window.requestIdleCallback(cb, { timeout: 2500 }) : globalThis.setTimeout(cb, 1200);

  // The scene is the hero's opening, so it starts on its own as soon as the page has
  // loaded (in an idle moment). Any interaction before that starts it right away.
  const events = ["pointermove", "pointerdown", "touchstart", "scroll", "keydown"] as const;
  const go = () => {
    events.forEach((e) => window.removeEventListener(e, go));
    window.removeEventListener("load", onLoad);
    requestStart();
  };
  const onLoad = () => idle(go);
  events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad, { once: true });
}

/**
 * - pending: not known yet (server render / before hydration) — CSS decides.
 * - loading: WebGL will be used; nothing is shown until the scene fades in.
 * - ready:   the WebGL scene is on screen.
 * - static:  no WebGL scene (unsupported, reduced motion, Save-Data, error or too slow):
 *            the SVG illustration is the visual.
 */
export type SceneStatus = "pending" | "loading" | "ready" | "static";

/** If the scene isn't up after this long, show the static illustration instead of nothing. */
const SLOW_SCENE_MS = 6000;

/**
 * Full-stage WebGL layer for the hero. It starts right after the page loads and
 * fades in; the static SVG inside the hero anchor is only the fallback (no
 * WebGL, reduced motion, Save-Data, errors), never a placeholder that gets swapped.
 */
export function HeroScene({ onStatusChange }: { onStatusChange: (status: SceneStatus) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const supports3d = useSyncExternalStore<boolean | null>(subscribeMotion, can3d, () => null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);
  const [visible, setVisible] = useState(true);
  const started = useSyncExternalStore(subscribeStart, () => startRequested, () => false);
  const mode = supports3d && !failed && started ? "3d" : "static";
  const status: SceneStatus =
    supports3d === null ? "pending" : !supports3d || failed ? "static" : ready ? "ready" : slow ? "static" : "loading";

  useEffect(() => {
    if (!supports3d) return;
    scheduleStart();
    const id = window.setTimeout(() => setSlow(true), SLOW_SCENE_MS);
    return () => window.clearTimeout(id);
  }, [supports3d]);

  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  useEffect(() => {
    const el = root.current;
    if (!el || mode !== "3d") return;
    const io = new IntersectionObserver(([entry]) => {
      const isVisible = entry?.isIntersecting ?? false;
      setVisible(isVisible);
      if (isVisible) sceneStore.emit();
    });
    io.observe(el);

    const fine = window.matchMedia("(pointer: fine)");
    const onMove = (e: PointerEvent) => {
      if (!fine.matches) return;
      sceneStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneStore.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      sceneStore.emit();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [mode]);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {mode === "3d" && (
        <SceneBoundary
          onError={() => {
            setReady(false);
            setFailed(true);
          }}
        >
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
            <StrataScene active={visible} onReady={() => setReady(true)} />
          </div>
        </SceneBoundary>
      )}
    </div>
  );
}
