import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, CheckCircle2, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import heroFarmerImg from '../../assets/hero-farmer.jpg';

export const RegistrationLayout = ({
  children,
  badgeText = 'Farmer Portal',
  title = 'Join AgriNova',
  subtitle = 'Create your account in minutes',
}) => {
  return (
    <div className="min-h-screen bg-agri-bg flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-xl border border-agri-border overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left 40% Visual & Branding Section (Hidden or compact on mobile) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0C1A2E] to-[#087451] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-agri-primary/20 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* AgriNova Brand Logo */}
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="w-11 h-11 rounded-xl bg-agri-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white">
                  Agri<span className="text-emerald-400">Nova</span>
                </span>
                <span className="text-[10px] text-gray-300 font-medium leading-tight">
                  Smart Agriculture Marketplace
                </span>
              </div>
            </Link>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-emerald-300 mb-3 border border-white/10">
              {badgeText}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
              {title}
            </h1>

            <p className="text-sm text-emerald-100/90 leading-relaxed mb-8">
              {subtitle}
            </p>

            {/* Trust Points */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              {[
                { title: 'Direct Connections', desc: 'No middlemen cuts. Transact directly with verified counter-parties.', icon: Users },
                { title: 'Transparent Marketplace', desc: 'Open APMC price benchmarks and clear crop grade specifications.', icon: TrendingUp },
                { title: 'Smarter Agricultural Decisions', desc: 'Hyperlocal satellite weather forecasts and real-time alerts.', icon: ShieldCheck },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComponent className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-gray-300 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
            <span>Enterprise-Grade Security</span>
            <span className="text-emerald-300 font-semibold">Supabase RLS Protected</span>
          </div>
        </div>

        {/* Right 60% Form Content Card */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          {children}
        </div>

      </div>
    </div>
  );
};
