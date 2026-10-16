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

function can3d(): boolean {
  webgl ??= canUseWebGL();
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  return webgl && !prefersReducedMotion() && !saveData;
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

  // The static illustration covers the first paint; the scene loads on the first sign of a person
  // (mouse move, touch, scroll, or key), so it never competes with the initial page load.
  const events = ["pointermove", "pointerdown", "touchstart", "scroll", "keydown"] as const;
  const onFirst = () => {
    events.forEach((e) => window.removeEventListener(e, onFirst));
    idle(requestStart);
  };
  events.forEach((e) => window.addEventListener(e, onFirst, { passive: true, once: true }));
}

/**
 * Full-stage WebGL layer for the hero. It renders nothing until the first
 * interaction; the static SVG inside the hero anchor covers that time and is
 * also the permanent fallback (no WebGL, reduced motion, Save-Data, errors).
 */
export function HeroScene({ onReadyChange }: { onReadyChange: (ready: boolean) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const supports3d = useSyncExternalStore(subscribeMotion, can3d, () => false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const started = useSyncExternalStore(subscribeStart, () => startRequested, () => false);
  const mode = supports3d && !failed && started ? "3d" : "static";

  // Three.js is heavy: wait for the first interaction, then for an idle moment.
  useEffect(() => {
    if (supports3d) scheduleStart();
  }, [supports3d]);

  useEffect(() => {
    onReadyChange(ready && mode === "3d");
  }, [ready, mode, onReadyChange]);

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
