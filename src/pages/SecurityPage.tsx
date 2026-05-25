import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ShieldCheck, KeyRound, Globe, CloudDownload, ScrollText, BadgeCheck, CheckCircle2, Shield } from "lucide-react";

const content = {
  en: {
    subtitle: "Protecting your data is a core part of Flowentra. We build our platform with modern security standards to ensure your information remains safe, private, and always accessible.",
    sectionTitle: "Enterprise-Grade Protection",
    features: [
      { icon: ShieldCheck,    color: "text-indigo-500",  bg: "bg-indigo-50 dark:bg-indigo-950/40",  title: "End-to-End Encryption",    desc: "All data is encrypted both in transit and at rest using industry-standard security protocols." },
      { icon: KeyRound,       color: "text-violet-500",  bg: "bg-violet-50 dark:bg-violet-950/40",  title: "Secure Authentication",     desc: "Role-based access controls and multi-factor authentication help protect user accounts and sensitive operations." },
      { icon: Globe,          color: "text-cyan-500",    bg: "bg-cyan-50 dark:bg-cyan-950/40",      title: "Infrastructure Security",   desc: "Flowentra is hosted on secure cloud infrastructure with continuous monitoring, firewall protection, and restricted access policies." },
      { icon: CloudDownload,  color: "text-green-500",   bg: "bg-green-50 dark:bg-green-950/40",    title: "Automatic Backups",         desc: "Regular encrypted backups ensure business continuity and fast recovery when needed." },
      { icon: ScrollText,     color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-950/40",    title: "Activity & Audit Logs",     desc: "Critical actions and system events are logged to provide transparency, traceability, and operational control." },
      { icon: BadgeCheck,     color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-950/40",      title: "Privacy & Compliance",      desc: "We follow modern data protection practices aligned with GDPR principles and privacy-by-design standards." },
    ],
    approachTitle: "Our Security Approach",
    approachItems: [
      "Secure cloud hosting",
      "SSL/TLS encrypted connections",
      "Access control & permissions",
      "Continuous monitoring",
      "Data redundancy & backups",
      "Secure API architecture",
    ],
    trustTitle: "Trust & Reliability",
    trustText: "As a growing platform, Flowentra continuously improves its security practices, infrastructure, and operational processes to provide a reliable and secure experience for every customer.",
  },
  fr: {
    subtitle: "La protection de vos données est au cœur de Flowentra. Nous construisons notre plateforme selon les normes de sécurité modernes pour garantir que vos informations restent sûres, privées et toujours accessibles.",
    sectionTitle: "Protection de niveau entreprise",
    features: [
      { icon: ShieldCheck,    color: "text-indigo-500",  bg: "bg-indigo-50 dark:bg-indigo-950/40",  title: "Chiffrement de bout en bout",    desc: "Toutes les données sont chiffrées en transit et au repos grâce à des protocoles de sécurité standard du secteur." },
      { icon: KeyRound,       color: "text-violet-500",  bg: "bg-violet-50 dark:bg-violet-950/40",  title: "Authentification sécurisée",     desc: "Les contrôles d'accès basés sur les rôles et l'authentification multi-facteurs protègent les comptes utilisateurs et les opérations sensibles." },
      { icon: Globe,          color: "text-cyan-500",    bg: "bg-cyan-50 dark:bg-cyan-950/40",      title: "Sécurité de l'infrastructure",   desc: "Flowentra est hébergé sur une infrastructure cloud sécurisée avec surveillance continue, protection pare-feu et politiques d'accès restreint." },
      { icon: CloudDownload,  color: "text-green-500",   bg: "bg-green-50 dark:bg-green-950/40",    title: "Sauvegardes automatiques",       desc: "Des sauvegardes chiffrées régulières assurent la continuité des activités et une récupération rapide en cas de besoin." },
      { icon: ScrollText,     color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-950/40",    title: "Journaux d'activité et d'audit", desc: "Les actions critiques et les événements système sont enregistrés pour assurer transparence, traçabilité et contrôle opérationnel." },
      { icon: BadgeCheck,     color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-950/40",      title: "Confidentialité & Conformité",   desc: "Nous appliquons des pratiques modernes de protection des données alignées sur les principes du RGPD et les standards privacy-by-design." },
    ],
    approachTitle: "Notre approche sécurité",
    approachItems: [
      "Hébergement cloud sécurisé",
      "Connexions chiffrées SSL/TLS",
      "Contrôle d'accès & permissions",
      "Surveillance continue",
      "Redondance des données & sauvegardes",
      "Architecture API sécurisée",
    ],
    trustTitle: "Confiance & Fiabilité",
    trustText: "En tant que plateforme en croissance, Flowentra améliore continuellement ses pratiques de sécurité, son infrastructure et ses processus opérationnels pour offrir une expérience fiable et sécurisée à chaque client.",
  },
};

const SecurityPage = () => {
  const { lang } = useLanguage();
  const t = lang === "fr" ? content.fr : content.en;

  return (
    <PageLayout
      title={lang === "fr" ? "Sécurité" : "Security"}
      subtitle={t.subtitle}
    >
      {/* Feature cards */}
      <section className="py-12 lg:py-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-lg font-bold text-foreground mb-8">{t.sectionTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.bg}`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Approach + Trust */}
      <section className="pb-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-6">

          {/* Our Security Approach */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="text-base font-bold text-foreground mb-5">{t.approachTitle}</h2>
            <ul className="space-y-3">
              {t.approachItems.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Trust & Reliability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-bold text-foreground mb-3">{t.trustTitle}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.trustText}</p>
            </div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
};

export default SecurityPage;
