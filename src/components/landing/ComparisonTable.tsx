import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, Minus } from "lucide-react";
import logo from "@/assets/flowentra-logo.png";

type CellValue = boolean | string;

interface FeatureRow {
  label: string;
  isCategory?: boolean;
  values?: [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue];
}

const tableData = {
  fr: {
    title: "Comparaison des fonctionnalités",
    subtitle: "Toutes les fonctionnalités, plan par plan",
    featureLabel: "Fonctionnalité",
    crmGroup: "Flowentra CRM / Office",
    serviceGroup: "Flowentra Service",
    plans: ["Basic", "Professional", "Entreprise", "Basic", "Professional", "Entreprise"],
    rows: [
      { label: "GÉNÉRAL", isCategory: true },
      { label: "Utilisateurs / Techniciens", values: ["5 max", "Illimité", "Illimité", "5 max", "Illimité", "Illimité"] },

      { label: "CRM & CONTACTS", isCategory: true },
      { label: "Contacts, entreprises, fournisseurs", values: [true, true, true, false, false, false] },
      { label: "Champs fiscaux (CIN, Matricule Fiscale)", values: [true, true, true, false, false, false] },
      { label: "Importation en masse (Excel)", values: [true, true, true, false, false, false] },

      { label: "VENTES & FACTURATION", isCategory: true },
      { label: "Offres & Commandes", values: [true, true, true, false, false, false] },
      { label: "Facturation", values: [true, true, true, false, false, false] },
      { label: "Catalogue articles & services", values: [true, true, true, false, false, false] },
      { label: "Branding personnalisé sur documents", values: [false, true, true, false, false, false] },

      { label: "AGENDA & MOBILE", isCategory: true },
      { label: "Agenda partagé", values: [true, true, true, false, false, false] },
      { label: "Application mobile", values: [true, true, true, true, true, true] },
      { label: "Saisie des temps & dépenses", values: [true, true, true, true, true, true] },

      { label: "TABLEAUX DE BORD & RAPPORTS", isCategory: true },
      { label: "KPI & rapports de base", values: [true, true, true, false, false, false] },
      { label: "Constructeur de tableaux de bord", values: [false, true, true, false, false, false] },

      { label: "PROJETS & ACHATS", isCategory: true },
      { label: "Gestion des projets (tâches, jalons)", values: [false, true, true, false, false, false] },
      { label: "Achats & bons de commande (P2P)", values: [false, true, true, false, false, false] },

      { label: "STOCKS & INVENTAIRE", isCategory: true },
      { label: "Gestion des stocks", values: [false, true, true, false, true, true] },
      { label: "Mouvements d'inventaire", values: [false, true, true, false, true, true] },

      { label: "WORKFLOWS & AUTOMATISATION", isCategory: true },
      { label: "Constructeur de workflows visuels", values: [false, true, true, false, true, true] },
      { label: "Formulaires dynamiques (15+ champs)", values: [false, true, true, false, true, true] },
      { label: "Notifications clients automatiques", values: [false, true, true, false, true, true] },

      { label: "RH & PAIE", isCategory: true },
      { label: "Module RH (paie, CNSS, congés)", values: [false, false, true, false, false, true] },
      { label: "Suivi des présences", values: [false, false, true, false, false, true] },

      { label: "INTELLIGENCE ARTIFICIELLE", isCategory: true },
      { label: "Automatisation avancée avec IA", values: [false, false, true, false, false, true] },
      { label: "Optimisation des tournées (IA)", values: [false, false, false, false, false, true] },
      { label: "Planification automatique clients (IA)", values: [false, false, false, false, false, true] },

      { label: "SÉCURITÉ & MULTI-ENTITÉS", isCategory: true },
      { label: "Rôles & permissions (RBAC)", values: [false, false, true, false, false, true] },
      { label: "Multi-entreprises / multi-tenants", values: [false, false, true, false, false, true] },
      { label: "Single Sign-On (SSO)", values: [false, false, true, false, false, true] },
      { label: "Intégrations API externes", values: [false, false, true, false, false, true] },
      { label: "Audit logs complets", values: [false, false, true, false, false, true] },

      { label: "ORDRES DE SERVICE", isCategory: true },
      { label: "Ordres de service (cycle complet)", values: [false, false, false, true, true, true] },
      { label: "Checklists d'intervention", values: [false, false, false, true, true, true] },
      { label: "Étapes de checklist", values: [false, false, false, "30 max", "Illimitées", "Illimitées"] },
      { label: "Signature électronique", values: [false, false, false, true, true, true] },
      { label: "Rapports PDF & envoi par email", values: [false, false, false, true, true, true] },
      { label: "Suivi des équipements & installations", values: [false, false, false, true, true, true] },

      { label: "DISPATCH & PLANIFICATION", isCategory: true },
      { label: "Planification calendrier (drag & drop)", values: [false, false, false, true, true, true] },
      { label: "Dispatcheur (swimlane, drag & drop)", values: [false, false, false, false, true, true] },
      { label: "Vue carte (Google Maps)", values: [false, false, false, false, true, true] },
      { label: "Maintenance préventive", values: [false, false, false, false, true, true] },

      { label: "SUPPORT & ACCOMPAGNEMENT", isCategory: true },
      { label: "Tutoriels vidéo", values: [true, true, false, true, true, false] },
      { label: "Support par email", values: [true, true, true, true, true, true] },
      { label: "Conseil en processus", values: [false, true, true, false, true, true] },
      { label: "Support prioritaire 24/7", values: [false, false, true, false, false, true] },
      { label: "Gestionnaire de compte dédié", values: [false, false, true, false, false, true] },
    ] as FeatureRow[],
  },
  en: {
    title: "Feature Comparison",
    subtitle: "All features, plan by plan",
    featureLabel: "Feature",
    crmGroup: "Flowentra CRM / Office",
    serviceGroup: "Flowentra Service",
    plans: ["Basic", "Professional", "Enterprise", "Basic", "Professional", "Enterprise"],
    rows: [
      { label: "GENERAL", isCategory: true },
      { label: "Users / Technicians", values: ["5 max", "Unlimited", "Unlimited", "5 max", "Unlimited", "Unlimited"] },

      { label: "CRM & CONTACTS", isCategory: true },
      { label: "Contacts, companies, suppliers", values: [true, true, true, false, false, false] },
      { label: "Tunisian fiscal fields (CIN, Tax ID)", values: [true, true, true, false, false, false] },
      { label: "Bulk import (Excel)", values: [true, true, true, false, false, false] },

      { label: "SALES & INVOICING", isCategory: true },
      { label: "Quotes & Orders", values: [true, true, true, false, false, false] },
      { label: "Invoicing", values: [true, true, true, false, false, false] },
      { label: "Articles & Services catalog", values: [true, true, true, false, false, false] },
      { label: "Custom branding on documents", values: [false, true, true, false, false, false] },

      { label: "CALENDAR & MOBILE", isCategory: true },
      { label: "Shared calendar", values: [true, true, true, false, false, false] },
      { label: "Mobile app", values: [true, true, true, true, true, true] },
      { label: "Time & expense tracking", values: [true, true, true, true, true, true] },

      { label: "DASHBOARDS & REPORTS", isCategory: true },
      { label: "KPI & basic reports", values: [true, true, true, false, false, false] },
      { label: "Custom dashboard builder", values: [false, true, true, false, false, false] },

      { label: "PROJECTS & PURCHASING", isCategory: true },
      { label: "Project management (tasks, milestones)", values: [false, true, true, false, false, false] },
      { label: "Purchases & purchase orders (P2P)", values: [false, true, true, false, false, false] },

      { label: "STOCK & INVENTORY", isCategory: true },
      { label: "Stock management", values: [false, true, true, false, true, true] },
      { label: "Inventory movements", values: [false, true, true, false, true, true] },

      { label: "WORKFLOWS & AUTOMATION", isCategory: true },
      { label: "Visual workflow builder", values: [false, true, true, false, true, true] },
      { label: "Dynamic forms (15+ field types)", values: [false, true, true, false, true, true] },
      { label: "Automatic client notifications", values: [false, true, true, false, true, true] },

      { label: "HR & PAYROLL", isCategory: true },
      { label: "HR module (payroll, CNSS, leaves)", values: [false, false, true, false, false, true] },
      { label: "Attendance tracking", values: [false, false, true, false, false, true] },

      { label: "ARTIFICIAL INTELLIGENCE", isCategory: true },
      { label: "Advanced AI automation", values: [false, false, true, false, false, true] },
      { label: "AI route optimisation", values: [false, false, false, false, false, true] },
      { label: "AI automatic client scheduling", values: [false, false, false, false, false, true] },

      { label: "SECURITY & MULTI-ENTITY", isCategory: true },
      { label: "Custom roles & permissions (RBAC)", values: [false, false, true, false, false, true] },
      { label: "Multi-company / multi-tenant", values: [false, false, true, false, false, true] },
      { label: "Single Sign-On (SSO)", values: [false, false, true, false, false, true] },
      { label: "External API integrations", values: [false, false, true, false, false, true] },
      { label: "Full audit logs", values: [false, false, true, false, false, true] },

      { label: "SERVICE ORDERS", isCategory: true },
      { label: "Service orders (full lifecycle)", values: [false, false, false, true, true, true] },
      { label: "Intervention checklists", values: [false, false, false, true, true, true] },
      { label: "Checklist steps", values: [false, false, false, "30 max", "Unlimited", "Unlimited"] },
      { label: "Electronic signature", values: [false, false, false, true, true, true] },
      { label: "PDF reports & email sending", values: [false, false, false, true, true, true] },
      { label: "Equipment & installations tracking", values: [false, false, false, true, true, true] },

      { label: "DISPATCH & SCHEDULING", isCategory: true },
      { label: "Calendar drag & drop planning", values: [false, false, false, true, true, true] },
      { label: "Dispatcher (swimlane, drag & drop)", values: [false, false, false, false, true, true] },
      { label: "Map view (Google Maps)", values: [false, false, false, false, true, true] },
      { label: "Preventive maintenance planner", values: [false, false, false, false, true, true] },

      { label: "SUPPORT & ONBOARDING", isCategory: true },
      { label: "Video tutorials", values: [true, true, false, true, true, false] },
      { label: "Email support", values: [true, true, true, true, true, true] },
      { label: "Process consulting", values: [false, true, true, false, true, true] },
      { label: "Priority 24/7 support", values: [false, false, true, false, false, true] },
      { label: "Dedicated account manager", values: [false, false, true, false, false, true] },
    ] as FeatureRow[],
  },
};

