import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Snowflake, Droplets, Zap, UtensilsCrossed, Building2, TreePine,
  Frame, Shield, SprayCan, Flower2, Recycle, Sun, Waves, Wifi,
  Factory, ShoppingCart,
} from "lucide-react";
import batimentSvg from "@/assets/industries/autour_batiment_service.svg";
import environnementSvg from "@/assets/industries/l_environnement.svg";
import energieSvg from "@/assets/industries/energie_et_technologie.svg";

interface Industry {
  label: string;
  labelFr: string;
  desc: string;
  descFr: string;
  icon: React.ElementType;
}

interface Category {
  id: string;
  title: string;
  titleFr: string;
  intro: string;
  introFr: string;
  illustration: string;
  industries: Industry[];
}

const categories: Category[] = [
  {
    id: "building",
    title: "Around the Building",
    titleFr: "Autour du bâtiment et Service",
    intro:
      "Our software offers everything you need to optimise your business. With our user-friendly platform, you maintain an overview of resources and orders, plan more efficiently, and digitise your entire company.",
    introFr:
      "Notre logiciel vous offre tout ce dont vous avez besoin pour optimiser votre activité. Gardez la maîtrise de vos ressources et commandes, planifiez plus efficacement et digitalisez toute votre entreprise.",
    illustration: batimentSvg,
    industries: [
      {
        label: "Refrigeration and air conditioning technology",
        labelFr: "Technologie de la Réfrigération et climatisation",
        desc: "Flowentra offers you efficient project management and real-time monitoring so that you retain full control over your orders and technician schedules.",
        descFr: "Flowentra vous offre une gestion de projet efficace et un suivi en temps réel pour garder le contrôle total sur vos commandes et les plannings de vos techniciens.",
        icon: Snowflake,
      },
      {
        label: "Sanitary, heating and air conditioning technology",
        labelFr: "Technologie sanitaire, de chauffage et de climatisation",
        desc: "With Flowentra for plumbing, heating and air conditioning, you can effortlessly plan and manage complex installations to offer your customers the best service.",
        descFr: "Avec Flowentra pour la plomberie, le chauffage et la climatisation, planifiez et gérez facilement des installations complexes pour offrir le meilleur service à vos clients.",
        icon: Droplets,
      },
      {
        label: "Electric",
        labelFr: "Electrique",
        desc: "Optimise your electrical contracting business with our trade software that helps you coordinate projects, track materials, and simplify work processes.",
        descFr: "Optimisez votre activité d'électricien avec notre logiciel de gestion qui vous aide à coordonner les projets, suivre les matériaux et simplifier les processus de travail.",
        icon: Zap,
      },
      {
        label: "Commercial kitchen equipment",
        labelFr: "Equipement de cuisine",
        desc: "Our software for commercial kitchen equipment companies enables you to plan and maintain precisely, ensuring that your customers are satisfied with your service.",
        descFr: "Notre logiciel pour les équipements de cuisine professionnels vous permet de planifier et maintenir avec précision, assurant la satisfaction de vos clients.",
        icon: UtensilsCrossed,
      },
      {
        label: "Facility Management",
        labelFr: "Gestion des installations",
        desc: "Keep track of all maintenance and administrative tasks to optimally manage your properties and facilities across multiple sites from one platform.",
        descFr: "Gardez une vue d'ensemble sur toutes les tâches de maintenance et administratives pour gérer optimalement vos bâtiments et installations sur plusieurs sites.",
        icon: Building2,
      },
      {
        label: "Carpentry and timber construction",
        labelFr: "Construction en bois",
        desc: "Save yourself and your employees stress and administrative effort: use Flowentra and achieve more in less time with accurate project and material tracking.",
        descFr: "Réduisez le stress et la charge administrative pour vous et vos équipes : utilisez Flowentra pour accomplir plus en moins de temps grâce au suivi précis des projets et matériaux.",
        icon: TreePine,
      },
      {
        label: "Window construction",
        labelFr: "Construction des fenêtres et aluminium",
        desc: "With Flowentra for window construction, you receive a complete package for comprehensive optimisation of your work processes and client communication.",
        descFr: "Avec Flowentra pour la menuiserie et l'aluminium, bénéficiez d'un package complet pour optimiser l'ensemble de vos processus de travail et la communication client.",
        icon: Frame,
      },
    ],
  },
  {
    id: "environment",
    title: "The Environment",
    titleFr: "L'environnement",
    intro:
      "Environmental and maintenance service companies rely on Flowentra to coordinate recurring contracts, track field teams in real time, and guarantee consistent quality standards across every visit.",
    introFr:
      "Les entreprises de services environnementaux et d'entretien s'appuient sur Flowentra pour coordonner leurs contrats récurrents, suivre leurs équipes terrain en temps réel et garantir des standards de qualité constants.",
    illustration: environnementSvg,
    industries: [
      {
        label: "Security",
        labelFr: "Sécurité",
        desc: "Manage surveillance, access control, and alarm installation projects with full audit trails, SLA tracking, and digital client sign-off.",
        descFr: "Gérez vos projets de surveillance, contrôle d'accès et installation d'alarmes avec des pistes d'audit complètes, le suivi des SLA et la validation digitale des clients.",
        icon: Shield,
      },
      {
        label: "Cleaning",
        labelFr: "Nettoyage",
        desc: "Schedule recurring cleaning contracts, track staff attendance with GPS check-in, and share digital intervention reports with clients in real time.",
        descFr: "Planifiez vos contrats de nettoyage récurrents, suivez la présence du personnel par pointage GPS et partagez des rapports d'intervention digitaux avec vos clients en temps réel.",
        icon: SprayCan,
      },
      {
        label: "Gardening & Landscaping",
        labelFr: "Jardinage & Paysagisme",
        desc: "Plan landscaping visits and seasonal contracts, document completed work with photos, and collect client approvals directly in the field.",
        descFr: "Planifiez vos visites de jardinage et contrats saisonniers, documentez les travaux réalisés avec photos et recueillez les validations clients directement sur le terrain.",
        icon: Flower2,
      },
      {
        label: "Environmental Services",
        labelFr: "Service environnemental",
        desc: "Streamline waste collection routes, recycling operations, and environmental compliance reporting with automated scheduling and full traceability.",
        descFr: "Optimisez vos tournées de collecte des déchets, opérations de recyclage et rapports de conformité environnementale grâce à une planification automatisée et une traçabilité complète.",
        icon: Recycle,
      },
    ],
  },
  {
    id: "energy-tech",
    title: "Energy, Technology & Commerce",
    titleFr: "Energie, Technologie & Commerce",
    intro:
      "Whether you are deploying solar panels, managing IT networks, running a production line, or operating a retail business — Flowentra adapts to the unique workflows of every modern industry.",
    introFr:
      "Que vous déployiez des panneaux solaires, gériez des réseaux informatiques, pilotiez une ligne de production ou exploitiez un commerce, Flowentra s'adapte aux workflows spécifiques de chaque secteur moderne.",
    illustration: energieSvg,
    industries: [
      {
        label: "Solar energy",
        labelFr: "Energie solaire",
        desc: "Design, install, and maintain photovoltaic and solar thermal systems with integrated permit tracking, equipment registers, and client dashboards.",
        descFr: "Concevez, installez et entretenez des systèmes photovoltaïques et solaires thermiques avec suivi intégré des permis, registres des équipements et tableaux de bord clients.",
        icon: Sun,
      },
      {
        label: "Water & Energy Supply",
        labelFr: "Approvisionnement en eau et en Energie",
        desc: "Manage infrastructure maintenance, network inspections, and incident response workflows for water and energy distribution networks.",
        descFr: "Gérez la maintenance des infrastructures, les inspections de réseaux et les workflows d'intervention sur incident pour les réseaux de distribution d'eau et d'énergie.",
        icon: Waves,
      },
      {
        label: "Information & Communication Technology",
        labelFr: "Technologie de l'information et la communication",
        desc: "Deploy IT projects, manage SLA contracts, and coordinate technicians for network infrastructure, hardware, and software service assignments.",
        descFr: "Déployez vos projets IT, gérez les contrats SLA et coordonnez les techniciens pour les interventions réseau, matériel et logiciel.",
        icon: Wifi,
      },
      {
        label: "Manufacturer",
        labelFr: "Fabricant",
        desc: "Coordinate production workflows, equipment maintenance plans, and supplier relationships from a single centralised operations platform.",
        descFr: "Coordonnez vos workflows de production, vos plans de maintenance équipements et vos relations fournisseurs depuis une plateforme opérationnelle centralisée.",
        icon: Factory,
      },
      {
        label: "Retailer",
        labelFr: "Commerçant",
        desc: "Manage stock replenishment, store maintenance requests, and after-sales service with seamless ERP and POS system integrations.",
        descFr: "Gérez le réapprovisionnement des stocks, les demandes de maintenance en magasin et le SAV avec des intégrations ERP et caisse enregistreuse transparentes.",
        icon: ShoppingCart,
      },
    ],
  },
];


