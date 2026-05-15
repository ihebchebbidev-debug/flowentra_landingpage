import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsSection } from "@/contexts/CmsContentContext";
import ImageEditOverlay from "./ImageEditOverlay";

const defaultLogos = [
  "Telnet Holding", "Poulina Group", "BIAT", "Sofrecom",
  "Vermeg", "Instadeep", "Tunisie Telecom", "STEG",
];

type TrustedItem = string | { name?: string; logo?: string };

const TrustedBy = () => {
  const { tr, lang } = useLanguage();
  const cms = useCmsSection("trustedBy", lang, { title: tr.trustedBy, logos: defaultLogos } as Record<string, any>) as Record<string, any>;
  const title = cms.title || tr.trustedBy;
  const rawLogos: TrustedItem[] = Array.isArray(cms.logos) && cms.logos.length ? cms.logos : defaultLogos;
  const logos = rawLogos.map((l) => (typeof l === "string" ? { name: l, logo: "" } : { name: l?.name || "", logo: l?.logo || "" }));

  return (
    <section className="py-4 sm:py-6 border-b border-border">
      <div className="container mx-auto px-5 sm:px-4 lg:px-8">
        <motion.p
          className="text-center text-[10px] font-medium text-muted-foreground/40 tracking-[0.2em] uppercase mb-2 sm:mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.p>
        <div className="flex items-center justify-center gap-8 sm:gap-12 lg:gap-16 flex-wrap">
          {logos.map((item, i) => (
            <motion.div
              key={`${item.name}-${i}`}
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              {item.logo ? (
                <div className="relative h-10 sm:h-12 w-28 sm:w-36 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                  <img
                    src={item.logo}
                    alt={item.name || `logo-${i}`}
                    loading="lazy"
                    className="block w-full h-full object-contain"
                  />
                  <ImageEditOverlay sectionKey="trustedBy" label="logo" size="sm" />
                </div>
              ) : (
                <div className="relative inline-flex items-center justify-center px-2 py-1 overflow-hidden rounded">
                  <span className="text-sm sm:text-base font-bold text-muted-foreground/15 hover:text-muted-foreground/35 transition-colors duration-300 cursor-default select-none">
                    {item.name}
                  </span>
                  <ImageEditOverlay sectionKey="trustedBy" label="logo" empty size="sm" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
