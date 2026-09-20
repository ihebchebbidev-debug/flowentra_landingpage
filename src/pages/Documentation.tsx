import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LayoutDashboard, ShoppingCart, Package, Wrench, FolderKanban, UserCheck,
  BarChart3, Plug, List, Headset, Settings,
} from "lucide-react";

interface Workplace {
  id: string;
  icon: React.ElementType;
  titleEn: string;
  titleFr: string;
  descEn: string;
  descFr: string;
  offersEn: string[];
  offersFr: string[];
}

const workplaces: Workplace[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    titleEn: "Dashboard",
    titleFr: "Tableau de bord",
    descEn: "Your centralized home after login. See the full health of your business in one place with KPIs, charts, and a drag-and-drop custom builder.",
    descFr: "Votre accueil central après connexion. Voyez la santé globale de votre entreprise en un seul endroit avec KPIs, graphiques et un constructeur personnalisé.",
    offersEn: [
      "Revenue, active sales, open offers, service orders",
      "Technician hours, stock levels, low/out-of-stock alerts",
      "Drag-and-drop widget builder with 14 widget types",
      "Built-in dashboards: Service, Sales, Field, HR, Finance, Executive",
      "Real-time KPI refresh and a first-run product tour",
    ],
    offersFr: [
      "Revenus, ventes actives, offres ouvertes, ordres de service",
      "Heures techniciens, niveaux de stock, alertes stock bas/rupture",
      "Constructeur de widgets par glisser-déposer avec 14 types de widgets",
      "Tableaux de bord intégrés : Service, Ventes, Terrain, RH, Finance, Exécutif",
      "Rafraîchissement des KPIs en temps réel et visite guidée",
    ],
  },
  {
    id: "sales",
    icon: ShoppingCart,
    titleEn: "Sales",
    titleFr: "Ventes",
    descEn: "Manage the full commercial pipeline from first quote to paid invoice. Built-in CRM links every offer, order, deal, and invoice to the right contact.",
    descFr: "Gérez le pipeline commercial complet du devis à la facture payée. Le CRM intégré relie chaque offre, commande, affaire et facture au bon contact.",
    offersEn: [
      "Offers / quotes with PDF generation",
      "Sales orders lifecycle with status tracking",
      "Customer invoices and three-way matching",
      "Deals pipeline and opportunity tracking",
      "Customer 360°, articles catalog, and reports",
    ],
    offersFr: [
      "Offres / devis avec génération de PDF",
      "Cycle de vie des commandes client avec suivi des statuts",
      "Factures clients et rapprochement à trois voies",
      "Pipeline d'affaires et suivi des opportunités",
      "360° client, catalogue d'articles et rapports",
    ],
  },
  {
    id: "purchases",
    icon: Package,
    titleEn: "Purchases",
    titleFr: "Achats",
    descEn: "Procure-to-Pay workflow for the Tunisian fiscal context. Track purchase orders, goods receipts, supplier invoices, and payments with full compliance.",
    descFr: "Flux Procure-to-Pay adapté au contexte fiscal tunisien. Suivez bons de commande, réceptions, factures fournisseurs et paiements avec conformité complète.",
    offersEn: [
      "Purchase orders with approval and fiscal totals",
      "Goods receipts with automatic stock-in movements",
      "Supplier invoices with Retenue à la Source (RS)",
      "Three-way matching and invoice aging",
      "Supplier performance, price evolution, and audit log",
    ],
    offersFr: [
      "Bons de commande avec approbation et totaux fiscaux",
      "Bons de réception avec mouvements de stock automatiques",
      "Factures fournisseurs avec Retenue à la Source (RS)",
      "Rapprochement à trois voies et vieillissement des factures",
      "Performance fournisseurs, évolution des prix et journal d'audit",
    ],
  },
  {
    id: "service",
    icon: Wrench,
    titleEn: "Service",
    titleFr: "Service",
    descEn: "End-to-end field service operations. Plan technicians, dispatch jobs, track service orders, materials, time, and expenses from the field to invoicing.",
    descFr: "Opérations terrain de bout en bout. Planifiez techniciens, dispatch jobs, suivez ordres de service, matériaux, temps et dépenses jusqu'à la facturation.",
    offersEn: [
      "Service orders with status lifecycle and detail tabs",
      "Dispatcher / planning board with Kanban and calendar views",
      "Technician schedules and dispatch assignments",
      "Time & expenses tracking and materials used",
      "Field installations, PDF reports, and map view",
    ],
    offersFr: [
      "Ordres de service avec cycle de vie et onglets détaillés",
      "Tableau de dispatch / planification avec vues Kanban et calendrier",
      "Planifications techniciens et assignations de dispatch",
      "Suivi temps & dépenses et matériaux utilisés",
      "Installations terrain, rapports PDF et vue carte",
    ],
  },
  {
    id: "projects",
    icon: FolderKanban,
    titleEn: "Projects",
    titleFr: "Projets",
    descEn: "Project and task management combined. Track project progress with Kanban boards, task lists, time tracking, and team collaboration.",
    descFr: "Gestion de projets et de tâches combinée. Suivez l'avancement des projets avec tableaux Kanban, listes de tâches, suivi du temps et collaboration équipe.",
    offersEn: [
      "Project list and table views with status tracking",
      "Kanban board with drag-and-drop tasks",
      "Task detail, comments, checklists, and time tracking",
      "Recurring tasks and dynamic forms",
      "Calendar and document integration",
    ],
    offersFr: [
      "Liste et tableau de projets avec suivi des statuts",
      "Tableau Kanban avec tâches par glisser-déposer",
      "Détail des tâches, commentaires, checklists et suivi du temps",
      "Tâches récurrentes et formulaires dynamiques",
      "Intégration calendrier et documents",
    ],
  },
  {
    id: "hr",
    icon: UserCheck,
    titleEn: "HR",
    titleFr: "RH",
    descEn: "Complete human resources suite tuned for Tunisian payroll law. Manage recruitment, attendance, leaves, payroll, CNSS, and performance reviews.",
    descFr: "Suite RH complète adaptée à la législation tunisienne. Gérez recrutement, présences, congés, paie, CNSS et évaluations de performance.",
    offersEn: [
      "Employee directory and 360° employee profiles",
      "Payroll runs with CNSS, CSS, IRPP, and PDF payslips",
      "Attendance matrix and leave request workflow",
      "Recruitment pipeline and performance management",
      "Departments, org chart, bonuses, and HR reports",
    ],
    offersFr: [
      "Annuaire des employés et profils 360°",
      "Exécution de paie avec CNSS, CSS, IRPP et bulletins PDF",
      "Matrice de présences et workflow de demande de congés",
      "Pipeline de recrutement et gestion des performances",
      "Départements, organigramme, primes et rapports RH",
    ],
  },
  {
    id: "reporting",
    icon: BarChart3,
    titleEn: "Reporting",
    titleFr: "Rapports",
    descEn: "Cross-domain analytics and KPIs for Sales, Service, Purchases, Finance, and HR. Build custom dashboards or export reports for external analysis.",
    descFr: "Analyses et KPIs transverses pour Ventes, Service, Achats, Finance et RH. Créez des tableaux de bord personnalisés ou exportez des rapports.",
    offersEn: [
      "Sales, Service, Purchases, Finance, and HR dashboards",
      "Charts, KPIs, and trend analysis",
      "Export reports to CSV/Excel",
      "Personalized 'My Dashboard' view",
      "Favorite widgets and dashboard sharing",
    ],
    offersFr: [
      "Tableaux de bord Ventes, Service, Achats, Finance et RH",
      "Graphiques, KPIs et analyses de tendances",
      "Export de rapports vers CSV/Excel",
      "Vue personnalisée 'Mon tableau de bord'",
      "Widgets favoris et partage de tableaux de bord",
    ],
  },
  {
    id: "integrations",
    icon: Plug,
    titleEn: "Integrations",
    titleFr: "Intégrations",
    descEn: "Connect Flowentra to the rest of your stack. Build visual workflows, expose inbound API endpoints, and manage background sync jobs.",
    descFr: "Connectez Flowentra au reste de votre stack. Créez des workflows visuels, exposez des endpoints API entrants et gérez les tâches de synchronisation.",
    offersEn: [
      "No-code / low-code visual workflow automation",
      "Triggers, actions, conditions, loops, and AI nodes",
      "External API endpoints with signed URLs and API keys",
      "Inbound webhook log and one-click conversions",
      "Background sync dashboard",
    ],
    offersFr: [
      "Automatisation visuelle no-code / low-code",
      "Déclencheurs, actions, conditions, boucles et nœuds IA",
      "Endpoints API externes avec URLs signées et clés API",
      "Journal webhooks entrants et conversions en un clic",
      "Tableau de bord de synchronisation en arrière-plan",
    ],
  },
  {
    id: "lookups",
    icon: List,
    titleEn: "Lookups",
    titleFr: "Références",
    descEn: "Centralized reference data for every dropdown in the app. Manage categories, statuses, types, locations, and skills from one place.",
    descFr: "Données de référence centralisées pour chaque liste déroulante de l'application. Gérez catégories, statuts, types, emplacements et compétences en un seul endroit.",
    offersEn: [
      "Task statuses, priorities, article categories",
      "Service categories, leave types, locations",
      "Offer sources, installation categories, work types",
      "Expense types, project types, document types",
      "Skills and default-value management",
    ],
    offersFr: [
      "Statuts de tâche, priorités, catégories d'articles",
      "Catégories de service, types de congés, emplacements",
      "Sources d'offres, catégories d'installation, types de travaux",
      "Types de dépenses, types de projet, types de documents",
      "Compétences et gestion des valeurs par défaut",
    ],
  },
  {
    id: "service-desk",
    icon: Headset,
    titleEn: "Service Desk",
    titleFr: "Service Desk",
    descEn: "Helpdesk and support ticketing for internal teams and external customers. Track issues, assign priorities, and monitor resolution performance.",
    descFr: "Helpdesk et tickets de support pour équipes internes et clients externes. Suivez les incidents, attribuez des priorités et surveillez la résolution.",
    offersEn: [
      "Ticket dashboard with status and urgency KPIs",
      "My tickets and new ticket creation",
      "Ticket detail with attachments and AI-assisted replies",
      "Admin queue and unassigned ticket tracking",
      "Creation trend and performance charts",
    ],
    offersFr: [
      "Tableau de bord des tickets avec KPIs statut et urgence",
      "Mes tickets et création de nouveau ticket",
      "Détail du ticket avec pièces jointes et réponses assistées par IA",
      "File d'attente admin et suivi des tickets non assignés",
      "Tendances de création et graphiques de performance",
    ],
  },
  {
    id: "administration",
    icon: Settings,
    titleEn: "Administration",
    titleFr: "Administration",
    descEn: "Govern the platform: users, roles, groups, plugin management, dynamic forms, system logs, database tools, and documentation.",
    descFr: "Gouvernez la plateforme : utilisateurs, rôles, groupes, gestion des plugins, formulaires dynamiques, logs système, outils base de données et documentation.",
    offersEn: [
      "Users, roles, and user groups with RBAC",
      "Plugin management to enable/disable modules",
      "Dynamic form builder with public forms",
      "System logs, database console, and schema views",
      "Sync dashboard, documentation, and system configuration",
    ],
    offersFr: [
      "Utilisateurs, rôles et groupes avec RBAC",
      "Gestion des plugins pour activer/désactiver les modules",
      "Constructeur de formulaires dynamiques avec formulaires publics",
      "Logs système, console base de données et vues de schéma",
      "Tableau de bord sync, documentation et configuration système",
    ],
  },
];

