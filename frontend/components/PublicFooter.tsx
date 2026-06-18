import Link from "next/link";

const legalLinks = [
  ["Privacy Policy", "/privacy-policy"],
  ["Terms", "/terms-of-service"],
  ["Refunds", "/refund-cancellation-policy"],
  ["Subscription Terms", "/subscription-terms"],
  ["Cookies", "/cookie-policy"],
  ["Disclaimer", "/disclaimer"],
  ["Contact", "/contact-us"],
  ["About", "/about-us"],
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-foreground">GATEPrep Pro</p>
          <p>Indian SaaS study tools for GATE Electrical Engineering aspirants.</p>
        </div>
        <nav aria-label="Legal links" className="flex flex-wrap gap-x-4 gap-y-2">
          {legalLinks.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
