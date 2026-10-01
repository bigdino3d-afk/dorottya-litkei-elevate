import { useEffect, useRef, useState, type ReactNode } from "react";

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
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
    // threshold 0: tall blocks (long articles) would never reach a ratio on small phones
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { setShown(true); io.disconnect(); }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    // Safety net: never leave content hidden
    const t = window.setTimeout(() => setShown(true), 2500);
    return () => { io.disconnect(); window.clearTimeout(t); };
  }, []);

  return (
    <Tag
      ref={ref as never}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: "1000ms",
        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
      }}
      className={[
        "transition-all will-change-transform",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
