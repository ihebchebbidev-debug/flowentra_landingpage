import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsSection } from "@/contexts/CmsContentContext";
import { languages, publicLanguages } from "@/lib/i18n";
import logo from "@/assets/flowentra-logo.png";
import {
  Menu, X, ChevronDown, ChevronRight, Layers,
  Wrench, FolderKanban, LayoutDashboard, ClipboardCheck,
  BarChart3,
  Globe, Users, ShoppingCart, Banknote, UserCheck, CalendarDays, FileText,
  Sparkles, TrendingUp, Code2,
  Snowflake, Building2, Eye, SprayCan, Settings2, Sun, Wifi,
  Droplets, Frame, Store, UtensilsCrossed, Zap, TreePine, Shield, Flower2, Waves, Factory,
  CircuitBoard, Plug, Mail, Inbox, Send, CreditCard, Phone, Brain,
  Play, HelpCircle, BookOpen, Handshake, HeadphonesIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FlagIcon from "@/components/FlagIcon";
import { Link, useLocation } from "react-router-dom";
import { MEGA_ICONS } from "@/components/admin/megaMenuIcons";
import ImageEditOverlay from "./ImageEditOverlay";
import gmailLogo from "@/assets/integrations/gmail.svg";
import outlookLogo from "@/assets/integrations/outlook.svg";
import telegramLogo from "@/assets/integrations/telegram.svg";
import stripeLogo from "@/assets/integrations/stripe.svg";
import konnektLogo from "@/assets/integrations/konnekt.png";
import openrouterLogo from "@/assets/integrations/openrouter.svg";

// ── Icon registry: maps a string name (from CMS JSON) to a Lucide component ──
const resolveIcon = (name: string | undefined, fallback: React.ElementType = Layers): React.ElementType =>
  (name && MEGA_ICONS[name]) || fallback;

// ── Types ──
interface NavItem {
  label: string;
  id: string;
  href?: string;
  hasMega?: boolean;
  isRoute?: boolean;
}

interface TabItem {
  label: string;
  desc?: string;
  href: string;
  isRoute?: boolean;
  icon: React.ElementType;
  image?: string;
}
interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  items: TabItem[];
  footer?: { label: string; href: string };
}
interface MegaConfig {
  tabs: Tab[];
}

// CMS-shape (icons as strings)
interface RawTabItem { label: string; desc?: string; href: string; isRoute?: boolean; icon?: string }
interface RawTab { id: string; label: string; icon?: string; items: RawTabItem[]; footer?: { label: string; href: string } }
interface RawMega { tabs: RawTab[] }

const hydrateMega = (_raw: RawMega | undefined, fallback: MegaConfig): MegaConfig => {
  // Always use the fallback as source of truth for structure and labels.
  // The CMS backend may have stale item counts or wrong-language text stored,
  // so code changes here take immediate effect without needing a DB reset.
  return fallback;
};

