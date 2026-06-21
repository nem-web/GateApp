import Link from "next/link";
import {
  Calculator,
  BarChart3,
  Brain,
  Award,
  PenTool,
  FileText,
  BookOpen,
  Sparkles,
  Youtube,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
} from "lucide-react";

const brandLinks = [
  { name: "About Us", href: "/about-us" },
  { name: "Contact", href: "/contact-us" },
  { name: "Blog", href: "/blog" },
  { name: "Sitemap", href: "/html-sitemap" },
] as const;

const toolLinks = [
  { name: "Marks Calculator", href: "/gate-marks-calculator", icon: Calculator },
  { name: "Rank Predictor", href: "/gate-rank-predictor", icon: BarChart3 },
  { name: "Study Planner", href: "/study-planner", icon: Brain },
  { name: "Revision Tracker", href: "/revision-tracker", icon: Award },
  { name: "Daily Quiz", href: "/daily-quiz", icon: PenTool },
] as const;

const resourceLinks = [
  { name: "Blogs", href: "/blog", icon: FileText },
  { name: "PYQ Papers", href: "/pyq", icon: BookOpen },
  { name: "Formula Sheets", href: "/free-formula-sheets", icon: Sparkles },
  { name: "Free Notes", href: "/free-gate-notes", icon: FileText },
  { name: "Vlogs", href: "/vlogs", icon: Youtube },
] as const;

const branchLinks = [
  { name: "GATE EE", href: "/gate-ee" },
  { name: "GATE CS", href: "/gate-cs" },
  { name: "GATE EC", href: "/gate-ec" },
  { name: "GATE ECE", href: "/gate-ece" },
  { name: "GATE CE", href: "/gate-ce" },
  { name: "GATE ME", href: "/gate-me" },
  { name: "GATE IN", href: "/gate-in" },
] as const;

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
  { name: "Refund Policy", href: "/refund-cancellation-policy" },
  { name: "Subscription Terms", href: "/subscription-terms" },
  { name: "Cookie Policy", href: "/cookie-policy" },
  { name: "Disclaimer", href: "/disclaimer" },
  { name: "Editorial Policy", href: "/editorial-policy" },
] as const;

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { name: string; href: string; icon?: React.ComponentType<{ className?: string }> }[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground tracking-tight">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex w-fit items-center gap-2.5 text-sm text-muted-foreground transition-all duration-200 hover:text-primary"
            >
              {link.icon && (
                <link.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              )}
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                {link.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border/50 bg-background w-full">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        
        {/* FIXED OVERFLOW: Switched from gap flexbox to a safe grid layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* Column 1: Brand (Takes 4 cols on large screens) */}
          <div className="space-y-6 lg:col-span-4">
            <Link 
              href="/" 
              className="flex items-center gap-3 w-fit group transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm group-hover:shadow-md transition-all">
                <span className="text-xl font-bold text-primary-foreground">G</span>
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">GATEPrep Pro</span>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs pr-4">
              Indian SaaS study tools for GATE aspirants. Plan, practice, and track your preparation
              with smart tools, PYQs, flashcards, and AI-powered insights.
            </p>
            
            <div className="flex flex-col gap-3 pt-2">
              <a 
                href="mailto:support@gateprep.pro" 
                className="flex w-fit items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                <span>support@gateprep.pro</span>
              </a>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>India</span>
              </div>
            </div>
          </div>

          {/* Column 2: Links Grid (Takes 8 cols on large screens) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8 lg:gap-4 xl:gap-8">
            <FooterColumn title="Branches" links={branchLinks} />
            <FooterColumn title="Company" links={brandLinks} />
            <FooterColumn title="Tools" links={toolLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />
          </div>

        </div>

        {/* Bottom Bar: Legal Links & Copyright */}
        <div className="mt-16 flex flex-col-reverse items-center justify-between gap-6 border-t border-border/50 pt-8 lg:flex-row">
          <p className="text-xs text-muted-foreground text-center lg:text-left">
            &copy; {new Date().getFullYear()} GATEPrep Pro. All rights reserved. | Built for GATE aspirants in India.
          </p>
          
          <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-end">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
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