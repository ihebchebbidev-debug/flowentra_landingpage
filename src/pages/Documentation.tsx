import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Shield, LayoutDashboard, Users, Package, Warehouse, ShoppingCart,
  Wrench, GitBranch, CalendarDays, UserCheck, FileText, Plug, List,
  Settings, ChevronDown, Search, X, Camera, FolderKanban, Headset,
  BarChart3, Briefcase,
} from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { docScreenshots } from "@/assets/docs/docScreenshots";
import { docScreenshotsFr } from "@/assets/docs/docScreenshotsFr";

interface FeatureSection {
  headingEn: string;
  headingFr: string;
  items: string[];
  itemsFr?: string[];
}

interface Module {
  id: number;
  moduleId: string;
  category: string;
  icon: React.ReactNode;
  titleEn: string;
  titleFr: string;
  descEn: string;
  descFr: string;
  features: FeatureSection[];
}

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


const modules: Module[] = [
  {
    id: 1,

    moduleId: 'module-login',
    category: "Core",
    icon: <Shield className="w-5 h-5" />,
    titleEn: "Login & Authentication",
    titleFr: "Connexion & Authentification",
    descEn: "Secure tenant-aware authentication with multi-company tenancy, JWT sessions, role-based access control on every route, and password reset via email.",
    descFr: "Authentification sécurisée multi-entreprises avec sessions JWT, contrôle d'accès basé sur les rôles (RBAC) sur chaque route et réinitialisation de mot de passe par email.",
    features: [
      {
        headingEn: "Authentication", headingFr: "Authentification",
        items: [
          "Email + password authentication",
          "Multi-tenant scoped sessions",
          "JWT-based auth with refresh tokens",
          "Role-based access control (RBAC) on every route",
          "Password reset via email link",
          "Session management active sessions list & invalidation",
        ],
        itemsFr: [
          "Authentification email + mot de passe",
          "Sessions multi-locataires",
          "Authentification JWT avec jetons de rafraîchissement",
          "Contrôle d'accès basé sur les rôles (RBAC) sur chaque route",
          "Réinitialisation du mot de passe par lien email",
          "Gestion des sessions liste des sessions actives et invalidation",
        ],
      },
    ],
  },
  {
    id: 2,

    moduleId: 'module-dashboard',
    category: "Core",
    icon: <LayoutDashboard className="w-5 h-5" />,
    titleEn: "Dashboard & Builder",
    titleFr: "Tableau de bord & Constructeur",
    descEn: "Configurable home dashboards built from drag-and-drop widgets (KPIs, charts, lists). Switch between built-in and custom dashboards per role, with real-time KPI refresh.",
    descFr: "Tableaux de bord personnalisables construits par glisser-déposer de widgets (KPIs, graphiques, listes). Basculez entre tableaux de bord intégrés et personnalisés par rôle.",
    features: [
      {
        headingEn: "Builder & Widgets", headingFr: "Constructeur & Widgets",
        items: [
          "Custom dashboard builder (drag & drop widgets)",
          "14 widget types: KPI, Bar, Line, Area, Pie, Donut, Funnel, Gauge, Heatmap, Map, Radar, Sparkline, Table, Background",
          "Per-user / per-role default dashboard",
          "Public sharing of dashboards via token URL",
          "Global period selector with comparison to previous period",
          "Auto-refresh and grid settings (spacing, row height, card style, animation)",
        ],
        itemsFr: [
          "Constructeur de tableau de bord personnalisé (glisser-déposer de widgets)",
          "14 types de widgets : KPI, Barres, Lignes, Aires, Camembert, Donut, Entonnoir, Jauge, Carte thermique, Carte, Radar, Sparkline, Tableau, Arrière-plan",
          "Tableau de bord par défaut par utilisateur / par rôle",
          "Partage public des tableaux de bord via URL avec jeton",
          "Sélecteur de période global avec comparaison à la période précédente",
          "Rafraîchissement automatique et paramètres de grille (espacement, hauteur, style, animation)",
        ],
      },
      {
        headingEn: "Built-in Dashboards", headingFr: "Tableaux de bord intégrés",
        items: [
          "Built-in dashboards Service, Sales, Field, HR, Finance, Executive",
          "Switcher top-bar dropdown to flip between dashboards",
          "Realtime KPI refresh via SignalR",
          "28-step first-time user product tour",
        ],
        itemsFr: [
          "Tableaux de bord intégrés Service, Ventes, Terrain, RH, Finance, Exécutif",
          "Sélecteur menu déroulant en haut pour basculer entre les tableaux de bord",
          "Actualisation des KPIs en temps réel via SignalR",
          "Visite guidée du produit en 28 étapes pour les nouveaux utilisateurs",
        ],
      },
    ],
  },
  {
    id: 3,

    moduleId: 'module-contacts',
    category: "CRM",
    icon: <Users className="w-5 h-5" />,
    titleEn: "Contacts (CRM)",
    titleFr: "Contacts (CRM)",
    descEn: "Unified directory of Persons, Companies and Suppliers with Tunisian fiscal IDs, address geolocation, and a 360° history across Offers, Sales, Service Orders, Purchases and Notes.",
    descFr: "Répertoire unifié de Personnes, Entreprises et Fournisseurs avec identifiants fiscaux tunisiens, géolocalisation et historique 360° sur Offres, Ventes, Ordres de service, Achats et Notes.",
    features: [
      {
        headingEn: "Contact Management", headingFr: "Gestion des contacts",
        items: [
          "Three contact types Person, Company, Supplier",
          "Tunisian fiscal fields CIN and Matricule Fiscale",
          "Address with interactive geolocation map",
          "List with KPIs, full-text Search, advanced Filters, Map view",
          "360° tabs Installations, Offers, Sales, Service Orders, Purchases, Notes",
          "Dedicated Suppliers area (/dashboard/suppliers)",
        ],
        itemsFr: [
          "Trois types de contacts Personne, Entreprise, Fournisseur",
          "Champs fiscaux tunisiens CIN et Matricule Fiscale",
          "Adresse avec carte de géolocalisation interactive",
          "Liste avec KPIs, recherche plein texte, filtres avancés, vue carte",
          "Onglets 360° Installations, Offres, Ventes, Ordres de service, Achats, Notes",
          "Espace Fournisseurs dédié (/dashboard/suppliers)",
        ],
      },
      {
        headingEn: "Import & Filters", headingFr: "Import & Filtres",
        items: [
          "Bulk Import Dynamic (any Excel headers) or Structured Import",
          "Dynamic Import with column mapping and duplicate strategy",
          "Advanced Filters: Status, Type, Tags, Favorites, Has email/phone/geolocation",
          "CSV export from list view",
          "Tags manager with color picker (10 preset + custom hex)",
        ],
        itemsFr: [
          "Import en masse Dynamique (en-têtes Excel quelconques) ou Import structuré",
          "Import dynamique avec mappage de colonnes et stratégie de doublons",
          "Filtres avancés : Statut, Type, Tags, Favoris, Possède email/téléphone/géolocalisation",
          "Export CSV depuis la vue liste",
          "Gestionnaire de tags avec sélecteur de couleur (10 prédéfinis + hex personnalisé)",
        ],
      },
    ],
  },
  {
    id: 4,

    moduleId: 'module-articles',
    category: "Inventory",
    icon: <Package className="w-5 h-5" />,
    titleEn: "Articles & Catalog",
    titleFr: "Articles & Catalogue",
    descEn: "Product & service catalog single source of truth for all line items in Offers, Sales, Purchases, Stock and Service Orders. Each article has pricing, taxation, supplier links and stock thresholds.",
    descFr: "Catalogue produits & services source unique de vérité pour toutes les lignes dans Offres, Ventes, Achats, Stock et Ordres de service.",
    features: [
      {
        headingEn: "Article Configuration", headingFr: "Configuration article",
        items: [
          "Type Product (stocked) / Service (non-stocked)",
          "Pricing Selling price HT, Cost price, Margin %, Discount %, VAT %",
          "Stock fields Quantity on hand, Min/Max stock, Reorder point",
          "Suppliers primary + alternates, supplier reference, last purchase price",
          "Audit fields created by, updated by, soft delete",
        ],
        itemsFr: [
          "Type Produit (en stock) / Service (hors stock)",
          "Tarification Prix de vente HT, Prix de revient, Marge %, Remise %, TVA %",
          "Champs stock Quantité disponible, Stock min/max, Point de réapprovisionnement",
          "Fournisseurs principal + alternatifs, référence fournisseur, dernier prix d'achat",
          "Champs d'audit créé par, modifié par, suppression logique",
        ],
      },
      {
        headingEn: "Inventory Transactions", headingFr: "Transactions d'inventaire",
        items: [
          "Transaction types: Stock In, Stock Out, Transfer, Adjustment, Damaged, Lost, Return",
          "List page KPIs, search, filters (Category, Type, Status), Table/Grid view",
          "Bulk Import Dynamic or Structured (.xlsx)",
          "Stock Management gauge cards per material",
        ],
        itemsFr: [
          "Types de transactions : Entrée stock, Sortie stock, Transfert, Ajustement, Endommagé, Perdu, Retour",
          "Page liste KPIs, recherche, filtres (Catégorie, Type, Statut), vue Tableau/Grille",
          "Import en masse Dynamique ou Structuré (.xlsx)",
          "Cartes jauges de gestion des stocks par matériau",
        ],
      },
    ],
  },
  {
    id: 5,

    moduleId: 'module-stock-management',
    category: "Inventory",
    icon: <Warehouse className="w-5 h-5" />,
    titleEn: "Stock Management",
    titleFr: "Gestion des stocks",
    descEn: "Multi-warehouse stock control. Tracks every movement (in/out/adjust/transfer), supports per-warehouse quantities, low-stock alerts and replenishment proposals.",
    descFr: "Contrôle des stocks multi-entrepôts. Suivi de chaque mouvement, quantités par entrepôt, alertes de stock bas et propositions de réapprovisionnement.",
    features: [
      {
        headingEn: "Warehouses & Movements", headingFr: "Entrepôts & Mouvements",
        items: [
          "Multiple physical or logical warehouse locations per company",
          "Stock transactions log date, type, source document, quantity, before/after balance",
          "Manual adjustment single-line or bulk with reason picklist",
          "Inter-warehouse transfer two-step confirm (sent / received)",
          "Reservations soft-reserve stock for Offer/Sale/Service Order",
        ],
        itemsFr: [
          "Plusieurs emplacements d'entrepôts physiques ou logiques par entreprise",
          "Journal des transactions date, type, document source, quantité, solde avant/après",
          "Ajustement manuel ligne unique ou en masse avec liste de motifs",
          "Transfert inter-entrepôts confirmation en deux étapes (envoyé / reçu)",
          "Réservations réservation provisoire du stock pour Offre/Vente/Ordre de service",
        ],
      },
      {
        headingEn: "Alerts & Replenishment", headingFr: "Alertes & Réapprovisionnement",
        items: [
          "Low-stock alerts daily job compares quantity vs min stock",
          "Replenishment proposal auto-generates draft Purchase Orders",
          "Status filter: Critical / Low Stock / Healthy",
          "Full audit log with previous → new stock, reason, reference, performer, timestamp",
        ],
        itemsFr: [
          "Alertes de stock bas tâche quotidienne comparant quantité vs stock minimum",
          "Proposition de réapprovisionnement génère automatiquement des bons de commande brouillons",
          "Filtre de statut : Critique / Stock bas / Normal",
          "Journal d'audit complet : stock précédent → nouveau, motif, référence, acteur, horodatage",
        ],
      },
    ],
  },
  {
    id: 6,

    moduleId: 'module-purchases',
    category: "Procurement",
    icon: <ShoppingCart className="w-5 h-5" />,
    titleEn: "Purchases (Procure-to-Pay)",
    titleFr: "Achats (Procure-to-Pay)",
    descEn: "End-to-end P2P workflow for the Tunisian fiscal context: Purchase Order → Goods Receipt → Supplier Invoice → Payment, with three-way matching and retenue à la source (RS).",
    descFr: "Flux P2P complet adapté au contexte fiscal tunisien : Bon de commande → Réception → Facture fournisseur → Paiement, avec rapprochement à trois voies et retenue à la source (RS).",
    features: [
      {
        headingEn: "Purchase Orders", headingFr: "Bons de commande",
        items: [
          "Multi-line POs with payment terms, fiscal stamp, auto totals",
          "Status flow: Draft → Pending → Approved → Sent → Partially Received → Received → Closed → Cancelled",
          "Goods Receipts full or partial reception, automatic stock movement creation",
          "Supplier Invoices 3-way match, retenue à la source (RS) auto-computed",
          "Payment recording with date, method, reference",
        ],
        itemsFr: [
          "Bons de commande multi-lignes avec conditions de paiement, timbre fiscal, totaux automatiques",
          "Flux de statut : Brouillon → En attente → Approuvé → Envoyé → Partiellement reçu → Reçu → Clôturé → Annulé",
          "Bons de réception réception totale ou partielle, création automatique de mouvements de stock",
          "Factures fournisseurs rapprochement à 3 voies, retenue à la source (RS) calculée automatiquement",
          "Enregistrement des paiements avec date, mode et référence",
        ],
      },
      {
        headingEn: "Compliance & Reports", headingFr: "Conformité & Rapports",
        items: [
          "Fiscal Compliance dashboard RS YTD, Facture en Ligne counts, TEJ sync status",
          "Supplier Performance: on-time delivery %, avg lead time, total spend",
          "Price Evolution: per article + supplier price history",
          "Invoice Aging: outstanding amounts by buckets (Current / 1-30 / 31-60 / 61-90 / 90+ days)",
          "Purchases Audit Log with full diff (before/after JSON)",
        ],
        itemsFr: [
          "Tableau de bord conformité fiscale RS YTD, compteurs Facture en Ligne, statut synchro TEJ",
          "Performance fournisseurs : % livraison à temps, délai moyen, dépenses totales",
          "Évolution des prix : par article + historique des prix fournisseurs",
          "Vieillissement des factures : montants en attente par tranches (Courant / 1-30 / 31-60 / 61-90 / 90+ jours)",
          "Journal d'audit des achats avec diff complet (JSON avant/après)",
        ],
      },
    ],
  },
  {
    id: 7,

    moduleId: 'module-service-orders',
    category: "Operations",
    icon: <Wrench className="w-5 h-5" />,
    titleEn: "Service Orders",
    titleFr: "Ordres de service",
    descEn: "End-to-end field service order lifecycle Jobs, Dispatches, Time & Expenses, Materials, Attachments, Checklists and Activity from creation through invoicing, with PDF reports.",
    descFr: "Cycle de vie complet des ordres de service terrain Jobs, Dispatches, Temps & Dépenses, Matériaux, Pièces jointes, Checklists et Activité de la création jusqu'à la facturation.",
    features: [
      {
        headingEn: "Lifecycle & Views", headingFr: "Cycle de vie & Vues",
        items: [
          "Status flow: Pending → Ready for Planning → Scheduled → In Progress → Technically Completed → Ready for Invoice → Invoiced → Closed",
          "Three view modes Table, Cards, Map",
          "Detail tabs Overview, Jobs, Dispatches, Time & Expenses, Materials, Attachments, Checklists, Activity",
          "Auto-creation from Sales (when sale contains service items)",
          "Geolocation-based Map view with 'Open in Maps' navigation",
        ],
        itemsFr: [
          "Flux de statut : En attente → Prêt pour planification → Planifié → En cours → Techniquement terminé → Prêt pour facturation → Facturé → Clôturé",
          "Trois modes de vue Tableau, Cartes, Carte",
          "Onglets détail Vue d'ensemble, Jobs, Dispatches, Temps & Dépenses, Matériaux, Pièces jointes, Checklists, Activité",
          "Création automatique depuis les Ventes (quand la vente contient des services)",
          "Vue Carte basée sur la géolocalisation avec navigation 'Ouvrir dans Maps'",
        ],
      },
      {
        headingEn: "Field Operations", headingFr: "Opérations terrain",
        items: [
          "Jobs grouped by Installation with title, code, Status, Work Type",
          "Dispatches: dispatch #, status, priority, assigned technician, scheduled date/time",
          "Time & Expenses log linked to source dispatch",
          "Materials Used deducts from stock catalog",
          "PDF report generation and email sending",
        ],
        itemsFr: [
          "Jobs regroupés par Installation avec titre, code, Statut, Type de travail",
          "Dispatches : numéro, statut, priorité, technicien assigné, date/heure planifiée",
          "Journal Temps & Dépenses lié au dispatch source",
          "Matériaux utilisés déduits du catalogue de stock",
          "Génération de rapports PDF et envoi par email",
        ],
      },
    ],
  },
  {
    id: 8,

    moduleId: 'module-hr',
    category: "HR",
    icon: <UserCheck className="w-5 h-5" />,
    titleEn: "Human Resources (HR)",
    titleFr: "Ressources Humaines (RH)",
    descEn: "Complete HR suite tuned for Tunisian payroll law (CNSS, CSS, IRPP). Manages full employee lifecycle Recruitment → Hire → Attendance → Leaves → Payroll → CNSS declaration → Performance review.",
    descFr: "Suite RH complète adaptée à la législation tunisienne (CNSS, CSS, IRPP). Gère le cycle complet Recrutement → Embauche → Présences → Congés → Paie → Déclaration CNSS → Évaluation.",
    features: [
      {
        headingEn: "Payroll & Attendance", headingFr: "Paie & Présences",
        items: [
          "Payroll runs CNSS, CSS, IRPP progressive brackets, PDF payslips",
          "Monthly attendance List & Matrix views with worked hours, overtime, late count",
          "Leaves request workflow, calendar, balances, manager approvals",
          "Bonuses & Deductions typed entries, period-bound, feed payroll",
          "CNSS rates & monthly declaration CSV export for CNSS portal",
          "Payroll workflow: Draft → Confirmed → Paid",
        ],
        itemsFr: [
          "Exécution de la paie CNSS, CSS, barèmes progressifs IRPP, bulletins de salaire PDF",
          "Présences mensuelles vues Liste & Matrice avec heures travaillées, heures sup, retards",
          "Congés workflow de demande, calendrier, soldes, approbations managers",
          "Primes & Déductions saisies typées, liées à une période, alimentent la paie",
          "Taux CNSS & déclaration mensuelle export CSV pour portail CNSS",
          "Workflow paie : Brouillon → Confirmé → Payé",
        ],
      },
      {
        headingEn: "HR Administration", headingFr: "Administration RH",
        items: [
          "Employee directory with payroll-readiness segmentation",
          "Departments & Org Chart hierarchical tree with manager avatars",
          "Performance Management Goals, Review Cycles, Reviews",
          "Recruitment pipeline Kanban: Applied → Screening → Interview → Offer → Hired",
          "HR reports with CSV + Excel export",
        ],
        itemsFr: [
          "Annuaire des employés avec segmentation de préparation à la paie",
          "Départements & Organigramme arborescence hiérarchique avec avatars managers",
          "Gestion des performances Objectifs, Cycles d'évaluation, Évaluations",
          "Pipeline de recrutement Kanban : Candidature → Présélection → Entretien → Offre → Embauché",
          "Rapports RH avec export CSV + Excel",
        ],
      },
    ],
  },
  {
    id: 9,

    moduleId: 'module-dynamic-forms',
    category: "Productivity",
    icon: <FileText className="w-5 h-5" />,
    titleEn: "Dynamic Forms",
    titleFr: "Formulaires dynamiques",
    descEn: "Visual drag-and-drop form builder. Create bilingual (EN/FR) forms with 15+ field types, release them for internal or public use, collect submissions, export responses and generate branded PDFs.",
    descFr: "Constructeur de formulaires visuel par glisser-déposer. Créez des formulaires bilingues avec 15+ types de champs, publiez-les, collectez les soumissions et générez des PDFs.",
    features: [
      {
        headingEn: "Field Types & Builder", headingFr: "Types de champs & Constructeur",
        items: [
          "15+ field types: Text, Textarea, Number, Email, Phone, Checkbox, Radio, Dropdown, Date, Signature, Rating, Content Block, Page Break",
          "Bilingual (EN/FR) with language switcher on the form",
          "Drag-and-drop builder with live preview",
          "Draft / Released / Archived status workflow",
          "Public link for unauthenticated submission",
        ],
        itemsFr: [
          "15+ types de champs : Texte, Zone de texte, Nombre, Email, Téléphone, Case à cocher, Radio, Liste déroulante, Date, Signature, Note, Bloc de contenu, Saut de page",
          "Bilingue (EN/FR) avec sélecteur de langue sur le formulaire",
          "Constructeur glisser-déposer avec aperçu en direct",
          "Workflow de statut : Brouillon / Publié / Archivé",
          "Lien public pour soumission sans authentification",
        ],
      },
      {
        headingEn: "Responses & Integration", headingFr: "Réponses & Intégration",
        items: [
          "Response inbox CSV/Excel export, PDF per response",
          "Convert responses to CRM records (Contact, Offer, Sale) in one click",
          "Attach as checklist to Service Orders, Dispatches, Offers",
          "Export responses as PDF with company branding",
        ],
        itemsFr: [
          "Boîte de réception des réponses export CSV/Excel, PDF par réponse",
          "Convertir les réponses en enregistrements CRM (Contact, Offre, Vente) en un clic",
          "Joindre comme checklist aux Ordres de service, Dispatches, Offres",
          "Exporter les réponses en PDF avec l'identité visuelle de l'entreprise",
        ],
      },
    ],
  },
  {
    id: 10,

    moduleId: 'module-workflow',
    category: "Operations",
    icon: <GitBranch className="w-5 h-5" />,
    titleEn: "Workflow Automation",
    titleFr: "Automatisation des workflows",
    descEn: "Visual no-code/low-code automation engine. Design processes with Triggers, Actions, Conditions, Loops, Switches and Parallel branches. Includes AI workflow builder, live debugger, and version history.",
    descFr: "Moteur d'automatisation visuel no-code/low-code. Concevez des processus avec Déclencheurs, Actions, Conditions, Boucles et branches Parallèles. Inclut constructeur IA, débogueur en direct.",
    features: [
      {
        headingEn: "Builder & Nodes", headingFr: "Constructeur & Nœuds",
        items: [
          "React-Flow canvas with pan/zoom, mini-map, snap-to-grid, multi-select, undo/redo",
          "Trigger types Webhook, Scheduled (CRON), Status-change, Entity-created",
          "Action nodes Create Sale/SO/Dispatch, Update Status, Send Email, HTTP Request, Notify",
          "Condition nodes IF/Else, Switch, Loop, Parallel, Try/Catch",
          "AI nodes AI Email, AI Analyzer, AI Agent, Custom LLM",
          "Integration nodes Dynamic Form, Data Transfer, HTTP Request, JavaScript Code",
        ],
        itemsFr: [
          "Canevas React-Flow avec panoramique/zoom, mini-carte, magnétisme grille, sélection multiple, annuler/rétablir",
          "Types de déclencheurs Webhook, Planifié (CRON), Changement de statut, Entité créée",
          "Nœuds d'action Créer Vente/OS/Dispatch, Mettre à jour statut, Envoyer email, Requête HTTP, Notifier",
          "Nœuds de condition SI/Sinon, Switch, Boucle, Parallèle, Essai/Erreur",
          "Nœuds IA Email IA, Analyseur IA, Agent IA, LLM personnalisé",
          "Nœuds d'intégration Formulaire dynamique, Transfert de données, Requête HTTP, Code JavaScript",
        ],
      },
      {
        headingEn: "AI & Versioning", headingFr: "IA & Gestion des versions",
        items: [
          "Build with AI natural-language to graph generation",
          "Workflow versioning every Save bumps version; restore or fork prior versions",
          "Live execution debugger color-coded nodes with input/output JSON per step",
          "Execution History paginated list of every run with status and timing",
          "Dispatch Board Kanban by status with Calendar / Map views",
          "Workflow Calendar drag-and-drop rescheduling with conflict highlighting",
        ],
        itemsFr: [
          "Construire avec IA génération de graphe par langage naturel",
          "Gestion des versions chaque sauvegarde incrémente la version ; restaurer ou dériver les versions précédentes",
          "Débogueur d'exécution en direct nœuds colorés avec JSON entrée/sortie par étape",
          "Historique d'exécution liste paginée de chaque exécution avec statut et durée",
          "Tableau de dispatch Kanban par statut avec vues Calendrier / Carte",
          "Calendrier de workflow replanification par glisser-déposer avec mise en évidence des conflits",
        ],
      },
    ],
  },
  {
    id: 11,

    moduleId: 'module-external',
    category: "Integrations",
    icon: <Plug className="w-5 h-5" />,
    titleEn: "External Endpoints",
    titleFr: "Endpoints externes",
    descEn: "Receive and process inbound webhooks and form submissions from external sources. Each endpoint gets a unique signed URL and API key with a full inbound log.",
    descFr: "Recevez et traitez les webhooks entrants depuis des sources externes. Chaque endpoint obtient une URL signée unique et une clé API avec journal complet.",
    features: [
      {
        headingEn: "Endpoint Configuration", headingFr: "Configuration endpoint",
        items: [
          "Unique auto-generated slug URL per endpoint",
          "API key with reveal / copy / rotate actions",
          "Quick-start templates: Landing page, Generic contact form, B2B Lead capture, Webhook passthrough",
          "Allowed HTTP methods per endpoint (GET/POST/PUT/DELETE)",
          "Optional JSON Schema validation",
        ],
        itemsFr: [
          "URL slug unique auto-générée par endpoint",
          "Clé API avec actions afficher / copier / renouveler",
          "Modèles de démarrage rapide : Page d'accueil, Formulaire de contact, Capture de leads B2B, Passthrough webhook",
          "Méthodes HTTP autorisées par endpoint (GET/POST/PUT/DELETE)",
          "Validation JSON Schema optionnelle",
        ],
      },
      {
        headingEn: "Inbound Log & Actions", headingFr: "Journal entrant & Actions",
        items: [
          "Inbound log: Date/time, Method, Source IP, Status code, Payload preview",
          "Convert inbound payload to Offer / Sale / Contact in one click",
          "Bulk: Mark all as read, Clear all logs, Export CSV",
          "QR code for mobile testing",
        ],
        itemsFr: [
          "Journal entrant : Date/heure, Méthode, IP source, Code statut, Aperçu payload",
          "Convertir le payload entrant en Offre / Vente / Contact en un clic",
          "En masse : Tout marquer comme lu, Effacer tous les journaux, Export CSV",
          "QR code pour tests mobiles",
        ],
      },
    ],
  },
  {
    id: 12,

    moduleId: 'module-lookups',
    category: "System",
    icon: <List className="w-5 h-5" />,
    titleEn: "Lookups",
    titleFr: "Listes de référence",
    descEn: "Centralized configuration for all dropdown lists used across modules Task Status Types, Priorities, Article Categories, Leave Types, Locations, Work Types and more.",
    descFr: "Configuration centralisée de toutes les listes déroulantes utilisées dans les modules Types de statut, Priorités, Catégories d'articles, Types de congés, Emplacements, Types de travaux.",
    features: [
      {
        headingEn: "Managed Categories", headingFr: "Catégories gérées",
        items: [
          "Task Status Types, Priorities, Article Categories, Article Groups",
          "Service Categories, Leave Types (Paid/Unpaid flag)",
          "Locations (physical locations / branches / warehouses)",
          "Offer Sources, Installation Categories, Work Types",
          "Expense Types, Project Types, Form Categories, Document Types",
        ],
        itemsFr: [
          "Types de statut de tâche, Priorités, Catégories d'articles, Groupes d'articles",
          "Catégories de service, Types de congés (indicateur Payé/Non payé)",
          "Emplacements (sites physiques / agences / entrepôts)",
          "Sources d'offres, Catégories d'installation, Types de travaux",
          "Types de dépenses, Types de projet, Catégories de formulaires, Types de documents",
        ],
      },
      {
        headingEn: "Item Management", headingFr: "Gestion des éléments",
        items: [
          "Two-pane layout left category browser, right item list",
          "Add / Edit / Delete items with name, active toggle, sort order",
          "Default value per category (star toggle)",
          "Active/Inactive status inactive values preserved on historical records",
          "Extra fields per category (Paid for Leave Types, Completed for Task Statuses)",
        ],
        itemsFr: [
          "Mise en page deux volets navigation des catégories à gauche, liste des éléments à droite",
          "Ajouter / Modifier / Supprimer des éléments avec nom, activation, ordre de tri",
          "Valeur par défaut par catégorie (bascule étoile)",
          "Statut Actif/Inactif valeurs inactives conservées sur les enregistrements historiques",
          "Champs supplémentaires par catégorie (Payé pour Types de congés, Terminé pour Statuts de tâche)",
        ],
      },
    ],
  },
  {
    id: 13,

    moduleId: 'module-scheduling',
    category: "Operations",
    icon: <CalendarDays className="w-5 h-5" />,
    titleEn: "Dispatcher & Scheduler",
    titleFr: "Dispatcheur & Planificateur",
    descEn: "Interactive drag-and-drop planner for technician dispatch scheduling. Swimlane view with technician rows and time columns, supporting 1d to 30d time horizons with conflict detection.",
    descFr: "Planificateur interactif par glisser-déposer pour la planification des interventions techniciens. Vue swimlane avec lignes techniciens et colonnes horaires, horizons 1j à 30j.",
    features: [
      {
        headingEn: "Planner Views", headingFr: "Vues du planificateur",
        items: [
          "Swimlane timeline technician rows × hour columns",
          "Time horizons 1d / 3d / 5d / 7d / 14d / 30d",
          "30-day monthly calendar with technician avatars per day",
          "Real-time orange line marking the current time",
          "Weekends rendered with soft overlay and 'Day Off' chip per technician",
        ],
        itemsFr: [
          "Chronologie swimlane lignes techniciens × colonnes heures",
          "Horizons temporels 1j / 3j / 5j / 7j / 14j / 30j",
          "Calendrier mensuel 30 jours avec avatars techniciens par jour",
          "Ligne en temps réel marquant l'heure actuelle",
          "Week-ends affichés avec superposition douce et puce 'Jour off' par technicien",
        ],
      },
      {
        headingEn: "Scheduling Features", headingFr: "Fonctionnalités de planification",
        items: [
          "Drag-drop to reschedule or reassign jobs",
          "Resize job pills to extend or shorten duration",
          "Unassigned Service Orders right rail with search",
          "Conflict detection and non-working time hatching",
          "Rule-based auto-planner (Manage Planning)",
        ],
        itemsFr: [
          "Glisser-déposer pour replanifier ou réassigner les jobs",
          "Redimensionner les pastilles de job pour étendre ou réduire la durée",
          "Panneau latéral droit des Ordres de service non assignés avec recherche",
          "Détection des conflits et hachures pour temps non travaillé",
          "Planificateur automatique basé sur des règles (Gestion de la planification)",
        ],
      },
    ],
  },
  {
    id: 14,

    moduleId: 'module-settings',
    category: "System",
    icon: <Settings className="w-5 h-5" />,
    titleEn: "Settings",
    titleFr: "Paramètres",
    descEn: "Application settings covering Personal (Profile, Company, Security, Preferences, Offline Data) and Administration (Companies, Users, Roles, Integrations, Subscription).",
    descFr: "Paramètres couvrant Personnel (Profil, Entreprise, Sécurité, Préférences, Données hors-ligne) et Administration (Entreprises, Utilisateurs, Rôles, Intégrations, Abonnement).",
    features: [
      {
        headingEn: "Personal Settings", headingFr: "Paramètres personnels",
        items: [
          "Profile avatar, display name, contact details, language, timezone",
          "Company branding, logo, legal name, Tax ID, default currency",
          "Security password change, active session management",
          "Preferences theme (Light/Dark/System), accent color, layout density",
          "Offline Data per-module cache toggles, last refresh timestamp",
        ],
        itemsFr: [
          "Profil avatar, nom d'affichage, coordonnées, langue, fuseau horaire",
          "Entreprise identité visuelle, logo, raison sociale, numéro fiscal, devise par défaut",
          "Sécurité changement de mot de passe, gestion des sessions actives",
          "Préférences thème (Clair/Sombre/Système), couleur d'accentuation, densité de mise en page",
          "Données hors-ligne bascules de cache par module, horodatage du dernier rafraîchissement",
        ],
      },
      {
        headingEn: "Administration", headingFr: "Administration",
        items: [
          "Companies multi-tenant company manager, pin default company",
          "Users invite, edit, deactivate; role assignment",
          "Roles RBAC with fine-grained permission matrix per module",
          "Integrations connected apps and API keys",
          "Subscription plan details, billing, usage",
          "Sync History audit of data sync operations",
        ],
        itemsFr: [
          "Entreprises gestionnaire multi-locataires, épingler l'entreprise par défaut",
          "Utilisateurs inviter, modifier, désactiver ; attribution de rôles",
          "Rôles RBAC avec matrice de permissions granulaire par module",
          "Intégrations applications connectées et clés API",
          "Abonnement détails du plan, facturation, utilisation",
          "Historique de synchronisation audit des opérations de synchronisation des données",
        ],
      },
    ],
  },
];

