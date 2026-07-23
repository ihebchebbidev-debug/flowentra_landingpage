// Tickets API - talks to the multi-tenant tickets service
const TICKETS_API_BASE = import.meta.env.VITE_TICKETS_API_BASE || "https://api.flowentra.app/api/public";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketOriginType = "manual" | "auto";

export interface TicketReporter {
  email?: string | null;
  name?: string | null;
  isAnonymous?: boolean;
  isSystem?: boolean;
}

export interface TicketOrigin {
  type: TicketOriginType;
  source?: string | null;
}

export interface Ticket {
  id: number | string;
  tenant: string;
  title?: string;
  subject?: string;
  description?: string;
  status: TicketStatus;
  priority?: string | null;
  category?: string | null;
  origin: TicketOrigin;
  reporter: TicketReporter;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: any;
}

export interface TicketComment {
  id: number | string;
  text: string;
  author?: string;
  authorEmail?: string;
  isInternal?: boolean;
  createdAt?: string;
}

export interface TenantInfo {
  id?: string;
  name?: string;
  slug?: string;
  [k: string]: any;
}

export interface TicketListResponse {
  data: Ticket[];
  pagination?: { page: number; pageSize: number; total: number; pages?: number };
  total?: number;
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${TICKETS_API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }
  if (!res.ok) {
    const msg = (json && (json.message || json.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json as T;
}

export interface TicketsQuery {
  tenant?: string;
  status?: TicketStatus | "";
  origin?: TicketOriginType | "";
  userEmail?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const ticketsApi = {
  async listTenants(): Promise<TenantInfo[]> {
    const res = await req<any>("/tenants");
    if (Array.isArray(res)) return res;
    return res?.data ?? res?.tenants ?? [];
  },

  async listTickets(q: TicketsQuery = {}): Promise<TicketListResponse> {
    const p = new URLSearchParams();
    if (q.tenant) p.set("tenant", q.tenant);
    if (q.status) p.set("status", q.status);
    if (q.origin) p.set("origin", q.origin);
    if (q.userEmail) p.set("userEmail", q.userEmail);
    if (q.search) p.set("search", q.search);
    if (q.page) p.set("page", String(q.page));
    if (q.pageSize) p.set("pageSize", String(q.pageSize));
    const qs = p.toString();
    const res = await req<any>(`/tickets${qs ? `?${qs}` : ""}`);
    if (Array.isArray(res)) return { data: res };
    return {
      data: res?.items ?? res?.data ?? res?.tickets ?? [],
      pagination: res?.pagination,
      total: res?.total ?? res?.pagination?.total ?? res?.items?.length,
    };
  },

  async getTicket(tenant: string, id: number | string): Promise<Ticket> {
    const res = await req<any>(`/tickets/${encodeURIComponent(tenant)}/${id}`);
    return res?.data ?? res;
  },

  async setStatus(tenant: string, id: number | string, status: TicketStatus): Promise<void> {
    await req(`/tickets/${encodeURIComponent(tenant)}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async listComments(tenant: string, id: number | string): Promise<TicketComment[]> {
    const res = await req<any>(`/tickets/${encodeURIComponent(tenant)}/${id}/comments`);
    if (Array.isArray(res)) return res;
    return res?.data ?? res?.comments ?? [];
  },

  async addComment(
    tenant: string,
    id: number | string,
    body: { text: string; author?: string; authorEmail?: string; isInternal?: boolean }
  ): Promise<TicketComment> {
    const res = await req<any>(`/tickets/${encodeURIComponent(tenant)}/${id}/comments`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return res?.data ?? res;
  },
};
