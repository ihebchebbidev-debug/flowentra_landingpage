import { useEffect, useMemo, useState } from "react";
import {
  modulesApi,
  moduleLabel,
  ModulesApiError,
  type ModuleGraphNode,
  type ModuleSnapshotItem,
  type TenantSnapshot,
  type TogglePreview,
  effectiveDependencies,
  computeLocalImpact,
  mergeImpact,
} from "@/services/adminModulesApi";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Blocks,
  Lock,
  Link2Off,
  RefreshCw,
  Search,
  Globe,
  Loader2,
  AlertTriangle,
} from "lucide-react";

type FilterKey = "all" | "on" | "off" | "core" | "dep";

interface PendingToggle {
  code: string;
  next: boolean;
  preview: TogglePreview | null;
  loading: boolean;
}

const ModulesManager = () => {
  const [tenants, setTenants] = useState<string[]>([]);
  const [tenant, setTenant] = useState<string>("");
  const [graph, setGraph] = useState<Record<string, ModuleGraphNode>>({});
  const [snapshot, setSnapshot] = useState<TenantSnapshot | null>(null);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [pending, setPending] = useState<PendingToggle | null>(null);
  const [saving, setSaving] = useState(false);
  const [broadcastCode, setBroadcastCode] = useState<string | null>(null);
  const [broadcastEnabled, setBroadcastEnabled] = useState(true);
  const [broadcastTenants, setBroadcastTenants] = useState<string[]>([]);
  const [broadcasting, setBroadcasting] = useState(false);
  const [bulkIntent, setBulkIntent] = useState<boolean | null>(null);

  // Load tenants + static graph once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ts, g] = await Promise.all([modulesApi.listTenants(), modulesApi.getGraph()]);
        if (cancelled) return;
        setTenants(ts);
        setGraph(Object.fromEntries(g.map((n) => [n.code, n])));
        if (ts.length) setTenant(ts[0]);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load tenants");
      } finally {
        if (!cancelled) setLoadingTenants(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadSnapshot = async (slug: string) => {
    if (!slug) return;
    setLoadingSnapshot(true);
    setError(null);
    try {
      setSnapshot(await modulesApi.getSnapshot(slug));
    } catch (e: any) {
      setSnapshot(null);
      setError(e?.message || "Failed to load modules");
    } finally {
      setLoadingSnapshot(false);
    }
  };

  useEffect(() => {
    if (tenant) loadSnapshot(tenant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  const modules = useMemo<ModuleSnapshotItem[]>(() => {
    const raw = snapshot?.modules ?? [];
    if (!raw.length) return raw;
    const allCodes = raw.map((m) => m.code);
    const withDeps = raw.map((m) => ({
      ...m,
      dependencies: effectiveDependencies(m.code, m.dependencies, allCodes),
    }));
    const state = new Map(withDeps.map((m) => [m.code, m.isEnabled]));
    // propagate: a module whose (transitive) dependency is off cannot run
    for (let i = 0; i < withDeps.length; i++) {
      for (const m of withDeps) {
        if (m.isCore || !state.get(m.code)) continue;
        if (m.dependencies.some((d) => state.has(d) && state.get(d) === false)) {
          state.set(m.code, false);
        }
      }
    }
    return withDeps.map((m) => {
      const blocked = !m.isCore && state.get(m.code) === false && m.isEnabled;
      return {
        ...m,
        isEnabled: m.isCore ? m.isEnabled : !!state.get(m.code),
        disabledByDependency: m.disabledByDependency || blocked,
      };
    });
  }, [snapshot]);

  const activeCount = modules.filter((m) => m.isEnabled).length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return modules.filter((m) => {
      if (filter === "on" && !m.isEnabled) return false;
      if (filter === "off" && m.isEnabled) return false;
      if (filter === "core" && !m.isCore) return false;
      if (filter === "dep" && !m.disabledByDependency) return false;
      if (!q) return true;
      return m.code.toLowerCase().includes(q) || moduleLabel(m.code).toLowerCase().includes(q);
    });
  }, [modules, search, filter, tenant]);

  const requestToggle = async (m: ModuleSnapshotItem) => {
    if (m.isCore || m.disabledByDependency) return;
    const next = !m.isEnabled;
    setPending({ code: m.code, next, preview: null, loading: true });
    try {
      const server = await modulesApi.preview(m.code, next, tenant);
      const preview = mergeImpact(server, computeLocalImpact(modules, m.code, next));
      setPending({ code: m.code, next, preview, loading: false });
    } catch {
      setPending({
        code: m.code,
        next,
        preview: computeLocalImpact(modules, m.code, next),
        loading: false,
      });
    }
  };

  const confirmToggle = async (cascade = true) => {
    if (!pending) return;
    setSaving(true);
    try {
      let snap = await modulesApi.setActivation(pending.code, tenant, pending.next, cascade);
      // Enforce product-level dependencies the backend graph does not declare
      const extras = pending.next
        ? (pending.preview?.alsoEnabled ?? [])
        : (pending.preview?.alsoDisabled ?? []);
      const missing = extras.filter((c) => {
        const m = snap.modules.find((x) => x.code === c);
        return m && m.isEnabled !== pending.next;
      });
      if (missing.length) {
        snap = await modulesApi.bulk(tenant, missing, pending.next, true);
      }
      setSnapshot(snap);
      toast.success(`${moduleLabel(pending.code)} ${pending.next ? "enabled" : "disabled"} for ${tenant}`);
      setPending(null);
    } catch (e: any) {
      if (e instanceof ModulesApiError) {
        if (e.code === "coreLocked") toast.error("Core module cannot be disabled");
        else if (e.code === "unknown") toast.error("Unknown module code");
        else if (e.code === "dependencyConflict") {
          toast.error(
            `Blocked by dependents: ${(e.blockingDependents ?? []).map(moduleLabel).join(", ")}`
          );
        } else toast.error(e.message);
      } else toast.error(e?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const bulkSet = async (isEnabled: boolean) => {
    setBulkIntent(null);
    const codes = modules.filter((m) => !m.isCore).map((m) => m.code);
    if (!codes.length) return;
    setSaving(true);
    try {
      setSnapshot(await modulesApi.bulk(tenant, codes, isEnabled, true));
      toast.success(`All modules ${isEnabled ? "enabled" : "disabled"} for ${tenant}`);
    } catch (e: any) {
      toast.error(e?.message || "Bulk update failed");
    } finally {
      setSaving(false);
    }
  };

  const runBroadcast = async () => {
    if (!broadcastCode) return;
    setBroadcasting(true);
    try {
      const res = await modulesApi.broadcast({
        code: broadcastCode,
        isEnabled: broadcastEnabled,
        cascade: true,
        tenants: broadcastTenants.length ? broadcastTenants : undefined,
      });
      const errs = res?.errors ?? [];
      if (errs.length) {
        toast.error(`${errs.length} tenant(s) failed: ${errs.map((e: any) => e.tenant).join(", ")}`);
      } else {
        toast.success(
          `${moduleLabel(broadcastCode)} ${broadcastEnabled ? "enabled" : "disabled"} on ${
            broadcastTenants.length ? `${broadcastTenants.length} tenants` : "all tenants"
          }`
        );
      }
      setBroadcastCode(null);
      setBroadcastTenants([]);
      loadSnapshot(tenant);
    } catch (e: any) {
      toast.error(e?.message || "Broadcast failed");
    } finally {
      setBroadcasting(false);
    }
  };

  const pendingModule = pending ? modules.find((m) => m.code === pending.code) : null;

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Blocks className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Modules Management</h2>
            <p className="text-xs text-muted-foreground">
              Enable or disable product modules per tenant. Dependencies cascade automatically.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={tenant} onValueChange={setTenant} disabled={loadingTenants || !tenants.length}>
            <SelectTrigger className="w-48 h-9 text-xs">
              <SelectValue placeholder={loadingTenants ? "Loading tenants…" : "Select tenant"} />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((t) => (
                <SelectItem key={t} value={t} className="text-xs">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadSnapshot(tenant)}
            disabled={!tenant || loadingSnapshot}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingSnapshot ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-xs text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats + bulk */}
      {snapshot && (
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg border border-border bg-card">
          <div className="text-xs">
            <span className="font-bold text-foreground">{activeCount}</span>
            <span className="text-muted-foreground"> of {modules.length} modules active</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setBulkIntent(true)} disabled={saving}>
              Enable all
            </Button>
            <Button variant="outline" size="sm" onClick={() => setBulkIntent(false)} disabled={saving}>
              Disable all
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground ml-auto">
            Changes apply on the tenant's next activations fetch — a refresh may be needed.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search modules…"
            className="pl-9 h-9 text-xs"
          />
        </div>
        {(
          [
            ["all", "All"],
            ["on", "Enabled"],
            ["off", "Disabled"],
            ["core", "Core"],
            ["dep", "Dependency-off"],
          ] as [FilterKey, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === key
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loadingSnapshot ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : !modules.length ? (
        <div className="text-center py-16 text-xs text-muted-foreground">
          {tenant ? "No modules returned for this tenant." : "Select a tenant to manage its modules."}
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {filtered.map((m) => {
            const node = graph[m.code];
            const locked = m.isCore || m.disabledByDependency;
            return (
              <div
                key={m.code}
                className={`p-3 rounded-lg border bg-card flex items-start gap-3 ${
                  m.isEnabled ? "border-border" : "border-border/50 opacity-80"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {moduleLabel(m.code)}
                    </span>
                    {m.isCore && (
                      <Badge variant="secondary" className="h-4 px-1.5 text-[9px] gap-1">
                        <Lock className="w-2.5 h-2.5" /> Core
                      </Badge>
                    )}
                    {m.stored === null && !m.isCore && (
                      <Badge variant="outline" className="h-4 px-1.5 text-[9px]">
                        default (on)
                      </Badge>
                    )}
                    {m.disabledByDependency && (
                      <Badge variant="destructive" className="h-4 px-1.5 text-[9px] gap-1">
                        <Link2Off className="w-2.5 h-2.5" /> dependency off
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">{m.code}</p>
                  {!!m.dependencies.length && (
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      Requires: {m.dependencies.map(moduleLabel).join(", ")}
                    </p>
                  )}
                  {!!node?.transitiveDependents?.length && (
                    <p className="text-[10px] text-muted-foreground/70 truncate">
                      Impacts {node.transitiveDependents.length} module
                      {node.transitiveDependents.length > 1 ? "s" : ""}
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setBroadcastCode(m.code);
                      setBroadcastEnabled(!m.isEnabled);
                      setBroadcastTenants([]);
                    }}
                    className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                  >
                    <Globe className="w-2.5 h-2.5" /> Roll out to tenants
                  </button>
                </div>
                <Switch
                  checked={m.isEnabled}
                  disabled={locked || saving}
                  onCheckedChange={() => requestToggle(m)}
                  aria-label={`Toggle ${moduleLabel(m.code)}`}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm toggle dialog */}
      <Dialog open={!!pending} onOpenChange={(o) => !o && !saving && setPending(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              {pending?.next ? "Enable" : "Disable"} {pending ? moduleLabel(pending.code) : ""}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tenant <span className="font-semibold text-foreground">{tenant}</span>
              {pendingModule?.dependencies.length
                ? ` — requires ${pendingModule.dependencies.map(moduleLabel).join(", ")}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {pending?.loading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-4">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Calculating impact…
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {!!pending?.preview?.alsoEnabled.length && (
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    Also enabled ({pending.preview.alsoEnabled.length})
                  </p>
                  <p className="text-muted-foreground">
                    {pending.preview.alsoEnabled.map(moduleLabel).join(", ")}
                  </p>
                </div>
              )}
              {!!pending?.preview?.alsoDisabled.length && (
                <div>
                  <p className="font-semibold text-destructive mb-1">
                    Also disabled ({pending.preview.alsoDisabled.length})
                  </p>
                  <p className="text-muted-foreground">
                    {pending.preview.alsoDisabled.map(moduleLabel).join(", ")}
                  </p>
                </div>
              )}
              {!pending?.preview?.alsoEnabled.length && !pending?.preview?.alsoDisabled.length && (
                <p className="text-muted-foreground">
                  No other modules are affected by this change.
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setPending(null)} disabled={saving}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant={pending?.next ? "default" : "destructive"}
              onClick={() => confirmToggle(true)}
              disabled={saving || pending?.loading}
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
              {pending?.next ? "Enable module" : "Disable module"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk confirmation dialog */}
      <Dialog open={bulkIntent !== null} onOpenChange={(o) => !o && !saving && setBulkIntent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              {bulkIntent ? "Enable all modules" : "Disable all modules"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              This applies to every non-core module for tenant{" "}
              <span className="font-semibold text-foreground">{tenant}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="text-xs space-y-2">
            <p className="text-muted-foreground">
              {modules.filter((m) => !m.isCore).length} module(s) will be set to{" "}
              <span className={bulkIntent ? "text-foreground font-semibold" : "text-destructive font-semibold"}>
                {bulkIntent ? "enabled" : "disabled"}
              </span>
              . Core modules stay untouched.
            </p>
            {!bulkIntent && (
              <p className="flex items-start gap-1.5 text-destructive">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Users of this tenant will immediately lose access to those features.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setBulkIntent(null)} disabled={saving}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant={bulkIntent ? "default" : "destructive"}
              onClick={() => bulkSet(!!bulkIntent)}
              disabled={saving}
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
              {bulkIntent ? "Enable all" : "Disable all"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Broadcast dialog */}
      <Dialog open={!!broadcastCode} onOpenChange={(o) => !o && !broadcasting && setBroadcastCode(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              Roll out {broadcastCode ? moduleLabel(broadcastCode) : ""}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Apply the same state across multiple tenants. Leave all unchecked to target every tenant.
              Dependent modules cascade automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Set to</span>
              <Button
                size="sm"
                variant={broadcastEnabled ? "default" : "outline"}
                onClick={() => setBroadcastEnabled(true)}
              >
                Enabled
              </Button>
              <Button
                size="sm"
                variant={!broadcastEnabled ? "default" : "outline"}
                onClick={() => setBroadcastEnabled(false)}
              >
                Disabled
              </Button>
            </div>
            <div className="max-h-52 overflow-y-auto rounded-lg border border-border divide-y divide-border">
              {tenants.map((t) => (
                <label key={t} className="flex items-center gap-2 px-3 py-2 text-xs cursor-pointer">
                  <Checkbox
                    checked={broadcastTenants.includes(t)}
                    onCheckedChange={(c) =>
                      setBroadcastTenants((prev) =>
                        c ? [...prev, t] : prev.filter((x) => x !== t)
                      )
                    }
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBroadcastCode(null)}
              disabled={broadcasting}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={runBroadcast} disabled={broadcasting}>
              {broadcasting && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
              {broadcastTenants.length ? `Apply to ${broadcastTenants.length}` : "Apply to all"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModulesManager;
