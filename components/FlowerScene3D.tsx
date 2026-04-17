"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ── Shared petal / leaf geometry (created once at module level) ── */
function mkPetal(len: number, wid: number) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo( wid, len * 0.14,  wid * 0.88, len * 0.62, 0, len);
  s.bezierCurveTo(-wid * 0.88, len * 0.62, -wid, len * 0.14, 0, 0);
  return s;
}
function mkLeaf() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo( 0.2, 0.1,  0.28, 0.35, 0, 0.62);
  s.bezierCurveTo(-0.28, 0.35, -0.2, 0.1, 0, 0);
  return s;
}

const PA = mkPetal(1.30, 0.30); // outer
const PB = mkPetal(1.02, 0.23); // mid
const PC = mkPetal(0.72, 0.16); // inner
const LF = mkLeaf();

/* ── Single flower ── */
interface FP {
  pos: [number, number, number];
  sc?: number; ry?: number;
  ca: string; cb: string; cc: string;
  ph?: number;
}

function Flower({ pos, sc = 1, ry = 0, ca, cb, cc, ph = 0 }: FP) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = clock.elapsedTime + ph;
    g.current.rotation.z = Math.sin(t * 0.35) * 0.038;
  });

  const mat = (c: string, op = 0.86) => (
    <meshStandardMaterial color={c} side={THREE.DoubleSide}
      transparent opacity={op} roughness={0.38} metalness={0.06} />
  );

  return (
    <group ref={g} position={pos} scale={sc} rotation={[0.06, ry, 0]}>
      {/* Short stem — camera is close so only tip is visible */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 1.1, 6]} />
        <meshStandardMaterial color="#1A3A0C" roughness={0.88} />
      </mesh>
      {/* Leaf */}
      <group position={[0.1, -0.28, 0.04]} rotation={[0.2, 0.5, 0.72]}>
        <mesh><shapeGeometry args={[LF]} />
          <meshStandardMaterial color="#1E420E" side={THREE.DoubleSide} roughness={0.78} />
        </mesh>
      </group>

      {/* Outer 8 petals */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={`a${i}`} rotation={[0, (i / 8) * Math.PI * 2, 0]}>
          <group position={[0.17, 0, 0]} rotation={[1.04, 0, 0]}>
            <mesh><shapeGeometry args={[PA]} />{mat(ca, 0.82)}</mesh>
          </group>
        </group>
      ))}
      {/* Mid 7 petals */}
      {Array.from({ length: 7 }, (_, i) => (
        <group key={`b${i}`} rotation={[0, (i / 7) * Math.PI * 2 + Math.PI / 7, 0]}>
          <group position={[0.11, 0, 0]} rotation={[0.70, 0, 0]}>
            <mesh><shapeGeometry args={[PB]} />{mat(cb, 0.88)}</mesh>
          </group>
        </group>
      ))}
      {/* Inner 5 petals */}
      {Array.from({ length: 5 }, (_, i) => (
        <group key={`c${i}`} rotation={[0, (i / 5) * Math.PI * 2, 0]}>
          <group position={[0.05, 0, 0]} rotation={[0.34, 0, 0]}>
            <mesh><shapeGeometry args={[PC]} />{mat(cc, 0.93)}</mesh>
          </group>
        </group>
      ))}

      {/* Pistil */}
      <mesh>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#FAD8E8" emissive="#F8B8D0" emissiveIntensity={0.22} roughness={0.28} />
      </mesh>
      {/* Stamens */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = 0.055 + (i % 3) * 0.018;
        const h = 0.055 + (i % 4) * 0.025;
        return (
          <group key={`s${i}`}>
            <mesh position={[Math.cos(a)*r, h, Math.sin(a)*r]}>
              <cylinderGeometry args={[0.005, 0.005, 0.11, 4]} />
              <meshStandardMaterial color="#F0D0DC" />
            </mesh>
            <mesh position={[Math.cos(a)*r, h+0.07, Math.sin(a)*r]}>
              <sphereGeometry args={[0.010, 5, 5]} />
              <meshStandardMaterial color="#C4A23C" emissive="#C4A23C" emissiveIntensity={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ── Bouquet composition — close-up, camera-facing ── */
const FLOWERS: FP[] = [
  { pos: [ 0.0,  0.10,  0.6], sc: 1.30, ry:  0.2, ca:"#B82B58", cb:"#D14E72", cc:"#F2BCCA", ph:0.0 },
  { pos: [-1.25, 0.18, -0.1], sc: 1.10, ry:  1.8, ca:"#C23060", cb:"#DA6080", cc:"#F5C8D8", ph:1.3 },
  { pos: [ 1.30, 0.12, -0.1], sc: 1.05, ry: -0.6, ca:"#A82048", cb:"#C84868", cc:"#EDB8CC", ph:2.5 },
  { pos: [ 0.0,  0.35, -1.0], sc: 0.88, ry:  0.8, ca:"#C84870", cb:"#DC6888", cc:"#F5C8D8", ph:0.7 },
  { pos: [-0.75,-0.05, -0.7], sc: 0.80, ry:  2.2, ca:"#B82B58", cb:"#CC4468", cc:"#F0C0D0", ph:1.9 },
  { pos: [ 0.75,-0.02, -0.7], sc: 0.82, ry:  3.1, ca:"#C03868", cb:"#D45878", cc:"#F2C4D4", ph:3.2 },
  { pos: [-1.80,-0.15, -1.6], sc: 0.65, ry:  1.1, ca:"#BA3060", cb:"#D05878", cc:"#F0C8D4", ph:2.8 },
  { pos: [ 1.80,-0.12, -1.6], sc: 0.68, ry: -1.1, ca:"#AC2852", cb:"#C44468", cc:"#EEC0CE", ph:0.4 },
];

export default function FlowerScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 4.2], fov: 54 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Fog starts PAST foreground flowers — only background fades */}
      <fog attach="fog" args={["#12042A", 5.5, 10]} />

      <ambientLight intensity={0.80} color="#FFE8F4" />
      <directionalLight position={[2, 6, 5]} intensity={2.4} color="#FFD8EC" />
      <pointLight position={[-2, 2, 3]} intensity={1.0} color="#C83868" distance={7} />
      <pointLight position={[ 2, 1, 3]} intensity={0.55} color="#C4A23C" distance={5} />

      {FLOWERS.map((f, i) => <Flower key={i} {...f} />)}

      <Sparkles count={45} size={0.8} speed={0.12} opacity={0.32} color="#F2BCCA" scale={[5, 4, 4]} />
    </Canvas>
  );
}
