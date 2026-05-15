import Link from "next/link";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "About" };

const sources = [
  { label: "CPCB (air, water)", href: "https://cpcb.nic.in/" },
  { label: "IMD (rainfall)", href: "https://www.imdpune.gov.in/" },
  { label: "MNRE (solar)", href: "https://mnre.gov.in/" },
  { label: "data.gov.in catalog", href: "https://www.data.gov.in/" },
];

export default async function AboutPage() {
  const t = await getDict();
  return (
    <article className="prose prose-neutral max-w-2xl dark:prose-invert">
      <h1>{t.about.heading}</h1>
      <p>{t.about.intro}</p>
      <p>{t.about.footnote}</p>
      <h2>{t.about.sourcesHeading}</h2>
      <ul>
        {sources.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noreferrer noopener">{s.label}</a>
          </li>
        ))}
      </ul>
      <h2>{t.about.disclaimerHeading}</h2>
      <p>{t.about.disclaimerBody}</p>
      <p>
        <Link href="/">{t.about.backLink}</Link>
      </p>
    </article>
  );
}