const ui = {
  en: {
    title: "Documentation",
    subtitle: "Explore Flowentra's 11 role-based workspaces and what each one offers.",
    workplacesTitle: "Workplaces",
    workplacesSubtitle: "Flowentra is organized around 11 role-based workspaces. Each workspace brings together the modules, dashboards, and actions you need for that part of your business.",
    whatItOffers: "What it offers",
  },
  fr: {
    title: "Documentation",
    subtitle: "Explorez les 11 espaces de travail de Flowentra basés sur les rôles et ce que chacun propose.",
    workplacesTitle: "Espaces de travail",
    workplacesSubtitle: "Flowentra est organisé autour de 11 espaces de travail basés sur les rôles. Chaque espace rassemble les modules, tableaux de bord et actions nécessaires pour cette partie de votre entreprise.",
    whatItOffers: "Ce qu'il offre",
  },
};


const Documentation = () => {
  const { lang } = useLanguage();
  const t = ui[lang as keyof typeof ui] || ui.en;
  const isFr = lang === "fr";

  return (
    <PageLayout title={t.title} subtitle={t.subtitle}>
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">

          {/* Workplaces overview */}
          <div>
            <div className="max-w-2xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">{t.workplacesTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{t.workplacesSubtitle}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {workplaces.map((w, i) => {
                const Icon = w.icon;
                const title = isFr ? w.titleFr : w.titleEn;
                const desc = isFr ? w.descFr : w.descEn;
                const offers = isFr ? w.offersFr : w.offersEn;
                return (
                  <motion.div
                    id={`workplace-${w.id}`}
                    key={w.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="rounded-2xl border border-border bg-card p-5 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-extrabold text-base">{title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{desc}</p>
                    <div>
                      <p className="text-[10px] font-extrabold tracking-widest uppercase text-primary mb-2">{t.whatItOffers}</p>
                      <ul className="space-y-1.5">
                        {offers.map((item, ii) => (
                          <li key={ii} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

    </PageLayout>
  );
};

export default Documentation;
