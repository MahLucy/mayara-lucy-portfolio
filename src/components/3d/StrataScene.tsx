"use client";

import { Edges, Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { layerColors, layerOrder } from "@/lib/layers";
import { sceneStore } from "@/lib/scene-store";

const SLAB = { w: 2.6, h: 0.16, d: 2.6 };
const GAP_OPEN = 1.15;
const GAP_STACKED = 0.3;
const GAP_EXIT = 0.95;
const FADE_IN = 1.4;
const CAMERA_Z = 7.4;
const FOV = 32;
/** World height of the settled monolith on screen, used to fit it into the anchor box. */
const MONO_H = 3.5;

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = THREE.MathUtils.lerp;
const damp = THREE.MathUtils.damp;

/** Deterministic "service modules" sitting on each slab. */
const MODULES: Record<string, [number, number][]> = {
  interface: [[-0.7, 0.55], [0.15, -0.6]],
  api: [[0.7, 0.3], [-0.4, -0.5], [0.05, 0.75]],
  data: [[-0.75, -0.2], [0.55, 0.65]],
  ai: [[0.3, -0.25], [-0.6, 0.6], [0.8, -0.8]],
  cloud: [[-0.2, 0.2], [0.75, -0.55], [-0.8, -0.75]],
};

function gapNow() {
  const open = lerp(GAP_OPEN, GAP_STACKED, smooth(sceneStore.intro));
  return lerp(open, GAP_EXIT, sceneStore.progress);
}

function Slab({ id, index, born }: { id: (typeof layerOrder)[number]; index: number; born: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshPhysicalMaterial>(null);
  const color = layerColors[id];
  const fromCenter = index - (layerOrder.length - 1) / 2;

  useFrame((state) => {
    const g = group.current;
    if (!g || !material.current) return;
    const fade = easeOutExpo(Math.min(1, Math.max(0, (state.clock.elapsedTime - (born.current ?? 0) - index * 0.08) / FADE_IN)));
    const open = 1 - smooth(sceneStore.intro);
    g.position.y = -fromCenter * gapNow();
    // In the opening the slabs are spread in depth and fanned, as if we were standing among them.
    g.position.z = open * fromCenter * 1.1;
    g.position.x = open * fromCenter * -0.35;
    g.rotation.y = open * fromCenter * 0.22 + sceneStore.progress * fromCenter * 0.08;
    material.current.opacity = 0.86 * fade;
  });

  const modules = MODULES[id] ?? [];

  return (
    <group ref={group}>
      <RoundedBox args={[SLAB.w, SLAB.h, SLAB.d]} radius={0.05} smoothness={3}>
        <meshPhysicalMaterial
          ref={material}
          color={color}
          roughness={0.28}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.2}
          transparent
          opacity={0}
        />
        <Edges threshold={20} color={id === "interface" ? "#9aa6c4" : "#f1f5fa"} />
      </RoundedBox>
      {modules.map(([x, z], i) => (
        <mesh key={i} position={[x, SLAB.h / 2 + 0.07, z]}>
          <boxGeometry args={[0.28, 0.14, 0.28]} />
          <meshStandardMaterial color={id === "interface" ? "#0b1020" : "#f1f5fa"} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function SecurityEnvelope() {
  const ref = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), []);

  useEffect(() => {
    ref.current?.computeLineDistances();
    return () => geometry.dispose();
  }, [geometry]);

  useFrame(() => {
    const line = ref.current;
    if (!line) return;
    const height = gapNow() * (layerOrder.length - 1) + SLAB.h + 0.7;
    const open = 1 - smooth(sceneStore.intro);
    line.scale.set(SLAB.w + 0.6 + open * 2, height, SLAB.d + 0.6 + open * 2);
    (line.material as THREE.LineDashedMaterial).opacity = 0.25 + 0.75 * smooth(sceneStore.intro);
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineDashedMaterial color={layerColors.security} dashSize={0.08} gapSize={0.08} transparent />
    </lineSegments>
  );
}

/**
 * Fits the monolith into the DOM anchor box every frame. GSAP animates the
 * anchor (size and position) on scroll; the scene converts that box from
 * pixels to world units, so DOM fallback and WebGL always agree.
 */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const born = useRef(0);
  const target = useRef({ x: 0, y: 0, s: 1 });

  useEffect(() => {
    const wake = () => invalidate();
    sceneStore.listeners.add(wake);
    window.addEventListener("resize", wake);
    return () => {
      sceneStore.listeners.delete(wake);
      window.removeEventListener("resize", wake);
    };
  }, [invalidate]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const intro = smooth(sceneStore.intro);
    const p = sceneStore.progress;

    const anchor = sceneStore.anchor;
    if (anchor) {
      const a = anchor.getBoundingClientRect();
      const c = state.gl.domElement.getBoundingClientRect();
      const unitsPerPx = (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z) / Math.max(1, c.height);
      target.current.x = (a.left + a.width / 2 - (c.left + c.width / 2)) * unitsPerPx;
      target.current.y = -(a.top + a.height / 2 - (c.top + c.height / 2)) * unitsPerPx;
      target.current.s = (a.height * unitsPerPx) / MONO_H;
    }

    // Position and scale follow the anchor directly (GSAP already smooths the scroll).
    g.position.set(target.current.x, target.current.y, 0);
    g.scale.setScalar(target.current.s * (1 + p * 0.12));

    // Rotation: a steep, dramatic angle in the opening that settles into the isometric view.
    const ry = lerp(-1.25, -0.65, intro) + sceneStore.pointer.x * 0.28 * intro + p * 0.5;
    const rx = lerp(0.95, 0.42, intro) + sceneStore.pointer.y * 0.1 * intro - p * 0.18;
    g.rotation.y = damp(g.rotation.y, ry, 5, delta);
    g.rotation.x = damp(g.rotation.x, rx, 5, delta);

    const fading = state.clock.elapsedTime - born.current < FADE_IN + 0.6;
    const settling = Math.abs(g.rotation.y - ry) > 0.0005 || Math.abs(g.rotation.x - rx) > 0.0005;
    // Demand-driven loop: render only while something is still moving.
    if (fading || settling) state.invalidate();
  });

  return (
    <group ref={group} rotation={[0.95, -1.25, 0]}>
      {layerOrder.map((id, i) => (
        <Slab key={id} id={id} index={i} born={born} />
      ))}
      {children}
    </group>
  );
}

export default function StrataScene({ active, onReady }: { active: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop={active ? "demand" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        onReady();
      }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, -2, -3]} intensity={0.4} color="#52e6d0" />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1} color="#486bff" position={[-4, 0, 2]} scale={[2, 6, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#d8ff68" position={[4, -1, 1]} scale={[2, 4, 1]} />
      </Environment>
      <Rig>
        <SecurityEnvelope />
      </Rig>
    </Canvas>
  );
}
