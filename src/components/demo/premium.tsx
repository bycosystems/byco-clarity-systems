// Démos "haut de gamme" pour les agences immobilières prospectées.
// Hero ciel ouvert, scène de nuit (sans / avec Orlane), argumentaire du site
// autonome avec preuve. Chaque agence a sa couleur, son logo et son visuel.
// Pure front-end, styles inline (même approche que la page démo).

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const SERIF = '"Playfair Display", Georgia, serif';
const SANS = '"Inter", "Helvetica Neue", system-ui, sans-serif';

export type Agency = {
  shortName: string;
  accent: string;
  accentSoft: string;
  logo: string;
  logoRound?: boolean;
  visual: string;
  visualRatio: number;
  headline: string;
  sub: string;
  nightClient: string;
  nightReply: string;
  nightClient2: string;
  nightReply2: string;
  nightNote: string;
};

export const AGENCIES: Record<string, Agency> = {
  "agence immobilière trëma": {
    shortName: "Trëma",
    accent: "#C6290B",
    accentSoft: "#FBE9E4",
    logo: "/logos/trema-logo.png",
    logoRound: true,
    visual: "/logos/trema-affiche.png",
    visualRatio: 940 / 788,
    headline: "Vos clients écrivent le soir. Qui leur répond ?",
    sub: "Un acheteur sérieux compare plusieurs agences dans la même soirée. Celle qui répond la première prend l'avantage.",
    nightClient: "Bonsoir, je cherche à acheter une maison à Douala. Qu'avez-vous en ce moment ?",
    nightReply:
      "Bonsoir, je suis Orlane, l'assistante de Trëma. Nous accompagnons l'achat et la vente de biens. Quel type de maison cherchez-vous, et dans quel quartier ?",
    nightClient2: "Trois chambres, plutôt du côté de Logpom.",
    nightReply2:
      "Merci. Je transmets votre demande à l'équipe ce soir. Quelqu'un vous rappelle demain avec les biens qui correspondent.",
    nightNote: "Demande enregistrée : type de bien, quartier et numéro du client.",
  },
  "sci fragiliko": {
    shortName: "SCI Fragiliko",
    accent: "#0A8A3A",
    accentSoft: "#E4F4EA",
    logo: "/logos/fragiliko-logo.png",
    visual: "/logos/fragiliko-banniere.jpg",
    visualRatio: 960 / 384,
    headline: "Vos clients écrivent le soir. Qui leur répond ?",
    sub: "Terrain titré, villa, location : le client qui hésite choisit l'agence qui répond d'abord.",
    nightClient: "Bonsoir, vos terrains titrés à Douala sont encore disponibles ?",
    nightReply:
      "Bonsoir, je suis Orlane, l'assistante de SCI Fragiliko. Oui, nous proposons des terrains titrés, avec visite sur les lieux. Dans quel quartier cherchez-vous ?",
    nightClient2: "Plutôt vers Bonamoussadi.",
    nightReply2:
      "Noté. Je transmets votre demande à l'équipe ce soir. Quelqu'un vous rappelle demain matin avec les terrains disponibles.",
    nightNote: "Demande enregistrée : quartier, besoin et numéro du client.",
  },
  "innov immo": {
    shortName: "Innov Immo",
    accent: "#164D86",
    accentSoft: "#E3ECF6",
    logo: "/logos/innov-logo.png",
    visual: "/logos/innov-banniere.jpg",
    visualRatio: 820 / 312,
    headline: "Vos clients écrivent le soir. Qui leur répond ?",
    sub: "Gestion administrative, technique, financière : un propriétaire ou un locataire qui signale un problème attend une réponse, pas un silence.",
    nightClient: "Bonsoir, j'ai une fuite d'eau dans l'appartement que vous gérez à Akwa.",
    nightReply:
      "Bonsoir, je suis Orlane, l'assistante d'Innov Immo. Je suis désolée pour ce souci. La fuite est-elle en cours en ce moment ?",
    nightClient2: "Oui, dans la cuisine.",
    nightReply2:
      "Si vous le pouvez, coupez l'arrivée d'eau. J'alerte le responsable technique ce soir et il vous rappelle.",
    nightNote: "Alerte enregistrée : adresse, nature du problème et numéro du locataire.",
  },
  "concept immo": {
    shortName: "Concept Immo",
    accent: "#1E4FC2",
    accentSoft: "#E4EBFA",
    logo: "/logos/concept-logo.png",
    logoRound: true,
    visual: "/logos/concept-facade.jpg",
    visualRatio: 640 / 446,
    headline: "Vos clients écrivent le soir. Qui leur répond ?",
    sub: "Architecture, rénovation, décoration : un projet commence souvent par un message envoyé tard dans la soirée.",
    nightClient: "Bonsoir, vous faites aussi la rénovation d'intérieur ?",
    nightReply:
      "Bonsoir, je suis Orlane, l'assistante de Concept Immo. Oui, nous faisons l'architecture d'intérieur, la rénovation et la décoration. C'est pour quel type de lieu ?",
    nightClient2: "Un appartement à Bonapriso.",
    nightReply2:
      "Merci. Je note votre demande. L'équipe vous recontacte demain pour fixer un rendez-vous.",
    nightNote: "Demande enregistrée : projet, lieu et numéro du client.",
  },
};

