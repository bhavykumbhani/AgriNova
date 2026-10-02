import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building,
  Edit2,
  Check,
  ShieldCheck,
  Sprout,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const FarmerProfilePage = () => {
  const { profile, farmerProfile, refreshProfile } = useAuth();
  const { t } = useTranslation();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [farmName, setFarmName] = useState(farmerProfile?.farm_name || '');
  const [farmLocation, setFarmLocation] = useState(farmerProfile?.farm_location || '');
  const [farmArea, setFarmArea] = useState(farmerProfile?.farm_area || '');
  const [farmAreaUnit, setFarmAreaUnit] = useState(farmerProfile?.farm_area_unit || 'acres');
  const [primaryCrops, setPrimaryCrops] = useState(
    Array.isArray(farmerProfile?.primary_crops)
      ? farmerProfile.primary_crops.join(', ')
      : farmerProfile?.primary_crops || ''
  );

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const cropsArray = primaryCrops
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      await profileService.updateFarmerProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        farm_name: farmName.trim(),
        farm_location: farmLocation.trim(),
        farm_area: Number(farmArea),
        farm_area_unit: farmAreaUnit,
        primary_crops: cropsArray,
      });

      await refreshProfile();
      toast.success('Farmer profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update profile: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Farmer Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal farm identity, location, and crop capabilities displayed to buyers.
          </p>
        </div>

        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4 text-emerald-600" />
            <span>Edit Profile</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          <Card padding="p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Verified Email (Immutable)
                </label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </Card>

          <Card padding="p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Farm Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Farm Name
                </label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Farm Location (City, State)
                </label>
                <input
                  type="text"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Farm Area
                </label>
                <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={farmArea}
                    onChange={(e) => setFarmArea(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <select
                    value={farmAreaUnit}
                    onChange={(e) => setFarmAreaUnit(e.target.value)}
                    className="px-3 bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border-l border-slate-200 dark:border-slate-800 focus:outline-none"
                  >
                    <option value="acres">acres</option>
                    <option value="hectares">hectares</option>
                    <option value="bigha">bigha</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Primary Crops (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Wheat, Rice, Cotton"
                  value={primaryCrops}
                  onChange={(e) => setPrimaryCrops(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
            >
              Save Profile
            </Button>
          </div>
        </form>
      ) : (
        /* Read Only Mode */
        <div className="space-y-6">
          <Card padding="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-emerald-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  (profile?.first_name?.[0] || 'F').toUpperCase()
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <Badge variant="success" size="sm" className="w-fit mx-auto sm:mx-0">
                    Verified Farmer
                  </Badge>
                </div>

                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                  {farmerProfile?.farm_name || 'AgriNova Certified Producer'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-[#21453A] text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{profile?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{farmerProfile?.farm_location || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      Member since{' '}
                      {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card padding="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Farm & Cultivation Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Total Cultivated Area</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {farmerProfile?.farm_area || 0} {farmerProfile?.farm_area_unit || 'acres'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Primary Crops</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Array.isArray(farmerProfile?.primary_crops) && farmerProfile.primary_crops.length > 0 ? (
                    farmerProfile.primary_crops.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]"
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">Not specified</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
