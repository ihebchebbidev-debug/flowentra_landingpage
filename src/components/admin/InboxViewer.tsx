import { useState, useEffect, useCallback } from "react";
import { adminInbox, type InboxMessage, type InboxCounts } from "@/services/adminApi";
import {
  Mail, Headphones, Inbox, Star, RefreshCw, Trash2, Eye,
  ChevronLeft, Building2, Phone, Tag, AlertTriangle, X,
} from "lucide-react";
import { toast } from "sonner";

const MAILBOXES = [
  { key: "", label: "All", icon: Inbox },
  { key: "contact", label: "contact@flowentra.io", icon: Mail },
  { key: "support", label: "support@flowentra.io", icon: Headphones },
];

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  High:     "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  Medium:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  Low:      "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  Haute:    "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  Critique: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  Moyenne:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  Faible:   "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffH = (now.getTime() - d.getTime()) / 3600000;
  if (diffH < 1) return `${Math.round(diffH * 60)}m ago`;
  if (diffH < 24) return `${Math.round(diffH)}h ago`;
  if (diffH < 48) return "Yesterday";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

const InboxViewer = () => {
  const [mailbox, setMailbox] = useState("");
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [counts, setCounts] = useState<InboxCounts>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<InboxMessage | null>(null);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);

  const load = useCallback(async (mb = mailbox, p = page, unread = unreadOnly, starred = starredOnly) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminInbox.list({ mailbox: mb, unread, starred, page: p, limit: 25 });
      setMessages(res.data ?? []);
      setCounts(res.counts ?? {});
      setTotal(res.pagination?.total ?? 0);
      setPages(res.pagination?.pages ?? 1);
    } catch (err: any) {
      const msg = err?.message || "Unknown error";
      console.error("[InboxViewer] load failed:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [mailbox, page, unreadOnly, starredOnly]);

  useEffect(() => { load(); }, []);

  const switchMailbox = (mb: string) => {
    setMailbox(mb);
    setPage(1);
    setSelected(null);
    load(mb, 1, unreadOnly, starredOnly);
  };

  const openMessage = async (msg: InboxMessage) => {
    setSelected(msg);
    if (!msg.is_read) {
      await adminInbox.markRead([msg.id]).catch(() => {});
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: 1 } : m));
      const box = msg.mailbox as "contact" | "support";
      setCounts(prev => ({
        ...prev,
        [box]: { ...prev[box]!, unread: Math.max(0, (prev[box]?.unread ?? 1) - 1) },
      }));
    }
  };

  const toggleStar = async (msg: InboxMessage, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await adminInbox.toggleStar(msg.id).catch(() => {});
    const updated = { ...msg, is_starred: msg.is_starred ? 0 : 1 };
    setMessages(prev => prev.map(m => m.id === msg.id ? updated : m));
    if (selected?.id === msg.id) setSelected(updated);
  };

  const deleteMsg = async (msg: InboxMessage) => {
    if (!confirm("Delete this message?")) return;
    await adminInbox.delete(msg.id).catch(() => {});
    setMessages(prev => prev.filter(m => m.id !== msg.id));
    if (selected?.id === msg.id) setSelected(null);
    toast.success("Message deleted");
  };

  const totalUnread = (counts.contact?.unread ?? 0) + (counts.support?.unread ?? 0);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Inbox className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              Inbox
              {totalUnread > 0 && (
                <span className="text-[11px] font-bold bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  {totalUnread}
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground">Contact & support messages received from the website</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setUnreadOnly(!unreadOnly); load(mailbox, 1, !unreadOnly, starredOnly); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${unreadOnly ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            Unread only
          </button>
          <button
            onClick={() => { setStarredOnly(!starredOnly); load(mailbox, 1, unreadOnly, !starredOnly); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${starredOnly ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            <Star className="w-3.5 h-3.5 inline mr-1" />Starred
          </button>
          <button
            onClick={() => load()}
            disabled={loading}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mailbox sidebar */}
        <aside className="w-56 border-r border-border bg-muted/10 flex flex-col shrink-0 p-3 gap-0.5">
          {MAILBOXES.map(({ key, label, icon: Icon }) => {
            const unread = key === "" ? totalUnread
              : key === "contact" ? (counts.contact?.unread ?? 0)
              : (counts.support?.unread ?? 0);
            const isActive = mailbox === key;
            return (
              <button
                key={key}
                onClick={() => switchMailbox(key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {unread > 0 && (
                  <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 leading-none">
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Message list */}
        <div className={`flex flex-col overflow-hidden transition-all ${selected ? "w-80 shrink-0" : "flex-1"}`}>
          <div className="flex-1 overflow-y-auto divide-y divide-border/50">
            {loading && !messages.length ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading…</div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 px-6 text-center">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-sm font-semibold text-foreground">Could not load inbox</p>
                <p className="text-xs text-muted-foreground font-mono bg-muted rounded px-3 py-2 max-w-xs break-all">{error}</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Make sure <code className="bg-muted px-1 rounded">inbox.php</code> is deployed to your server at{" "}
                  <code className="bg-muted px-1 rounded">…/flowentra/api/inbox.php</code>
                </p>
                <button onClick={() => load()} className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                  Retry
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <Inbox className="w-10 h-10 opacity-30" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs opacity-60">Messages arrive when visitors submit the contact or support form.</p>
              </div>
            ) : (
              messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors flex gap-3 ${
                    selected?.id === msg.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                  }`}
                >
                  {/* Unread dot */}
                  <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${!msg.is_read ? "bg-primary" : "bg-transparent"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-xs font-semibold truncate ${!msg.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                        {msg.sender_name || msg.sender_email || "Anonymous"}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 shrink-0">{formatDate(msg.received_at)}</span>
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground truncate mb-0.5">{msg.subject || "(no subject)"}</p>
                    <p className="text-[11px] text-muted-foreground/60 truncate">{msg.message}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${msg.mailbox === "contact" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" : "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400"}`}>
                        {msg.mailbox}
                      </span>
                      {msg.category && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{msg.category}</span>
                      )}
                      {msg.priority && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLORS[msg.priority] || "bg-muted text-muted-foreground"}`}>
                          {msg.priority}
                        </span>
                      )}
                      {msg.is_starred ? <Star className="w-3 h-3 text-amber-500 fill-amber-500 ml-auto" /> : null}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="border-t border-border px-4 py-2 flex items-center justify-between shrink-0">
              <span className="text-xs text-muted-foreground">{total} messages</span>
              <div className="flex items-center gap-1">
                <button disabled={page <= 1} onClick={() => { const p = page - 1; setPage(p); load(mailbox, p); }} className="text-xs px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-muted transition-colors">Prev</button>
                <span className="text-xs text-muted-foreground px-2">{page}/{pages}</span>
                <button disabled={page >= pages} onClick={() => { const p = page + 1; setPage(p); load(mailbox, p); }} className="text-xs px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-muted transition-colors">Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Message detail */}
        {selected && (
          <div className="flex-1 border-l border-border flex flex-col overflow-hidden">
            {/* Detail header */}
            <div className="px-6 py-4 border-b border-border shrink-0 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide ${selected.mailbox === "contact" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" : "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400"}`}>
                    {selected.mailbox === "contact" ? "contact@flowentra.io" : "support@flowentra.io"}
                  </span>
                  {selected.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />{selected.category}
                    </span>
                  )}
                  {selected.priority && (
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${PRIORITY_COLORS[selected.priority] || "bg-muted text-muted-foreground"}`}>
                      <AlertTriangle className="w-2.5 h-2.5" />{selected.priority}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-foreground leading-snug">{selected.subject || "(no subject)"}</h3>
                <p className="text-xs text-muted-foreground mt-1">{new Date(selected.received_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={(e) => toggleStar(selected, e)} className={`p-1.5 rounded-lg transition-colors ${selected.is_starred ? "text-amber-500" : "text-muted-foreground hover:text-amber-500"}`} title="Star">
                  <Star className={`w-4 h-4 ${selected.is_starred ? "fill-amber-500" : ""}`} />
                </button>
                <a
                  href={`mailto:${selected.sender_email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  title="Reply by email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <button onClick={() => deleteMsg(selected)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-1" title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sender info */}
            <div className="px-6 py-3 border-b border-border bg-muted/10 shrink-0">
              <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="font-medium text-foreground">{selected.sender_name || "—"}</span>
                </div>
                {selected.sender_email && (
                  <a href={`mailto:${selected.sender_email}`} className="flex items-center gap-2 text-xs text-primary hover:underline">
                    <Mail className="w-3.5 h-3.5" />
                    {selected.sender_email}
                  </a>
                )}
                {selected.sender_phone && (
                  <a href={`tel:${selected.sender_phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    {selected.sender_phone}
                  </a>
                )}
                {selected.company && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    {selected.company}
                  </div>
                )}
              </div>
            </div>

            {/* Message body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>

            {/* Quick reply link */}
            {selected.sender_email && (
              <div className="px-6 py-3 border-t border-border shrink-0">
                <a
                  href={`mailto:${selected.sender_email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Reply in email client
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxViewer;
