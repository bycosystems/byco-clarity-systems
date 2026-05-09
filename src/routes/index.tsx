import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";
import { DashboardMockup } from "@/components/DashboardMockup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ByCo Systems — Practical business web apps & dashboards" },
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

const DEMO_URL = "https://readyflow-manager-demo.lovable.app";

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
              Practical business web apps, dashboards and workflow tools.
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
              ByCo Systems turns messy operations into simple digital systems for service-based businesses.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-navy-deep font-medium hover:bg-white/90 transition"
              >
                View Demo <ArrowRight className="size-4" />
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
          Practical web apps and dashboards are built to organize requests, tasks, clients, teams and workflows in one
          clear place.
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
    title: "Smart 24/7 Business Intake",
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

const demoFeatures = [
  { icon: ListChecks, label: "Task tracking" },
  { icon: Building2, label: "Unit management" },
  { icon: Workflow, label: "Workflow organization" },
  { icon: Users, label: "Team coordination" },
  { icon: Eye, label: "Operational visibility" },
  { icon: Inbox, label: "Request management" },
];

function FeaturedDemo() {
  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Featured Demo</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-medium text-navy-deep">ReadyFlow Manager</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              A modern operations dashboard demo built for property managers, maintenance teams, short-stay businesses
              and other service-based operations.
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
              View ReadyFlow Demo <ExternalLink className="size-4" />
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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="grid gap-4"
    >
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
        <p className="text-sm text-brand font-medium">Thanks — your request has been noted.</p>
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
            <div className="text-sm text-muted-foreground font-medium">Explore the live ReadyFlow demo</div>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-navy-deep font-medium hover:text-brand transition break-all"
            >
              {DEMO_URL} <ExternalLink className="size-3.5 shrink-0" />
            </a>
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
        <FeaturedDemo />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
