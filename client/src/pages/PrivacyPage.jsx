import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  MapPin, 
  Database, 
  Lock, 
  Eye, 
  UserCheck, 
  Layers, 
  Cookie, 
  PhoneCall, 
  HelpCircle 
} from "lucide-react";
import { PageHero } from "../components/common/PageHero";
import { AnimatedSection } from "../components/common/AnimatedSection";

export const PrivacyPage = () => {
  const { t } = useTranslation(["legal", "common"]);

  useEffect(() => {
    document.title = `${t("privacy.title", { defaultValue: "Privacy Policy" })} | AgriNova`;
  }, [t]);

  const sections = [
    {
      id: "collection",
      icon: Database,
      title: t("privacy.sections.collection.title", { defaultValue: "1. Information We Collect" }),
      content: t("privacy.sections.collection.content", {
        defaultValue: "We collect information required to provide our marketplace and decision support services. This includes account details (name, email address, phone number, and user role as farmer or buyer), farm profile data (general farm location, approximate acreage, crop types, and production capacity), and commercial interest areas for registered buyers."
      })
    },
    {
      id: "gps",
      icon: MapPin,
      title: t("privacy.sections.gps.title", { defaultValue: "2. GPS Usage & Weather Location Requests" }),
      content: t("privacy.sections.gps.content", {
        defaultValue: "IMPORTANT NOTICE ON LOCATION PRIVACY: When you check localized weather on the homepage or within decision support, your browser's GPS coordinates are used strictly in real-time to query meteorological telemetry. We do NOT permanently store or log your live GPS coordinates unless you explicitly save a verified farm plot location within your authenticated profile. Location data is never sold or used for surveillance."
      }),
      highlight: true
    },
    {
      id: "usage",
      icon: Eye,
      title: t("privacy.sections.usage.title", { defaultValue: "3. How Data Is Used" }),
      content: t("privacy.sections.usage.content", {
        defaultValue: "Your data is used to authenticate accounts, publish verified crop listings on the public marketplace, facilitate direct negotiations between farmers and buyers, deliver localized weather and mandi price telemetry, and improve platform performance. We never sell your personal data to third-party advertisers."
      })
    },
    {
      id: "supabase",
      icon: Layers,
      title: t("privacy.sections.supabase.title", { defaultValue: "4. Cloud Infrastructure & Supabase Services" }),
      content: t("privacy.sections.supabase.content", {
        defaultValue: "AgriNova utilizes enterprise-grade cloud services provided by Supabase for PostgreSQL database management, secure authentication, and cloud storage. Data is transmitted via TLS encryption and protected at rest with granular Row Level Security (RLS) policies."
      })
    },
    {
      id: "cookies",
      icon: Cookie,
      title: t("privacy.sections.cookies.title", { defaultValue: "5. Cookies & Local Storage" }),
      content: t("privacy.sections.cookies.content", {
        defaultValue: "We use browser local storage solely to retain your selected language (English, Hindi, Gujarati), UI theme preferences (Light or Dark mode), and active authentication tokens. We do not use intrusive cross-site tracking cookies."
      })
    },
    {
      id: "security",
      icon: Lock,
      title: t("privacy.sections.security.title", { defaultValue: "6. Data Security & Encryption" }),
      content: t("privacy.sections.security.content", {
        defaultValue: "We implement industry-standard safeguards including cryptographic hashing for passwords, time-limited OTP tokens for email verification, and restricted database role policies to protect user accounts and transactional discussions from unauthorized access."
      })
    },
    {
      id: "retention",
      icon: ShieldCheck,
      title: t("privacy.sections.retention.title", { defaultValue: "7. Data Retention & Deletion" }),
      content: t("privacy.sections.retention.content", {
        defaultValue: "We retain account data for as long as your AgriNova profile remains active. Users may request account deletion or correction of farm details at any time by contacting our support team. Upon verified closure, personal data is permanently scrubbed according to legal retention mandates."
      })
    },
    {
      id: "rights",
      icon: UserCheck,
      title: t("privacy.sections.rights.title", { defaultValue: "8. User Rights & Choices" }),
      content: t("privacy.sections.rights.content", {
        defaultValue: "You have the right to access, rectify, or request removal of your personal and farm data. You may withdraw browser location permissions at any time via your browser settings without losing access to static marketplace viewing."
      })
    },
    {
      id: "contact",
      icon: PhoneCall,
      title: t("privacy.sections.contact.title", { defaultValue: "9. Privacy Contact" }),
      content: t("privacy.sections.contact.content", {
        defaultValue: "For privacy questions, data access requests, or security concerns, contact our designated Data Protection Officer at privacy@agrinova.in or via our Contact page."
      })
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#071A16] text-slate-800 dark:text-[#F3FAF7] transition-colors duration-200">
      <PageHero
        title={t("privacy.title", { defaultValue: "Privacy Policy" })}
        subtitle={t("privacy.subtitle", {
          defaultValue: "How AgriNova collects, uses, and safeguards your personal, farm, and location information with transparency and trust."
        })}
        badge={t("privacy.badge", { defaultValue: "Privacy & Data Protection" })}
        breadcrumbs={[
          { label: t("common.nav.home", { defaultValue: "Home" }), path: "/" },
          { label: t("common.footer.privacy", { defaultValue: "Privacy Policy" }) }
        ]}
      />

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Policy Meta & Disclaimer */}
        <AnimatedSection>
          <div className="bg-white dark:bg-[#112D25] border border-slate-200 dark:border-[#21453A] rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#21453A] pb-6 mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-[#27C58B]">
                  {t("privacy.documentId", { defaultValue: "Official Policy Document" })}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-[#F3FAF7] mt-1">
                  AgriNova Data Protection & Privacy Standard
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-[#0D241E] text-emerald-700 dark:text-[#63DBAE] text-xs font-semibold self-start sm:self-auto">
                <ShieldCheck className="w-4 h-4" />
                {t("privacy.lastUpdated", { defaultValue: "Last Updated: October 2026" })}
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-[#A8C2B8]">
              {t("privacy.intro", {
                defaultValue: "At AgriNova, we are committed to upholding transparency and safeguarding the data rights of the farming and agricultural trading communities. This Privacy Policy outlines our standards concerning data collection, telemetry usage, storage practices, and your privacy choices."
              })}
            </p>
          </div>
        </AnimatedSection>

        {/* Section Cards */}
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <AnimatedSection key={section.id} delay={idx * 0.05}>
                <div
                  id={section.id}
                  className={`bg-white dark:bg-[#112D25] border rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-200 ${
                    section.highlight
                      ? "border-emerald-300 dark:border-[#27C58B] ring-1 ring-emerald-500/20 bg-gradient-to-br from-white to-emerald-50/30 dark:from-[#112D25] dark:to-[#0D241E]"
                      : "border-slate-200 dark:border-[#21453A] hover:border-slate-300 dark:hover:border-[#63DBAE]/40"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        section.highlight
                          ? "bg-emerald-600 text-white dark:bg-[#27C58B] dark:text-[#071A16]"
                          : "bg-emerald-50 text-emerald-600 dark:bg-[#0D241E] dark:text-[#63DBAE]"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3FAF7] mb-3">
                        {section.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-[#A8C2B8]">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Quick Links Footer */}
        <AnimatedSection delay={0.2}>
          <div className="mt-12 p-6 rounded-2xl bg-emerald-50 dark:bg-[#0D241E] border border-emerald-200 dark:border-[#21453A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-emerald-900 dark:text-[#F3FAF7]">
              <HelpCircle className="w-6 h-6 text-emerald-600 dark:text-[#27C58B] shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Have specific questions regarding our terms?</h4>
                <p className="text-xs text-emerald-700 dark:text-[#A8C2B8]">
                  Read our platform usage obligations and transactional terms.
                </p>
              </div>
            </div>
            <Link
              to="/terms"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-emerald-600 dark:bg-[#27C58B] dark:text-[#071A16] rounded-xl hover:bg-emerald-700 dark:hover:bg-[#63DBAE] transition-colors"
            >
              View Terms & Conditions
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default PrivacyPage;
