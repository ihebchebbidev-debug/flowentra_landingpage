import { useState } from "react";
import { Copy, Languages, ChevronRight } from "lucide-react";
import FlagIcon from "@/components/FlagIcon";

interface Lang {
  code: string;
  label: string;
}

type CopyMode = "empty" | "overwrite";

interface Props {
  allLanguages: Lang[];
  currentLang: string;
  onLangChange?: (code: string) => void;
  copy: (source: string, target: string | "__all__", mode: CopyMode) => void;
}

const CopyLanguageBar = ({ allLanguages, currentLang, onLangChange, copy }: Props) => {
  const [source, setSource] = useState<string>(currentLang);
  const [target, setTarget] = useState<string>("__all__");
  const [mode, setMode] = useState<CopyMode>("empty");

  if (allLanguages.length < 2) return null;

  const sourceLabel = allLanguages.find(l => l.code === source)?.label ?? source;

  return (
    <div className="bg-card rounded-xl border border-border p-3 mb-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground font-semibold mr-1">
          <Languages className="w-3.5 h-3.5" />
          Copy content
        </div>

        {/* Source */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">From</span>
          <div className="relative inline-flex items-center">
            <FlagIcon country={source} className="w-4 h-3 absolute left-2 pointer-events-none" />
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="pl-8 pr-2 py-1.5 rounded-md border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Source language"
            >
              {allLanguages.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />

        {/* Target */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">To</span>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="px-2 py-1.5 rounded-md border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Target language"
          >
            <option value="__all__">All other languages</option>
            {allLanguages.filter(l => l.code !== source).map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Mode */}
        <div className="flex items-center gap-1 ml-1 rounded-md border border-border p-0.5 bg-background">
          <button
            type="button"
            onClick={() => setMode("empty")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              mode === "empty"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Only fill fields that are currently empty in the target language"
          >
            Fill empty
          </button>
          <button
            type="button"
            onClick={() => setMode("overwrite")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              mode === "overwrite"
                ? "bg-destructive text-destructive-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Overwrite existing content in the target language"
          >
            Overwrite all
          </button>
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={() => copy(source, target, mode)}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy from {sourceLabel}
        </button>

        {/* Quick switch to source language */}
        {onLangChange && source !== currentLang && (
          <button
            type="button"
            onClick={() => onLangChange(source)}
            className="text-[11px] text-primary hover:underline"
          >
            View {sourceLabel}
          </button>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground/60 mt-2 leading-relaxed">
        Copies all translatable text/JSON fields. Images are already shared across languages. Changes are staged — click <span className="font-semibold">Save All Languages</span> to persist.
      </p>
    </div>
  );
};

export default CopyLanguageBar;