export function resolveAgency(prospect: string | undefined): Agency | undefined {
  if (!prospect) return undefined;
  return AGENCIES[prospect.normalize("NFC").trim().toLowerCase()];
}

function rgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function useInView<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

const wrap: CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "0 clamp(18px, 5vw, 40px)",
};


/* ── Ciel réaliste (WebGL, nuages fractals, coucher de soleil) ── */

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime;
float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for(int i=0;i<6;i++){ v += a*noise(p); p = m*p; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 q = vec2(uv.x*asp, uv.y);
  vec2 sunPos = vec2(0.78*asp, 0.22);
  // dégradé du ciel : bleu profond en haut, orangé à l'horizon
  vec3 top = vec3(0.16, 0.36, 0.72);
  vec3 mid = vec3(0.55, 0.70, 0.90);
  vec3 hor = vec3(1.00, 0.72, 0.48);
  float h = uv.y;
  vec3 sky = mix(hor, mid, smoothstep(0.05, 0.50, h));
  sky = mix(sky, top, smoothstep(0.45, 1.0, h));
  // halo du soleil
  float d = distance(q, sunPos);
  sky += vec3(1.0, 0.62, 0.30) * exp(-d*2.4) * 0.55;
  sky += vec3(1.0, 0.85, 0.6) * exp(-d*9.0) * 0.6;
  // nuages
  vec2 c = q*vec2(1.1, 2.4) + vec2(uTime*0.012, 0.0);
  float n = fbm(c*1.6 + fbm(c*0.8 + 3.0)*0.8);
  float cov = smoothstep(0.46, 0.80, n);
  cov *= smoothstep(0.04, 0.32, h);
  // lumière : face éclairée vers le soleil, dessous plus sombre
  float n2 = fbm(c*1.6 + fbm(c*0.8 + 3.0)*0.8 + normalize(sunPos - q)*0.08);
  float light = clamp((n - n2)*5.0 + 0.55, 0.0, 1.0);
  vec3 cloudShade = mix(vec3(0.42, 0.45, 0.62), vec3(1.0, 0.80, 0.62), light);
  cloudShade = mix(cloudShade, vec3(1.0, 0.93, 0.82), exp(-d*1.8)*0.5);
  vec3 col = mix(sky, cloudShade, cov*0.92);
  // bordure lumineuse des nuages face au soleil
  col += vec3(1.0, 0.7, 0.4) * pow(cov*(1.0-cov)*4.0, 2.0) * exp(-d*1.6) * 0.25;
  // brume d'horizon
  col = mix(col, vec3(0.99, 0.80, 0.62), smoothstep(0.22, 0.0, h)*0.55);
  // grain léger
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.018;
  gl_FragColor = vec4(col, 1.0);
}`;

export function SkyShader({ onFail }: { onFail: () => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      onFail();
      return;
    }
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT);
    const fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      onFail();
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      onFail();
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const still =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr * 0.6));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr * 0.6));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, still ? 20 : (performance.now() - t0) / 1000 + 20);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!still && visible) raf = requestAnimationFrame(draw);
    };
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((e) => {
            visible = e.some((x) => x.isIntersecting);
            cancelAnimationFrame(raf);
            if (visible) draw();
          })
        : null;
    io?.observe(canvas);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [onFail]);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}

/* ── Hero ciel ouvert ───────────────────────────────────────── */

const SKYLINE_FAR: Array<[number, number, number]> = [
  [0, 70, 60], [70, 50, 96], [120, 44, 70], [164, 60, 118], [224, 40, 84], [264, 70, 58],
  [334, 46, 104], [380, 56, 76], [436, 40, 130], [476, 64, 90], [540, 50, 66], [590, 44, 112],
  [634, 62, 80], [696, 42, 124], [738, 58, 72], [796, 48, 100], [844, 66, 62], [910, 44, 118],
  [954, 60, 84], [1014, 50, 70], [1064, 46, 108], [1110, 90, 64],
];
const SKYLINE_NEAR: Array<[number, number, number]> = [
  [0, 90, 34], [90, 64, 52], [154, 80, 30], [234, 56, 62], [290, 100, 38], [390, 70, 54],
  [460, 84, 28], [544, 60, 58], [604, 96, 36], [700, 74, 50], [774, 88, 30], [862, 62, 56],
  [924, 92, 34], [1016, 70, 48], [1086, 114, 30],
];

export function PremiumHero({ agency, name }: { agency: Agency; name: string }) {
  const wide = agency.visualRatio > 1.8;
  const [glOk, setGlOk] = useState(true);
  const failGl = useCallback(() => setGlOk(false), []);
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #8CC3E8 0%, #BFDDF1 34%, #F5E1C6 74%, #FBEBD5 100%)",
        fontFamily: SANS,
      }}
    >
      <style>{`
        @keyframes byco-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes byco-drift { 0% { transform: translateX(-4%); } 100% { transform: translateX(4%); } }
        @keyframes byco-pulse { 0%,100% { opacity: .5; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .byco-anim { animation: none !important; }
        }
      `}</style>
      {glOk ? (
        <SkyShader onFail={failGl} />
      ) : (
        <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "8%",
          top: "42%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,247,226,0.95) 0%, rgba(255,226,170,0.55) 38%, rgba(255,226,170,0) 70%)",
        }}
      />
      <svg
        aria-hidden="true"
        className="byco-anim"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "62%",
          animation: "byco-drift 38s ease-in-out infinite alternate",
        }}
      >
        <g fill="#ffffff" opacity="0.85">
          <ellipse cx="180" cy="90" rx="90" ry="20" />
          <ellipse cx="240" cy="78" rx="60" ry="22" />
          <ellipse cx="130" cy="98" rx="60" ry="16" />
          <ellipse cx="820" cy="60" rx="100" ry="18" />
          <ellipse cx="890" cy="50" rx="60" ry="20" />
          <ellipse cx="760" cy="68" rx="60" ry="14" />
          <ellipse cx="520" cy="150" rx="80" ry="14" opacity="0.7" />
          <ellipse cx="1040" cy="150" rx="90" ry="14" opacity="0.7" />
        </g>
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: "26%" }}
      >
        <g fill={rgba(agency.accent, 0.16)}>
          {SKYLINE_FAR.map(([x, w, h], i) => (
            <rect key={"f" + i} x={x} y={160 - h - 20} width={w} height={h + 20} />
          ))}
        </g>
        <g fill={rgba(agency.accent, 0.3)}>
          {SKYLINE_NEAR.map(([x, w, h], i) => (
            <rect key={"n" + i} x={x} y={160 - h} width={w} height={h} />
          ))}
        </g>
      </svg>

        </>
      )}

      <div style={{ ...wrap, position: "relative", padding: "22px clamp(18px, 5vw, 40px) clamp(56px, 9vw, 96px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: agency.logoRound ? 999 : 14,
              padding: agency.logoRound ? 6 : "8px 14px",
              boxShadow: "0 6px 20px rgba(16,40,58,0.18)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={agency.logo}
              alt={agency.shortName}
              style={{
                display: "block",
                height: agency.logoRound ? 54 : 48,
                width: agency.logoRound ? 54 : "auto",
                objectFit: "contain",
                borderRadius: agency.logoRound ? "50%" : 0,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#10283A",
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(16,40,58,0.15)",
              borderRadius: 999,
              padding: "6px 14px",
            }}
          >
            Démo ByCo Systems
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(24px, 5vw, 56px)",
            alignItems: "center",
            marginTop: "clamp(28px, 5vw, 52px)",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                background: agency.accent,
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.04em",
                padding: "6px 14px",
                borderRadius: 999,
                marginBottom: 16,
              }}
            >
              Préparé pour {name}
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(30px, 5.2vw, 52px)",
                lineHeight: 1.12,
                fontWeight: 700,
                color: "#10283A",
                margin: 0,
                textWrap: "balance",
              }}
            >
              Vos clients écrivent le soir. Qui leur répond{" "}?
            </h1>
            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", lineHeight: 1.6, color: "#2D4658", margin: "16px 0 0", maxWidth: 520 }}>
              {agency.sub}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
              <a
                href="#demo"
                style={{
                  background: agency.accent,
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 15,
                  padding: "13px 22px",
                  borderRadius: 12,
                  boxShadow: `0 10px 24px ${rgba(agency.accent, 0.35)}`,
                }}
              >
                Entendre Orlane en direct
              </a>
              <a
                href="#nuit"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  color: "#10283A",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 15,
                  padding: "13px 22px",
                  borderRadius: 12,
                  border: "1px solid rgba(16,40,58,0.18)",
                }}
              >
                Voir la scène de nuit
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22, fontSize: 13.5, color: "#2D4658" }}>
              <span
                className="byco-anim"
                style={{ width: 9, height: 9, borderRadius: "50%", background: agency.accent, animation: "byco-pulse 2.2s ease-in-out infinite" }}
              />
              Orlane, l'accueil intelligent de ByCo Systems, téléphone et WhatsApp, 24 h sur 24.
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              className="byco-anim"
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: wide ? 10 : 8,
                boxShadow: "0 28px 64px rgba(16,40,58,0.28)",
                width: wide ? "100%" : "auto",
                maxWidth: "100%",
                animation: "byco-float 7s ease-in-out infinite",
              }}
            >
              <img
                src={agency.visual}
                alt=""
                loading="eager"
                style={{
                  display: "block",
                  width: wide ? "100%" : "auto",
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: wide ? "none" : "clamp(260px, 42vw, 420px)",
                  borderRadius: 14,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Scène de nuit : sans / avec Orlane ──────────────────────── */

const STARS: Array<[number, number, number]> = [
  [60, 40, 1.4], [150, 90, 1], [260, 30, 1.6], [340, 120, 1], [430, 60, 1.2], [520, 20, 1],
  [610, 100, 1.5], [700, 50, 1], [790, 130, 1.2], [880, 30, 1.6], [960, 90, 1], [1050, 50, 1.3],
  [1130, 120, 1], [210, 160, 1], [570, 170, 1.2], [930, 170, 1],
];

function Bubble({
  side,
  children,
  show,
  delay,
  color,
}: {
  side: "in" | "out";
  children: ReactNode;
  show: boolean;
  delay: number;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: side === "out" ? "flex-end" : "flex-start",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(10px)",
        transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
      }}
    >
      <div
        style={{
          maxWidth: "88%",
          padding: "9px 12px",
          borderRadius: side === "out" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
          background: side === "out" ? color : "#2B3E50",
          color: "#ffffff",
          fontSize: 13.5,
          lineHeight: 1.5,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function NightScene({ agency }: { agency: Agency }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div
      id="nuit"
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #0A1726 0%, #10243A 100%)",
        padding: "clamp(48px, 8vw, 88px) 0",
        fontFamily: SANS,
        color: "#ffffff",
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMin slice" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 200 }}>
        {STARS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#ffffff" opacity={0.65} />
        ))}
      </svg>
      <div style={{ ...wrap, position: "relative" }}>
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "#9FB6CA", fontWeight: 700 }}>
            Dimanche, 23 h 12
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 4.4vw, 40px)", lineHeight: 1.18, fontWeight: 700, margin: "14px 0 10px", textWrap: "balance" }}>
            Pendant que vous dormez, vos clients, eux, écrivent.
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#B8CADA", margin: 0 }}>
            Exemple de conversation pour {agency.shortName}. Même message, même heure, deux issues.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: 20,
            marginTop: 36,
          }}
        >
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#F0A3A3" }}>
                Sans réponse
              </span>
              <span style={{ fontSize: 12, color: "#8FA6BA" }}>Page {agency.shortName}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Bubble side="in" show={seen} delay={0.2} color={agency.accent}>
                {agency.nightClient}
              </Bubble>
              <div style={{ opacity: seen ? 1 : 0, transition: "opacity .6s ease 1s", fontSize: 12, color: "#8FA6BA", textAlign: "right" }}>
                Vu à 23 h 12
              </div>
              <div
                style={{
                  opacity: seen ? 1 : 0,
                  transition: "opacity .6s ease 1.6s",
                  marginTop: 10,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(240,163,163,0.1)",
                  border: "1px solid rgba(240,163,163,0.3)",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  color: "#F6C9C9",
                }}
              >
                Aucune réponse avant lundi matin. Le client ouvre la page de l'agence suivante.
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.07)",
              border: `1px solid ${rgba(agency.accent, 0.7)}`,
              borderRadius: 18,
              padding: 18,
              boxShadow: `0 0 0 4px ${rgba(agency.accent, 0.12)}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8FE0B0" }}>
                Avec Orlane
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#B8CADA" }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: agency.accent,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  O
                </span>
                Orlane · {agency.shortName}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Bubble side="in" show={seen} delay={0.2} color={agency.accent}>
                {agency.nightClient}
              </Bubble>
              <Bubble side="out" show={seen} delay={1.2} color={agency.accent}>
                {agency.nightReply}
              </Bubble>
              <Bubble side="in" show={seen} delay={2.4} color={agency.accent}>
                {agency.nightClient2}
              </Bubble>
              <Bubble side="out" show={seen} delay={3.4} color={agency.accent}>
                {agency.nightReply2}
              </Bubble>
              <div
                style={{
                  opacity: seen ? 1 : 0,
                  transition: "opacity .6s ease 4.4s",
                  marginTop: 6,
                  padding: "11px 14px",
                  borderRadius: 12,
                  background: "rgba(143,224,176,0.1)",
                  border: "1px solid rgba(143,224,176,0.35)",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#BDF0D2",
                }}
              >
                {agency.nightNote}
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 34 }}>
          <p style={{ fontSize: 15.5, color: "#C9D8E4", margin: "0 0 16px" }}>
            Cette scène est un exemple. L'appel, lui, est réel : parlez à Orlane maintenant.
          </p>
          <a
            href="#demo"
            style={{
              display: "inline-block",
              background: agency.accent,
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 15,
              padding: "13px 24px",
              borderRadius: 12,
            }}
          >
            Appeler Orlane
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Le site autonome : argumentaire et preuve ───────────────── */

