import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { FileText, Users, CalendarDays, FolderKanban, ClipboardCheck, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const modules = {
  en: [
    {
      id: "quotes-sales",
      icon: FileText,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/40",
      border: "border-violet-200 dark:border-violet-800",
      title: "Smart Quotes & Sales Management",
      subtitle: "Turn opportunities into signed contracts faster.",
      desc: "Flowentra gives your sales team the tools to create professional quotes in minutes, track commercial opportunities, and automate follow-ups — all from a single platform.",
      features: [
        "Customizable quote templates with automated cost calculation",
        "Sales pipeline management and opportunity tracking",
        "Client approval workflow with e-signature support",
        "Automatic conversion from quote to work order",
        "Commission tracking and sales performance reporting",
      ],
    },
    {
      id: "client-management",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-200 dark:border-blue-800",
      title: "Client Management & Communication",
      subtitle: "Build stronger client relationships with full visibility.",
      desc: "Centralize all client information, interaction history, and communication in one place. Keep your team aligned and your clients informed at every step.",
      features: [
        "Unified CRM with complete client profiles and history",
        "Client portal for real-time job visibility and document access",
        "Automated notifications via email, SMS and Telegram",
        "Interaction and communication log per client",
        "Segmentation, tags and custom client categories",
      ],
    },
    {
      id: "field-operations",
      icon: CalendarDays,
      color: "text-cyan-500",
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      border: "border-cyan-200 dark:border-cyan-800",
      title: "Field Operations & Team Management",
      subtitle: "Coordinate your field teams with precision and speed.",
      desc: "Plan, dispatch, and track your field technicians in real time. Reduce travel time, avoid scheduling conflicts, and ensure every job is assigned to the right person.",
      features: [
        "Drag-and-drop planning calendar with multi-resource view",
        "AI-assisted dispatch based on skills, location and availability",
        "Real-time GPS tracking of field technicians",
        "Mobile app for technicians: job details, navigation and updates",
        "Overtime tracking and workload balancing across teams",
      ],
    },
    {
      id: "project-maintenance",
      icon: FolderKanban,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-800",
      title: "Project, Maintenance & Equipment Management",
      subtitle: "Stay in control of every project, asset and maintenance cycle.",
      desc: "Manage multi-phase projects, preventive maintenance schedules, and equipment lifecycle from a single view. Never miss a service deadline or asset inspection.",
      features: [
        "Project creation with phases, milestones and budget tracking",
        "Preventive and corrective maintenance scheduling",
        "Equipment registry with full service and intervention history",
        "Automated maintenance reminders and escalation alerts",
        "Parts inventory linked to equipment and work orders",
      ],
    },
    {
      id: "service-execution",
      icon: ClipboardCheck,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/40",
      border: "border-green-200 dark:border-green-800",
      title: "Service Execution & Digital Documentation",
      subtitle: "Capture everything in the field — paperless and accurate.",
      desc: "Equip your technicians with digital checklists, photo capture, and e-signature tools so every job is documented completely and reports are generated automatically.",
      features: [
        "Custom digital checklists and intervention forms",
        "Photo and document capture directly from the mobile app",
        "Electronic signature collection from clients on-site",
        "Automatic PDF report generation after job completion",
        "Offline mode for field use without internet connection",
      ],
    },
    {
      id: "invoicing-analytics",
      icon: BarChart3,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-800",
      title: "Invoicing, Analytics, AI & Automation",
      subtitle: "Close the loop from job completion to payment — automatically.",
      desc: "Generate invoices directly from completed work orders, monitor your business KPIs in real time, and let AI-powered automation handle the repetitive tasks that slow your team down.",
      features: [
        "One-click invoice generation from validated work orders",
        "Real-time KPI dashboards and custom business reports",
        "Stripe payment integration for online invoice collection",
        "AI-powered workflow automation for approvals and alerts",
        "Multi-currency and multi-entity billing support",
      ],
    },
  ],
  fr: [
    {
      id: "quotes-sales",
      icon: FileText,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/40",
      border: "border-violet-200 dark:border-violet-800",
      title: "Devis Intelligents & Gestion Commerciale",
      subtitle: "Transformez vos opportunités en contrats signés plus rapidement.",
      desc: "Flowentra donne à votre équipe commerciale les outils pour créer des devis professionnels en quelques minutes, suivre les opportunités et automatiser les relances — depuis une seule plateforme.",
      features: [
        "Modèles de devis personnalisables avec calcul automatique des coûts",
        "Gestion du pipeline commercial et suivi des opportunités",
        "Workflow d'approbation client avec support de signature électronique",
        "Conversion automatique du devis en bon de travail",
        "Suivi des commissions et rapports de performance commerciale",
      ],
    },
    {
      id: "client-management",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-200 dark:border-blue-800",
      title: "Gestion Client & Communication",
      subtitle: "Construisez des relations clients plus solides avec une visibilité totale.",
      desc: "Centralisez toutes les informations clients, l'historique des interactions et les communications en un seul endroit. Gardez votre équipe alignée et vos clients informés à chaque étape.",
      features: [
        "CRM unifié avec profils clients complets et historique",
        "Portail client pour la visibilité en temps réel et l'accès aux documents",
        "Notifications automatisées par email, SMS et Telegram",
        "Journal des interactions et communications par client",
        "Segmentation, tags et catégories clients personnalisées",
      ],
    },
    {
      id: "field-operations",
      icon: CalendarDays,
      color: "text-cyan-500",
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      border: "border-cyan-200 dark:border-cyan-800",
      title: "Gestion des Interventions & Équipes Terrain",
      subtitle: "Coordonnez vos équipes terrain avec précision et rapidité.",
      desc: "Planifiez, dispatchez et suivez vos techniciens terrain en temps réel. Réduisez les temps de déplacement, évitez les conflits de planning et assurez que chaque intervention est attribuée à la bonne personne.",
      features: [
        "Calendrier de planification drag-and-drop avec vue multi-ressources",
        "Dispatch assisté par IA selon les compétences, la localisation et la disponibilité",
        "Suivi GPS en temps réel des techniciens terrain",
        "Application mobile pour les techniciens : détails de mission, navigation et mises à jour",
        "Suivi des heures supplémentaires et équilibrage de la charge de travail",
      ],
    },
    {
      id: "project-maintenance",
      icon: FolderKanban,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-800",
      title: "Gestion des Projets, Maintenance & Équipements",
      subtitle: "Gardez le contrôle sur chaque projet, actif et cycle de maintenance.",
      desc: "Gérez des projets multi-phases, des plannings de maintenance préventive et le cycle de vie des équipements depuis une seule vue. Ne manquez plus jamais une échéance ou une inspection.",
      features: [
        "Création de projets avec phases, jalons et suivi budgétaire",
        "Planification de la maintenance préventive et corrective",
        "Registre des équipements avec historique complet des interventions",
        "Rappels de maintenance automatisés et alertes d'escalade",
        "Inventaire des pièces lié aux équipements et bons de travail",
      ],
    },
    {
      id: "service-execution",
      icon: ClipboardCheck,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/40",
      border: "border-green-200 dark:border-green-800",
      title: "Exécution des Services & Documentation Digitale",
      subtitle: "Capturez tout sur le terrain — sans papier et avec précision.",
      desc: "Équipez vos techniciens de checklists digitales, de capture photo et d'outils de signature électronique pour que chaque intervention soit documentée et que les rapports soient générés automatiquement.",
      features: [
        "Checklists digitales personnalisées et formulaires d'intervention",
        "Capture photo et documents directement depuis l'application mobile",
        "Collecte de signature électronique des clients sur site",
        "Génération automatique de rapports PDF après intervention",
        "Mode hors ligne pour une utilisation terrain sans connexion internet",
      ],
    },
    {
      id: "invoicing-analytics",
      icon: BarChart3,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-800",
      title: "Facturation, Analyse, IA & Automatisation",
      subtitle: "Bouclage automatique de l'intervention à la facturation.",
      desc: "Générez des factures directement depuis les bons de travail validés, surveillez vos KPIs en temps réel et laissez l'automatisation IA gérer les tâches répétitives qui ralentissent votre équipe.",
      features: [
        "Génération de facture en un clic depuis les bons de travail validés",
        "Tableaux de bord KPI en temps réel et rapports métier personnalisés",
        "Intégration Stripe pour la collecte de paiement en ligne",
        "Automatisation des workflows IA pour les approbations et alertes",
        "Facturation multi-devises et multi-entités",
      ],
    },
  ],
};

const Modules = () => {
  const { lang } = useLanguage();
  const list = lang === "fr" ? modules.fr : modules.en;

  return (
    <PageLayout
      title={lang === "fr" ? "Modules Flowentra" : "Flowentra Modules"}
      subtitle={
        lang === "fr"
          ? "Une plateforme complète avec des modules pensés pour chaque étape de vos opérations."
          : "A complete platform with modules designed for every step of your operations."
      }
    >
      <section className="py-12 lg:py-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-5xl flex flex-col gap-10">
          {list.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.id}
                id={mod.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
              >
                <div className="grid md:grid-cols-[280px_1fr]">
                  {/* Left accent panel */}
                  <div className={`p-6 lg:p-8 flex flex-col gap-4 border-b md:border-b-0 md:border-r ${mod.border} bg-muted/20`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mod.bg}`}>
                      <Icon className={`w-6 h-6 ${mod.color}`} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground leading-snug mb-1">{mod.title}</h2>
                      <p className={`text-xs font-semibold ${mod.color}`}>{mod.subtitle}</p>
                    </div>
                  </div>

                  {/* Right content */}
                  <div className="p-6 lg:p-8">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{mod.desc}</p>
                    <ul className="space-y-2.5">
                      {mod.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${mod.color}`} />
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
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
          className="container mx-auto max-w-5xl mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center"
        >
          <h3 className="text-base font-bold text-foreground mb-2">
            {lang === "fr" ? "Prêt à découvrir Flowentra ?" : "Ready to explore Flowentra?"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {lang === "fr"
              ? "Réservez une démo ou commencez votre essai gratuit dès aujourd'hui."
              : "Book a demo or start your free trial today."}
          </p>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
          >
            {lang === "fr" ? "Demander une démo" : "Request a Demo"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default Modules;
