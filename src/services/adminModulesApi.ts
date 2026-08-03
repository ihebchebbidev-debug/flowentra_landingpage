// Modules (plugins) management API — multi-tenant admin surface
const MODULES_API_BASE =
  import.meta.env.VITE_MODULES_API_BASE || "https://api.flowentra.app/api/public/plugins";

export interface ModuleGraphNode {
  code: string;
  isCore: boolean;
  dependencies: string[];
  transitiveDependencies: string[];
  transitiveDependents: string[];
}

export interface ModuleSnapshotItem {
  code: string;
  isCore: boolean;
  dependencies: string[];
  /** null = never toggled = default ON */
  stored: boolean | null;
  /** effective, after dependency resolution */
  isEnabled: boolean;
  disabledByDependency: boolean;
}

export interface TenantSnapshot {
  tenant?: string;
  modules: ModuleSnapshotItem[];
  active?: number;
  total?: number;
}

export interface AllTenantsSnapshot {
  tenants: TenantSnapshot[];
  errors?: { tenant: string; message: string }[];
}

export interface TogglePreview {
  alsoEnabled: string[];
  alsoDisabled: string[];
}

export class ModulesApiError extends Error {
  code?: string;
  status: number;
  blockingDependents?: string[];
  constructor(message: string, status: number, code?: string, blockingDependents?: string[]) {
    super(message);
    this.status = status;
    this.code = code;
    this.blockingDependents = blockingDependents;
  }
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${MODULES_API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    const code = json?.code || json?.error;
    const msg = json?.message || code || `HTTP ${res.status}`;
    throw new ModulesApiError(msg, res.status, code, json?.blockingDependents);
  }
  return json as T;
}

function normalizeSnapshot(raw: any, tenant?: string): TenantSnapshot {
  const modules: ModuleSnapshotItem[] = (raw?.modules ?? raw?.data?.modules ?? raw ?? []).map(
    (m: any) => ({
      code: m.code,
      isCore: !!m.isCore,
      dependencies: m.dependencies ?? [],
      stored: m.stored === undefined ? null : m.stored,
      isEnabled: m.isEnabled !== false,
      disabledByDependency: !!m.disabledByDependency,
    })
  );
  return {
    tenant: raw?.tenant ?? tenant,
    modules,
    active: raw?.active ?? modules.filter((m) => m.isEnabled).length,
    total: raw?.total ?? modules.length,
  };
}

