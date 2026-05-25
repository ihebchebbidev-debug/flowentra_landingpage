import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsSection } from "@/contexts/CmsContentContext";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Users, CalendarDays, FolderKanban, ClipboardCheck, BarChart3, X, ZoomIn, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ImageEditOverlay from "./ImageEditOverlay";
import { useState } from "react";

const showcaseData = {
  en: {
    label: "See it in action",
    title: "One platform to run your entire business",
    items: [
      {
        tag: "Quotes & Sales",
        title: "Smart Quotes & Sales Management",
        desc: "Manage cost calculations, create professional quotes, automate service offers and optimise sales processes to accelerate revenue and improve accuracy.",
        image: "/screenshots/showcase-quotes-sales.png",
      },
      {
        tag: "CRM",
        title: "Client Management & Communication",
        desc: "Centralise client interactions through CRM tools, client portals, notifications, intervention tracking and communication systems to improve satisfaction and loyalty.",
        image: "/screenshots/showcase-customer-communication.png",
      },
      {
        tag: "Field Operations",
        title: "Field Operations & Team Management",
        desc: "Schedule technicians, optimise routes and mission assignments with AI, track teams in real time and facilitate field operations via a mobile app.",
        image: "/screenshots/showcase-service-interventions.png",
      },
      {
        tag: "Projects",
        title: "Project, Maintenance & Equipment Management",
        desc: "Organise projects, maintenance operations, equipment and asset tracking, tasks and full intervention history from a centralised platform.",
        image: "/screenshots/showcase-Installation-projects.png",
      },
      {
        tag: "Digital Field",
        title: "Service Execution & Digital Documentation",
        desc: "Enable technicians to carry out interventions digitally with checklists, photos, electronic signatures, automated reports and materials tracking directly in the field.",
        image: "/screenshots/showcase-digital-field.png",
      },
      {
        tag: "AI & Billing",
        title: "Invoicing, Analytics, AI & Business Automation",
        desc: "Automate invoicing, payment tracking, business workflows and ERP/CRM integrations, while leveraging intelligent dashboards, KPIs and AI-based analytics to improve decision-making and operational performance.",
        image: "/screenshots/showcase-digital-invoicing.png",
      },
    ],
  },
  fr: {
    label: "Découvrez en action",
    title: "Une seule plateforme pour gérer toute votre entreprise",
    items: [
      {
        tag: "Devis & Ventes",
        title: "Devis Intelligents & Gestion Commerciale",
        image: "/screenshots/showcase-quotes-sales.png",
        desc: "Gérez les calculs de coûts, créez des devis professionnels, automatisez les offres de services et optimisez les processus commerciaux pour accélérer les ventes et améliorer la précision.",
      },
      {
        tag: "CRM",
        title: "Gestion Client & Communication",
        desc: "Centralisez les interactions clients grâce aux outils CRM, portails clients, notifications, suivis d'interventions et systèmes de communication afin d'améliorer la satisfaction et la fidélisation.",
        image: "/screenshots/showcase-customer-communication.png",
      },
      {
        tag: "Terrain",
        title: "Gestion des Interventions & des Équipes Terrain",
        desc: "Planifiez les techniciens, optimisez les tournées et l'affectation des missions grâce à l'IA, suivez les équipes en temps réel et facilitez les opérations terrain via une application mobile.",
        image: "/screenshots/showcase-service-interventions.png",
      },
      {
        tag: "Projets",
        title: "Gestion des Projets, Maintenance & Équipements",
        desc: "Organisez les projets, les opérations de maintenance, le suivi des équipements et des actifs, les tâches et l'historique complet des interventions depuis une plateforme centralisée.",
        image: "/screenshots/showcase-Installation-projects.png",
      },
      {
        tag: "Digital",
        title: "Exécution des Services & Documentation Digitale",
        desc: "Permettez aux techniciens de réaliser les interventions de manière digitale avec des checklists, photos, signatures électroniques, rapports automatiques et suivi des matériaux directement sur le terrain.",
        image: "/screenshots/showcase-digital-field.png",
      },
      {
        tag: "IA & Facturation",
        title: "Facturation, Analyse, IA & Automatisation Métier",
        desc: "Automatisez la facturation, le suivi des paiements, les workflows métiers et les intégrations ERP/CRM, tout en exploitant des tableaux de bord intelligents, KPI et analyses basées sur l'IA pour améliorer la prise de décision et la performance opérationnelle.",
        image: "/screenshots/showcase-digital-invoicing.png",
      },
    ],
  },
  de: {
    label: "In Aktion erleben",
    title: "Eine Plattform für Ihr gesamtes Unternehmen",
    items: [
      {
        tag: "Dashboard",
        title: "Echtzeit-Analysen auf einen Blick",
        desc: "Verfolgen Sie KPIs, überwachen Sie die Leistung und treffen Sie datenbasierte Entscheidungen.",
      },
      {
        tag: "Teamverwaltung",
        title: "Zusammenarbeit ohne Chaos",
        desc: "Aufgaben zuweisen, Zeitpläne verwalten und das gesamte Team koordinieren.",
      },
      {
        tag: "Automatisierung",
        title: "Wiederkehrende Prozesse automatisieren",
        desc: "Erstellen Sie visuelle Workflows, die Aktionen auslösen und Daten zwischen Systemen synchronisieren.",
      },
      {
        tag: "KI-Assistent",
        title: "Ihr intelligenter Copilot",
        desc: "Intelligente Vorschläge, automatische Dokumentenerstellung und KI-gestützte Entscheidungen.",
      },
    ],
  },
  ar: {
    label: "شاهدها أثناء العمل",
    title: "منصة واحدة لإدارة أعمالك بالكامل",
    items: [
      {
        tag: "لوحة التحكم",
        title: "تحليلات فورية في لمحة",
        desc: "تتبع مؤشرات الأداء واتخذ قرارات مبنية على البيانات مع لوحات تحكم قابلة للتخصيص.",
      },
      {
        tag: "إدارة الفريق",
        title: "تعاون بدون فوضى",
        desc: "عيّن المهام وأدر الجداول الزمنية وأبقِ فريقك متوافقاً.",
      },
      {
        tag: "الأتمتة",
        title: "أتمت العمليات المتكررة",
        desc: "أنشئ سير عمل مرئية تطلق الإجراءات وترسل الإشعارات تلقائياً.",
      },
      {
        tag: "مساعد الذكاء الاصطناعي",
        title: "مساعدك الذكي",
        desc: "احصل على اقتراحات ذكية وأتمت إنشاء المستندات.",
      },
    ],
  },
};

