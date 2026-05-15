// =============================================================================
// Template Gallery — searchable, previewable section variant browser.
// Lets admins find a section variant across all section types, see its
// multilingual content rendered for EN/FR/DE/AR, and add it in one click.
// =============================================================================
import { useMemo, useState } from "react";
import { Search, X, Sparkles, Plus, Loader2, Check } from "lucide-react";
import { SECTION_VARIANTS, type SectionVariant } from "@/components/admin/pageTemplates";
import { PAGE_SECTION_REGISTRY } from "@/components/landing/sectionRegistry";
import FlagIcon from "@/components/FlagIcon";
import TemplateThumbnail from "@/components/admin/TemplateThumbnail";

type AdminLang = "en" | "fr";
const LANGS: Array<{ code: AdminLang; label: string }> = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

type Entry = {
  sectionType: string;
  sectionLabel: string;
  variant: SectionVariant;
};

interface Props {
  onPick: (sectionType: string, variantId: string) => Promise<void> | void;
  onClose: () => void;
}

const TemplateGallery = ({ onPick, onClose }: Props) => {
  const [query, setQuery] = useState("");
  const [previewLang, setPreviewLang] = useState<AdminLang>("en");
  const [selected, setSelected] = useState<Entry | null>(null);
  const [adding, setAdding] = useState(false);

  // Build a flat list of all variants across all section types.
  const allEntries = useMemo<Entry[]>(() => {
    const out: Entry[] = [];
    for (const def of PAGE_SECTION_REGISTRY) {
      const variants = SECTION_VARIANTS[def.type] || [];
      for (const v of variants) {
        out.push({ sectionType: def.type, sectionLabel: def.label, variant: v });
      }
    }
    return out;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allEntries;
    return allEntries.filter((e) => {
      if (e.sectionLabel.toLowerCase().includes(q)) return true;
      if (e.sectionType.toLowerCase().includes(q)) return true;
      if (e.variant.label.toLowerCase().includes(q)) return true;
      if ((e.variant.description || "").toLowerCase().includes(q)) return true;
      // Search inside content values across all languages.
      for (const langMap of Object.values(e.variant.content)) {
        for (const v of Object.values(langMap)) {
          if (v && v.toLowerCase().includes(q)) return true;
        }
      }
      return false;
    });
  }, [allEntries, query]);

  // Auto-select first result when query changes if current selection vanishes.
  const effectiveSelected =
    selected && filtered.some((e) => e.sectionType === selected.sectionType && e.variant.id === selected.variant.id)
      ? selected
      : filtered[0] || null;

  const handleAdd = async () => {
    if (!effectiveSelected) return;
    setAdding(true);
    try {
      await onPick(effectiveSelected.sectionType, effectiveSelected.variant.id);
      onClose();
    } finally {
      setAdding(false);
    }
  };

  const previewFields = effectiveSelected
    ? Object.entries(effectiveSelected.variant.content).map(([key, langMap]) => ({
        key,
        value: langMap[previewLang] || langMap.en || "",
        hasTranslation: Boolean(langMap[previewLang]),
      }))
    : [];

  const totalLangs = effectiveSelected
    ? LANGS.filter((l) =>
        Object.values(effectiveSelected.variant.content).some((m) => Boolean(m[l.code]))
      ).length
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-bold text-foreground">Template Gallery</h3>
              <p className="text-xs text-muted-foreground">
                {allEntries.length} section variants — search, preview, and add in one click.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by section, variant name, description, or content (any language)…"
              className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {filtered.length} match{filtered.length === 1 ? "" : "es"}
          </p>
        </div>

        {/* Body — list + preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[320px_1fr] min-h-0">
          {/* Variant list */}
          <div className="border-r border-border overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No variants match "{query}".
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((e) => {
                  const isActive =
                    effectiveSelected?.sectionType === e.sectionType &&
                    effectiveSelected?.variant.id === e.variant.id;
                  return (
                    <li key={`${e.sectionType}-${e.variant.id}`}>
                      <button
                        onClick={() => setSelected(e)}
                        className={`w-full text-left px-4 py-3 transition-colors ${
                          isActive ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-accent border-l-2 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-12 rounded-md overflow-hidden border border-border bg-background shrink-0">
                            <TemplateThumbnail
                              variant={{ sectionType: e.sectionType, variant: e.variant }}
                              className="w-full h-full"
                              ariaLabel={`${e.sectionLabel} ${e.variant.label} preview`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
                                {e.sectionLabel}
                              </span>
                              {isActive && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                            </div>
                            <div className="font-semibold text-sm text-foreground truncate">{e.variant.label}</div>
                            {e.variant.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {e.variant.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Preview pane */}
          <div className="overflow-y-auto bg-muted/20">
            {!effectiveSelected ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground p-8">
                Select a variant to preview its content.
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div className="rounded-lg overflow-hidden border border-border bg-background">
                  <TemplateThumbnail
                    variant={{ sectionType: effectiveSelected.sectionType, variant: effectiveSelected.variant }}
                    className="w-full h-32"
                    ariaLabel={`${effectiveSelected.sectionLabel} ${effectiveSelected.variant.label} preview`}
                  />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                    {effectiveSelected.sectionLabel} variant
                  </div>
                  <h4 className="text-xl font-bold text-foreground mt-0.5">
                    {effectiveSelected.variant.label}
                  </h4>
                  {effectiveSelected.variant.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {effectiveSelected.variant.description}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    {previewFields.length} field{previewFields.length === 1 ? "" : "s"} · translated to {totalLangs} of {LANGS.length} languages
                  </div>
                </div>

                {/* Language toggle */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {LANGS.map((l) => {
                    const has = Object.values(effectiveSelected.variant.content).some((m) => Boolean(m[l.code]));
                    const active = previewLang === l.code;
                    return (
                      <button
                        key={l.code}
                        onClick={() => setPreviewLang(l.code)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : has
                            ? "bg-background text-foreground border-border hover:border-primary/50"
                            : "bg-muted text-muted-foreground border-border opacity-60"
                        }`}
                      >
                        <FlagIcon country={l.code} className="w-3.5 h-3.5" />
                        {l.label}
                        {!has && <span className="text-[10px] opacity-70">(fallback)</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Field preview */}
                <div className="space-y-3" dir="ltr">
                  {previewFields.map((f) => (
                    <div key={f.key} className="rounded-lg border border-border bg-card p-3">
                      <div className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-2" dir="ltr">
                        <span>{f.key}</span>
                        {!f.hasTranslation && (
                          <span className="text-amber-600 dark:text-amber-400 normal-case font-sans">
                            · using English fallback
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-foreground whitespace-pre-wrap break-words">
                        {f.value || <span className="italic text-muted-foreground">(empty)</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-4 border-t border-border shrink-0 bg-card">
          <div className="text-xs text-muted-foreground">
            {effectiveSelected
              ? <>Will be appended to the end of this page's sections.</>
              : "Pick a variant to continue."}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-border hover:bg-accent text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!effectiveSelected || adding}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Add to page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
