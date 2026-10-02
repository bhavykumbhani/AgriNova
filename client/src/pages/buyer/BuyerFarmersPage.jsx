import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Search,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { directoryService } from '../../services/directoryService';
import { messageService } from '../../services/messageService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const BuyerFarmersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const data = await directoryService.getFarmers({
        search: search.trim() || undefined,
      });
      setFarmers(data);
    } catch (err) {
      toast.error('Failed to load farmers directory: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFarmers();
  };

  const handleMessageFarmer = async (farmer) => {
    try {
      const conv = await messageService.getOrCreateConversation({
        farmer_profile_id: farmer.id,
      });
      navigate('/buyer/messages', { state: { conversationId: conv.id } });
    } catch (err) {
      toast.error('Could not initiate conversation: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Verified Farmers Directory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Discover certified regional agricultural producers and negotiate harvest contracts directly.
        </p>
      </div>

      <Card padding="p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search farm name or location (e.g. Nashik, Anand, Indore)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <Button type="submit" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
            Search
          </Button>
        </form>
      </Card>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 mt-3">Loading certified producers...</p>
        </div>
      ) : farmers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#112D25] rounded-2xl border border-dashed border-slate-200 dark:border-[#21453A] p-8">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No farmers found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or searching for another agricultural district.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farmers.map((farmer) => (
            <Card key={farmer.id} padding="p-5" className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                      {farmer.profile?.avatar_url ? (
                        <img src={farmer.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (farmer.profile?.first_name?.[0] || 'F').toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {farmer.farm_name || `${farmer.profile?.first_name} Farm`}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {farmer.profile?.first_name} {farmer.profile?.last_name || ''}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#21453A] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{farmer.farm_location || 'Location unlisted'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <span className="text-slate-400 block text-[10px]">Cultivated Area</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {farmer.farm_area || 0} {farmer.farm_area_unit || 'acres'}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <span className="text-slate-400 block text-[10px]">Active Lots</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {farmer.activeListings || 0}
                      </span>
                    </div>
                  </div>

                  {Array.isArray(farmer.primary_crops) && farmer.primary_crops.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-400 block mb-1">Key Harvests:</span>
                      <div className="flex flex-wrap gap-1">
                        {farmer.primary_crops.slice(0, 4).map((c, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#21453A] flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMessageFarmer(farmer)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Message</span>
                </Button>

                <Link to={`/buyer/marketplace?search=${encodeURIComponent(farmer.farm_name || '')}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-xs">
                    View Crops
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
