// =============================================================================
// TemplateThumbnail generates a stylized SVG preview from a template's
// section list, so admins can spot the right layout at a glance without
// loading any external image.
// =============================================================================
import { useMemo } from "react";
import type { PageTemplate, SectionVariant } from "@/components/admin/pageTemplates";

interface Props {
  template?: PageTemplate;
  // For single-variant previews (in the variant gallery).
  variant?: { sectionType: string; variant: SectionVariant };
  className?: string;
  ariaLabel?: string;
}

// Visual recipe per section type. Each returns a small <g> drawn within
// a "row" of given y/height. Colors use semantic tokens (currentColor on
// primary/foreground/muted via CSS classes) to respect light/dark themes.
type Drawer = (y: number, h: number, w: number) => JSX.Element;

const drawHero: Drawer = (y, h, w) => (
  <g>
    <rect x="6" y={y + 4} width={w - 12} height={h - 8} rx="3" className="fill-primary/15" />
    <rect x="14" y={y + 10} width={w * 0.45} height="4" rx="1.5" className="fill-foreground/80" />
    <rect x="14" y={y + 18} width={w * 0.6} height="2.5" rx="1" className="fill-muted-foreground/60" />
    <rect x="14" y={y + 24} width="22" height="6" rx="1.5" className="fill-primary" />
    <rect x="40" y={y + 24} width="20" height="6" rx="1.5" className="fill-muted-foreground/30" />
  </g>
);

const drawTrustedBy: Drawer = (y, h, w) => (
  <g>
    {Array.from({ length: 5 }).map((_, i) => (
      <rect
        key={i}
        x={10 + i * ((w - 20) / 5)}
        y={y + h / 2 - 2}
        width={(w - 20) / 5 - 6}
        height="4"
        rx="1"
        className="fill-muted-foreground/40"
      />
    ))}
  </g>
);

const drawFeatures: Drawer = (y, h, w) => (
  <g>
    {Array.from({ length: 4 }).map((_, i) => {
      const cw = (w - 30) / 4;
      const cx = 10 + i * (cw + 5);
      return (
        <g key={i}>
          <rect x={cx} y={y + 4} width={cw} height={h - 8} rx="2" className="fill-card stroke-border" strokeWidth="0.5" />
          <circle cx={cx + 6} cy={y + 10} r="2.5" className="fill-primary/70" />
          <rect x={cx + 4} y={y + 16} width={cw - 8} height="2" rx="1" className="fill-foreground/60" />
          <rect x={cx + 4} y={y + 20} width={cw - 12} height="1.5" rx="0.5" className="fill-muted-foreground/40" />
        </g>
      );
    })}
  </g>
);

const drawShowcase: Drawer = (y, h, w) => (
  <g>
    <rect x="10" y={y + 4} width={w * 0.45} height={h - 8} rx="2" className="fill-muted/60" />
    <rect x={w * 0.5} y={y + 8} width={w * 0.4} height="3" rx="1" className="fill-foreground/70" />
    <rect x={w * 0.5} y={y + 14} width={w * 0.42} height="2" rx="1" className="fill-muted-foreground/50" />
    <rect x={w * 0.5} y={y + 18} width={w * 0.35} height="2" rx="1" className="fill-muted-foreground/50" />
    <rect x={w * 0.5} y={y + 24} width="18" height="5" rx="1" className="fill-primary" />
  </g>
);

const drawHowItWorks: Drawer = (y, h, w) => (
  <g>
    {Array.from({ length: 3 }).map((_, i) => {
      const cw = (w - 30) / 3;
      const cx = 10 + i * (cw + 5);
      return (
        <g key={i}>
          <circle cx={cx + cw / 2} cy={y + 12} r="4" className="fill-primary/80" />
          <rect x={cx + 4} y={y + 20} width={cw - 8} height="2" rx="1" className="fill-foreground/60" />
          <rect x={cx + 8} y={y + 24} width={cw - 16} height="1.5" rx="0.5" className="fill-muted-foreground/40" />
        </g>
      );
    })}
  </g>
);

