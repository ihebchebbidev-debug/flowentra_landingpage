import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/SEO";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Calendar as CalendarIcon, Clock, User, Mail,
  Building2, Phone, Rocket, ArrowRight, Sparkles, Users, Globe,
  Shield, ChevronRight,
} from "lucide-react";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

const TEAM_SIZES = [
  { value: "1-5",    label: "1–5" },
  { value: "6-20",   label: "6–20" },
  { value: "21-50",  label: "21–50" },
  { value: "51-200", label: "51–200" },
  { value: "200+",   label: "200+" },
];

const tr = {
  en: {
    seo: "Free Trial & DemoFlowentra",
    heroLabel: "Start todayno credit card required",
    heroTitle: "Try Flowentra free or book a live demo",
    heroSub: "Discover how Flowentra unifies your field operations, CRM, invoicing and analyticsin one platform built for service companies.",
    pill1: "No credit card required",
    pill2: "14-day free trial",
    pill3: "Onboarding included",

    demoTitle: "Book a personalised demo",
    demoSub: "Choose a date and time slot. Our sales team will walk you through the platform and answer all your questions. A confirmation email will be sent by the Flowentra team.",
    pickDate: "Pick a date",
    pickTime: "Available time slots",
    yourDetails: "Your details",
    firstName: "First name",
    lastName: "Last name",
    email: "Work email",
    company: "Company name",
    phone: "Phone number",
    message: "What would you like to see? (optional)",
    bookBtn: "Confirm my booking",
    demoConfirmTitle: "Booking confirmed!",
    demoConfirmSub: "A confirmation with your appointment details will be sent to your email address by the Flowentra team. We look forward to meeting you!",

    trialTitle: "Start your 14-day free trial",
    trialSub: "Create your account in seconds. No credit card needed. The Flowentra team will send your login credentials and onboarding guide by email.",
    trialTeam: "Team size",
    trialBtn: "Create my free account",
    trialConfirmTitle: "Welcome to Flowentra!",
    trialConfirmSub: "Your trial account is being set up. The Flowentra team will email you your login details and onboarding guide within a few minutes.",

    required: "Please fill in all required fields.",
    selectDate: "Please select a date.",
    selectTime: "Please select a time slot.",
  },
  fr: {
    seo: "Essai gratuit & DémoFlowentra",
    heroLabel: "Commencez dès aujourd'huisans carte de crédit",
    heroTitle: "Essayez Flowentra gratuitement ou réservez une démo",
    heroSub: "Découvrez comment Flowentra unifie vos opérations terrain, CRM, facturation et analytiqueen une seule plateforme conçue pour les entreprises de services.",
    pill1: "Sans carte de crédit",
    pill2: "14 jours d'essai gratuit",
    pill3: "Onboarding inclus",

    demoTitle: "Réserver une démo personnalisée",
    demoSub: "Choisissez une date et un créneau horaire. Notre équipe commerciale vous présentera la plateforme en direct et répondra à toutes vos questions. Une confirmation vous sera envoyée par email.",
    pickDate: "Choisir une date",
    pickTime: "Créneaux disponibles",
    yourDetails: "Vos coordonnées",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email professionnel",
    company: "Nom de l'entreprise",
    phone: "Numéro de téléphone",
    message: "Que souhaitez-vous voir ? (optionnel)",
    bookBtn: "Confirmer ma réservation",
    demoConfirmTitle: "Réservation confirmée !",
    demoConfirmSub: "Une confirmation avec les détails de votre rendez-vous vous sera envoyée à votre adresse email par l'équipe Flowentra. Nous avons hâte de vous rencontrer !",

    trialTitle: "Démarrer votre essai gratuit de 14 jours",
    trialSub: "Créez votre compte en quelques secondes. Aucune carte de crédit requise. L'équipe Flowentra vous enverra vos identifiants et votre guide d'onboarding par email.",
    trialTeam: "Taille de l'équipe",
    trialBtn: "Créer mon compte gratuit",
    trialConfirmTitle: "Bienvenue sur Flowentra !",
    trialConfirmSub: "Votre compte d'essai est en cours de création. L'équipe Flowentra vous enverra vos identifiants et votre guide d'onboarding par email dans quelques minutes.",

    required: "Veuillez remplir tous les champs requis.",
    selectDate: "Veuillez sélectionner une date.",
    selectTime: "Veuillez sélectionner un créneau.",
  },
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition";

const SuccessCard = ({ title, sub }: { title: string; sub: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center text-center gap-4 py-16 px-6"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
      className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
    >
      <CheckCircle2 className="w-9 h-9 text-green-500" />
    </motion.div>
    <h3 className="text-xl font-bold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{sub}</p>
  </motion.div>
);

// ── Demo booking ─────────────────────────────────────────────────────────────
const DemoSection = ({ t }: { t: typeof tr.en }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<string>("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", company: "", phone: "", message: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return setError(t.selectDate);
    if (!slot) return setError(t.selectTime);
    if (!form.firstName || !form.lastName || !form.email || !form.company) return setError(t.required);
    setError("");
    setDone(true);
  };

  return (
    <motion.div
      id="demo"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
    >
      <div className="px-6 pt-6 pb-5 border-b border-border flex items-center gap-3 bg-muted/30">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <CalendarIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">{t.demoTitle}</h2>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">{t.demoSub}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <SuccessCard key="done" title={t.demoConfirmTitle} sub={t.demoConfirmSub} />
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="p-6 flex flex-col gap-6"
          >
            {/* Left: calendar + slots | Right: contact form */}
            <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
              {/* Left column: calendar then time slots below */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.pickDate}</p>
                  <div className="rounded-xl border border-border bg-background w-fit">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < today || d.getDay() === 0 || d.getDay() === 6}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.pickTime}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlot(s)}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          slot === s
                            ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "bg-background border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: contact details */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.yourDetails}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t.firstName}>
                    <input className={inputCls} placeholder="Jean" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                  </Field>
                  <Field label={t.lastName}>
                    <input className={inputCls} placeholder="Dupont" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                  </Field>
                </div>
                <Field label={t.email}>
                  <input className={inputCls} type="email" placeholder="jean@entreprise.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </Field>
                <Field label={t.company}>
                  <input className={inputCls} placeholder="Mon Entreprise" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                </Field>
                <Field label={t.phone}>
                  <input className={inputCls} type="tel" placeholder="+33 6 00 00 00 00" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </Field>
                <Field label={t.message}>
                  <textarea className={`${inputCls} resize-none`} rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                </Field>
              </div>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <CalendarIcon className="w-4 h-4" />
              {t.bookBtn}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Free trial ───────────────────────────────────────────────────────────────
const TrialSection = ({ t }: { t: typeof tr.en }) => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", company: "", phone: "", teamSize: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.company) return setError(t.required);
    setError("");
    setDone(true);
  };

  return (
    <motion.div
      id="trial"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
    >
      <div className="px-6 pt-6 pb-5 border-b border-border flex items-center gap-3 bg-muted/30">
        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
          <Rocket className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">{t.trialTitle}</h2>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">{t.trialSub}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <SuccessCard key="done" title={t.trialConfirmTitle} sub={t.trialConfirmSub} />
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="p-6 flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.firstName}>
                <input className={inputCls} placeholder="Jean" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
              </Field>
              <Field label={t.lastName}>
                <input className={inputCls} placeholder="Dupont" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
              </Field>
            </div>
            <Field label={t.email}>
              <input className={inputCls} type="email" placeholder="jean@entreprise.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </Field>
            <Field label={t.company}>
              <input className={inputCls} placeholder="Mon Entreprise" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </Field>
            <Field label={t.phone}>
              <input className={inputCls} type="tel" placeholder="+33 6 00 00 00 00" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </Field>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t.trialTeam}</p>
              <div className="flex flex-wrap gap-2">
                {TEAM_SIZES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, teamSize: s.value }))}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      form.teamSize === s.value
                        ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-200"
                        : "bg-background border-border text-foreground hover:border-green-500/40 hover:bg-green-50 dark:hover:bg-green-900/10"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-5 flex-wrap pt-1">
              {[
                { icon: Shield, text: "SSL secured" },
                { icon: Globe, text: "GDPR compliant" },
                { icon: Users, text: "500+ companies" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="w-3.5 h-3.5 text-primary" /> {text}
                </span>
              ))}
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200 dark:shadow-green-900/30"
            >
              <Rocket className="w-4 h-4" />
              {t.trialBtn}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────