const categoryColors: Record<string, string> = {
  Core: "bg-blue-100 text-blue-700",
  CRM: "bg-violet-100 text-violet-700",
  Inventory: "bg-amber-100 text-amber-700",
  Procurement: "bg-orange-100 text-orange-700",
  Operations: "bg-green-100 text-green-700",
  HR: "bg-pink-100 text-pink-700",
  Productivity: "bg-cyan-100 text-cyan-700",
  Integrations: "bg-indigo-100 text-indigo-700",
  System: "bg-slate-100 text-slate-600",
};

const categoryBg: Record<string, string> = {
  Core: "from-blue-500",
  CRM: "from-violet-500",
  Inventory: "from-amber-500",
  Procurement: "from-orange-500",
  Operations: "from-green-500",
  HR: "from-pink-500",
  Productivity: "from-cyan-500",
  Integrations: "from-indigo-500",
  System: "from-slate-500",
};

const ui = {
  en: {
    title: "Documentation",
    subtitle: "Explore all 14 modules features, capabilities and step-by-step walkthroughs.",
    searchPlaceholder: "Search modules…",
    all: "All",
    features: "features",
    showFeatures: "Show features",
    hideFeatures: "Hide features",
    tutorialBtn: "Tutorial",
    featuresHeading: "Features",
    screenshotsHeading: "Screenshots & Walkthrough",
    workplacesTitle: "Workplaces",
    workplacesSubtitle: "Flowentra is organized around 11 role-based workspaces. Each workspace brings together the modules, dashboards, and actions you need for that part of your business.",
    whatItOffers: "What it offers",
  },
  fr: {
    title: "Documentation",
    subtitle: "Explorez les 14 modules fonctionnalités, capacités et guides pas à pas.",
    searchPlaceholder: "Rechercher un module…",
    all: "Tous",
    features: "fonctionnalités",
    showFeatures: "Voir les fonctionnalités",
    hideFeatures: "Masquer",
    tutorialBtn: "Tutoriel",
    featuresHeading: "Fonctionnalités",
    screenshotsHeading: "Captures d'écran & Tutoriel",
    workplacesTitle: "Espaces de travail",
    workplacesSubtitle: "Flowentra est organisé autour de 11 espaces de travail basés sur les rôles. Chaque espace rassemble les modules, tableaux de bord et actions nécessaires pour cette partie de votre entreprise.",
    whatItOffers: "Ce qu'il offre",
  },
};


