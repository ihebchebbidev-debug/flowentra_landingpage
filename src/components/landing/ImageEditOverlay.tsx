import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminOverlay } from "@/contexts/AdminOverlayContext";

interface Props {
  /** CMS section key the admin should land on (e.g. "hero", "features"). */
  sectionKey: string;
  /** Optional short label shown on the button (e.g. "Hero image", "Logo"). */
  label?: string;
  /** True if no image is uploaded yet surfaces an "Add image" CTA permanently visible. */
  empty?: boolean;
  /** Visual size variant. "sm" suits small avatar/logo tiles. */
  size?: "sm" | "md";
}

/**
 * Admin-only overlay shown on top of an image / image placeholder.
 * Clicking it deep-links to the matching admin section editor so the admin
 * can upload or change the image immediately.
 *
 * Renders nothing for public visitors or when admin overlays are disabled.
 * The parent container should be `position: relative` and `overflow-hidden`
 * (most landing image containers already are).
 */
const ImageEditOverlay = ({ sectionKey, label, empty = false, size = "md" }: Props) => {
  const { isAdmin, overlaysEnabled, publicPreview } = useAdminOverlay();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  if (!isAdmin || !overlaysEnabled || publicPreview) return null;

  const goEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/admin?section=${sectionKey}`);
  };

  const isSm = size === "sm";

  return (
    <div
      className="absolute inset-0 z-30 group/imgedit cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={goEdit}
      aria-label={`Edit ${label || "image"}`}
      role="button"
    >
      {/* Dashed outline when empty so admin sees there is no image yet */}
      {empty && (
        <div className="absolute inset-0 rounded-[inherit] border-2 border-dashed border-primary/40 bg-primary/[0.04] pointer-events-none" />
      )}

      {/* Hover tint */}
      <AnimatePresence>
        {hovered && !empty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Always-visible CTA when empty; hover-revealed when image present */}
      <AnimatePresence>
        {(empty || hovered) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span
              className={`inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30 ${
                isSm ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
              }`}
            >
              {empty ? (
                <ImagePlus className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />
              ) : (
                <Pencil className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />
              )}
              {empty ? `Add ${label || "image"}` : `Edit ${label || "image"}`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageEditOverlay;
