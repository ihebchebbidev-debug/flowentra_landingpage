import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Send, Paperclip, X, BookOpen, Mail, Loader2, CheckCircle } from "lucide-react";

const SUPPORT_EMAIL = "support@flowentra.io";

const CATEGORIES = {
  en: ["Support", "Sales", "Consultancy", "Others"],
  fr: ["Support", "Ventes", "Conseil", "Autres"],
};

const PRIORITIES = {
  en: ["Low", "Medium", "High", "Critical"],
  fr: ["Faible", "Moyenne", "Haute", "Critique"],
};

const Support = () => {
  const { lang } = useLanguage();
  const fr = lang === "fr";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const categories = fr ? CATEGORIES.fr : CATEGORIES.en;
  const priorities = fr ? PRIORITIES.fr : PRIORITIES.en;

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles((prev) => [...prev, ...Array.from(incoming)]);
  };

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category || !priority) return;
    setStatus("sending");

    try {
      const body = new FormData();
      body.append("to", SUPPORT_EMAIL);
      body.append("subject", `[${category} – ${priority}] ${title}`);
      body.append(
        "message",
        `Category: ${category}\nPriority: ${priority}\n\n${description}`
      );
      files.forEach((f) => body.append("attachments[]", f));

      const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://luccibyey.com.tn/flowentra/api";
      const res = await fetch(`${API_BASE}/email.php`, { method: "POST", body });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success !== false) {
        setStatus("sent");
        setTitle(""); setDescription(""); setCategory(""); setPriority(""); setFiles([]);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <PageLayout
      title="Support"
      subtitle={fr ? "Nous sommes là pour vous aider à réussir." : "We're here to help you succeed."}
    >
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">

          {/* Top cards */}
          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            <motion.a
              href="/documentation"
              className="p-7 rounded-xl border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <BookOpen className="w-7 h-7 text-primary mb-4" />
              <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                {fr ? "Centre d'Aide" : "Help Center"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {fr ? "Consultez nos guides et tutoriels détaillés." : "Browse our detailed guides and tutorials."}
              </p>
            </motion.a>

            <motion.div
              className="p-7 rounded-xl border border-border bg-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              <Mail className="w-7 h-7 text-primary mb-4" />
              <h3 className="font-bold mb-2">{fr ? "Email Support" : "Email Support"}</h3>
              <p className="text-sm text-muted-foreground">
                {fr
                  ? `Contactez notre équipe à `
                  : `Reach our team at `}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline underline-offset-2">
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </motion.div>
          </div>

          {/* Ticket form */}
          <motion.div
            className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-border bg-muted/30">
              <h2 className="text-xl font-bold">
                {fr ? "Créer un ticket de support" : "Create a Support Ticket"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {fr
                  ? "Décrivez votre problème et nous vous répondrons dans les plus brefs délais."
                  : "Describe your issue and we'll get back to you as soon as possible."}
              </p>
            </div>

            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-8">
                <CheckCircle className="w-14 h-14 text-green-500" />
                <h3 className="text-lg font-bold">
                  {fr ? "Ticket envoyé !" : "Ticket submitted!"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {fr
                    ? `Votre ticket a été envoyé à ${SUPPORT_EMAIL}. Nous reviendrons vers vous rapidement.`
                    : `Your ticket has been sent to ${SUPPORT_EMAIL}. We'll get back to you shortly.`}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  {fr ? "Nouveau ticket" : "New ticket"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Row: Category + Priority */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      {fr ? "Catégorie" : "Category"} <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">{fr ? "Sélectionner…" : "Select…"}</option>
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      {fr ? "Priorité" : "Priority"} <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">{fr ? "Sélectionner…" : "Select…"}</option>
                      {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    {fr ? "Titre du problème" : "Issue Title"} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder={fr ? "Résumez votre problème en une ligne…" : "Summarise your issue in one line…"}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    {fr ? "Description" : "Description"} <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                    placeholder={fr
                      ? "Décrivez le problème en détail, les étapes pour le reproduire, etc."
                      : "Describe the issue in detail, steps to reproduce, expected vs actual behaviour…"}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                {/* File attachment */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    {fr ? "Pièces jointes" : "Attachments"}
                  </label>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border hover:border-primary hover:bg-primary/5 text-sm text-muted-foreground hover:text-primary transition-all"
                  >
                    <Paperclip className="w-4 h-4" />
                    {fr ? "Joindre des fichiers" : "Attach files"}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Paperclip className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-xs">{f.name}</span>
                          <span className="text-xs text-muted-foreground/60">({(f.size / 1024).toFixed(0)} KB)</span>
                          <button type="button" onClick={() => removeFile(i)} className="ml-auto hover:text-destructive transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {status === "error" && (
                  <p className="text-sm text-destructive">
                    {fr
                      ? "Une erreur s'est produite. Veuillez réessayer ou écrire directement à "
                      : "Something went wrong. Please try again or email us directly at "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a>.
                  </p>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
                  >
                    {status === "sending" ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />{fr ? "Envoi…" : "Sending…"}</>
                    ) : (
                      <><Send className="w-4 h-4" />{fr ? "Envoyer le ticket" : "Submit Ticket"}</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Support;