export const modulesApi = {
  async listTenants(): Promise<string[]> {
    const res = await req<any>("/tenants");
    const arr = Array.isArray(res) ? res : res?.data ?? res?.tenants ?? [];
    return arr.map((t: any) => (typeof t === "string" ? t : t.slug ?? t.tenant ?? t.name));
  },

  async getGraph(): Promise<ModuleGraphNode[]> {
    const res = await req<any>("/graph");
    const arr = Array.isArray(res) ? res : res?.data ?? res?.modules ?? [];
    return arr.map((n: any) => ({
      code: n.code,
      isCore: !!n.isCore,
      dependencies: n.dependencies ?? [],
      transitiveDependencies: n.transitiveDependencies ?? [],
      transitiveDependents: n.transitiveDependents ?? [],
    }));
  },

  async getSnapshot(tenant: string): Promise<TenantSnapshot> {
    const res = await req<any>(`/?tenant=${encodeURIComponent(tenant)}`);
    return normalizeSnapshot(res, tenant);
  },

  async getAll(tenant?: string): Promise<AllTenantsSnapshot> {
    const qs = tenant ? `?tenant=${encodeURIComponent(tenant)}` : "";
    const res = await req<any>(`/all${qs}`);
    const rawTenants = Array.isArray(res) ? res : res?.tenants ?? res?.data ?? [];
    return {
      tenants: rawTenants.map((t: any) => normalizeSnapshot(t, t?.tenant)),
      errors: res?.errors ?? [],
    };
  },

  async preview(code: string, isEnabled: boolean, tenant: string): Promise<TogglePreview> {
    const res = await req<any>(
      `/preview/${encodeURIComponent(code)}?isEnabled=${isEnabled}&tenant=${encodeURIComponent(tenant)}`
    );
    const d = res?.data ?? res ?? {};
    return { alsoEnabled: d.alsoEnabled ?? [], alsoDisabled: d.alsoDisabled ?? [] };
  },

  async setActivation(
    code: string,
    tenant: string,
    isEnabled: boolean,
    cascade = true
  ): Promise<TenantSnapshot> {
    const res = await req<any>(`/${encodeURIComponent(code)}?tenant=${encodeURIComponent(tenant)}`, {
      method: "PATCH",
      body: JSON.stringify({ isEnabled, cascade }),
    });
    return normalizeSnapshot(res?.snapshot ?? res?.data?.snapshot ?? res?.data ?? res, tenant);
  },

  async bulk(
    tenant: string,
    codes: string[],
    isEnabled: boolean,
    cascade = true
  ): Promise<TenantSnapshot> {
    const res = await req<any>(`/bulk?tenant=${encodeURIComponent(tenant)}`, {
      method: "POST",
      body: JSON.stringify({ codes, isEnabled, cascade }),
    });
    return normalizeSnapshot(res?.snapshot ?? res?.data?.snapshot ?? res?.data ?? res, tenant);
  },

  async broadcast(body: {
    code: string;
    isEnabled: boolean;
    cascade?: boolean;
    tenants?: string[];
  }): Promise<{ errors?: { tenant: string; message: string }[]; [k: string]: any }> {
    const res = await req<any>(`/broadcast`, {
      method: "POST",
      body: JSON.stringify({ cascade: true, ...body }),
    });
    return res?.data ?? res ?? {};
  },
};

/** Human-friendly label derived from a plugin code like PL0001CONTACTS. */
export function moduleLabel(code: string): string {
  const m = /^PL\d{4}(.+)$/.exec(code);
  const raw = m ? m[1] : code;
  const map: Record<string, string> = {
    CONTACTS: "Contacts",
    SALES: "Sales Orders",
    DEALS: "Deals",
    PROJECTS: "Projects",
    INVOICES: "Invoices",
    OFFERS: "Offers",
    SUPPORT: "Support",
    ARTICLES: "Articles",
    INVSERVICES: "Inventory Services",
    STOCK: "Stock Management",
    CALENDAR: "Calendar",
    TASKS: "Tasks",
    DOCUMENTS: "Documents",
    HR: "Human Resources",
    SKILLS: "Skills",
    FIELD: "Field Service",
    INSTALLATIONS: "Installations",
    SERVICEORDERS: "Service Orders",
    DISPATCHES: "Dispatches",
    SCHEDULING: "Scheduling",
    DISPATCHER: "Dispatcher",
    PURCHASES: "Purchases",
    PAYMENTS: "Payments",
    COMMUNICATION: "Communication",
    EMAILCALENDAR: "Email & Calendar",
    NOTIFICATIONS: "Notifications",
    EXTERNAL: "External APIs",
    WORKFLOW: "Workflows",
    DYNAMICFORMS: "Dynamic Forms",
    SYSTEM: "System",
    SETTINGS: "Settings",
    AUTH: "Authentication",
    DASHBOARD: "Dashboard",
    LOOKUPS: "Lookups",
    WEBSITEBLDR: "Website Builder",
    DASHBLDR: "Dashboard Builder",
    ANALYTICS: "Analytics",
    REPORTING: "Reporting",
    AIASSISTANT: "AI Assistant",
    AUTOMATION: "Automation",
    USERS: "Users",
    PREFERENCES: "Preferences",
    ONBOARDING: "Onboarding",
  };
  return map[raw] ?? raw.charAt(0) + raw.slice(1).toLowerCase();
}

