import { useState, useEffect, useCallback, useRef, type MouseEvent } from "react";
import {
  Inbox, Send, ShieldAlert, Trash2, Star, RefreshCw, Search,
  ChevronLeft, ChevronRight, Paperclip, Download, Settings, X,
  MailOpen, Mail, AlertTriangle, Loader2, CheckCircle, Folder,
  PenSquare, Reply, Bold, Italic, Underline, Link2, List, ListOrdered,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminMailbox, type MailFolder, type MailListItem, type MailMessage, type ImapSettings, type MailboxKey,
} from "@/services/adminMailboxApi";

// Segmented Contact / Support account switcher
const MailboxSwitch = ({ mailbox, onChange }: { mailbox: MailboxKey; onChange: (m: MailboxKey) => void }) => (
  <div className="inline-flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
    {(["contact", "support"] as MailboxKey[]).map((m) => (
      <button
        key={m}
        onClick={() => onChange(m)}
        className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
          mailbox === m ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {m === "contact" ? "Contact (.io)" : "Support (.app)"}
      </button>
    ))}
  </div>
);

// Quick-access folders. We match the real IMAP folder names (discovered from
// the server) against these candidates so OVH naming variants still resolve.
const QUICK_FOLDERS: { label: string; icon: typeof Inbox; candidates: string[] }[] = [
  { label: "Inbox", icon: Inbox, candidates: ["INBOX"] },
  { label: "Sent", icon: Send, candidates: ["Sent", "INBOX.Sent", "Sent Messages", "Sent Items"] },
  { label: "Spam", icon: ShieldAlert, candidates: ["Spam", "INBOX.Spam", "Junk", "INBOX.Junk"] },
  { label: "Trash", icon: Trash2, candidates: ["Trash", "INBOX.Trash", "Deleted", "Deleted Messages"] },
];

