import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Search,
  Building2,
  MapPin,
  MessageSquare,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import { directoryService } from '../../services/directoryService';
import { messageService } from '../../services/messageService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const FarmerBuyersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [businessType, setBusinessType] = useState('All');

  useEffect(() => {
    fetchBuyers();
  }, [businessType]);

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const data = await directoryService.getBuyers({
        search: search.trim() || undefined,
        businessType: businessType !== 'All' ? businessType : undefined,
      });
      setBuyers(data);
    } catch (err) {
      toast.error('Failed to load buyers directory: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBuyers();
  };

  const handleMessageBuyer = async (buyer) => {
    try {
      const conv = await messageService.getOrCreateConversation({
        buyer_profile_id: buyer.id,
      });
      navigate('/farmer/messages', { state: { conversationId: conv.id } });
    } catch (err) {
      toast.error('Could not open conversation: ' + err.message);
    }
  };

  const businessTypes = ['All', 'Retailer', 'Wholesaler', 'Processor', 'Exporter', 'Institutional', 'Other'];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Buyer Directory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Connect directly with verified corporate, wholesale, and retail commodity buyers across India.
        </p>
      </div>

      {/* Filter and Search */}
      <Card padding="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {businessTypes.map((b) => (
                <option key={b} value={b}>
                  Type: {b}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Card>

      {/* Buyers Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 mt-3">Loading verified buyers...</p>
        </div>
      ) : buyers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#112D25] rounded-2xl border border-dashed border-slate-200 dark:border-[#21453A] p-8">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No buyers found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search query or business category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {buyers.map((buyer) => (
            <Card key={buyer.id} padding="p-5" className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-base">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {buyer.company_name || `${buyer.profile?.first_name || 'Buyer'}`}
                      </h3>
                      <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                        {buyer.business_type || 'Commodity Buyer'}
                      </span>
                    </div>
                  </div>

                  <Badge variant="primary" size="sm">
                    Verified
                  </Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#21453A] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{buyer.city ? `${buyer.city}, ${buyer.state || ''}` : 'Location unlisted'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <span className="text-slate-400 block text-[10px]">Active Orders</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {buyer.activeOrders || 0}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <span className="text-slate-400 block text-[10px]">Completed</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {buyer.completedOrders || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#21453A]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMessageBuyer(buyer)}
                  className="w-full flex items-center justify-center gap-2 text-xs"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Message Buyer</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