const SITE_ROWS: Array<[string, string, string]> = [
  ["Visibilité", "Elle dépend de l'algorithme et des publications du jour.", "Permanente. Google vous trouve par quartier et par type de bien."],
  ["Vos biens", "Ils descendent dans le fil en quelques jours.", "Un catalogue complet, filtrable, toujours en ligne."],
  ["Vos publicités", "Elles mènent vers Messenger, où le client se perd.", "Elles mènent vers le bien précis, avec un bouton WhatsApp."],
  ["Votre suivi", "Peu de lisibilité sur ce qui intéresse vraiment.", "Vous voyez quels biens sont consultés."],
  ["Propriété", "Le compte appartient à Facebook, qui peut le suspendre.", "Le site, le nom de domaine et les contenus sont à vous."],
];

export function SiteArgument({ agency }: { agency: Agency }) {
  return (
    <div id="site" style={{ background: "linear-gradient(180deg, #FBEBD5 0%, #F6F3EE 40%)", padding: "clamp(48px, 8vw, 88px) 0", fontFamily: SANS, color: "#1A1A1A" }}>
      <div style={wrap}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", color: agency.accent, fontWeight: 700 }}>
            Aller plus loin
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 4.4vw, 40px)", lineHeight: 1.16, fontWeight: 700, margin: "12px 0 12px", textWrap: "balance" }}>
            Facebook est votre vitrine. Votre site sera votre maison.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "#4A5552", margin: 0 }}>
            Votre page est soignée et vos clients vous y trouvent. Un site à votre nom ajoute ce qu'une page ne peut pas offrir : un catalogue permanent, vos publicités qui mènent au bon bien, et une base qui vous appartient. Facebook attire, le site convertit.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 16,
            marginTop: 32,
          }}
        >
          <div style={{ background: "#ffffff", border: "1px solid #E1DACD", borderRadius: 18, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A8F8C", marginBottom: 12 }}>
              Page Facebook seule
            </div>
            {SITE_ROWS.map(([label, fb]) => (
              <div key={label} style={{ padding: "11px 0", borderTop: "1px solid #EEE8DC" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#6B726F" }}>{label}</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.5, color: "#5B6360", marginTop: 2 }}>{fb}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: "#ffffff",
              border: `2px solid ${agency.accent}`,
              borderRadius: 18,
              padding: 20,
              boxShadow: `0 18px 40px ${rgba(agency.accent, 0.16)}`,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: agency.accent, marginBottom: 12 }}>
              Votre site à votre nom
            </div>
            {SITE_ROWS.map(([label, , site]) => (
              <div key={label} style={{ padding: "11px 0", borderTop: `1px solid ${rgba(agency.accent, 0.15)}` }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: agency.accent }}>{label}</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.5, color: "#1A1A1A", marginTop: 2 }}>{site}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            background: "#10283A",
            color: "#ffffff",
            borderRadius: 18,
            padding: "clamp(20px, 4vw, 32px)",
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9FB6CA", fontWeight: 700 }}>
              La preuve
            </div>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, margin: "8px 0 6px" }}>
              Un site que nous avons construit pour une agence de Douala
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#C3D3E0", margin: 0 }}>
              Thierry Immo est en ligne aujourd'hui, en français et en anglais, avec des filtres par type de bien et par quartier, les prix, et un bouton WhatsApp sur chaque bien. Allez le voir, il tourne en production.
            </p>
          </div>
          <a
            href="https://thierryimmonet.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#ffffff",
              color: "#10283A",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 15,
              padding: "13px 22px",
              borderRadius: 12,
              whiteSpace: "nowrap",
            }}
          >
            Visiter thierryimmonet.com
          </a>
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <p style={{ fontSize: 15.5, color: "#4A5552", margin: "0 0 14px" }}>
            Orlane peut aussi vivre sur ce site, et répondre à vos visiteurs jour et nuit.
          </p>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              background: agency.accent,
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 15,
              padding: "13px 24px",
              borderRadius: 12,
            }}
          >
            Parler de votre site
          </a>
        </div>
      </div>
    </div>
  );
}
