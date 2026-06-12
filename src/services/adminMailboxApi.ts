// IMAP Mailbox API — reads real OVH mailboxes (INBOX, Sent, Spam, Trash)

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://luccibyey.com.tn/flowentra/api';

async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `API error: ${response.status}`);
  return data;
}

// ==================== Types ====================

export interface ImapSettings {
  host: string;
  port: number;
  encryption: 'ssl' | 'tls' | 'none';
  validate_cert: number;
  username: string;
  password: string;
}

export interface MailFolder {
  name: string;
  display: string;
  messages: number;
  unseen: number;
}

export interface MailListItem {
  uid: number;
  subject: string;
  from: string;
  from_email: string;
  to: string;
  date: string;
  timestamp: number;
  seen: boolean;
  flagged: boolean;
  answered: boolean;
  size: number;
}

export interface MailAttachment {
  name: string;
  size: number;
  part: string;
  type: string;
}

export interface MailMessage {
  uid: number;
  subject: string;
  from: string;
  to: string;
  date: string;
  timestamp: number;
  html: string;
  plain: string;
  attachments: MailAttachment[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ==================== API Methods ====================

export const adminMailbox = {
  async getSettings(): Promise<{ data: ImapSettings | null; imap_enabled: boolean }> {
    return apiCall('/imap.php?action=get_settings');
  },

  async saveSettings(settings: Partial<ImapSettings>): Promise<void> {
    await apiCall('/imap.php?action=save_settings', { method: 'POST', body: JSON.stringify(settings) });
  },

  async test(): Promise<{ success: boolean; message?: string }> {
    return apiCall('/imap.php?action=test', { method: 'POST' });
  },

  async getFolders(): Promise<MailFolder[]> {
    const r = await apiCall<{ success: boolean; data: MailFolder[] }>('/imap.php?action=folders');
    return r.data || [];
  },

  async list(folder: string, page = 1, search = ''): Promise<{ data: MailListItem[]; pagination: Pagination }> {
    const params = new URLSearchParams({ action: 'list', folder, page: String(page) });
    if (search) params.append('search', search);
    return apiCall(`/imap.php?${params}`);
  },

  async getMessage(folder: string, uid: number, markSeen = true): Promise<MailMessage> {
    const params = new URLSearchParams({ action: 'message', folder, uid: String(uid), mark_seen: markSeen ? '1' : '0' });
    const r = await apiCall<{ success: boolean; data: MailMessage }>(`/imap.php?${params}`);
    return r.data;
  },

  attachmentUrl(folder: string, uid: number, part: string, name: string): string {
    const params = new URLSearchParams({ action: 'attachment', folder, uid: String(uid), part, name });
    return `${API_BASE}/imap.php?${params}`;
  },

  async mark(folder: string, uid: number, seen: boolean): Promise<void> {
    await apiCall('/imap.php?action=mark', { method: 'POST', body: JSON.stringify({ folder, uid, seen }) });
  },

  async flag(folder: string, uid: number, flagged: boolean): Promise<void> {
    await apiCall('/imap.php?action=flag', { method: 'POST', body: JSON.stringify({ folder, uid, flagged }) });
  },

  async move(folder: string, uid: number, to: string): Promise<void> {
    await apiCall('/imap.php?action=move', { method: 'POST', body: JSON.stringify({ folder, uid, to }) });
  },

  async remove(folder: string, uid: number): Promise<void> {
    await apiCall('/imap.php?action=delete', { method: 'POST', body: JSON.stringify({ folder, uid }) });
  },
};
