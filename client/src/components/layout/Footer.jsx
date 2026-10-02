import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FOOTER_LINKS } from '../../constants/navigation';
import { SOCIAL_LINKS } from '../../constants/socialLinks';
import { SocialLink } from '../common/SocialLink';
import { Button } from '../common/Button';

export const Footer = () => {
  const { t } = useTranslation(['common']);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#0C1A2E] text-white pt-16 pb-12 border-t border-gray-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Banner */}
        <div className="bg-gradient-to-r from-agri-dark to-agri-teal rounded-2xl p-8 sm:p-10 mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/15 text-white mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-agri-orange" />
                AgriNova Intelligence Bulletins
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {t('footer.stayUpdated', { defaultValue: 'Stay Updated with Live Mandi Insights' })}
              </h3>
              <p className="mt-2 text-emerald-100 text-sm sm:text-base">
                {t('footer.newsletterSubtitle', { defaultValue: 'Receive weekly market price movements, weather alerts, and direct buyer requirements right to your inbox.' })}
              </p>
            </div>

            <div className="w-full lg:w-auto">
              {subscribed ? (
                <div className="flex items-center gap-2 bg-white/20 text-white px-5 py-3 rounded-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span className="text-sm font-semibold">{t('footer.subscribedSuccess', { defaultValue: 'Thank you for subscribing to AgriNova updates!' })}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder={t('footer.emailPlaceholder', { defaultValue: 'Enter your email address' })}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full sm:w-80 pl-11 pr-4 py-3 rounded-xl bg-white text-agri-textDark text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="accent"
                    size="md"
                    className="whitespace-nowrap font-semibold shadow-md"
                  >
                    {t('footer.subscribe', { defaultValue: 'Subscribe' })}
                  </Button>
                </form>
              )}
              {errorMsg && <p className="text-red-200 text-xs mt-1.5">{errorMsg}</p>}
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-agri-primary flex items-center justify-center text-white shadow-sm">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Agri<span className="text-agri-teal">Nova</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm font-medium text-emerald-400 mb-3">
              {t('footer.tagline', { defaultValue: 'Smart Agriculture Marketplace and Decision Support System' })}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
              {t('footer.description', { defaultValue: 'Connecting Indian farmers directly with verified buyers while providing real-time agro-meteorological satellite telemetry and transparent mandi market intelligence.' })}
            </p>

            {/* Social Links with component-based icons */}
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map((social) => (
                <SocialLink
                  key={social.id}
                  name={social.name}
                  url={social.url}
                  iconType={social.iconType}
                  isPlaceholder={social.isPlaceholder}
                />
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('footer.marketplace', { defaultValue: 'Marketplace' })}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {FOOTER_LINKS.marketplace.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-emerald-400 transition-colors">
                    {t(link.key, { defaultValue: link.name })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('footer.resources', { defaultValue: 'Resources' })}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-emerald-400 transition-colors">
                    {t(link.key, { defaultValue: link.name })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('footer.company', { defaultValue: 'Company' })}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-emerald-400 transition-colors">
                    {t(link.key, { defaultValue: link.name })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('footer.legal', { defaultValue: 'Legal' })}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-emerald-400 transition-colors">
                    {t(link.key, { defaultValue: link.name })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>{t('footer.copyright', { defaultValue: '© 2026 AgriNova. All rights reserved.' })}</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-emerald-400 transition-colors">{t('footer.terms', { defaultValue: 'Terms & Conditions' })}</Link>
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors">{t('footer.privacy', { defaultValue: 'Privacy Policy' })}</Link>
            <Link to="/support" className="hover:text-emerald-400 transition-colors">{t('footer.support', { defaultValue: 'Support' })}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
