import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Search, 
  Globe, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard,
  Check
} from 'lucide-react';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS } from '../../constants/navigation';

export const Navbar = () => {
  const { t } = useTranslation(['common']);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage, selectedLangObj, supportedLanguages, setLanguage } = useLanguage();
  const { isAuthenticated, role, signOut } = useAuth();

  // Prevent background scrolling when mobile menu or search modal is open
  useEffect(() => {
    if (mobileMenuOpen || searchModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, searchModalOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchModalOpen(false);
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getDashboardPath = () => {
    if (role === 'buyer') return '/buyer/dashboard';
    if (role === 'farmer') return '/farmer/dashboard';
    return '/profile';
  };

  const getDashboardLabel = () => {
    if (role === 'farmer') return t('nav.farmerDashboard', { defaultValue: 'Farmer Dashboard' });
    if (role === 'buyer') return t('nav.buyerDashboard', { defaultValue: 'Buyer Dashboard' });
    return t('nav.dashboard', { defaultValue: 'Dashboard' });
  };

  const navKeyMap = {
    Home: 'nav.home',
    Marketplace: 'nav.marketplace',
    'How It Works': 'nav.howItWorks',
    About: 'nav.about',
    Support: 'nav.support',
    Contact: 'nav.contact',
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-agri-darkCard/95 backdrop-blur-md border-b border-agri-border dark:border-agri-darkBorder shadow-nav transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Brand Mark */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-agri-primary/30 rounded-lg p-1">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-agri-primary to-agri-dark dark:from-agri-darkPrimary dark:to-agri-dark flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                  <Sprout className="w-6 h-6 text-white stroke-[2.2]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold tracking-tight text-agri-textDark dark:text-agri-darkText group-hover:text-agri-primary dark:group-hover:text-agri-darkPrimary transition-colors">
                    Agri<span className="text-agri-primary dark:text-agri-darkPrimary">Nova</span>
                  </span>
                  <span className="text-[11px] font-medium text-agri-textSecondary dark:text-agri-darkTextSecondary leading-tight hidden sm:block">
                    {t('brand.tagline', { defaultValue: 'Smart Agriculture Marketplace & Decision Support System' })}
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {NAV_LINKS.map((link, idx) => {
                const isActive = location.pathname === link.path;
                const translationKey = navKeyMap[link.name] || 'nav.home';

                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 * idx, ease: 'easeOut' }}
                  >
                    <Link
                      to={link.path}
                      aria-current={isActive ? 'page' : undefined}
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                        isActive
                          ? 'text-agri-primary dark:text-agri-darkPrimary bg-agri-softGreen dark:bg-agri-darkBgSecondary font-bold'
                          : 'text-agri-textSecondary dark:text-agri-darkTextSecondary hover:text-agri-textDark dark:hover:text-agri-darkText hover:bg-gray-50 dark:hover:bg-agri-darkBgSecondary/60'
                      }`}
                    >
                      {t(translationKey, { defaultValue: link.name })}
                      {isActive && (
                        <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-agri-primary dark:bg-agri-darkPrimary rounded-full" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Right Actions */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="hidden md:flex items-center space-x-2.5"
            >
              {/* Quick Search Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-agri-textSecondary dark:text-agri-darkTextSecondary hover:text-agri-primary dark:hover:text-agri-darkPrimary hover:bg-agri-softGreen dark:hover:bg-agri-darkBgSecondary rounded-xl transition-colors"
                aria-label="Search crops and mandis"
                title="Search crops and mandis"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Multilingual Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-agri-textSecondary dark:text-agri-darkTextSecondary hover:text-agri-textDark dark:hover:text-agri-darkText rounded-xl hover:bg-gray-50 dark:hover:bg-agri-darkBgSecondary border border-agri-border dark:border-agri-darkBorder transition-colors"
                  aria-expanded={langMenuOpen}
                  aria-label="Select language"
                >
                  <Globe className="w-3.5 h-3.5 text-agri-primary dark:text-agri-darkPrimary" />
                  <span>{selectedLangObj.native}</span>
                </button>

                <AnimatePresence>
                  {langMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 bg-white dark:bg-agri-darkCard rounded-xl shadow-xl border border-agri-border dark:border-agri-darkBorder py-1.5 z-50 overflow-hidden"
                    >
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-agri-textSecondary dark:text-agri-darkTextSecondary border-b border-gray-100 dark:border-agri-darkBorder flex items-center justify-between">
                        <span>Language / ભાષા</span>
                        <span className="text-[9px] text-agri-primary dark:text-agri-darkPrimary font-bold">i18n</span>
                      </div>
                      {supportedLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-agri-softGreen dark:hover:bg-agri-darkBgSecondary transition-colors ${
                            currentLanguage === lang.code
                              ? 'text-agri-primary dark:text-agri-darkPrimary font-bold bg-agri-softGreen/50 dark:bg-agri-darkBgSecondary/80'
                              : 'text-agri-textDark dark:text-agri-darkText'
                          }`}
                        >
                          <span className="font-medium text-xs">{lang.native}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-agri-textSecondary dark:text-agri-darkTextSecondary">{lang.label}</span>
                            {currentLanguage === lang.code && <Check className="w-3.5 h-3.5 text-agri-primary dark:text-agri-darkPrimary" />}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dynamic Auth Section: Before vs After Login */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={LayoutDashboard}
                    onClick={() => navigate(getDashboardPath())}
                    className="font-bold shadow-sm"
                  >
                    {getDashboardLabel()}
                  </Button>

                  <button
                    onClick={() => {
                      signOut();
                      navigate('/');
                    }}
                    className="p-2 text-gray-500 hover:text-agri-danger hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl border border-agri-border dark:border-agri-darkBorder transition-colors"
                    title={t('nav.logout', { defaultValue: 'Logout' })}
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    {t('nav.signIn', { defaultValue: 'Sign In' })}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/register')}
                  >
                    {t('nav.signUp', { defaultValue: 'Sign Up' })}
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Mobile Menu & Theme Toggle Buttons */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-agri-textSecondary dark:text-agri-darkTextSecondary hover:text-agri-primary rounded-lg"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-agri-textDark dark:text-agri-darkText hover:bg-gray-100 dark:hover:bg-agri-darkBgSecondary rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-primary/30"
                aria-label="Toggle mobile navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-agri-primary" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Motion */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 top-20 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              />

              {/* Drawer Content */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="lg:hidden fixed top-20 left-0 right-0 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white dark:bg-agri-darkCard border-b border-agri-border dark:border-agri-darkBorder shadow-2xl z-50 px-4 pt-3 pb-6 space-y-4"
              >
                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  {NAV_LINKS.map((link) => {
                    const isActive = location.pathname === link.path;
                    const translationKey = navKeyMap[link.name] || 'nav.home';

                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? 'text-agri-primary dark:text-agri-darkPrimary bg-agri-softGreen dark:bg-agri-darkBgSecondary font-bold'
                            : 'text-agri-textDark dark:text-agri-darkText hover:bg-gray-50 dark:hover:bg-agri-darkBgSecondary'
                        }`}
                      >
                        {t(translationKey, { defaultValue: link.name })}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Language Selection */}
                <div className="pt-3 border-t border-agri-border dark:border-agri-darkBorder">
                  <div className="text-xs font-bold text-agri-textSecondary dark:text-agri-darkTextSecondary mb-2 uppercase tracking-wider">
                    {t('language.select', { defaultValue: 'Language' })}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {supportedLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setMobileMenuOpen(false);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          currentLanguage === lang.code
                            ? 'bg-agri-primary text-white border-agri-primary shadow-sm'
                            : 'bg-gray-50 dark:bg-agri-darkBgSecondary text-agri-textDark dark:text-agri-darkText border-agri-border dark:border-agri-darkBorder hover:border-agri-primary/40'
                        }`}
                      >
                        {lang.native}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="pt-3 border-t border-agri-border dark:border-agri-darkBorder">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Button
                        variant="primary"
                        fullWidth
                        icon={LayoutDashboard}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate(getDashboardPath());
                        }}
                      >
                        {getDashboardLabel()}
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        icon={LogOut}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          signOut();
                          navigate('/');
                        }}
                      >
                        {t('nav.logout', { defaultValue: 'Logout' })}
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/login');
                        }}
                      >
                        {t('nav.signIn', { defaultValue: 'Sign In' })}
                      </Button>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/register');
                        }}
                      >
                        {t('nav.signUp', { defaultValue: 'Sign Up' })}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Global Quick Search Modal */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white dark:bg-agri-darkCard rounded-3xl p-6 shadow-2xl border border-agri-border dark:border-agri-darkBorder z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-agri-border dark:border-agri-darkBorder mb-4">
                <div className="flex items-center gap-2 text-agri-textDark dark:text-agri-darkText font-bold text-lg">
                  <Search className="w-5 h-5 text-agri-primary dark:text-agri-darkPrimary" />
                  <span>Search AgriNova</span>
                </div>
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-agri-textDark dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit}>
                <div className="relative mb-4">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('nav.searchPlaceholder', { defaultValue: 'Search crops, mandis, or buyer inquiries...' })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-agri-border dark:border-agri-darkBorder bg-agri-bg dark:bg-agri-darkBgSecondary text-agri-textDark dark:text-agri-darkText text-sm focus:outline-none focus:ring-2 focus:ring-agri-primary"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setSearchModalOpen(false)}>
                    {t('actions.cancel', { defaultValue: 'Cancel' })}
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    {t('actions.search', { defaultValue: 'Search' })}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
