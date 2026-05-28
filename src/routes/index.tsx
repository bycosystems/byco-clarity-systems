import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
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
} from "lucide-react";
import { DashboardMockup } from "@/components/DashboardMockup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
     { title: "ByCo Systems — Operational systems for service businesses" },
      {
        name: "description",
        content:
          "ByCo Systems builds practical web apps, operations dashboards and workflow tools for service-based businesses.",
      },
      { property: "og:title", content: "ByCo Systems — Operational systems for service businesses" },
      {
        property: "og:description",
        content: "Dashboards, intake systems and workflow tools that turn messy operations into clear digital systems.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const DEMO_URL = "#contact";

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
          <a href="#demo" className="hover:text-navy-deep transition">Demo</a>
          <a href="#process" className="hover:text-navy-deep transition">Process</a>
          <a href="#contact" className="hover:text-navy-deep transition">Contact</a>
        </nav>
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
              Operational systems for service businesses
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.05]">
              Capture requests.<br />
              Track operations.<br />
              Stay organized.
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
              Operational systems built around real operations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-navy-deep font-medium hover:bg-white/90 transition"
              >
                See the system <ArrowRight className="size-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 font-medium transition"
              >
                Request a Demo
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-xs text-white/50">
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-brand-soft" /> Built around your workflow</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-brand-soft" /> Clear and usable systems</span>
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

function CoreOffer() {
  return (
    <section id="offer" className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Core offer</span>
        <h2 className="mt-4 text-3xl md:text-4xl font-medium text-navy-deep">
          Operational systems built for clarity and execution
        </h2>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Organize requests, coordinate teams and keep daily operations moving.
        </p>
      </div>
    </section>
  );
}

const services = [
  {
    icon: LayoutDashboard,
    title: "Operations Dashboards",
    desc: "Track tasks, teams, requests and daily operations from one clear interface.",
  },
  {
    icon: ClipboardList,
    title: "Client Intake Systems",
    desc: "Collect, organize and manage client requests with simple digital workflows.",
  },
  {
    icon: Bot,
    title: "24/7 Smart Intake",
    desc: "Add an intelligent assistant to guide visitors, qualify requests and simplify first contact.",
  },
];

function Services() {
  return (
    <section id="services" className="py-24 bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Services</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-medium text-navy-deep">
            What we build for service-based businesses
          </h2>
        </div>
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
    { icon: Building2, label: "Property & Real Estate" },
    { icon: Users, label: "Cleaning & Maintenance" },
    { icon: ClipboardList, label: "Healthcare & Clinics" },
    { icon: Workflow, label: "Logistics & Delivery" },
    { icon: LayoutDashboard, label: "Agencies & Consultants" },
    { icon: Bot, label: "Any service-based business" },
  ];

  return (
    <section className="py-16 border-b border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Who we build for</span>
          <h2 className="mt-4 text-2xl md:text-3xl font-medium text-navy-deep">
            Built for service businesses that need clarity
          </h2>
        </div>
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              ByCo Smart Intake
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-medium text-navy-deep leading-tight">
              ByCo Smart Intake
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              An intelligent intake system that captures, qualifies and routes customer requests automatically.
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
                    Smart Intake · Online
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
  { icon: Clock, title: "Respond to visitors 24/7" },
  { icon: PhoneOff, title: "Reduce repetitive calls and messages" },
  { icon: UserCheck, title: "Receive more qualified customer requests" },
];

function SmartIntakeDemo() {
  return (
    <section id="smart-intake" className="py-24 md:py-32 bg-secondary/30 border-y border-border">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            24/7 Smart Intake Demo
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-medium text-navy-deep leading-tight">
            See how a 24/7 smart intake handles real customer requests
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            This example shows how a business can receive, guide and qualify customer requests
            automatically before human intervention.
          </p>
        </div>

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

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {intakeBenefits.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-elevated hover:border-brand/40 transition-all text-center"
            >
              <span className="mx-auto size-11 rounded-lg bg-brand/10 grid place-items-center mb-4">
                <Icon className="size-5 text-brand" />
              </span>
              <p className="text-base font-medium text-navy-deep leading-snug">{title}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition"
          >
            Request a similar system <ArrowRight className="size-4" />
          </a>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground italic">
          French demo video — example adaptable to garages, rentals, local shops and service providers.
        </p>
      </div>
    </section>
  );
}

function FeaturedDemo() {
  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">OPERATIONS SYSTEM</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-medium text-navy-deep">ReadyFlow Manager</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Operational workspace for service businesses handling requests, teams, tasks and day-to-day coordination.
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

            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 px-5 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition"
            >
              Explore workspace <ExternalLink className="size-4" />
            </a>
          </div>
          <div className="lg:col-span-7">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand/10 rounded-3xl blur-2xl" />
              <div className="relative">
                <DashboardMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  { n: "01", title: "Understand the workflow", desc: "We map how your team actually works today." },
  { n: "02", title: "Build a practical first version", desc: "A focused, usable system — not an oversized platform." },
  { n: "03", title: "Adapt the system to the business", desc: "Refine details based on real day-to-day usage." },
  { n: "04", title: "Deliver a clear and usable operational tool", desc: "A system your team can rely on." },
];

function Process() {
  return (
    <section id="process" className="py-24 bg-navy-gradient text-white relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Process</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-medium">
            How projects move from idea to usable system
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ n, title, desc }) => (
            <div key={n} className="rounded-xl p-6 border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-brand-soft text-sm font-mono font-semibold">{n}</div>
              <h3 className="mt-3 font-medium text-lg leading-snug">{title}</h3>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">{desc}</p>
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
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
        />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-md bg-navy text-white font-medium hover:bg-navy-deep transition"
      >
        Send request <ArrowRight className="size-4" />
      </button>
      {submitted && (
        <p className="text-sm text-brand font-medium">Thanks — we'll be in touch soon!</p>
      )}
    </form>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-deep mb-1.5">{label}</label>
      <input
        required
        type={type}
        name={name}
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
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Contact</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-medium text-navy-deep">Request a Demo</h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Need a simple business app, dashboard or intake system?
          </p>
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
              Operational dashboards, workflow systems and practical business web apps.
            </p>
          </div>
          <div className="text-sm text-white/40">
            © {new Date().getFullYear()} ByCo Systems. All rights reserved.
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
        <CoreOffer />
        <Services />
        <WhoWeServe />
        <SmartIntakeIntro />
        <SmartIntakeDemo />
        <FeaturedDemo />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
