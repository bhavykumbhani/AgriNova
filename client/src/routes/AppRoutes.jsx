import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { FarmerLayout } from '../components/layout/FarmerLayout';
import { BuyerLayout } from '../components/layout/BuyerLayout';
import { HomePage } from '../pages/HomePage';
import { LoadingState } from '../components/common/LoadingState';
import { RegisterRolePage } from '../pages/auth/RegisterRolePage';
import { FarmerRegisterPage } from '../pages/auth/FarmerRegisterPage';
import { BuyerRegisterPage } from '../pages/auth/BuyerRegisterPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { RoleRoute } from '../components/common/RoleRoute';
import { useAuth } from '../context/AuthContext';

// Public Lazy Pages
const MarketplacePage = lazy(() => import('../pages/MarketplacePage').then(m => ({ default: m.MarketplacePage })));
const HowItWorksPage = lazy(() => import('../pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const AboutPage = lazy(() => import('../pages/AboutPage').then(m => ({ default: m.AboutPage })));
const SupportPage = lazy(() => import('../pages/SupportPage').then(m => ({ default: m.SupportPage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then(m => ({ default: m.ContactPage })));
const FaqPage = lazy(() => import('../pages/FaqPage').then(m => ({ default: m.FaqPage })));
const FarmingTipsPage = lazy(() => import('../pages/FarmingTipsPage').then(m => ({ default: m.FarmingTipsPage })));
const TermsPage = lazy(() => import('../pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));

// Farmer Application Pages
const FarmerDashboardPage = lazy(() => import('../pages/farmer/FarmerDashboardPage').then(m => ({ default: m.FarmerDashboardPage })));
const FarmerProductsPage = lazy(() => import('../pages/farmer/FarmerProductsPage').then(m => ({ default: m.FarmerProductsPage })));
const AddProductPage = lazy(() => import('../pages/farmer/AddProductPage').then(m => ({ default: m.AddProductPage })));
const EditProductPage = lazy(() => import('../pages/farmer/EditProductPage').then(m => ({ default: m.EditProductPage })));
const FarmerOrdersPage = lazy(() => import('../pages/farmer/FarmerOrdersPage').then(m => ({ default: m.FarmerOrdersPage })));
const FarmerOrderDetailsPage = lazy(() => import('../pages/farmer/FarmerOrderDetailsPage').then(m => ({ default: m.FarmerOrderDetailsPage })));
const FarmerBuyersPage = lazy(() => import('../pages/farmer/FarmerBuyersPage').then(m => ({ default: m.FarmerBuyersPage })));
const FarmerMessagesPage = lazy(() => import('../pages/farmer/FarmerMessagesPage').then(m => ({ default: m.FarmerMessagesPage })));
const FarmerProfilePage = lazy(() => import('../pages/farmer/FarmerProfilePage').then(m => ({ default: m.FarmerProfilePage })));
const FarmerSettingsPage = lazy(() => import('../pages/farmer/FarmerSettingsPage').then(m => ({ default: m.FarmerSettingsPage })));

// Buyer Application Pages
const BuyerDashboardPage = lazy(() => import('../pages/buyer/BuyerDashboardPage').then(m => ({ default: m.BuyerDashboardPage })));
const BuyerMarketplacePage = lazy(() => import('../pages/buyer/BuyerMarketplacePage').then(m => ({ default: m.BuyerMarketplacePage })));
const BuyerProductDetailsPage = lazy(() => import('../pages/buyer/BuyerProductDetailsPage').then(m => ({ default: m.BuyerProductDetailsPage })));
const BuyerOrdersPage = lazy(() => import('../pages/buyer/BuyerOrdersPage').then(m => ({ default: m.BuyerOrdersPage })));
const BuyerSavedProductsPage = lazy(() => import('../pages/buyer/BuyerSavedProductsPage').then(m => ({ default: m.BuyerSavedProductsPage })));
const BuyerFarmersPage = lazy(() => import('../pages/buyer/BuyerFarmersPage').then(m => ({ default: m.BuyerFarmersPage })));
const BuyerMessagesPage = lazy(() => import('../pages/buyer/BuyerMessagesPage').then(m => ({ default: m.BuyerMessagesPage })));
const BuyerProfilePage = lazy(() => import('../pages/buyer/BuyerProfilePage').then(m => ({ default: m.BuyerProfilePage })));
const BuyerSettingsPage = lazy(() => import('../pages/buyer/BuyerSettingsPage').then(m => ({ default: m.BuyerSettingsPage })));

// Helper component for /profile redirect
const ProfileRedirect = () => {
  const { role } = useAuth();
  if (role === 'buyer') return <Navigate to="/buyer/profile" replace />;
  return <Navigate to="/farmer/profile" replace />;
};

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingState className="min-h-[50vh]" />}>
      <Routes>
        {/* 1. Public Pages Layout */}
        <Route element={<PublicLayout />}>
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

          {/* Authentication Routes */}
          <Route path="/register" element={<RegisterRolePage />} />
          <Route path="/register/farmer" element={<FarmerRegisterPage />} />
          <Route path="/register/buyer" element={<BuyerRegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Generic Profile Redirect */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileRedirect />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 2. Farmer Application Portal (Role: farmer) */}
        <Route
          path="/farmer"
          element={
            <RoleRoute allowedRoles={['farmer']}>
              <FarmerLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/farmer/dashboard" replace />} />
          <Route path="dashboard" element={<FarmerDashboardPage />} />
          <Route path="products" element={<FarmerProductsPage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="orders" element={<FarmerOrdersPage />} />
          <Route path="orders/:id" element={<FarmerOrderDetailsPage />} />
          <Route path="buyers" element={<FarmerBuyersPage />} />
          <Route path="messages" element={<FarmerMessagesPage />} />
          <Route path="profile" element={<FarmerProfilePage />} />
          <Route path="settings" element={<FarmerSettingsPage />} />
        </Route>

        {/* 3. Buyer Application Portal (Role: buyer) */}
        <Route
          path="/buyer"
          element={
            <RoleRoute allowedRoles={['buyer']}>
              <BuyerLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/buyer/dashboard" replace />} />
          <Route path="dashboard" element={<BuyerDashboardPage />} />
          <Route path="marketplace" element={<BuyerMarketplacePage />} />
          <Route path="marketplace/:id" element={<BuyerProductDetailsPage />} />
          <Route path="orders" element={<BuyerOrdersPage />} />
          <Route path="orders/:id" element={<FarmerOrderDetailsPage />} />
          <Route path="saved" element={<BuyerSavedProductsPage />} />
          <Route path="farmers" element={<BuyerFarmersPage />} />
          <Route path="messages" element={<BuyerMessagesPage />} />
          <Route path="profile" element={<BuyerProfilePage />} />
          <Route path="settings" element={<BuyerSettingsPage />} />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
