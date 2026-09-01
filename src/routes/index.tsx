import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Bot,
  ArrowRight,
  CheckCircle2,
  Workflow,
  Users,
  Building2,
  ListChecks,
  Eye,
  Inbox,
  Clock,
  PhoneOff,
  UserCheck,
  Phone,
  MessageSquare,
  Zap,
} from "lucide-react";
import { DashboardMockup } from "@/components/DashboardMockup";
import { LangProvider, useContent, useLang, localePath, content, type Lang } from "@/lib/i18n";
import { useMarche } from "@/lib/market";
import { priceFor } from "@/lib/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: content.en.meta.title },
      { name: "description", content: content.en.meta.description },
      { property: "og:title", content: content.en.meta.title },
      { property: "og:description", content: content.en.meta.ogDescription },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <HomePage lang="en" />,
});

const DEMO_URL = "/readyflow-manager.html";
function demoUrl(lang: Lang) {
  return lang === "fr" ? `${DEMO_URL}?lang=fr` : DEMO_URL;
}
const WHATSAPP_URL = "https://wa.me/447576594092";
const PHONE_HREF = "tel:+447576594092";
const PHONE_DISPLAY = "+44 7576 594092";

// --- Animated Counter Hook ---
function useCountUp(target: number, duration: number = 1000) {
  const [count, setCount] = React.useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// --- Parallax Title ---
function ParallaxTitle({ word, children, dark = false, center = false }: { word: string; children: React.ReactNode; dark?: boolean; center?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef<number>(0);
  const dirRef = useRef<number>(1);

  const displayWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  useEffect(() => {
    const el = ref.current;
    const bg = bgRef.current;
    if (!el || !bg) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    if (isMobile) {
      let active = false;
      const animate = () => {
        if (!active) return;
        posRef.current += 0.15 * dirRef.current;
        if (posRef.current > 18) dirRef.current = -1;
        if (posRef.current < -18) dirRef.current = 1;
        bg.style.transform = `translateX(${posRef.current}px) translateZ(0)`;
        animRef.current = requestAnimationFrame(animate);
      };
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { active = true; animate(); }
          else { active = false; cancelAnimationFrame(animRef.current); }
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
      return () => { observer.disconnect(); cancelAnimationFrame(animRef.current); };
    } else {
      const handleMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const offset = ((e.clientX - rect.left) / rect.width - 0.5) * 26;
        bg.style.transition = "transform 0.1s linear";
        bg.style.transform = `translateX(${offset}px) translateZ(0)`;
      };
      const handleLeave = () => {
        bg.style.transition = "transform 0.5s ease";
        bg.style.transform = "translateX(0px) translateZ(0)";
      };
      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", handleLeave);
      return () => {
        el.removeEventListener("mousemove", handleMove);
        el.removeEventListener("mouseleave", handleLeave);
      };
    }
  }, []);

  const color = dark ? "#1e3a5f" : "#dbeafe";

  return (
    <div ref={ref} style={{ position: "relative", overflow: "visible" }}>
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          textAlign: center ? "center" : "left",
          fontSize: "clamp(52px, 6.5vw, 80px)",
          fontWeight: 800,
          lineHeight: 1,
          color: color,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          letterSpacing: "0.02em",
          userSelect: "none",
          zIndex: 0,
          transform: "translateX(0px) translateZ(0)",
          willChange: "transform",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {displayWord}
      </div>
      <div style={{ position: "relative", zIndex: 1, paddingTop: "2.6rem" }}>{children}</div>
    </div>
  );
}

function LangSwitcher() {
  const lang = useLang();
  const other: Lang = lang === "en" ? "fr" : "en";
  return (
    <a
      href={localePath(other)}
      className="text-sm font-medium text-muted-foreground hover:text-navy-deep transition"
    >
      {other.toUpperCase()}
    </a>
  );
}

function Header() {
  const t = useContent();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-1">
          <img src="/logo-icon.png" alt="ByCo Systems" className="size-7" />
          <span className="font-semibold text-navy-deep tracking-tight">ByCo Systems</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#offer" className="hover:text-navy-deep transition">{t.nav.offer}</a>
          <a href="#services" className="hover:text-navy-deep transition">{t.nav.services}</a>
          <a href="#pricing-business-plus" className="hover:text-navy-deep transition">{t.nav.pricing}</a>
          <a href="#demo" className="hover:text-navy-deep transition">{t.nav.demo}</a>
          <a href="#process" className="hover:text-navy-deep transition">{t.nav.process}</a>
          <a href="#contact" className="hover:text-navy-deep transition">{t.nav.contact}</a>
        </nav>
        <div className="flex items-center gap-4">
          <LangSwitcher />
          <a
            href={PHONE_HREF}
            className="hidden lg:flex items-center gap-2 text-sm font-medium text-navy-deep hover:text-brand transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6.29 6.29l1.61-1.04a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            {PHONE_DISPLAY}
          </a>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md bg-navy text-white hover:bg-navy-deep transition"
          >
            {t.nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const t = useContent();
  return (
    <section id="top" className="relative overflow-hidden bg-navy-gradient text-white">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute -top-32 -right-32 size-[500px] rounded-full bg-brand/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-brand-soft">
              <span className="size-1.5 rounded-full bg-brand-soft" />
              {t.hero.badge}
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.05]">
              {t.hero.titleLine1}<br />
              {t.hero.titleLine2}<br />
              <span className="text-brand-soft">{t.hero.titleLine3}</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-navy-deep font-medium hover:bg-white/90 transition"
              >
                {t.hero.ctaPrimary} <ArrowRight className="size-4" />
              </a>
              <a
                href="#pricing-business-plus"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 font-medium transition"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>
            <a href={PHONE_HREF} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6.29 6.29l1.61-1.04a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {PHONE_DISPLAY}
            </a>
            <div className="mt-10 flex flex-wrap gap-6 text-xs text-white/50">
              {t.hero.bullets.map((bullet) => (
                <span key={bullet} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-brand-soft" /> {bullet}</span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedStat({ num, suffix, label, prefix = "" }: { num: number; suffix: string; label: string; prefix?: string }) {
  const { count, ref } = useCountUp(num, 1000);
  return (
    <div>
      <div className="text-3xl font-bold text-navy-deep">
        {prefix}<span ref={ref}>{count}</span>{suffix}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function StatsBar() {
  const t = useContent();
  return (
    <section className="py-10 border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <AnimatedStat num={72} suffix="h" label={t.stats.setupLabel} />
          <AnimatedStat num={24} suffix="/7" label={t.stats.receptionLabel} />
          <AnimatedStat num={2} suffix="" label={t.stats.industriesLabel} />
        </div>
      </div>
    </section>
  );
}

const pillarIcons = [Phone, MessageSquare, Zap];

function CoreOffer() {
  const t = useContent();
  const lang = useLang();
  return (
    <section id="offer" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <ParallaxTitle word={t.parallax.offer} center={true}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">
              {t.coreOffer.heading}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t.coreOffer.subheading}
            </p>
          </div>
        </ParallaxTitle>
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {t.coreOffer.pillars.map(({ title, desc }, i) => {
            const Icon = pillarIcons[i];
            return (
              <div key={title} className="text-center">
                <span className="mx-auto size-12 rounded-xl bg-brand/10 grid place-items-center mb-5">
                  <Icon className="size-6 text-brand" />
                </span>
                <h3 className="text-lg font-medium text-navy-deep">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-14 text-center">
          <a href={demoUrl(lang)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition"
          >
            {t.coreOffer.ctaDashboard}
          </a>
          <p className="mt-3 text-sm text-muted-foreground">{t.coreOffer.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}

const serviceIcons = [Phone, MessageSquare, ClipboardList, LayoutDashboard, Bot, Workflow];

function Services() {
  const t = useContent();
  return (
    <section id="services" className="py-24 bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <ParallaxTitle word={t.parallax.services}>
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">
              {t.services.heading}
            </h2>
          </div>
        </ParallaxTitle>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {t.services.items.map(({ title, desc }, i) => {
            const Icon = serviceIcons[i];
            return (
              <div
                key={title}
                className="group relative bg-white rounded-xl p-7 border border-border hover:border-brand/40 hover:shadow-elevated transition-all"
              >
                <div className="size-11 rounded-lg bg-navy-gradient grid place-items-center mb-5">
                  <Icon className="size-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-navy-deep">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhoWeServe() {
  const t = useContent();
  return (
    <section className="py-16 border-b border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mx-auto text-center">
          <ParallaxTitle word={t.parallax.clients} center={true}>
            <h2 className="text-2xl md:text-3xl font-medium text-navy-deep leading-snug">
              {t.whoWeServe.heading}
            </h2>
          </ParallaxTitle>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            {t.whoWeServe.subheading}
          </p>
        </div>
      </div>
    </section>
  );
}

const intakeBenefitIcons = [Clock, PhoneOff, UserCheck, Bot, Eye, ListChecks];

function SmartIntakeDemo() {
  const t = useContent();
  return (
    <section id="smart-intake" className="py-24 md:py-32 bg-secondary/30 border-y border-border">
      <div className="mx-auto max-w-5xl px-6">
        <ParallaxTitle word={t.parallax.automation} center={true}>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium text-navy-deep leading-tight">
              {t.smartIntakeDemo.heading}
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              {t.smartIntakeDemo.subheading}
            </p>
          </div>
        </ParallaxTitle>
        <div className="mt-12 mx-auto w-full" style={{ maxWidth: 340 }}>
          <div className="relative rounded-2xl overflow-hidden border border-border bg-white shadow-elevated">
            <div className="relative w-full" style={{ aspectRatio: "9 / 16" }}>
              <iframe
                src="https://www.youtube.com/embed/2EpGBEWniqM"
                title="24/7 Smart Intake Demo"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.smartIntakeDemo.benefits.map(({ title, desc }, i) => {
            const Icon = intakeBenefitIcons[i];
            return (
              <div key={title} className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-elevated hover:border-brand/40 transition-all">
                <span className="size-11 rounded-lg bg-brand/10 grid place-items-center mb-4">
                  <Icon className="size-5 text-brand" />
                </span>
                <p className="text-base font-medium text-navy-deep leading-snug">{title}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
          {t.smartIntakeDemo.steps.map(({ n, title, desc }) => (
            <div key={n} className="rounded-xl p-6 border border-border bg-white">
              <div className="text-brand text-sm font-mono font-semibold mb-3">{n}</div>
              <h3 className="text-lg font-medium text-navy-deep">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition">
            {t.smartIntakeDemo.cta} <ArrowRight className="size-4" />
          </a>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground italic">
          {t.smartIntakeDemo.note}
        </p>
      </div>
    </section>
  );
}

const demoFeatureIcons = [ListChecks, Building2, Workflow, Users, Eye, Inbox];

function FeaturedDemo() {
  const t = useContent();
  const lang = useLang();
  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">

        {/* Live demo intro block */}
        <div className="mb-16 rounded-2xl border border-brand/30 bg-navy-gradient text-white p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-medium leading-snug">
            {t.featuredDemo.liveHeading}
          </h2>
          <p className="mt-3 text-white/70 leading-relaxed max-w-2xl">
            {t.featuredDemo.liveSubtext}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={lang === "fr" ? "/demo/decouvrir?lang=fr" : "/demo/decouvrir?lang=en"}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-navy-deep font-medium hover:bg-white/90 transition"
            >
              {t.featuredDemo.exploreDemoCta} <ArrowRight className="size-4" />
            </a>
            <a
              href={lang === "fr"
                ? "https://wa.me/447576594092?text=Bonjour%20ByCo%20Systems%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20votre%20syst%C3%A8me%20d%27accueil%20intelligent."
                : "https://wa.me/447576594092?text=Hi%20ByCo%20Systems%2C%20I%27d%20like%20to%20know%20more%20about%20your%20smart%20reception%20system."
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 font-medium transition"
            >
              {t.featuredDemo.whatsappCta}
            </a>
          </div>
          <p className="mt-4 text-xs text-white/45">
            {t.featuredDemo.liveNote}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <ParallaxTitle word={t.parallax.guide}>
              <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">{t.featuredDemo.heading}</h2>
            </ParallaxTitle>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              {t.featuredDemo.subheading}
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {t.featuredDemo.features.map((label, i) => {
                const Icon = demoFeatureIcons[i];
                return (
                  <li key={label} className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="size-7 rounded-md bg-brand/10 grid place-items-center">
                      <Icon className="size-3.5 text-brand" />
                    </span>
                    {label}
                  </li>
                );
              })}
            </ul>
            <a href={demoUrl(lang)}
              className="mt-10 inline-flex items-center gap-2 px-5 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition"
            >
              {t.featuredDemo.cta}
            </a>
          </div>
          <div className="lg:col-span-7">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-border bg-white shadow-elevated overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
                  <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                    <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                    <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                  </div>
                  <div className="ml-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-brand animate-pulse" />
                    WhatsApp · Orlane
                  </div>
                </div>
                <div className="p-5 space-y-4 bg-white">
                  <div className="flex gap-2.5 justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-navy text-white px-4 py-2.5 text-sm max-w-[85%]">
                      {t.featuredDemo.chatMsg1}
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="size-8 rounded-full bg-navy-gradient grid place-items-center shrink-0">
                      <Bot className="size-4 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-2.5 text-sm text-navy-deep max-w-[85%]">
                      {t.featuredDemo.chatReply1}
                    </div>
                  </div>
                  <div className="flex gap-2.5 justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-navy text-white px-4 py-2.5 text-sm max-w-[85%]">
                      {t.featuredDemo.chatMsg2}
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="size-8 rounded-full bg-navy-gradient grid place-items-center shrink-0">
                      <Bot className="size-4 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-2.5 text-sm text-navy-deep max-w-[85%]">
                      {t.featuredDemo.chatReply2}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const t = useContent();
  const marche = useMarche();
  return (
    <section id="pricing" className="py-24 md:py-32 bg-secondary/30 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <ParallaxTitle word={t.parallax.plans} center={true}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">
              {t.pricing.heading}
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              {t.pricing.subheading}
            </p>
          </div>
        </ParallaxTitle>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.pricing.plans.map(({ name, price: fallbackPrice, subtitle, desc, features, cta, badge }) => {
            const highlight = !!badge;
            const price = priceFor(name, marche) || fallbackPrice;
            return (
              <div
                key={name}
                id={highlight ? "pricing-business-plus" : undefined}
                className={`relative rounded-2xl p-8 border transition-all flex flex-col ${
                  highlight
                    ? "border-2 border-brand bg-gradient-to-b from-navy to-navy-deep text-white shadow-elevated ring-1 ring-brand/30 scale-[1.02]"
                    : "border-border bg-white hover:border-brand/40 hover:shadow-elevated"
                }`}
              >
                {badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-brand text-white text-sm font-semibold whitespace-nowrap shadow-md shadow-brand/40">
                    {badge}
                  </div>
                )}
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-[0.2em] ${highlight ? "text-brand-soft" : "text-brand"}`}>{name}</div>
                  <div className={`mt-3 text-4xl font-bold ${highlight ? "text-white" : "text-navy-deep"}`}>{price}</div>
                  <div className={`mt-1 text-sm font-medium ${highlight ? "text-white/70" : "text-muted-foreground"}`}>{subtitle}</div>
                  <p className={`mt-4 text-sm leading-relaxed ${highlight ? "text-white/60" : "text-muted-foreground"}`}>{desc}</p>
                </div>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${highlight ? "text-white/80" : "text-foreground"}`}>
                      <CheckCircle2 className={`size-4 shrink-0 ${highlight ? "text-brand-soft" : "text-brand"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-md font-medium transition ${
                    highlight
                      ? "bg-white text-navy-deep hover:bg-white/90"
                      : "bg-navy text-white hover:bg-navy-deep"
                  }`}
                >
                  {cta} <ArrowRight className="size-4" />
                </a>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t.pricing.footerNote} <a href="#contact" className="text-brand font-medium hover:underline">{t.pricing.footerLinkText}</a>
        </p>
      </div>
    </section>
  );
}

function Process() {
  const t = useContent();
  return (
    <section id="process" className="py-24 bg-navy-gradient text-white relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6">
        <ParallaxTitle word={t.parallax.process} dark={true}>
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-medium text-white">
              {t.process.heading}
            </h2>
          </div>
        </ParallaxTitle>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.process.steps.map(({ n, title, desc, day }) => (
            <div key={n} className="rounded-xl p-6 border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-brand-soft text-sm font-mono font-semibold">{n}</div>
              <h3 className="mt-3 font-medium text-lg leading-snug">{title}</h3>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">{desc}</p>
              <div className="mt-4 inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-brand-soft tracking-wide">{day}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const t = useContent();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const response = await fetch("https://formspree.io/f/mbdbpvyz", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    if (response.ok) setSubmitted(true);
  };
  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t.contact.formName} name="name" />
        <Field label={t.contact.formBusiness} name="business" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t.contact.formEmail} name="email" type="email" />
        <Field label={t.contact.formPhone} name="phone" type="tel" required={false} />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy-deep mb-1.5">{t.contact.formMessage}</label>
        <textarea name="message" required rows={5}
          className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
        />
      </div>
      <button type="submit"
        className="mt-2 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition"
      >
        {t.contact.formSubmit} <ArrowRight className="size-4" />
      </button>
      {submitted && <p className="text-sm text-brand font-medium">{t.contact.formThanks}</p>}
    </form>
  );
}

function Field({ label, name, type = "text", required = true }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-deep mb-1.5">{label}</label>
      <input required={required} type={type} name={name}
        className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
      />
    </div>
  );
}

function FounderNote() {
  const t = useContent();
  return (
    <div className="mt-6 flex items-center gap-3">
      <img
        src="/samuel-boumso.png"
        alt={t.contact.founderName}
        className="size-14 rounded-full object-cover object-top border border-border shrink-0"
      />
      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-medium text-navy-deep">{t.contact.founderName}</span>, {t.contact.founderRole}.<br />
        {t.contact.founderBio}
      </p>
    </div>
  );
}

function Contact() {
  const t = useContent();
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <ParallaxTitle word={t.parallax.contact}>
            <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">{t.contact.heading}</h2>
          </ParallaxTitle>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            {t.contact.subheading}
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.502A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.368l-.36-.214-3.732.885.936-3.617-.235-.373A9.818 9.818 0 1112 21.818z"/>
            </svg>
            {t.contact.whatsapp}
          </a>
          <div className="mt-8 p-5 rounded-lg border border-border bg-secondary/50">
            <div className="text-sm text-muted-foreground font-medium">{t.contact.responseTime}</div>
            <p className="mt-1 text-sm text-navy-deep font-medium">
              {t.contact.responseNote}
            </p>
          </div>
          <FounderNote />
        </div>
        <div className="bg-white border border-border rounded-2xl p-7 shadow-elevated">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const t = useContent();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">{t.faq.heading}</h2>
          <p className="mt-3 text-muted-foreground">{t.faq.tagline}</p>
        </div>
        <div className="divide-y divide-border">
          {t.faq.items.map(({ q, a }, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left text-navy-deep font-medium hover:text-brand transition"
              >
                <span>{q}</span>
                <span className={`shrink-0 size-6 rounded-full border border-border grid place-items-center text-muted-foreground transition-transform ${open === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              {open === i && (
                <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const t = useContent();
  return (
    <footer className="bg-navy-deep text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-1">
              <img src="/logo-icon.png" alt="ByCo Systems" className="size-7" />
              <span className="text-white font-semibold tracking-tight">ByCo Systems</span>
            </div>
            <p className="mt-3 text-sm max-w-md">
              {t.footer.tagline}
            </p>
          </div>
          <div className="text-sm text-white/40">
            © {new Date().getFullYear()} ByCo Systems. {t.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <StatsBar />
          <CoreOffer />
          <Services />
          <WhoWeServe />
          <SmartIntakeDemo />
          <FeaturedDemo />
          <Pricing />
          <Process />
          <Contact />
          <FAQ />
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}
