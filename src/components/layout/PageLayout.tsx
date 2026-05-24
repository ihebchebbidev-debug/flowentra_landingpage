import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Meta description (defaults to subtitle when omitted). */
  description?: string;
  /** Optional canonical URL override. */
  canonical?: string;
  /** Optional JSON-LD structured data. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Hide page from search engines. */
  noindex?: boolean;
}

const PageLayout = ({
  children,
  title,
  subtitle,
  description,
  canonical,
  jsonLd,
  noindex,
}: PageLayoutProps) => (
  <div className="min-h-screen">
    <SEO
      title={title}
      description={
        description ??
        subtitle ??
        `${title} — Flowentra unifies CRM, workflows, analytics and AI in one platform.`
      }
      canonical={canonical}
      jsonLd={jsonLd}
      noindex={noindex}
    />
    <Navbar />
    <section className="pt-24 pb-6 bg-card border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-2">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
    <main>{children}</main>
    <Footer />
  </div>
);

export default PageLayout;
