import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Bot,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ByCo Systems - Smart Reception & Automation for Service Businesses" },
      {
        name: "description",
        content:
          "ByCo Systems builds smart reception systems, WhatsApp automation, booking flows and intelligent phone intake for service businesses.",
      },
      { property: "og:title", content: "ByCo Systems - Smart Reception & Automation for Service Businesses" },
      {
        property: "og:description",
        content: "Never miss a client again. Smart reception systems that run 24/7 for clinics, salons, agencies and every service business.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const DEMO_URL = "/readyflow-manager.html";

// --- Parallax Section Title ---
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

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-navy-gradient grid place-items-center">
            <span className="text-white text-xs font-bold tracking-tight">B</span>
          </div>
          <span className="font-semibold text-navy-deep tracking-tight">ByCo Systems</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#offer" className="hover:text-navy-deep transition">What we build</a>
          <a href="#services" className="hover:text-navy-deep transition">Services</a>
          <a href="#pricing" className="hover:text-navy-deep transition">Pricing</a>
          <a href="#demo" className="hover:text-navy-deep transition">Demo</a>
          <a href="#process" className="hover:text-navy-deep transition">Process</a>
          <a href="#contact" className="hover:text-navy-deep transition">Contact</a>
        </nav>
        <a
          href="tel:+447576594092"
          className="flex items-center gap-2 text-sm font-medium text-navy-deep hover:text-brand transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6.29 6.29l1.61-1.04a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          +44 7576 594092
        </a>
        <a
          href="#contact"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md bg-navy text-white hover:bg-navy-deep transition"
        >
          Request a Demo
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-gradient text-white">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute -top-32 -right-32 size-[500px] rounded-full bg-brand/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-brand-soft">
              <span className="size-1.5 rounded-full bg-brand-soft" />
              Smart reception & automation for service businesses
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.05]">
              Never miss<br />
              a client again.<br />
              <span className="text-brand-soft">24/7.</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
              Smart phone reception, WhatsApp automation, booking flows and follow-up systems - built for clinics, salons, agencies and every service business.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-navy-deep font-medium hover:bg-white/90 transition"
              >
                See a live demo <ArrowRight className="size-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 font-medium transition"
              >
                Request a Demo
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-xs text-white/50">
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-brand-soft" /> Zero missed calls</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-brand-soft" /> WhatsApp automation</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-brand-soft" /> Fast setup - 48h</span>
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
  return (
    <section className="py-10 border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <AnimatedStat num={48} suffix="h" label="Average setup time" />
          <AnimatedStat num={24} suffix="/7" label="Smart phone reception" />
          <AnimatedStat num={5} suffix="%" label="Missed client rate" prefix="< " />
          <AnimatedStat num={6} suffix="+" label="Industries served" />
        </div>
      </div>
    </section>
  );
}

function CoreOffer() {
  const pillars = [
    {
      icon: Phone,
      title: "Intelligent phone reception",
      desc: "Never miss a call again. Your smart receptionist answers, qualifies and routes every call automatically.",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp & multi-channel automation",
      desc: "Instant greetings, appointment confirmations and follow-ups on WhatsApp - without lifting a finger.",
    },
    {
      icon: Zap,
      title: "Automated booking & follow-up",
      desc: "Clients book, get confirmed and receive reminders automatically. Your calendar fills itself.",
    },
  ];

  return (
    <section id="offer" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <ParallaxTitle word="OFFER" center={true}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">
              Your front desk, running 24/7 without extra staff
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Every missed call, unanswered WhatsApp or forgotten follow-up is a client your competitor just won.
            </p>
          </div>
        </ParallaxTitle>
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <span className="mx-auto size-12 rounded-xl bg-brand/10 grid place-items-center mb-5">
                <Icon className="size-6 text-brand" />
              </span>
              <h3 className="text-lg font-medium text-navy-deep">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <a href="/readyflow-manager.html"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition"
          >
            Explore live dashboard
          </a>
          <p className="mt-3 text-sm text-muted-foreground">Live demo - explore freely, no login required.</p>
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    icon: Phone,
    title: "Smart Phone Reception",
    desc: "Intelligent phone intake that answers, qualifies and routes calls automatically - 24/7, no extra staff.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Automation",
    desc: "Instant greetings, appointment confirmations, lead capture and follow-up sequences on WhatsApp.",
  },
  {
    icon: ClipboardList,
    title: "Booking & Intake Systems",
    desc: "Clients book online, get confirmed instantly, receive reminders automatically. Zero manual work.",
  },
  {
    icon: LayoutDashboard,
    title: "Operations Dashboards",
    desc: "Track requests, teams and daily operations from one clear interface.",
  },
  {
    icon: Bot,
    title: "AI Client Assistant",
    desc: "Conversational AI that guides visitors, qualifies requests and provides immediate responses.",
  },
  {
    icon: Workflow,
    title: "Custom Automation Flows",
    desc: "Connect your tools, automate repetitive tasks and keep your business running while you focus on delivery.",
  },
];

