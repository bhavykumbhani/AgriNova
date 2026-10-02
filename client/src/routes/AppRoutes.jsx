import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { HomePage } from '../pages/HomePage';
import { LoadingState } from '../components/common/LoadingState';
import { RegisterRolePage } from '../pages/auth/RegisterRolePage';
import { FarmerRegisterPage } from '../pages/auth/FarmerRegisterPage';
import { BuyerRegisterPage } from '../pages/auth/BuyerRegisterPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { RoleRoute } from '../components/common/RoleRoute';

// Code-split public expansion pages per Part 43
const MarketplacePage = lazy(() => import('../pages/MarketplacePage').then(m => ({ default: m.MarketplacePage })));
const HowItWorksPage = lazy(() => import('../pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const AboutPage = lazy(() => import('../pages/AboutPage').then(m => ({ default: m.AboutPage })));
const SupportPage = lazy(() => import('../pages/SupportPage').then(m => ({ default: m.SupportPage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then(m => ({ default: m.ContactPage })));
const FaqPage = lazy(() => import('../pages/FaqPage').then(m => ({ default: m.FaqPage })));
const FarmingTipsPage = lazy(() => import('../pages/FarmingTipsPage').then(m => ({ default: m.FarmingTipsPage })));
const TermsPage = lazy(() => import('../pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingState className="min-h-[50vh]" />}>
      <Routes>
        <Route element={<PublicLayout />}>
          {/* 1. Production Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/farming-tips" element={<FarmingTipsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* 2. Authentication & Registration Routes */}
          <Route path="/register" element={<RegisterRolePage />} />
          <Route path="/register/farmer" element={<FarmerRegisterPage />} />
          <Route path="/register/buyer" element={<BuyerRegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* 3. Protected Role-Based Dashboards */}
          <Route
            path="/farmer/dashboard"
            element={
              <RoleRoute allowedRoles={['farmer']}>
                <PlaceholderPage
                  title="Farmer Dashboard"
                  description="Welcome to your farmer control center! Manage active crop batches, review incoming buyer offers, track payments, and inspect localized weather alerts."
                  category="Farmer Portal"
                />
              </RoleRoute>
            }
          />
          <Route
            path="/buyer/dashboard"
            element={
              <RoleRoute allowedRoles={['buyer']}>
                <PlaceholderPage
                  title="Buyer Dashboard"
                  description="Welcome to your procurement console! Monitor bulk purchase inquiries, compare APMC price trends, manage saved lots, and negotiate directly with farmers."
                  category="Buyer Portal"
                />
              </RoleRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="User Profile & Preferences"
                  description="Manage your contact details, verification documents, farm or company credentials, and regional language preferences."
                  category="Account Settings"
                />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
