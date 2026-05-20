import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTABanner from "@/components/landing/CTABanner";
import EditableSection from "@/components/landing/EditableSection";
import {
  Shield, LayoutDashboard, Users, Package, Warehouse,
  ShoppingCart, Wrench, UserCheck, FileText, GitBranch,
  Plug, List, CalendarDays, Settings,
} from "lucide-react";

interface Feature { titleEn: string; titleFr: string; descEn: string; descFr: string; }
interface Section {
  icon: React.ReactNode;
  categoryEn: string; categoryFr: string;
  titleEn: string; titleFr: string;
  subtitleEn: string; subtitleFr: string;
  image: string;
  color: string;
  features: Feature[];
}

const sections: Section[] = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    categoryEn: "Core", categoryFr: "Essentiel",
    titleEn: "Dashboard & Analytics", titleFr: "Tableau de bord & Analytique",
    subtitleEn: "Get a real-time picture of your business with configurable KPI dashboards, drag-and-drop widget builder and 14 chart types.",
    subtitleFr: "Obtenez une vue en temps réel de votre activité avec des tableaux de bord KPI configurables, un constructeur de widgets par glisser-déposer et 14 types de graphiques.",
    image: "/docs-screenshots/02-dashboard-05-default-service-dashboard-kpis-char.png",
    color: "from-blue-500/20 to-blue-500/5",
    features: [
      { titleEn: "Drag & Drop Builder", titleFr: "Constructeur glisser-déposer", descEn: "Build custom dashboards with 14 widget types — KPI, bar, line, pie, gauge, heatmap, map and more.", descFr: "Construisez des tableaux de bord avec 14 types de widgets — KPI, barres, lignes, camembert, jauge, carte thermique et plus." },
      { titleEn: "Built-in Dashboards", titleFr: "Tableaux de bord intégrés", descEn: "Ready-to-use dashboards for Service, Sales, HR, Finance and Executive views switchable from the top bar.", descFr: "Tableaux de bord prêts à l'emploi pour Service, Ventes, RH, Finance et direction, accessibles depuis la barre supérieure." },
      { titleEn: "Real-time KPIs", titleFr: "KPIs en temps réel", descEn: "Live data refresh via SignalR with a global period selector and comparison to the previous period.", descFr: "Actualisation des données en temps réel via SignalR avec sélecteur de période global et comparaison à la période précédente." },
      { titleEn: "Public Sharing", titleFr: "Partage public", descEn: "Share any dashboard externally via a signed token URL — no login required for stakeholders.", descFr: "Partagez n'importe quel tableau de bord via une URL sécurisée — sans connexion requise pour les parties prenantes." },
      { titleEn: "28-Step Product Tour", titleFr: "Visite guidée 28 étapes", descEn: "First-time users are guided through every key feature with an interactive step-by-step walkthrough.", descFr: "Les nouveaux utilisateurs sont guidés à travers chaque fonctionnalité clé avec une visite guidée interactive." },
      { titleEn: "Grid Customisation", titleFr: "Personnalisation de la grille", descEn: "Fine-tune spacing, row height, card style, animation and auto-refresh interval per dashboard.", descFr: "Personnalisez l'espacement, la hauteur, le style des cartes, les animations et l'intervalle d'actualisation par tableau de bord." },
    ],
  },
  {
    icon: <Users className="w-5 h-5" />,
    categoryEn: "CRM", categoryFr: "CRM",
    titleEn: "Contacts & CRM", titleFr: "Contacts & CRM",
    subtitleEn: "Unified directory of persons, companies and suppliers with Tunisian fiscal IDs, geolocation and a 360° activity history.",
    subtitleFr: "Répertoire unifié de personnes, entreprises et fournisseurs avec identifiants fiscaux tunisiens, géolocalisation et historique d'activité 360°.",
    image: "/docs-screenshots/03-contacts-04-person-detail-360-tabs.png",
    color: "from-violet-500/20 to-violet-500/5",
    features: [
      { titleEn: "Persons, Companies & Suppliers", titleFr: "Personnes, Entreprises & Fournisseurs", descEn: "Three contact types in one place with dedicated fields, fiscal IDs (CIN, Matricule Fiscale) and geolocation.", descFr: "Trois types de contacts en un seul endroit avec champs dédiés, identifiants fiscaux et géolocalisation." },
      { titleEn: "360° Activity History", titleFr: "Historique d'activité 360°", descEn: "Full history of Offers, Sales, Service Orders, Purchases, Installations and Notes per contact.", descFr: "Historique complet des Offres, Ventes, Ordres de service, Achats, Installations et Notes par contact." },
      { titleEn: "Map View", titleFr: "Vue carte", descEn: "Visualise all contacts on an interactive map with geolocation pins and Open in Maps navigation.", descFr: "Visualisez tous les contacts sur une carte interactive avec épingles de géolocalisation et navigation vers Maps." },
      { titleEn: "Bulk Import", titleFr: "Import en masse", descEn: "Dynamic import (any Excel headers with column mapping) or structured import with duplicate strategy.", descFr: "Import dynamique (en-têtes Excel quelconques avec mappage) ou import structuré avec stratégie de doublons." },
      { titleEn: "Advanced Filters & Tags", titleFr: "Filtres avancés & Tags", descEn: "Filter by status, type, tags, favorites, and presence of email, phone or geolocation data.", descFr: "Filtrez par statut, type, tags, favoris et présence d'email, téléphone ou géolocalisation." },
      { titleEn: "CSV Export", titleFr: "Export CSV", descEn: "Export any filtered contact list to CSV in one click directly from the list view.", descFr: "Exportez n'importe quelle liste filtrée en CSV en un clic depuis la vue liste." },
    ],
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    categoryEn: "Sales", categoryFr: "Ventes",
    titleEn: "Sales & Invoicing", titleFr: "Ventes & Facturation",
    subtitleEn: "End-to-end sales pipeline from quote to invoice with full Tunisian fiscal compliance, custom branding and PDF generation.",
    subtitleFr: "Pipeline de ventes de bout en bout, du devis à la facture, avec conformité fiscale tunisienne, branding personnalisé et génération PDF.",
    image: "/docs-screenshots/06-purchases-01-purchases-hub-kpis-recent-activity.png",
    color: "from-orange-500/20 to-orange-500/5",
    features: [
      { titleEn: "Quotes & Orders", titleFr: "Offres & Commandes", descEn: "Multi-line quotes with auto totals, discount, VAT and fiscal stamp — convert to order in one click.", descFr: "Devis multi-lignes avec totaux automatiques, remise, TVA et timbre fiscal — convertis en commande en un clic." },
      { titleEn: "Invoicing", titleFr: "Facturation", descEn: "Generate compliant invoices with payment terms, installment schedules and retenue à la source.", descFr: "Générez des factures conformes avec conditions de paiement, échéanciers et retenue à la source." },
      { titleEn: "Articles & Services Catalog", titleFr: "Catalogue articles & services", descEn: "Single catalog for products and services with selling price, cost, margin, VAT and supplier links.", descFr: "Catalogue unique pour produits et services avec prix de vente, coût, marge, TVA et liens fournisseurs." },
      { titleEn: "Custom Branding", titleFr: "Branding personnalisé", descEn: "Apply your company logo, colors and footer to all quotes, orders, invoices and reports.", descFr: "Appliquez le logo, les couleurs et le pied de page de votre entreprise sur tous les documents." },
      { titleEn: "Status Workflow", titleFr: "Flux de statut", descEn: "Draft → Sent → Accepted → Ordered → Delivered → Invoiced — with full audit trail at each step.", descFr: "Brouillon → Envoyé → Accepté → Commandé → Livré → Facturé — avec historique complet à chaque étape." },
      { titleEn: "PDF & Email", titleFr: "PDF & Email", descEn: "Generate branded PDF documents and send them directly from the platform with one click.", descFr: "Générez des PDF avec votre identité visuelle et envoyez-les directement depuis la plateforme." },
    ],
  },
  {
    icon: <Package className="w-5 h-5" />,
    categoryEn: "Inventory", categoryFr: "Inventaire",
    titleEn: "Stock & Inventory", titleFr: "Stock & Inventaire",
    subtitleEn: "Multi-warehouse stock control with full movement history, low-stock alerts and automatic replenishment proposals.",
    subtitleFr: "Contrôle des stocks multi-entrepôts avec historique complet des mouvements, alertes de stock bas et propositions de réapprovisionnement automatiques.",
    image: "/docs-screenshots/05-stock-management-01-stock-management-at-a-glance-grid-w.png",
    color: "from-amber-500/20 to-amber-500/5",
    features: [
      { titleEn: "Multi-warehouse", titleFr: "Multi-entrepôts", descEn: "Manage multiple physical or logical warehouse locations per company with per-warehouse stock quantities.", descFr: "Gérez plusieurs emplacements d'entrepôts physiques ou logiques par entreprise avec quantités par entrepôt." },
      { titleEn: "Movement Types", titleFr: "Types de mouvements", descEn: "Stock In, Stock Out, Transfer, Adjustment, Damaged, Lost and Return — all logged with source document.", descFr: "Entrée, Sortie, Transfert, Ajustement, Endommagé, Perdu et Retour — tous tracés avec le document source." },
      { titleEn: "Low-Stock Alerts", titleFr: "Alertes stock bas", descEn: "Daily job compares quantity on hand vs minimum stock and flags Critical, Low Stock or Healthy status.", descFr: "Tâche quotidienne comparant la quantité disponible au stock minimum et signalant Critique, Bas ou Normal." },
      { titleEn: "Replenishment Proposals", titleFr: "Propositions de réapprovisionnement", descEn: "Automatically generate draft Purchase Orders for items below their reorder threshold.", descFr: "Génère automatiquement des bons de commande brouillons pour les articles sous leur seuil de réapprovisionnement." },
      { titleEn: "Stock Reservations", titleFr: "Réservations de stock", descEn: "Soft-reserve stock for Offers, Sales and Service Orders to prevent over-commitment.", descFr: "Réserve provisoire du stock pour les Offres, Ventes et Ordres de service pour éviter les sur-engagements." },
      { titleEn: "Full Audit Log", titleFr: "Journal d'audit complet", descEn: "Every movement shows previous → new stock, reason, reference, performer and timestamp.", descFr: "Chaque mouvement affiche stock précédent → nouveau, motif, référence, acteur et horodatage." },
    ],
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    categoryEn: "Operations", categoryFr: "Opérations",
    titleEn: "Service Orders", titleFr: "Ordres de service",
    subtitleEn: "Complete field-service lifecycle from creation to invoicing — jobs, dispatches, time tracking, materials, checklists and PDF reports.",
    subtitleFr: "Cycle de vie complet des interventions terrain de la création à la facturation — jobs, dispatches, temps, matériaux, checklists et rapports PDF.",
    image: "/docs-screenshots/07-service-orders-09-detail-dispatches-tab.png",
    color: "from-green-500/20 to-green-500/5",
    features: [
      { titleEn: "Full Lifecycle", titleFr: "Cycle de vie complet", descEn: "Pending → Scheduled → In Progress → Technically Completed → Ready for Invoice → Invoiced → Closed.", descFr: "En attente → Planifié → En cours → Techniquement terminé → Prêt pour facturation → Facturé → Clôturé." },
      { titleEn: "Jobs & Dispatches", titleFr: "Jobs & Dispatches", descEn: "Group jobs by installation with assigned technicians, priorities and scheduled date/time per dispatch.", descFr: "Regroupez les jobs par installation avec techniciens assignés, priorités et date/heure planifiée par dispatch." },
      { titleEn: "Time & Materials", titleFr: "Temps & Matériaux", descEn: "Log time and expenses linked to each dispatch and track materials used from the stock catalog.", descFr: "Saisissez les temps et dépenses liés à chaque dispatch et suivez les matériaux utilisés depuis le catalogue de stock." },
      { titleEn: "Checklists & e-Signature", titleFr: "Checklists & Signature électronique", descEn: "Attach dynamic form checklists to any service order and collect electronic client signature on-site.", descFr: "Joignez des checklists de formulaires dynamiques et collectez la signature électronique client sur site." },
      { titleEn: "Table, Cards & Map Views", titleFr: "Vues Tableau, Cartes & Carte", descEn: "Switch between table, card grid and geolocation map view — tap any pin to open the order.", descFr: "Basculez entre tableau, grille de cartes et vue carte géolocalisée — appuyez sur une épingle pour ouvrir l'ordre." },
      { titleEn: "PDF Report & Email", titleFr: "Rapport PDF & Email", descEn: "Generate branded intervention reports and send them to the client directly from the platform.", descFr: "Générez des rapports d'intervention avec votre identité visuelle et envoyez-les au client depuis la plateforme." },
    ],
  },
  {
    icon: <CalendarDays className="w-5 h-5" />,
    categoryEn: "Operations", categoryFr: "Opérations",
    titleEn: "Dispatcher & Scheduler", titleFr: "Dispatcheur & Planificateur",
    subtitleEn: "Interactive swimlane planner for technician dispatch — drag and drop jobs, detect conflicts and optimise routes with AI.",
    subtitleFr: "Planificateur swimlane interactif pour le dispatch technicien — glissez-déposez les jobs, détectez les conflits et optimisez les tournées avec l'IA.",
    image: "/docs-screenshots/13-scheduling-01-planner-3-day-timeline-view-with-te.png",
    color: "from-teal-500/20 to-teal-500/5",
    features: [
      { titleEn: "Swimlane Timeline", titleFr: "Chronologie swimlane", descEn: "Technician rows × hour columns with 1-day to 30-day horizons and a real-time current-time indicator.", descFr: "Lignes techniciens × colonnes heures avec horizons de 1 à 30 jours et indicateur de l'heure actuelle." },
      { titleEn: "Drag & Drop Rescheduling", titleFr: "Replanification par glisser-déposer", descEn: "Move or resize job pills to reschedule or reassign — conflicts highlighted instantly.", descFr: "Déplacez ou redimensionnez les pastilles de job pour replanifier ou réassigner — conflits mis en évidence instantanément." },
      { titleEn: "Monthly Calendar", titleFr: "Calendrier mensuel", descEn: "30-day overview with technician avatars per day and weekend overlays for non-working time.", descFr: "Vue d'ensemble 30 jours avec avatars techniciens par jour et superpositions pour les jours non travaillés." },
      { titleEn: "Unassigned Orders Rail", titleFr: "Panneau des ordres non assignés", descEn: "Right-side panel lists unassigned Service Orders with search — drag them directly onto the planner.", descFr: "Panneau latéral listant les Ordres de service non assignés avec recherche — glissez-les directement sur le planificateur." },
      { titleEn: "Preventive Maintenance", titleFr: "Maintenance préventive", descEn: "Schedule recurring maintenance tasks with frequency rules, automatic due-date generation and alerts.", descFr: "Planifiez des tâches de maintenance récurrentes avec règles de fréquence, génération automatique d'échéances et alertes." },
      { titleEn: "AI Route Optimisation", titleFr: "Optimisation IA des tournées", descEn: "Let AI reorder and assign technician schedules to minimise travel time and maximise capacity.", descFr: "Laissez l'IA réorganiser et assigner les plannings techniciens pour minimiser les trajets et maximiser la capacité." },
    ],
  },
  {
    icon: <UserCheck className="w-5 h-5" />,
    categoryEn: "HR", categoryFr: "RH",
    titleEn: "Human Resources & Payroll", titleFr: "Ressources Humaines & Paie",
    subtitleEn: "Complete HR suite tuned for Tunisian law — payroll, CNSS, attendance, leaves, org chart, performance and recruitment.",
    subtitleFr: "Suite RH complète adaptée à la législation tunisienne — paie, CNSS, présences, congés, organigramme, performance et recrutement.",
    image: "/docs-screenshots/08-hr-07-payroll-runs-tunisian-2025-law-cnss.png",
    color: "from-pink-500/20 to-pink-500/5",
    features: [
      { titleEn: "Payroll & CNSS", titleFr: "Paie & CNSS", descEn: "Automated payroll runs with CNSS, CSS and IRPP progressive brackets — PDF payslips and monthly CNSS declaration.", descFr: "Exécution automatisée de la paie avec barèmes CNSS, CSS et IRPP — bulletins de salaire PDF et déclaration CNSS mensuelle." },
      { titleEn: "Attendance Tracking", titleFr: "Suivi des présences", descEn: "List and matrix views of monthly attendance with worked hours, overtime and late counts per employee.", descFr: "Vues liste et matrice des présences mensuelles avec heures travaillées, heures sup et retards par employé." },
      { titleEn: "Leave Management", titleFr: "Gestion des congés", descEn: "Request workflow, calendar view, leave balances and manager approval — all in one place.", descFr: "Workflow de demande, vue calendrier, soldes de congés et approbation manager — tout en un seul endroit." },
      { titleEn: "Org Chart", titleFr: "Organigramme", descEn: "Hierarchical department tree with manager avatars and direct drill-down to employee profiles.", descFr: "Arborescence hiérarchique des départements avec avatars managers et accès direct aux profils employés." },
      { titleEn: "Performance Management", titleFr: "Gestion des performances", descEn: "Goals, review cycles and structured performance reviews linked to each employee profile.", descFr: "Objectifs, cycles d'évaluation et évaluations structurées liés à chaque profil employé." },
      { titleEn: "Recruitment Pipeline", titleFr: "Pipeline de recrutement", descEn: "Kanban board: Applied → Screening → Interview → Offer → Hired — with notes and attachments per candidate.", descFr: "Tableau Kanban : Candidature → Présélection → Entretien → Offre → Embauché — avec notes et pièces jointes par candidat." },
    ],
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    categoryEn: "Automation", categoryFr: "Automatisation",
    titleEn: "Workflow Automation", titleFr: "Automatisation des workflows",
    subtitleEn: "Visual no-code automation engine with AI-assisted graph generation, live debugger and version history.",
    subtitleFr: "Moteur d'automatisation visuel no-code avec génération de graphe assistée par IA, débogueur en direct et historique des versions.",
    image: "/docs-screenshots/10-workflow-02-live-canvas-full-default-business-w.png",
    color: "from-cyan-500/20 to-cyan-500/5",
    features: [
      { titleEn: "React-Flow Canvas", titleFr: "Canevas React-Flow", descEn: "Pan, zoom, snap-to-grid, multi-select and undo/redo on an infinite canvas with mini-map.", descFr: "Panoramique, zoom, magnétisme grille, sélection multiple et annuler/rétablir sur un canevas infini avec mini-carte." },
      { titleEn: "Triggers & Actions", titleFr: "Déclencheurs & Actions", descEn: "Webhook, Scheduled CRON, Status-change and Entity-created triggers — plus 10+ action node types.", descFr: "Déclencheurs Webhook, CRON planifié, Changement de statut et Entité créée — plus de 10 types de nœuds d'action." },
      { titleEn: "AI Workflow Builder", titleFr: "Constructeur de workflow IA", descEn: "Describe your process in plain language and let AI generate the full workflow graph instantly.", descFr: "Décrivez votre processus en langage naturel et laissez l'IA générer le graphe de workflow instantanément." },
      { titleEn: "Live Debugger", titleFr: "Débogueur en direct", descEn: "Color-coded nodes show input/output JSON per step during execution — catch issues in real time.", descFr: "Les nœuds colorés affichent le JSON entrée/sortie par étape pendant l'exécution — détectez les problèmes en temps réel." },
      { titleEn: "Dynamic Forms", titleFr: "Formulaires dynamiques", descEn: "15+ field types, bilingual (EN/FR), public links, response inbox and PDF export with company branding.", descFr: "15+ types de champs, bilingue (EN/FR), liens publics, boîte de réception des réponses et export PDF." },
      { titleEn: "Version History", titleFr: "Historique des versions", descEn: "Every Save creates a new version — restore or fork any prior version of a workflow at any time.", descFr: "Chaque sauvegarde crée une nouvelle version — restaurez ou dérivez n'importe quelle version précédente." },
    ],
  },
  {
    icon: <Warehouse className="w-5 h-5" />,
    categoryEn: "Procurement", categoryFr: "Achats",
    titleEn: "Purchases & Procurement", titleFr: "Achats & Approvisionnement",
    subtitleEn: "Full procure-to-pay cycle adapted to the Tunisian fiscal context — PO, receipt, supplier invoice and payment in one flow.",
    subtitleFr: "Cycle d'approvisionnement complet adapté au contexte fiscal tunisien — BC, réception, facture fournisseur et paiement en un seul flux.",
    image: "/docs-screenshots/06-purchases-02-purchase-orders-list.png",
    color: "from-indigo-500/20 to-indigo-500/5",
    features: [
      { titleEn: "Purchase Orders", titleFr: "Bons de commande", descEn: "Multi-line POs with payment terms, fiscal stamp and auto totals — full status flow from Draft to Closed.", descFr: "BC multi-lignes avec conditions de paiement, timbre fiscal et totaux automatiques — flux de statut complet de Brouillon à Clôturé." },
      { titleEn: "Goods Receipts", titleFr: "Bons de réception", descEn: "Full or partial reception per line — automatic stock movement created on confirmation.", descFr: "Réception totale ou partielle par ligne — mouvement de stock créé automatiquement à la confirmation." },
      { titleEn: "Supplier Invoices", titleFr: "Factures fournisseurs", descEn: "3-way matching (PO vs Receipt vs Invoice) with retenue à la source auto-computed per supplier.", descFr: "Rapprochement à 3 voies (BC vs Réception vs Facture) avec retenue à la source calculée automatiquement par fournisseur." },
      { titleEn: "Fiscal Compliance", titleFr: "Conformité fiscale", descEn: "Dashboard for RS YTD, Facture en Ligne counts and TEJ synchronisation status.", descFr: "Tableau de bord pour RS YTD, compteurs Facture en Ligne et statut de synchronisation TEJ." },
      { titleEn: "Supplier Analytics", titleFr: "Analytique fournisseurs", descEn: "On-time delivery %, average lead time, price evolution per article and invoice aging buckets.", descFr: "% livraison à temps, délai moyen, évolution des prix par article et tranches de vieillissement des factures." },
      { titleEn: "Purchases Audit Log", titleFr: "Journal d'audit des achats", descEn: "Full before/after JSON diff for every purchase document change — who, when and what.", descFr: "Diff JSON avant/après complet pour chaque modification de document achat — qui, quand et quoi." },
    ],
  },
  {
    icon: <Settings className="w-5 h-5" />,
    categoryEn: "Security", categoryFr: "Sécurité",
    titleEn: "Security & Administration", titleFr: "Sécurité & Administration",
    subtitleEn: "Enterprise-grade access control, multi-tenancy, SSO and full audit logs — built in from day one.",
    subtitleFr: "Contrôle d'accès de niveau entreprise, multi-tenants, SSO et journaux d'audit complets — intégrés dès le premier jour.",
    image: "/docs-screenshots/14-settings-14-edit-role-permissions-matrix.png",
    color: "from-slate-500/20 to-slate-500/5",
    features: [
      { titleEn: "RBAC Permissions", titleFr: "Permissions RBAC", descEn: "Fine-grained role-based access control with a permission matrix per module — view, create, edit, delete.", descFr: "Contrôle d'accès basé sur les rôles avec matrice de permissions par module — voir, créer, modifier, supprimer." },
      { titleEn: "Multi-Company", titleFr: "Multi-entreprises", descEn: "Manage multiple companies and tenants from a single account — pin your default company.", descFr: "Gérez plusieurs entreprises et tenants depuis un seul compte — épinglez votre entreprise par défaut." },
      { titleEn: "Single Sign-On (SSO)", titleFr: "Authentification unique (SSO)", descEn: "Integrate your identity provider for seamless SSO login across your organisation.", descFr: "Intégrez votre fournisseur d'identité pour une connexion SSO transparente dans votre organisation." },
      { titleEn: "API & External Endpoints", titleFr: "API & Endpoints externes", descEn: "Receive inbound webhooks with signed URLs, API keys and JSON Schema validation per endpoint.", descFr: "Recevez des webhooks entrants avec URL signées, clés API et validation JSON Schema par endpoint." },
      { titleEn: "Full Audit Logs", titleFr: "Journaux d'audit complets", descEn: "Every record change is logged with before/after state, user, timestamp and source action.", descFr: "Chaque modification est journalisée avec l'état avant/après, l'utilisateur, l'horodatage et l'action source." },
      { titleEn: "Theme & Preferences", titleFr: "Thème & Préférences", descEn: "Light, dark or system theme, accent colour picker and layout density — personalised per user.", descFr: "Thème clair, sombre ou système, sélecteur de couleur d'accentuation et densité de mise en page — personnalisé par utilisateur." },
    ],
  },
];

