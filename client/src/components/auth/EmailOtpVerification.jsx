import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Edit3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { maskEmail } from '../../utils/maskEmail';

export const EmailOtpVerification = ({
  email,
  setEmail,
  firstName = '',
  isVerified,
  setIsVerified,
  error: parentError,
  required = true,
}) => {
  const { t } = useTranslation(['auth']);
  const { sendEmailOtp, verifyEmailOtp } = useAuth();

  const [otpSent, setOtpSent] = useState(false);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [localError, setLocalError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [maskedEmailDisplay, setMaskedEmailDisplay] = useState('');

  const inputRefs = useRef([]);

  // 60-second cooldown timer
  useEffect(() => {
    let timer = null;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((c) => c - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSendOtp = async () => {
    setLocalError('');
    setStatusMessage('');

    if (!email || !validateEmail(email)) {
      setLocalError('Enter a valid email address.');
      return;
    }

    try {
      setSending(true);
      const res = await sendEmailOtp(email, firstName);
      setOtpSent(true);
      setCooldown(60);
      setDigits(['', '', '', '', '', '']);
      setMaskedEmailDisplay(res?.maskedEmail || maskEmail(email));
      setStatusMessage(`Verification code sent to ${res?.maskedEmail || maskEmail(email)}`);
      
      // Auto-focus first digit input box after render
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    } catch (err) {
      if (typeof window !== 'undefined' && !window.navigator.onLine) {
        setLocalError('Unable to connect. Check your internet connection and try again.');
      } else if (err.message && err.message.toLowerCase().includes('network')) {
        setLocalError('Unable to connect. Check your internet connection and try again.');
      } else {
        const msg = err.message || "We couldn't send the verification code. Please try again.";
        setLocalError(msg);
      }
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLocalError('');
    const fullOtp = digits.join('');

    if (fullOtp.length !== 6 || !/^\d{6}$/.test(fullOtp)) {
      setLocalError('Please enter the complete 6-digit verification code.');
      return;
    }

    try {
      setVerifying(true);
      await verifyEmailOtp(email, fullOtp);
      setIsVerified(true);
      setStatusMessage('✓ Email verified successfully.');
    } catch (err) {
      if (typeof window !== 'undefined' && !window.navigator.onLine) {
        setLocalError('Unable to connect. Check your internet connection and try again.');
      } else if (err.message && err.message.toLowerCase().includes('network')) {
        setLocalError('Unable to connect. Check your internet connection and try again.');
      } else if (err.code === 'OTP_EXPIRED') {
        setLocalError('This code has expired. Request a new verification code.');
      } else if (err.code === 'INVALID_OTP') {
        setLocalError('The code you entered is incorrect.');
      } else {
        setLocalError(err.message || 'The code you entered is incorrect.');
      }
    } finally {
      setVerifying(false);
    }
  };

  // 6-box input handlers
  const handleDigitChange = (index, value) => {
    // If multiple characters pasted
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedDigits[i] || '';
      }
      setDigits(newDigits);
      const nextFocus = Math.min(pastedDigits.length, 5);
      if (inputRefs.current[nextFocus]) {
        inputRefs.current[nextFocus].focus();
      }
      return;
    }

    // Single digit entry
    const char = value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance to next input
    if (char && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous box on backspace if current is empty
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;
    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setDigits(newDigits);
    const focusIdx = Math.min(pasteData.length, 5);
    if (inputRefs.current[focusIdx]) {
      inputRefs.current[focusIdx].focus();
    }
  };

  const handleChangeEmail = () => {
    setIsVerified(false);
    setOtpSent(false);
    setDigits(['', '', '', '', '', '']);
    setStatusMessage('');
    setLocalError('');
  };

  return (
    <div className="space-y-3">
      {/* Email Input row */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="auth-email-input" className="text-xs sm:text-sm font-semibold text-agri-textDark">
            {t('farmerReg.email', { defaultValue: 'Email Address' })} {required && <span className="text-agri-danger">*</span>}
          </label>
          {isVerified ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-agri-success bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>✓ Email Verified</span>
              </span>
              <button
                type="button"
                onClick={handleChangeEmail}
                className="text-xs text-agri-textSecondary hover:text-agri-primary font-semibold flex items-center gap-0.5 underline decoration-dotted"
              >
                <Edit3 className="w-3 h-3" />
                <span>Change Email</span>
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="auth-email-input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (isVerified) setIsVerified(false);
                if (otpSent) setOtpSent(false);
              }}
              disabled={isVerified || sending}
              placeholder="farmer@agrinova.in"
              className={`
                w-full rounded-xl border bg-white text-sm text-agri-textDark placeholder:text-gray-400
                transition-all duration-200 focus:outline-none focus:ring-2 py-2.5 sm:py-3 pl-10 pr-3.5
                disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed
                ${isVerified ? 'border-emerald-300 ring-1 ring-emerald-300 bg-emerald-50/20' : 'border-agri-border focus:border-agri-primary focus:ring-agri-primary/20'}
              `}
            />
          </div>

          {!isVerified && (
            <Button
              type="button"
              variant={otpSent ? 'secondary' : 'primary'}
              size="md"
              onClick={handleSendOtp}
              disabled={sending || cooldown > 0 || !email}
              loading={sending}
              className="whitespace-nowrap px-4 py-2.5 font-bold"
            >
              {sending
                ? 'Sending...'
                : cooldown > 0
                ? `${t('farmerReg.resendOtp', { defaultValue: 'Resend' })} (${cooldown}s)`
                : otpSent
                ? t('farmerReg.resendOtp', { defaultValue: 'Resend OTP' })
                : t('farmerReg.sendOtp', { defaultValue: 'Send OTP' })}
            </Button>
          )}
        </div>
      </div>

      {/* 6-Box Visual OTP Input (Visible after OTP is sent and before verification) */}
      {otpSent && !isVerified && (
        <div className="p-4 sm:p-5 rounded-2xl bg-agri-softGreen/30 border border-agri-primary/30 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
            <span className="font-bold text-agri-textDark flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-agri-primary" />
              <span>Enter 6-Digit Verification Code</span>
            </span>
            <span className="text-agri-dark font-medium">
              Code sent to <span className="font-bold">{maskedEmailDisplay || maskEmail(email)}</span>
            </span>
          </div>

          {/* 6 Visual OTP Input Boxes */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-10 sm:w-12 h-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black rounded-xl border border-agri-primary/40 bg-white text-agri-textDark focus:outline-none focus:ring-2 focus:ring-agri-primary focus:border-agri-primary shadow-xs transition-all"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-agri-textSecondary">
              Code expires in 10 minutes. Check spam folder if not received.
            </span>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleVerifyOtp}
              loading={verifying}
              disabled={verifying || digits.join('').length !== 6}
              className="w-full sm:w-auto font-bold px-6 py-2.5 shadow-sm"
            >
              {verifying ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </div>
        </div>
      )}

      {/* Status & Error Messages */}
      {statusMessage && !localError && (
        <p className="text-xs text-agri-primary font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{statusMessage}</span>
        </p>
      )}

      {(localError || parentError) && (
        <p className="text-xs text-agri-danger font-medium flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{localError || parentError}</span>
        </p>
      )}
    </div>
  );
};
