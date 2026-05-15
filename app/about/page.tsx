import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "About" };

const sources = [
  { label: "CPCB", desc: "Central Pollution Control Board (air, water)", href: "https://cpcb.nic.in/" },
  { label: "IMD", desc: "India Meteorological Department (rainfall)", href: "https://www.imdpune.gov.in/" },
  { label: "MNRE", desc: "Ministry of New and Renewable Energy (solar)", href: "https://mnre.gov.in/" },
  { label: "data.gov.in", desc: "Open Government Data Platform catalog", href: "https://www.data.gov.in/" },
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

      <section className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-5">
        <h2 className="font-heading text-xl tracking-tight">{t.about.disclaimerHeading}</h2>
        <p className="text-sm text-muted-foreground">{t.about.disclaimerBody}</p>
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
