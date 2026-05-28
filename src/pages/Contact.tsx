import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Globe, Send, Loader2, CheckCircle } from "lucide-react";

const CONTACT_EMAIL = "contact@flowentra.io";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://luccibyey.com.tn/flowentra/api";

const Contact = () => {
  const { lang } = useLanguage();
  const fr = lang === "fr";

  const categories = fr
    ? ["Ventes", "Conseil", "Support", "Autres"]
    : ["Sales", "Consultancy", "Support", "Others"];

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", company: "", category: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const body = new FormData();
      body.append("to", CONTACT_EMAIL);
      body.append("subject", `[${form.category || "Contact"}] ${form.firstName} ${form.lastName} – ${form.company || "—"}`);
      body.append(
        "message",
        `Name: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nPhone: ${form.phone || "—"}\nCompany: ${form.company || "—"}\nCategory: ${form.category || "—"}\n\n${form.message}`
      );
      const res = await fetch(`${API_BASE}/email.php`, { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        // Also persist to admin inbox (fire-and-forget)
        fetch(`${API_BASE}/inbox.php?action=save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mailbox: "contact",
            sender_name: `${form.firstName} ${form.lastName}`.trim(),
            sender_email: form.email,
            sender_phone: form.phone,
            company: form.company,
            category: form.category,
            subject: `[${form.category || "Contact"}] ${form.firstName} ${form.lastName}`,
            message: form.message,
          }),
        }).catch(() => {});
        setStatus("sent");
        setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", category: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: fr ? "Email" : "Email",
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: Phone,
      label: fr ? "Téléphone" : "Phone",
      value: "+216 29 452 650",
      href: "tel:+21629452650",
    },
    {
      icon: MapPin,
      label: fr ? "Siège Social" : "Headquarters",
      value: fr ? "Centre, Nabeul, Tunisie" : "Center, Nabeul, Tunisia",
    },
    {
      icon: Clock,
      label: fr ? "Horaires" : "Business Hours",
      value: fr ? "Lun – Ven, 9h – 18h (CET)" : "Mon – Fri, 9AM – 6PM (CET)",
    },
    {
      icon: Globe,
      label: "Website",
      value: "flowentra.io",
      href: "https://flowentra.io",
    },
  ];

  return (
    <PageLayout
      title={fr ? "Parlons de votre projet" : "Let's Talk About Your Project"}
      subtitle={
        fr
          ? "Notre équipe est disponible pour répondre à vos questions et vous accompagner dans votre transformation digitale."
          : "Our team is ready to answer your questions and guide you through your digital transformation."
      }
    >
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 max-w-6xl mx-auto">

            {/* ── Form ── */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-border bg-muted/30">
                  <h2 className="text-lg font-bold">
                    {fr ? "Envoyer un message" : "Send us a message"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {fr
                      ? "Nous vous répondrons dans les 24h ouvrées."
                      : "We'll get back to you within 1 business day."}
                  </p>
                </div>

                {status === "sent" ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-8">
                    <CheckCircle className="w-14 h-14 text-green-500" />
                    <h3 className="text-lg font-bold">
                      {fr ? "Message envoyé !" : "Message sent!"}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      {fr
                        ? "Merci de nous avoir contactés. Nous reviendrons vers vous très rapidement."
                        : "Thanks for reaching out. We'll get back to you shortly."}
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      {fr ? "Nouveau message" : "New message"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block">
                          {fr ? "Prénom" : "First Name"} <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block">
                          {fr ? "Nom" : "Last Name"}
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block">
                          Email <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block">
                          {fr ? "Téléphone" : "Phone"}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+216 XX XXX XXX"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block">
                          {fr ? "Entreprise" : "Company"}
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block">
                          {fr ? "Catégorie" : "Category"} <span className="text-destructive">*</span>
                        </label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                          <option value="">{fr ? "Sélectionner…" : "Select…"}</option>
                          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-1.5 block">
                        Message <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        required
                        placeholder={
                          fr
                            ? "Décrivez votre projet, vos besoins ou vos questions…"
                            : "Tell us about your project, needs or questions…"
                        }
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-sm text-destructive">
                        {fr
                          ? "Une erreur s'est produite. Écrivez-nous directement à "
                          : "Something went wrong. Email us directly at "}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>.
                      </p>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity shadow-lg shadow-primary/20"
                      >
                        {status === "sending" ? (
                          <><Loader2 className="w-4 h-4 animate-spin" />{fr ? "Envoi…" : "Sending…"}</>
                        ) : (
                          <><Send className="w-4 h-4" />{fr ? "Envoyer le message" : "Send Message"}</>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

            {/* ── Contact details + map ── */}
            <motion.div
              className="lg:col-span-2 flex flex-col gap-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {/* Info cards */}
              <div className="space-y-4">
                {contactInfo.map((item, i) => {
                  const Icon = item.icon;
                  const inner = (
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                  return item.href ? (
                    <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {inner}
                    </a>
                  ) : (
                    <div key={i}>{inner}</div>
                  );
                })}
              </div>

              {/* Embedded map Nabeul Center */}
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm aspect-[4/3]">
                <iframe
                  title={fr ? "Localisation de Flowentra" : "Flowentra Location"}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=10.7176%2C36.4461%2C10.7576%2C36.4661&layer=mapnik&marker=36.4561%2C10.7376"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <a
                href="https://www.openstreetmap.org/?mlat=36.4561&mlon=10.7376#map=15/36.4561/10.7376"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline text-center -mt-4"
              >
                {fr ? "Voir sur une carte plus grande →" : "View on a larger map →"}
              </a>
            </motion.div>

          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
