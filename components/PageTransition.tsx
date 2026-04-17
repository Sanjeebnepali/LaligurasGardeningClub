"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

/**
 * Wraps page content. On every route change, fades + slides in
 * the new content. No "cover" overlay — that pattern breaks with
 * the App Router because navigation is near-instant.
 */
export default function PageTransition({ children }: { children?: React.ReactNode }) {
  const ref      = useRef<HTMLDivElement>(null);
  const pathname  = usePathname();
  const mounted  = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!mounted.current) {
      // Very first mount: just ensure visible (no flash)
      gsap.set(el, { opacity: 1, y: 0 });
      mounted.current = true;
      return;
    }

    // Subsequent navigations: slide-fade in
    gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "transform" }
    );
  }, [pathname]);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
