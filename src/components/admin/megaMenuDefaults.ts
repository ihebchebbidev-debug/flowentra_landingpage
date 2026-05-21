/**
 * Default mega-menu content — mirrors the fallback used in
 * src/components/landing/Navbar.tsx (defaultMegas).
 *
 * Admins use these as a starting template when a menu is empty,
 * so they can see exactly "what's currently shown by default" and
 * customize from there.
 *
 * Keep this file in sync with Navbar.tsx defaultMegas.
 */

import type { MegaConfig } from "./MegaMenuBuilder";

type Lang = "en" | "fr";

const productDefaults = (lang: Lang): MegaConfig => {
  const fr = lang === "fr";
  return {
    tabs: [
      {
        id: "modules",
        label: fr ? "Modules" : "Modules",
        icon: "Layers",
        items: [
          { label: fr ? "Gestion de la relation clients (CRM)" : "Customer Relationship Management (CRM)", desc: fr ? "Gérez vos clients, prospects et opportunités en un seul endroit." : "Manage your clients, leads and opportunities in one place.", icon: "Users", href: "/features", isRoute: true },
          { label: fr ? "Gestion des achats" : "Purchasing Management", desc: fr ? "Pilotez vos fournisseurs, bons de commande et réceptions de marchandises." : "Handle suppliers, purchase orders and goods receipts.", icon: "ShoppingCart", href: "/features", isRoute: true },
          { label: fr ? "Gestion des services sur le terrain" : "Field Service Management", desc: fr ? "Planifiez, dispatchez et suivez vos interventions terrain en temps réel." : "Plan, dispatch and track your field operations in real time.", icon: "Wrench", href: "/features", isRoute: true },
          { label: fr ? "Gestion des projets" : "Project Management", desc: fr ? "Organisez vos projets, tâches et équipes avec une vue d'ensemble claire." : "Organise your projects, tasks and teams with a clear overview.", icon: "FolderKanban", href: "/features", isRoute: true },
          { label: fr ? "Gestion de la finance" : "Finance Management", desc: fr ? "Contrôlez vos devis, factures, paiements et indicateurs financiers." : "Control your quotes, invoices, payments and financial KPIs.", icon: "Banknote", href: "/features", isRoute: true },
          { label: fr ? "Gestion de la ressource humaine" : "Human Resource Management", desc: fr ? "Gérez vos employés, la paie, les congés et les performances RH." : "Manage your employees, payroll, leaves and HR performance.", icon: "UserCheck", href: "/features", isRoute: true },
        ],
      },
      {
        id: "features",
        label: fr ? "Fonctionnalités" : "Features",
        icon: "CircuitBoard",
        items: [
          { label: fr ? "Devis Intelligents & Gestion Commerciale" : "Smart Quotes & Sales Management", desc: fr ? "Devis, calculs de coûts et automatisation des offres commerciales." : "Quotes, cost calculations and sales offer automation.", icon: "FileText", href: "/features", isRoute: true },
          { label: fr ? "Gestion Client & Communication" : "Client Management & Communication", desc: fr ? "CRM, portails clients, notifications et suivi des interactions." : "CRM, client portals, notifications and interaction tracking.", icon: "Users", href: "/features", isRoute: true },
          { label: fr ? "Gestion des Interventions & Équipes Terrain" : "Field Operations & Team Management", desc: fr ? "Planification, dispatch IA, suivi temps réel et application mobile." : "Scheduling, AI dispatch, real-time tracking and mobile app.", icon: "CalendarDays", href: "/features", isRoute: true },
          { label: fr ? "Gestion des Projets, Maintenance & Équipements" : "Project, Maintenance & Equipment Management", desc: fr ? "Projets, maintenance, équipements et historique des interventions." : "Projects, maintenance, equipment tracking and intervention history.", icon: "FolderKanban", href: "/features", isRoute: true },
          { label: fr ? "Exécution des Services & Documentation Digitale" : "Service Execution & Digital Documentation", desc: fr ? "Checklists, photos, signatures électroniques et rapports terrain." : "Checklists, photos, e-signatures and automated field reports.", icon: "ClipboardCheck", href: "/features", isRoute: true },
          { label: fr ? "Facturation, Analyse, IA & Automatisation" : "Invoicing, Analytics, AI & Automation", desc: fr ? "Facturation automatisée, KPI, tableaux de bord IA et workflows." : "Automated invoicing, KPIs, AI dashboards and business workflows.", icon: "BarChart3", href: "/features", isRoute: true },
        ],
        footer: { label: fr ? "Découvrir toutes les fonctionnalités →" : "Discover all features →", href: "/features" },
      },
      {
        id: "interfaces",
        label: fr ? "Interfaces" : "Interfaces",
        icon: "Smartphone",
        items: [
          { label: fr ? "Application mobile" : "Mobile App", desc: fr ? "Accès terrain en mobilité." : "Field access on the go.", icon: "Smartphone", href: "#demo" },
          { label: fr ? "Portail client" : "Client Portal", desc: fr ? "Espace client en libre-service." : "Self-service client portal.", icon: "Globe", href: "#demo" },
        ],
      },
    ],
  };
};

