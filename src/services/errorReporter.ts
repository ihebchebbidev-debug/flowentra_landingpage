/**
 * Global error reporter — sends JS errors and unhandled rejections to the backend.
 * Call initErrorReporter() once at app startup (main.tsx).
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://luccibyey.com.tn/flowentra/api";
const ENDPOINT = `${API_BASE}/errors.php?action=report`;
const LOG_ENDPOINT = `${API_BASE}/log.php?action=report`;

// Deduplicate: don't fire the same message twice within 10 s
const recentlySent = new Set<string>();
const recentlySentEvents = new Set<string>();

export function reportError(
  type: "javascript" | "api" | "network",
  message: string,
  options: {
    severity?: "error" | "warning" | "info";
    stack?: string;
    context?: Record<string, unknown>;
  } = {}
) {
  const key = `${type}::${message}`;
  if (recentlySent.has(key)) return;
  recentlySent.add(key);
  setTimeout(() => recentlySent.delete(key), 10_000);

  const payload = {
    type,
    severity: options.severity ?? "error",
    message: String(message).slice(0, 2000),
    stack: options.stack?.slice(0, 5000),
    url: window.location.href,
    context: options.context,
  };

  // fire-and-forget — never let the reporter itself throw
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export function reportEvent(
  message: string,
  options: {
    category?: string;
    action?: string;
    severity?: "error" | "warning" | "info";
    context?: Record<string, unknown>;
  } = {}
) {
  const key = `${options.category ?? "general"}::${options.action ?? "event"}::${message}`;
  if (recentlySentEvents.has(key)) return;
  recentlySentEvents.add(key);
  setTimeout(() => recentlySentEvents.delete(key), 10_000);

  const payload = {
    category: options.category ?? "general",
    action: options.action ?? "event",
    level: options.severity ?? "info",
    message: String(message).slice(0, 2000),
    url: window.location.href,
    context: options.context,
  };

  fetch(LOG_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export function reportLog(
  message: string,
  options: {
    severity?: "error" | "warning" | "info";
    context?: Record<string, unknown>;
    type?: "javascript" | "api" | "network";
  } = {}
) {
  reportEvent(message, {
    category: options.type ?? "api",
    action: "event",
    severity: options.severity ?? "info",
    context: options.context,
  });
}

export function initErrorReporter() {
  // Uncaught synchronous JS errors
  window.addEventListener("error", (event) => {
    reportError("javascript", event.message || "Unknown error", {
      stack: event.error?.stack,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  // Unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const message =
      reason instanceof Error
        ? reason.message
        : typeof reason === "string"
        ? reason
        : JSON.stringify(reason);
    reportError("javascript", `Unhandled rejection: ${message}`, {
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });
}
