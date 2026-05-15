import { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import { adminMedia, type MediaFile } from "@/services/adminApi";
import { toast } from "sonner";
import {
  Upload,
  Loader2,
  Trash2,
  Check,
  AlertTriangle,
  X,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";

// Lazy import to avoid the circular dep (MediaLibrary imports ImageUploader).
const MediaLibrary = lazy(() => import("./MediaLibrary"));

/**
 * Recommended size + aspect-ratio guidance per upload category. Used to surface
 * non-blocking warnings in the pre-upload preview so admins don't ship an
 * obviously wrong image (e.g. a 200×200 thumbnail into the hero background).
 */
const CATEGORY_GUIDELINES: Record<
  string,
  {
    minWidth?: number;
    minHeight?: number;
    aspectRatio?: number; // width / height
    aspectTolerance?: number; // ± tolerance on the ratio
    note: string;
  }
> = {
  hero:        { minWidth: 1280, minHeight: 720,  aspectRatio: 16 / 9, aspectTolerance: 0.2,  note: "Recommended ≥ 1280×720, 16:9" },
  screenshot:  { minWidth: 1200, minHeight: 750,  aspectRatio: 16 / 10, aspectTolerance: 0.25, note: "Recommended ≥ 1200×750" },
  logo:        { minWidth: 200,  minHeight: 60,                                              note: "Recommended ≥ 200×60, transparent PNG/SVG" },
  icon:        { minWidth: 64,   minHeight: 64,   aspectRatio: 1,     aspectTolerance: 0.1,  note: "Square ≥ 64×64, prefer SVG" },
  integration: { minWidth: 80,   minHeight: 80,   aspectRatio: 1,     aspectTolerance: 0.2,  note: "Square ~80×80, transparent PNG/SVG" },
  general:     { note: "Any size — keep under 1 MB if possible" },
};

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
const SOFT_BYTES = 1 * 1024 * 1024; //  1 MB → warn but allow
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

interface Props {
  category?: keyof typeof CATEGORY_GUIDELINES | string;
  section?: string;
  onSelect?: (file: MediaFile) => void;
  currentValue?: string;
  label?: string;
  /** True when the uploaded/selected image URL changed but CMS content is not saved yet. */
  needsSave?: boolean;
}

interface PendingFile {
  file: File;
  objectUrl: string;
  width: number | null;
  height: number | null;
  errors: string[];
  warnings: string[];
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function readImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

const ImageUploader = ({ category = "general", section, onSelect, currentValue, label, needsSave = false }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [committed, setCommitted] = useState<string | null>(currentValue || null);
  const [pending, setPending] = useState<PendingFile | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLibraryPick = (file: MediaFile) => {
    setCommitted(file.image_url);
    onSelect?.(file);
    setLibraryOpen(false);
    toast.warning("Image selected from library", {
      description: "Click Save All Languages to publish it on the landing page.",
      duration: 4000,
    });
  };

  // Keep committed preview in sync when parent updates `currentValue`
  // (e.g. after revert / external media-library pick).
  useEffect(() => {
    setCommitted(currentValue || null);
  }, [currentValue]);

  // Free the blob URL when the pending file changes or unmounts
  useEffect(() => {
    return () => {
      if (pending?.objectUrl) URL.revokeObjectURL(pending.objectUrl);
    };
  }, [pending?.objectUrl]);

  const guidelines = useMemo(
    () => CATEGORY_GUIDELINES[category as string] || CATEGORY_GUIDELINES.general,
    [category]
  );

  /** Validate the file locally before showing preview. Returns errors + warnings. */
  const validateFile = async (file: File): Promise<PendingFile> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Type
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`Unsupported type "${file.type || "unknown"}". Use JPG, PNG, GIF, WebP, or SVG.`);
    }

    // Size — hard cap
    if (file.size > MAX_BYTES) {
      errors.push(`File is ${formatBytes(file.size)} — exceeds 20 MB limit.`);
    } else if (file.size > SOFT_BYTES) {
      warnings.push(
        `File is ${formatBytes(file.size)} — consider compressing to keep the page fast.`
      );
    }

    const objectUrl = URL.createObjectURL(file);

    // Dimensions (skip for SVG — no intrinsic raster size)
    let width: number | null = null;
    let height: number | null = null;
    if (file.type !== "image/svg+xml") {
      const dims = await readImageDimensions(objectUrl);
      if (dims) {
        width = dims.width;
        height = dims.height;

        if (guidelines.minWidth && width < guidelines.minWidth) {
          warnings.push(
            `Width ${width}px is below recommended ${guidelines.minWidth}px — image may look soft.`
          );
        }
        if (guidelines.minHeight && height < guidelines.minHeight) {
          warnings.push(
            `Height ${height}px is below recommended ${guidelines.minHeight}px — image may look soft.`
          );
        }
        if (guidelines.aspectRatio) {
          const actual = width / height;
          const delta = Math.abs(actual - guidelines.aspectRatio);
          if (delta > (guidelines.aspectTolerance ?? 0.15)) {
            warnings.push(
              `Aspect ratio ${actual.toFixed(2)}:1 differs from recommended ${guidelines.aspectRatio.toFixed(2)}:1 — image may be cropped.`
            );
          }
        }
      } else {
        errors.push("Could not read image — file may be corrupted.");
      }
    }

    return { file, objectUrl, width, height, errors, warnings };
  };

  const handleFilePicked = async (file: File) => {
    if (!file) return;
    // Replace any previous pending preview
    if (pending?.objectUrl) URL.revokeObjectURL(pending.objectUrl);
    const result = await validateFile(file);
    setPending(result);
    if (result.errors.length) {
      toast.error(result.errors[0]);
    }
  };

  const handleConfirmUpload = async () => {
    if (!pending || pending.errors.length) return;
    setUploading(true);
    try {
      const result = await adminMedia.upload(pending.file, category as string, "", section);
      if (result.success && result.data) {
        setCommitted(result.data.image_url);
        onSelect?.(result.data);
        toast.warning("Image uploaded to Media Library", {
          description: "Click Save All Languages to publish it on the landing page.",
          duration: 5000,
        });
        // Clear pending state
        URL.revokeObjectURL(pending.objectUrl);
        setPending(null);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        toast.error(result.message || "Upload failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const cancelPending = () => {
    if (pending?.objectUrl) URL.revokeObjectURL(pending.objectUrl);
    setPending(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFilePicked(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFilePicked(file);
  };

  const clearCommitted = () => {
    setCommitted(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ---- Renders ----

  // 1) PRE-UPLOAD PREVIEW with validation
  if (pending) {
    const blocked = pending.errors.length > 0;
    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-semibold text-foreground block">{label}</label>}

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="relative bg-muted/30">
            <img
              src={pending.objectUrl}
              alt="Pending preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-foreground/80 text-primary-foreground text-[10px] font-semibold">
              Preview · not uploaded yet
            </div>
            <button
              type="button"
              onClick={cancelPending}
              disabled={uploading}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-background/90 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
              title="Discard"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* File facts */}
          <div className="p-3 space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="rounded-md bg-muted/40 px-2 py-1.5">
                <div className="text-muted-foreground/70 text-[9px] uppercase">Name</div>
                <div className="font-medium truncate" title={pending.file.name}>
                  {pending.file.name}
                </div>
              </div>
              <div className="rounded-md bg-muted/40 px-2 py-1.5">
                <div className="text-muted-foreground/70 text-[9px] uppercase">Type</div>
                <div className="font-medium">{pending.file.type.split("/")[1] || "?"}</div>
              </div>
              <div className="rounded-md bg-muted/40 px-2 py-1.5">
                <div className="text-muted-foreground/70 text-[9px] uppercase">Size</div>
                <div
                  className={`font-medium ${
                    pending.file.size > MAX_BYTES
                      ? "text-destructive"
                      : pending.file.size > SOFT_BYTES
                      ? "text-amber-600"
                      : ""
                  }`}
                >
                  {formatBytes(pending.file.size)}
                </div>
              </div>
              <div className="rounded-md bg-muted/40 px-2 py-1.5">
                <div className="text-muted-foreground/70 text-[9px] uppercase">Dimensions</div>
                <div className="font-medium">
                  {pending.width && pending.height
                    ? `${pending.width}×${pending.height}`
                    : pending.file.type === "image/svg+xml"
                    ? "vector"
                    : "—"}
                </div>
              </div>
            </div>

            {/* Errors */}
            {pending.errors.map((msg, i) => (
              <div
                key={`e-${i}`}
                className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/30 px-2.5 py-2 text-[11px] text-destructive"
              >
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{msg}</span>
              </div>
            ))}

            {/* Warnings */}
            {pending.warnings.map((msg, i) => (
              <div
                key={`w-${i}`}
                className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 px-2.5 py-2 text-[11px] text-amber-700 dark:text-amber-400"
              >
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{msg}</span>
              </div>
            ))}

            {/* All-clear */}
            {!pending.errors.length && !pending.warnings.length && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-2 text-[11px] text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Looks good — matches the recommended guidelines.</span>
              </div>
            )}

            <p className="text-[10px] text-muted-foreground/60">{guidelines.note}</p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={cancelPending}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
              >
                Pick another
              </button>
              <button
                type="button"
                onClick={handleConfirmUpload}
                disabled={uploading || blocked}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                title={blocked ? "Fix the errors above first" : "Upload to media library"}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Confirm & upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  // Shared library modal renderer
  const libraryModal = libraryOpen ? (
    <Suspense fallback={null}>
      <MediaLibrary
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={handleLibraryPick}
        category={category as any}
      />
    </Suspense>
  ) : null;

  // 2) COMMITTED IMAGE (already uploaded)
  if (committed) {
    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-semibold text-foreground block">{label}</label>}
        <div className="relative rounded-xl border border-border bg-card overflow-hidden group">
          <img src={committed} alt="Preview" className="block w-full h-40 object-cover bg-muted/30" />
          <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-foreground text-foreground text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <Upload className="w-3.5 h-3.5" /> Upload new
            </button>
            <button
              onClick={() => setLibraryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <FolderOpen className="w-3.5 h-3.5" /> Choose from library
            </button>
            <button
              onClick={clearCommitted}
              className="p-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-foreground/80 text-primary-foreground text-[10px]">
            <Check className="w-3 h-3" /> {needsSave ? "Save required" : "Uploaded"}
          </div>
        </div>

        {needsSave && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>This image is uploaded, but not published yet. Click <strong>Save All Languages</strong> to update the landing page.</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />
        {libraryModal}
      </div>
    );
  }

  // 3) EMPTY STATE — two clear actions: upload OR pick from library
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-foreground block">{label}</label>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Upload drop-zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          className={`
            relative rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-all
            ${dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
            }
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">Upload image</p>
            <p className="text-[11px] text-muted-foreground">
              Click or drag &amp; drop · JPG, PNG, WebP, SVG · max 20MB
            </p>
          </div>
        </div>

        {/* Library picker */}
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="rounded-xl border-2 border-dashed border-border p-5 text-center transition-all hover:border-primary/50 hover:bg-muted/30 cursor-pointer"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">Choose from library</p>
            <p className="text-[11px] text-muted-foreground">
              Pick a previously uploaded image or a built-in default
            </p>
          </div>
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground/70 px-1">{guidelines.note}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
      {libraryModal}
    </div>
  );
};

export default ImageUploader;