const categoryColors: Record<string, string> = {
  Core: "bg-blue-100 text-blue-700", Essentiel: "bg-blue-100 text-blue-700",
  CRM: "bg-violet-100 text-violet-700",
  Sales: "bg-orange-100 text-orange-700", Ventes: "bg-orange-100 text-orange-700",
  Inventory: "bg-amber-100 text-amber-700", Inventaire: "bg-amber-100 text-amber-700",
  Operations: "bg-green-100 text-green-700", Opérations: "bg-green-100 text-green-700",
  HR: "bg-pink-100 text-pink-700", RH: "bg-pink-100 text-pink-700",
  Automation: "bg-cyan-100 text-cyan-700", Automatisation: "bg-cyan-100 text-cyan-700",
  Procurement: "bg-indigo-100 text-indigo-700", Achats: "bg-indigo-100 text-indigo-700",
  Security: "bg-slate-100 text-slate-700", Sécurité: "bg-slate-100 text-slate-700",
};

const ui = {
  en: {
    title: "All Features",
    subtitle: "Everything Flowentra includes — grouped by module so you know exactly what you get.",
    sectionLabel: "Platform",
  },
  fr: {
    title: "Toutes les fonctionnalités",
    subtitle: "Tout ce que Flowentra inclut — regroupé par module pour que vous sachiez exactement ce que vous obtenez.",
    sectionLabel: "Plateforme",
  },
};

