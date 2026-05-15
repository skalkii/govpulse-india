import Link from "next/link";

export const metadata = { title: "About — GovPulse India" };

const sources = [
  { label: "CPCB (air, water)", href: "https://cpcb.nic.in/" },
  { label: "IMD (rainfall)", href: "https://www.imdpune.gov.in/" },
  { label: "MNRE (solar)", href: "https://mnre.gov.in/" },
  { label: "data.gov.in catalog", href: "https://www.data.gov.in/" },
];

export default function AboutPage() {
  return (
    <article className="prose prose-neutral max-w-2xl dark:prose-invert">
      <h1>About GovPulse India</h1>
      <p>
        India publishes a lot of useful public data through{" "}
        <a href="https://www.data.gov.in/" target="_blank" rel="noreferrer noopener">
          data.gov.in
        </a>{" "}
        and individual ministry portals. Most of it sits in spreadsheets,
        unwieldy dashboards, or PDFs. GovPulse turns the highest-value slices
        into one-click answers.
      </p>
      <p>
        One app, no database, no login. Built and run for ₹0/month.
      </p>
      <h2>Data sources</h2>
      <ul>
        {sources.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noreferrer noopener">{s.label}</a>
          </li>
        ))}
      </ul>
      <h2>Disclaimer</h2>
      <p>
        Estimates and informational summaries only. Don&apos;t use these tools
        for emergency decisions, regulatory filings, or professional advice.
        Cross-check against the original government source linked on each
        result.
      </p>
      <p>
        <Link href="/">← Back to all tools</Link>
      </p>
    </article>
  );
}
