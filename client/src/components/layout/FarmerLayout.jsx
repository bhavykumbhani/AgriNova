import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown,
  CloudSun,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { connectSocket, disconnectSocket, getSocket } from '../../services/socket';
import { notificationService } from '../../services/notificationService';
import { useToast } from '../../context/ToastContext';

export const FarmerLayout = () => {
  const { user, profile, farmerProfile, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  // Initialize Socket.IO connection and listen for notifications
  useEffect(() => {
    let active = true;

    const setupSocket = async () => {
      const socket = await connectSocket();
      if (!socket || !active) return;

      socket.on('new_notification', (data) => {
        toast.info(data.title || 'New notification received');
        fetchNotifications();
      });

      socket.on('unread_message_notification', (data) => {
        toast.info(`New message from ${data.message?.sender?.first_name || 'Buyer'}`);
        fetchNotifications();
      });

      socket.on('order_status_updated', (data) => {
        toast.info(`Order updated: ${data.status}`);
        fetchNotifications();
      });
    };

    setupSocket();
    fetchNotifications();

    return () => {
      active = false;
      const socket = getSocket();
      if (socket) {
        socket.off('new_notification');
        socket.off('unread_message_notification');
        socket.off('order_status_updated');
      }
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadNotifsCount(data.unreadCount || 0);
    } catch (err) {
      // Non-blocking
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadNotifsCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (e) {}
  };

  const handleSignOut = async () => {
    try {
      disconnectSocket();
      await signOut();
      toast.info(t('auth.signedOut', { defaultValue: 'You have been signed out.' }));
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Error signing out');
    }
  };

  const navLinks = [
    { to: '/farmer/dashboard', label: t('nav.dashboard', { defaultValue: 'Dashboard' }), icon: LayoutDashboard },
    { to: '/farmer/products', label: t('nav.products', { defaultValue: 'My Products' }), icon: Package },
    { to: '/farmer/orders', label: t('nav.orders', { defaultValue: 'Orders' }), icon: ShoppingCart },
    { to: '/farmer/buyers', label: t('nav.buyers', { defaultValue: 'Buyers' }), icon: Users },
    { to: '/farmer/messages', label: t('nav.messages', { defaultValue: 'Messages' }), icon: MessageSquare },
    { to: '/farmer/profile', label: t('nav.profile', { defaultValue: 'Profile' }), icon: User },
    { to: '/farmer/settings', label: t('nav.settings', { defaultValue: 'Settings' }), icon: Settings },
  ];

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1A15] text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#112D25] border-r border-slate-200 dark:border-[#21453A] shrink-0 sticky top-0 h-screen select-none z-30">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-[#21453A]">
          <NavLink to="/farmer/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-black text-xl">
              🌾
            </div>
            <div>
              <span className="font-extrabold text-lg text-emerald-800 dark:text-emerald-300 tracking-tight">Agri</span>
              <span className="font-extrabold text-lg text-teal-600 dark:text-teal-400 tracking-tight">Nova</span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 -mt-1">
                Farmer Hub
              </span>
            </div>
          </NavLink>
        </div>

        {/* Profile Summary Card */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 shadow-sm">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                (profile?.first_name?.[0] || 'F').toUpperCase()
              )}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Farmer'}
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 truncate">
                {farmerProfile?.farm_name || 'AgriNova Farmer'}
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Verified Farmer
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200">
              Pro
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 dark:bg-emerald-500'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-[#21453A]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('auth.signOut', { defaultValue: 'Sign Out' })}</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-[#112D25] border-b border-slate-200 dark:border-[#21453A] sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          {/* Left: Mobile hamburger & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Farmer Workspace
              </span>
            </div>
          </div>

          {/* Right Controls: Language, Theme, Notifications, Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#21453A] bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{currentLang.native}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#112D25] rounded-xl shadow-xl border border-slate-200 dark:border-[#21453A] py-1.5 z-50 animate-fadeIn"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        i18n.changeLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    >
                      <span>{l.native}</span>
                      {i18n.language === l.code && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifsCount > 9 ? '9+' : unreadNotifsCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#112D25] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#21453A] overflow-hidden z-50 animate-fadeIn"
                  onMouseLeave={() => setNotifDropdownOpen(false)}
                >
                  <div className="p-4 border-b border-slate-100 dark:border-[#21453A] flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h4>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 text-xs transition-colors ${
                            n.read_at ? 'bg-transparent text-slate-500' : 'bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200 font-medium'
                          }`}
                        >
                          <div className="font-bold text-slate-900 dark:text-white">{n.title}</div>
                          <div className="mt-1 text-slate-600 dark:text-slate-300">{n.message}</div>
                          <div className="mt-1 text-[10px] text-slate-400">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden shadow-xs">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    (profile?.first_name?.[0] || 'F').toUpperCase()
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#112D25] rounded-xl shadow-xl border border-slate-200 dark:border-[#21453A] py-1.5 z-50 animate-fadeIn"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-[#21453A]">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{profile?.email}</p>
                  </div>
                  <NavLink
                    to="/farmer/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{t('nav.profile', { defaultValue: 'Farmer Profile' })}</span>
                  </NavLink>
                  <NavLink
                    to="/farmer/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>{t('nav.settings', { defaultValue: 'Settings' })}</span>
                  </NavLink>
                  <div className="border-t border-slate-100 dark:border-[#21453A] mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('auth.signOut', { defaultValue: 'Sign Out' })}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-[#112D25] h-full shadow-2xl flex flex-col z-10 animate-slideRight">
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-[#21453A]">
              <span className="font-extrabold text-lg text-emerald-700 dark:text-emerald-300">
                AgriNova
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-[#21453A]">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('auth.signOut', { defaultValue: 'Sign Out' })}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
