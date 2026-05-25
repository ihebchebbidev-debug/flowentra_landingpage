import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Lightbulb, Sparkles, Shield, Heart } from "lucide-react";

const content = {
  en: {
    subtitle: "Flowentra was created to simplify business operations through one modern and intelligent platform.",
    missionTitle: "Our Mission",
    mission1: "Flowentra was created to simplify business operations through one modern and intelligent platform. We help companies centralize their workflows, automate repetitive tasks, and gain better visibility across their operations without the complexity of traditional enterprise software.",
    mission2: "Our goal is to make powerful business tools accessible, flexible, and easy to use for growing teams and modern organizations.",
    buildTitle: "What We Build",
    build1: "Flowentra combines operations management, field service coordination, smart documentation, analytics, automation, and configuration tools into a unified platform designed to scale with your business.",
    build2: "Built with flexibility in mind, Flowentra adapts to different industries and workflows while maintaining a clean and intuitive user experience.",
    valuesTitle: "Our Values",
    values: [
      { icon: Sparkles, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/40", title: "Innovation",       desc: "We continuously improve our platform with modern technologies and practical solutions that solve real business challenges." },
      { icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40",  title: "Simplicity",       desc: "Technology should make work easier, not more complicated. We design Flowentra to be intuitive from day one." },
      { icon: Shield,    color: "text-blue-500",  bg: "bg-blue-50 dark:bg-blue-950/40",    title: "Reliability",      desc: "Security, performance, and availability are at the core of everything we build." },
      { icon: Heart,     color: "text-rose-500",  bg: "bg-rose-50 dark:bg-rose-950/40",    title: "Customer Focus",   desc: "We grow with our clients by listening carefully, supporting their needs, and building long-term partnerships." },
    ],
    whyTitle: "Why Flowentra",
    why: "We believe businesses should not need multiple disconnected tools to manage their operations. Flowentra brings everything together into one scalable platform that helps teams work smarter, faster, and with greater clarity.",
    timelineTitle: "Growing with Ambition",
    timelineYear: "2026 — Founded",
    timelineDesc: "Startup-driven innovation focused on operational excellence and business automation.",
    timelineTag: "Building the future of modern business management.",
  },
  fr: {
    subtitle: "Flowentra a été créé pour simplifier les opérations d'entreprise grâce à une plateforme moderne et intelligente.",
    missionTitle: "Notre Mission",
    mission1: "Flowentra a été créé pour simplifier les opérations d'entreprise grâce à une plateforme moderne et intelligente. Nous aidons les entreprises à centraliser leurs workflows, automatiser les tâches répétitives et obtenir une meilleure visibilité sur leurs opérations sans la complexité des logiciels d'entreprise traditionnels.",
    mission2: "Notre objectif est de rendre des outils métier puissants accessibles, flexibles et faciles à utiliser pour les équipes en croissance et les organisations modernes.",
    buildTitle: "Ce que nous construisons",
    build1: "Flowentra combine gestion des opérations, coordination des services terrain, documentation intelligente, analytique, automatisation et outils de configuration dans une plateforme unifiée conçue pour évoluer avec votre entreprise.",
    build2: "Construit avec la flexibilité à l'esprit, Flowentra s'adapte aux différents secteurs et workflows tout en maintenant une expérience utilisateur claire et intuitive.",
    valuesTitle: "Nos Valeurs",
    values: [
      { icon: Sparkles,  color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/40", title: "Innovation",        desc: "Nous améliorons continuellement notre plateforme avec des technologies modernes et des solutions pratiques qui résolvent de vrais défis métier." },
      { icon: Lightbulb, color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-950/40",   title: "Simplicité",        desc: "La technologie doit faciliter le travail, pas le compliquer. Nous concevons Flowentra pour être intuitif dès le premier jour." },
      { icon: Shield,    color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/40",     title: "Fiabilité",         desc: "La sécurité, la performance et la disponibilité sont au cœur de tout ce que nous construisons." },
      { icon: Heart,     color: "text-rose-500",   bg: "bg-rose-50 dark:bg-rose-950/40",     title: "Centré Client",     desc: "Nous grandissons avec nos clients en écoutant attentivement, en soutenant leurs besoins et en construisant des partenariats durables." },
    ],
    whyTitle: "Pourquoi Flowentra",
    why: "Nous croyons que les entreprises ne devraient pas avoir besoin de plusieurs outils déconnectés pour gérer leurs opérations. Flowentra réunit tout en une seule plateforme évolutive qui aide les équipes à travailler de manière plus intelligente, plus rapide et avec plus de clarté.",
    timelineTitle: "Grandir avec Ambition",
    timelineYear: "2026 — Fondée",
    timelineDesc: "Innovation portée par une startup axée sur l'excellence opérationnelle et l'automatisation des entreprises.",
    timelineTag: "Construire le futur de la gestion d'entreprise moderne.",
  },
};

const About = () => {
  const { lang } = useLanguage();
  const t = lang === "fr" ? content.fr : content.en;

  return (
    <PageLayout
      title={lang === "fr" ? "À propos de Flowentra" : "About Flowentra"}
      subtitle={t.subtitle}
    >
      {/* Mission + What We Build */}
      <section className="py-12 lg:py-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
          >
            <h2 className="text-base font-bold text-foreground mb-4">{t.missionTitle}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.mission1}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.mission2}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-base font-bold text-foreground mb-4">{t.buildTitle}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.build1}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.build2}</p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 px-4 lg:px-8 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-base font-bold text-foreground mb-8">{t.valuesTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${v.bg}`}>
                    <Icon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Flowentra + Timeline */}
      <section className="py-12 lg:py-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-8">

          {/* Why */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="text-base font-bold text-foreground mb-4">{t.whyTitle}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.why}</p>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm flex flex-col justify-between gap-6"
          >
            <div>
              <h2 className="text-base font-bold text-foreground mb-5">{t.timelineTitle}</h2>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-foreground">{t.timelineYear}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{t.timelineDesc}</p>
                </div>
              </div>
            </div>
            <p className="text-xs font-semibold text-primary border-t border-primary/15 pt-4">
              {t.timelineTag}
            </p>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
};

export default About;