function formatDate(ts: number, iso: string) {
  const d = ts ? new Date(ts * 1000) : new Date(iso);
  if (isNaN(d.getTime())) return iso || "";
  const diffH = (Date.now() - d.getTime()) / 3600000;
  if (diffH < 1) return `${Math.max(1, Math.round(diffH * 60))}m ago`;
  if (diffH < 24) return `${Math.round(diffH)}h ago`;
  if (diffH < 48) return "Yesterday";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function formatSize(bytes: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

// Pull a bare email address out of a "Name <email>" header string
function extractEmail(value: string): string {
  const m = value?.match(/<([^>]+)>/);
  if (m) return m[1].trim();
  const m2 = value?.match(/[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+/);
  return m2 ? m2[0] : (value || "").trim();
}

// ==================== COMPOSE / REPLY ====================
const Composer = ({ fromAddress, initial, onClose, onSent }: {
  fromAddress: string;
  initial?: { to?: string; cc?: string; subject?: string; html?: string };
  onClose: () => void;
  onSent: () => void;
}) => {
  const [to, setTo] = useState(initial?.to || "");
  const [cc, setCc] = useState(initial?.cc || "");
  const [showCc, setShowCc] = useState(!!initial?.cc);
  const [subject, setSubject] = useState(initial?.subject || "");
  const [sending, setSending] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.innerHTML = initial?.html || "";
  }, []);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    bodyRef.current?.focus();
  };

  const addLink = () => {
    const url = window.prompt("Link URL:", "https://");
    if (url) exec("createLink", url);
  };

  const send = async () => {
    if (!to.trim()) { toast.error("Add a recipient"); return; }
    if (!subject.trim()) { toast.error("Add a subject"); return; }
    const html = bodyRef.current?.innerHTML || "";
    setSending(true);
    try {
      const r = await adminMailbox.send({ to: to.trim(), cc: cc.trim(), subject: subject.trim(), html });
      if (r.success) { toast.success("Message sent"); onSent(); }
      else toast.error(r.message || "Send failed");
    } catch (err: any) {
      toast.error(err?.message || "Send failed");
    } finally {
      setSending(false);
    }
  };

  const tbBtn = "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors";
  const inputCls = "flex-1 bg-transparent text-sm focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-bold flex items-center gap-2"><Send className="w-4 h-4" /> New message</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-4 py-2 space-y-0 overflow-y-auto">
          <div className="flex items-center gap-2 py-2 border-b border-border/60">
            <span className="text-xs text-muted-foreground w-14">From</span>
            <span className="text-sm text-foreground">{fromAddress}</span>
          </div>
          <div className="flex items-center gap-2 py-2 border-b border-border/60">
            <span className="text-xs text-muted-foreground w-14">To</span>
            <input className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" autoFocus />
            {!showCc && <button onClick={() => setShowCc(true)} className="text-xs text-primary hover:underline">Cc</button>}
          </div>
          {showCc && (
            <div className="flex items-center gap-2 py-2 border-b border-border/60">
              <span className="text-xs text-muted-foreground w-14">Cc</span>
              <input className={inputCls} value={cc} onChange={(e) => setCc(e.target.value)} placeholder="cc@example.com, other@example.com" />
            </div>
          )}
          <div className="flex items-center gap-2 py-2 border-b border-border/60">
            <span className="text-xs text-muted-foreground w-14">Subject</span>
            <input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          </div>

          {/* Formatting toolbar */}
          <div className="flex items-center gap-0.5 py-2 border-b border-border/60">
            <button type="button" className={tbBtn} title="Bold" onClick={() => exec("bold")}><Bold className="w-3.5 h-3.5" /></button>
            <button type="button" className={tbBtn} title="Italic" onClick={() => exec("italic")}><Italic className="w-3.5 h-3.5" /></button>
            <button type="button" className={tbBtn} title="Underline" onClick={() => exec("underline")}><Underline className="w-3.5 h-3.5" /></button>
            <span className="w-px h-4 bg-border mx-1" />
            <button type="button" className={tbBtn} title="Bulleted list" onClick={() => exec("insertUnorderedList")}><List className="w-3.5 h-3.5" /></button>
            <button type="button" className={tbBtn} title="Numbered list" onClick={() => exec("insertOrderedList")}><ListOrdered className="w-3.5 h-3.5" /></button>
            <button type="button" className={tbBtn} title="Insert link" onClick={addLink}><Link2 className="w-3.5 h-3.5" /></button>
          </div>

          {/* Rich text body */}
          <div
            ref={bodyRef}
            contentEditable
            className="min-h-[200px] max-h-[40vh] overflow-y-auto py-3 text-sm focus:outline-none [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            data-placeholder="Write your message…"
            suppressContentEditableWarning
          />
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
          <button onClick={send} disabled={sending} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const MailboxViewer = () => {
  const [mailbox, setMailboxState] = useState<MailboxKey>("contact");
  const [imapEnabled, setImapEnabled] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [folders, setFolders] = useState<MailFolder[]>([]);
  const [folder, setFolder] = useState("INBOX");
  const [messages, setMessages] = useState<MailListItem[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<MailMessage | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [composing, setComposing] = useState<null | { to?: string; cc?: string; subject?: string; html?: string }>(null);

  const fromAddress = mailbox === "support" ? "support@flowentra.app" : "contact@flowentra.io";

  const startReply = () => {
    if (!selected) return;
    const replyTo = extractEmail(selected.from);
    const subj = (selected.subject || "").toLowerCase().startsWith("re:") ? selected.subject : `Re: ${selected.subject || ""}`;
    const quoted = `<br><br><blockquote style="border-left:2px solid #ccc;padding-left:10px;color:#666">On ${selected.date}, ${selected.from} wrote:<br>${selected.html || ""}</blockquote>`;
    setComposing({ to: replyTo, subject: subj, html: quoted });
  };

  // Resolve a quick folder's real name from discovered folders
  const resolveFolder = (candidates: string[]) =>
    folders.find((f) => candidates.some((c) => c.toLowerCase() === f.name.toLowerCase()))?.name;

  const trashName = resolveFolder(QUICK_FOLDERS[3].candidates) || "Trash";
  const spamName = resolveFolder(QUICK_FOLDERS[2].candidates) || "Spam";

  const loadFolders = useCallback(async () => {
    try {
      const f = await adminMailbox.getFolders();
      setFolders(f);
    } catch (err: any) {
      setError(err?.message || "Failed to load folders");
    }
  }, []);

  const loadMessages = useCallback(async (f = folder, p = page, q = search) => {
    setLoading(true);
    setError(null);
    setSelected(null);
    try {
      const res = await adminMailbox.list(f, p, q);
      setMessages(res.data ?? []);
      setTotal(res.pagination?.total ?? 0);
      setPages(res.pagination?.pages ?? 1);
    } catch (err: any) {
      setError(err?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [folder, page, search]);

  // Check settings/extension for the active mailbox, then load
  const init = useCallback(async () => {
    setError(null);
    setSelected(null);
    setMessages([]);
    setFolders([]);
    try {
      const r = await adminMailbox.getSettings();
      setImapEnabled(r.imap_enabled);
      const isConfigured = !!r.data?.username;
      setConfigured(isConfigured);
      if (!isConfigured) {
        setShowSettings(true);
        return;
      }
      setShowSettings(false);
      await loadFolders();
      await loadMessages("INBOX", 1, "");
    } catch (err: any) {
      setError(err?.message || "Failed to initialize mailbox");
    }
  }, [loadFolders, loadMessages]);

  // Re-initialize on mount and whenever the active mailbox changes
  useEffect(() => { init(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [mailbox]);

  const switchMailbox = (m: MailboxKey) => {
    if (m === mailbox) return;
    adminMailbox.setMailbox(m);
    setFolder("INBOX");
    setPage(1);
    setSearch("");
    setMailboxState(m);
  };

  const switchFolder = (name: string) => {
    setFolder(name);
    setPage(1);
    setSearch("");
    loadMessages(name, 1, "");
  };

  const openMessage = async (item: MailListItem) => {
    setLoadingMsg(true);
    try {
      const msg = await adminMailbox.getMessage(folder, item.uid, true);
      setSelected(msg);
      // reflect as read in the list
      setMessages((prev) => prev.map((m) => (m.uid === item.uid ? { ...m, seen: true } : m)));
    } catch (err: any) {
      toast.error(err?.message || "Failed to open message");
    } finally {
      setLoadingMsg(false);
    }
  };

  const doMove = async (uid: number, to: string, label: string) => {
    try {
      await adminMailbox.move(folder, uid, to);
      toast.success(`Moved to ${label}`);
      setSelected(null);
      loadMessages();
      loadFolders();
    } catch (err: any) {
      toast.error(err?.message || "Move failed");
    }
  };

  const doDelete = async (uid: number) => {
    try {
      await adminMailbox.remove(folder, uid);
      toast.success("Deleted");
      setSelected(null);
      loadMessages();
      loadFolders();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const toggleSeen = async (item: MailListItem, e: MouseEvent) => {
    e.stopPropagation();
    try {
      await adminMailbox.mark(folder, item.uid, !item.seen);
      setMessages((prev) => prev.map((m) => (m.uid === item.uid ? { ...m, seen: !m.seen } : m)));
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    }
  };

  // ==================== SETTINGS PANEL ====================
  if (showSettings) {
    return (
      <div className="space-y-4 max-w-xl mx-auto">
        <MailboxSwitch mailbox={mailbox} onChange={switchMailbox} />
        <SettingsPanel
          mailbox={mailbox}
          imapEnabled={imapEnabled}
          onClose={configured ? () => setShowSettings(false) : undefined}
          onSaved={async () => {
            setShowSettings(false);
            setConfigured(true);
            await loadFolders();
            await loadMessages("INBOX", 1, "");
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-foreground">Mailbox</h2>
          <MailboxSwitch mailbox={mailbox} onChange={switchMailbox} />
          <span className="text-xs text-muted-foreground">{total} messages</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setComposing({})} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors" title="Compose">
            <PenSquare className="w-3.5 h-3.5" /> Compose
          </button>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); loadMessages(folder, 1, search); } }}
              placeholder="Search…"
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background w-44 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button onClick={() => { loadMessages(); loadFolders(); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setShowSettings(true)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="IMAP Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">
        {/* Folder rail */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2 space-y-1">
          {QUICK_FOLDERS.map((qf) => {
            const real = resolveFolder(qf.candidates) || qf.candidates[0];
            const meta = folders.find((f) => f.name.toLowerCase() === real.toLowerCase());
            const active = folder.toLowerCase() === real.toLowerCase();
            return (
              <button
                key={qf.label}
                onClick={() => switchFolder(real)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span className="flex items-center gap-2 text-xs font-medium">
                  <qf.icon className="w-3.5 h-3.5" />
                  {qf.label}
                </span>
                {meta && meta.unseen > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">{meta.unseen}</span>
                )}
              </button>
            );
          })}

          {/* Other discovered folders */}
          {folders.filter((f) => !QUICK_FOLDERS.some((qf) => qf.candidates.some((c) => c.toLowerCase() === f.name.toLowerCase()))).map((f) => (
            <button
              key={f.name}
              onClick={() => switchFolder(f.name)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                folder === f.name ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <span className="flex items-center gap-2 text-xs font-medium truncate">
                <Folder className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{f.display}</span>
              </span>
              {f.unseen > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">{f.unseen}</span>}
            </button>
          ))}
        </div>

        {/* Message list */}
        <div className="col-span-12 md:col-span-9 lg:col-span-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {loading ? (
              <div className="p-8 flex items-center justify-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /></div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No messages</div>
            ) : (
              <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                {messages.map((m) => (
                  <button
                    key={m.uid}
                    onClick={() => openMessage(m)}
                    className={`w-full text-left px-3 py-2.5 transition-colors hover:bg-muted/40 ${
                      selected?.uid === m.uid ? "bg-primary/5" : ""
                    } ${!m.seen ? "bg-primary/[0.03]" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs truncate ${!m.seen ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                        {m.from || "(unknown)"}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{formatDate(m.timestamp, m.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <button onClick={(e) => toggleSeen(m, e)} className="shrink-0 text-muted-foreground hover:text-primary" title={m.seen ? "Mark unread" : "Mark read"}>
                        {m.seen ? <MailOpen className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                      </button>
                      <span className={`text-xs truncate ${!m.seen ? "text-foreground" : "text-muted-foreground"}`}>
                        {m.subject || "(no subject)"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <button disabled={page <= 1} onClick={() => { const p = page - 1; setPage(p); loadMessages(folder, p, search); }} className="flex items-center gap-1 disabled:opacity-40 hover:text-foreground">
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <span>Page {page} / {pages}</span>
              <button disabled={page >= pages} onClick={() => { const p = page + 1; setPage(p); loadMessages(folder, p, search); }} className="flex items-center gap-1 disabled:opacity-40 hover:text-foreground">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Message viewer */}
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-xl border border-border bg-card min-h-[60vh] overflow-hidden">
            {loadingMsg ? (
              <div className="p-8 flex items-center justify-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /></div>
            ) : !selected ? (
              <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <Inbox className="w-8 h-8 opacity-30" />
                Select a message to read
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground truncate">{folder}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={startReply} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors" title="Reply">
                      <Reply className="w-4 h-4" />
                    </button>
                    {folder.toLowerCase() !== spamName.toLowerCase() && (
                      <button onClick={() => doMove(selected.uid, spamName, "Spam")} className="p-1.5 rounded-lg text-muted-foreground hover:text-orange-500 hover:bg-muted transition-colors" title="Move to Spam">
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    )}
                    {folder.toLowerCase() !== trashName.toLowerCase() ? (
                      <button onClick={() => doMove(selected.uid, trashName, "Trash")} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors" title="Move to Trash">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => doDelete(selected.uid)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors" title="Delete permanently">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Close">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Headers */}
                <div className="px-4 py-3 border-b border-border space-y-1">
                  <h3 className="text-sm font-bold text-foreground">{selected.subject}</h3>
                  <div className="text-xs text-muted-foreground"><span className="font-medium text-foreground">From:</span> {selected.from}</div>
                  <div className="text-xs text-muted-foreground"><span className="font-medium text-foreground">To:</span> {selected.to}</div>
                  <div className="text-[11px] text-muted-foreground/70">{selected.date}</div>
                </div>

                {/* Attachments */}
                {selected.attachments.length > 0 && (
                  <div className="px-4 py-2.5 border-b border-border flex flex-wrap gap-2">
                    {selected.attachments.map((a, i) => (
                      <a
                        key={i}
                        href={adminMailbox.attachmentUrl(folder, selected.uid, a.part, a.name)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs hover:bg-muted transition-colors"
                        download={a.name}
                      >
                        <Paperclip className="w-3 h-3 text-muted-foreground" />
                        <span className="max-w-[160px] truncate">{a.name}</span>
                        <span className="text-[10px] text-muted-foreground">{formatSize(a.size)}</span>
                        <Download className="w-3 h-3 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 max-h-[45vh]">
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert text-sm [&_a]:text-primary [&_img]:max-w-full"
                    dangerouslySetInnerHTML={{ __html: selected.html }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {composing && (
        <Composer
          fromAddress={fromAddress}
          initial={composing}
          onClose={() => setComposing(null)}
          onSent={() => setComposing(null)}
        />
      )}
    </div>
  );
};

// ==================== SETTINGS PANEL ====================
const SettingsPanel = ({ mailbox, imapEnabled, onClose, onSaved }: {
  mailbox: MailboxKey;
  imapEnabled: boolean;
  onClose?: () => void;
  onSaved: () => void;
}) => {
  const defaultUser = mailbox === "support" ? "support@flowentra.app" : "contact@flowentra.io";
  const [form, setForm] = useState<Partial<ImapSettings>>({
    host: "ssl0.ovh.net", port: 993, encryption: "ssl", validate_cert: 1, username: "", password: "",
  });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await adminMailbox.getSettings();
        if (r.data) setForm({ ...r.data });
      } catch { /* first-time, keep defaults */ }
      setLoaded(true);
    })();
  }, []);

  const save = async () => {
    if (!form.username || !form.host) { toast.error("Host and email/username are required"); return; }
    setSaving(true);
    try {
      await adminMailbox.saveSettings(form);
      toast.success("IMAP settings saved");
      onSaved();
    } catch (err: any) {
      toast.error(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    setTesting(true);
    try {
      // Save first so the test uses current values
      await adminMailbox.saveSettings(form);
      const r = await adminMailbox.test();
      if (r.success) toast.success(r.message || "Connection OK");
      else toast.error(r.message || "Connection failed");
    } catch (err: any) {
      toast.error(err?.message || "Test failed");
    } finally {
      setTesting(false);
    }
  };

  const field = "w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2"><Settings className="w-4 h-4" /> IMAP Settings — {mailbox === "support" ? "Support (.app)" : "Contact (.io)"}</h2>
        {onClose && <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"><X className="w-4 h-4" /></button>}
      </div>

      {!imapEnabled && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>The PHP <strong>imap</strong> extension is not enabled on the server. You can save settings, but reading mailboxes will fail until <code>php-imap</code> is enabled in your OVH hosting config.</span>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground block mb-1">IMAP Host</label>
            <input className={field} value={form.host || ""} onChange={(e) => setForm({ ...form, host: e.target.value })} placeholder="ssl0.ovh.net" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Port</label>
            <input type="number" className={field} value={form.port || 993} onChange={(e) => setForm({ ...form, port: parseInt(e.target.value) || 993 })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Encryption</label>
            <select className={field} value={form.encryption || "ssl"} onChange={(e) => setForm({ ...form, encryption: e.target.value as ImapSettings["encryption"] })}>
              <option value="ssl">SSL/TLS (recommended)</option>
              <option value="tls">STARTTLS</option>
              <option value="none">None</option>
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={!!form.validate_cert} onChange={(e) => setForm({ ...form, validate_cert: e.target.checked ? 1 : 0 })} />
              Validate SSL certificate
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Email / Username</label>
          <input className={field} value={form.username || ""} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder={defaultUser} autoComplete="off" />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Password</label>
          <input type="password" className={field} value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={loaded ? "••••••••" : ""} autoComplete="new-password" />
          <p className="text-[10px] text-muted-foreground mt-1">Stored on your server. Leave the masked value to keep the existing password.</p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Save & Open
          </button>
          <button onClick={test} disabled={testing} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted disabled:opacity-50">
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Test Connection
          </button>
        </div>

        <div className="text-[11px] text-muted-foreground border-t border-border pt-3 space-y-0.5">
          <p className="font-medium text-foreground">OVH settings reference</p>
          <p>Incoming (read): <code>ssl0.ovh.net</code> · Port <code>993</code> · SSL/TLS</p>
          <p>Outgoing (send): <code>ssl0.ovh.net</code> · Port <code>465</code> · SSL/TLS (configured in Email Manager)</p>
        </div>
      </div>
    </div>
  );
};

export default MailboxViewer;