function Services() {
  return (
    <section id="services" className="py-24 bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <ParallaxTitle word="SERVICES">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">
              Everything your front desk should do - automated
            </h2>
          </div>
        </ParallaxTitle>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}

const smartIntakeBenefits = [
  { icon: Clock, label: "24/7 customer intake" },
  { icon: UserCheck, label: "Request qualification" },
  { icon: Workflow, label: "Faster response coordination" },
];

function WhoWeServe() {
  const sectors = [
    { icon: Building2, label: "Clinics & Healthcare" },
    { icon: Users, label: "Salons & Beauty" },
    { icon: ClipboardList, label: "Law Firms & Notaries" },
    { icon: Workflow, label: "Agencies & Consultants" },
    { icon: LayoutDashboard, label: "Hotels & Hospitality" },
    { icon: Bot, label: "Any service business" },
  ];

  return (
    <section className="py-16 border-b border-border">
      <div className="mx-auto max-w-7xl px-6">
        <ParallaxTitle word="CLIENTS" center={true}>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-medium text-navy-deep">
              Built for every service business that wants to stop losing clients
            </h2>
          </div>
        </ParallaxTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sectors.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-white hover:border-brand/40 hover:shadow-sm transition-all text-center">
              <span className="size-10 rounded-lg bg-brand/10 grid place-items-center">
                <Icon className="size-5 text-brand" />
              </span>
              <span className="text-xs font-medium text-navy-deep leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SmartIntakeIntro() {
  return (
    <section id="smart-intake-intro" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <ParallaxTitle word="DEMO">
              <h2 className="text-3xl md:text-4xl font-medium text-navy-deep leading-tight">
                Your 24/7 intelligent receptionist
              </h2>
            </ParallaxTitle>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Captures, qualifies and routes every client request automatically - by phone, WhatsApp or web form.
            </p>
            <ul className="mt-8 space-y-3">
              {smartIntakeBenefits.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="size-9 rounded-md bg-brand/10 grid place-items-center shrink-0">
                    <Icon className="size-4 text-brand" />
                  </span>
                  <span className="font-medium text-navy-deep">{label}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-10 inline-flex items-center gap-2 px-5 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition"
            >
              Request AI intake demo <ArrowRight className="size-4" />
            </a>
            <p className="mt-3 text-sm text-muted-foreground">
              Private workflow demo available on request.
            </p>
          </div>
          <div className="lg:col-span-6">
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
                    Smart Intake Â· Online
                  </div>
                </div>
                <div className="p-5 space-y-4 bg-white">
                  <div className="flex gap-2.5">
                    <div className="size-8 rounded-full bg-navy-gradient grid place-items-center shrink-0">
                      <Bot className="size-4 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-2.5 text-sm text-navy-deep max-w-[85%]">
                      Hi! How can we help you today?
                    </div>
                  </div>
                  <div className="flex gap-2.5 justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-navy text-white px-4 py-2.5 text-sm max-w-[85%]">
                      I need a quote for a service appointment next week.
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="size-8 rounded-full bg-navy-gradient grid place-items-center shrink-0">
                      <Bot className="size-4 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-2.5 text-sm text-navy-deep max-w-[85%]">
                      Got it. Could you share your name, contact and preferred day?
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-brand">Qualified request</span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <CheckCircle2 className="size-3.5 text-brand" /> Routed to team
                      </span>
                    </div>
                    <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Type</div>
                        <div className="font-medium text-navy-deep">Service quote</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Priority</div>
                        <div className="font-medium text-navy-deep">Standard</div>
                      </div>
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

const demoFeatures = [
  { icon: ListChecks, label: "Task tracking" },
  { icon: Building2, label: "Unit management" },
  { icon: Workflow, label: "Workflow organization" },
  { icon: Users, label: "Team coordination" },
  { icon: Eye, label: "Operational visibility" },
  { icon: Inbox, label: "Request management" },
];

const intakeBenefits = [
  { icon: Clock, title: "24/7 Availability", desc: "Your intake process never sleeps. Capture business while you rest, without extra headcount." },
  { icon: PhoneOff, title: "Multi-Channel Sync", desc: "Integrate with WhatsApp, Email, and your website with one centralized smart dashboard." },
  { icon: UserCheck, title: "Smart Qualification", desc: "AI automatically scores and categorizes requests based on urgency, priority, and business fit." },
  { icon: Bot, title: "AI Intake Assistant", desc: "Conversational AI that captures request details and provides immediate feedback to customers." },
  { icon: Eye, title: "Unified Analytics", desc: "Get real-time insights into request volume, lead quality, and conversion performance." },
  { icon: ListChecks, title: "Enterprise Security", desc: "Data encryption ensures your customer information is always safe and compliant." },
];

function SmartIntakeDemo() {
  return (
    <section id="smart-intake" className="py-24 md:py-32 bg-secondary/30 border-y border-border">
      <div className="mx-auto max-w-5xl px-6">
        <ParallaxTitle word="AUTOMATION" center={true}>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium text-navy-deep leading-tight">
              See how a 24/7 smart intake handles real customer requests
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              This example shows how a business can receive, guide and qualify customer requests automatically before human intervention.
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
          {intakeBenefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-elevated hover:border-brand/40 transition-all">
              <span className="size-11 rounded-lg bg-brand/10 grid place-items-center mb-4">
                <Icon className="size-5 text-brand" />
              </span>
              <p className="text-base font-medium text-navy-deep leading-snug">{title}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
          {[
            { n: "01", title: "Capture", desc: "AI collects requests from WhatsApp, phone or your website instantly." },
            { n: "02", title: "Process", desc: "Advanced AI extracts intent, urgency and priority in milliseconds." },
            { n: "03", title: "Organize", desc: "Request is assigned to the right team with a clear AI summary." },
          ].map(({ n, title, desc }) => (
            <div key={n} className="rounded-xl p-6 border border-border bg-white">
              <div className="text-brand text-sm font-mono font-semibold mb-3">{n}</div>
              <h3 className="text-lg font-medium text-navy-deep">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition">
            Request a similar system <ArrowRight className="size-4" />
          </a>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground italic">
          French demo video - example adaptable to clinics, salons, agencies and any service business.
        </p>
      </div>
    </section>
  );
}

function FeaturedDemo() {
  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">

        {/* Live demo intro block */}
        <div className="mb-16 rounded-2xl border border-brand/30 bg-navy-gradient text-white p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-medium leading-snug">
            Live system — built for a real restaurant in Nice
          </h2>
          <p className="mt-3 text-white/70 leading-relaxed max-w-2xl">
            This is a real demo we built. Explore it, then call or WhatsApp our demo receptionist.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://bycosystems.xyz/demo/les-sens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-navy-deep font-medium hover:bg-white/90 transition"
            >
              Explore the demo <ArrowRight className="size-4" />
            </a>
            <a
              href="https://wa.me/447576594092?text=Bonjour%20ByCo%20Systems%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20votre%20syst%C3%A8me%20d%27accueil%20intelligent."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 font-medium transition"
            >
              Call or WhatsApp +44 7576 594092
            </a>
          </div>
          <p className="mt-4 text-xs text-white/45">
            Our demo receptionist answers 24/7. This is exactly what we build for your business.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <ParallaxTitle word="GUIDE">
              <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">Your free operational dashboard - included from Business</h2>
            </ParallaxTitle>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Track client requests, assign tasks to your team and monitor your activity in real time. Simple, clear, ready from day one.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {demoFeatures.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span className="size-7 rounded-md bg-brand/10 grid place-items-center">
                    <Icon className="size-3.5 text-brand" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <a href={DEMO_URL}
              className="mt-10 inline-flex items-center gap-2 px-5 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition"
            >
              Explore workspace
            </a>
          </div>
          <div className="lg:col-span-7">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand/10 rounded-3xl blur-2xl" />
              <div className="relative"><DashboardMockup /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- PRICING ---
const pricingPlans = [
  {
    name: "Essential",
    price: "490€",
    subtitle: "Your digital presence, up and running",
    desc: "No website yet? We build everything from scratch and automate your client intake from day one.",
    features: [
      "Professional website built from scratch",
      "Online client intake form",
      "WhatsApp automation (greeting + confirmation)",
      "Booking system with automatic reminders",
      "Internal request tracking dashboard",
      "Setup in 24h",
    ],
    cta: "Request this system",
    highlight: false,
    badge: null,
  },
  {
    name: "Business",
    price: "990€",
    subtitle: "Your complete smart reception system",
    desc: "Already have a website? We add an intelligent reception layer on top - no rebuild needed.",
    features: [
      "Everything in Essential",
      "Smart phone reception 24/7",
      "Automated client follow-up sequences",
      "Automatic request qualification & routing",
      "🎁 ReadyFlow Manager included - track requests, assign tasks and monitor your team from one dashboard",
      "Setup in 48h",
    ],
    cta: "Request this system",
    highlight: true,
    badge: null,
  },
  {
    name: "Business+",
    price: "1 490€",
    subtitle: "Full system with AI voice reception",
    desc: "Everything in Business, plus a custom AI voice receptionist that answers and qualifies every call.",
    features: [
      "Everything in Business",
      "AI voice phone reception (custom voice + script)",
      "Advanced multi-channel automation (web, WhatsApp, email)",
      "Integration with your existing tools (CRM, calendar)",
      "🎁 ReadyFlow Manager included",
      "Setup in 48-72h",
    ],
    cta: "Request this system",
    highlight: false,
    badge: "⭐ Recommended",
  },
  {
    name: "Premium",
    price: "1 990€",
    subtitle: "Full system, built and supported",
    desc: "Our most complete package - fully customized, delivered with priority and supported for 30 days.",
    features: [
      "Everything in Business+",
      "Full workflow audit & mapping",
      "Advanced customization (voice, script, industry-specific scenarios)",
      "30-day post-delivery support & adjustments included",
      "Priority delivery",
      "🎁 ReadyFlow Manager included",
      "Setup in 72h",
    ],
    cta: "Request this system",
    highlight: false,
    badge: null,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-secondary/30 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <ParallaxTitle word="PLANS" center={true}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">
              Simple, transparent pricing
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              One-time setup. No monthly fees. No surprises.
            </p>
          </div>
        </ParallaxTitle>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map(({ name, price, subtitle, desc, features, cta, highlight, badge }) => (
            <div
              key={name}
              className={`relative rounded-2xl p-8 border transition-all flex flex-col ${
                highlight
                  ? "border-brand bg-navy text-white shadow-elevated scale-[1.02]"
                  : "border-border bg-white hover:border-brand/40 hover:shadow-elevated"
              }`}
            >
              {badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand text-white text-xs font-semibold whitespace-nowrap">
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
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Need a custom system? <a href="#contact" className="text-brand font-medium hover:underline">Talk to us</a> - we adapt to every service business.
        </p>
      </div>
    </section>
  );
}

const steps = [
  { n: "01", title: "Understand the workflow", desc: "We map how your team actually works today.", day: "Day 1" },
  { n: "02", title: "Build a practical first version", desc: "A focused, usable system - not an oversized platform.", day: "Day 1–2" },
  { n: "03", title: "Adapt the system to the business", desc: "Refine details based on real day-to-day usage.", day: "Day 2–3" },
  { n: "04", title: "Deliver a clear and usable operational tool", desc: "A system your team can rely on from day one.", day: "Delivered in 24–72h" },
];

function Process() {
  return (
    <section id="process" className="py-24 bg-navy-gradient text-white relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6">
        <ParallaxTitle word="PROCESS" dark={true}>
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-medium text-white">
              How projects move from idea to usable system
            </h2>
          </div>
        </ParallaxTitle>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ n, title, desc, day }) => (
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
        <Field label="Name" name="name" />
        <Field label="Business" name="business" />
      </div>
      <Field label="Email" name="email" type="email" />
      <div>
        <label className="block text-sm font-medium text-navy-deep mb-1.5">Message</label>
        <textarea name="message" required rows={5}
          className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
        />
      </div>
      <button type="submit"
        className="mt-2 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition"
      >
        Send request <ArrowRight className="size-4" />
      </button>
      {submitted && <p className="text-sm text-brand font-medium">Thanks - we'll be in touch soon!</p>}
    </form>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-deep mb-1.5">{label}</label>
      <input required type={type} name={name}
        className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
      />
    </div>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <ParallaxTitle word="CONTACT">
            <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">Request a Demo</h2>
          </ParallaxTitle>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Tell us your biggest reception headache. We'll show you exactly what we can automate.
          </p>
          <a href="https://wa.me/447576594092?text=Bonjour%2C%20je%20viens%20de%20visiter%20votre%20site%20et%20j%27aimerais%20une%20d%C3%A9monstration." target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.502A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.368l-.36-.214-3.732.885.936-3.617-.235-.373A9.818 9.818 0 1112 21.818z"/>
            </svg>
            Chat with us on WhatsApp
          </a>
          <div className="mt-8 p-5 rounded-lg border border-border bg-secondary/50">
            <div className="text-sm text-muted-foreground font-medium">Response within 24 hours</div>
            <p className="mt-1 text-sm text-navy-deep font-medium">
              We review every request and get back to you with a clear proposal.
            </p>
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-7 shadow-elevated">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

const faqItems = [
  {
    q: "Why not just use a €49/month subscription tool?",
    a: "Those tools require setup, maintenance and ongoing fees. We build it, configure it and hand it over. One payment. Runs forever. One recovered client on a Saturday night pays for the whole thing.",
  },
  {
    q: "Does this work for my type of business?",
    a: "If clients call you, message you or book with you — yes. We've built systems for restaurants, clinics, law firms, salons and agencies. If you're a service business, we adapt.",
  },
  {
    q: "How long until I'm up and running?",
    a: "24 hours for Essential. 48 hours for Business and Business+. 72 hours for Premium. Not weeks. Not months.",
  },
  {
    q: "What happens after delivery?",
    a: "The system runs on its own. No action needed from your side. Premium plan includes 30 days of support and adjustments. All plans include a handover walkthrough.",
  },
  {
    q: "Can I see it working before I buy?",
    a: "Yes. Call or WhatsApp +44 7576 594092 right now. Our demo receptionist is live 24/7. That's exactly what we build for you.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-navy-deep">Common questions</h2>
          <p className="mt-3 text-muted-foreground">Straight answers — no fluff.</p>
        </div>
        <div className="divide-y divide-border">
          {faqItems.map(({ q, a }, i) => (
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
  return (
    <footer className="bg-navy-deep text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-md bg-white/10 grid place-items-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <span className="text-white font-semibold tracking-tight">ByCo Systems</span>
            </div>
            <p className="mt-3 text-sm max-w-md">
              Smart reception systems, WhatsApp automation and operational dashboards for service businesses.
            </p>
          </div>
          <div className="text-sm text-white/40">
            Â© {new Date().getFullYear()} ByCo Systems. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <CoreOffer />
        <Services />
        <WhoWeServe />
        <SmartIntakeIntro />
        <SmartIntakeDemo />
        <FeaturedDemo />
        <Pricing />
        <Process />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