const Industries = () => {
  const { lang } = useLanguage();
  const fr = lang === "fr";

  return (
    <PageLayout
      title={fr ? "Secteurs d'activités" : "Industries"}
      subtitle={
        fr
          ? "Flowentra s'adapte à votre secteur. Découvrez comment nous accompagnons chaque métier."
          : "Flowentra adapts to your industry. Discover how we support every trade."
      }
    >
      <div className="py-12 lg:py-20 space-y-6 lg:space-y-8">
        {categories.map((cat, ci) => (
            <motion.section
              key={cat.id}
              className="container mx-auto px-4 lg:px-8 max-w-6xl rounded-2xl border border-border bg-muted/40 p-6 lg:p-8 shadow-sm"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: ci * 0.05 }}
            >
              <div className="grid lg:grid-cols-[2fr_3fr] gap-6 lg:gap-10 items-start">

                {/* LEFT — illustration + title + intro */}
                <div className="flex flex-col gap-5">
                  {/* Illustration */}
                  <div className="rounded-2xl overflow-hidden border border-border shadow-md">
                    <img
                      src={cat.illustration}
                      alt={cat.title}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>

                  {/* Category title & intro */}
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      {fr ? cat.titleFr : cat.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {fr ? cat.introFr : cat.intro}
                    </p>
                  </div>
                </div>

                {/* RIGHT — industry cards list */}
                <div className="flex flex-col gap-3">
                  {cat.industries.map((ind, ii) => (
                    <motion.div
                      key={ii}
                      className="group p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md hover:bg-primary/[0.02] transition-all cursor-pointer"
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: ii * 0.05 }}
                    >
                      <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {fr ? ind.labelFr : ind.label}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {fr ? ind.descFr : ind.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}


        {/* CTA */}
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div
            className="text-center px-6 py-6 rounded-xl border border-primary/20 bg-primary/5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-base font-bold mb-1">
              {fr ? "Votre secteur n'est pas listé ?" : "Your industry isn't listed?"}
            </h3>
            <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
              {fr
                ? "Flowentra est hautement configurable. Contactez-nous pour discuter de votre cas d'usage."
                : "Flowentra is highly configurable. Contact us to discuss your use case."}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow shadow-primary/20"
            >
              {fr ? "Nous contacter" : "Contact us"}
            </a>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Industries;
