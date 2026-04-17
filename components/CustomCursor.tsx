"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current!;
    const ring = ringRef.current!;
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      gsap.to(dot, { x: mx, y: my, duration: 0.05, ease: "power3.out" });
    };

    const raf = () => {
      rx += (mx - rx) * 0.08;
      ry += (my - ry) * 0.08;
      gsap.set(ring, { x: rx, y: ry });
      requestAnimationFrame(raf);
    };
    raf();

    const addHov = () => {
      ring.classList.add("hov");
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };
    const remHov = () => {
      ring.classList.remove("hov");
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove);
    const els = document.querySelectorAll("a,button,[role=button],input,textarea,select,label");
    els.forEach((el) => {
      el.addEventListener("mouseenter", addHov);
      el.addEventListener("mouseleave", remHov);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cur-dot"  />
      <div ref={ringRef} className="cur-ring" />
    </>
  );
}
