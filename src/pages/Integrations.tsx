import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import gmailLogo from "@/assets/integrations/gmail.svg";
import outlookLogo from "@/assets/integrations/outlook.svg";
import telegramLogo from "@/assets/integrations/telegram.svg";
import stripeLogo from "@/assets/integrations/stripe.svg";
import konnektLogo from "@/assets/integrations/konnekt.png";
import openrouterLogo from "@/assets/integrations/openrouter.svg";
import slackLogo from "@/assets/integrations/slack.svg";
import zapierLogo from "@/assets/integrations/zapier.svg";
import googledriveLogo from "@/assets/integrations/googledrive.svg";
import dropboxLogo from "@/assets/integrations/dropbox.svg";
import hubspotLogo from "@/assets/integrations/hubspot.svg";
import salesforceLogo from "@/assets/integrations/salesforce.svg";
import quickbooksLogo from "@/assets/integrations/quickbooks.svg";
import xeroLogo from "@/assets/integrations/xero.svg";
import twilioLogo from "@/assets/integrations/twilio.svg";
import whatsappLogo from "@/assets/integrations/whatsapp.svg";
import microsoftteamsLogo from "@/assets/integrations/microsoftteams.svg";
import jiraLogo from "@/assets/integrations/jira.svg";

const logoMap: Record<string, string> = {
  Gmail: gmailLogo,
  Outlook: outlookLogo,
  Telegram: telegramLogo,
  Stripe: stripeLogo,
  Konnekt: konnektLogo,
  OpenRouter: openrouterLogo,
  Slack: slackLogo,
  Zapier: zapierLogo,
  "Google Drive": googledriveLogo,
  Dropbox: dropboxLogo,
  HubSpot: hubspotLogo,
  Salesforce: salesforceLogo,
  QuickBooks: quickbooksLogo,
  Xero: xeroLogo,
  Twilio: twilioLogo,
  "WhatsApp Business": whatsappLogo,
  "Microsoft Teams": microsoftteamsLogo,
  Jira: jiraLogo,
};

const Integrations = () => {
  const { lang } = useLanguage();
  const fr = lang === "fr";

  const integrations = [
    { name: "Gmail", category: "Email", letters: "GM" },
    { name: "Outlook", category: "Email", letters: "OL" },
    { name: "Telegram", category: fr ? "Messagerie" : "Messaging", letters: "TG" },
    { name: "Stripe", category: fr ? "Paiement" : "Payment", letters: "ST" },
    { name: "Konnekt", category: fr ? "Téléphonie" : "Telephony", letters: "KN" },
    { name: "OpenRouter", category: "AI", letters: "OR" },
    { name: "Slack", category: fr ? "Communication" : "Communication", letters: "SL" },
    { name: "Zapier", category: fr ? "Automatisation" : "Automation", letters: "ZP" },
    { name: "Google Drive", category: fr ? "Stockage" : "Storage", letters: "GD" },
    { name: "Dropbox", category: fr ? "Stockage" : "Storage", letters: "DB" },
    { name: "HubSpot", category: "CRM", letters: "HS" },
    { name: "Salesforce", category: "CRM", letters: "SF" },
    { name: "QuickBooks", category: fr ? "Comptabilité" : "Accounting", letters: "QB" },
    { name: "Xero", category: fr ? "Comptabilité" : "Accounting", letters: "XR" },
    { name: "Twilio", category: "SMS", letters: "TW" },
    { name: "WhatsApp Business", category: fr ? "Messagerie" : "Messaging", letters: "WA" },
    { name: "Microsoft Teams", category: fr ? "Communication" : "Communication", letters: "MT" },
    { name: "Jira", category: fr ? "Gestion de projet" : "Project Mgmt", letters: "JR" },
    { name: "REST API", category: fr ? "Développeur" : "Developer", letters: "AP" },
  ];

  return (
    <PageLayout
      title={fr ? "Intégrations" : "Integrations"}
      subtitle={fr ? "Connectez Flowentra à vos outils préférés pour un workflow unifié." : "Connect Flowentra to your favorite tools for a unified workflow."}
    >
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {integrations.map((int, i) => {
              const logo = logoMap[int.name];
              return (
                <motion.div
                  key={i}
                  className="p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all cursor-pointer group text-center"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    {logo ? (
                      <img
                        src={logo}
                        alt={int.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary group-hover:bg-primary/20 transition-colors">
                        {int.letters}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{int.name}</h3>
                  <p className="text-xs text-muted-foreground">{int.category}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Integrations;
