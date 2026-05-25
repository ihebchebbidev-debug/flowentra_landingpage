import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, BookOpen, Headphones, Megaphone, Settings2, Zap, CheckCircle2, Send } from "lucide-react";
import { useState } from "react";

const content = {
  en: {
    subtitle: "Join the Flowentra Partner Program and grow your business by offering a modern, powerful platform to your clients.",
    benefitsTitle: "Why Partner with Flowentra?",
    benefits: [
      { icon: Banknote,    color: "text-green-500",  bg: "bg-green-50 dark:bg-green-950/40",  title: "Recurring Revenue",         desc: "Earn attractive commissions on every client you refer or support. Build a stable, long-term revenue stream with Flowentra." },
      { icon: BookOpen,    color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/40",    title: "Training & Certification",  desc: "Access our full partner certification program, product training, and resources to position yourself as a trusted Flowentra expert." },
      { icon: Headphones,  color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/40",title: "Dedicated Partner Support", desc: "Work with a dedicated partner manager who supports you at every stage of the sales cycle and client relationship." },
      { icon: Megaphone,   color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-950/40",  title: "Co-Marketing Opportunities",desc: "Benefit from joint marketing initiatives, co-branded materials, and visibility within the Flowentra partner ecosystem." },
      { icon: Settings2,   color: "text-cyan-500",   bg: "bg-cyan-50 dark:bg-cyan-950/40",    title: "Early Product Access",      desc: "Be the first to discover new features and provide feedback that shapes the future of the platform." },
      { icon: Zap,         color: "text-rose-500",   bg: "bg-rose-50 dark:bg-rose-950/40",    title: "Fast Onboarding",           desc: "A structured and efficient onboarding process to get you and your team fully operational in no time." },
    ],
    whoTitle: "Who Can Partner with Us?",
    who: [
      "IT consultants and digital transformation agencies",
      "ERP, CRM, and software resellers",
      "Business process consultants",
      "Accounting and operations advisory firms",
      "Industry-specific solution providers",
      "Technology integrators and developers",
    ],
    togetherTitle: "Let's Build Together",
    togetherText: "Whether you are an independent consultant, a growing agency, or an established software reseller, Flowentra offers a partnership model that works for your business. We grow when our partners grow.",
    formTitle: "Apply to Become a Partner",
    formDesc: "Fill in the form below and our team will get back to you within 48 hours.",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Work Email",
    company: "Company",
    phone: "Phone Number",
    partnerType: "Partner Type",
    partnerTypes: ["Reseller", "Consultant / Integrator", "Technology Partner", "Other"],
    message: "Tell us about your business and why you'd like to partner with Flowentra",
    submit: "Submit Application",
    successTitle: "Application Received!",
    successText: "Thank you for your interest in the Flowentra Partner Program. Our team will review your application and contact you within 48 hours.",
  },
  fr: {
    subtitle: "Rejoignez le Programme Partenaires Flowentra et développez votre activité en proposant une plateforme moderne et puissante à vos clients.",
    benefitsTitle: "Pourquoi devenir partenaire Flowentra ?",
    benefits: [
      { icon: Banknote,    color: "text-green-500",  bg: "bg-green-50 dark:bg-green-950/40",  title: "Revenus Récurrents",              desc: "Gagnez des commissions attractives sur chaque client que vous référez ou accompagnez. Construisez un flux de revenus stable et durable avec Flowentra." },
      { icon: BookOpen,    color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/40",    title: "Formation & Certification",       desc: "Accédez à notre programme de certification partenaire complet, à la formation produit et aux ressources pour vous positionner comme expert Flowentra de confiance." },
      { icon: Headphones,  color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/40",title: "Support Partenaire Dédié",        desc: "Travaillez avec un partner manager dédié qui vous accompagne à chaque étape du cycle de vente et de la relation client." },
      { icon: Megaphone,   color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-950/40",  title: "Opportunités Co-Marketing",       desc: "Bénéficiez d'initiatives marketing conjointes, de supports co-brandés et d'une visibilité au sein de l'écosystème partenaires Flowentra." },
      { icon: Settings2,   color: "text-cyan-500",   bg: "bg-cyan-50 dark:bg-cyan-950/40",    title: "Accès Anticipé aux Produits",     desc: "Soyez le premier à découvrir les nouvelles fonctionnalités et à fournir des retours qui façonnent l'avenir de la plateforme." },
      { icon: Zap,         color: "text-rose-500",   bg: "bg-rose-50 dark:bg-rose-950/40",    title: "Onboarding Rapide",               desc: "Un processus d'onboarding structuré et efficace pour vous et votre équipe, opérationnels en un minimum de temps." },
    ],
    whoTitle: "Qui peut devenir partenaire ?",
    who: [
      "Consultants IT et agences de transformation digitale",
      "Revendeurs ERP, CRM et logiciels",
      "Consultants en processus métier",
      "Cabinets de conseil en comptabilité et opérations",
      "Fournisseurs de solutions spécifiques à l'industrie",
      "Intégrateurs technologiques et développeurs",
    ],
    togetherTitle: "Construisons ensemble",
    togetherText: "Que vous soyez consultant indépendant, agence en croissance ou revendeur de logiciels établi, Flowentra propose un modèle de partenariat adapté à votre activité. Nous grandissons quand nos partenaires grandissent.",
    formTitle: "Candidatez pour devenir partenaire",
    formDesc: "Remplissez le formulaire ci-dessous et notre équipe vous recontactera sous 48 heures.",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email professionnel",
    company: "Entreprise",
    phone: "Numéro de téléphone",
    partnerType: "Type de partenariat",
    partnerTypes: ["Revendeur", "Consultant / Intégrateur", "Partenaire Technologique", "Autre"],
    message: "Parlez-nous de votre activité et de la raison pour laquelle vous souhaitez devenir partenaire Flowentra",
    submit: "Soumettre ma candidature",
    successTitle: "Candidature reçue !",
    successText: "Merci pour votre intérêt pour le Programme Partenaires Flowentra. Notre équipe examinera votre candidature et vous contactera sous 48 heures.",
  },
};

const Partners = () => {
  const { lang } = useLanguage();
  const t = lang === "fr" ? content.fr : content.en;

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", company: "", phone: "", partnerType: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageLayout
      title={lang === "fr" ? "Programme Partenaires" : "Partner Program"}
      subtitle={t.subtitle}
    >
      {/* Main content: Left = Benefits + Together | Right = Who + Form */}
      <section className="py-12 lg:py-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[1fr_420px] gap-10 items-start">

          {/* Left column */}
          <div className="flex flex-col gap-8">
            {/* Let's Build Together */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4 }}
              className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm"
            >
              <h2 className="text-base font-bold text-foreground mb-3">{t.togetherTitle}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.togetherText}</p>
            </motion.div>

            {/* Benefits */}
            <div>
              <h2 className="text-base font-bold text-foreground mb-6">{t.benefitsTitle}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {t.benefits.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${b.bg}`}>
                        <Icon className={`w-5 h-5 ${b.color}`} />
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-2">{b.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right column: Who + Form */}
          <div className="flex flex-col gap-6">
            {/* Who Can Partner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="text-base font-bold text-foreground mb-5">{t.whoTitle}</h2>
              <ul className="space-y-3">
                {t.who.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Partner Application Form */}
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="rounded-2xl border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800 p-8 text-center flex flex-col items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{t.successTitle}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.successText}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <h2 className="text-base font-bold text-foreground mb-1">{t.formTitle}</h2>
                  <p className="text-sm text-muted-foreground mb-5">{t.formDesc}</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{t.firstName} <span className="text-rose-500">*</span></label>
                        <input
                          required
                          value={form.firstName}
                          onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{t.lastName} <span className="text-rose-500">*</span></label>
                        <input
                          required
                          value={form.lastName}
                          onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">{t.email} <span className="text-rose-500">*</span></label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">{t.company}</label>
                      <input
                        value={form.company}
                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">{t.phone}</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">{t.partnerType} <span className="text-rose-500">*</span></label>
                      <select
                        required
                        value={form.partnerType}
                        onChange={e => setForm(f => ({ ...f, partnerType: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      >
                        <option value="" disabled />
                        {t.partnerTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">{t.message}</label>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
                    >
                      <Send className="w-4 h-4" />
                      {t.submit}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Partners;
