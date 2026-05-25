import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { LayoutDashboard, Wrench, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const content = {
  en: {
    subtitle: "Flowentra offers two complementary applications designed to cover every aspect of your business operations.",
    apps: [
      {
        id: "crm-office",
        icon: LayoutDashboard,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950/40",
        border: "border-blue-200 dark:border-blue-800",
        tag: "Back-office & Sales",
        title: "Flowentra CRM/Office",
        subtitle: "The complete back-office suite for growing businesses.",
        desc: "Flowentra CRM/Office centralizes all your commercial, financial and operational activities in one unified platform. From first contact to final invoice, it gives your team full visibility and control over every client relationship and business process.",
        features: [
          "Customer Relationship Management (CRM) with full client history",
          "Professional quote creation with automated cost calculation",
          "Purchase and supplier order management",
          "Project and task management with milestone tracking",
          "Financial management: invoicing, payments and KPI dashboards",
          "Human resources: employees, payroll, leaves and performance",
          "AI-powered workflow automation and business analytics",
        ],
        ideal: "Ideal for: sales teams, back-office managers, operations directors and finance departments looking to centralize and automate their daily workflows.",
        pricingHref: "/pricing#pricing-crm",
      },
      {
        id: "service",
        icon: Wrench,
        color: "text-cyan-500",
        bg: "bg-cyan-50 dark:bg-cyan-950/40",
        border: "border-cyan-200 dark:border-cyan-800",
        tag: "Field Operations",
        title: "Flowentra Service",
        subtitle: "Built for field service teams and technicians.",
        desc: "Flowentra Service is the dedicated application for companies that manage technicians, field interventions and on-site operations. It brings planning, dispatch, mobile execution and digital documentation together in a single, easy-to-use platform.",
        features: [
          "Drag-and-drop planning calendar with multi-technician view",
          "AI-assisted dispatch based on skills, availability and location",
          "Real-time GPS tracking of field teams",
          "Mobile app for technicians: job details, navigation and status updates",
          "Digital checklists, photo capture and e-signature on-site",
          "Automatic PDF report generation after each intervention",
          "Preventive and corrective maintenance scheduling",
        ],
        ideal: "Ideal for: field service companies, HVAC, plumbing, electrical, facility management and any business that schedules and manages on-site technician teams.",
        pricingHref: "/pricing#pricing-service",
      },
    ],
    ctaTitle: "Not sure which application fits your needs?",
    ctaDesc: "Book a demo and our team will guide you through both applications to find the best fit for your business.",
    ctaBtn: "Book a Demo",
  },
  fr: {
    subtitle: "Flowentra propose deux applications complémentaires conçues pour couvrir chaque aspect de vos opérations.",
    apps: [
      {
        id: "crm-office",
        icon: LayoutDashboard,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950/40",
        border: "border-blue-200 dark:border-blue-800",
        tag: "Back-office & Commercial",
        title: "Flowentra CRM/Office",
        subtitle: "La suite back-office complète pour les entreprises en croissance.",
        desc: "Flowentra CRM/Office centralise toutes vos activités commerciales, financières et opérationnelles dans une plateforme unifiée. Du premier contact à la facture finale, il offre à votre équipe une visibilité totale et un contrôle complet sur chaque relation client et processus métier.",
        features: [
          "Gestion de la relation client (CRM) avec historique complet",
          "Création de devis professionnels avec calcul automatique des coûts",
          "Gestion des achats et commandes fournisseurs",
          "Gestion des projets et tâches avec suivi des jalons",
          "Gestion financière : facturation, paiements et tableaux de bord KPI",
          "Ressources humaines : employés, paie, congés et performance",
          "Automatisation des workflows IA et analytique métier",
        ],
        ideal: "Idéal pour : équipes commerciales, responsables back-office, directeurs des opérations et services financiers cherchant à centraliser et automatiser leurs workflows quotidiens.",
        pricingHref: "/pricing#pricing-crm",
      },
      {
        id: "service",
        icon: Wrench,
        color: "text-cyan-500",
        bg: "bg-cyan-50 dark:bg-cyan-950/40",
        border: "border-cyan-200 dark:border-cyan-800",
        tag: "Opérations Terrain",
        title: "Flowentra Service",
        subtitle: "Conçu pour les équipes terrain et les techniciens.",
        desc: "Flowentra Service est l'application dédiée aux entreprises qui gèrent des techniciens, des interventions terrain et des opérations sur site. Il réunit planification, dispatch, exécution mobile et documentation digitale dans une plateforme unique et facile à utiliser.",
        features: [
          "Calendrier de planification drag-and-drop avec vue multi-techniciens",
          "Dispatch assisté par IA selon compétences, disponibilité et localisation",
          "Suivi GPS en temps réel des équipes terrain",
          "Application mobile pour techniciens : détails de mission, navigation et mises à jour",
          "Checklists digitales, capture photo et signature électronique sur site",
          "Génération automatique de rapports PDF après chaque intervention",
          "Planification de maintenance préventive et corrective",
        ],
        ideal: "Idéal pour : entreprises de services terrain, HVAC, plomberie, électricité, facility management et toute entreprise planifiant et gérant des équipes de techniciens sur site.",
        pricingHref: "/pricing#pricing-service",
      },
    ],
    ctaTitle: "Vous ne savez pas quelle application correspond à vos besoins ?",
    ctaDesc: "Réservez une démo et notre équipe vous guidera à travers les deux applications pour trouver la meilleure option pour votre entreprise.",
    ctaBtn: "Réserver une démo",
  },
};

const Applications = () => {
  const { lang } = useLanguage();
  const t = lang === "fr" ? content.fr : content.en;

  return (
    <PageLayout
      title={lang === "fr" ? "Nos Applications" : "Our Applications"}
      subtitle={t.subtitle}
    >
      <section className="py-12 lg:py-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-5xl flex flex-col gap-10">
          {t.apps.map((app, i) => {
            const Icon = app.icon;
            return (
              <motion.div
                key={app.id}
                id={app.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
              >
                {/* Header band */}
                <div className={`px-6 lg:px-8 py-5 border-b ${app.border} bg-muted/20 flex items-center gap-4`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${app.bg}`}>
                    <Icon className={`w-6 h-6 ${app.color}`} />
                  </div>
                  <div>
                    <span className={`text-xs font-semibold uppercase tracking-widest ${app.color}`}>{app.tag}</span>
                    <h2 className="text-lg font-bold text-foreground leading-tight">{app.title}</h2>
                    <p className="text-sm text-muted-foreground">{app.subtitle}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="grid md:grid-cols-[1fr_280px] gap-0">
                  {/* Description + ideal */}
                  <div className="p-6 lg:p-8 border-r border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{app.desc}</p>
                    <p className={`text-xs font-semibold ${app.color} leading-relaxed mb-6`}>{app.ideal}</p>
                    <Link
                      to={app.pricingHref}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      {lang === "fr" ? "Voir les tarifs" : "View Pricing"}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Features list */}
                  <div className="p-6 lg:p-8 bg-muted/10">
                    <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
                      {lang === "fr" ? "Fonctionnalités clés" : "Key features"}
                    </p>
                    <ul className="space-y-2.5">
                      {app.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${app.color}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="container mx-auto max-w-5xl mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center"
        >
          <h3 className="text-base font-bold text-foreground mb-2">{t.ctaTitle}</h3>
          <p className="text-sm text-muted-foreground mb-6">{t.ctaDesc}</p>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
          >
            {t.ctaBtn}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default Applications;
