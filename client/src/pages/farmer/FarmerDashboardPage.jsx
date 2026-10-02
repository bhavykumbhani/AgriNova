import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IndianRupee,
  Package,
  CheckCircle,
  Users,
  TrendingUp,
  ArrowRight,
  CloudSun,
  Calendar,
  MessageSquare,
  AlertCircle,
  PlusCircle,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { weatherService } from '../../services/weatherService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const FarmerDashboardPage = () => {
  const { profile, farmerProfile } = useAuth();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    productsListed: 0,
    completedOrders: 0,
    activeBuyers: 0,
    revenueSeries: [],
    recentOrders: [],
    topSellingCrops: [],
  });

  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning', { defaultValue: 'Good Morning' });
    if (hour < 17) return t('dashboard.goodAfternoon', { defaultValue: 'Good Afternoon' });
    return t('dashboard.goodEvening', { defaultValue: 'Good Evening' });
  };

  useEffect(() => {
    fetchDashboardAnalytics();
  }, [period]);

  useEffect(() => {
    fetchFarmWeather();
  }, [farmerProfile]);

  const fetchDashboardAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getFarmerAnalytics(period);
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load farmer analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmWeather = async () => {
    try {
      setWeatherLoading(true);
      let location = farmerProfile?.farm_location || 'Ahmedabad, Gujarat';
      const weather = await weatherService.getWeather(location);
      setWeatherData(weather);
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      case 'Shipped':
        return <Badge variant="info">Shipped</Badge>;
      case 'Processing':
      case 'Confirmed':
      case 'Accepted':
        return <Badge variant="primary">{status}</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Cancelled':
      case 'Rejected':
        return <Badge variant="danger">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#112D25] p-6 rounded-2xl border border-slate-200 dark:border-[#21453A] shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {profile?.first_name || 'Farmer'}!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('dashboard.subtitle', { defaultValue: "Here's what's happening with your farm and marketplace activity." })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/farmer/products/new">
            <Button variant="primary" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>List New Crop</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Real KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card padding="p-5" className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{Number(analytics.totalRevenue || 0).toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              From completed orders
            </p>
          </div>
        </Card>

        {/* Products Listed */}
        <Card padding="p-5" className="border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Products Listed
            </span>
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {analytics.productsListed || 0}
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Active crop lots
            </p>
          </div>
        </Card>

        {/* Completed Orders */}
        <Card padding="p-5" className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completed Orders
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {analytics.completedOrders || 0}
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Fulfilled transactions
            </p>
          </div>
        </Card>

        {/* Active Buyers */}
        <Card padding="p-5" className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Buyers
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {analytics.activeBuyers || 0}
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Connected procurement partners
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Main Chart & Weather Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics (Recharts) */}
        <Card className="lg:col-span-2 flex flex-col justify-between" padding="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Revenue Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Performance tracking over selected timeframe
              </p>
            </div>

            {/* Time Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl text-xs font-semibold">
              {[
                { key: '7d', label: '7D' },
                { key: '30d', label: '30D' },
                { key: '3m', label: '3M' },
                { key: '6m', label: '6M' },
                { key: '1y', label: '1Y' },
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setPeriod(btn.key)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    period === btn.key
                      ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Display */}
          <div className="h-64 sm:h-72 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : analytics.revenueSeries.length === 0 || analytics.totalRevenue === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <TrendingUp className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  No completed sales in this period
                </p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Once you accept and fulfill buyer orders, your verified revenue and growth metrics will be plotted here.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.revenueSeries}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    stroke="#94A3B8"
                    fontSize={11}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    stroke="#94A3B8"
                    fontSize={11}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#112D25',
                      borderColor: '#21453A',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Real Farm Weather Widget */}
        <Card className="flex flex-col justify-between" padding="p-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Farm Weather</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Live GPS
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
              <span>📍</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {farmerProfile?.farm_location || 'Farm Location (Ahmedabad, Gujarat)'}
              </span>
            </div>

            {weatherLoading ? (
              <div className="py-12 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : weatherData ? (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
                  <div>
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {Math.round(weatherData.current?.temp || 28)}°C
                    </span>
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-400 capitalize mt-0.5">
                      {weatherData.current?.condition || 'Clear Sky'}
                    </p>
                  </div>
                  <span className="text-3xl">⛅</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block">Humidity</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {weatherData.current?.humidity || 62}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block">Rain Probability</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {weatherData.current?.rainProb || 12}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block">Wind Speed</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {weatherData.current?.windSpeed || 14} km/h
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block">Farming Advice</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Ideal for Harvest
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                Weather telemetry offline.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#21453A] flex justify-between items-center text-xs">
            <span className="text-slate-400">Telemetry updated hourly</span>
            <Link to="/farmer/profile" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Update Farm Coordinates
            </Link>
          </div>
        </Card>
      </div>

      {/* 4. Recent Orders Table */}
      <Card padding="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest incoming purchase requests from verified buyers
            </p>
          </div>
          <Link to="/farmer/orders">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {analytics.recentOrders.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No orders received yet
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Your listings are active in the marketplace. When buyers place orders, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#21453A] text-slate-400 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {analytics.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {order.order_number || order.id.substring(0, 8)}
                    </td>
                    <td className="py-3 px-4">
                      {order.buyer?.company_name || `${order.buyer?.profile?.first_name || 'Buyer'} ${order.buyer?.profile?.last_name || ''}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {order.product?.primary_image_url && (
                          <img
                            src={order.product.primary_image_url}
                            alt=""
                            className="w-7 h-7 rounded object-cover"
                          />
                        )}
                        <span>{order.product?.crop_name || 'Crop'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {order.quantity} {order.quantity_unit}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/farmer/orders/${order.id}`}
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