const Demo = () => {
  const { lang } = useLanguage();
  const t = lang === "fr" ? tr.fr : tr.en;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Same ambient background as Pricing/Index */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[15%] -left-40 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute top-[60%] -right-40 w-[700px] h-[700px] rounded-full bg-accent/8 blur-[160px]" />
      </div>

      <SEO title={t.seo} description={t.heroSub} noindex={false} />
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-14 px-4 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-5"
            >
              <span className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                {t.heroLabel}
              </span>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">{t.heroSub}</p>
              <div className="flex flex-wrap gap-2">
                {[t.pill1, t.pill2, t.pill3].map((p) => (
                  <span
                    key={p}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs text-primary font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    {p}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/20"
                >
                  <CalendarIcon className="w-4 h-4" />
                  {lang === "fr" ? "Réserver une démo" : "Book a demo"}
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="#trial"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm transition-all hover:bg-muted"
                >
                  <Rocket className="w-4 h-4 text-green-600" />
                  {lang === "fr" ? "Essai gratuit" : "Free trial"}
                </a>
              </div>
            </motion.div>

            {/* Rightdashboard screenshot */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/10">
                <img
                  src="/screenshots/showcase-dashbord.png"
                  alt="Flowentra dashboard"
                  className="w-full h-auto block"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-4 -left-4 bg-green-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {lang === "fr" ? "14 jours gratuits" : "14 days free"}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Forms ── */}
      <section className="py-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-5xl flex flex-col gap-8">
          <DemoSection t={t} />
          <TrialSection t={t} />
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="pb-16 px-4 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center shadow-sm"
          >
            {[
              { icon: Clock,   label: lang === "fr" ? "Réponse en 24h" : "Response in 24h" },
              { icon: Shield,  label: lang === "fr" ? "Données sécurisées" : "Secure data" },
              { icon: Users,   label: lang === "fr" ? "Support dédié" : "Dedicated support" },
              { icon: Globe,   label: lang === "fr" ? "Conforme RGPD" : "GDPR compliant" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Demo;
