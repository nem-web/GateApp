import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { LEGAL_LAST_UPDATED, LEGAL_PAGES, getLegalPage } from "@/lib/legal-pages";
import { ChevronRight, Scale, Calendar, FileText, ArrowRight } from "lucide-react";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return {};
  return createMetadata({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
    modifiedTime: LEGAL_LAST_UPDATED,
  });
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();
  
  const lastUpdated = new Intl.DateTimeFormat("en-IN", { 
    dateStyle: "long" 
  }).format(new Date(LEGAL_LAST_UPDATED));

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#E5E7EB] font-sans selection:bg-[#6C63FF]/30 relative pb-24">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6C63FF]/10 blur-[120px] rounded-full pointer-events-none" />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
            { name: page.title, path: `/${page.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": page.slug === "contact-us" ? "ContactPage" : "WebPage",
            name: page.title,
            description: page.description,
            url: absoluteUrl(`/${page.slug}`),
            dateModified: LEGAL_LAST_UPDATED,
          },
        ]}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-col px-4 pt-24 sm:px-6 lg:px-8">
        
        {/* BREADCRUMBS */}
        <nav className="mb-12 flex flex-wrap items-center gap-2 text-sm text-[#9CA3AF]">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <ChevronRight size={14} />
          <Link href="/pricing" className="transition-colors hover:text-white">Pricing</Link>
          <ChevronRight size={14} />
          <span className="font-medium text-white">{page.title}</span>
        </nav>

        {/* HEADER SECTION */}
        <header className="mb-16 border-b border-white/10 pb-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#6C63FF]">
            <Scale size={14} /> Legal & Compliance
          </div>
          
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            {page.title}
          </h1>
          
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-[#9CA3AF]">
            {page.description}
          </p>
          
          <div className="flex w-fit items-center gap-2 rounded-lg border border-[#6C63FF]/10 bg-[#6C63FF]/5 px-4 py-2 text-sm font-medium text-[#6C63FF]">
            <Calendar size={16} />
            Last updated: {lastUpdated}
          </div>
        </header>

        {/* DOCUMENT CONTENT */}
        <div className="space-y-12">
          {page.sections.map((section, index) => (
            <section key={section.heading} className="scroll-mt-24">
              <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-white">
                <span className="text-lg text-[#6C63FF]">{index + 1}.</span> 
                {section.heading}
              </h2>
              <div className="space-y-5">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-loose text-[#9CA3AF]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* RELATED POLICIES FOOTER */}
        <section className="mt-24 rounded-3xl border border-white/5 bg-[#1A1D27]/50 p-8">
          <h2 className="mb-6 text-xl font-bold text-white">Related Policies</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {LEGAL_PAGES.filter((item) => item.slug !== page.slug).map((item) => (
              <Link 
                key={item.slug} 
                href={`/${item.slug}`} 
                className="group flex items-center justify-between rounded-xl border border-white/5 bg-[#1A1D27] p-5 transition-all hover:border-[#6C63FF]/50 hover:bg-[#1A1D27]/80"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#6C63FF]/10 text-[#6C63FF]">
                    <FileText size={18} />
                  </div>
                  <span className="font-semibold text-[#E5E7EB] transition-colors group-hover:text-white">
                    {item.title}
                  </span>
                </div>
                <ArrowRight size={18} className="text-[#9CA3AF] transition-transform group-hover:translate-x-1 group-hover:text-[#6C63FF]" />
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}