// Animations légères de la démo : parallaxe au scroll et compteurs.
// Désactivées si l'utilisateur préfère moins de mouvement.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Parallaxe horizontale liée au scroll.
   - "left" / "right" : texte placé en marge, il glisse vers l'intérieur puis revient en place.
   - "center" : texte centré, il fait un aller-retour horizontal. */
export function Parallax({
  mode = "center",
  children,
  style,
}: {
  mode?: "left" | "right" | "center";
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
      const vh = window.innerHeight;
      // p : 0 quand le bloc entre par le bas, 1 quand il sort par le haut
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const amp = Math.min(34, Math.max(12, window.innerWidth * 0.035));
      let x: number;
      if (mode === "center") x = Math.sin(p * Math.PI * 2) * amp;
      else x = Math.sin(p * Math.PI) * amp * (mode === "left" ? 1 : -1);
      el.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
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
  }, [mode]);

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
