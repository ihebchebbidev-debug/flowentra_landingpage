import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsSection } from "@/contexts/CmsContentContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Phone, Briefcase, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import heroBg from "@/assets/hero-bg-test.png";

const BASE_PRICE_PER_USER = { starter: 29, professional: 39, enterprise: 55 };
const BASE_PRICE_SERVICE = { basic: 25, professional: 35, enterprise: 49 };

const pricingData = {
  fr: {
    title: "Tarification simple et transparente",
    subtitle: "Tous nos plans, visibles d'un seul coup d'œil",
    currency: "TND",
    monthly: "/ mois",
    perUser: "par utilisateur / mois",
    perTech: "par technicien / mois",
    yourUsers: "Vos utilisateurs",
    yourTechs: "Vos techniciens",
    calculateLabel: "CALCULER LE PRIX :",
    allFeatures: "Toutes les fonctionnalités",
    cta: "Contacter les ventes",
    ctaQuote: "Demander un devis",
    popular: "Recommandé",
    aiLabel: "Avec IA",
    sectionCrm: "Flowentra CRM / Office",
    sectionService: "Flowentra Service",
    sectionAddons: "Services additionnels",
    plans: [
      {
        name: "Basic",
        pricePerUser: BASE_PRICE_PER_USER.starter,
        tagline: "CRM essentiel pour les petites équipes.",
        summary: ["Maximum 5 utilisateurs", "CRM & contacts", "Offres, commandes & facturation", "Application mobile & agenda", "Rapports & saisie des temps"],
        toolsTitle: "FONCTIONNALITÉS INCLUSES",
        tools: [
          "Jusqu'à 5 utilisateurs",
          "CRM Contacts (Personnes, Entreprises, Fournisseurs)",
          "Champs fiscaux tunisiens (CIN, Matricule Fiscale)",
          "Pipeline de ventes Offres, Commandes & Facturation",
          "Catalogue Articles & Services (prix, marge, TVA)",
          "Agenda partagé & Application mobile",
          "Tableau de bord KPI & Rapports de base",
          "Saisie des temps & dépenses",
          "Importation en masse (Excel)",
        ],
        services: ["Configuration du compte", "Support par email", "Tutoriels vidéo"],
      },
      {
        name: "Professional",
        pricePerUser: BASE_PRICE_PER_USER.professional,
        tagline: "CRM complet avec projets, achats et automatisation.",
        popular: true,
        summary: ["Projets & achats (P2P)", "Gestion des stocks", "Automatisation des workflows", "Formulaires & tableaux de bord sur-mesure"],
        toolsTitle: "TOUT LE STARTER +",
        tools: [
          "Utilisateurs illimités",
          "Gestion des Projets (tâches, jalons, rapports)",
          "Achats & Bons de commande (cycle complet P2P)",
          "Gestion des stocks & mouvements d'inventaire",
          "Constructeur de workflows visuels (automatisation)",
          "Formulaires dynamiques (15+ types de champs)",
          "Constructeur de tableaux de bord (drag & drop)",
          "Branding personnalisé sur offres & rapports",
          "Notifications clients automatiques",
        ],
        services: ["Configuration du compte", "Conseil en processus", "Support par email"],
      },
      {
        name: "Entreprise",
        pricePerUser: BASE_PRICE_PER_USER.enterprise,
        tagline: "Suite complète avec IA, RH et multi-entités.",
        summary: ["Module RH & paie complète", "IA & automatisation avancée", "Multi-entités & SSO", "API & audit logs"],
        toolsTitle: "TOUT LE PROFESSIONAL +",
        tools: [
          "Tout illimité",
          "Module RH complet (paie, CNSS, congés, présences)",
          "Automatisation avancée avec IA (génération de workflows)",
          "Endpoints externes & intégrations API",
          "Gestion multi-entreprises & multi-tenants",
          "Single Sign-On (SSO)",
          "Rôles & permissions personnalisés (RBAC)",
          "Audit logs complets",
        ],
        services: ["Support prioritaire 24/7", "Gestionnaire de compte dédié", "Conseil en processus dédié"],
      },
    ],
    servicePlans: [
      {
        name: "Basic",
        pricePerUser: BASE_PRICE_SERVICE.basic,
        tagline: "Gestion des interventions pour petites équipes terrain.",
        summary: ["De 3 à 5 techniciens", "Ordres de service complets", "Application mobile technicien", "Checklists & signature électronique", "Rapports PDF & suivi équipements"],
        toolsTitle: "FONCTIONNALITÉS INCLUSES",
        tools: [
          "Jusqu'à 5 techniciens",
          "Ordres de service cycle complet (Pending → Clôturé)",
          "Checklists d'intervention (jusqu'à 30 étapes)",
          "Application mobile technicien",
          "Saisie des temps & matériaux sur le terrain",
          "Suivi des équipements & installations clients",
          "Signature électronique sur rapport",
          "Génération de rapports PDF & envoi par email",
        ],
        services: ["Configuration du compte", "Support par email", "Tutoriels vidéo"],
      },
      {
        name: "Professional",
        pricePerUser: BASE_PRICE_SERVICE.professional,
        tagline: "Planification avancée et optimisation des interventions.",
        popular: true,
        summary: ["Dispatcheur complet (carte, swimlane)", "Maintenance préventive", "Stocks terrain & automatisation", "Notifications client automatiques"],
        toolsTitle: "TOUT LE BASIC +",
        tools: [
          "Techniciens illimités",
          "Dispatcheur complet swimlane, drag & drop, vue Carte",
          "Planificateur de maintenance préventive",
          "Checklists illimitées (formulaires dynamiques)",
          "Gestion des stocks terrain & mouvements d'inventaire",
          "Automatisation des workflows (déclencheurs sur statut)",
          "Branding personnalisé sur rapports d'intervention",
          "Notifications client automatiques (email / SMS)",
        ],
        services: ["Configuration du compte", "Conseil en processus", "Support par email"],
      },
      {
        name: "Entreprise",
        pricePerUser: BASE_PRICE_SERVICE.enterprise,
        tagline: "Service terrain piloté par l'IA, multi-entités.",
        summary: ["IA tournées & planification auto", "RH terrain & paie", "Multi-entités & SSO", "API & audit logs"],
        toolsTitle: "TOUT LE PROFESSIONAL +",
        tools: [
          "Tout illimité",
          "Optimisation IA des tournées techniciens",
          "Planification automatique clients (IA)",
          "Module RH terrain (paie, congés, présences)",
          "Endpoints externes & intégrations API",
          "Gestion multi-entreprises & multi-tenants",
          "Single Sign-On (SSO)",
          "Audit logs complets",
        ],
        services: ["Support prioritaire 24/7", "Gestionnaire de compte dédié", "Conseil en processus dédié"],
      },
    ],
    supportAddon: {
      name: "Support Téléphonique",
      tagline: "Pour Flowentra CRM/Office & Flowentra Service",
      price: "20%",
      priceLabel: "de votre facture mensuelle",
      features: [
        "Applicable aux deux applications",
        "Assistance téléphonique dédiée (Lun-Ven, 8h–18h)",
        "Partage d'écran & assistance à distance",
        "Réponse prioritaire en moins de 4h",
        "Formation utilisateurs à distance",
      ],
    },
    consultancyAddon: {
      name: "Gestion de Projet & Conseil",
      tagline: "Accompagnement sur-mesure par nos experts",
      price: "Sur devis",
      priceLabel: "selon effort & périmètre",
      features: [
        "Analyse & cadrage de vos besoins",
        "Déploiement & paramétrage avancé",
        "Formation équipes sur site ou à distance",
        "Conseil en transformation digitale",
        "Suivi de projet dédié",
      ],
    },
  },
  en: {
    title: "Simple, Transparent Pricing",
    subtitle: "All our plans, visible at a glance",
    currency: "TND",
    monthly: "/ month",
    perUser: "per user / month",
    perTech: "per technician / month",
    yourUsers: "Your users",
    yourTechs: "Your technicians",
    calculateLabel: "CALCULATE PRICE:",
    allFeatures: "All features",
    cta: "Contact Sales",
    ctaQuote: "Request a Quote",
    popular: "Recommended",
    aiLabel: "With AI",
    sectionCrm: "Flowentra CRM / Office",
    sectionService: "Flowentra Service",
    sectionAddons: "Additional Services",
    plans: [
      {
        name: "Basic",
        pricePerUser: BASE_PRICE_PER_USER.starter,
        tagline: "Essential CRM for small teams.",
        summary: ["Up to 5 users", "CRM & contacts", "Quotes, orders & invoicing", "Mobile app & shared calendar", "Reports & time tracking"],
        toolsTitle: "INCLUDED FEATURES",
        tools: [
          "Up to 5 users",
          "CRM Contacts (Persons, Companies, Suppliers)",
          "Tunisian fiscal fields (CIN, Tax ID)",
          "Sales pipeline Quotes, Orders & Invoicing",
          "Articles & Services catalog (price, margin, VAT)",
          "Shared calendar & Mobile app",
          "KPI dashboard & basic reports",
          "Time & expense tracking",
          "Bulk import (Excel)",
        ],
        services: ["Account setup", "Email support", "Video tutorials"],
      },
      {
        name: "Professional",
        pricePerUser: BASE_PRICE_PER_USER.professional,
        tagline: "Full CRM with projects, purchasing and automation.",
        popular: true,
        summary: ["Projects & purchasing (P2P)", "Stock management", "Workflow automation", "Custom forms & dashboards"],
        toolsTitle: "EVERYTHING IN STARTER +",
        tools: [
          "Unlimited users",
          "Project management (tasks, milestones, reports)",
          "Purchases & purchase orders (full P2P cycle)",
          "Stock management & inventory movements",
          "Visual workflow builder (automation)",
          "Dynamic forms (15+ field types)",
          "Custom dashboard builder (drag & drop)",
          "Custom branding on quotes & reports",
          "Automatic client notifications",
        ],
        services: ["Account setup", "Process consulting", "Email support"],
      },
      {
        name: "Enterprise",
        pricePerUser: BASE_PRICE_PER_USER.enterprise,
        tagline: "Full suite with AI, HR and multi-entity management.",
        summary: ["Full HR & payroll module", "Advanced AI automation", "Multi-entity & SSO", "API & full audit logs"],
        toolsTitle: "EVERYTHING IN PROFESSIONAL +",
        tools: [
          "Everything unlimited",
          "Full HR module (payroll, CNSS, leaves, attendance)",
          "Advanced AI automation (workflow generation)",
          "External endpoints & API integrations",
          "Multi-company & multi-tenant management",
          "Single Sign-On (SSO)",
          "Custom roles & permissions (RBAC)",
          "Full audit logs",
        ],
        services: ["Priority 24/7 support", "Dedicated account manager", "Dedicated process consulting"],
      },
    ],
    servicePlans: [
      {
        name: "Basic",
        pricePerUser: BASE_PRICE_SERVICE.basic,
        tagline: "Intervention management for small field teams.",
        summary: ["From 3 to 5 technicians", "Full service orders", "Technician mobile app", "Checklists & e-signature", "PDF reports & equipment tracking"],
        toolsTitle: "INCLUDED FEATURES",
        tools: [
          "Up to 5 technicians",
          "Service orders full lifecycle (Pending → Closed)",
          "Intervention checklists (up to 30 steps)",
          "Technician mobile app",
          "Time & materials tracking in the field",
          "Equipment & client installation tracking",
          "Electronic signature on reports",
          "PDF report generation & email sending",
        ],
        services: ["Account setup", "Email support", "Video tutorials"],
      },
      {
        name: "Professional",
        pricePerUser: BASE_PRICE_SERVICE.professional,
        tagline: "Advanced scheduling and intervention optimisation.",
        popular: true,
        summary: ["Full dispatcher (map, swimlane)", "Preventive maintenance", "Field stock & automation", "Automatic client notifications"],
        toolsTitle: "EVERYTHING IN BASIC +",
        tools: [
          "Unlimited technicians",
          "Full dispatcher swimlane, drag & drop, Map view",
          "Preventive maintenance planner",
          "Unlimited checklists (dynamic forms)",
          "Field stock management & inventory movements",
          "Workflow automation (status-based triggers)",
          "Custom branding on intervention reports",
          "Automatic client notifications (email / SMS)",
        ],
        services: ["Account setup", "Process consulting", "Email support"],
      },
      {
        name: "Enterprise",
        pricePerUser: BASE_PRICE_SERVICE.enterprise,
        tagline: "AI-powered field service, multi-entity.",
        summary: ["AI route & auto-scheduling", "Field HR & payroll", "Multi-entity & SSO", "API & full audit logs"],
        toolsTitle: "EVERYTHING IN PROFESSIONAL +",
        tools: [
          "Everything unlimited",
          "AI technician route optimisation",
          "Automatic client scheduling (AI)",
          "Field HR module (payroll, leaves, attendance)",
          "External endpoints & API integrations",
          "Multi-company & multi-tenant management",
          "Single Sign-On (SSO)",
          "Full audit logs",
        ],
        services: ["Priority 24/7 support", "Dedicated account manager", "Dedicated process consulting"],
      },
    ],
    supportAddon: {
      name: "Telephone Support",
      tagline: "For Flowentra CRM/Office & Flowentra Service",
      price: "20%",
      priceLabel: "of your monthly invoice",
      features: [
        "Applies to both applications",
        "Dedicated phone support (Mon–Fri, 8am–6pm)",
        "Screen sharing & remote assistance",
        "Priority response within 4 hours",
        "Remote user training",
      ],
    },
    consultancyAddon: {
      name: "Project Management & Consultancy",
      tagline: "Tailored expert guidance for your business",
      price: "By effort",
      priceLabel: "based on scope & complexity",
      features: [
        "Needs analysis & project scoping",
        "Deployment & advanced configuration",
        "On-site or remote team training",
        "Digital transformation consulting",
        "Dedicated project follow-up",
      ],
    },
  },
};

