import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, EyeOff, MousePointerClick } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminOverlay } from "@/contexts/AdminOverlayContext";
import { useSectionVisibility } from "@/contexts/CmsContentContext";

interface EditableSectionProps {
  sectionKey: string;
  children: React.ReactNode;
  label?: string;
  id?: string;
}

/**
 * Wraps a landing section so admins can:
 *   - See a persistent "section badge" identifying the block
 *   - Click anywhere on the section to jump straight to its admin editor
 *   - See a hover ring + explicit "Edit in admin" CTA
 *
 * Inner interactive elements (buttons, links, inputs, the per-image
 * ImageEditOverlay, etc.) keep working we only treat clicks on the
 * section background as a navigation shortcut.
 */
const EditableSection = ({ sectionKey, children, label, id }: EditableSectionProps) => {
  const { isAdmin, overlaysEnabled, publicPreview } = useAdminOverlay();
  const hiddenSections = useSectionVisibility();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const isHidden = hiddenSections.has(sectionKey);

  // Public visitors (or admins simulating public): hidden section = nothing rendered.
  if (isHidden && (!isAdmin || publicPreview)) return null;

  // Admins always see content; if overlays disabled or in public preview, just render children.
  if (!isAdmin || !overlaysEnabled || publicPreview) {
    return <div id={id} data-section-key={sectionKey}>{children}</div>;
  }

  const goEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/admin?section=${sectionKey}`);
  };

  /**
   * Treat click on the section background as "edit this section",
   * but ignore clicks that originated on a real interactive element so
   * the page stays usable for admins (testing buttons, opening links…).
   */
  const handleBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest(
        'a, button, input, textarea, select, label, [role="button"], [role="link"], [role="tab"], [data-no-edit-jump]'
      )
    ) {
      return;
    }
    goEdit(e);
  };

  return (
    <div
      id={id}
      data-section-key={sectionKey}
      className="relative group/editable"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleBackgroundClick}
    >
      {/* Persistent section badge (always visible to admins) */}
      <div className="absolute top-3 left-3 z-50 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur border border-border text-foreground text-[10px] font-bold uppercase tracking-wider shadow-md pointer-events-none">
        <MousePointerClick className="w-3 h-3 text-primary" />
        {label || sectionKey}
      </div>

      {/* Hover ring */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-40 pointer-events-none rounded-lg"
            style={{
              boxShadow: isHidden
                ? "inset 0 0 0 2px hsl(var(--destructive) / 0.6)"
                : "inset 0 0 0 2px hsl(var(--primary) / 0.5)",
            }}
          />
        )}
      </AnimatePresence>

      {isHidden && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/90 text-destructive-foreground text-[10px] font-bold uppercase tracking-wider shadow-lg pointer-events-none">
          <EyeOff className="w-3 h-3" />
          Hidden from public
        </div>
      )}

      {/* Edit-in-admin CTA (revealed on hover) */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.15 }}
            onClick={goEdit}
            data-no-edit-jump
            className="absolute top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all cursor-pointer"
          >
            <Pencil className="w-3 h-3" />
            Edit in admin{label ? ` · ${label}` : ""}
          </motion.button>
        )}
      </AnimatePresence>

      <div className={isHidden ? "opacity-50" : ""}>{children}</div>
    </div>
  );
};

export default EditableSection;
