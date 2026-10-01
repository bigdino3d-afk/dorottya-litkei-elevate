import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fade-in on scroll. Content is VISIBLE by default (server HTML and any
 * browser where scripts fail), and is only hidden after mount when it sits
 * below the fold — so text can never get stuck invisible on a phone.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"visible" | "hidden" | "revealed">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    // Already on screen (or above): leave it visible, no animation.
    if (rect.top < window.innerHeight) return;

    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { setState("revealed"); io.disconnect(); }
      },
      { threshold: 0 },
    );
    io.observe(el);
    const t = window.setTimeout(() => setState("revealed"), 3000);
    return () => { io.disconnect(); window.clearTimeout(t); };
  }, []);

  return (
    <Tag
      ref={ref as never}
      style={
        state === "visible"
          ? undefined
          : {
              transitionDelay: `${delay}ms`,
              transitionDuration: "1000ms",
              transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
            }
      }
      className={[
        state === "visible" ? "" : "transition-all",
        state === "hidden" ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