/* -------------------------------------------------------------------------- */
/* Product-level dependency rules (client-side augmentation)                  */
/* -------------------------------------------------------------------------- */
/**
 * Some functional dependencies are not declared in the backend plugin graph but
 * are real product constraints: e.g. Installations cannot operate without
 * Contacts, Offers, Sales Orders, Service Orders and Dispatches.
 * Keys/values are code *suffixes* so they match regardless of the PLxxxx number.
 */
export const EXTRA_DEPENDENCIES: Record<string, string[]> = {
  INSTALLATIONS: ["CONTACTS", "OFFERS", "SALES", "SERVICEORDERS", "DISPATCHES", "FIELD"],
  SERVICEORDERS: ["CONTACTS", "FIELD"],
  DISPATCHES: ["FIELD", "SERVICEORDERS"],
  DISPATCHER: ["FIELD"],
  SCHEDULING: ["FIELD"],
  OFFERS: ["CONTACTS"],
  SALES: ["CONTACTS"],
  INVOICES: ["CONTACTS", "SALES"],
  DEALS: ["CONTACTS"],
  PROJECTS: ["CONTACTS"],
  STOCK: ["ARTICLES"],
};

export function codeSuffix(code: string): string {
  const m = /^PL\d{4}(.+)$/.exec(code);
  return (m ? m[1] : code).toUpperCase();
}

/** Declared + product-level dependencies for a module, limited to known codes. */
export function effectiveDependencies(
  code: string,
  declared: string[],
  allCodes: string[]
): string[] {
  const bySuffix = new Map(allCodes.map((c) => [codeSuffix(c), c]));
  const extra = (EXTRA_DEPENDENCIES[codeSuffix(code)] ?? [])
    .map((s) => bySuffix.get(s))
    .filter((c): c is string => !!c && c !== code);
  return Array.from(new Set([...(declared ?? []), ...extra]));
}

/**
 * Full cascade impact of toggling `code`, using declared + product-level rules.
 * - enabling  → every (transitive) dependency that is currently off turns on
 * - disabling → every (transitive) dependent that is currently on turns off
 */
export function computeLocalImpact(
  modules: ModuleSnapshotItem[],
  code: string,
  next: boolean
): TogglePreview {
  const allCodes = modules.map((m) => m.code);
  const deps = new Map<string, string[]>();
  for (const m of modules) deps.set(m.code, effectiveDependencies(m.code, m.dependencies, allCodes));
  const state = new Map(modules.map((m) => [m.code, m.isEnabled]));
  const core = new Map(modules.map((m) => [m.code, m.isCore]));

  const alsoEnabled: string[] = [];
  const alsoDisabled: string[] = [];

  if (next) {
    const walk = (c: string, seen = new Set<string>()) => {
      for (const d of deps.get(c) ?? []) {
        if (seen.has(d)) continue;
        seen.add(d);
        if (state.get(d) === false && !alsoEnabled.includes(d)) alsoEnabled.push(d);
        walk(d, seen);
      }
    };
    walk(code);
  } else {
    const dependentsOf = (target: string) =>
      modules.filter((m) => (deps.get(m.code) ?? []).includes(target)).map((m) => m.code);
    const queue = [code];
    const seen = new Set([code]);
    while (queue.length) {
      const cur = queue.shift()!;
      for (const dep of dependentsOf(cur)) {
        if (seen.has(dep)) continue;
        seen.add(dep);
        if (state.get(dep) !== false && !core.get(dep) && !alsoDisabled.includes(dep)) {
          alsoDisabled.push(dep);
        }
        queue.push(dep);
      }
    }
  }
  return { alsoEnabled, alsoDisabled };
}

/** Union of server preview and local product-level rules. */
export function mergeImpact(a: TogglePreview, b: TogglePreview): TogglePreview {
  return {
    alsoEnabled: Array.from(new Set([...a.alsoEnabled, ...b.alsoEnabled])),
    alsoDisabled: Array.from(new Set([...a.alsoDisabled, ...b.alsoDisabled])),
  };
}
