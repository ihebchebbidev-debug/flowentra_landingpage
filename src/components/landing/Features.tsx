import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { FileText, Users, CalendarDays, FolderKanban, ClipboardCheck, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const modules = {
  en: [
    { icon: Users,         href: "/modules#client-management",   title: "CRM & Client Management",         desc: "Centralize all your client profiles, interactions and communications in one place to keep every relationship on track." },
    { icon: CalendarDays,  href: "/modules#field-operations",    title: "Field Service Management",         desc: "Plan, dispatch and track your field technicians in real time with AI-assisted scheduling and a mobile app." },
    { icon: FileText,      href: "/modules#quotes-sales",        title: "Quotes & Sales",                   desc: "Create professional quotes in minutes, track opportunities and automatically convert them into work orders." },
    { icon: FolderKanban,  href: "/modules#project-maintenance", title: "Projects & Maintenance",           desc: "Manage multi-phase projects, preventive maintenance schedules and equipment lifecycle from a single view." },
    { icon: ClipboardCheck,href: "/modules#service-execution",   title: "Digital Documentation",            desc: "Equip your teams with digital checklists, photo capture and e-signatures so every job is documented automatically." },
    { icon: BarChart3,     href: "/modules#invoicing-analytics", title: "Invoicing, Analytics & AI",        desc: "Generate invoices from completed jobs, monitor KPIs in real time and automate repetitive tasks with AI workflows." },
  ],
  fr: [
    { icon: Users,         href: "/modules#client-management",   title: "CRM & Gestion Clients",                  desc: "Centralisez tous vos profils clients, interactions et communications en un seul endroit pour ne rien manquer." },
    { icon: CalendarDays,  href: "/modules#field-operations",    title: "Gestion des Interventions Terrain",       desc: "Planifiez, dispatchez et suivez vos techniciens en temps réel grâce au dispatch IA et à l'application mobile." },
    { icon: FileText,      href: "/modules#quotes-sales",        title: "Devis & Gestion Commerciale",             desc: "Créez des devis professionnels en quelques minutes, suivez vos opportunités et convertissez-les en bons de travail." },
    { icon: FolderKanban,  href: "/modules#project-maintenance", title: "Projets & Maintenance",                   desc: "Gérez vos projets multi-phases, la maintenance préventive et le cycle de vie des équipements depuis une seule vue." },
    { icon: ClipboardCheck,href: "/modules#service-execution",   title: "Documentation Digitale",                  desc: "Équipez vos équipes de checklists digitales, capture photo et signature électronique pour documenter chaque intervention." },
    { icon: BarChart3,     href: "/modules#invoicing-analytics", title: "Facturation, Analytique & IA",            desc: "Générez des factures depuis les bons de travail, suivez vos KPIs en temps réel et automatisez vos workflows IA." },
  ],
};

const Features = () => {
  const { lang } = useLanguage();
  const list = lang === "fr" ? modules.fr : modules.en;

  return (
    <section id="features" className="pt-24 pb-8 sm:pt-32 sm:pb-10 bg-transparent">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-5xl">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14 sm:mb-16">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            {lang === "fr" ? "Modules" : "Modules"}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {lang === "fr" ? "Tout ce dont vous avez besoin" : "Everything you need"}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {lang === "fr"
              ? "Des modules pensés pour chaque étape de vos opérations, réunis dans une seule plateforme."
              : "Modules built for every step of your operations, united in one platform."}
          </p>
        </div>

        {/* 2-column grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {list.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5">{mod.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{mod.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Discover more */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="flex justify-center mt-10"
        >
          <Link
            to="/modules"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
          >
            {lang === "fr" ? "Découvrir tous les modules" : "Discover all modules"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
