"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Rose petal shape via bezier curves ── */
function usePetalGeo() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo( 0.14,  0.20,  0.24,  0.42, 0,    0.68);
    s.bezierCurveTo(-0.24,  0.42, -0.14,  0.20, 0,    0);
    return new THREE.ShapeGeometry(s, 8);
  }, []);
}

const PALETTE = [
  "#D14E72", // rose light
  "#B82B58", // rose deep
  "#F2BCCA", // petal pink
  "#E8A0B4", // blush
  "#C4A23C", // gold accent
  "#FDF8F0", // cream white
  "#8B1A3E", // deep burgundy
];

/* ── All random values computed once at module load, outside render ── */
const PETAL_COUNT = 38;
const PETAL_DATA = Array.from({ length: PETAL_COUNT }, (_, i) => ({
  id:       i,
  pos: [
    (Math.random() - 0.5) * 22,
    (Math.random() - 0.5) * 14,
    (Math.random() - 0.5) * 6 - 2,
  ] as [number, number, number],
  rot: [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI,
  ] as [number, number, number],
  spd:      0.18 + Math.random() * 0.52,
  sc:       0.22 + Math.random() * 0.62,
  phase:    Math.random() * Math.PI * 2,   // replaces useRef(Math.random())
  opacity:  0.28 + Math.random() * 0.25,  // replaces Math.random() inside useMemo
  colorIdx: i % PALETTE.length,
}));

/* ── Petal ── */
function Petal({
  pos, rot, spd, sc, colorIdx, phase, opacity,
}: {
  pos:      [number, number, number];
  rot:      [number, number, number];
  spd:      number;
  sc:       number;
  colorIdx: number;
  phase:    number;
  opacity:  number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = usePetalGeo();
  const t   = useRef(phase); // stable initial phase, no Math.random() in render

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PALETTE[colorIdx % PALETTE.length],
        transparent: true,
        opacity,            // passed from stable module-level data
        side: THREE.DoubleSide,
        roughness: 0.95,
      }),
    [colorIdx, opacity]
  );

  useFrame((_, d) => {
    t.current += d * spd;
    if (!ref.current) return;
    ref.current.position.x = pos[0] + Math.sin(t.current * 0.55) * 0.5;
    ref.current.position.y = pos[1] + Math.cos(t.current * 0.45) * 0.55;
    ref.current.position.z = pos[2];
    ref.current.rotation.z = rot[2] + Math.sin(t.current * 0.35) * 0.45;
    ref.current.rotation.y += d * spd * 0.28;
    ref.current.rotation.x += d * spd * 0.12;
  });

  return (
    <mesh ref={ref} geometry={geo} material={mat} position={pos} rotation={rot} scale={sc} />
  );
}

/* ── Scene ── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]}   intensity={0.8} color="#D14E72" />
      <pointLight position={[-5, -3, 2]} intensity={0.4} color="#C4A23C" />
      {PETAL_DATA.map((p) => (
        <Petal key={p.id} {...p} />
      ))}
    </>
  );
}

export default function ThreeLeaves() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 52 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Scene />
    </Canvas>
  );
}
