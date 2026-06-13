import { useState, useEffect, useCallback } from "react";
import { adminLogs, type AdminActionLogEntry, type AdminActionLogSummaryEntry } from "@/services/adminApi";
import { AlertTriangle, RefreshCw, Trash2, ChevronDown, ChevronRight, Info, Loader2, Activity } from "lucide-react";
import { toast } from "sonner";

const LEVEL_FILTERS = [
  { key: "", label: "All levels" },
  { key: "info", label: "Info" },
  { key: "warning", label: "Warnings" },
  { key: "error", label: "Errors" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const AdminLogsViewer = () => {
  const [entries, setEntries] = useState<AdminActionLogEntry[]>([]);
  const [summary, setSummary] = useState<AdminActionLogSummaryEntry[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(async (level = levelFilter, pageNumber = page) => {
    setLoading(true);
    setError(null);

    try {
      const res = await adminLogs.list({ level, page: pageNumber, limit: 50 });
      setEntries(res.data ?? []);
      setSummary(res.summary ?? []);
      setTotal(res.pagination?.total ?? 0);
      setPages(res.pagination?.pages ?? 1);
      setPage(res.pagination?.page ?? pageNumber);
    } catch (err: any) {
      setError(err?.message || "Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  }, [levelFilter, page]);

  useEffect(() => {
    load("", 1);
  }, []);

  const switchLevel = (level: string) => {
    setLevelFilter(level);
    setExpanded(null);
    load(level, 1);
  };

  const handleDelete = async (entry: AdminActionLogEntry) => {
    if (!confirm("Delete this activity log entry?")) return;
    setDeleting(entry.id);

    try {
      await adminLogs.delete(entry.id);
      setEntries((prev) => prev.filter((item) => item.id !== entry.id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (expanded === entry.id) setExpanded(null);
      toast.success("Entry deleted");
    } catch {
      toast.error("Failed to delete entry");
    } finally {
      setDeleting(null);
    }
  };

  const levelTotal = (level: string) => summary.find((item) => item.level === level)?.total ?? 0;

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/10 to-transparent flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Activity Logs</h2>
              <p className="text-xs text-muted-foreground">Visitor events, form submissions and admin audit trail.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(levelFilter, page)}
              disabled={loading}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="flex border-b border-border overflow-x-auto">
          {LEVEL_FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => switchLevel(filter.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                levelFilter === filter.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter.label}
              {filter.key && levelTotal(filter.key) > 0 && (
                <span className="text-[10px] font-bold bg-primary/10 text-primary rounded-full px-1.5 py-0.5 ml-2">
                  {levelTotal(filter.key)}
                </span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="m-6 flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">Could not load activity logs</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">{error}</p>
              <button onClick={() => load(levelFilter, page)} className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Retry</button>
            </div>
          </div>
        )}

        {loading && !entries.length && !error && (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <Info className="w-10 h-10 opacity-20" />
            <p className="text-sm font-medium">No activity logs found</p>
            <p className="text-xs opacity-60">Try a different filter or refresh the list.</p>
          </div>
        )}

        {entries.length > 0 && (
          <div className="divide-y divide-border/50">
            {entries.map((entry) => {
              const isExpanded = expanded === entry.id;
              return (
                <div
                  key={entry.id}
                  className={`transition-colors ${isExpanded ? "bg-muted/20" : "hover:bg-muted/10"}`}
                >
                  <div className="flex items-start gap-3 px-5 py-3">
                    <button
                      onClick={() => setExpanded(isExpanded ? null : entry.id)}
                      className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 items-center mb-2">
                        <span className="text-[10px] uppercase tracking-wide rounded-full bg-muted px-2 py-1 font-semibold text-muted-foreground">
                          {entry.category || "general"}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide rounded-full bg-muted px-2 py-1 font-semibold text-muted-foreground">
                          {entry.action || "event"}
                        </span>
                        <span className={`text-[10px] uppercase tracking-wide rounded-full px-2 py-1 font-semibold ${
                          entry.level === "error" ? "bg-destructive/10 text-destructive" : entry.level === "warning" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"
                        }`}>
                          {entry.level}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{entry.message}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span>{formatDate(entry.created_at)}</span>
                        {entry.url && <span className="truncate max-w-[240px]">{entry.url}</span>}
                        {entry.ip && <span>{entry.ip}</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(entry)}
                      disabled={deleting === entry.id}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === entry.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-12 pb-4 space-y-3">
                      {entry.context && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Context</p>
                          <pre className="text-[11px] text-muted-foreground bg-muted/40 rounded-lg p-3 overflow-x-auto font-mono">
                            {(() => {
                              try {
                                return JSON.stringify(JSON.parse(entry.context || ""), null, 2);
                              } catch {
                                return entry.context;
                              }
                            })()}
                          </pre>
                        </div>
                      )}
                      {entry.user_agent && (
                        <p className="text-[10px] text-muted-foreground/60 font-mono">{entry.user_agent}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {pages > 1 && (
          <div className="border-t border-border px-5 py-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{total} entries</span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => load(levelFilter, page - 1)}
                className="text-xs px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Prev
              </button>
              <span className="text-xs text-muted-foreground px-2">{page}/{pages}</span>
              <button
                disabled={page >= pages}
                onClick={() => load(levelFilter, page + 1)}
                className="text-xs px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogsViewer;
