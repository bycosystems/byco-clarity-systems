// Animations légères de la démo : parallaxe au scroll et compteurs.
// Désactivées si l'utilisateur préfère moins de mouvement.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Parallax({
  speed = 0.12,
  children,
  style,
}: {
  speed?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const target = el.parentElement ?? el;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = target.getBoundingClientRect();
      const offset = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div ref={ref} style={{ display: "inline-block", maxWidth: "100%", willChange: "transform", ...style }}>
      {children}
    </div>
  );
}

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export function CountUp({ to, duration = 1200 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let started = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        setValue(0);
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{fmt(value)}</span>;
}

/* Anime le premier nombre d'un texte, le reste reste tel quel. */
export function CountText({ text, duration = 1200 }: { text: string; duration?: number }) {
  const m = /^(\D*?)(\d[\d\s]*\d|\d)(.*)$/.exec(text);
  if (!m) return <>{text}</>;
  const [, pre, num, post] = m;
  return (
    <>
      {pre}
      <CountUp to={Number(num.replace(/\s/g, ""))} duration={duration} />
      {post}
    </>
  );
}