const drawDemo: Drawer = (y, h, w) => (
  <g>
    <rect x="14" y={y + 4} width={w - 28} height={h - 8} rx="3" className="fill-foreground/85" />
    <polygon
      points={`${w / 2 - 4},${y + h / 2 - 5} ${w / 2 + 5},${y + h / 2} ${w / 2 - 4},${y + h / 2 + 5}`}
      className="fill-primary"
    />
  </g>
);

const drawMetrics: Drawer = (y, h, w) => (
  <g>
    {Array.from({ length: 4 }).map((_, i) => {
      const cw = (w - 30) / 4;
      const cx = 10 + i * (cw + 5);
      return (
        <g key={i}>
          <rect x={cx + 4} y={y + 6} width={cw - 8} height="6" rx="1" className="fill-primary/80" />
          <rect x={cx + 6} y={y + 16} width={cw - 12} height="2" rx="1" className="fill-muted-foreground/40" />
        </g>
      );
    })}
  </g>
);

const drawIntegrations: Drawer = (y, h, w) => (
  <g>
    {Array.from({ length: 8 }).map((_, i) => {
      const cols = 8;
      const cw = (w - 20) / cols;
      const cx = 10 + i * cw;
      return <circle key={i} cx={cx + cw / 2} cy={y + h / 2} r="3" className="fill-muted-foreground/50" />;
    })}
  </g>
);

const drawPricing: Drawer = (y, h, w) => (
  <g>
    {Array.from({ length: 3 }).map((_, i) => {
      const cw = (w - 30) / 3;
      const cx = 10 + i * (cw + 5);
      const isHighlight = i === 1;
      return (
        <g key={i}>
          <rect
            x={cx}
            y={y + 4}
            width={cw}
            height={h - 8}
            rx="2"
            className={isHighlight ? "fill-primary/15 stroke-primary" : "fill-card stroke-border"}
            strokeWidth="0.5"
          />
          <rect x={cx + 4} y={y + 8} width={cw - 8} height="2" rx="1" className="fill-foreground/70" />
          <rect x={cx + 4} y={y + 13} width={cw - 14} height="3" rx="1" className="fill-foreground/80" />
          <rect x={cx + 4} y={y + 22} width={cw - 8} height="2" rx="1" className={isHighlight ? "fill-primary" : "fill-muted-foreground/40"} />
        </g>
      );
    })}
  </g>
);

const drawComparison: Drawer = (y, h, w) => (
  <g>
    <rect x="10" y={y + 4} width={w - 20} height={h - 8} rx="2" className="fill-card stroke-border" strokeWidth="0.5" />
    {Array.from({ length: 4 }).map((_, i) => (
      <line
        key={i}
        x1="10"
        y1={y + 8 + i * 5}
        x2={w - 10}
        y2={y + 8 + i * 5}
        className="stroke-border"
        strokeWidth="0.4"
      />
    ))}
    <line x1={w / 2} y1={y + 4} x2={w / 2} y2={y + h - 4} className="stroke-border" strokeWidth="0.4" />
  </g>
);

const drawTestimonials: Drawer = (y, h, w) => (
  <g>
    {Array.from({ length: 3 }).map((_, i) => {
      const cw = (w - 30) / 3;
      const cx = 10 + i * (cw + 5);
      return (
        <g key={i}>
          <rect x={cx} y={y + 4} width={cw} height={h - 8} rx="2" className="fill-muted/40" />
          <circle cx={cx + 6} cy={y + 10} r="2" className="fill-primary/70" />
          <rect x={cx + 4} y={y + 16} width={cw - 8} height="1.5" rx="0.5" className="fill-foreground/50" />
          <rect x={cx + 4} y={y + 19} width={cw - 14} height="1.5" rx="0.5" className="fill-foreground/50" />
        </g>
      );
    })}
  </g>
);

const drawFAQ: Drawer = (y, h, w) => (
  <g>
    {Array.from({ length: 3 }).map((_, i) => (
      <g key={i}>
        <rect
          x="14"
          y={y + 4 + i * 8}
          width={w - 28}
          height="6"
          rx="1"
          className="fill-card stroke-border"
          strokeWidth="0.4"
        />
        <rect x="18" y={y + 6.5 + i * 8} width={w * 0.45} height="1.5" rx="0.5" className="fill-foreground/70" />
      </g>
    ))}
  </g>
);

