import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Eye, Sparkles, Code2, TrendingUp, Headphones, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const content = {
  en: {
    subtitle: "Beyond the platform, our team provides expert services to help you implement, customise and get the most out of Flowentra.",
    services: [
      {
        id: "process-consulting",
        icon: Eye,
        color: "text-violet-500",
        bg: "bg-violet-50 dark:bg-violet-950/40",
        title: "Process Consulting",
        subtitle: "Optimise how your business operates.",
        desc: "We analyse your workflows, identify inefficiencies and redesign your processes to align with your goals and Flowentra's capabilities.",
        features: [
          "Business process analysis and mapping",
          "Bottleneck identification and redesign",
          "Flowentra configuration recommendations",
          "Change management support",
        ],
      },
      {
        id: "customisation-project",
        icon: Sparkles,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-950/40",
        title: "Customisation & Project Management",
        subtitle: "Tailored implementation, delivered on time.",
        desc: "Our project team handles planning, configuration and delivery of your Flowentra implementation, on schedule and within scope.",
        features: [
          "Dedicated project manager",
          "Custom modules, workflows and forms",
          "Milestone-based delivery with clear timelines",
          "Post-launch monitoring and support",
        ],
      },
      {
        id: "custom-software",
        icon: Code2,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950/40",
        title: "Custom Software Development",
        subtitle: "Purpose-built solutions for specific needs.",
        desc: "When standard tools are not enough, we build secure and scalable custom software, from API integrations to fully bespoke applications.",
        features: [
          "Custom Flowentra module development",
          "Third-party API and system integrations",
          "Bespoke web and mobile applications",
          "Data migration and technical documentation",
        ],
      },
      {
        id: "web-digital",
        icon: TrendingUp,
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-950/40",
        title: "Web & Digital Solutions",
        subtitle: "Strengthen your digital presence.",
        desc: "We design and develop modern websites, portals and web applications that reflect your brand and integrate with your business systems.",
        features: [
          "Corporate websites and landing pages",
          "Customer portals and self-service apps",
          "SEO optimisation and performance",
          "Responsive design for all devices",
        ],
      },
      {
        id: "customer-support",
        icon: Headphones,
        color: "text-cyan-500",
        bg: "bg-cyan-50 dark:bg-cyan-950/40",
        title: "Customer Support",
        subtitle: "Reliable assistance whenever you need it.",
        desc: "Our support team helps your users resolve issues quickly and keeps the platform running smoothly every day.",
        features: [
          "Email support with guaranteed response times",
          "Optional phone support (Mon-Fri, 8am-6pm)",
          "Screen sharing and remote troubleshooting",
          "User training, remote or on-site",
        ],
      },
    ],
    ctaTitle: "Ready to work with our team?",
    ctaDesc: "Contact us to discuss your project and find out how our services can accelerate your success with Flowentra.",
    ctaBtn: "Contact Us",
  },
  fr: {
    subtitle: "Au-delà de la plateforme, notre équipe propose des services experts pour vous aider à implémenter, personnaliser et tirer le meilleur de Flowentra.",
    services: [
      {
        id: "process-consulting",
        icon: Eye,
        color: "text-violet-500",
        bg: "bg-violet-50 dark:bg-violet-950/40",
        title: "Conseil en Processus",
        subtitle: "Optimisez le fonctionnement de votre entreprise.",
        desc: "Nous analysons vos workflows, identifions les inefficacités et repensons vos processus pour les aligner sur vos objectifs et les capacités de Flowentra.",
        features: [
          "Analyse et cartographie des processus métiers",
          "Identification des goulots et axes d'amélioration",
          "Recommandations de configuration Flowentra",
          "Accompagnement au changement",
        ],
      },
      {
        id: "customisation-project",
        icon: Sparkles,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-950/40",
        title: "Personnalisation & Gestion de Projets",
        subtitle: "Implémentation sur mesure, livrée dans les délais.",
        desc: "Notre équipe assure la planification, la configuration et la livraison de votre implémentation Flowentra, dans les délais et le périmètre définis.",
        features: [
          "Chef de projet dédié",
          "Modules, workflows et formulaires personnalisés",
          "Livraison par jalons avec délais clairs",
          "Suivi post-lancement et support d'ajustement",
        ],
      },
      {
        id: "custom-software",
        icon: Code2,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950/40",
        title: "Développement de Logiciels sur Mesure",
        subtitle: "Des solutions conçues pour vos besoins spécifiques.",
        desc: "Lorsque les outils standards ne suffisent pas, nous développons des logiciels sécurisés et évolutifs, des intégrations API aux applications entièrement sur mesure.",
        features: [
          "Développement de modules Flowentra personnalisés",
          "Intégrations API et systèmes tiers",
          "Applications web et mobiles sur mesure",
          "Migration de données et documentation technique",
        ],
      },
      {
        id: "web-digital",
        icon: TrendingUp,
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-950/40",
        title: "Solutions Web & Digitales",
        subtitle: "Renforcez votre présence digitale.",
        desc: "Nous concevons des sites web, portails et applications modernes qui reflètent votre marque et s'intègrent à vos systèmes métier.",
        features: [
          "Sites corporate et landing pages",
          "Portails clients et apps en libre-service",
          "Optimisation SEO et performances",
          "Design responsive pour tous les appareils",
        ],
      },
      {
        id: "customer-support",
        icon: Headphones,
        color: "text-cyan-500",
        bg: "bg-cyan-50 dark:bg-cyan-950/40",
        title: "Support Client",
        subtitle: "Une assistance fiable quand vous en avez besoin.",
        desc: "Notre équipe aide vos utilisateurs à résoudre les problèmes rapidement et garantit le bon fonctionnement de la plateforme au quotidien.",
        features: [
          "Support email avec délais de réponse garantis",
          "Support téléphonique optionnel (Lun-Ven, 8h-18h)",
          "Partage d'écran et dépannage à distance",
          "Formation utilisateurs, à distance ou sur site",
        ],
      },
    ],
    ctaTitle: "Prêt à travailler avec notre équipe ?",
    ctaDesc: "Contactez-nous pour discuter de votre projet et découvrir comment nos services peuvent accélérer votre succès avec Flowentra.",
    ctaBtn: "Nous contacter",
  },
};

const Services = () => {
  const { lang } = useLanguage();
  const t = lang === "fr" ? content.fr : content.en;

  return (
    <PageLayout
      title={lang === "fr" ? "Nos Services" : "Our Services"}
      subtitle={t.subtitle}
    >
      <section className="py-12 lg:py-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-5xl">

          <div className="flex flex-col gap-4">
            {t.services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.id}
                  id={svc.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all grid md:grid-cols-3 items-stretch gap-0"
                >
                  {/* Icon + title */}
                  <div className={`flex items-center gap-3 p-5 md:border-r border-border bg-muted/20`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${svc.bg}`}>
                      <Icon className={`w-4 h-4 ${svc.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground leading-snug">{svc.title}</h3>
                      <p className={`text-xs font-semibold ${svc.color}`}>{svc.subtitle}</p>
                    </div>
                  </div>

                  {/* Description — smaller column */}
                  <p className="text-xs text-muted-foreground leading-relaxed px-4 py-5 md:border-r border-border">{svc.desc}</p>

                  {/* Features — bigger column */}
                  <ul className="flex flex-col gap-1.5 p-5">
                    {svc.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${svc.color}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
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
            className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center"
          >
            <h3 className="text-base font-bold text-foreground mb-2">{t.ctaTitle}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t.ctaDesc}</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
            >
              {t.ctaBtn}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Services;
