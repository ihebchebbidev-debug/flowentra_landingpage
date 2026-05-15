// =============================================================================
// Page Templates & Section Variants
// -----------------------------------------------------------------------------
// Templates = pre-composed pages with multiple sections + ready content (4 langs).
// Variants  = single-section presets (e.g. "Bold Hero", "Minimal Hero").
//
// Each "content" map is keyed by content_key, with per-language values.
// The backend's apply_template / apply_section_variant actions translate this
// into rows in flowentra_page_sections + flowentra_site_content.
// =============================================================================

export type LangMap = { en?: string; fr?: string; de?: string; ar?: string };
export type ContentMap = Record<string, LangMap>;

export interface SectionVariant {
  id: string;
  label: string;
  description?: string;
  content: ContentMap;
}

export interface TemplateSection {
  section_type: string;
  variant?: string;
  content?: ContentMap;
}

export interface PageTemplate {
  id: string;
  label: string;
  description: string;
  emoji?: string;
  category?: string;
  meta: {
    title: LangMap;
    description?: LangMap;
  };
  sections: TemplateSection[];
}

// Small helper to keep variant definitions terse.
const L = (en: string, fr: string, de: string, ar: string): LangMap => ({ en, fr, de, ar });

// -----------------------------------------------------------------------------
// SECTION VARIANTS — pick a flavor when adding a single section
// -----------------------------------------------------------------------------
export const SECTION_VARIANTS: Record<string, SectionVariant[]> = {
  hero: [
    {
      id: "bold",
      label: "Bold launch",
      description: "Punchy headline + dual CTAs — great for product launches.",
      content: {
        title: L("Ship faster. Scale smarter.", "Livrez plus vite. Évoluez plus intelligemment.", "Schneller liefern. Klüger skalieren.", "اشحن أسرع. توسّع بذكاء."),
        subtitle: L("The all-in-one platform built for teams that move fast and break nothing.", "La plateforme tout-en-un pour les équipes qui avancent vite sans rien casser.", "Die All-in-One-Plattform für Teams, die schnell vorankommen, ohne etwas zu zerbrechen.", "المنصة الشاملة للفرق التي تتحرك بسرعة دون كسر أي شيء."),
        primaryCtaLabel: L("Start free", "Commencer gratuitement", "Kostenlos starten", "ابدأ مجانًا"),
        secondaryCtaLabel: L("Watch demo", "Voir la démo", "Demo ansehen", "شاهد العرض"),
      },
    },
    {
      id: "minimal",
      label: "Minimal editorial",
      description: "Quiet, confident headline with a single CTA.",
      content: {
        title: L("A calmer way to build software.", "Une manière plus sereine de créer des logiciels.", "Eine ruhigere Art, Software zu entwickeln.", "طريقة أكثر هدوءاً لبناء البرمجيات."),
        subtitle: L("No noise. No bloat. Just the tools you actually need.", "Pas de bruit. Pas de superflu. Juste les outils essentiels.", "Kein Lärm. Kein Ballast. Nur die Werkzeuge, die Sie wirklich brauchen.", "بدون ضوضاء. بدون تضخّم. فقط الأدوات التي تحتاجها فعلاً."),
        primaryCtaLabel: L("Get started", "Commencer", "Loslegen", "ابدأ الآن"),
      },
    },
    {
      id: "enterprise",
      label: "Enterprise trust",
      description: "Authority-led headline aimed at procurement & IT.",
      content: {
        title: L("Enterprise-grade infrastructure your team can trust.", "Une infrastructure de niveau entreprise digne de confiance.", "Infrastruktur auf Enterprise-Niveau, der Ihr Team vertrauen kann.", "بنية تحتية بمستوى المؤسسات يثق بها فريقك."),
        subtitle: L("SOC 2 Type II, GDPR-ready, with 99.99% uptime backed by a real SLA.", "SOC 2 Type II, conforme RGPD, avec 99,99 % de disponibilité garantie par SLA.", "SOC 2 Typ II, DSGVO-konform, 99,99 % Verfügbarkeit mit echter SLA.", "SOC 2 Type II، متوافق مع GDPR، بزمن تشغيل 99.99% مدعوم باتفاقية SLA."),
        primaryCtaLabel: L("Talk to sales", "Parler aux ventes", "Vertrieb kontaktieren", "تواصل مع المبيعات"),
        secondaryCtaLabel: L("Read security docs", "Documents de sécurité", "Sicherheitsdokumente", "وثائق الأمان"),
      },
    },
    {
      id: "startup",
      label: "Startup pitch",
      description: "Vision-led, ambitious tone for early-stage products.",
      content: {
        title: L("The future of work, today.", "Le futur du travail, dès aujourd'hui.", "Die Zukunft der Arbeit, heute.", "مستقبل العمل، اليوم."),
        subtitle: L("Join thousands of teams reinventing how they collaborate, ship, and grow.", "Rejoignez des milliers d'équipes qui réinventent leur collaboration.", "Schließen Sie sich tausenden Teams an, die Zusammenarbeit neu erfinden.", "انضم إلى آلاف الفرق التي تعيد ابتكار التعاون."),
        primaryCtaLabel: L("Join the beta", "Rejoindre la bêta", "Zur Beta", "انضم للتجربة"),
        secondaryCtaLabel: L("Learn more", "En savoir plus", "Mehr erfahren", "اعرف المزيد"),
      },
    },
    {
      id: "agency",
      label: "Agency / services",
      description: "Service-business framing for agencies and consultancies.",
      content: {
        title: L("Digital products that move the needle.", "Des produits numériques qui font la différence.", "Digitale Produkte, die etwas bewegen.", "منتجات رقمية تُحدث فرقًا."),
        subtitle: L("We design, build and scale software for ambitious brands worldwide.", "Nous concevons, développons et faisons évoluer des logiciels pour les marques ambitieuses.", "Wir gestalten, entwickeln und skalieren Software für ambitionierte Marken.", "نصمم ونبني ونوسّع البرمجيات للعلامات الطموحة."),
        primaryCtaLabel: L("Start a project", "Démarrer un projet", "Projekt starten", "ابدأ مشروعًا"),
        secondaryCtaLabel: L("View work", "Voir nos réalisations", "Arbeiten ansehen", "أعمالنا"),
      },
    },
    {
      id: "event",
      label: "Event / webinar",
      description: "Time-bound hero for conferences, launches, webinars.",
      content: {
        title: L("Flowentra Live 2026 — Reserve your seat.", "Flowentra Live 2026 — Réservez votre place.", "Flowentra Live 2026 — Sichern Sie Ihren Platz.", "فلوينترا لايف 2026 — احجز مقعدك."),
        subtitle: L("Two days. Twenty speakers. One unmissable event for product teams.", "Deux jours. Vingt intervenants. L'événement à ne pas manquer.", "Zwei Tage. Zwanzig Speaker. Das Event für Produktteams.", "يومان. عشرون متحدثًا. حدث لا يُفوّت لفرق المنتجات."),
        primaryCtaLabel: L("Register now", "S'inscrire", "Jetzt anmelden", "سجّل الآن"),
        secondaryCtaLabel: L("View agenda", "Voir le programme", "Programm ansehen", "البرنامج"),
      },
    },
  ],

  features: [
    {
      id: "core4",
      label: "Four core pillars",
      description: "Standard four-feature grid covering speed, scale, security, support.",
      content: {
        eyebrow: L("Why teams choose us", "Pourquoi les équipes nous choisissent", "Warum Teams uns wählen", "لماذا تختارنا الفرق"),
        title: L("Everything you need, nothing you don't.", "Tout ce qu'il vous faut, rien de plus.", "Alles, was Sie brauchen — nichts, was Sie nicht brauchen.", "كل ما تحتاجه، ولا شيء زائد."),
      },
    },
    {
      id: "developer",
      label: "Developer-focused",
      description: "Speaks directly to engineers — APIs, SDKs, tooling.",
      content: {
        eyebrow: L("Built by developers", "Conçu par des développeurs", "Von Entwicklern gebaut", "مبنية من قبل المطورين"),
        title: L("Tools that respect your time.", "Des outils qui respectent votre temps.", "Werkzeuge, die Ihre Zeit respektieren.", "أدوات تحترم وقتك."),
      },
    },
    {
      id: "marketer",
      label: "Marketer-focused",
      description: "Outcomes-led copy aimed at growth and marketing teams.",
      content: {
        eyebrow: L("Built for growth", "Conçu pour la croissance", "Für Wachstum gemacht", "مصممة للنمو"),
        title: L("Launch campaigns that actually convert.", "Lancez des campagnes qui convertissent vraiment.", "Starten Sie Kampagnen, die wirklich konvertieren.", "أطلق حملات تحقق تحويلات حقيقية."),
      },
    },
    {
      id: "ai",
      label: "AI-first",
      description: "Highlights automation, AI assistance, and intelligence.",
      content: {
        eyebrow: L("Powered by AI", "Propulsé par l'IA", "Mit KI angetrieben", "مدعوم بالذكاء الاصطناعي"),
        title: L("Let AI handle the busywork.", "Laissez l'IA gérer les tâches répétitives.", "Überlassen Sie der KI die Routinearbeit.", "اترك الذكاء الاصطناعي يتولى المهام الروتينية."),
      },
    },
  ],

  ctaBanner: [
    {
      id: "trial",
      label: "Free-trial CTA",
      description: "Conversion-focused with a single primary action.",
      content: {
        title: L("Try it free for 14 days.", "Essayez gratuitement pendant 14 jours.", "14 Tage kostenlos testen.", "جرّبه مجانًا لمدة 14 يومًا."),
        subtitle: L("No credit card. Full access. Cancel anytime.", "Sans carte. Accès complet. Annulez à tout moment.", "Keine Kreditkarte. Voller Zugang. Jederzeit kündbar.", "بدون بطاقة ائتمان. وصول كامل. ألغِ في أي وقت."),
        ctaLabel: L("Start free trial", "Démarrer l'essai", "Testversion starten", "ابدأ التجربة"),
      },
    },
    {
      id: "demo",
      label: "Book-a-demo CTA",
      description: "Sales-led with a meeting booking action.",
      content: {
        title: L("See it in action.", "Voyez-le en action.", "Sehen Sie es in Aktion.", "شاهده وهو يعمل."),
        subtitle: L("30 minutes with a product specialist — tailored to your stack.", "30 minutes avec un spécialiste produit — adapté à votre stack.", "30 Minuten mit einer Produktspezialistin — auf Ihren Stack zugeschnitten.", "30 دقيقة مع متخصص منتج — مخصصة لبيئتك."),
        ctaLabel: L("Book a demo", "Réserver une démo", "Demo buchen", "احجز عرضًا"),
      },
    },
    {
      id: "newsletter",
      label: "Newsletter signup",
      description: "Soft-conversion CTA for content & community.",
      content: {
        title: L("Join 25,000+ readers.", "Rejoignez 25 000+ lecteurs.", "25.000+ Leser sind dabei.", "انضم إلى أكثر من 25,000 قارئ."),
        subtitle: L("One thoughtful email per week. No fluff. Unsubscribe anytime.", "Un email réfléchi par semaine. Sans superflu. Désabonnement à tout moment.", "Eine durchdachte E-Mail pro Woche. Ohne Füller. Jederzeit abbestellbar.", "بريد إلكتروني واحد مدروس كل أسبوع. ألغِ الاشتراك في أي وقت."),
        ctaLabel: L("Subscribe", "S'abonner", "Abonnieren", "اشترك"),
      },
    },
    {
      id: "contact",
      label: "Contact us CTA",
      description: "General-purpose 'get in touch' banner.",
      content: {
        title: L("Have a question? We're listening.", "Une question ? Nous sommes à l'écoute.", "Eine Frage? Wir hören zu.", "هل لديك سؤال؟ نحن نستمع."),
        subtitle: L("Reach out and a real human will reply within one business day.", "Écrivez-nous et un humain vous répondra sous un jour ouvré.", "Schreiben Sie uns — ein echter Mensch antwortet innerhalb eines Werktags.", "تواصل معنا وسيرد عليك إنسان حقيقي خلال يوم عمل."),
        ctaLabel: L("Contact us", "Nous contacter", "Kontaktieren Sie uns", "اتصل بنا"),
      },
    },
  ],

  faq: [
    {
      id: "general",
      label: "General FAQ",
      description: "Common questions about pricing, security, support.",
      content: {
        title: L("Frequently asked questions", "Questions fréquentes", "Häufig gestellte Fragen", "الأسئلة الشائعة"),
        subtitle: L("Can't find what you're looking for? Contact our team.", "Vous ne trouvez pas ? Contactez notre équipe.", "Nicht gefunden? Kontaktieren Sie uns.", "لم تجد ما تبحث عنه؟ تواصل معنا."),
      },
    },
    {
      id: "billing",
      label: "Billing & pricing FAQ",
      description: "Focused on payment, refunds, plans.",
      content: {
        title: L("Billing & pricing questions", "Questions sur la facturation", "Fragen zu Abrechnung & Preisen", "أسئلة الفوترة والتسعير"),
        subtitle: L("Everything you need to know before upgrading.", "Tout ce qu'il faut savoir avant de mettre à niveau.", "Alles, was Sie vor dem Upgrade wissen müssen.", "كل ما تحتاج معرفته قبل الترقية."),
      },
    },
    {
      id: "security",
      label: "Security & compliance FAQ",
      description: "For procurement, IT, security reviewers.",
      content: {
        title: L("Security & compliance", "Sécurité et conformité", "Sicherheit und Compliance", "الأمان والامتثال"),
        subtitle: L("How we protect your data and meet enterprise requirements.", "Comment nous protégeons vos données et répondons aux exigences entreprise.", "Wie wir Ihre Daten schützen und Enterprise-Anforderungen erfüllen.", "كيف نحمي بياناتك ونلبي متطلبات المؤسسات."),
      },
    },
  ],

  contact: [
    {
      id: "sales",
      label: "Talk to sales",
      content: {
        title: L("Let's talk.", "Parlons.", "Lass uns reden.", "لنتحدث."),
        subtitle: L("Tell us a bit about your team and we'll be in touch within one business day.", "Parlez-nous de votre équipe et nous reviendrons vers vous sous un jour ouvré.", "Erzählen Sie uns von Ihrem Team — wir melden uns innerhalb eines Werktags.", "أخبرنا عن فريقك وسنتواصل معك خلال يوم عمل واحد."),
      },
    },
    {
      id: "support",
      label: "Get support",
      content: {
        title: L("We're here to help.", "Nous sommes là pour vous aider.", "Wir sind für Sie da.", "نحن هنا لمساعدتك."),
        subtitle: L("Average first response: under 2 hours during business hours.", "Première réponse en moyenne : moins de 2 heures aux heures de bureau.", "Durchschnittliche Erstantwort: unter 2 Stunden während der Geschäftszeiten.", "متوسط أول رد: أقل من ساعتين خلال ساعات العمل."),
      },
    },
    {
      id: "partnership",
      label: "Partnerships",
      content: {
        title: L("Let's build together.", "Construisons ensemble.", "Lass uns gemeinsam bauen.", "لنبنِ معًا."),
        subtitle: L("Agencies, resellers, integrators — we'd love to hear from you.", "Agences, revendeurs, intégrateurs — nous aimerions vous entendre.", "Agenturen, Reseller, Integratoren — wir hören gerne von Ihnen.", "وكالات وموزعون ومتكاملون — يسعدنا التواصل معكم."),
      },
    },
    {
      id: "press",
      label: "Press & media",
      content: {
        title: L("Press inquiries", "Demandes presse", "Presseanfragen", "استفسارات الصحافة"),
        subtitle: L("Journalists and analysts: reach our communications team here.", "Journalistes et analystes : contactez notre équipe communication ici.", "Journalisten und Analysten: Hier erreichen Sie unsere Kommunikationsabteilung.", "للصحفيين والمحللين: تواصلوا مع فريق الاتصالات هنا."),
      },
    },
  ],

  // pricing/testimonials/metrics defined below alongside other section variants

  howItWorks: [
    {
      id: "3-step",
      label: "Three-step flow",
      content: {
        eyebrow: L("How it works", "Comment ça marche", "So funktioniert's", "كيف يعمل"),
        title: L("From signup to shipping in three steps.", "De l'inscription au lancement en trois étapes.", "Von der Anmeldung bis zum Launch in drei Schritten.", "من التسجيل إلى الإطلاق في ثلاث خطوات."),
      },
    },
    {
      id: "onboarding",
      label: "Onboarding journey",
      description: "Walks first-time users through setup steps.",
      content: {
        eyebrow: L("Get started in minutes", "Commencez en quelques minutes", "In Minuten startklar", "ابدأ في دقائق"),
        title: L("Up and running before your coffee gets cold.", "Opérationnel avant que votre café ne refroidisse.", "Einsatzbereit, bevor Ihr Kaffee kalt wird.", "جاهز للعمل قبل أن تبرد قهوتك."),
      },
    },
    {
      id: "process",
      label: "Process / methodology",
      description: "Explains a service or consulting workflow.",
      content: {
        eyebrow: L("Our process", "Notre processus", "Unser Prozess", "منهجيتنا"),
        title: L("A proven methodology, refined across 200+ projects.", "Une méthodologie éprouvée, affinée sur plus de 200 projets.", "Eine bewährte Methodik, verfeinert in über 200 Projekten.", "منهجية مُجرَّبة، صُقلت عبر أكثر من 200 مشروع."),
      },
    },
  ],

  trustedBy: [
    {
      id: "logos",
      label: "Logo cloud",
      description: "Row of customer/partner logos for instant credibility.",
      content: {
        title: L("Trusted by teams at", "Adopté par les équipes de", "Vertraut von Teams bei", "موثوق من فرق في"),
      },
    },
    {
      id: "press",
      label: "As featured in",
      description: "Media-mention bar — great for PR-led launches.",
      content: {
        title: L("As featured in", "Vu dans", "Bekannt aus", "ظهرنا في"),
      },
    },
  ],

  productShowcase: [
    {
      id: "split",
      label: "Split image + copy",
      description: "Classic two-column layout with screenshot and benefits.",
      content: {
        eyebrow: L("Product tour", "Visite produit", "Produkttour", "جولة في المنتج"),
        title: L("Designed for the way modern teams actually work.", "Conçu pour la manière dont les équipes modernes travaillent vraiment.", "Gestaltet, wie moderne Teams wirklich arbeiten.", "مصمم بالطريقة التي تعمل بها الفرق الحديثة فعلًا."),
      },
    },
    {
      id: "spotlight",
      label: "Single feature spotlight",
      description: "Zoom in on one hero feature with rich detail.",
      content: {
        eyebrow: L("Spotlight", "À la une", "Im Fokus", "في الواجهة"),
        title: L("The one feature your team will use every day.", "La fonctionnalité que votre équipe utilisera chaque jour.", "Die eine Funktion, die Ihr Team täglich nutzen wird.", "الميزة التي سيستخدمها فريقك كل يوم."),
      },
    },
  ],

  demo: [
    {
      id: "video",
      label: "Video demo",
      description: "Embedded product video with play overlay.",
      content: {
        eyebrow: L("Watch it work", "Regardez-le en action", "Sehen Sie es in Aktion", "شاهده يعمل"),
        title: L("Two minutes. One product. Zero fluff.", "Deux minutes. Un produit. Zéro superflu.", "Zwei Minuten. Ein Produkt. Null Füller.", "دقيقتان. منتج واحد. بدون حشو."),
      },
    },
    {
      id: "interactive",
      label: "Interactive preview",
      description: "Clickable mock UI for hands-on exploration.",
      content: {
        eyebrow: L("Try it now", "Essayez maintenant", "Jetzt ausprobieren", "جرّب الآن"),
        title: L("Play with a live preview — no signup required.", "Jouez avec un aperçu en direct — sans inscription.", "Spielen Sie mit einer Live-Vorschau — ohne Anmeldung.", "تفاعل مع معاينة مباشرة — دون تسجيل."),
      },
    },
  ],

  integrations: [
    {
      id: "grid",
      label: "Integration grid",
      description: "Logo grid of supported tools and platforms.",
      content: {
        eyebrow: L("Integrations", "Intégrations", "Integrationen", "التكاملات"),
        title: L("Plays well with your existing stack.", "S'intègre parfaitement à votre stack existante.", "Funktioniert reibungslos mit Ihrem Tech-Stack.", "تتكامل بسلاسة مع أدواتك الحالية."),
      },
    },
  ],

  comparisonTable: [
    {
      id: "vs-competitor",
      label: "Versus competitor",
      description: "Side-by-side feature comparison table.",
      content: {
        eyebrow: L("Comparison", "Comparaison", "Vergleich", "مقارنة"),
        title: L("Why teams switch to us.", "Pourquoi les équipes nous choisissent.", "Warum Teams zu uns wechseln.", "لماذا تنتقل الفرق إلينا."),
      },
    },
  ],

  pricing: [
    {
      id: "simple",
      label: "Simple & transparent",
      content: {
        eyebrow: L("Pricing", "Tarifs", "Preise", "الأسعار"),
        title: L("Simple, transparent pricing", "Tarification simple et transparente", "Einfache, transparente Preise", "تسعير بسيط وشفاف"),
        subtitle: L("Pick the plan that fits today. Upgrade as you grow.", "Choisissez le plan qui vous convient. Évoluez à votre rythme.", "Wählen Sie den passenden Plan. Skalieren Sie mit Ihrem Wachstum.", "اختر الخطة المناسبة لك اليوم. ارتقِ كلما نموت."),
      },
    },
    {
      id: "freemium",
      label: "Freemium emphasis",
      description: "Highlights a generous free tier with paid upgrades.",
      content: {
        eyebrow: L("Free forever", "Gratuit pour toujours", "Für immer kostenlos", "مجاني للأبد"),
        title: L("Start free. Pay only when you grow.", "Commencez gratuitement. Payez uniquement en grandissant.", "Kostenlos starten. Erst zahlen, wenn Sie wachsen.", "ابدأ مجانًا. ادفع فقط عند النمو."),
      },
    },
    {
      id: "enterprise-cta",
      label: "Enterprise contact",
      description: "Plans card layout ending in a 'contact sales' tier.",
      content: {
        eyebrow: L("Plans for every team", "Des plans pour chaque équipe", "Pläne für jedes Team", "خطط لكل فريق"),
        title: L("From solo builders to global enterprises.", "Du créateur solo aux grandes entreprises mondiales.", "Vom Einzelnutzer bis zum globalen Konzern.", "من المطورين الأفراد إلى المؤسسات العالمية."),
      },
    },
  ],

  testimonials: [
    {
      id: "social-proof",
      label: "Social proof",
      content: {
        eyebrow: L("Loved by teams", "Adoré par les équipes", "Von Teams geliebt", "محبوب من الفرق"),
        title: L("Trusted by 10,000+ teams worldwide", "Adopté par plus de 10 000 équipes", "Von über 10.000 Teams genutzt", "موثوق من أكثر من 10,000 فريق"),
      },
    },
    {
      id: "case-study",
      label: "Case study quote",
      description: "Single anchor quote with attribution and result.",
      content: {
        eyebrow: L("Customer story", "Témoignage client", "Kundenstory", "قصة عميل"),
        title: L("\"It paid for itself in the first month.\"", "« Rentabilisé dès le premier mois. »", "„Hat sich im ersten Monat amortisiert.\u201C", "\"استرد تكلفته في الشهر الأول.\""),
      },
    },
  ],

  metrics: [
    {
      id: "growth",
      label: "Growth metrics",
      content: {
        eyebrow: L("By the numbers", "En chiffres", "In Zahlen", "بالأرقام"),
        title: L("Growth that speaks for itself.", "Une croissance qui parle d'elle-même.", "Wachstum, das für sich spricht.", "نمو يتحدث عن نفسه."),
      },
    },
    {
      id: "impact",
      label: "Customer impact",
      description: "Outcome-focused stats — time saved, revenue earned.",
      content: {
        eyebrow: L("Real-world impact", "Impact concret", "Echte Wirkung", "أثر حقيقي"),
        title: L("Numbers our customers care about.", "Les chiffres qui comptent pour nos clients.", "Zahlen, die für unsere Kunden zählen.", "أرقام تهمّ عملاءنا."),
      },
    },
  ],
};