const Documentation = () => {
  const { lang } = useLanguage();
  const t = ui[lang as keyof typeof ui] || ui.en;
  const isFr = lang === "fr";

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [tutorialModule, setTutorialModule] = useState<Module | null>(null);

  const categories = ["All", ...Array.from(new Set(modules.map(m => m.category)))];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return modules.filter(m => {
      const matchCat = activeCategory === "All" || m.category === activeCategory;
      const title = isFr ? m.titleFr : m.titleEn;
      const desc = isFr ? m.descFr : m.descEn;
      const matchSearch = !q || title.toLowerCase().includes(q) || desc.toLowerCase().includes(q) ||
        m.features.some(f => f.items.some(i => i.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    });
  }, [search, activeCategory, isFr]);

  const totalFeatures = (m: Module) => m.features.reduce((acc, f) => acc + f.items.length, 0);

  return (
    <PageLayout title={t.title} subtitle={t.subtitle}>
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">

          {/* Workplaces overview */}
          <div className="mb-14">
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

          {/* Search + category filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat === "All" ? t.all : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Module grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((m, i) => {
              const isOpen = expanded === m.id;
              const title = isFr ? m.titleFr : m.titleEn;
              const desc = isFr ? m.descFr : m.descEn;
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={`rounded-2xl border overflow-hidden transition-shadow flex flex-col ${isOpen ? "border-primary/40 shadow-lg shadow-primary/8" : "border-border hover:shadow-sm"}`}
                >
                  {/* Card header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {m.icon}
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${categoryColors[m.category]}`}>
                          {m.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {totalFeatures(m)} {t.features}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base mb-1.5">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>

                  {/* Action row: features toggle + tutorial button */}
                  <div className="px-5 pb-4 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setExpanded(isOpen ? null : m.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      {isOpen ? t.hideFeatures : t.showFeatures}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <button
                      onClick={() => setTutorialModule(m)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      {t.tutorialBtn}
                    </button>
                  </div>

                  {/* Expandable features */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="features"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="p-5 space-y-4 bg-muted/20">
                          {m.features.map((section, si) => (
                            <div key={si}>
                              <p className="text-[10px] font-extrabold tracking-widest uppercase text-primary mb-2">
                                {isFr ? section.headingFr : section.headingEn}
                              </p>
                              <ul className="space-y-1.5">
                                {(isFr ? (section.itemsFr ?? section.items) : section.items).map((item, ii) => (
                                  <li key={ii} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-semibold mb-1">{isFr ? "Aucun module trouvé" : "No modules found"}</p>
              <p className="text-sm">{isFr ? "Essayez un autre terme de recherche." : "Try a different search term."}</p>
            </div>
          )}
        </div>
      </section>

      {/* Tutorial Dialog */}
      <Dialog open={!!tutorialModule} onOpenChange={() => setTutorialModule(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {tutorialModule?.icon}
              </div>
              <div>
                <span className="block font-extrabold">
                  {tutorialModule ? (isFr ? tutorialModule.titleFr : tutorialModule.titleEn) : ""}
                </span>
                <span className="text-xs font-normal text-muted-foreground">{t.screenshotsHeading}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {tutorialModule && (docScreenshots[tutorialModule.moduleId] || []).map((shot, si) => (
              <div key={si} className="rounded-xl border border-border overflow-hidden bg-background">
                <img src={shot.image} alt={isFr ? (docScreenshotsFr[tutorialModule.moduleId]?.[shot.num]?.caption ?? shot.caption) : shot.caption} className="w-full h-48 object-cover object-top bg-muted/30" />
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
                      {shot.num}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{isFr ? (docScreenshotsFr[tutorialModule.moduleId]?.[shot.num]?.caption ?? shot.caption) : shot.caption}</span>
                  </div>
                  <ul className="space-y-1 pl-7">
                    {(isFr ? (docScreenshotsFr[tutorialModule.moduleId]?.[shot.num]?.details ?? shot.details) : shot.details).map((d: string, di: number) => (
                      <li key={di} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Documentation;
