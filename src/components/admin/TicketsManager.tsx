import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ticketsApi,
  type Ticket,
  type TicketComment,
  type TicketStatus,
  type TicketOriginType,
  type TenantInfo,
} from "@/services/adminTicketsApi";
import {
  Ticket as TicketIcon, RefreshCw, Search, Filter, Building2, User, Bot,
  Send, Lock, X, ChevronLeft, AlertCircle, CheckCircle2, Clock, PlayCircle,
} from "lucide-react";
import { toast } from "sonner";

const STATUSES: { key: TicketStatus; label: string; color: string; icon: any }[] = [
  { key: "open",        label: "Open",        color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",     icon: AlertCircle },
  { key: "in_progress", label: "In Progress", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400", icon: PlayCircle },
  { key: "resolved",    label: "Resolved",    color: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400", icon: CheckCircle2 },
  { key: "closed",      label: "Closed",      color: "bg-muted text-muted-foreground",                                        icon: Clock },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.key, s])) as Record<TicketStatus, typeof STATUSES[number]>;

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const diffH = (Date.now() - d.getTime()) / 3600000;
  if (diffH < 1) return `${Math.max(1, Math.round(diffH * 60))}m ago`;
  if (diffH < 24) return `${Math.round(diffH)}h ago`;
  if (diffH < 48) return "Yesterday";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function tenantName(t: any): string {
  if (typeof t === "string") return t;
  return (t?.tenant || t?.slug || t?.name || t?.id || "") as string;
}

const TicketsManager = () => {
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [tenantFilter, setTenantFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const [originFilter, setOriginFilter] = useState<TicketOriginType | "">("");
  const [userEmail, setUserEmail] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 50;

  // Selection
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  const loadTenants = useCallback(async () => {
    try {
      const list = await ticketsApi.listTenants();
      setTenants(list);
    } catch (err: any) {
      console.warn("[Tickets] tenants load failed:", err?.message);
    }
  }, []);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ticketsApi.listTickets({
        tenant: tenantFilter || undefined,
        status: statusFilter || undefined,
        origin: originFilter || undefined,
        userEmail: userEmail || undefined,
        search: search || undefined,
        page,
        pageSize,
      });
      setTickets(res.data);
      setTotal(res.total ?? res.pagination?.total ?? res.data.length);
    } catch (err: any) {
      setError(err?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [tenantFilter, statusFilter, originFilter, userEmail, search, page]);

  useEffect(() => { loadTenants(); }, [loadTenants]);
  useEffect(() => { loadTickets(); }, [loadTickets]);

  const openTicket = async (t: Ticket) => {
    setSelected(t);
    setComments([]);
    setCommentsLoading(true);
    try {
      const list = await ticketsApi.listComments(t.tenant, t.id);
      setComments(list);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  const changeStatus = async (status: TicketStatus) => {
    if (!selected) return;
    setStatusSaving(true);
    try {
      await ticketsApi.setStatus(selected.tenant, selected.id, status);
      setSelected({ ...selected, status });
      setTickets(prev => prev.map(t =>
        t.tenant === selected.tenant && t.id === selected.id ? { ...t, status } : t
      ));
      toast.success(`Status changed to ${STATUS_MAP[status].label}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setStatusSaving(false);
    }
  };

  const submitComment = async () => {
    if (!selected || !newComment.trim()) return;
    setSending(true);
    try {
      const created = await ticketsApi.addComment(selected.tenant, selected.id, {
        text: newComment.trim(),
        author: "Admin",
        authorEmail: "admin@flowentra.io",
        isInternal,
      });
      setComments(prev => [...prev, created]);
      setNewComment("");
      toast.success("Comment posted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to post comment");
    } finally {
      setSending(false);
    }
  };

  const stats = useMemo(() => {
    const s: Record<string, number> = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
    tickets.forEach(t => { if (s[t.status] !== undefined) s[t.status]++; });
    return s;
  }, [tickets]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TicketIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Tickets</h2>
            <p className="text-xs text-muted-foreground">
              Multi-tenant support tickets across all Flowentra tenant databases
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {STATUSES.map(s => (
            <div key={s.key} className="text-center">
              <div className={`text-xs font-bold ${s.color} px-2 py-0.5 rounded`}>{stats[s.key] ?? 0}</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
          <button
            onClick={() => loadTickets()}
            disabled={loading}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b border-border bg-muted/10 shrink-0 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="w-3.5 h-3.5" />
          <span className="font-medium">Filters</span>
        </div>

        <select
          value={tenantFilter}
          onChange={e => { setPage(1); setTenantFilter(e.target.value); }}
          className="text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground min-w-[140px]"
        >
          <option value="">All tenants</option>
          {tenants.map(t => {
            const n = tenantName(t);
            return <option key={n} value={n}>{n}</option>;
          })}
        </select>

        <select
          value={statusFilter}
          onChange={e => { setPage(1); setStatusFilter(e.target.value as TicketStatus | ""); }}
          className="text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground"
        >
          <option value="">Any status</option>
          {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>

        <select
          value={originFilter}
          onChange={e => { setPage(1); setOriginFilter(e.target.value as TicketOriginType | ""); }}
          className="text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground"
        >
          <option value="">Any origin</option>
          <option value="manual">Manual</option>
          <option value="auto">Auto / System</option>
        </select>

        <input
          type="email"
          placeholder="user email"
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { setPage(1); loadTickets(); } }}
          className="text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground w-44"
        />

        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search title / description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { setPage(1); loadTickets(); } }}
            className="w-full text-xs pl-7 pr-2 py-1.5 rounded-lg border border-border bg-background text-foreground"
          />
        </div>

        <button
          onClick={() => { setPage(1); loadTickets(); }}
          className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-medium"
        >
          Apply
        </button>
        {(tenantFilter || statusFilter || originFilter || userEmail || search) && (
          <button
            onClick={() => {
              setTenantFilter(""); setStatusFilter(""); setOriginFilter("");
              setUserEmail(""); setSearch(""); setPage(1);
            }}
            className="text-xs px-2 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className={`flex flex-col overflow-hidden transition-all ${selected ? "w-96 shrink-0 border-r border-border" : "flex-1"}`}>
          <div className="flex-1 overflow-y-auto divide-y divide-border/50">
            {loading && tickets.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading tickets…</div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 px-6 text-center">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-sm font-semibold text-foreground">Could not load tickets</p>
                <p className="text-xs text-muted-foreground font-mono bg-muted rounded px-3 py-2 max-w-md break-all">{error}</p>
                <button onClick={() => loadTickets()} className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Retry</button>
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <TicketIcon className="w-10 h-10 opacity-30" />
                <p className="text-sm">No tickets match your filters</p>
              </div>
            ) : (
              tickets.map(t => {
                const status = STATUS_MAP[t.status] ?? STATUS_MAP.open;
                const isSel = selected?.tenant === t.tenant && selected?.id === t.id;
                const isAuto = t.origin?.type === "auto" || t.reporter?.isSystem;
                return (
                  <button
                    key={`${t.tenant}-${t.id}`}
                    onClick={() => openTicket(t)}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors ${isSel ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-bold text-muted-foreground shrink-0">#{t.id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold flex items-center gap-1 shrink-0">
                          <Building2 className="w-2.5 h-2.5" />{t.tenant}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 shrink-0 ${status.color}`}>
                          <status.icon className="w-2.5 h-2.5" />{status.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 shrink-0">{formatDate(t.createdAt || t.updatedAt)}</span>
                    </div>
                    <p className="text-xs font-semibold text-foreground truncate mb-0.5">{t.title || t.subject || "(no title)"}</p>
                    {t.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mb-1">{t.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 ${isAuto ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" : "bg-muted text-muted-foreground"}`}>
                        {isAuto ? <Bot className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                        {isAuto ? "auto" : "manual"}
                      </span>
                      {t.reporter?.email && (
                        <span className="text-[10px] text-muted-foreground truncate">{t.reporter.email}</span>
                      )}
                      {t.reporter?.isAnonymous && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">anonymous</span>
                      )}
                      {t.priority && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground ml-auto">{t.priority}</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="border-t border-border px-4 py-2 flex items-center justify-between shrink-0">
              <span className="text-xs text-muted-foreground">{total} tickets</span>
              <div className="flex items-center gap-1">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="text-xs px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-muted">Prev</button>
                <span className="text-xs text-muted-foreground px-2">{page}/{pages}</span>
                <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="text-xs px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-muted">Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-border shrink-0 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold text-muted-foreground">#{selected.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold flex items-center gap-1">
                    <Building2 className="w-2.5 h-2.5" />{selected.tenant}
                  </span>
                  {(() => {
                    const s = STATUS_MAP[selected.status] ?? STATUS_MAP.open;
                    return (
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${s.color}`}>
                        <s.icon className="w-2.5 h-2.5" />{s.label}
                      </span>
                    );
                  })()}
                  {selected.origin?.type === "auto" && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 font-semibold flex items-center gap-1">
                      <Bot className="w-2.5 h-2.5" />auto
                    </span>
                  )}
                  {selected.priority && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">{selected.priority}</span>
                  )}
                </div>
                <h3 className="text-base font-bold text-foreground leading-snug">{selected.title || selected.subject || "(no title)"}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Reported by{" "}
                  <span className="text-foreground font-medium">
                    {selected.reporter?.isSystem ? "System"
                      : selected.reporter?.isAnonymous ? "Anonymous"
                      : (selected.reporter?.name || selected.reporter?.email || "—")}
                  </span>
                  {selected.reporter?.email && !selected.reporter?.isAnonymous && !selected.reporter?.isSystem && (
                    <> · <a href={`mailto:${selected.reporter.email}`} className="text-primary hover:underline">{selected.reporter.email}</a></>
                  )}
                  <> · {formatDate(selected.createdAt)}</>
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted" title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status changer */}
            <div className="px-6 py-3 border-b border-border bg-muted/10 shrink-0 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium mr-1">Status:</span>
              {STATUSES.map(s => (
                <button
                  key={s.key}
                  disabled={statusSaving || selected.status === s.key}
                  onClick={() => changeStatus(s.key)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors border ${
                    selected.status === s.key
                      ? `${s.color} border-transparent cursor-default`
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40"
                  }`}
                >
                  <s.icon className="w-3 h-3" />
                  {s.label}
                </button>
              ))}
            </div>

            {/* Description + comments */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {selected.description && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                </div>
              )}

              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Comments {comments.length > 0 && <span className="text-muted-foreground/60">({comments.length})</span>}
                </p>

                {commentsLoading ? (
                  <div className="text-xs text-muted-foreground py-6 text-center">Loading comments…</div>
                ) : comments.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-6 text-center italic">No comments yet</div>
                ) : (
                  <div className="space-y-2.5">
                    {comments.map(c => (
                      <div
                        key={c.id}
                        className={`p-3 rounded-lg border ${
                          c.isInternal
                            ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40"
                            : "bg-card border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="font-semibold text-foreground">{c.author || c.authorEmail || "Unknown"}</span>
                            {c.isInternal && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-medium flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />internal
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground/60">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reply */}
            <div className="border-t border-border p-4 shrink-0 bg-muted/10">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a comment…"
                rows={3}
                className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={e => setIsInternal(e.target.checked)}
                    className="rounded border-border"
                  />
                  <Lock className="w-3 h-3" />
                  Internal note (hidden from customer)
                </label>
                <button
                  onClick={submitComment}
                  disabled={sending || !newComment.trim()}
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sending ? "Sending…" : "Post comment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsManager;