const Cell = ({ value }: { value: CellValue }) => {
  if (value === false) {
    return (
      <td className="py-3 px-3 text-center">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted/60">
          <Minus className="w-3 h-3 text-muted-foreground/40" />
        </span>
      </td>
    );
  }
  if (value === true) {
    return (
      <td className="py-3 px-3 text-center">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/75/10">
          <Check className="w-3 h-3 text-primary" />
        </span>
      </td>
    );
  }
  return (
    <td className="py-3 px-3 text-center">
      <span className="text-xs font-semibold text-primary">{value}</span>
    </td>
  );
};

const ComparisonTable = () => {
  const { lang } = useLanguage();
  const t = tableData[lang as keyof typeof tableData] || tableData.en;

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-muted/20">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">{t.title}</h2>
          <p className="text-muted-foreground text-base sm:text-lg">{t.subtitle}</p>
        </motion.div>

        <motion.div
          className="overflow-x-auto rounded-2xl border border-border shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <table className="w-full text-sm border-collapse" style={{ minWidth: 820 }}>
            <thead>
              {/* Group header row */}
              <tr>
                <th className="py-4 px-4 bg-primary/75 rounded-tl-2xl">
                  <img src={logo} alt="Flowentra" className="h-8 object-contain brightness-0 invert" />
                </th>
                <th colSpan={3} className="py-4 px-4 text-center bg-primary/75 border-x border-white/10">
                  <span className="text-xs font-extrabold tracking-widest uppercase text-primary-foreground">{t.crmGroup}</span>
                </th>
                <th colSpan={3} className="py-4 px-4 text-center bg-primary/75 border-x border-white/10 rounded-tr-2xl">
                  <span className="text-xs font-extrabold tracking-widest uppercase text-primary-foreground">{t.serviceGroup}</span>
                </th>
              </tr>
              {/* Plan name row */}
              <tr className="border-b-2 border-border">
                <th className="py-3.5 px-4 text-left text-xs font-extrabold tracking-widest uppercase text-muted-foreground bg-muted/40 w-[30%]">
                  {t.featureLabel}
                </th>
                {t.plans.map((plan, i) => (
                  <th key={i} className={`py-3.5 px-3 text-center text-sm font-bold text-primary ${i === 1 || i === 4 ? "bg-primary/75/5" : "bg-muted/20"}`}>
                    {plan}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((row, ri) => {
                if (row.isCategory) {
                  return (
                    <tr key={ri} className="border-t-2 border-border bg-primary/75/10">
                      <td colSpan={7} className="py-3 px-4">
                        <span className="text-xs font-extrabold tracking-widest uppercase text-primary">{row.label}</span>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={ri} className={`border-t border-border/50 hover:bg-muted/30 transition-colors ${ri % 2 === 0 ? "bg-background" : "bg-muted/10"}`}>
                    <td className="py-3 px-4 text-sm text-foreground/80">{row.label}</td>
                    {(row.values || [false, false, false, false, false, false]).map((val, ci) => (
                      <Cell key={ci} value={val as CellValue} />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;
