import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Store, Check, Edit2, ShieldAlert } from 'lucide-react';
import { RegistrationLayout } from '../../components/auth/RegistrationLayout';
import { RegistrationProgress } from '../../components/auth/RegistrationProgress';
import { TextInput } from '../../components/common/TextInput';
import { PasswordInput } from '../../components/common/PasswordInput';
import { PasswordStrength } from '../../components/common/PasswordStrength';
import { EmailOtpVerification } from '../../components/auth/EmailOtpVerification';
import { PhoneInput } from '../../components/common/PhoneInput';
import { SuccessScreen } from '../../components/auth/SuccessScreen';
import { Button } from '../../components/common/Button';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const BUSINESS_TYPES = [
  'Wholesaler',
  'Retailer',
  'Supermarket / Retail Chain',
  'Food Processor',
  'Distributor',
  'Exporter',
  'Restaurant / Hotel / Catering',
  'Institutional Buyer',
  'E-commerce Business',
  'Agricultural Trader',
  'Other',
];

export const BuyerRegisterPage = () => {
  const { t } = useTranslation(['auth']);
  const navigate = useNavigate();
  const { setSessionProfile } = useAuth();
  const { currentLanguage } = useLanguage();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isEmailVerified: false,
    phone: '',
    countryCode: '+91',
    password: '',
    confirmPassword: '',
    companyName: '',
    businessType: 'Wholesaler',
    customBusinessType: '',
    city: '',
    state: '',
    gstin: '',
    businessAddress: '',
  });

  const [errors, setErrors] = useState({});

  // Indian GSTIN validator (15-characters: 2 digits state code + 10 chars PAN + 1 entity + 1 Z + 1 check digit)
  const validateGstin = (val) => {
    if (!val) return true; // Optional
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(val.trim().toUpperCase());
  };

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
    if (!formData.companyName.trim()) errs.companyName = 'Company / Business name is required.';
    if (!formData.city.trim()) errs.city = 'Operating city or mandi cluster is required.';
    if (formData.businessType === 'Other' && !formData.customBusinessType.trim()) {
      errs.customBusinessType = 'Please specify your business model.';
    }
    if (formData.gstin && !validateGstin(formData.gstin)) {
      errs.gstin = 'Invalid GSTIN format. Expected 15 characters (e.g. 24AAACH7409R1ZZ).';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setLoading(true);

    try {
      const finalBusinessType =
        formData.businessType === 'Other' ? formData.customBusinessType.trim() : formData.businessType;
      const fullPhone = `${formData.countryCode} ${formData.phone}`;

      const { user, profile } = await authService.registerBuyer({
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: fullPhone,
        companyName: formData.companyName.trim(),
        businessType: finalBusinessType,
        city: formData.city.trim(),
        state: formData.state.trim(),
        gstin: formData.gstin.trim(),
        businessAddress: formData.businessAddress.trim(),
        preferredLanguage: currentLanguage,
      });

      if (user && profile) {
        setSessionProfile(user, profile);
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
            role="buyer"
            title="Welcome to AgriNova!"
            message="Your buyer account has been created successfully. You can now discover crop listings, connect directly with farmers, and manage bulk procurement orders."
            primaryBtnText="Go to Buyer Dashboard"
            primaryBtnPath="/buyer/dashboard"
            secondaryBtnText="Browse Marketplace"
            secondaryBtnPath="/marketplace"
          />
        </div>
      </main>
    );
  }

  const stepLabels = [
    t('buyerReg.step1', { defaultValue: 'Personal Info' }),
    t('buyerReg.step2', { defaultValue: 'Business Info' }),
    t('buyerReg.step3', { defaultValue: 'Review & Complete' }),
  ];

  return (
    <RegistrationLayout
      badgeText="Merchant &amp; Buyer Portal"
      title="Create Your Buyer Account"
      subtitle="Source quality agricultural produce directly from verified farmers and FPOs."
    >
      <RegistrationProgress currentStep={step} totalSteps={3} steps={stepLabels} />

      {generalError && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-agri-danger shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {/* STEP 1: Personal Information & OTP */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextInput
              id="buyerFirstName"
              label={t('buyerReg.firstName', { defaultValue: 'First Name' })}
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required={true}
              error={errors.firstName}
              placeholder="e.g. Rajesh"
            />
            <TextInput
              id="buyerLastName"
              label={t('buyerReg.lastName', { defaultValue: 'Last Name' })}
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required={true}
              error={errors.lastName}
              placeholder="e.g. Shah"
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
            id="buyerPhone"
            label={t('farmerReg.phone', { defaultValue: 'Phone Number' })}
            value={formData.phone}
            onChange={(val) => setFormData({ ...formData, phone: val })}
            countryCode={formData.countryCode}
            onCountryCodeChange={(val) => setFormData({ ...formData, countryCode: val })}
            required={true}
            error={errors.phone}
            helperText="Used for trade notifications and delivery confirmations."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <PasswordInput
              id="buyerPassword"
              label={t('farmerReg.password', { defaultValue: 'Password' })}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={true}
              error={errors.password}
            />
            <PasswordInput
              id="buyerConfirmPassword"
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
              variant="dark"
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

      {/* STEP 2: Business Information */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <TextInput
            id="companyName"
            label={t('buyerReg.companyName', { defaultValue: 'Company / Business Name' })}
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required={true}
            error={errors.companyName}
            placeholder="e.g. Apex Agro Commodities Pvt Ltd"
          />

          <div>
            <label htmlFor="businessType" className="text-xs sm:text-sm font-semibold text-agri-textDark block mb-1.5">
              {t('buyerReg.businessType', { defaultValue: 'Business Type' })} <span className="text-agri-danger">*</span>
            </label>
            <select
              id="businessType"
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              className="w-full rounded-xl border border-agri-border bg-white text-sm py-2.5 sm:py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {formData.businessType === 'Other' && (
            <TextInput
              id="customBusinessType"
              label="Specify Business Type"
              value={formData.customBusinessType}
              onChange={(e) => setFormData({ ...formData, customBusinessType: e.target.value })}
              required={true}
              error={errors.customBusinessType}
              placeholder="e.g. Organic Produce Aggregator"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextInput
              id="buyerCity"
              label={t('buyerReg.city', { defaultValue: 'City / Trading Hub' })}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required={true}
              error={errors.city}
              placeholder="e.g. Ahmedabad"
            />
            <TextInput
              id="buyerState"
              label="State / Province"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="e.g. Gujarat"
            />
          </div>

          <TextInput
            id="buyerGstin"
            label={t('buyerReg.gstin', { defaultValue: 'GSTIN' })}
            value={formData.gstin}
            onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
            placeholder="24AAACH7409R1ZZ"
            error={errors.gstin}
            helperText={t('buyerReg.gstinHelper', { defaultValue: '15-character GST Identification Number (Optional)' })}
          />

          <TextInput
            id="businessAddress"
            label={t('buyerReg.businessAddress', { defaultValue: 'Business Address (Optional)' })}
            value={formData.businessAddress}
            onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
            placeholder="e.g. Shed 14, APMC Market Yard"
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
              variant="dark"
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

      {/* STEP 3: Review & Complete */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
          {/* Summary Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-agri-textDark flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-600" />
                <span>{t('buyerReg.summaryTitle', { defaultValue: 'Review Business Summary' })}</span>
              </h3>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Info</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-y-2.5 text-xs">
              <div>
                <span className="text-agri-textSecondary">Buyer Representative:</span>
                <p className="font-bold text-agri-textDark">{formData.firstName} {formData.lastName}</p>
              </div>
              <div>
                <span className="text-agri-textSecondary">Verified Email:</span>
                <p className="font-bold text-agri-textDark truncate">{formData.email}</p>
              </div>
              <div>
                <span className="text-agri-textSecondary">Phone Number:</span>
                <p className="font-bold text-agri-textDark">{formData.countryCode} {formData.phone}</p>
              </div>
              <div>
                <span className="text-agri-textSecondary">Company Name:</span>
                <p className="font-bold text-agri-textDark">{formData.companyName}</p>
              </div>
              <div>
                <span className="text-agri-textSecondary">Business Category:</span>
                <p className="font-bold text-blue-700">
                  {formData.businessType === 'Other' ? formData.customBusinessType : formData.businessType}
                </p>
              </div>
              <div>
                <span className="text-agri-textSecondary">Location:</span>
                <p className="font-bold text-agri-textDark">{formData.city} {formData.state ? `, ${formData.state}` : ''}</p>
              </div>
              {formData.gstin && (
                <div className="col-span-2">
                  <span className="text-agri-textSecondary">GSTIN:</span>
                  <p className="font-mono font-bold text-agri-textDark">{formData.gstin}</p>
                </div>
              )}
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
              variant="dark"
              size="lg"
              loading={loading}
              className="font-bold px-8 shadow-md"
            >
              {t('buyerReg.completeBtn', { defaultValue: 'Complete Registration' })}
            </Button>
          </div>
        </form>
      )}
    </RegistrationLayout>
  );
};
