/**
 * Tiny mutable store shared between GSAP (DOM side) and the R3F scene.
 * Kept outside React state so scroll updates never trigger re-renders.
 *
 * GSAP is the only writer of motion: it animates the hero anchor element and
 * the `intro` / `progress` values; the scene only reads them.
 */
type Listener = () => void;

export const sceneStore = {
  /** Opening sequence: 0 = huge exploded layers, 1 = settled hero composition. */
  intro: 0,
  /** Hero exit: 0 = settled, 1 = hero scrolled away (layers drift apart). */
  progress: 0,
  /** Normalized pointer position, -1..1 on both axes. */
  pointer: { x: 0, y: 0 },
  /** DOM box the monolith is fitted into (also holds the static SVG). */
  anchor: null as HTMLElement | null,
  listeners: new Set<Listener>(),
  emit() {
    this.listeners.forEach((fn) => fn());
  },
};
