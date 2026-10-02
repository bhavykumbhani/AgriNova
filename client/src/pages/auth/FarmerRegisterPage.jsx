import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Sprout, Check, Edit2, ShieldAlert } from 'lucide-react';
import { RegistrationLayout } from '../../components/auth/RegistrationLayout';
import { RegistrationProgress } from '../../components/auth/RegistrationProgress';
import { TextInput } from '../../components/common/TextInput';
import { PasswordInput } from '../../components/common/PasswordInput';
import { PasswordStrength } from '../../components/common/PasswordStrength';
import { EmailOtpVerification } from '../../components/auth/EmailOtpVerification';
import { PhoneInput } from '../../components/common/PhoneInput';
import { LocationPicker } from '../../components/common/LocationPicker';
import { CropMultiSelect } from '../../components/common/CropMultiSelect';
import { SuccessScreen } from '../../components/auth/SuccessScreen';
import { Button } from '../../components/common/Button';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const FarmerRegisterPage = () => {
  const { t } = useTranslation(['auth']);
  const navigate = useNavigate();
  const { setSessionProfile, signIn } = useAuth();
  const { currentLanguage } = useLanguage();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isEmailVerified: false,
    phone: '',
    countryCode: '+91',
    password: '',
    confirmPassword: '',
    farmName: '',
    farmLocation: {
      latitude: null,
      longitude: null,
      city: '',
      state: '',
      country: 'India',
      formatted_address: '',
    },
    farmArea: '',
    farmAreaUnit: 'Acre',
    primaryCrops: ['Wheat', 'Rice (Paddy)'],
    sellingCategories: ['Grains'],
    typicalQuantity: '',
    preferredSellingUnit: 'quintal',
  });

  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.email.trim()) errs.email = 'Email address is required.';
    if (!formData.isEmailVerified) errs.email = 'Please verify your email address with OTP before proceeding.';
    if (!formData.phone || formData.phone.length < 10) errs.phone = 'Please enter a valid 10-digit mobile number.';
    if (!formData.password || formData.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.farmName.trim()) errs.farmName = 'Farm name or holding identifier is required.';
    if (!formData.farmLocation.formatted_address) {
      errs.farmLocation = 'Please detect your GPS location or choose your farm on the map.';
    }
    if (!formData.farmArea || parseFloat(formData.farmArea) <= 0) {
      errs.farmArea = 'Please enter a valid farm acreage.';
    }
    if (formData.primaryCrops.length === 0) {
      errs.primaryCrops = 'Please select at least one primary crop.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    setGeneralError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setGeneralError('');
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCategory = (cat) => {
    if (formData.sellingCategories.includes(cat)) {
      setFormData({
        ...formData,
        sellingCategories: formData.sellingCategories.filter((c) => c !== cat),
      });
    } else {
      setFormData({
        ...formData,
        sellingCategories: [...formData.sellingCategories, cat],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setLoading(true);

    try {
      const fullPhone = `${formData.countryCode} ${formData.phone}`.trim();
      const result = await authService.registerFarmer({
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: fullPhone,
        farmName: formData.farmName.trim(),
        farmLocation: formData.farmLocation,
        farmArea: formData.farmArea,
        farmAreaUnit: formData.farmAreaUnit,
        primaryCrops: formData.primaryCrops,
        sellingCategories: formData.sellingCategories,
        typicalQuantity: formData.typicalQuantity,
        preferredSellingUnit: formData.preferredSellingUnit,
        preferredLanguage: currentLanguage,
      });

      const user = result?.user;
      const profile = result?.profile;

      // Initialize Supabase session with credentials
      try {
        await signIn(formData.email.trim(), formData.password);
      } catch (signInErr) {
        if (user && profile) {
          setSessionProfile(user, profile);
        }
      }
      setIsSuccess(true);
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Please review your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-[85vh] bg-agri-bg flex items-center justify-center py-12 px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-agri-border">
          <SuccessScreen
            role="farmer"
            title="Welcome to AgriNova!"
            message="Your farmer account has been created successfully. You can now access your farm dashboard, review localized weather advisories, and prepare crop listings."
            primaryBtnText="Go to Farmer Dashboard"
            primaryBtnPath="/farmer/dashboard"
            secondaryBtnText="Complete Profile"
            secondaryBtnPath="/profile"
          />
        </div>
      </main>
    );
  }

  const stepLabels = [
    t('farmerReg.step1', { defaultValue: 'Personal Info' }),
    t('farmerReg.step2', { defaultValue: 'Farm Details' }),
    t('farmerReg.step3', { defaultValue: 'Selling Profile' }),
  ];

  return (
    <RegistrationLayout
      badgeText="Grower Registration"
      title="Create Your Farmer Account"
      subtitle="Join progressive growers trading produce directly at fair market rates."
    >
      <RegistrationProgress currentStep={step} totalSteps={3} steps={stepLabels} />

      {generalError && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-agri-danger shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {/* STEP 1: Personal Info & OTP */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextInput
              id="firstName"
              label={t('farmerReg.firstName', { defaultValue: 'First Name' })}
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required={true}
              error={errors.firstName}
              placeholder="e.g. Ramesh"
            />
            <TextInput
              id="lastName"
              label={t('farmerReg.lastName', { defaultValue: 'Last Name' })}
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required={true}
              error={errors.lastName}
              placeholder="e.g. Patel"
            />
          </div>

          <EmailOtpVerification
            email={formData.email}
            setEmail={(val) => setFormData({ ...formData, email: val })}
            firstName={formData.firstName}
            isVerified={formData.isEmailVerified}
            setIsVerified={(val) => setFormData({ ...formData, isEmailVerified: val })}
            error={errors.email}
          />

          <PhoneInput
            id="phone"
            label={t('farmerReg.phone', { defaultValue: 'Phone Number' })}
            value={formData.phone}
            onChange={(val) => setFormData({ ...formData, phone: val })}
            countryCode={formData.countryCode}
            onCountryCodeChange={(val) => setFormData({ ...formData, countryCode: val })}
            required={true}
            error={errors.phone}
            helperText="Used for verified buyer calls and logistics coordination."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <PasswordInput
              id="password"
              label={t('farmerReg.password', { defaultValue: 'Password' })}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={true}
              error={errors.password}
            />
            <PasswordInput
              id="confirmPassword"
              label={t('farmerReg.confirmPassword', { defaultValue: 'Confirm Password' })}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required={true}
              error={errors.confirmPassword}
            />
          </div>

          <PasswordStrength password={formData.password} />

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <Link to="/register" className="text-xs font-semibold text-agri-textSecondary hover:text-agri-textDark flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Role</span>
            </Link>

            <Button
              type="button"
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleNext}
              className="font-bold px-7"
            >
              {t('actions.next', { defaultValue: 'Next Step' })}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Farm Details */}
      {step === 2 && (
        <div className="space-y-5 animate-fadeIn">
          <TextInput
            id="farmName"
            label={t('farmerReg.farmName', { defaultValue: 'Farm Name / Holding Identifier' })}
            value={formData.farmName}
            onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
            required={true}
            error={errors.farmName}
            placeholder="e.g. Shreenath Agro Farm"
          />

          <LocationPicker
            locationData={formData.farmLocation}
            onChange={(loc) => setFormData({ ...formData, farmLocation: loc })}
            required={true}
            error={errors.farmLocation}
          />

          {/* Farm Area with Unit Selector */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-agri-textDark block mb-1.5">
              {t('farmerReg.farmArea', { defaultValue: 'Farm Area' })} <span className="text-agri-danger">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.farmArea}
                onChange={(e) => setFormData({ ...formData, farmArea: e.target.value })}
                placeholder="e.g. 5.5"
                className="flex-1 rounded-xl border border-agri-border bg-white text-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-agri-primary"
              />
              <select
                value={formData.farmAreaUnit}
                onChange={(e) => setFormData({ ...formData, farmAreaUnit: e.target.value })}
                className="w-32 rounded-xl border border-agri-border bg-gray-50 text-xs sm:text-sm font-bold text-agri-textDark py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-agri-primary"
              >
                <option value="Acre">{t('farmerReg.unitAcre', { defaultValue: 'Acre' })}</option>
                <option value="Hectare">{t('farmerReg.unitHectare', { defaultValue: 'Hectare' })}</option>
              </select>
            </div>
            {errors.farmArea && <p className="text-xs text-agri-danger mt-1">{errors.farmArea}</p>}
          </div>

          <CropMultiSelect
            selectedCrops={formData.primaryCrops}
            onChange={(crops) => setFormData({ ...formData, primaryCrops: crops })}
            error={errors.primaryCrops}
          />

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="md"
              icon={ArrowLeft}
              onClick={handlePrev}
            >
              {t('actions.back', { defaultValue: 'Back' })}
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleNext}
              className="font-bold px-7"
            >
              {t('actions.next', { defaultValue: 'Next Step' })}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Selling Profile & Review Summary */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
          {/* Produce Categories */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-agri-textDark block mb-2">
              {t('farmerReg.primarilySell', { defaultValue: 'What do you primarily sell?' })}
            </label>
            <div className="flex flex-wrap gap-2">
              {['Grains', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Spices', 'Cash Crops', 'Other'].map((cat) => {
                const isSelected = formData.sellingCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-agri-dark text-white border-agri-dark'
                        : 'bg-gray-50 text-agri-textDark border-gray-200 hover:border-agri-primary'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typical Quantity & Selling Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextInput
              id="typicalQuantity"
              label={t('farmerReg.typicalQuantity', { defaultValue: 'Typical Selling Quantity (Optional)' })}
              type="number"
              value={formData.typicalQuantity}
              onChange={(e) => setFormData({ ...formData, typicalQuantity: e.target.value })}
              placeholder="e.g. 50"
            />

            <div>
              <label htmlFor="preferredUnit" className="text-xs sm:text-sm font-semibold text-agri-textDark block mb-1.5">
                {t('farmerReg.preferredUnit', { defaultValue: 'Preferred Selling Unit' })}
              </label>
              <select
                id="preferredUnit"
                value={formData.preferredSellingUnit}
                onChange={(e) => setFormData({ ...formData, preferredSellingUnit: e.target.value })}
                className="w-full rounded-xl border border-agri-border bg-white text-sm py-2.5 sm:py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-agri-primary"
              >
                <option value="quintal">Quintal (100 kg)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="tonne">Metric Tonne (1,000 kg)</option>
              </select>
            </div>
          </div>

          {/* Registration Review Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-agri-textDark flex items-center gap-1.5">
                <Check className="w-4 h-4 text-agri-primary" />
                <span>{t('farmerReg.summaryTitle', { defaultValue: 'Review Registration Summary' })}</span>
              </h3>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-agri-primary hover:text-agri-dark font-bold flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Info</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-agri-textSecondary">Grower Name:</span>
                <p className="font-bold text-agri-textDark">{formData.firstName} {formData.lastName}</p>
              </div>
              <div>
                <span className="text-agri-textSecondary">Verified Email:</span>
                <p className="font-bold text-agri-textDark truncate">{formData.email}</p>
              </div>
              <div>
                <span className="text-agri-textSecondary">Farm Name &amp; Area:</span>
                <p className="font-bold text-agri-textDark">{formData.farmName} ({formData.farmArea} {formData.farmAreaUnit}s)</p>
              </div>
              <div>
                <span className="text-agri-textSecondary">Location:</span>
                <p className="font-bold text-agri-textDark truncate">{formData.farmLocation.formatted_address || 'GPS Tagged'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-agri-textSecondary">Primary Crops:</span>
                <p className="font-bold text-agri-primary">{formData.primaryCrops.join(', ')}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="md"
              icon={ArrowLeft}
              onClick={handlePrev}
            >
              {t('actions.back', { defaultValue: 'Back' })}
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="font-bold px-8 shadow-md"
            >
              {t('farmerReg.completeBtn', { defaultValue: 'Complete Registration' })}
            </Button>
          </div>
        </form>
      )}
    </RegistrationLayout>
  );
};
