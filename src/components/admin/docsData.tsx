import {
  BookOpen, History, ShieldCheck, Mail, BarChart3, Settings,
  AlertCircle, CheckCircle2, Lightbulb, Hash,
  ShieldAlert, Loader2, Pencil, ArrowRight, Inbox, ImageIcon,
} from "lucide-react";

// ──────────────────────────────────────────────────────────────────────
// Doc structure shared by AdminDocs (full page) and SectionHelpDrawer
// ──────────────────────────────────────────────────────────────────────
export interface DocSubsection {
  title: string;
  body: string;
  tip?: string;
  warn?: string;
}
export interface DocSection {
  id: string;
  title: string;
  group: string;
  icon: React.ElementType;
  intro: string;
  fields?: { name: string; type: string; desc: string }[];
  steps?: string[];
  subsections?: DocSubsection[];
}

export const GROUPS = ["Basics", "Admin Tools", "Reference"];

export const DOCS: DocSection[] = [
  // ── Basics ────────────────────────────────────────────────────────
  {
    id: "getting-started",
    title: "Getting started",
    group: "Basics",
    icon: BookOpen,
    intro:
      "Welcome to the Flowentra admin panel. This panel provides operational tools for managing emails, tracking analytics, reviewing change history, and configuring global site settings. All page content and structure is managed directly in the codebase by developers.",
    subsections: [
      {
        title: "What the admin panel does",
        body:
          "Documentation — this guide.\n" +
          "Inbox — read messages submitted via the Contact and Support forms (contact@flowentra.io / support@flowentra.io).\n" +
          "Screenshots — upload, replace or delete images in the hero-screenshots and screenshots folders.\n" +
          "Email Manager — configure SMTP, send campaigns, manage templates.\n" +
          "Analytics — visitor counts, page views, top pages, country and source breakdowns.\n" +
          "Site Settings — admin password, SEO defaults, maintenance mode.\n" +
          "Change History — full log of every save; restore any previous state with one click (clock icon, top bar).",
      },
      {
        title: "What is managed by developers (not this panel)",
        body:
          "All page content (text, images, links, pricing, features, navigation) is hard-coded in the React codebase and deployed via Git. To change any visible copy or layout, a developer edits the relevant file and pushes a new build.",
        tip: "If you need a content change on the live site, open a request to the dev team with the exact text you want updated and where it appears.",
      },
      {
        title: "Top-bar buttons",
        body:
          "🕒 History — full change log; restore any previous version.\n" +
          "⬇️ Export — downloads all CMS content as a JSON backup file.\n" +
          "⬆️ Import — restores content from a JSON backup (overwrites current).\n" +
          "🚪 Logout — ends your admin session.",
        tip: "Click Export before making big changes — it gives you a one-click rollback file.",
      },
    ],
  },

  // ── Admin Tools ───────────────────────────────────────────────────
  {
    id: "inbox",
    title: "Inbox",
    group: "Admin Tools",
    icon: Inbox,
    intro:
      "The Inbox collects every message submitted through the Contact form (contact@flowentra.io) and the Support form (support@flowentra.io). Messages are stored in the database and displayed here so you never need to log into a mail client to read them.",
    subsections: [
      {
        title: "How messages arrive",
        body:
          "When a visitor submits the Contact or Support form, two things happen simultaneously:\n" +
          "1. An email is sent to the relevant address via SMTP (as before).\n" +
          "2. The message is saved to the database and immediately appears in the Inbox.\n\n" +
          "If SMTP fails the message is still saved in the Inbox, so no submission is ever lost.",
      },
      {
        title: "Mailbox tabs",
        body:
          "All — shows every message from both forms.\n" +
          "contact@flowentra.io — messages from the Contact page (Sales, Consultancy, Others).\n" +
          "support@flowentra.io — messages from the Support page (with category and priority).\n\n" +
          "Each tab shows an unread badge that updates as you open messages.",
      },
      {
        title: "Reading a message",
        body:
          "Click any row to open the full message in the detail pane. The unread dot disappears and the unread count decreases automatically.\n\n" +
          "The detail pane shows: sender name, email, phone, company, category, priority, date and the full message text.",
      },
      {
        title: "Replying",
        body:
          "Click 'Reply in email client' at the bottom of the detail pane. This opens your default email client pre-filled with the sender's address and a Re: subject line.",
        tip: "For bulk replies or campaigns, use the Email Manager instead.",
      },
      {
        title: "Starring and deleting",
        body:
          "Star (☆) — marks a message for follow-up. Use the 'Starred' filter in the header to see only starred messages.\n" +
          "Delete (🗑) — permanently removes the message from the database. You will be asked to confirm.",
        warn: "Deletion is permanent. There is no recycle bin — deleted messages cannot be recovered.",
      },
      {
        title: "Filters",
        body:
          "'Unread only' — shows only messages you haven't opened yet.\n" +
          "'Starred' — shows only starred messages.\n\n" +
          "Both filters combine with the active mailbox tab, so 'Unread only' + 'contact@' shows only unread contact messages.",
      },
      {
        title: "Server requirement",
        body:
          "The Inbox requires inbox.php to be deployed on the server at …/flowentra/api/inbox.php. The database table (flowentra_inbox) is created automatically on first load — no manual migration needed.",
        warn: "If you see 'Could not load inbox', the inbox.php file is not yet on the server. Upload it from src/backend/api/inbox.php.",
      },
    ],
  },
  {
    id: "screenshots",
    title: "Screenshots",
    group: "Admin Tools",
    icon: ImageIcon,
    intro:
      "The Screenshots manager lets you view, replace, upload and delete the images stored in two folders on the server: hero-screenshots (used in the homepage hero section) and screenshots (used in the Product Showcase section).",
    subsections: [
      {
        title: "Folders explained",
        body:
          "hero-screenshots — six images displayed in the hero module switcher (hero-dashbord.png, hero-fsm.png, hero-workflow.png, hero-crm.png, etc.). Each matches a tab in the animated hero.\n\n" +
          "screenshots — seven images displayed in the Product Showcase cards (showcase-quotes-sales.png, showcase-dashbord.png, etc.). Each matches one showcase item.",
      },
      {
        title: "Replacing an existing screenshot",
        body:
          "Hover over any thumbnail and click the blue Upload button (↑) that appears. Pick a new image file. The file is saved under the same filename, so all page references update automatically with no code change needed.",
        tip: "Use the same filename when replacing. If you upload under a different name, the old file remains and the page will still show the old image until a developer updates the code reference.",
      },
      {
        title: "Uploading a new screenshot",
        body:
          "Click the dashed drop zone at the top of the active folder, or drag image files directly onto it. New files are saved with their original filename. You can upload multiple files at once.",
        warn: "Uploading a new file does not automatically display it on the site. A developer still needs to reference the new filename in the codebase.",
      },
      {
        title: "Deleting a screenshot",
        body:
          "Hover over a thumbnail and click the red Delete button (🗑). You will be asked to confirm. The file is permanently removed from the server.",
        warn: "Deleting a file that is still referenced in code will cause a broken image on the live site. Only delete files that are no longer used, or replace them first.",
      },
      {
        title: "Previewing full size",
        body:
          "Click any thumbnail (or the external link icon) to open a full-size preview modal. From the modal you can also replace the image directly.",
      },
      {
        title: "Supported formats",
        body:
          "PNG, JPG/JPEG, WebP, GIF, SVG. Maximum file size: 10 MB per image.\n\n" +
          "For best results, use PNG or WebP for screenshots (lossless / near-lossless quality, transparent background support). Keep hero images under 500 KB for fast page loads.",
        tip: "Compress images before uploading at squoosh.app or tinypng.com — a well-compressed 1920×1080 PNG is typically under 200 KB.",
      },
      {
        title: "Server requirement",
        body:
          "The Screenshots manager requires screenshots.php to be deployed on the server at …/flowentra/api/screenshots.php. The PHP file handles listing, uploading and deleting files in the two folders.",
        warn: "If you see 'Could not load screenshots', the screenshots.php file is not yet on the server. Upload it from src/backend/api/screenshots.php.",
      },
    ],
  },
  {
    id: "email",
    title: "Email Manager",
    group: "Admin Tools",
    icon: Mail,
    intro:
      "Configure your outbound SMTP connection, send broadcast email campaigns, manage reusable templates, and view the full history of sent emails.",
    subsections: [
      {
        title: "SMTP setup",
        body:
          "Email Manager → SMTP Settings. Enter your host, port, username, password and the 'From' address. Click 'Send test email' to verify the connection before saving.",
        warn: "If SMTP is not configured, contact-form submissions and campaigns will not be delivered to recipients.",
      },
      {
        title: "Sending a campaign",
        body:
          "Email Manager → Campaigns → New → select a template → choose recipients → send a test to yourself → click Send.\n" +
          "All sent campaigns appear in the History tab with delivery status.",
      },
      {
        title: "Managing templates",
        body:
          "Create reusable HTML or plain-text templates under Email Manager → Templates. Reference a template when creating a campaign or an automated trigger.",
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics dashboard",
    group: "Admin Tools",
    icon: BarChart3,
    intro:
      "Built-in visitor analytics — no Google Analytics or third-party tracking needed. Tracks page views, unique visitors, top pages, traffic sources, and country breakdowns.",
    subsections: [
      {
        title: "What is tracked",
        body:
          "Page views per URL.\n" +
          "Unique visitors (by session).\n" +
          "Top 10 most-visited pages.\n" +
          "Referrer / traffic source (direct, social, search, etc.).\n" +
          "Visitor country (based on IP geolocation).",
      },
      {
        title: "Date range",
        body:
          "Use the date picker at the top of the dashboard to filter by day, week, month or a custom range. All data is stored server-side and is always available historically.",
        tip: "The dashboard refreshes automatically every 60 seconds when open.",
      },
    ],
  },
  {
    id: "history",
    title: "Change history & rollback",
    group: "Admin Tools",
    icon: History,
    intro:
      "Every save in the admin creates a history entry. See who changed what, when it happened, and restore any previous version with one click.",
    steps: [
      "Click the clock icon (🕒) in the top bar.",
      "Filter by section, user or date range.",
      "Click any entry to see what changed.",
      "Click 'Restore' to replace the current content with that saved version.",
    ],
    subsections: [
      {
        title: "How long history is kept",
        body:
          "History entries are kept indefinitely. You can restore any entry regardless of how old it is.",
        tip: "Always check history before escalating a 'the site broke' report — the fix is usually a one-click restore.",
      },
    ],
  },
  {
    id: "settings",
    title: "Site Settings",
    group: "Admin Tools",
    icon: Settings,
    intro:
      "Global configuration: admin password, SEO meta defaults, maintenance mode, and admin user management.",
    subsections: [
      {
        title: "Changing your admin password",
        body:
          "Site Settings → Security → Change Password. Enter your current password, then the new one twice. The change takes effect immediately on your next login.",
        warn: "There is no 'forgot password' email if SMTP is not configured. Keep a secure backup of your admin credentials.",
      },
      {
        title: "SEO defaults",
        body:
          "Set the default page title, meta description, OpenGraph image, Twitter handle and favicon. These are used on any page that does not have its own SEO overrides.",
      },
      {
        title: "Maintenance mode",
        body:
          "Enabling maintenance mode shows a branded 'We'll be back soon' page to all visitors. Admins can still access /admin normally.",
        warn: "Remember to turn maintenance mode OFF when your work is done — visitors cannot see the site while it is active.",
      },
      {
        title: "Admin users",
        body:
          "Add or remove admin accounts under Site Settings → Users. Each user has their own login and all their saves appear individually in Change History.",
      },
    ],
  },

  // ── Reference ─────────────────────────────────────────────────────
  {
    id: "security",
    title: "Access & security",
    group: "Reference",
    icon: ShieldCheck,
    intro:
      "The admin panel is accessible at /admin. Visiting this URL automatically opens an authenticated session stored in localStorage.",
    subsections: [
      {
        title: "Session storage",
        body:
          "The admin session token is stored in localStorage under 'admin_token'. Clearing browser data or opening a private window will end the session.",
      },
      {
        title: "Recommended practices",
        body:
          "Do not share the admin URL on public channels.\n" +
          "Change the default admin password immediately after first setup.\n" +
          "Add individual user accounts for each team member — never share credentials.\n" +
          "Review Change History periodically to spot unexpected changes.",
      },
    ],
  },
  {
    id: "loading-screen",
    title: "Landing-page loading screen",
    group: "Reference",
    icon: Loader2,
    intro:
      "First-time visitors of the homepage see a branded loading screen — the Flowentra logo with pulsing rings and animated dots — while page assets finish loading. It only shows once per browser session.",
    subsections: [
      {
        title: "When it appears",
        body:
          "Only on the landing page (/), and only the first time per browser session. Navigating between pages or returning to the same tab later will NOT trigger it again.",
      },
      {
        title: "Customising it",
        body:
          "The logo is sourced from src/assets/flowentra-logo.png in the codebase. Replace that file (same filename) and redeploy to update the loader logo. Colors follow the brand design tokens, so a brand palette update automatically updates the loader too.",
        tip: "To preview the loader during testing, open the site in a private/incognito window — sessionStorage is cleared each time.",
      },
      {
        title: "Minimum display time",
        body:
          "The loader stays visible for at least 1.4 seconds even on fast connections, so the brand impression always lands. After that it fades out as soon as the page finishes loading.",
      },
    ],
  },
  {
    id: "validation",
    title: "Required-field validation",
    group: "Reference",
    icon: ShieldAlert,
    intro:
      "Where the admin panel includes form editors (Email Manager, Site Settings), required fields are validated before saving. Missing fields are highlighted with a clear error message.",
    subsections: [
      {
        title: "What triggers validation",
        body:
          "Clicking Save on any form that has mandatory fields (e.g. SMTP host, From address, campaign subject). The form will not submit until all required fields are filled.",
      },
      {
        title: "Whitespace is not accepted",
        body:
          "Fields that contain only spaces are treated as empty by validation. Enter real content.",
        warn: "Don't paste a single space to bypass a required field — validation trims whitespace.",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    group: "Reference",
    icon: AlertCircle,
    intro: "Common problems and their fixes.",
    subsections: [
      {
        title: "Emails are not being delivered",
        body:
          "1. Confirm SMTP is configured: Email Manager → SMTP Settings.\n" +
          "2. Send a test email and check the result message.\n" +
          "3. Check your SMTP provider's sending logs for bounces or blocks.\n" +
          "4. Verify the 'From' address is authorised by your mail server (SPF/DKIM).",
      },
      {
        title: "Analytics shows no data",
        body:
          "The tracker fires on every page load automatically. If you see zero data:\n" +
          "1. Make sure the site is deployed and being visited (not just running locally).\n" +
          "2. Check that no ad-blocker or privacy extension on your test browser is blocking the tracker request.\n" +
          "3. Confirm the API base URL in environment variables points to the correct backend.",
      },
      {
        title: "Forgot admin password",
        body:
          "If SMTP is configured, use the 'Forgot password' link on the login page.\n" +
          "If SMTP is not set up, a developer needs to reset the password directly in the database.",
      },
      {
        title: "Site content looks wrong after a content request",
        body:
          "Content changes require a code change and a new deployment. Open Change History to confirm whether a deployment has happened since your request was submitted. If not, follow up with the dev team.",
      },
    ],
  },
];

// Stub maps kept for import compatibility (no section editor in this build)
export const SECTION_TO_DOC: Record<string, string> = {};
export function findDocForSection(_sectionKey: string): DocSection | undefined {
  return undefined;
}
export const DOC_TO_SECTION: Record<string, string> = {};

// ──────────────────────────────────────────────────────────────────────
// Shared renderer — same look in full Docs page and Help drawer
// ──────────────────────────────────────────────────────────────────────
export const DocContent = ({
  doc,
  onJumpToSection,
}: {
  doc: DocSection;
  onJumpToSection?: (sectionKey: string) => void;
}) => {
  const sectionKey = DOC_TO_SECTION[doc.id];
  const canJump = !!sectionKey && !!onJumpToSection;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
          {doc.group}
        </span>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-3">
        <doc.icon className="w-6 h-6 text-primary" />
        {doc.title}
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{doc.intro}</p>

      {canJump && (
        <button
          onClick={() => onJumpToSection!(sectionKey)}
          className="mb-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Pencil className="w-3.5 h-3.5" />
          Open this section in the editor
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}

      {doc.steps && doc.steps.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Step by step
          </h3>
          <ol className="space-y-2">
            {doc.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {doc.fields && doc.fields.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Hash className="w-4 h-4 text-primary" />
            Editable fields
          </h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Field</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Type</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {doc.fields.map((f) => (
                  <tr key={f.name} className="border-t border-border align-top">
                    <td className="px-3 py-2 font-mono text-[11px] text-foreground break-all">{f.name}</td>
                    <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{f.type}</td>
                    <td className="px-3 py-2 text-muted-foreground">{f.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {doc.subsections?.map((sub, i) => (
        <div key={i} className="mb-5">
          <h3 className="text-sm font-bold text-foreground mb-2">{sub.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{sub.body}</p>
          {sub.tip && (
            <div className="mt-2 flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/80 leading-relaxed">
                <span className="font-semibold text-primary">Tip </span>
                {sub.tip}
              </p>
            </div>
          )}
          {sub.warn && (
            <div className="mt-2 flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/80 leading-relaxed">
                <span className="font-semibold text-destructive">Warning </span>
                {sub.warn}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