const CARD_BG = "bg-[#0d1b3e]";
const CARD_BG_POPULAR = "bg-[#102555]";
const CARD_BORDER = "border-[#1e3460]";
const CARD_BORDER_POPULAR = "border-blue-400/50";
const CARD_DIVIDER = "border-[#1e3460]";
const TEXT_HEADING = "text-white";
const TEXT_BODY = "text-blue-100/70";
const TEXT_CALC = "text-blue-200/60";
const BTN_CALC = "border-[#1e3460] bg-[#091630] text-white hover:bg-[#0f2040]";
const CALC_BG = "bg-[#091630]";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="h-px flex-1 bg-white/10" />
    <span className="text-xs font-bold tracking-widest uppercase text-blue-200/70 px-2">{children}</span>
    <div className="h-px flex-1 bg-white/10" />
  </div>
);

const PlanCard = ({ plan, i, perUserLabel, usersLabel, calculateLabel, allFeatures, cta, currency, monthly, popular, aiLabel, users, onInc, onDec, onShowFeatures }: any) => (
  <div className={`relative flex flex-col rounded-2xl border overflow-hidden transition-all ${plan.popular ? `${CARD_BG_POPULAR} ${CARD_BORDER_POPULAR} shadow-xl shadow-blue-900/40` : `${CARD_BG} ${CARD_BORDER}`}`}>
    {plan.popular && (
      <div className="absolute -top-px left-1/2 -translate-x-1/2">
        <span className="inline-block px-4 py-1 bg-blue-400 text-[#0d1b3e] text-xs font-bold rounded-b-lg">{popular}</span>
      </div>
    )}
    {i === 2 && (
      <div className="absolute -top-px right-4">
        <span className="inline-block px-3 py-1 bg-cyan-400 text-[#0d1b3e] text-xs font-bold rounded-b-lg">{aiLabel}</span>
      </div>
    )}
    <div className={`p-8 text-center border-b ${CARD_DIVIDER}`}>
      <h3 className={`text-xl font-bold mb-1.5 uppercase tracking-wide ${TEXT_HEADING}`}>{plan.name}</h3>
      <p className={`text-sm mb-6 ${TEXT_BODY}`}>{plan.tagline}</p>
      <div className="flex items-baseline justify-center gap-2 mb-6">
        <span className={`text-6xl font-extrabold tracking-tight ${TEXT_HEADING}`}>{plan.pricePerUser}</span>
        <div className="text-left">
          <span className={`text-base ${TEXT_BODY}`}>{currency}</span>
          <div className={`text-xs leading-tight ${TEXT_BODY}`}>{perUserLabel}</div>
        </div>
      </div>
      <Link to={`/checkout?plan=${plan.name.toLowerCase()}`} className="block w-full text-center py-3 rounded-xl text-sm font-bold bg-blue-400 text-[#0d1b3e] hover:bg-blue-300 transition-all shadow-sm">
        {cta}
      </Link>
    </div>
    <div className="p-6 flex-1">
      <ul className="space-y-3">
        {(plan.summary || plan.tools || []).map((t: string, ti: number) => (
          <li key={ti} className="flex items-start gap-3 text-sm">
            <Check className="w-4 h-4 mt-0.5 shrink-0 text-blue-300" />
            <span className={TEXT_BODY}>{t}</span>
          </li>
        ))}
      </ul>
    </div>
    {/* Calculator */}
    <div className={`mx-5 p-5 rounded-xl border ${CARD_DIVIDER} ${CALC_BG}`}>
      <p className={`text-xs font-bold text-center tracking-wide mb-3 ${TEXT_CALC}`}>{calculateLabel}</p>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs ${TEXT_CALC}`}>{usersLabel}</span>
        <div className="flex items-center gap-2">
          <button onClick={onDec} className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${BTN_CALC}`}>
            <Minus className="w-3 h-3" />
          </button>
          <span className={`w-9 text-center text-sm font-bold ${TEXT_HEADING}`}>{users}</span>
          <button onClick={onInc} className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${BTN_CALC}`}>
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="text-center">
        <span className={`text-2xl font-extrabold ${TEXT_HEADING}`}>{plan.pricePerUser * users}</span>
        <span className={`text-xs ml-1.5 ${TEXT_CALC}`}>{currency} {monthly}</span>
      </div>
    </div>
    {/* All features button */}
    <div className="px-5 pb-5 pt-3">
      <button
        onClick={onShowFeatures}
        className={`block w-full text-center py-3 text-xs font-semibold border rounded-xl transition-colors text-blue-300 border-blue-400/30 hover:bg-blue-400/10`}
      >
        {allFeatures}
      </button>
    </div>
  </div>
);

const Pricing = () => {
  const { lang } = useLanguage();
  const hardcoded = pricingData[lang as keyof typeof pricingData] || pricingData.en;
  const cms = useCmsSection("pricing", lang, hardcoded as Record<string, any>) as Record<string, any>;
  const t = { ...hardcoded, ...cms };

  const plans: any[] = hardcoded.plans;
  const servicePlans: any[] = hardcoded.servicePlans;
  const sup = hardcoded.supportAddon;
  const con = hardcoded.consultancyAddon;

  const [crmUsers, setCrmUsers] = useState([5, 5, 5]);
  const [serviceUsers, setServiceUsers] = useState([3, 5, 5]);
  const [featuresModal, setFeaturesModal] = useState<{ plan: any; section: string } | null>(null);

  const crmMax = [5, 999, 999];
  const crmMin = [1, 1, 1];
  const serviceMax = [5, 999, 999];
  const serviceMin = [3, 1, 1];

  const incUsers = (setter: React.Dispatch<React.SetStateAction<number[]>>, i: number, max: number[]) =>
    setter(prev => { const n = [...prev]; n[i] = Math.min(max[i], n[i] + 1); return n; });
  const decUsers = (setter: React.Dispatch<React.SetStateAction<number[]>>, i: number, min: number[]) =>
    setter(prev => { const n = [...prev]; n[i] = Math.max(min[i], n[i] - 1); return n; });

  return (
    <>
    <section
      id="pricing"
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
      style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-[#05101f]/88 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 container mx-auto px-5 sm:px-4 lg:px-8 max-w-6xl">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight text-white">{t.title}</h2>
          <p className="text-blue-100/60 text-base sm:text-lg">{t.subtitle}</p>
        </motion.div>

        {/* CRM / Office */}
        <motion.div
          id="pricing-crm"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <SectionLabel>{t.sectionCrm}</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <PlanCard key={i} plan={plan} i={i} perUserLabel={t.perUser} usersLabel={t.yourUsers} calculateLabel={t.calculateLabel} allFeatures={t.allFeatures} cta={t.cta} currency={t.currency} monthly={t.monthly} popular={t.popular} aiLabel={t.aiLabel} users={crmUsers[i]} onInc={() => incUsers(setCrmUsers, i, crmMax)} onDec={() => decUsers(setCrmUsers, i, crmMin)} onShowFeatures={() => setFeaturesModal({ plan, section: t.sectionCrm })} />
            ))}
          </div>
        </motion.div>

        {/* Service */}
        <motion.div
          id="pricing-service"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10"
        >
          <SectionLabel>{t.sectionService}</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {servicePlans.map((plan, i) => (
              <PlanCard key={i} plan={plan} i={i} perUserLabel={t.perTech} usersLabel={t.yourTechs} calculateLabel={t.calculateLabel} allFeatures={t.allFeatures} cta={t.cta} currency={t.currency} monthly={t.monthly} popular={t.popular} aiLabel={t.aiLabel} users={serviceUsers[i]} onInc={() => incUsers(setServiceUsers, i, serviceMax)} onDec={() => decUsers(setServiceUsers, i, serviceMin)} onShowFeatures={() => setFeaturesModal({ plan, section: t.sectionService })} />
            ))}
          </div>
        </motion.div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <SectionLabel>{t.sectionAddons}</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">

            {/* Telephone Support */}
            <div className={`flex flex-col rounded-2xl border overflow-hidden ${CARD_BG} ${CARD_BORDER}`}>
              <div className={`p-8 text-center border-b ${CARD_DIVIDER}`}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-400/15 mb-4">
                  <Phone className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className={`text-xl font-bold mb-1.5 uppercase tracking-wide ${TEXT_HEADING}`}>{sup.name}</h3>
                <p className={`text-sm mb-6 ${TEXT_BODY}`}>{sup.tagline}</p>
                <div className="flex items-baseline justify-center gap-1.5 mb-1">
                  <span className={`text-5xl font-extrabold tracking-tight ${TEXT_HEADING}`}>{sup.price}</span>
                </div>
                <p className="text-xs text-blue-300 font-semibold mb-6">{sup.priceLabel}</p>
                <Link to="/checkout?plan=support" className="block w-full text-center py-3 rounded-xl text-sm font-bold bg-blue-400 text-[#0d1b3e] hover:bg-blue-300 transition-all">
                  {t.cta}
                </Link>
              </div>
              <div className="p-6 flex-1">
                <ul className="space-y-3">
                  {sup.features.map((f: string, fi: number) => (
                    <li key={fi} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-blue-300" />
                      <span className={TEXT_BODY}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Project Management & Consultancy */}
            <div className={`flex flex-col rounded-2xl border overflow-hidden ${CARD_BG} ${CARD_BORDER}`}>
              <div className={`p-8 text-center border-b ${CARD_DIVIDER}`}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-400/15 mb-4">
                  <Briefcase className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className={`text-xl font-bold mb-1.5 uppercase tracking-wide ${TEXT_HEADING}`}>{con.name}</h3>
                <p className={`text-sm mb-6 ${TEXT_BODY}`}>{con.tagline}</p>
                <div className="flex items-baseline justify-center gap-1.5 mb-1">
                  <span className={`text-4xl font-extrabold tracking-tight ${TEXT_HEADING}`}>{con.price}</span>
                </div>
                <p className="text-xs text-blue-300 font-semibold mb-6">{con.priceLabel}</p>
                <Link to="/contact" className="block w-full text-center py-3 rounded-xl text-sm font-bold border border-blue-400/40 text-blue-300 hover:bg-blue-400/10 transition-all">
                  {t.ctaQuote}
                </Link>
              </div>
              <div className="p-6 flex-1">
                <ul className="space-y-3">
                  {con.features.map((f: string, fi: number) => (
                    <li key={fi} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-blue-300" />
                      <span className={TEXT_BODY}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>

    {/* Features popup */}
    <Dialog open={!!featuresModal} onOpenChange={() => setFeaturesModal(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wide">
            {featuresModal?.plan?.name} {featuresModal?.section}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <p className="text-xs font-bold text-primary tracking-wide mb-2">{featuresModal?.plan?.toolsTitle || t.allFeatures}</p>
            <ul className="space-y-2">
              {(featuresModal?.plan?.tools || []).map((tool: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{tool}</span>
                </li>
              ))}
            </ul>
          </div>
          {(featuresModal?.plan?.services || []).length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-bold text-primary tracking-wide mb-2">{t.sectionAddons}</p>
              <ul className="space-y-2">
                {(featuresModal?.plan?.services || []).map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default Pricing;