const Navbar = () => {
  const { lang, setLang, tr } = useLanguage();
  const navCmsDefaults = {
    features: tr.nav.features,
    pricing: tr.nav.pricing,
    demo: tr.nav.demo,
    testimonials: tr.nav.testimonials,
    faq: tr.nav.faq,
    cta: tr.nav.cta,
    signup: (tr.nav as any).signup || tr.nav.cta,
  };
  const navCms = useCmsSection("nav", lang, navCmsDefaults as Record<string, any>) as Record<string, any>;
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isDarkHero = isHome && !scrolled;
  const fr = lang === "fr";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Default Mega Menu Data (used as fallback when CMS is empty/invalid) ──
  const defaultMegas: Record<string, MegaConfig> = {
    product: {
      tabs: [
        {
          id: "modules",
          label: fr ? "Modules" : "Modules",
          icon: Layers,
          items: [
            { label: fr ? "Gestion de la relation clients (CRM)" : "Customer Relationship Management (CRM)", desc: fr ? "Gérez vos clients, prospects et opportunités en un seul endroit." : "Manage your clients, leads and opportunities in one place.", icon: Users, href: "/#features", isRoute: true },
            { label: fr ? "Gestion des achats" : "Purchasing Management", desc: fr ? "Pilotez vos fournisseurs, bons de commande et réceptions de marchandises." : "Handle suppliers, purchase orders and goods receipts.", icon: ShoppingCart, href: "/#features", isRoute: true },
            { label: fr ? "Gestion des services sur le terrain" : "Field Service Management", desc: fr ? "Planifiez, dispatchez et suivez vos interventions terrain en temps réel." : "Plan, dispatch and track your field operations in real time.", icon: Wrench, href: "/#features", isRoute: true },
            { label: fr ? "Gestion des projets" : "Project Management", desc: fr ? "Organisez vos projets, tâches et équipes avec une vue d'ensemble claire." : "Organise your projects, tasks and teams with a clear overview.", icon: FolderKanban, href: "/#features", isRoute: true },
            { label: fr ? "Gestion de la finance" : "Finance Management", desc: fr ? "Contrôlez vos devis, factures, paiements et indicateurs financiers." : "Control your quotes, invoices, payments and financial KPIs.", icon: Banknote, href: "/#features", isRoute: true },
            { label: fr ? "Gestion de la ressource humaine" : "Human Resource Management", desc: fr ? "Gérez vos employés, la paie, les congés et les performances RH." : "Manage your employees, payroll, leaves and HR performance.", icon: UserCheck, href: "/#features", isRoute: true },
          ],
          footer: { label: fr ? "Découvrir plus →" : "Discover more →", href: "/modules" },
        },
        {
          id: "features",
          label: fr ? "Fonctionnalités" : "Features",
          icon: CircuitBoard,
          items: [
            { label: fr ? "Devis Intelligents & Gestion Commerciale" : "Smart Quotes & Sales Management", desc: fr ? "Devis, calculs de coûts et automatisation des offres commerciales." : "Quotes, cost calculations and sales offer automation.", icon: FileText, href: "/modules#quotes-sales", isRoute: true },
            { label: fr ? "Gestion Client & Communication" : "Client Management & Communication", desc: fr ? "CRM, portails clients, notifications et suivi des interactions." : "CRM, client portals, notifications and interaction tracking.", icon: Users, href: "/modules#client-management", isRoute: true },
            { label: fr ? "Gestion des Interventions & Équipes Terrain" : "Field Operations & Team Management", desc: fr ? "Planification, dispatch IA, suivi temps réel et application mobile." : "Scheduling, AI dispatch, real-time tracking and mobile app.", icon: CalendarDays, href: "/modules#field-operations", isRoute: true },
            { label: fr ? "Gestion des Projets, Maintenance & Équipements" : "Project, Maintenance & Equipment Management", desc: fr ? "Projets, maintenance, équipements et historique des interventions." : "Projects, maintenance, equipment tracking and intervention history.", icon: FolderKanban, href: "/modules#project-maintenance", isRoute: true },
            { label: fr ? "Exécution des Services & Documentation Digitale" : "Service Execution & Digital Documentation", desc: fr ? "Checklists, photos, signatures électroniques et rapports terrain." : "Checklists, photos, e-signatures and automated field reports.", icon: ClipboardCheck, href: "/modules#service-execution", isRoute: true },
            { label: fr ? "Facturation, Analyse, IA & Automatisation" : "Invoicing, Analytics, AI & Automation", desc: fr ? "Facturation automatisée, KPI, tableaux de bord IA et workflows." : "Automated invoicing, KPIs, AI dashboards and business workflows.", icon: BarChart3, href: "/modules#invoicing-analytics", isRoute: true },
          ],
          footer: { label: fr ? "Découvrir plus →" : "Discover more →", href: "/features" },
        },
        {
          id: "interfaces",
          label: fr ? "Intégrations" : "Integrations",
          icon: Plug,
          items: [
            { label: "Gmail", icon: Mail, image: gmailLogo, href: "/integrations" },
            { label: "Outlook", icon: Inbox, image: outlookLogo, href: "/integrations" },
            { label: "Telegram", icon: Send, image: telegramLogo, href: "/integrations" },
            { label: "Stripe", icon: CreditCard, image: stripeLogo, href: "/integrations" },
            { label: "Konnekt", icon: Phone, image: konnektLogo, href: "/integrations" },
            { label: "OpenRouter", icon: Brain, image: openrouterLogo, href: "/integrations" },
          ],
          footer: { label: fr ? "Découvrir toutes les intégrations →" : "Discover all integrations →", href: "/integrations" },
        },
      ],
    },
    solutions: {
      tabs: [
        {
          id: "industries",
          label: fr ? "Secteurs d'activité" : "Business Sectors",
          icon: Building2,
          items: [
            { label: fr ? "Réfrigération & Climatisation" : "HVAC & Refrigeration", icon: Snowflake, href: "/industries" },
            { label: fr ? "Sanitaire & Chauffage" : "Plumbing & Heating", icon: Droplets, href: "/industries" },
            { label: fr ? "Electrique" : "Electrical", icon: Zap, href: "/industries" },
            { label: fr ? "Equipement de cuisine" : "Kitchen Equipment", icon: UtensilsCrossed, href: "/industries" },
            { label: fr ? "Gestion des installations" : "Facility Management", icon: Building2, href: "/industries" },
            { label: fr ? "Construction en bois" : "Timber Construction", icon: TreePine, href: "/industries" },
            { label: fr ? "Fenêtres & Aluminium" : "Windows & Aluminium", icon: Frame, href: "/industries" },
            { label: fr ? "Sécurité" : "Security", icon: Shield, href: "/industries" },
            { label: fr ? "Nettoyage" : "Cleaning", icon: SprayCan, href: "/industries" },
            { label: fr ? "Jardinage" : "Gardening", icon: Flower2, href: "/industries" },
            { label: fr ? "Solaire" : "Solar", icon: Sun, href: "/industries" },
            { label: fr ? "Eau & Energie" : "Water & Energy", icon: Waves, href: "/industries" },
            { label: fr ? "IT & Telecom" : "IT & Telecom", icon: Wifi, href: "/industries" },
            { label: fr ? "Fabricant" : "Manufacturer", icon: Factory, href: "/industries" },
            { label: fr ? "Commerçant" : "Retailer", icon: Store, href: "/industries" },
          ],
          footer: { label: fr ? "Trouvez votre secteur" : "Find your sector", href: "/industries" },
        },
        {
          id: "applications",
          label: fr ? "Applications" : "Applications",
          icon: Layers,
          items: [
            { label: "Flowentra CRM/Office", desc: fr ? "Gestion commerciale complète." : "Complete business management.", icon: LayoutDashboard, href: "/applications#crm-office", isRoute: true },
            { label: "Flowentra Service", desc: fr ? "Gestion des interventions terrain." : "Field intervention management.", icon: Wrench, href: "/applications#service", isRoute: true },
          ],
        },
        {
          id: "services",
          label: fr ? "Services" : "Services",
          icon: Settings2,
          items: [
            { label: fr ? "Conseil en processus" : "Process Consulting", desc: fr ? "Analyse et amélioration de vos processus métiers afin d'augmenter l'efficacité, réduire les coûts et aligner vos opérations avec vos objectifs." : "Analysis and improvement of your business processes to increase efficiency, reduce costs and align your operations with your goals.", icon: Eye, href: "/services#process-consulting", isRoute: true },
            { label: fr ? "Personnalisation et gestion de projets" : "Customisation & Project Management", desc: fr ? "Adaptation des solutions IT à vos besoins tout en assurant la planification, la coordination et la bonne livraison des projets." : "Tailoring IT solutions to your needs while ensuring planning, coordination and successful project delivery.", icon: Sparkles, href: "/services#customisation-project", isRoute: true },
            { label: fr ? "Développement de logiciels sur mesure" : "Custom Software Development", desc: fr ? "Création de solutions logicielles sécurisées et évolutives, conçues spécifiquement pour répondre aux besoins de votre entreprise." : "Building secure and scalable software solutions designed specifically to meet your business needs.", icon: Code2, href: "/services#custom-software", isRoute: true },
            { label: fr ? "Solutions web et digitales" : "Web & Digital Solutions", desc: fr ? "Développement de sites web et d'applications web modernes pour améliorer votre présence en ligne et l'expérience utilisateur." : "Development of modern websites and web applications to improve your online presence and user experience.", icon: TrendingUp, href: "/services#web-digital", isRoute: true },
            { label: fr ? "Support Client" : "Customer Support", desc: fr ? "Fournir une assistance réactive et fiable à vos clients, garantissant un fonctionnement fluide, une résolution rapide des problèmes et un support continu." : "Providing responsive and reliable assistance to your clients, ensuring smooth operation, fast issue resolution and continuous support.", icon: HeadphonesIcon, href: "/services#customer-support", isRoute: true },
          ],
          footer: { label: fr ? "Découvrir plus →" : "Discover more →", href: "/services" },
        },
      ],
    },
    resources: {
      tabs: [
        {
          id: "learn",
          label: fr ? "Apprendre" : "Learn",
          icon: BookOpen,
          items: [
            { label: fr ? "Démo interactive" : "Interactive Demo", desc: fr ? "Explorez la plateforme en direct." : "Explore the platform live.", icon: Play, href: "/demo", isRoute: true },
            { label: "Documentation", desc: fr ? "Guides et références techniques." : "Guides and technical references.", icon: BookOpen, href: "/docs", isRoute: true },
          ],
        },
        {
          id: "community",
          label: fr ? "Communauté" : "Community",
          icon: Handshake,
          items: [
            { label: fr ? "Partenaires" : "Partners", desc: fr ? "Notre réseau de partenaires." : "Our partner network.", icon: Handshake, href: "/partners", isRoute: true },
            { label: fr ? "Support client" : "Customer Support", desc: fr ? "Nous sommes là pour vous." : "We're here for you.", icon: HeadphonesIcon, href: "/support", isRoute: true },
          ],
        },
      ],
    },
  };

  // ── Pull live mega-menu config from CMS ──
  const navMegaDefaults = {
    productLabel: fr ? "Produit" : "Product",
    solutionsLabel: fr ? "Solutions" : "Solutions",
    resourcesLabel: fr ? "Ressources" : "Resources",
  };
  const navMegaCms = useCmsSection("navMega", lang, navMegaDefaults as Record<string, any>) as Record<string, any>;

  const megas: Record<string, MegaConfig> = {
    product: hydrateMega(navMegaCms.product as RawMega | undefined, defaultMegas.product),
    solutions: hydrateMega(navMegaCms.solutions as RawMega | undefined, defaultMegas.solutions),
    resources: hydrateMega(navMegaCms.resources as RawMega | undefined, defaultMegas.resources),
  };

  // Custom links from CMS admins can append { label, href } pairs to nav.customLinks (JSON).
  const customLinks: Array<{ label: string; href: string }> = Array.isArray(navCms.customLinks) ? navCms.customLinks : [];

  const navItems: NavItem[] = [
    { label: navMegaDefaults.productLabel, id: "product", hasMega: true },
    { label: navMegaDefaults.solutionsLabel, id: "solutions", hasMega: true },
    { label: navMegaDefaults.resourcesLabel, id: "resources", hasMega: true },
    { label: tr.nav.pricing, id: "pricing", href: "/pricing", isRoute: true },
    ...customLinks.map((c, i) => ({ label: c.label, id: `custom_${i}`, href: c.href, isRoute: c.href.startsWith("/") })),
    { label: navCms.contact || "Contact", id: "contact", href: "/contact", isRoute: true },
  ];

  const handleMenuEnter = (id: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(id);
    const mega = megas[id];
    if (mega?.tabs?.length) setActiveTab(mega.tabs[0].id);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setActiveTab(null);
    }, 180);
  };

  const closeMenu = () => { setActiveMenu(null); setActiveTab(null); };

  const currentLang = languages.find((l) => l.code === lang)!;

  // ── Unified Mega Panel ──
  const renderMegaPanel = (menuId: string) => {
    const mega = megas[menuId];
    if (!mega) return null;
    const currentTab = mega.tabs.find(t => t.id === activeTab) || mega.tabs[0];

    return (
      <div className="flex py-6">
        {/* Left sidebar */}
        <div className="w-[260px] shrink-0 border-r border-border bg-muted/20 p-4 flex flex-col gap-1">
          {mega.tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onMouseEnter={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-semibold transition-all ${
                  isActive
                    ? "bg-primary/8 text-primary border border-primary/12"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.8} />
                <span className="flex-1 text-left">{tab.label}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "translate-x-0.5" : ""}`} />
              </button>
            );
          })}
        </div>

        {/* Right content */}
        <div className="flex-1 p-8">
          {/* Logo grid for image-based tabs (e.g. Integrations) */}
          {currentTab.items.some(it => it.image) ? (
            <div className="grid grid-cols-3 gap-2">
              {currentTab.items.map((item, i) => {
                const inner = (
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/40 transition-colors group cursor-pointer">
                    <div className="w-7 h-7 shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.label} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[14px] font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</span>
                  </div>
                );
                return item.isRoute
                  ? <Link key={i} to={item.href} onClick={closeMenu}>{inner}</Link>
                  : <a key={i} href={item.href} onClick={closeMenu}>{inner}</a>;
              })}
            </div>
          ) : (
          <div className={`grid gap-x-6 gap-y-1 ${currentTab.items.length > 8 ? "grid-cols-3" : "grid-cols-2 gap-x-10"}`}>
            {currentTab.items.map((item, i) => {
              const Icon = item.icon;
              const inner = (
                <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/40 transition-colors group cursor-pointer">
                  <Icon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.8} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-foreground leading-tight">{item.label}</div>
                    {item.desc && (
                      <div className="text-[12px] text-muted-foreground mt-0.5 leading-snug">{item.desc}</div>
                    )}
                  </div>
                </div>
              );
              if (item.isRoute) {
                return <Link key={i} to={item.href} onClick={closeMenu}>{inner}</Link>;
              }
              return <a key={i} href={item.href} onClick={closeMenu}>{inner}</a>;
            })}
          </div>
          )}

          {currentTab.footer && (
            currentTab.footer.href.startsWith("/") ? (
              <Link
                to={currentTab.footer.href}
                onClick={closeMenu}
                className="mt-6 block text-center py-4 rounded-xl border border-primary/20 bg-primary/5 text-[14px] font-semibold text-primary hover:bg-primary/10 transition-all"
              >
                {currentTab.footer.label}
              </Link>
            ) : (
              <a
                href={currentTab.footer.href}
                onClick={closeMenu}
                className="mt-6 block text-center py-4 rounded-xl border border-primary/20 bg-primary/5 text-[14px] font-semibold text-primary hover:bg-primary/10 transition-all"
              >
                {currentTab.footer.label}
              </a>
            )
          )}
        </div>
      </div>
    );
  };

  // ── Mobile data ──
  const mobileMenuData = Object.entries(megas).map(([, mega]) => ({
    label: mega.tabs[0]?.label || "",
    children: mega.tabs.flatMap(t => [
      { label: t.label, isHeader: true },
      ...t.items.map(i => ({ label: i.label, href: i.href, isRoute: i.isRoute })),
    ]),
  }));
  // Fix labels
  mobileMenuData[0].label = fr ? "Produit" : "Product";
  mobileMenuData[1].label = fr ? "Solutions" : "Solutions";
  mobileMenuData[2].label = fr ? "Ressources" : "Resources";
  mobileMenuData.push(
    { label: fr ? "Prix" : "Pricing", children: undefined as any },
    { label: "Contact", children: undefined as any },
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHome ? "bg-card/95 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center h-14 sm:h-16 px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center shrink-0 w-[140px] sm:w-[180px]">
          <Link to="/" className="flex items-center gap-2 group relative">
            <div className="relative">
              {(() => {
                const customLogo = typeof navCms.logo === "string" && navCms.logo.trim() ? navCms.logo : null;
                const imgSrc = customLogo || logo;
                // Only apply the brand-tint filter to the BUNDLED default logo;
                // a custom uploaded logo is shown as-is so admins see exactly
                // what they uploaded.
                const filterStyle = customLogo
                  ? undefined
                  : isDarkHero
                    ? { filter: "brightness(0) invert(1)" }
                    : { filter: "brightness(0.8) sepia(1) hue-rotate(170deg) saturate(3)" };
                return (
                  <>
                    <img
                      src={imgSrc}
                      alt="Flowentra"
                      className="h-10 sm:h-12 transition-all duration-300"
                      style={filterStyle}
                    />
                    <ImageEditOverlay sectionKey="nav" label="logo" empty={!customLogo} size="sm" />
                  </>
                );
              })()}
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-0.5">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => item.hasMega ? handleMenuEnter(item.id) : undefined}
              onMouseLeave={item.hasMega ? handleMenuLeave : undefined}
            >
              {item.isRoute ? (
                <Link
                  to={item.href!}
                  className={`flex items-center gap-1 px-3.5 py-2 text-[15px] font-bold rounded-md transition-all ${
                    isDarkHero
                      ? 'text-white hover:text-white/80 hover:bg-white/10'
                      : 'text-primary hover:text-primary/80 hover:bg-primary/10'
                  } ${activeMenu === item.id ? (isDarkHero ? 'text-white bg-white/10' : 'text-primary bg-primary/10') : ''}`}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href || "#"}
                  onClick={(e) => { if (item.hasMega) e.preventDefault(); }}
                  className={`flex items-center gap-1 px-3.5 py-2 text-[15px] font-bold rounded-md transition-all ${
                    isDarkHero
                      ? 'text-white hover:text-white/80 hover:bg-white/10'
                      : 'text-primary hover:text-primary/80 hover:bg-primary/10'
                  } ${activeMenu === item.id ? (isDarkHero ? 'text-white bg-white/10' : 'text-primary bg-primary/10') : ''}`}
                >
                  {item.label}
                  {item.hasMega && (
                    <ChevronDown className={`w-3.5 h-3.5 ${isDarkHero ? 'text-white' : 'text-primary'} transition-transform ${activeMenu === item.id ? 'rotate-180' : ''}`} />
                  )}
                </a>
              )}

              {/* Full-width mega dropdown */}
              <AnimatePresence>
                {item.hasMega && activeMenu === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="fixed left-0 right-0 top-14 sm:top-16 z-50"
                    onMouseEnter={() => handleMenuEnter(item.id)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <div className="border-b border-border bg-card shadow-lg">
                      <div className="container mx-auto px-4 lg:px-8">
                        {renderMegaPanel(item.id)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center justify-end gap-2 w-[220px]">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-all ${isDarkHero ? 'text-primary hover:text-primary/80 hover:bg-primary/10' : 'text-primary hover:text-primary/80 hover:bg-primary/10'}`}
            >
              <FlagIcon country={currentLang.country} className="w-5 h-auto" />
              <ChevronDown className={`w-3 h-3 text-primary transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                >
                  {publicLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${l.code === lang ? "bg-primary/5 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                    >
                      <FlagIcon country={l.country} className="w-5 h-auto" />
                      <span>{l.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={`w-px h-5 ${isDarkHero ? 'bg-primary/30' : 'bg-primary/30'}`} />

          <Link to="/demo" className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90 ${isDarkHero ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'}`}>
            {fr ? "Essai gratuit" : "Free trial"}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`lg:hidden ml-auto w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative z-50 ${isDarkHero ? 'hover:bg-primary/10 text-primary' : 'hover:bg-primary/10 text-primary'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-14 bg-white backdrop-blur-xl z-40 overflow-y-auto"
          >
            <div className="px-5 py-6 space-y-1">
              {mobileMenuData.map((item, i) => (
                <div key={i}>
                  <motion.button
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      if (item.children) {
                        setMobileExpanded(mobileExpanded === item.label ? null : item.label);
                      } else {
                        setMobileOpen(false);
                      }
                    }}
                    className="w-full flex items-center justify-between text-base font-semibold text-foreground py-3.5 px-4 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    {item.children ? item.label : (
                      <a href={item.label === "Contact" ? "#contact" : "/pricing"} onClick={() => setMobileOpen(false)} className="w-full text-left">{item.label}</a>
                    )}
                    {item.children && <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />}
                  </motion.button>

                  <AnimatePresence>
                    {item.children && mobileExpanded === item.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4"
                      >
                        {item.children.map((child: any, ci: number) => {
                          if (child.isHeader) {
                            return (
                              <div key={ci} className="px-4 pt-3 pb-1 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                {child.label}
                              </div>
                            );
                          }
                          if (child.isRoute) {
                            return (
                              <Link key={ci} to={child.href} onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                                {child.label}
                              </Link>
                            );
                          }
                          return (
                            <a key={ci} href={child.href} onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                              {child.label}
                            </a>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="pt-4 mt-3 border-t border-border">
                <p className="text-[10px] font-semibold text-muted-foreground/50 tracking-widest uppercase px-4 mb-2">
                  {fr ? "Langue" : "Language"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {publicLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setMobileOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${l.code === lang ? "bg-primary/8 text-primary font-semibold border border-primary/15" : "text-muted-foreground hover:bg-muted/50 border border-transparent"}`}
                    >
                      <FlagIcon country={l.country} className="w-5 h-auto" />
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Link to="/demo" onClick={() => setMobileOpen(false)} className="block text-center px-5 py-3.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  {fr ? "Essai gratuit / Démo" : "Free trial / Demo"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
