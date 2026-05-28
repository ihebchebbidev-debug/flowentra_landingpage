import { useState, useEffect, useCallback } from "react";
import { adminErrors, type ErrorLogEntry, type ErrorSummaryEntry } from "@/services/adminApi";
import {
  AlertTriangle, Bug, RefreshCw, Trash2, CheckCircle2,
  ChevronDown, ChevronRight, X, Globe, Server, Wifi,
  Code2, AlertCircle, Info, Loader2, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  javascript: { label: "JavaScript",  icon: Code2,          color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-950/40" },
  api:        { label: "API",         icon: Globe,          color: "text-blue-600 dark:text-blue-400",     bg: "bg-blue-100 dark:bg-blue-950/40"     },
  php:        { label: "PHP / Server",icon: Server,         color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-950/40" },
  network:    { label: "Network",     icon: Wifi,           color: "text-cyan-600 dark:text-cyan-400",     bg: "bg-cyan-100 dark:bg-cyan-950/40"     },
};

const SEV_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  error:   { label: "Error",   icon: AlertCircle,   color: "text-destructive" },
  warning: { label: "Warning", icon: AlertTriangle, color: "text-yellow-600 dark:text-yellow-400" },
  info:    { label: "Info",    icon: Info,          color: "text-blue-500" },
};

const TYPE_FILTERS = [
  { key: "", label: "All types" },
  { key: "javascript", label: "JavaScript" },
  { key: "api",        label: "API" },
  { key: "php",        label: "PHP / Server" },
  { key: "network",    label: "Network" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function unresolvedByType(summary: ErrorSummaryEntry[], type: string) {
  return summary.filter(s => s.type === type).reduce((a, s) => a + Number(s.unresolved), 0);
}

const ErrorsViewer = () => {
  const [entries, setEntries]       = useState<ErrorLogEntry[]>([]);
  const [summary, setSummary]       = useState<ErrorSummaryEntry[]>([]);
  const [unresolvedTotal, setUnresolvedTotal] = useState(0);
  const [total, setTotal]           = useState(0);
  const [pages, setPages]           = useState(1);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const [expanded, setExpanded]     = useState<number | null>(null);
  const [resolving, setResolving]   = useState<number | null>(null);
  const [deleting, setDeleting]     = useState<number | null>(null);
  const [clearing, setClearing]     = useState(false);

  const load = useCallback(async (
    type = typeFilter, resolved = showResolved, p = page
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminErrors.list({
        type: type || undefined,
        resolved: resolved ? undefined : "0",
        page: p,
        limit: 50,
      });
      setEntries(res.data ?? []);
      setSummary(res.summary ?? []);
      setUnresolvedTotal(res.unresolved_total ?? 0);
      setTotal(res.pagination?.total ?? 0);
      setPages(res.pagination?.pages ?? 1);
    } catch (err: any) {
      setError(err?.message || "Failed to load error logs");
    } finally {
      setLoading(false);
    }
  }, [typeFilter, showResolved, page]);

  useEffect(() => { load(); }, []);

  const switchType = (t: string) => {
    setTypeFilter(t); setPage(1); setExpanded(null);
    load(t, showResolved, 1);
  };

  const toggleResolved = () => {
    const next = !showResolved;
    setShowResolved(next); setPage(1);
    load(typeFilter, next, 1);
  };

  const handleResolve = async (entry: ErrorLogEntry, resolved: boolean) => {
    setResolving(entry.id);
    try {
      await adminErrors.resolve([entry.id], resolved);
      setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, is_resolved: resolved ? 1 : 0 } : e));
      setUnresolvedTotal(prev => resolved ? Math.max(0, prev - 1) : prev + 1);
      setSummary(prev => prev.map(s =>
        s.type === entry.type && s.severity === entry.severity
          ? { ...s, unresolved: Math.max(0, Number(s.unresolved) + (resolved ? -1 : 1)) }
          : s
      ));
    } catch { toast.error("Failed to update"); }
    finally { setResolving(null); }
  };

  const handleDelete = async (entry: ErrorLogEntry) => {
    if (!confirm("Delete this error log entry?")) return;
    setDeleting(entry.id);
    try {
      await adminErrors.delete(entry.id);
      setEntries(prev => prev.filter(e => e.id !== entry.id));
      setTotal(prev => prev - 1);
      if (expanded === entry.id) setExpanded(null);
      toast.success("Entry deleted");
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(null); }
  };

  const handleClearResolved = async () => {
    if (!confirm("Permanently delete all resolved entries?")) return;
    setClearing(true);
    try {
      await adminErrors.clearResolved();
      toast.success("Resolved entries cleared");
      load();
    } catch { toast.error("Clear failed"); }
    finally { setClearing(false); }
  };

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-destructive/5 to-transparent flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Bug className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Error Logs
                {unresolvedTotal > 0 && (
                  <span className="text-[11px] font-bold bg-destructive text-destructive-foreground rounded-full px-2 py-0.5">
                    {unresolvedTotal} unresolved
                  </span>
                )}
              </h2>
              <p className="text-xs text-muted-foreground">JavaScript errors, API failures and PHP server errors</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleResolved}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                showResolved
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Show resolved
            </button>
            <button
              onClick={handleClearResolved}
              disabled={clearing}
              className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {clearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Clear resolved
            </button>
            <button
              onClick={() => load()}
              disabled={loading}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Type filter tabs */}
        <div className="flex border-b border-border overflow-x-auto">
          {TYPE_FILTERS.map(f => {
            const unresolved = f.key ? unresolvedByType(summary, f.key) : unresolvedTotal;
            const meta = f.key ? TYPE_META[f.key] : null;
            const Icon = meta?.icon;
            return (
              <button
                key={f.key}
                onClick={() => switchType(f.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  typeFilter === f.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {f.label}
                {unresolved > 0 && (
                  <span className="text-[10px] font-bold bg-destructive/10 text-destructive rounded-full px-1.5 py-0.5">
                    {unresolved}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Error state */}
        {error && (
          <div className="m-6 flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">Could not load error logs</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">{error}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Make sure <code className="bg-muted px-1 rounded">errors.php</code> is deployed to your server.
              </p>
              <button onClick={() => load()} className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Retry</button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && !entries.length && !error && (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        )}

        {/* Empty */}
        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <ShieldCheck className="w-10 h-10 opacity-20" />
            <p className="text-sm font-medium">No errors logged</p>
            <p className="text-xs opacity-60">
              {showResolved ? "No entries match the current filter." : "All clear — no unresolved errors."}
            </p>
          </div>
        )}

        {/* Entry list */}
        {entries.length > 0 && (
          <div className="divide-y divide-border/50">
            {entries.map(entry => {
              const typeMeta = TYPE_META[entry.type] ?? TYPE_META.javascript;
              const sevMeta  = SEV_META[entry.severity] ?? SEV_META.error;
              const TypeIcon = typeMeta.icon;
              const SevIcon  = sevMeta.icon;
              const isExpanded = expanded === entry.id;
              const isResolved = entry.is_resolved === 1;

              return (
                <div
                  key={entry.id}
                  className={`transition-colors ${isResolved ? "opacity-50" : ""} ${isExpanded ? "bg-muted/20" : "hover:bg-muted/10"}`}
                >
                  {/* Row summary */}
                  <div className="flex items-start gap-3 px-5 py-3">
                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpanded(isExpanded ? null : entry.id)}
                      className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      {isExpanded
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {/* Type badge */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide shrink-0 ${typeMeta.bg} ${typeMeta.color}`}>
                      <TypeIcon className="w-3 h-3" />
                      {typeMeta.label}
                    </div>

                    {/* Severity icon */}
                    <SevIcon className={`w-4 h-4 shrink-0 mt-0.5 ${sevMeta.color}`} />

                    {/* Message */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{entry.message}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-muted-foreground/60">{formatDate(entry.occurred_at)}</span>
                        {entry.url && (
                          <span className="text-[10px] text-muted-foreground/60 truncate max-w-[240px]">{entry.url}</span>
                        )}
                        {entry.ip && (
                          <span className="text-[10px] text-muted-foreground/40">{entry.ip}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleResolve(entry, !isResolved)}
                        disabled={resolving === entry.id}
                        title={isResolved ? "Mark unresolved" : "Mark resolved"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isResolved
                            ? "text-muted-foreground/40 hover:text-foreground hover:bg-muted"
                            : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                        }`}
                      >
                        {resolving === entry.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(entry)}
                        disabled={deleting === entry.id}
                        title="Delete"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                      >
                        {deleting === entry.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <X className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-12 pb-4 space-y-3">
                      {entry.stack && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Stack trace</p>
                          <pre className="text-[11px] text-muted-foreground bg-muted/40 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                            {entry.stack}
                          </pre>
                        </div>
                      )}
                      {entry.context && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Context</p>
                          <pre className="text-[11px] text-muted-foreground bg-muted/40 rounded-lg p-3 overflow-x-auto font-mono">
                            {(() => { try { return JSON.stringify(JSON.parse(entry.context!), null, 2); } catch { return entry.context; } })()}
                          </pre>
                        </div>
                      )}
                      {entry.user_agent && (
                        <p className="text-[10px] text-muted-foreground/50 font-mono">{entry.user_agent}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="border-t border-border px-5 py-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{total} entries</span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => { const p = page - 1; setPage(p); load(typeFilter, showResolved, p); }}
                className="text-xs px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-muted transition-colors">Prev</button>
              <span className="text-xs text-muted-foreground px-2">{page}/{pages}</span>
              <button disabled={page >= pages} onClick={() => { const p = page + 1; setPage(p); load(typeFilter, showResolved, p); }}
                className="text-xs px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-muted transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorsViewer;
