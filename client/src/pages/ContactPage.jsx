import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  MessageSquareHeart
} from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { Button } from '../components/common/Button';
import { TextInput } from '../components/common/TextInput';
import { supportService } from '../services/supportService';

export const ContactPage = () => {
  const { t } = useTranslation(['contact', 'common']);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successSent, setSuccessSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const topics = [
    { value: 'general', label: t('form.topics.general', { defaultValue: 'General Inquiry' }) },
    { value: 'account', label: t('form.topics.account', { defaultValue: 'Account Support' }) },
    { value: 'farmer', label: t('form.topics.farmer', { defaultValue: 'Farmer Support' }) },
    { value: 'buyer', label: t('form.topics.buyer', { defaultValue: 'Buyer Support' }) },
    { value: 'technical', label: t('form.topics.technical', { defaultValue: 'Technical Issue' }) },
    { value: 'partnership', label: t('form.topics.partnership', { defaultValue: 'Business Partnership' }) },
    { value: 'feedback', label: t('form.topics.feedback', { defaultValue: 'Feedback & Suggestions' }) },
    { value: 'other', label: t('form.topics.other', { defaultValue: 'Other' }) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.topic || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields marked with *');
      return;
    }

    try {
      setLoading(true);
      await supportService.submitContact(formData);
      setSuccessSent(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        topic: '',
        message: '',
      });
    } catch (err) {
      setErrorMessage(err.message || 'Unable to submit your message. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-16">
      {/* Hero */}
      <PageHero
        badge={t('hero.badge', { defaultValue: 'Get in Touch' })}
        badgeIcon={MessageSquareHeart}
        title={t('hero.title', { defaultValue: 'Contact AgriNova' })}
        subtitle={t('hero.subtitle', { defaultValue: "Have a question, suggestion or support request? We'd like to hear from you." })}
        breadcrumbs={[{ label: t('hero.title', { defaultValue: 'Contact' }), path: '/contact' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-6 sm:p-10 shadow-card-subtle">
            {successSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-agri-textDark dark:text-agri-darkText mb-2">
                  {t('form.successTitle', { defaultValue: 'Message Sent Successfully!' })}
                </h3>
                <p className="text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary max-w-md mx-auto mb-6 leading-relaxed">
                  {t('form.successMessage', { defaultValue: 'Thank you for reaching out to AgriNova. Our support desk has received your message and will respond within 24 business hours.' })}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSuccessSent(false)}
                >
                  {t('form.sendAnother', { defaultValue: 'Send Another Message' })}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-agri-textDark dark:text-agri-darkText mb-4">
                  Send Us a Direct Message
                </h3>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs sm:text-sm text-red-600 dark:text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    id="contactFirstName"
                    label={t('form.firstName', { defaultValue: 'First Name' })}
                    placeholder={t('form.firstNamePlaceholder', { defaultValue: 'e.g. Rahul' })}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                  <TextInput
                    id="contactLastName"
                    label={t('form.lastName', { defaultValue: 'Last Name' })}
                    placeholder={t('form.lastNamePlaceholder', { defaultValue: 'e.g. Sharma' })}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    id="contactEmail"
                    type="email"
                    label={t('form.email', { defaultValue: 'Email Address' })}
                    placeholder={t('form.emailPlaceholder', { defaultValue: 'e.g. rahul@example.com' })}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <TextInput
                    id="contactPhone"
                    type="tel"
                    label={t('form.phone', { defaultValue: 'Phone Number (Optional)' })}
                    placeholder={t('form.phonePlaceholder', { defaultValue: 'e.g. 9876543210' })}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {/* Topic Dropdown */}
                <div>
                  <label htmlFor="contactTopic" className="block text-xs sm:text-sm font-semibold text-agri-textDark dark:text-agri-darkText mb-1.5">
                    {t('form.topic', { defaultValue: 'Topic / Inquiry Subject' })} <span className="text-agri-danger">*</span>
                  </label>
                  <select
                    id="contactTopic"
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-agri-border dark:border-agri-darkBorder bg-agri-bg dark:bg-agri-darkBgSecondary text-agri-textDark dark:text-agri-darkText text-sm focus:outline-none focus:ring-2 focus:ring-agri-primary"
                  >
                    <option value="">{t('form.selectTopic', { defaultValue: 'Select a topic...' })}</option>
                    {topics.map((tItem) => (
                      <option key={tItem.value} value={tItem.value}>
                        {tItem.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="contactMessage" className="block text-xs sm:text-sm font-semibold text-agri-textDark dark:text-agri-darkText mb-1.5">
                    {t('form.message', { defaultValue: 'Your Message' })} <span className="text-agri-danger">*</span>
                  </label>
                  <textarea
                    id="contactMessage"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('form.messagePlaceholder', { defaultValue: 'Tell us how we can assist you with your farming or buying inquiries...' })}
                    className="w-full px-4 py-3 rounded-xl border border-agri-border dark:border-agri-darkBorder bg-agri-bg dark:bg-agri-darkBgSecondary text-agri-textDark dark:text-agri-darkText text-sm focus:outline-none focus:ring-2 focus:ring-agri-primary"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={loading}
                  icon={Send}
                  className="font-bold shadow-md mt-2"
                >
                  {loading ? t('form.sending', { defaultValue: 'Sending Message...' }) : t('form.submit', { defaultValue: 'Send Message' })}
                </Button>
              </form>
            )}
          </div>

          {/* Info Side Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-emerald-50 via-white to-agri-softGreen/30 dark:from-agri-darkCard dark:via-agri-darkBgSecondary dark:to-agri-darkBg border border-emerald-200/70 dark:border-agri-darkBorder rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-extrabold text-agri-textDark dark:text-agri-darkText mb-4">
                {t('info.title', { defaultValue: 'Direct Contact Information' })}
              </h3>
              <p className="text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary mb-6 leading-relaxed">
                {t('info.subtitle', { defaultValue: 'Reach our operations desk and regional support centers.' })}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-agri-softGreen dark:bg-agri-darkBgSecondary text-agri-primary dark:text-agri-darkPrimary flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400">{t('info.supportEmail', { defaultValue: 'Support Email' })}</div>
                    <a href="mailto:darshakjikadra4@gmail.com" className="text-sm font-bold text-agri-primary dark:text-agri-darkPrimary hover:underline">
                      darshakjikadra4@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-agri-softGreen dark:bg-agri-darkBgSecondary text-agri-primary dark:text-agri-darkPrimary flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400">{t('info.supportHours', { defaultValue: 'Support Hours' })}</div>
                    <div className="text-sm font-semibold text-agri-textDark dark:text-agri-darkText">
                      {t('info.hoursValue', { defaultValue: 'Monday – Saturday: 8:00 AM – 8:00 PM IST' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-agri-softGreen dark:bg-agri-darkBgSecondary text-agri-primary dark:text-agri-darkPrimary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400">{t('info.location', { defaultValue: 'Headquarters' })}</div>
                    <div className="text-sm font-semibold text-agri-textDark dark:text-agri-darkText">
                      {t('info.locationValue', { defaultValue: 'AgriNova Technology Hub, Pune, Maharashtra, India' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