const icons = [FileText, Users, CalendarDays, FolderKanban, ClipboardCheck, BarChart3];

const ProductShowcase = () => {
  const { lang } = useLanguage();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const fallback = showcaseData[lang as keyof typeof showcaseData] || showcaseData.en;
  const fr = lang === "fr";
  const de = lang === "de";
  const ar = lang === "ar";

  const defaultBrowserBarHost = "app.flowentra.io";
  const defaultScreenshotPrefix = fr
    ? "Capture"
    : de
    ? "Screenshot"
    : ar
    ? "لقطة"
    : "Screenshot";

  const cms = useCmsSection("productShowcase", lang, {
    label: fallback.label,
    title: fallback.title,
    items: fallback.items,
    browserBarHost: defaultBrowserBarHost,
    screenshotPrefix: defaultScreenshotPrefix,
  } as Record<string, any>) as Record<string, any>;

  const data = {
    label: cms.label || fallback.label,
    title: cms.title || fallback.title,
    items: fallback.items,
  };
  const browserBarHost = cms.browserBarHost || defaultBrowserBarHost;
  const screenshotPrefix = cms.screenshotPrefix || defaultScreenshotPrefix;

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-5 sm:px-4 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-24"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-semibold text-primary tracking-[0.2em] uppercase mb-3">{data.label}</p>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-extrabold tracking-tight leading-tight">{data.title}</h2>
        </motion.div>

        {/* Alternating rows */}
        <div className="space-y-20 sm:space-y-28 lg:space-y-36">
          {data.items.map((item: any, i: number) => {
            const Icon = icons[i % icons.length];
            const reversed = i % 2 !== 0;

            return (
              <motion.div
                key={i}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reversed ? "lg:direction-reverse" : ""}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
              >
                {/* Text side */}
                <div className={reversed ? "lg:order-2" : ""}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-4">
                    <Icon className="w-3.5 h-3.5" />
                    {item.tag}
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
                    {item.desc}
                  </p>
                </div>

                {/* Screenshot placeholder */}
                <div className={reversed ? "lg:order-1" : ""}>
                  <div className={`relative rounded-xl overflow-hidden border border-border shadow-lg bg-card lg:scale-[1.02] ${reversed ? "lg:origin-right" : "lg:origin-left"}`}>
                    {/* Browser chrome */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-border" />
                        <div className="w-2.5 h-2.5 rounded-full bg-border" />
                        <div className="w-2.5 h-2.5 rounded-full bg-border" />
                      </div>
                    </div>
                    {/* Screenshot area */}
                    {item.image ? (
                      <div
                        className="relative bg-card overflow-hidden cursor-zoom-in group/img"
                        onClick={() => setLightbox({ src: item.image, alt: item.title || item.tag || "" })}
                      >
                        <img
                          src={item.image}
                          alt={item.title || item.tag || ""}
                          loading="lazy"
                          className="block w-full h-auto transition-transform duration-300 group-hover/img:scale-[1.02]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 bg-black/20">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                            <ZoomIn className="w-5 h-5 text-foreground" />
                          </div>
                        </div>
                        <ImageEditOverlay sectionKey="productShowcase" label="screenshot" empty={false} />
                      </div>
                    ) : (
                      <div className="relative aspect-[16/10] bg-gradient-to-br from-muted/30 to-muted/60 flex items-center justify-center overflow-hidden">
                        <div className="text-center">
                          <Icon className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground/30">{screenshotPrefix} {item.tag}</p>
                        </div>
                        <ImageEditOverlay sectionKey="productShowcase" label="screenshot" empty />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Discover all features button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="flex justify-center mt-16 sm:mt-20"
        >
          <Link
            to="/features"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
          >
            {lang === "fr" ? "Découvrir toutes les fonctionnalités" : "Discover all features"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm cursor-zoom-out"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative max-w-6xl w-full rounded-xl overflow-hidden shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="block w-full h-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductShowcase;
