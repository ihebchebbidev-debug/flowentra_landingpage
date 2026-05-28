// Admin CMS API Service all operations go through the PHP backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://luccibyey.com.tn/flowentra/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'super_admin' | 'editor';
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: AdminUser;
}

interface CmsSection {
  section_key: string;
  label: string;
  icon: string;
  sort_order: number;
  is_active: number;
}

interface CmsField {
  field_key: string;
  field_label: string;
  field_type: 'text' | 'textarea' | 'number' | 'rich_text' | 'image' | 'json';
  is_array: number;
  array_max_items: number | null;
  sort_order: number;
  placeholder: string | null;
  is_required: number;
}

interface ContentItem {
  section: string;
  key: string;
  lang: string;
  value: string;
  type?: string;
}

interface ChangeLogEntry {
  section: string;
  content_key: string;
  lang: string;
  old_value: string | null;
  new_value: string;
  changed_at: string;
  changed_by_name: string;
}

// Token management always read fresh from localStorage to avoid stale closures
function getHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `API error: ${response.status}`);
  return data;
}

// ==================== AUTH ====================

export const adminAuth = {
  async login(email: string, password: string): Promise<LoginResponse> {
    // Hardcoded admin no server round-trip needed
    const user: AdminUser = { id: 1, email: 'admin@flowentra.io', name: 'Admin', role: 'super_admin' };
    localStorage.setItem('admin_user', JSON.stringify(user));
    return { success: true, token: 'static', user };
  },

  async logout(): Promise<void> {
    localStorage.removeItem('admin_user');
  },

  async verify(): Promise<ApiResponse<AdminUser>> {
    const user: AdminUser = { id: 1, email: 'admin@flowentra.io', name: 'Admin', role: 'super_admin' };
    return { success: true, data: user };
  },

  async updateProfile(data: { name?: string; password?: string }): Promise<ApiResponse<AdminUser>> {
    return apiCall('/auth.php?action=profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStoredUser(): AdminUser | null {
    return { id: 1, email: 'admin@flowentra.io', name: 'Admin', role: 'super_admin' };
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem('admin_user');
  },
};

// ==================== CONTENT ====================

export const adminContent = {
  async getSections(): Promise<CmsSection[]> {
    const result = await apiCall<ApiResponse<CmsSection[]>>('/content.php?action=sections');
    return result.data || [];
  },

  async getFields(sectionKey: string): Promise<CmsField[]> {
    const result = await apiCall<ApiResponse<CmsField[]>>(`/content.php?action=fields&section=${sectionKey}`);
    return result.data || [];
  },

  async getSectionContent(section: string, lang: string): Promise<Record<string, { value: string; type: string }>> {
    const result = await apiCall<ApiResponse<Record<string, { value: string; type: string }>>>(`/content.php?action=get_section&section=${section}&lang=${lang}`);
    return result.data || {};
  },

  async getAllContent(): Promise<Record<string, Record<string, Record<string, string>>>> {
    const result = await apiCall<ApiResponse<Record<string, Record<string, Record<string, string>>>>>('/content.php?action=get_all');
    return result.data || {};
  },

  async saveContent(section: string, key: string, lang: string, value: string, type = 'text'): Promise<ApiResponse> {
    return await apiCall<ApiResponse>('/content.php?action=save', {
      method: 'POST',
      body: JSON.stringify({ section, key, lang, value, type }),
    });
  },

  async saveBulk(items: ContentItem[]): Promise<ApiResponse> {
    return await apiCall<ApiResponse>('/content.php?action=save_bulk', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  async getHistory(section?: string, limit = 50): Promise<ChangeLogEntry[]> {
    const params = new URLSearchParams({ action: 'history', limit: String(limit) });
    if (section) params.append('section', section);
    const result = await apiCall<ApiResponse<ChangeLogEntry[]>>(`/content.php?${params}`);
    return result.data || [];
  },

  async exportContent(): Promise<any> {
    return await apiCall('/content.php?action=export');
  },

  async importContent(data: any[]): Promise<ApiResponse> {
    return await apiCall('/content.php?action=import', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },
};

// ==================== MEDIA ====================

interface MediaFile {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  thumb_path: string | null;
  image_url: string;
  thumb_url: string | null;
  mime_type: string;
  file_size: number;
  dimensions: string | null;
  category: 'hero' | 'logo' | 'icon' | 'integration' | 'screenshot' | 'general';
  section_key: string | null;
  alt_text: string;
  uploaded_by: number | null;
  created_at: string;
}

interface MediaListResponse {
  data: MediaFile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Parse a fetch Response that should contain JSON, but may contain a PHP
 * fatal-error HTML page when the backend misbehaves. Returns a normalized
 * ApiResponse so the UI never silently swallows server problems.
 */
async function parseUploadResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    if (!response.ok && json && typeof json === 'object' && !('success' in json)) {
      return { success: false, message: json.message || `HTTP ${response.status}` } as ApiResponse<T>;
    }
    return json as ApiResponse<T>;
  } catch {
    // Server returned non-JSON (PHP fatal, HTML 500, etc.). Surface a useful hint.
    const snippet = text.slice(0, 200).replace(/\s+/g, ' ').trim();
    return {
      success: false,
      message: `Upload failed (HTTP ${response.status}). Server response: ${snippet || 'empty'}`,
    } as ApiResponse<T>;
  }
}

export const adminMedia = {
  async upload(
    file: File,
    category: string = 'general',
    altText: string = '',
    section?: string
  ): Promise<ApiResponse<MediaFile>> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);
    formData.append('alt_text', altText);
    if (section) formData.append('section', section);
    // Pass admin token via form field backend reads it as fallback when the
    // Authorization header is stripped by shared hosts (OVH etc).
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (token) formData.append('_token', token);

    const response = await fetch(`${API_BASE}/media.php?action=upload`, {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const result = await parseUploadResponse<MediaFile>(response);

    // Final guard: if the server said success but didn't return image_url,
    // synthesize it from file_path so the CMS field still gets a working URL.
    if (result.success && result.data && !result.data.image_url && (result.data as any).file_path) {
      const apiOrigin = API_BASE.replace(/\/api\/?$/, '');
      result.data.image_url = `${apiOrigin}/${(result.data as any).file_path}`;
    }
    return result;
  },

  async list(category?: string, section?: string, page = 1, limit = 50): Promise<MediaListResponse> {
    const params = new URLSearchParams({ action: 'list', page: String(page), limit: String(limit) });
    if (category) params.append('category', category);
    if (section) params.append('section', section);
    const result = await apiCall<MediaListResponse>(`/media.php?${params}`);
    return result;
  },

  async get(id: number): Promise<MediaFile | null> {
    const result = await apiCall<ApiResponse<MediaFile>>(`/media.php?action=get&id=${id}`);
    return result.data || null;
  },

  async delete(id: number): Promise<ApiResponse> {
    return await apiCall('/media.php?action=delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  async replace(id: number, file: File): Promise<ApiResponse<MediaFile>> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('id', String(id));
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (token) formData.append('_token', token);

    const response = await fetch(`${API_BASE}/media.php?action=replace`, {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const result = await parseUploadResponse<MediaFile>(response);
    if (result.success && result.data && !result.data.image_url && (result.data as any).file_path) {
      const apiOrigin = API_BASE.replace(/\/api\/?$/, '');
      result.data.image_url = `${apiOrigin}/${(result.data as any).file_path}`;
    }
    return result;
  },
};

// ==================== INBOX ====================

export interface InboxMessage {
  id: number;
  mailbox: "contact" | "support";
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  company: string;
  category: string;
  priority: string;
  subject: string;
  message: string;
  is_read: number;
  is_starred: number;
  received_at: string;
}

export interface InboxCounts {
  contact?: { total: number; unread: number };
  support?: { total: number; unread: number };
}

export const adminInbox = {
  async list(params: { mailbox?: string; unread?: boolean; starred?: boolean; page?: number; limit?: number } = {}): Promise<{
    data: InboxMessage[];
    counts: InboxCounts;
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const q = new URLSearchParams({ action: "list" });
    if (params.mailbox) q.set("mailbox", params.mailbox);
    if (params.unread) q.set("unread", "1");
    if (params.starred) q.set("starred", "1");
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    return apiCall(`/inbox.php?${q}`);
  },

  async markRead(ids: number[]): Promise<void> {
    await apiCall("/inbox.php?action=mark_read", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
  },

  async toggleStar(id: number): Promise<void> {
    await apiCall("/inbox.php?action=toggle_star", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },

  async delete(id: number): Promise<void> {
    await apiCall("/inbox.php?action=delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },
};

// ==================== ERROR LOGS ====================

export interface ErrorLogEntry {
  id: number;
  type: "javascript" | "api" | "php" | "network";
  severity: "error" | "warning" | "info";
  message: string;
  stack: string | null;
  url: string | null;
  user_agent: string | null;
  ip: string | null;
  context: string | null;
  is_resolved: number;
  occurred_at: string;
}

export interface ErrorSummaryEntry {
  type: string;
  severity: string;
  unresolved: number;
  total: number;
}

export const adminErrors = {
  async list(params: { type?: string; resolved?: "0" | "1"; severity?: string; page?: number; limit?: number } = {}): Promise<{
    data: ErrorLogEntry[];
    summary: ErrorSummaryEntry[];
    unresolved_total: number;
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const q = new URLSearchParams({ action: "list" });
    if (params.type) q.set("type", params.type);
    if (params.resolved !== undefined) q.set("resolved", params.resolved);
    if (params.severity) q.set("severity", params.severity);
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    return apiCall(`/errors.php?${q}`);
  },

  async resolve(ids: number[], resolved = true): Promise<void> {
    await apiCall("/errors.php?action=resolve", {
      method: "POST",
      body: JSON.stringify({ ids, resolved }),
    });
  },

  async delete(id: number): Promise<void> {
    await apiCall("/errors.php?action=delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },

  async clearResolved(): Promise<void> {
    await apiCall("/errors.php?action=clear_resolved", { method: "POST", body: "{}" });
  },
};

// ==================== SCREENSHOTS ====================

export interface ScreenshotFile {
  name: string;
  folder: "hero-screenshots" | "screenshots";
  size: number;
  modified: number;
  url: string;
}

export const adminScreenshots = {
  async list(): Promise<{ "hero-screenshots": ScreenshotFile[]; screenshots: ScreenshotFile[] }> {
    const res = await apiCall<{ success: boolean; data: { "hero-screenshots": ScreenshotFile[]; screenshots: ScreenshotFile[] } }>("/screenshots.php?action=list");
    return res.data;
  },

  async upload(folder: string, file: File, filename?: string): Promise<ScreenshotFile> {
    const form = new FormData();
    form.append("folder", folder);
    form.append("file", file);
    if (filename) form.append("filename", filename);
    const token = localStorage.getItem("admin_token");
    const response = await fetch(`${API_BASE}/screenshots.php?action=upload`, {
      method: "POST",
      body: form,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message || "Upload failed");
    return json.data;
  },

  async delete(folder: string, name: string): Promise<void> {
    const res = await apiCall<{ success: boolean; message?: string }>("/screenshots.php?action=delete", {
      method: "POST",
      body: JSON.stringify({ folder, name }),
    });
    if (!res.success) throw new Error(res.message || "Delete failed");
  },
};

export type { AdminUser, CmsSection, CmsField, ContentItem, ChangeLogEntry, MediaFile };
