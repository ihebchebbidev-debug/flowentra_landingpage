import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const content = {
  en: {
    title: "Privacy Policy",
    subtitle: "Your privacy matters to us. Here is how we handle your data.",
    paragraphs: [
      "At Flowentra, we value your privacy and are committed to protecting your personal data. We collect only the information necessary to provide and improve our services, manage your account, and ensure platform security.",
      "Your data is securely stored and never sold to third parties. We may use trusted service providers to support our operations while maintaining strict confidentiality and security standards.",
      "Flowentra may use cookies and analytics tools to enhance user experience and improve platform performance.",
      "You have the right to access, update, or request deletion of your personal information at any time, in accordance with applicable data protection laws.",
      "By using Flowentra, you agree to this Privacy Policy and the responsible use of your information to deliver our services effectively.",
    ],
    contact: "For any privacy-related questions, contact us at",
    also: "See also:",
    terms: "Terms of Service",
    security: "Security",
  },
  fr: {
    title: "Politique de Confidentialité",
    subtitle: "Votre vie privée compte pour nous. Voici comment nous traitons vos données.",
    paragraphs: [
      "Chez Flowentra, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Nous collectons uniquement les informations nécessaires à la fourniture et à l'amélioration de nos services, à la gestion de votre compte et à la sécurité de la plateforme.",
      "Vos données sont stockées de manière sécurisée et ne sont jamais vendues à des tiers. Nous pouvons faire appel à des prestataires de confiance pour soutenir nos opérations, tout en maintenant des normes strictes de confidentialité et de sécurité.",
      "Flowentra peut utiliser des cookies et des outils d'analyse pour améliorer l'expérience utilisateur et les performances de la plateforme.",
      "Vous avez le droit d'accéder à vos informations personnelles, de les mettre à jour ou d'en demander la suppression à tout moment, conformément aux lois applicables en matière de protection des données.",
      "En utilisant Flowentra, vous acceptez cette Politique de Confidentialité et l'utilisation responsable de vos informations pour fournir efficacement nos services.",
    ],
    contact: "Pour toute question relative à la confidentialité, contactez-nous à",
    also: "Voir aussi :",
    terms: "Conditions d'utilisation",
    security: "Sécurité",
  },
};

const Privacy = () => {
  const { lang } = useLanguage();
  const t = lang === "fr" ? content.fr : content.en;

  return (
    <PageLayout title={t.title} subtitle={t.subtitle}>
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <div className="space-y-6">
            {t.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border space-y-4">
            <p className="text-sm text-muted-foreground">
              {t.contact}{" "}
              <a href="mailto:privacy@flowentra.com" className="text-primary hover:underline">
                privacy@flowentra.com
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              {t.also}{" "}
              <Link to="/terms" className="text-primary hover:underline">{t.terms}</Link>
              {" · "}
              <Link to="/security" className="text-primary hover:underline">{t.security}</Link>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Privacy;
