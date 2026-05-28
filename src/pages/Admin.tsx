import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { adminAuth, adminContent, type AdminUser } from "@/services/adminApi";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHistory from "@/components/admin/AdminHistory";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import AdminSettings from "@/components/admin/AdminSettings";
import EmailManager from "@/components/admin/EmailManager";
import AdminDocs from "@/components/admin/AdminDocs";
import InboxViewer from "@/components/admin/InboxViewer";
import ScreenshotsManager from "@/components/admin/ScreenshotsManager";
import ErrorsViewer from "@/components/admin/ErrorsViewer";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { LogOut, History, Download, Upload, PanelLeftClose, PanelLeft } from "lucide-react";

const Admin = () => {
  const [searchParams] = useSearchParams();
  const hardcodedUser: AdminUser = { id: 1, email: 'admin@flowentra.io', name: 'Admin', role: 'super_admin' };
  const [user, setUser] = useState<AdminUser | null>(hardcodedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeSection, setActiveSection] = useState<string>(searchParams.get("section") || "__docs");
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem('admin_user', JSON.stringify(hardcodedUser));
    if (!localStorage.getItem('admin_token')) {
      localStorage.setItem('admin_token', 'auto-admin-session');
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await adminAuth.login(email, password);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        toast.success("Welcome back, " + result.user.name);
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminAuth.logout();
    setUser(null);
    setIsAuthenticated(false);
    setActiveSection("__docs");
    toast.success("Logged out");
  };

  const handleExport = async () => {
    try {
      const data = await adminContent.exportContent();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flowentra-content-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Content exported");
    } catch {
      toast.error("Export failed");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        await adminContent.importContent(json.data || json);
        toast.success("Content imported successfully");
      } catch {
        toast.error("Import failed");
      }
    };
    input.click();
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} loading={loading} />;
  }

  const currentLabel = activeSection === "__inbox" ? "Inbox"
    : activeSection === "__screenshots" ? "Screenshots"
    : activeSection === "__errors" ? "Error Logs"
    : activeSection === "__email" ? "Email Manager"
    : activeSection === "__analytics" ? "Analytics"
    : activeSection === "__settings" ? "Site Settings"
    : activeSection === "__history" ? "Change History"
    : "Documentation";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster position="top-right" />

      {/* Sidebar */}
      {!sidebarCollapsed && (
        <AdminSidebar
          sections={[]}
          activeSection={activeSection}
          onSectionChange={(key) => setActiveSection(key)}
          user={user}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
            <div className="w-px h-6 bg-border" />
            <h1 className="text-sm font-bold text-foreground truncate">{currentLabel}</h1>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSection("__history")}
              className={`p-1.5 rounded-lg transition-colors ${activeSection === "__history" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              title="Change History"
            >
              <History className="w-4 h-4" />
            </button>
            <button onClick={handleExport} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Export Content">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={handleImport} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Import Content">
              <Upload className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-border mx-1" />

            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">{user?.name?.charAt(0)}</span>
              </div>
              <span className="text-xs font-medium text-foreground hidden sm:inline">{user?.name}</span>
            </div>

            <button onClick={handleLogout} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {activeSection === "__docs" ? (
            <AdminDocs onJumpToSection={(key) => setActiveSection(key)} />
          ) : activeSection === "__inbox" ? (
            <InboxViewer />
          ) : activeSection === "__screenshots" ? (
            <ScreenshotsManager />
          ) : activeSection === "__errors" ? (
            <ErrorsViewer />
          ) : activeSection === "__email" ? (
            <EmailManager />
          ) : activeSection === "__analytics" ? (
            <AnalyticsDashboard />
          ) : activeSection === "__settings" ? (
            <AdminSettings />
          ) : activeSection === "__history" ? (
            <AdminHistory section="" />
          ) : (
            <AdminDocs onJumpToSection={(key) => setActiveSection(key)} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