const FeatureCard = ({ titleEn, titleFr, descEn, descFr, isFr }: Feature & { isFr: boolean }) => (
  <div className="bg-background rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-sm transition-all">
    <h4 className="font-bold text-sm mb-1.5 text-foreground">{isFr ? titleFr : titleEn}</h4>
    <p className="text-xs text-muted-foreground leading-relaxed">{isFr ? descFr : descEn}</p>
  </div>
);

const FeaturesPage = () => {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const t = isFr ? ui.fr : ui.en;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px]" />
      </div>

      <EditableSection sectionKey="nav" label="Nav">
        <Navbar />
      </EditableSection>

      <div className="pt-24 pb-4">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl text-center">
          <motion.p
            className="text-xs font-bold tracking-widest uppercase text-primary mb-3"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          >
            {t.sectionLabel}
          </motion.p>
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          >
            {t.title}
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t.subtitle}
          </motion.p>
        </div>
      </div>

      <div className="py-12 space-y-10 container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
        {sections.map((section, i) => {
          const flip = i % 2 !== 0;
          const cat = isFr ? section.categoryFr : section.categoryEn;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="rounded-2xl border border-border bg-muted/20 overflow-hidden"
            >
              <div className={`flex flex-col ${flip ? "lg:flex-row-reverse" : "lg:flex-row"}`}>

                {/* Left / Right: Image + heading */}
                <div className="lg:w-[42%] shrink-0 flex flex-col">
                  <div className="relative overflow-hidden bg-muted flex-1 min-h-[220px]">
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-60`} />
                    <img
                      src={section.image}
                      alt={isFr ? section.titleFr : section.titleEn}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 border-t border-border bg-muted/30">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-3 ${categoryColors[cat] || "bg-primary/10 text-primary"}`}>
                      {cat}
                    </span>
                    <h2 className="text-xl font-extrabold tracking-tight mb-2">
                      {isFr ? section.titleFr : section.titleEn}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isFr ? section.subtitleFr : section.subtitleEn}
                    </p>
                  </div>
                </div>

                {/* Right / Left: Feature grid */}
                <div className="lg:flex-1 p-6 lg:p-8">
                  <div className="grid sm:grid-cols-2 gap-3 h-full content-start">
                    {section.features.map((f, fi) => (
                      <FeatureCard key={fi} {...f} isFr={isFr} />
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      <EditableSection sectionKey="ctaBanner" label="CTA">
        <CTABanner />
      </EditableSection>

      <EditableSection sectionKey="footer" label="Footer">
        <Footer />
      </EditableSection>
    </div>
  );
};

export default FeaturesPage;
