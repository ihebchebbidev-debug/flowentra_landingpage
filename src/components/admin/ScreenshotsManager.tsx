import { useState, useEffect, useRef, useCallback } from "react";
import { adminScreenshots, type ScreenshotFile } from "@/services/adminApi";
import {
  ImageIcon, Upload, Trash2, RefreshCw, X, Check,
  FolderOpen, AlertCircle, Loader2, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const FOLDERS = [
  {
    key: "hero-screenshots" as const,
    label: "Hero Screenshots",
    desc: "Displayed in the hero section module switcher on the homepage.",
  },
  {
    key: "screenshots" as const,
    label: "Product Showcase Screenshots",
    desc: "Displayed in the Product Showcase section on the homepage.",
  },
];

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

type FolderKey = "hero-screenshots" | "screenshots";

interface UploadState {
  folder: FolderKey;
  name: string;
  progress: "uploading" | "done" | "error";
  error?: string;
}

const ScreenshotsManager = () => {
  const [files, setFiles] = useState<{ "hero-screenshots": ScreenshotFile[]; screenshots: ScreenshotFile[] }>({
    "hero-screenshots": [],
    screenshots: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [preview, setPreview] = useState<ScreenshotFile | null>(null);
  const [activeFolder, setActiveFolder] = useState<FolderKey>("hero-screenshots");
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminScreenshots.list();
      setFiles(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load screenshots");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  const handleUpload = async (folder: FolderKey, fileObj: File, replaceFilename?: string) => {
    const name = replaceFilename || fileObj.name;
    setUploads(prev => [...prev, { folder, name, progress: "uploading" }]);
    try {
      const uploaded = await adminScreenshots.upload(folder, fileObj, replaceFilename);
      setFiles(prev => {
        const list = prev[folder].filter(f => f.name !== uploaded.name);
        return { ...prev, [folder]: [uploaded, ...list] };
      });
      setUploads(prev => prev.map(u => u.name === name && u.folder === folder ? { ...u, progress: "done" } : u));
      setTimeout(() => setUploads(prev => prev.filter(u => !(u.name === name && u.folder === folder))), 2000);
      toast.success(`${name} uploaded`);
    } catch (err: any) {
      setUploads(prev => prev.map(u => u.name === name && u.folder === folder ? { ...u, progress: "error", error: err?.message } : u));
      toast.error(`Upload failed: ${err?.message}`);
    }
  };

  const handleDelete = async (file: ScreenshotFile) => {
    if (!confirm(`Delete "${file.name}"? This may break pages that reference it.`)) return;
    setDeleting(`${file.folder}/${file.name}`);
    try {
      await adminScreenshots.delete(file.folder, file.name);
      setFiles(prev => ({ ...prev, [file.folder]: prev[file.folder].filter(f => f.name !== file.name) }));
      if (preview?.name === file.name) setPreview(null);
      toast.success(`${file.name} deleted`);
    } catch (err: any) {
      toast.error(`Delete failed: ${err?.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleFilePick = (folder: FolderKey, replaceFile?: ScreenshotFile) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";
    input.multiple = !replaceFile;
    input.onchange = (e) => {
      const picked = (e.target as HTMLInputElement).files;
      if (!picked) return;
      Array.from(picked).forEach(f => handleUpload(folder, f, replaceFile?.name));
    };
    input.click();
  };

  // Drag & drop onto the folder zone
  const handleDrop = (folder: FolderKey, e: React.DragEvent) => {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach(f => handleUpload(folder, f));
  };

  const currentFiles = files[activeFolder];
  const folderMeta = FOLDERS.find(f => f.key === activeFolder)!;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Screenshots Manager</h2>
              <p className="text-xs text-muted-foreground">Upload, replace or delete screenshots used on the website</p>
            </div>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Folder tabs */}
        <div className="flex border-b border-border">
          {FOLDERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFolder(f.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeFolder === f.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              {f.label}
              <span className="text-xs bg-muted text-muted-foreground rounded-full px-1.5 py-0.5">
                {files[f.key].length}
              </span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-xs text-muted-foreground mb-5">{folderMeta.desc}</p>

          {/* Error state */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20 mb-5">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-destructive">Could not load screenshots</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">{error}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Make sure <code className="bg-muted px-1 rounded">screenshots.php</code> is deployed to your server.
                </p>
              </div>
            </div>
          )}

          {/* Upload zone */}
          <div
            onDrop={(e) => handleDrop(activeFolder, e)}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => handleFilePick(activeFolder)}
            className="border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-6 mb-6 text-center cursor-pointer transition-colors group"
          >
            <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary mx-auto mb-2 transition-colors" />
            <p className="text-sm font-medium text-foreground">Drop images here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP, SVG — max 10 MB each</p>
          </div>

          {/* Active uploads */}
          {uploads.filter(u => u.folder === activeFolder).map((u, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-muted/30 border border-border mb-2 text-sm">
              {u.progress === "uploading" && <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />}
              {u.progress === "done" && <Check className="w-4 h-4 text-green-500 shrink-0" />}
              {u.progress === "error" && <X className="w-4 h-4 text-destructive shrink-0" />}
              <span className="flex-1 truncate text-muted-foreground">{u.name}</span>
              {u.progress === "uploading" && <span className="text-xs text-muted-foreground">Uploading…</span>}
              {u.progress === "done" && <span className="text-xs text-green-600">Done</span>}
              {u.progress === "error" && <span className="text-xs text-destructive">{u.error}</span>}
            </div>
          ))}

          {/* Screenshot grid */}
          {loading && !currentFiles.length ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : currentFiles.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <ImageIcon className="w-10 h-10 opacity-20" />
              <p className="text-sm">No screenshots in this folder yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentFiles.map(file => {
                const key = `${file.folder}/${file.name}`;
                const isDeleting = deleting === key;
                return (
                  <div
                    key={key}
                    className="group relative rounded-xl border border-border overflow-hidden bg-muted/10 hover:border-primary/30 transition-all"
                  >
                    {/* Thumbnail */}
                    <div
                      className="aspect-video bg-muted/20 cursor-pointer overflow-hidden"
                      onClick={() => setPreview(file)}
                    >
                      <img
                        src={`${file.url}?t=${file.modified}`}
                        alt={file.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                      />
                    </div>

                    {/* Info */}
                    <div className="px-3 py-2.5">
                      <p className="text-xs font-medium text-foreground truncate" title={file.name}>{file.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{formatBytes(file.size)}</p>
                    </div>

                    {/* Actions — appear on hover */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setPreview(file)}
                        className="w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                        title="Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFilePick(activeFolder, file)}
                        className="w-7 h-7 rounded-lg bg-primary/80 text-white flex items-center justify-center hover:bg-primary transition-colors"
                        title="Replace"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        disabled={isDeleting}
                        className="w-7 h-7 rounded-lg bg-destructive/80 text-white flex items-center justify-center hover:bg-destructive transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Full preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative bg-card rounded-2xl border border-border overflow-hidden max-w-4xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div>
                <p className="text-sm font-semibold text-foreground">{preview.name}</p>
                <p className="text-xs text-muted-foreground">{preview.folder} · {formatBytes(preview.size)}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </a>
                <button
                  onClick={() => handleFilePick(preview.folder as FolderKey, preview)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" /> Replace
                </button>
                <button onClick={() => setPreview(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-muted/20">
              <img
                src={`${preview.url}?t=${preview.modified}`}
                alt={preview.name}
                className="max-h-[70vh] w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotsManager;
