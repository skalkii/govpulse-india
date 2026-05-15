import Link from "next/link";
import { ChevronLeft, ExternalLink, Github, Mail } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "About" };

const REPO_URL = "https://github.com/kalkii/govpulse-india";
const FEEDBACK_EMAIL = "skalkiipwork@gmail.com";

const sources = [
  { label: "CPCB", desc: "Central Pollution Control Board (air, water)", href: "https://cpcb.nic.in/" },
  { label: "IMD", desc: "India Meteorological Department (rainfall)", href: "https://www.imdpune.gov.in/" },
  { label: "MNRE", desc: "Ministry of New and Renewable Energy (solar)", href: "https://mnre.gov.in/" },
  { label: "data.gov.in", desc: "Open Government Data Platform catalog", href: "https://www.data.gov.in/" },
];

const methodology = [
  {
    icon: "🌬️",
    title: "AQI",
    body:
      "Live CPCB station readings via data.gov.in (resource 3b01bcb8). City headline averages PM2.5/PM10/NO2/SO2/O3 sub-indices across all stations; CO/NH3 excluded due to inconsistent units upstream. Forecast applies a fixed diurnal multiplier (peaks ~7am and ~9pm) to the current reading — auditable rules, not a chemical-transport model.",
  },
  {
    icon: "🌊",
    title: "Rivers",
    body:
      "Hand-curated subset of 34 famous CPCB monitoring stations from recent annual reports. Classified against CPCB designated best-use criteria (Class A → Below E) using DO, BOD, pH, and fecal coliform. Frozen snapshot — India has no consolidated national real-time water quality API yet.",
  },
  {
    icon: "🌧️",
    title: "Rainfall",
    body:
      "732 districts pulled live from data.gov.in (NRSC VIC land-surface model, resource 6c05cd1b). 8-year mean + standard deviation per district for both annual and monsoon (JJAS) totals. Anomaly is z-score against this baseline. Absolute mm runs ~20-30% lower than IMD's 50-yr long-period averages; the anomaly percentage is the safe takeaway.",
  },
  {
    icon: "☀️",
    title: "Solar",
    body:
      "Annual mean GHI per district from MNRE Solar Atlas (43 districts) cross-referenced with the India Post pincode directory (auto-fetched, 155k records collapsed to 403 PIN3 prefixes). Payback math uses 100 sq ft/kW, 75% system efficiency, ₹60k/kW installed (post 30% MNRE subsidy), ₹7/kWh tariff, 0.5%/yr panel degradation, 25-year horizon.",
  },
];

export default async function AboutPage() {
  const t = await getDict();
  return (
    <article className="mx-auto max-w-2xl space-y-10">
      <header className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> {t.actions.backHome}
        </Link>
        <h1 className="font-heading text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          {t.about.heading}
        </h1>
      </header>

      <section className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        <p>{t.about.intro}</p>
        <p className="text-foreground">{t.about.footnote}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl tracking-tight">{t.about.sourcesHeading}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {sources.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="min-w-0">
                  <div className="font-semibold">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
                <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl tracking-tight">Methodology</h2>
        <ul className="space-y-3">
          {methodology.map((m) => (
            <li key={m.title} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-lg" aria-hidden>{m.icon}</span>
                <h3 className="font-semibold tracking-tight">{m.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{m.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-5">
        <h2 className="font-heading text-xl tracking-tight">{t.about.disclaimerHeading}</h2>
        <p className="text-sm text-muted-foreground">{t.about.disclaimerBody}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40"
        >
          <Github className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
          <div className="min-w-0">
            <div className="font-semibold">Source on GitHub</div>
            <div className="text-xs text-muted-foreground">MIT licensed. PRs welcome.</div>
          </div>
        </a>
        <a
          href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent("GovPulse India feedback")}`}
          className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40"
        >
          <Mail className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
          <div className="min-w-0">
            <div className="font-semibold">Send feedback</div>
            <div className="text-xs text-muted-foreground">Bug reports, data ideas, corrections.</div>
          </div>
        </a>
      </section>

      <p className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="size-4" /> {t.about.backLink.replace(/^←\s*/, "")}
        </Link>
      </p>
    </article>
  );
}