const drawContact: Drawer = (y, h, w) => (
  <g>
    <rect x="14" y={y + 4} width={(w - 28) / 2 - 2} height="5" rx="1" className="fill-card stroke-border" strokeWidth="0.4" />
    <rect x={14 + (w - 28) / 2 + 2} y={y + 4} width={(w - 28) / 2 - 2} height="5" rx="1" className="fill-card stroke-border" strokeWidth="0.4" />
    <rect x="14" y={y + 12} width={w - 28} height={h - 22} rx="1" className="fill-card stroke-border" strokeWidth="0.4" />
    <rect x="14" y={y + h - 8} width="22" height="5" rx="1" className="fill-primary" />
  </g>
);

const drawCTA: Drawer = (y, h, w) => (
  <g>
    <rect x="10" y={y + 4} width={w - 20} height={h - 8} rx="3" className="fill-primary/20 stroke-primary" strokeWidth="0.5" />
    <rect x={w / 2 - 30} y={y + 9} width="60" height="3" rx="1" className="fill-foreground/80" />
    <rect x={w / 2 - 20} y={y + 16} width="40" height="2" rx="1" className="fill-muted-foreground/60" />
    <rect x={w / 2 - 14} y={y + 22} width="28" height="6" rx="1.5" className="fill-primary" />
  </g>
);

const SECTION_DRAWERS: Record<string, Drawer> = {
  hero: drawHero,
  trustedBy: drawTrustedBy,
  features: drawFeatures,
  productShowcase: drawShowcase,
  howItWorks: drawHowItWorks,
  demo: drawDemo,
  metrics: drawMetrics,
  integrations: drawIntegrations,
  pricing: drawPricing,
  comparisonTable: drawComparison,
  testimonials: drawTestimonials,
  faq: drawFAQ,
  contact: drawContact,
  ctaBanner: drawCTA,
};

// Heuristic per-section row height (in viewBox units). Hero & CTA are bigger.
const HEIGHTS: Record<string, number> = {
  hero: 38,
  trustedBy: 14,
  features: 32,
  productShowcase: 34,
  howItWorks: 30,
  demo: 36,
  metrics: 24,
  integrations: 18,
  pricing: 34,
  comparisonTable: 28,
  testimonials: 28,
  faq: 30,
  contact: 34,
  ctaBanner: 28,
};

const W = 200;

const TemplateThumbnail = ({ template, variant, className, ariaLabel }: Props) => {
  // Build a list of section types to render.
  const sectionTypes = useMemo<string[]>(() => {
    if (variant) return [variant.sectionType];
    if (!template) return [];
    if (template.sections.length === 0) return ["hero", "ctaBanner"]; // blank placeholder
    return template.sections.map((s) => s.section_type);
  }, [template, variant]);

  // Compute total height + cumulative y positions.
  const { rows, totalH } = useMemo(() => {
    let y = 0;
    const rows: Array<{ type: string; y: number; h: number }> = [];
    for (const t of sectionTypes) {
      const h = HEIGHTS[t] ?? 24;
      rows.push({ type: t, y, h });
      y += h + 2;
    }
    return { rows, totalH: Math.max(y, 60) };
  }, [sectionTypes]);

  return (
    <svg
      viewBox={`0 0 ${W} ${totalH}`}
      preserveAspectRatio="xMidYMin slice"
      role="img"
      aria-label={ariaLabel || template?.label || variant?.variant.label || "Template preview"}
      className={className}
    >
      {/* Background "page" */}
      <rect x="0" y="0" width={W} height={totalH} className="fill-background" />
      {rows.map((r, i) => {
        const drawer = SECTION_DRAWERS[r.type];
        return drawer ? (
          <g key={`${r.type}-${i}`}>{drawer(r.y, r.h, W)}</g>
        ) : (
          // Unknown section neutral block
          <rect
            key={`${r.type}-${i}`}
            x="10"
            y={r.y + 4}
            width={W - 20}
            height={r.h - 8}
            rx="2"
            className="fill-muted/50"
          />
        );
      })}
    </svg>
  );
};

export default TemplateThumbnail;
