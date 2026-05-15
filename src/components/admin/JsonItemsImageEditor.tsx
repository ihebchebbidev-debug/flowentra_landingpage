import { useMemo } from "react";
import ImageUploader from "./ImageUploader";
import { Image as ImageIcon, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  /** Raw JSON string value (the items array as serialized in the CMS field). */
  value: string;
  /** Section key — used as upload "section" tag and category hint. */
  sectionKey: string;
  /** Called with the new JSON string when an image is set/cleared or order changes. */
  onChange: (newJson: string) => void;
  /** Object key on each item where the image URL is stored. Defaults to "image". */
  imageKey?: string;
  /** Label shown in the header (e.g. "Item images & order", "Logos & order"). */
  headerLabel?: string;
}

interface SortableItemProps {
  id: string;
  index: number;
  item: any;
  sectionKey: string;
  imageKey: string;
  onSetImage: (idx: number, url: string | null) => void;
}

const SortableItem = ({ id, index, item, sectionKey, imageKey, onSetImage }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto" as const,
  };

  // Support both object items ({name, logo}, {title, image}, ...) and bare string items.
  const isStringItem = typeof item === "string";
  const label =
    (isStringItem && item) ||
    (item && typeof item === "object" && (item.title || item.tag || item.name)) ||
    `Item ${index + 1}`;
  const current: string | undefined =
    item && typeof item === "object" && typeof item[imageKey] === "string" ? item[imageKey] : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border bg-card p-2.5 space-y-2 ${isDragging ? "border-primary shadow-lg" : "border-border"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none p-0.5 -ml-0.5 rounded hover:bg-muted transition-colors"
            title="Drag to reorder"
            aria-label={`Reorder ${label}`}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0">
            #{index + 1}
          </span>
          <span className="text-[11px] font-medium text-foreground truncate">{label}</span>
        </div>
        {current && (
          <button
            type="button"
            onClick={() => onSetImage(index, null)}
            className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-0.5 shrink-0"
            title="Clear image"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>
      <ImageUploader
        category="screenshot"
        section={sectionKey}
        currentValue={current}
        onSelect={(file) => onSetImage(index, file.image_url)}
      />
    </div>
  );
};

/**
 * Renders a per-item image uploader for JSON `items` arrays with drag-and-drop reordering.
 * Each item gets an `image` field (URL string) injected into the JSON.
 * Used by Features, How It Works, and Product Showcase admin editors so
 * non-technical admins can replace placeholder visuals and reorder items
 * to match the live preview without editing JSON by hand.
 */
const JsonItemsImageEditor = ({ value, sectionKey, onChange, imageKey = "image", headerLabel = "Item images & order" }: Props) => {
  const parsed = useMemo(() => {
    try {
      const v = JSON.parse(value || "[]");
      return Array.isArray(v) ? v : null;
    } catch {
      return null;
    }
  }, [value]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!parsed) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-[11px] text-muted-foreground">
        Add valid JSON below first, then upload an image and reorder items here.
      </div>
    );
  }

  if (parsed.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-[11px] text-muted-foreground">
        No items yet — add at least one item in the JSON below.
      </div>
    );
  }

  const setImage = (idx: number, url: string | null) => {
    const next = parsed.map((it: any, i: number) => {
      if (i !== idx) return it;
      // Promote string items to objects so we can attach an image URL.
      const base =
        typeof it === "string"
          ? { name: it }
          : it && typeof it === "object"
          ? { ...it }
          : {};
      if (url) base[imageKey] = url;
      else delete base[imageKey];
      return base;
    });
    onChange(JSON.stringify(next, null, 2));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    if (Number.isNaN(oldIndex) || Number.isNaN(newIndex)) return;
    const reordered = arrayMove(parsed, oldIndex, newIndex);
    onChange(JSON.stringify(reordered, null, 2));
  };

  // Stable IDs by index — array order is the source of truth here
  const ids = parsed.map((_, i) => String(i));

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-muted-foreground">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5" />
          {headerLabel}
        </div>
        <span className="font-normal opacity-70 text-[10px] flex items-center gap-1">
          <GripVertical className="w-3 h-3" /> Drag to reorder
        </span>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {parsed.map((item: any, i: number) => (
              <SortableItem
                key={i}
                id={String(i)}
                index={i}
                item={item}
                sectionKey={sectionKey}
                imageKey={imageKey}
                onSetImage={setImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default JsonItemsImageEditor;
