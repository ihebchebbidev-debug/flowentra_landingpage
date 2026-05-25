import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus, Trash2, Save, Receipt, CreditCard, X,
  FileText, Download, DollarSign, TrendingUp, Loader2, Star, GripVertical,
} from "lucide-react";
import { adminContent } from "@/services/adminApi";

// ==================== TYPES ====================

// Schema MUST match what src/components/landing/Pricing.tsx consumes.
interface CmsPlan {
  name: string;
  pricePerUser: number;
  tagline: string;
  popular?: boolean;
  toolsTitle: string;
  tools: string[];
  extraLabel?: string;
  serviceTitle: string;
  services: string[];
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  plan: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issuedDate: string;
  dueDate: string;
  items: { description: string; qty: number; unitPrice: number }[];
}

// ==================== HELPERS ====================

const INVOICES_KEY = "flowentra_invoices";
const LANGS = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
] as const;

function loadInvoices(): Invoice[] {
  try {
    const stored = localStorage.getItem(INVOICES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveInvoices(invoices: Invoice[]) {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function generateInvoiceNumber() {
  const now = new Date();
  const yr = now.getFullYear();
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${yr}-${seq}`;
}

function getDefaultPlans(lang: string): CmsPlan[] {
  if (lang === "en") {
    return [
      { name: "Basic", pricePerUser: 29, tagline: "For small businesses that want to grow.", toolsTitle: "TOOLS TO GROW", tools: ["Limited to 5 users", "Checklists with 30 steps per order", "Mobile app", "Reports"], serviceTitle: "OUR SERVICE", services: ["Account setup", "Email support"] },
      { name: "Professional", pricePerUser: 39, popular: true, tagline: "For businesses that want to work efficiently and digitally.", toolsTitle: "SOFTWARE FOR VISIONARIES", tools: ["Maintenance planner", "Custom branding", "Automatic client notifications"], extraLabel: "BASIC PLUS:", serviceTitle: "OUR SERVICE", services: ["Account setup", "Process consulting", "Email support"] },
      { name: "Enterprise", pricePerUser: 55, tagline: "For businesses at the cutting edge of technology.", toolsTitle: "TECHNOLOGY FOR LEADERS", tools: ["AI scheduling & route optimization", "Single Sign-on"], extraLabel: "PROFESSIONAL PLUS:", serviceTitle: "OUR SERVICE", services: ["Account setup", "Process consulting", "Premium support"] },
    ];
  }
  return [
    { name: "Basic", pricePerUser: 29, tagline: "Pour les petites entreprises qui veulent se développer.", toolsTitle: "OUTILS DE CROISSANCE", tools: ["Limité à 5 utilisateurs", "Checklists avec 30 étapes par ordre", "Application mobile", "Rapports"], serviceTitle: "NOTRE SERVICE", services: ["Configuration du compte", "Support par email"] },
    { name: "Professional", pricePerUser: 39, popular: true, tagline: "Pour les entreprises qui veulent travailler efficacement et digitalement.", toolsTitle: "LOGICIEL POUR VISIONNAIRES", tools: ["Planificateur de maintenance", "Branding personnalisé", "Notification client automatique"], extraLabel: "BASIC PLUS :", serviceTitle: "NOTRE SERVICE", services: ["Configuration du compte", "Conseil en processus", "Support par email"] },
    { name: "Entreprise", pricePerUser: 55, tagline: "Pour les entreprises à la pointe de la technologie.", toolsTitle: "TECHNOLOGIE POUR LEADERS", tools: ["Planification & optimisation IA", "Single Sign-on"], extraLabel: "PROFESSIONAL PLUS :", serviceTitle: "NOTRE SERVICE", services: ["Configuration du compte", "Conseil en processus", "Support premium"] },
  ];
}

// ==================== COMPONENT ====================

type Tab = "plans" | "invoices";

const PricingManager = () => {
  const [tab, setTab] = useState<Tab>("plans");
  const [lang, setLang] = useState<string>("fr");
  const [plans, setPlans] = useState<CmsPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [invoices, setInvoices] = useState<Invoice[]>(loadInvoices());
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  // ---- Load plans from CMS for selected language ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setDirty(false);
      try {
        const sectionContent = await adminContent.getSectionContent("pricing", lang);
        const raw = sectionContent?.plans?.value;
        let parsed: CmsPlan[] | null = null;
        if (raw) {
          try {
            const p = JSON.parse(raw);
            if (Array.isArray(p)) parsed = p;
          } catch {
            // fall through
          }
        }
        if (!cancelled) {
          setPlans(parsed && parsed.length ? parsed : getDefaultPlans(lang));
        }
      } catch {
        if (!cancelled) setPlans(getDefaultPlans(lang));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [lang]);

  const updatePlan = (i: number, updates: Partial<CmsPlan>) => {
    setPlans(prev => prev.map((p, idx) => idx === i ? { ...p, ...updates } : p));
    setDirty(true);
  };

  const addPlan = () => {
    setPlans(prev => [...prev, {
      name: "New Plan",
      pricePerUser: 0,
      tagline: "",
      toolsTitle: lang === "fr" ? "FONCTIONNALITÉS" : "FEATURES",
      tools: [],
      serviceTitle: lang === "fr" ? "NOTRE SERVICE" : "OUR SERVICE",
      services: [],
    }]);
    setDirty(true);
  };

  const removePlan = (i: number) => {
    setPlans(prev => prev.filter((_, idx) => idx !== i));
    setDirty(true);
  };

  const movePlan = (i: number, dir: -1 | 1) => {
    setPlans(prev => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setDirty(true);
  };

  const togglePopular = (i: number) => {
    setPlans(prev => prev.map((p, idx) => ({ ...p, popular: idx === i ? !p.popular : false })));
    setDirty(true);
  };

  const savePlans = async () => {
    setSaving(true);
    try {
      await adminContent.saveContent("pricing", "plans", lang, JSON.stringify(plans), "json");
      // Notify other tabs (live public preview) to refresh
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const ch = new BroadcastChannel("cms_updates");
          ch.postMessage({ type: "cms_saved", section: "pricing" });
          ch.close();
        }
        localStorage.setItem("cms_updated_at", String(Date.now()));
      } catch { /* ignore */ }
      toast.success(`Plans saved (${lang.toUpperCase()})`, {
        description: "Live on the /pricing page.",
      });
      setDirty(false);
    } catch (e: any) {
      toast.error("Save failed", { description: e?.message || "Try again" });
    } finally {
      setSaving(false);
    }
  };

  // ---- Invoices ----

  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    clientName: "",
    clientEmail: "",
    plan: "",
    currency: "TND",
    status: "draft",
    items: [{ description: "", qty: 1, unitPrice: 0 }],
  });

  const createInvoice = () => {
    const items = (newInvoice.items || []).filter(i => i.description.trim());
    const amount = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    const invoice: Invoice = {
      id: generateId(),
      invoiceNumber: generateInvoiceNumber(),
      clientName: newInvoice.clientName || "Client",
      clientEmail: newInvoice.clientEmail || "",
      plan: newInvoice.plan || "Custom",
      amount,
      currency: newInvoice.currency || "TND",
      status: "draft",
      issuedDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      items,
    };
    const updated = [invoice, ...invoices];
    setInvoices(updated);
    saveInvoices(updated);
    setShowNewInvoice(false);
    setNewInvoice({ clientName: "", clientEmail: "", plan: "", currency: "TND", status: "draft", items: [{ description: "", qty: 1, unitPrice: 0 }] });
    toast.success(`Invoice ${invoice.invoiceNumber} created`);
  };

  const updateInvoiceStatus = (id: string, status: Invoice["status"]) => {
    const updated = invoices.map(i => i.id === id ? { ...i, status } : i);
    setInvoices(updated);
    saveInvoices(updated);
  };

  const deleteInvoice = (id: string) => {
    const updated = invoices.filter(i => i.id !== id);
    setInvoices(updated);
    saveInvoices(updated);
    toast.success("Invoice deleted");
  };

  const exportInvoice = (inv: Invoice) => {
    const lines = [
      `INVOICE: ${inv.invoiceNumber}`,
      `Date: ${inv.issuedDate}  |  Due: ${inv.dueDate}`,
      `Client: ${inv.clientName} (${inv.clientEmail})`,
      `Plan: ${inv.plan}`,
      "",
      "Items:",
      ...inv.items.map(i => `  - ${i.description}: ${i.qty} × ${i.unitPrice} ${inv.currency} = ${i.qty * i.unitPrice} ${inv.currency}`),
      "",
      `Total: ${inv.amount} ${inv.currency}`,
      `Status: ${inv.status.toUpperCase()}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inv.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    sent: "bg-blue-500/10 text-blue-600",
    paid: "bg-green-500/10 text-green-600",
    overdue: "bg-destructive/10 text-destructive",
    cancelled: "bg-muted text-muted-foreground line-through",
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Plans ({lang.toUpperCase()})</p>
              <p className="text-xl font-bold">{plans.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Paid Revenue</p>
              <p className="text-xl font-bold">{totalRevenue.toLocaleString()} TND</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Pending</p>
              <p className="text-xl font-bold">{pendingAmount.toLocaleString()} TND</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1 mb-6 w-fit">
        {[
          { key: "plans" as Tab, label: "Pricing Plans", icon: CreditCard },
          { key: "invoices" as Tab, label: "Invoices", icon: Receipt },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all ${
              tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ==================== PLANS TAB ==================== */}
      {tab === "plans" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                {LANGS.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      if (dirty && !confirm("You have unsaved changes. Switch language and discard them?")) return;
                      setLang(l.code);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      lang === l.code ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Edits go live on <code className="px-1 py-0.5 rounded bg-muted">/pricing</code> for the selected language.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={addPlan}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted/50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Plan
              </button>
              <button
                onClick={savePlans}
                disabled={!dirty || saving || loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading plans…
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan, i) => (
                <div
                  key={i}
                  className={`bg-card border rounded-xl p-5 transition-all ${
                    plan.popular ? "border-primary/40 shadow-sm ring-1 ring-primary/10" : "border-border"
                  }`}
                >
                  {/* Row header */}
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => movePlan(i, -1)}
                          disabled={i === 0}
                          className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30"
                          title="Move up"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={e => updatePlan(i, { name: e.target.value })}
                        className="text-lg font-bold bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1"
                      />
                      {plan.popular && (
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePopular(i)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          plan.popular ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        title="Mark as popular (only one)"
                      >
                        <Star className={`w-4 h-4 ${plan.popular ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={() => movePlan(i, 1)}
                        disabled={i === plans.length - 1}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removePlan(i)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price + tagline */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">
                        Price (per user / month)
                      </label>
                      <input
                        type="number"
                        value={plan.pricePerUser}
                        onChange={e => updatePlan(i, { pricePerUser: +e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">Tagline</label>
                      <input
                        type="text"
                        value={plan.tagline}
                        onChange={e => updatePlan(i, { tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase block">
                        Tools section title
                      </label>
                      <input
                        type="text"
                        value={plan.toolsTitle}
                        onChange={e => updatePlan(i, { toolsTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase block mt-2">
                        Extra label (optional, e.g. "BASIC PLUS:")
                      </label>
                      <input
                        type="text"
                        value={plan.extraLabel || ""}
                        onChange={e => updatePlan(i, { extraLabel: e.target.value })}
                        placeholder="(leave empty for first plan)"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase block mt-2">
                        Tools / features (one per line)
                      </label>
                      <textarea
                        value={plan.tools.join("\n")}
                        onChange={e => updatePlan(i, { tools: e.target.value.split("\n") })}
                        rows={6}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                        placeholder={"Mobile app\nReports\n…"}
                      />
                    </div>

                    {/* Services */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase block">
                        Service section title
                      </label>
                      <input
                        type="text"
                        value={plan.serviceTitle}
                        onChange={e => updatePlan(i, { serviceTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase block mt-2">
                        Services (one per line)
                      </label>
                      <textarea
                        value={plan.services.join("\n")}
                        onChange={e => updatePlan(i, { services: e.target.value.split("\n") })}
                        rows={6}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                        placeholder={"Account setup\nEmail support\n…"}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {plans.length === 0 && (
                <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
                  <CreditCard className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-sm font-medium">No plans yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Click "Add Plan" to create one.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== INVOICES TAB ==================== */}
      {tab === "invoices" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""} total</p>
            <button onClick={() => setShowNewInvoice(!showNewInvoice)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              {showNewInvoice ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showNewInvoice ? "Cancel" : "New Invoice"}
            </button>
          </div>

          {showNewInvoice && (
            <div className="bg-card border border-primary/20 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Create Invoice</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">Client Name</label>
                  <input type="text" value={newInvoice.clientName} onChange={e => setNewInvoice(p => ({ ...p, clientName: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">Client Email</label>
                  <input type="email" value={newInvoice.clientEmail} onChange={e => setNewInvoice(p => ({ ...p, clientEmail: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="email@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">Plan</label>
                  <select value={newInvoice.plan} onChange={e => setNewInvoice(p => ({ ...p, plan: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Custom</option>
                    {plans.map((p, idx) => <option key={idx} value={p.name}>{p.name} {p.pricePerUser} TND</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">Currency</label>
                  <input type="text" value={newInvoice.currency} onChange={e => setNewInvoice(p => ({ ...p, currency: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-2 block">Line Items</label>
                {(newInvoice.items || []).map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 mb-2">
                    <input type="text" value={item.description} onChange={e => {
                      const items = [...(newInvoice.items || [])];
                      items[idx] = { ...items[idx], description: e.target.value };
                      setNewInvoice(p => ({ ...p, items }));
                    }} placeholder="Description" className="col-span-6 px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <input type="number" value={item.qty} onChange={e => {
                      const items = [...(newInvoice.items || [])];
                      items[idx] = { ...items[idx], qty: +e.target.value };
                      setNewInvoice(p => ({ ...p, items }));
                    }} placeholder="Qty" className="col-span-2 px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <input type="number" value={item.unitPrice} onChange={e => {
                      const items = [...(newInvoice.items || [])];
                      items[idx] = { ...items[idx], unitPrice: +e.target.value };
                      setNewInvoice(p => ({ ...p, items }));
                    }} placeholder="Price" className="col-span-3 px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <button onClick={() => {
                      const items = (newInvoice.items || []).filter((_, i) => i !== idx);
                      setNewInvoice(p => ({ ...p, items }));
                    }} className="col-span-1 flex items-center justify-center text-muted-foreground hover:text-destructive">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button onClick={() => setNewInvoice(p => ({ ...p, items: [...(p.items || []), { description: "", qty: 1, unitPrice: 0 }] }))} className="text-xs text-primary hover:underline">
                  + Add line item
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <p className="text-sm font-bold">
                  Total: {(newInvoice.items || []).reduce((s, i) => s + i.qty * i.unitPrice, 0).toLocaleString()} {newInvoice.currency}
                </p>
                <button onClick={createInvoice} disabled={!newInvoice.clientName?.trim()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40">
                  <Save className="w-4 h-4" /> Create Invoice
                </button>
              </div>
            </div>
          )}

          {invoices.length === 0 && !showNewInvoice && (
            <div className="text-center py-16 text-muted-foreground">
              <Receipt className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm font-medium">No invoices yet</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Create your first invoice to get started</p>
            </div>
          )}

          {invoices.map(inv => (
            <div key={inv.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold font-mono">{inv.invoiceNumber}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[inv.status]}`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{inv.clientName} • {inv.clientEmail}</p>
                </div>
                <div className="flex items-center gap-1">
                  <select value={inv.status} onChange={e => updateInvoiceStatus(inv.id, e.target.value as Invoice["status"])} className="text-[10px] px-2 py-1 rounded border border-border bg-background focus:outline-none">
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={() => exportInvoice(inv)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Download">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteInvoice(inv.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <span>Plan: <span className="font-medium text-foreground">{inv.plan}</span></span>
                <span>Amount: <span className="font-bold text-foreground">{inv.amount.toLocaleString()} {inv.currency}</span></span>
                <span>Issued: {inv.issuedDate}</span>
                <span>Due: {inv.dueDate}</span>
                <span>{inv.items.length} item{inv.items.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PricingManager;
