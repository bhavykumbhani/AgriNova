import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck, Sprout, Store, HelpCircle, FileText } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const PlaceholderPage = ({ title, description, category = 'Module' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCategoryIcon = () => {
    if (location.pathname.includes('farmer')) return <Sprout className="w-8 h-8 text-agri-primary" />;
    if (location.pathname.includes('buyer') || location.pathname.includes('marketplace')) return <Store className="w-8 h-8 text-blue-600" />;
    if (location.pathname.includes('terms') || location.pathname.includes('privacy')) return <FileText className="w-8 h-8 text-agri-dark" />;
    return <Clock className="w-8 h-8 text-agri-teal" />;
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-agri-bg">
      <Card className="max-w-xl w-full text-center p-8 sm:p-10 border border-agri-border shadow-card-subtle bg-white">
        {/* Top Icon */}
        <div className="w-16 h-16 rounded-2xl bg-agri-softGreen mx-auto flex items-center justify-center mb-6">
          {getCategoryIcon()}
        </div>

        {/* Breadcrumb / Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-agri-softGreen text-agri-dark mb-4 border border-agri-primary/20">
          <span>{category}</span>
          <span>•</span>
          <span className="text-gray-500">{location.pathname}</span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-textDark mb-3">
          {title || 'Upcoming AgriNova Module'}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-agri-textSecondary leading-relaxed mb-8 max-w-md mx-auto">
          {description ||
            'This page is part of the upcoming full release of AgriNova. The architecture and routes are staged and ready for implementation in the next phase.'}
        </p>

        {/* Information box */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-agri-textSecondary text-left mb-8 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-agri-primary shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-agri-textDark mb-0.5">Production Architecture Staged</div>
            <div>
              Supabase schemas, authentication hooks, and REST API routes have been structured for this module.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={ArrowLeft}
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Back to Homepage
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Previous Screen
          </Button>
        </div>
      </Card>
    </main>
  );
};
