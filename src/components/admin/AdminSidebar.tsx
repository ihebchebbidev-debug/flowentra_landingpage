import { type AdminUser } from "@/services/adminApi";
import logo from "@/assets/flowentra-logo.png";
import {
  Mail, Inbox, ImageIcon, Bug, type LucideIcon,
  Eye, LayoutDashboard, Activity, Settings, BookOpen,
} from "lucide-react";

// Admin-only panels (not CMS content sections)
const adminPanels: { key: string; label: string; desc: string; icon: LucideIcon }[] = [
  { key: "__docs", label: "Documentation", desc: "How to use this admin panel", icon: BookOpen },
  { key: "__inbox", label: "Inbox", desc: "contact@ & support@ messages", icon: Inbox },
  { key: "__screenshots", label: "Screenshots", desc: "hero-screenshots & screenshots folders", icon: ImageIcon },
  { key: "__errors", label: "Error Logs", desc: "JS, API & PHP server errors", icon: Bug },
  { key: "__email", label: "Email Manager", desc: "SMTP, campaigns, templates", icon: Mail },
  { key: "__analytics", label: "Analytics", desc: "Visitor stats, page views", icon: Activity },
  { key: "__settings", label: "Site Settings", desc: "Password, maintenance, meta", icon: Settings },
];

interface Props {
  sections: never[];
  activeSection: string;
  onSectionChange: (key: string) => void;
  user: AdminUser | null;
}

const AdminSidebar = ({ activeSection, onSectionChange }: Props) => {
  return (
    <aside className="w-72 bg-card border-r border-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border gap-2">
        <img src={logo} alt="Flowentra" className="h-7" />
        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-wider">CMS</span>
      </div>

      {/* Overview Link */}
      <div className="px-3 pt-4 pb-2">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          View Live Site →
        </a>
      </div>

      {/* Admin Tools */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 pt-2">
        <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-3 mb-2 mt-1">
          Admin Tools
        </p>
        {adminPanels.map(panel => {
          const isActive = activeSection === panel.key;
          return (
            <button
              key={panel.key}
              onClick={() => onSectionChange(panel.key)}
              className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left transition-all group mb-0.5 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <panel.icon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs font-medium block truncate">{panel.label}</span>
                <span className={`text-[10px] block truncate ${
                  isActive ? "text-primary/60" : "text-muted-foreground/50 group-hover:text-muted-foreground/70"
                }`}>
                  {panel.desc}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
          <LayoutDashboard className="w-3 h-3" />
          <span>Flowentra CMS v1.0</span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