const solutionsDefaults = (lang: Lang): MegaConfig => {
  const fr = lang === "fr";
  return {
    tabs: [
      {
        id: "industries",
        label: fr ? "Industries" : "Industries",
        icon: "Building2",
        items: [
          { label: fr ? "Climatisation et réfrigération" : "HVAC & Refrigeration", icon: "Snowflake", href: "#industries" },
          { label: fr ? "Sanitaire et chauffage" : "Plumbing & Heating", icon: "Droplets", href: "#industries" },
          { label: fr ? "Gestion des installations" : "Facility Management", icon: "Building2", href: "#industries" },
          { label: fr ? "Sécurité et surveillance" : "Security & Surveillance", icon: "Eye", href: "#industries" },
          { label: fr ? "Nettoyage et entretien" : "Cleaning & Maintenance", icon: "SprayCan", href: "#industries" },
          { label: fr ? "Maintenance et SAV" : "Field Service & After-Sales", icon: "Settings2", href: "#industries" },
          { label: fr ? "Solaire et énergies" : "Solar & Energy", icon: "Sun", href: "#industries" },
          { label: fr ? "IT et télécommunications" : "IT & Telecom", icon: "Wifi", href: "#industries" },
          { label: fr ? "Construction des fenêtres et aluminium" : "Windows & Aluminium", icon: "Frame", href: "#industries" },
          { label: fr ? "Fabricant & Commerçant" : "Manufacturer & Retailer", icon: "Store", href: "#industries" },
          { label: fr ? "Equipement de cuisine" : "Kitchen Equipment", icon: "UtensilsCrossed", href: "#industries" },
        ],
        footer: { label: fr ? "Trouvez votre secteur" : "Find your industry", href: "#industries" },
      },
      {
        id: "applications",
        label: fr ? "Applications" : "Applications",
        icon: "Layers",
        items: [
          { label: "Flowentra CRM/Office", desc: fr ? "Gestion commerciale complète." : "Complete business management.", icon: "LayoutDashboard", href: "/features", isRoute: true },
          { label: "Flowentra Service", desc: fr ? "Gestion des interventions terrain." : "Field intervention management.", icon: "Wrench", href: "/features", isRoute: true },
        ],
      },
      {
        id: "services",
        label: fr ? "Services" : "Services",
        icon: "Settings2",
        items: [
          { label: fr ? "Conseil en processus" : "Process Consulting", desc: fr ? "Analyse et amélioration de vos processus métiers afin d'augmenter l'efficacité, réduire les coûts et aligner vos opérations avec vos objectifs." : "Analysis and improvement of your business processes to increase efficiency, reduce costs and align your operations with your goals.", icon: "Eye", href: "#contact" },
          { label: fr ? "Personnalisation et gestion de projets" : "Customisation & Project Management", desc: fr ? "Adaptation des solutions IT à vos besoins tout en assurant la planification, la coordination et la bonne livraison des projets." : "Tailoring IT solutions to your needs while ensuring planning, coordination and successful project delivery.", icon: "Sparkles", href: "#contact" },
          { label: fr ? "Développement de logiciels sur mesure" : "Custom Software Development", desc: fr ? "Création de solutions logicielles sécurisées et évolutives, conçues spécifiquement pour répondre aux besoins de votre entreprise." : "Building secure and scalable software solutions designed specifically to meet your business needs.", icon: "Code2", href: "#contact" },
          { label: fr ? "Solutions web et digitales" : "Web & Digital Solutions", desc: fr ? "Développement de sites web et d'applications web modernes pour améliorer votre présence en ligne et l'expérience utilisateur." : "Development of modern websites and web applications to improve your online presence and user experience.", icon: "TrendingUp", href: "#contact" },
          { label: fr ? "Support Client" : "Customer Support", desc: fr ? "Fournir une assistance réactive et fiable à vos clients, garantissant un fonctionnement fluide, une résolution rapide des problèmes et un support continu." : "Providing responsive and reliable assistance to your clients, ensuring smooth operation, fast issue resolution and continuous support.", icon: "HeadphonesIcon", href: "/support", isRoute: true },
        ],
      },
    ],
  };
};

const resourcesDefaults = (lang: Lang): MegaConfig => {
  const fr = lang === "fr";
  return {
    tabs: [
      {
        id: "learn",
        label: fr ? "Apprendre" : "Learn",
        icon: "BookOpen",
        items: [
          { label: fr ? "Démo interactive" : "Interactive Demo", desc: fr ? "Explorez la plateforme en direct." : "Explore the platform live.", icon: "Play", href: "#demo" },
          { label: fr ? "Tutoriels" : "Tutorials", desc: fr ? "Guides pas à pas." : "Step-by-step guides.", icon: "BookOpen", href: "/documentation", isRoute: true },
          { label: "FAQ", desc: fr ? "Questions fréquentes." : "Frequently asked questions.", icon: "HelpCircle", href: "#faq" },
        ],
      },
      {
        id: "community",
        label: fr ? "Communauté" : "Community",
        icon: "Handshake",
        items: [
          { label: fr ? "Témoignages" : "Testimonials", desc: fr ? "Ce que nos clients disent." : "What our customers say.", icon: "MessageCircle", href: "#testimonials" },
          { label: fr ? "Partenaires" : "Partners", desc: fr ? "Notre réseau de partenaires." : "Our partner network.", icon: "Handshake", href: "/partners", isRoute: true },
          { label: fr ? "Support client" : "Customer Support", desc: fr ? "Nous sommes là pour vous." : "We're here for you.", icon: "HeadphonesIcon", href: "/support", isRoute: true },
        ],
      },
    ],
  };
};

export type MegaMenuKey = "product" | "solutions" | "resources";

/**
 * Returns the default MegaConfig for a given menu and language —
 * EXACTLY matches the fallback shown to visitors when CMS is empty.
 * For unknown languages, falls back to English.
 */
export const getDefaultMegaConfig = (key: MegaMenuKey, lang: string): MegaConfig => {
  const l: Lang = lang === "fr" ? "fr" : "en";
  switch (key) {
    case "product":
      return productDefaults(l);
    case "solutions":
      return solutionsDefaults(l);
    case "resources":
      return resourcesDefaults(l);
  }
};

export const getDefaultMegaJson = (key: MegaMenuKey, lang: string): string =>
  JSON.stringify(getDefaultMegaConfig(key, lang));