// -----------------------------------------------------------------------------
// PAGE TEMPLATES — multi-section starter pages
// -----------------------------------------------------------------------------
export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "blank",
    label: "Blank page",
    description: "Start from scratch and add sections one by one.",
    emoji: "📄",
    category: "Basics",
    meta: { title: { en: "" } },
    sections: [],
  },

  // ---------------- Marketing & SaaS ----------------
  {
    id: "saas-landing",
    label: "SaaS landing page",
    description: "Hero · Trust bar · Features · How it works · Pricing · FAQ · CTA",
    emoji: "🚀",
    category: "Marketing",
    meta: {
      title: L("Modern SaaS for ambitious teams", "SaaS moderne pour équipes ambitieuses", "Modernes SaaS für ambitionierte Teams", "SaaS حديث للفرق الطموحة"),
      description: L("All the tools your team needs to ship faster, in one beautifully integrated platform.", "Tous les outils dont votre équipe a besoin pour livrer plus vite, sur une plateforme intégrée.", "Alle Tools, die Ihr Team braucht, um schneller zu liefern — in einer integrierten Plattform.", "جميع الأدوات التي يحتاجها فريقك للشحن بسرعة، في منصة متكاملة."),
    },
    sections: [
      { section_type: "hero", variant: "bold" },
      { section_type: "trustedBy" },
      { section_type: "features", variant: "core4" },
      { section_type: "howItWorks", variant: "3-step" },
      { section_type: "pricing", variant: "simple" },
      { section_type: "faq", variant: "general" },
      { section_type: "ctaBanner", variant: "trial" },
    ],
  },
  {
    id: "product-launch",
    label: "Product launch",
    description: "Hero · Showcase · Demo · Metrics · Testimonials · CTA",
    emoji: "🎉",
    category: "Marketing",
    meta: {
      title: L("Introducing our biggest release yet", "Notre plus grande sortie à ce jour", "Unser bisher größtes Release", "أكبر إصدار لنا حتى الآن"),
      description: L("See what's new and why it matters.", "Découvrez les nouveautés et pourquoi elles comptent.", "Erfahren Sie, was neu ist und warum es zählt.", "اكتشف الجديد ولماذا يهم."),
    },
    sections: [
      { section_type: "hero", variant: "bold" },
      { section_type: "productShowcase" },
      { section_type: "demo" },
      { section_type: "metrics", variant: "growth" },
      { section_type: "testimonials", variant: "social-proof" },
      { section_type: "ctaBanner", variant: "demo" },
    ],
  },
  {
    id: "feature-deep-dive",
    label: "Feature deep-dive",
    description: "Hero · Showcase · How it works · Demo · FAQ · CTA",
    emoji: "🔍",
    category: "Marketing",
    meta: {
      title: L("A closer look at what makes it powerful", "Un regard approfondi sur sa puissance", "Ein genauer Blick auf die Stärken", "نظرة أعمق على ما يجعله قويًا"),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "productShowcase" },
      { section_type: "howItWorks", variant: "3-step" },
      { section_type: "demo" },
      { section_type: "faq", variant: "general" },
      { section_type: "ctaBanner", variant: "trial" },
    ],
  },
  {
    id: "ai-product",
    label: "AI product page",
    description: "AI hero · Features · Demo · Integrations · CTA",
    emoji: "🤖",
    category: "Marketing",
    meta: {
      title: L("Meet your new AI teammate", "Rencontrez votre nouvel équipier IA", "Lernen Sie Ihren neuen KI-Teamkollegen kennen", "تعرّف على زميلك الذكي الجديد"),
      description: L("AI that ships work, not just suggestions.", "Une IA qui livre du travail, pas seulement des suggestions.", "KI, die liefert — nicht nur Vorschläge macht.", "ذكاء اصطناعي ينجز العمل، وليس مجرد اقتراحات."),
    },
    sections: [
      { section_type: "hero", variant: "bold" },
      { section_type: "features", variant: "ai" },
      { section_type: "demo" },
      { section_type: "integrations" },
      { section_type: "ctaBanner", variant: "demo" },
    ],
  },

  // ---------------- Enterprise & Sales ----------------
  {
    id: "enterprise-pitch",
    label: "Enterprise pitch",
    description: "Hero · Comparison · Integrations · Contact",
    emoji: "🏢",
    category: "Enterprise",
    meta: {
      title: L("Enterprise solutions, tailored to your industry", "Solutions entreprise adaptées à votre secteur", "Enterprise-Lösungen für Ihre Branche", "حلول مؤسسية مصممة لقطاعك"),
    },
    sections: [
      { section_type: "hero", variant: "enterprise" },
      { section_type: "comparisonTable" },
      { section_type: "integrations" },
      { section_type: "contact", variant: "sales" },
    ],
  },
  {
    id: "security-page",
    label: "Security & trust",
    description: "Hero · Features · FAQ · Contact sales",
    emoji: "🛡️",
    category: "Enterprise",
    meta: {
      title: L("Security you can audit, trust you can verify", "Une sécurité auditable, une confiance vérifiable", "Sicherheit zum Prüfen, Vertrauen zum Verifizieren", "أمان يمكن تدقيقه، وثقة يمكن التحقق منها"),
    },
    sections: [
      { section_type: "hero", variant: "enterprise" },
      { section_type: "features", variant: "core4" },
      { section_type: "faq", variant: "security" },
      { section_type: "contact", variant: "sales" },
    ],
  },
  {
    id: "compare-vs",
    label: "Compare / alternative",
    description: "Hero · Comparison · Testimonials · CTA",
    emoji: "⚖️",
    category: "Enterprise",
    meta: {
      title: L("How we compare", "Comparatif", "Vergleich", "كيف نختلف"),
      description: L("An honest, side-by-side look at the alternatives.", "Un comparatif honnête et côte à côte avec les alternatives.", "Ein ehrlicher Vergleich mit Alternativen.", "مقارنة صادقة جنبًا إلى جنب مع البدائل."),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "comparisonTable" },
      { section_type: "testimonials", variant: "social-proof" },
      { section_type: "ctaBanner", variant: "trial" },
    ],
  },

  // ---------------- Conversion-focused ----------------
  {
    id: "long-form-landing",
    label: "Long-form landing",
    description: "Hero · Trust · Features · Showcase · How it works · Metrics · Testimonials · Pricing · FAQ · CTA",
    emoji: "📜",
    category: "Conversion",
    meta: {
      title: L("Everything in one place", "Tout au même endroit", "Alles an einem Ort", "كل شيء في مكان واحد"),
    },
    sections: [
      { section_type: "hero", variant: "bold" },
      { section_type: "trustedBy" },
      { section_type: "features", variant: "core4" },
      { section_type: "productShowcase" },
      { section_type: "howItWorks", variant: "3-step" },
      { section_type: "metrics", variant: "growth" },
      { section_type: "testimonials", variant: "social-proof" },
      { section_type: "pricing", variant: "simple" },
      { section_type: "faq", variant: "general" },
      { section_type: "ctaBanner", variant: "trial" },
    ],
  },
  {
    id: "lead-magnet",
    label: "Lead magnet",
    description: "Hero · Features · Newsletter CTA · FAQ",
    emoji: "🧲",
    category: "Conversion",
    meta: {
      title: L("Get the free playbook", "Téléchargez le guide gratuit", "Holen Sie sich das kostenlose Playbook", "احصل على الدليل المجاني"),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "features", variant: "core4" },
      { section_type: "ctaBanner", variant: "newsletter" },
      { section_type: "faq", variant: "general" },
    ],
  },
  {
    id: "webinar-landing",
    label: "Webinar / event",
    description: "Event hero · Metrics · How it works · CTA",
    emoji: "🎤",
    category: "Conversion",
    meta: {
      title: L("Reserve your seat", "Réservez votre place", "Sichern Sie Ihren Platz", "احجز مقعدك"),
    },
    sections: [
      { section_type: "hero", variant: "event" },
      { section_type: "metrics", variant: "growth" },
      { section_type: "howItWorks", variant: "3-step" },
      { section_type: "ctaBanner", variant: "demo" },
    ],
  },

  // ---------------- Company / brand ----------------
  {
    id: "about-us",
    label: "About us",
    description: "Hero · Metrics · Testimonials · Contact",
    emoji: "👋",
    category: "Company",
    meta: {
      title: L("About us", "À propos", "Über uns", "من نحن"),
      description: L("Our mission, our team, and what drives us forward.", "Notre mission, notre équipe et ce qui nous fait avancer.", "Unsere Mission, unser Team und was uns antreibt.", "مهمتنا وفريقنا وما يدفعنا للأمام."),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "metrics", variant: "growth" },
      { section_type: "testimonials", variant: "social-proof" },
      { section_type: "contact", variant: "sales" },
    ],
  },
  {
    id: "careers",
    label: "Careers",
    description: "Hero · Metrics · Features · CTA",
    emoji: "💼",
    category: "Company",
    meta: {
      title: L("Build the future with us", "Construisez l'avenir avec nous", "Gestalten Sie mit uns die Zukunft", "ابنِ المستقبل معنا"),
      description: L("Join a team that values craft, autonomy, and impact.", "Rejoignez une équipe qui valorise le savoir-faire, l'autonomie et l'impact.", "Werden Sie Teil eines Teams, das Handwerk, Autonomie und Wirkung schätzt.", "انضم إلى فريق يقدّر الإتقان والاستقلالية والأثر."),
    },
    sections: [
      { section_type: "hero", variant: "startup" },
      { section_type: "metrics", variant: "growth" },
      { section_type: "features", variant: "core4" },
      { section_type: "ctaBanner", variant: "contact" },
    ],
  },
  {
    id: "partners",
    label: "Partners program",
    description: "Hero · Features · How it works · Contact partnerships",
    emoji: "🤝",
    category: "Company",
    meta: {
      title: L("Grow your business with Flowentra", "Développez votre entreprise avec Flowentra", "Wachsen Sie mit Flowentra", "نمِّ أعمالك مع فلوينترا"),
    },
    sections: [
      { section_type: "hero", variant: "agency" },
      { section_type: "features", variant: "core4" },
      { section_type: "howItWorks", variant: "3-step" },
      { section_type: "contact", variant: "partnership" },
    ],
  },
  {
    id: "press",
    label: "Press & media",
    description: "Hero · Metrics · Press contact",
    emoji: "📰",
    category: "Company",
    meta: {
      title: L("Press & media", "Presse et médias", "Presse & Medien", "الصحافة والإعلام"),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "metrics", variant: "growth" },
      { section_type: "contact", variant: "press" },
    ],
  },

  // ---------------- Utility pages ----------------
  {
    id: "pricing-page",
    label: "Pricing page",
    description: "Hero · Pricing · Comparison · FAQ · CTA",
    emoji: "💰",
    category: "Utility",
    meta: {
      title: L("Simple, transparent pricing", "Tarification simple et transparente", "Einfache, transparente Preise", "تسعير بسيط وشفاف"),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "pricing", variant: "simple" },
      { section_type: "comparisonTable" },
      { section_type: "faq", variant: "billing" },
      { section_type: "ctaBanner", variant: "trial" },
    ],
  },
  {
    id: "contact-page",
    label: "Contact page",
    description: "Hero · Contact form · FAQ",
    emoji: "✉️",
    category: "Utility",
    meta: {
      title: L("Contact us", "Contactez-nous", "Kontaktieren Sie uns", "اتصل بنا"),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "contact", variant: "support" },
      { section_type: "faq", variant: "general" },
    ],
  },
  {
    id: "support-page",
    label: "Support / help",
    description: "Hero · FAQ · Contact support",
    emoji: "🛟",
    category: "Utility",
    meta: {
      title: L("How can we help?", "Comment pouvons-nous aider ?", "Wie können wir helfen?", "كيف يمكننا المساعدة؟"),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "faq", variant: "general" },
      { section_type: "contact", variant: "support" },
    ],
  },
  {
    id: "integrations-page",
    label: "Integrations hub",
    description: "Hero · Integrations · CTA",
    emoji: "🔌",
    category: "Utility",
    meta: {
      title: L("Works with the tools you already love", "Compatible avec vos outils préférés", "Funktioniert mit Ihren Lieblingstools", "يعمل مع الأدوات التي تحبها"),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "integrations" },
      { section_type: "ctaBanner", variant: "trial" },
    ],
  },
  {
    id: "thank-you",
    label: "Thank you / confirmation",
    description: "Hero · CTA · Newsletter",
    emoji: "🙏",
    category: "Utility",
    meta: {
      title: L("Thank you!", "Merci !", "Vielen Dank!", "شكراً لك!"),
      description: L("We've received your request and will be in touch shortly.", "Nous avons reçu votre demande et reviendrons vers vous rapidement.", "Wir haben Ihre Anfrage erhalten und melden uns in Kürze.", "تلقينا طلبك وسنتواصل معك قريبًا."),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "ctaBanner", variant: "newsletter" },
    ],
  },
  {
    id: "coming-soon",
    label: "Coming soon",
    description: "Hero · Newsletter signup",
    emoji: "🔜",
    category: "Utility",
    meta: {
      title: L("Coming soon", "Bientôt disponible", "Bald verfügbar", "قريبًا"),
      description: L("Something exciting is on the way.", "Quelque chose d'enthousiasmant arrive.", "Etwas Spannendes ist im Anflug.", "شيء مثير قادم في الطريق."),
    },
    sections: [
      { section_type: "hero", variant: "startup" },
      { section_type: "ctaBanner", variant: "newsletter" },
    ],
  },

  // ---------------- Industry-specific ----------------
  {
    id: "agency-site",
    label: "Agency / studio",
    description: "Agency hero · Showcase · Testimonials · Contact",
    emoji: "🎨",
    category: "Industry",
    meta: {
      title: L("Independent studio for ambitious brands", "Studio indépendant pour marques ambitieuses", "Unabhängiges Studio für ambitionierte Marken", "استوديو مستقل للعلامات الطموحة"),
    },
    sections: [
      { section_type: "hero", variant: "agency" },
      { section_type: "productShowcase" },
      { section_type: "testimonials", variant: "social-proof" },
      { section_type: "contact", variant: "sales" },
    ],
  },
  {
    id: "startup-landing",
    label: "Startup beta",
    description: "Startup hero · Features · Newsletter",
    emoji: "🌱",
    category: "Industry",
    meta: {
      title: L("Join the early access", "Rejoignez l'accès anticipé", "Werden Sie Early-Access-Nutzer", "انضم للوصول المبكر"),
    },
    sections: [
      { section_type: "hero", variant: "startup" },
      { section_type: "features", variant: "core4" },
      { section_type: "ctaBanner", variant: "newsletter" },
    ],
  },
  {
    id: "developer-site",
    label: "Developer platform",
    description: "Developer hero · Features · Integrations · Demo",
    emoji: "💻",
    category: "Industry",
    meta: {
      title: L("Built for developers, by developers", "Conçu par et pour les développeurs", "Von Entwicklern, für Entwickler", "مصممة للمطورين، من قبل المطورين"),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "features", variant: "developer" },
      { section_type: "integrations" },
      { section_type: "demo" },
    ],
  },

  // ---------------- Additional templates ----------------
  {
    id: "minimal-landing",
    label: "Minimal landing",
    description: "Hero · Features · CTA — clean, distraction-free.",
    emoji: "✨",
    category: "Marketing",
    meta: {
      title: L("A simpler way to ship.", "Une manière plus simple de livrer.", "Einfacher liefern.", "طريقة أبسط للشحن."),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "features", variant: "core4" },
      { section_type: "ctaBanner", variant: "trial" },
    ],
  },
  {
    id: "consulting-firm",
    label: "Consulting firm",
    description: "Hero · Process · Case studies · Contact",
    emoji: "🧭",
    category: "Industry",
    meta: {
      title: L("Strategy that ships.", "Une stratégie qui livre.", "Strategie, die liefert.", "استراتيجية تنجز."),
    },
    sections: [
      { section_type: "hero", variant: "agency" },
      { section_type: "howItWorks", variant: "process" },
      { section_type: "testimonials", variant: "case-study" },
      { section_type: "contact", variant: "sales" },
    ],
  },
  {
    id: "saas-trial",
    label: "Free trial focus",
    description: "Hero · Features · Pricing freemium · CTA trial",
    emoji: "🎁",
    category: "Conversion",
    meta: {
      title: L("Try free. Upgrade when ready.", "Essai gratuit. Passez payant quand vous voulez.", "Kostenlos testen. Upgraden, wenn Sie bereit sind.", "جرّب مجانًا. ارتقِ عند الاستعداد."),
    },
    sections: [
      { section_type: "hero", variant: "bold" },
      { section_type: "features", variant: "core4" },
      { section_type: "pricing", variant: "freemium" },
      { section_type: "ctaBanner", variant: "trial" },
    ],
  },
  {
    id: "video-first",
    label: "Video-first product",
    description: "Hero · Video demo · Features · Testimonials · CTA",
    emoji: "🎬",
    category: "Marketing",
    meta: {
      title: L("Watch it work in 90 seconds.", "Voyez-le en action en 90 secondes.", "Sehen Sie es in 90 Sekunden in Aktion.", "شاهده في 90 ثانية."),
    },
    sections: [
      { section_type: "hero", variant: "bold" },
      { section_type: "demo", variant: "video" },
      { section_type: "features", variant: "core4" },
      { section_type: "testimonials", variant: "social-proof" },
      { section_type: "ctaBanner", variant: "demo" },
    ],
  },
  {
    id: "case-study-page",
    label: "Customer case study",
    description: "Hero · Metrics impact · Quote · CTA",
    emoji: "📊",
    category: "Conversion",
    meta: {
      title: L("How {Customer} doubled output in 60 days.", "Comment {Client} a doublé sa production en 60 jours.", "Wie {Kunde} die Leistung in 60 Tagen verdoppelte.", "كيف ضاعف {العميل} إنتاجه في 60 يومًا."),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "metrics", variant: "impact" },
      { section_type: "testimonials", variant: "case-study" },
      { section_type: "ctaBanner", variant: "demo" },
    ],
  },
  {
    id: "changelog-page",
    label: "Changelog / what's new",
    description: "Hero · Showcase · CTA — perfect for release notes hub.",
    emoji: "📝",
    category: "Utility",
    meta: {
      title: L("What's new", "Nouveautés", "Was ist neu", "ما الجديد"),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "productShowcase", variant: "split" },
      { section_type: "ctaBanner", variant: "newsletter" },
    ],
  },
  {
    id: "open-source",
    label: "Open source project",
    description: "Hero · Features · Integrations · How it works · CTA",
    emoji: "🐙",
    category: "Industry",
    meta: {
      title: L("Free, open, and built in public.", "Gratuit, ouvert et construit en public.", "Kostenlos, offen, öffentlich entwickelt.", "مجاني ومفتوح ومبني علنًا."),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "features", variant: "developer" },
      { section_type: "integrations", variant: "grid" },
      { section_type: "howItWorks", variant: "3-step" },
      { section_type: "ctaBanner", variant: "newsletter" },
    ],
  },
  {
    id: "ecommerce-product",
    label: "E-commerce product",
    description: "Hero · Showcase spotlight · Testimonials · Pricing · CTA",
    emoji: "🛍️",
    category: "Industry",
    meta: {
      title: L("Made to last. Designed to love.", "Fait pour durer. Conçu pour être aimé.", "Gemacht, um zu halten. Gestaltet, um geliebt zu werden.", "صُنع ليدوم. صُمم ليُحب."),
    },
    sections: [
      { section_type: "hero", variant: "bold" },
      { section_type: "productShowcase", variant: "spotlight" },
      { section_type: "testimonials", variant: "social-proof" },
      { section_type: "pricing", variant: "simple" },
      { section_type: "ctaBanner", variant: "trial" },
    ],
  },
  {
    id: "nonprofit",
    label: "Nonprofit / cause",
    description: "Mission hero · Impact metrics · Testimonials · Donate CTA",
    emoji: "❤️",
    category: "Industry",
    meta: {
      title: L("Together, we make it possible.", "Ensemble, nous rendons cela possible.", "Gemeinsam machen wir es möglich.", "معًا، نجعله ممكنًا."),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "metrics", variant: "impact" },
      { section_type: "testimonials", variant: "social-proof" },
      { section_type: "ctaBanner", variant: "contact" },
    ],
  },
  {
    id: "investor-page",
    label: "Investor / pitch",
    description: "Hero · Metrics · Trust bar · Contact",
    emoji: "📈",
    category: "Enterprise",
    meta: {
      title: L("The opportunity ahead.", "L'opportunité à saisir.", "Die Chance vor uns.", "الفرصة المقبلة."),
    },
    sections: [
      { section_type: "hero", variant: "enterprise" },
      { section_type: "metrics", variant: "growth" },
      { section_type: "trustedBy", variant: "press" },
      { section_type: "contact", variant: "sales" },
    ],
  },
  {
    id: "education-course",
    label: "Course / education",
    description: "Hero event · How it works · Testimonials · Pricing",
    emoji: "🎓",
    category: "Industry",
    meta: {
      title: L("Master it in 4 weeks.", "Maîtrisez-le en 4 semaines.", "In 4 Wochen meistern.", "أتقنها في 4 أسابيع."),
    },
    sections: [
      { section_type: "hero", variant: "event" },
      { section_type: "howItWorks", variant: "onboarding" },
      { section_type: "testimonials", variant: "social-proof" },
      { section_type: "pricing", variant: "simple" },
    ],
  },
  {
    id: "api-docs-landing",
    label: "API / docs landing",
    description: "Developer hero · Features · Integrations · Demo interactive",
    emoji: "🔧",
    category: "Industry",
    meta: {
      title: L("APIs developers actually like.", "Des APIs que les développeurs apprécient vraiment.", "APIs, die Entwickler wirklich mögen.", "واجهات برمجية يحبها المطورون فعلًا."),
    },
    sections: [
      { section_type: "hero", variant: "minimal" },
      { section_type: "features", variant: "developer" },
      { section_type: "integrations", variant: "grid" },
      { section_type: "demo", variant: "interactive" },
    ],
  },
];

export const getVariantsFor = (sectionType: string): SectionVariant[] =>
  SECTION_VARIANTS[sectionType] || [];

export const getTemplate = (id: string): PageTemplate | undefined =>
  PAGE_TEMPLATES.find((t) => t.id === id);

export const getTemplateCategories = (): string[] => {
  const cats = new Set<string>();
  for (const t of PAGE_TEMPLATES) if (t.category) cats.add(t.category);
  return Array.from(cats);
};
