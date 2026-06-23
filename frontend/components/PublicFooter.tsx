import Link from "next/link";

const branchLinks = [
  { name: "EE (Electrical)", href: "/resources/gate-ee" },
  { name: "ECE (Electronics)", href: "/resources/gate-ece" },
  { name: "CS/IT", href: "/resources/gate-cs" },
  { name: "ME (Mechanical)", href: "/resources/gate-me" },
  { name: "CE (Civil)", href: "/resources/gate-ce" },
] as const;

const companyLinks = [
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
] as const;

const toolLinks = [
  { name: "AI Study Planner", href: "/study-plan" },
  { name: "Mock Drill Tests", href: "/test" },
  { name: "PYQ Bank", href: "/pyq-bank" },
  { name: "Flashcards", href: "/flashcards" },
  { name: "Rank Predictor", href: "/tools/rank-predictor" },
] as const;

const resourceLinks = [
  { name: "GATE Syllabus", href: "/syllabus" },
  { name: "Weightage Analysis", href: "/weightage-analysis" },
  { name: "Free Notes", href: "/free-notes" },
  { name: "Formula Sheets", href: "/formula-sheets" },
] as const;

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
  { name: "Refund Policy", href: "/refund-policy" },
] as const;

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { name: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white tracking-wide mb-6">{title}</h3>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicFooter() {
  return (
    <footer className="w-full bg-[#111216] border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-6 lg:gap-8">
          
          {/* Column 1: Brand (Takes 2 cols on large screens) */}
          <div className="col-span-2">
            <Link 
              href="/" 
              className="flex items-center gap-3 w-fit group transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22c55e] shadow-sm">
                <span className="text-base font-bold text-black">G</span>
              </div>
              <span className="text-base font-semibold text-white tracking-wide">GATEPrep Pro</span>
            </Link>
            
            <p className="mt-6 text-sm text-gray-400">
              Built for GATE aspirants in India.
            </p>
          </div>

          {/* Columns 2-5: Links */}
          <FooterColumn title="Branches" links={branchLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Tools" links={toolLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />

        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-gray-800/60 pt-8 md:flex-row">
          <p className="text-xs text-gray-400">
            &copy; 2025 GATEPrep Pro. All rights reserved.
          </p>
          
          <nav aria-label="Legal links" className="flex flex-wrap items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-400 transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
      </div>
    </footer>
  );
}