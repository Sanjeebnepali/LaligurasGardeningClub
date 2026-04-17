"use client";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function createPetalShape(length: number, width: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo( width,        length * 0.12,  width * 0.85,  length * 0.58, 0, length);
  s.bezierCurveTo(-width * 0.85, length * 0.58, -width,         length * 0.12, 0, 0);
  return s;
}

interface PetalProps {
  angle: number; tilt: number; offset: number;
  length: number; width: number; color: string;
  emissive?: string; opacity?: number;
}
function Petal({ angle, tilt, offset, length, width, color, emissive, opacity = 0.88 }: PetalProps) {
  const shape = useMemo(() => createPetalShape(length, width), [length, width]);
  return (
    <group rotation={[0, angle, 0]}>
      <group position={[offset, 0, 0]} rotation={[tilt, 0, 0]}>
        <mesh>
          <shapeGeometry args={[shape]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive ?? color}
            emissiveIntensity={0.08}
            side={THREE.DoubleSide}
            transparent opacity={opacity}
            roughness={0.38} metalness={0.12}
          />
        </mesh>
      </group>
    </group>
  );
}

function FlowerGroup() {
  const groupRef = useRef<THREE.Group>(null);

  const stamens = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const r = 0.06 + (i % 3) * 0.022;
      const h = 0.07 + (i % 5) * 0.032;
      return { x: Math.cos(a) * r, z: Math.sin(a) * r, h };
    }), []);

  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.scale.setScalar(0);
    g.rotation.y = -Math.PI * 0.25;
    gsap.to(g.scale, { x: 1, y: 1, z: 1, duration: 2.0, ease: "elastic.out(1, 0.4)", delay: 0.3 });
    gsap.to(g.rotation, { y: 0, duration: 1.5, ease: "power3.out", delay: 0.3 });
  }, []);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y += 0.003;
    g.position.y = Math.sin(t * 0.45) * 0.1;
    g.rotation.z = Math.sin(t * 0.28) * 0.035;
  });

  return (
    <group ref={groupRef}>
      {/* Inner center light */}
      <pointLight position={[0, 0.2, 0]} intensity={1.8} color="#FFD0E0" distance={2.5} />

      {/* Outermost petals — 8, wide spread */}
      {Array.from({ length: 8 }, (_, i) => (
        <Petal key={`a${i}`}
          angle={(i / 8) * Math.PI * 2}
          tilt={1.12} offset={0.22} length={1.6} width={0.36}
          color="#A8244E" emissive="#C42B5A" opacity={0.78}
        />
      ))}
      {/* Outer mid petals — 8, rotated 22.5°, slightly less spread */}
      {Array.from({ length: 8 }, (_, i) => (
        <Petal key={`b${i}`}
          angle={(i / 8) * Math.PI * 2 + Math.PI / 8}
          tilt={1.0} offset={0.18} length={1.4} width={0.32}
          color="#C23060" emissive="#D14E72" opacity={0.82}
        />
      ))}
      {/* Mid petals — 7 */}
      {Array.from({ length: 7 }, (_, i) => (
        <Petal key={`c${i}`}
          angle={(i / 7) * Math.PI * 2}
          tilt={0.74} offset={0.12} length={1.15} width={0.26}
          color="#D14E72" emissive="#E07090" opacity={0.88}
        />
      ))}
      {/* Inner petals — 5, upright */}
      {Array.from({ length: 5 }, (_, i) => (
        <Petal key={`d${i}`}
          angle={(i / 5) * Math.PI * 2 + Math.PI / 5}
          tilt={0.4} offset={0.05} length={0.85} width={0.19}
          color="#F2BCCA" emissive="#F9D0DC" opacity={0.93}
        />
      ))}

      {/* Pistil */}
      <mesh>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color="#FAD8E8" emissive="#F9C0D8" emissiveIntensity={0.25} roughness={0.25} metalness={0.3} />
      </mesh>
      {/* Stamen filaments */}
      {stamens.map((s, i) => (
        <mesh key={`sf${i}`} position={[s.x, s.h, s.z]}>
          <cylinderGeometry args={[0.006, 0.006, 0.16, 5]} />
          <meshStandardMaterial color="#F5D0E0" roughness={0.5} />
        </mesh>
      ))}
      {/* Gold anther tips */}
      {stamens.map((s, i) => (
        <mesh key={`sa${i}`} position={[s.x, s.h + 0.09, s.z]}>
          <sphereGeometry args={[0.014, 7, 7]} />
          <meshStandardMaterial color="#C4A23C" emissive="#C4A23C" emissiveIntensity={0.3} roughness={0.25} metalness={0.5} />
        </mesh>
      ))}

      {/* Subtle disc glow beneath */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#B82B58" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

export default function AuthFlower3D() {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 3.6], fov: 44 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 7, 4]} intensity={1.6} color="#FFE8F0" />
      <pointLight position={[-2.5, 3, -1.5]} intensity={1.0} color="#B82B58" />
      <pointLight position={[2.5, 1, 2.5]} intensity={0.6} color="#C4A23C" />
      <pointLight position={[0, -2, 0]} intensity={0.3} color="#7B21A8" />

      <FlowerGroup />

      <Sparkles count={70} size={1.2} speed={0.18} opacity={0.45} color="#F2BCCA" scale={[3.5, 4.5, 3.5]} />
    </Canvas>
  );
}
