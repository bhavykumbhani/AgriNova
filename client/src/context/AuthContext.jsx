import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null); // 'farmer' | 'buyer' | 'admin' | null
  const [loading, setLoading] = useState(true);

  // Fetch application profile from public.profiles table using auth_user_id
  const fetchProfile = useCallback(async (authUserId) => {
    if (!authUserId || !isSupabaseConfigured) {
      setProfile(null);
      setRole(null);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          farmer_profiles (*),
          buyer_profiles (*)
        `)
        .eq('auth_user_id', authUserId)
        .maybeSingle();

      if (error) {
        console.warn('[AuthContext] Error fetching profile:', error.message);
        return null;
      }

      if (data) {
        setProfile(data);
        setRole(data.role);
        return data;
      }
    } catch (err) {
      console.warn('[AuthContext] Profile fetch exception:', err.message);
    }
    return null;
  }, []);

  // Initialize and restore auth session on application load
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (!isSupabaseConfigured) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn('[AuthContext] Session retrieval error:', sessionError.message);
        }

        if (mounted && currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          await fetchProfile(currentSession.user.id);
        }
      } catch (err) {
        console.warn('[AuthContext] Auth initialization error:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }

      // Listen for real Supabase auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          if (!mounted) return;

          if (event === 'SIGNED_OUT' || !newSession) {
            setSession(null);
            setUser(null);
            setProfile(null);
            setRole(null);
            setLoading(false);
            return;
          }

          if (newSession?.user) {
            setSession(newSession);
            setUser(newSession.user);
            await fetchProfile(newSession.user.id);
            setLoading(false);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [fetchProfile]);

  // Real Supabase Sign In with email and password
  const signIn = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !password) {
      return { data: null, error: new Error('Please enter both your email address and password.') };
    }

    if (!isSupabaseConfigured) {
      return { 
        data: null, 
        error: new Error('Authentication service is currently unavailable. Supabase credentials must be configured.') 
      };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        let friendlyMessage = 'Invalid email or password.';
        if (authError.message.includes('Invalid login credentials')) {
          friendlyMessage = 'Invalid email or password.';
        } else if (authError.message.includes('Email not confirmed')) {
          friendlyMessage = 'Please verify your email address before signing in.';
        } else {
          friendlyMessage = authError.message;
        }
        return { data: null, error: new Error(friendlyMessage) };
      }

      if (!authData?.user) {
        return { data: null, error: new Error('Invalid email or password.') };
      }

      // Authenticated successfully: retrieve the real profile
      const userProfile = await fetchProfile(authData.user.id);
      
      setUser(authData.user);
      setSession(authData.session);

      if (!userProfile) {
        return {
          data: { user: authData.user, profile: null },
          error: new Error('User profile not found. Please complete your registration.'),
        };
      }

      return {
        data: {
          user: authData.user,
          session: authData.session,
          profile: userProfile,
          role: userProfile.role,
        },
        error: null,
      };
    } catch (err) {
      return { data: null, error: new Error(err.message || 'Authentication failed. Please try again.') };
    }
  };

  // Real Supabase Sign Out
  const signOut = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('[AuthContext] Sign out error:', err.message);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      localStorage.removeItem('agrinova_session_user');
      localStorage.removeItem('agrinova_session_profile');
    }
  };

  // Send custom SMTP Email OTP via backend
  const sendEmailOtp = async (email, firstName = '') => {
    return await authService.sendEmailOtp(email, firstName);
  };

  // Verify custom SMTP Email OTP via backend
  const verifyEmailOtp = async (email, token) => {
    return await authService.verifyEmailOtp(email, token);
  };

  // Password reset request via Supabase Auth
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase configuration missing.');
    }
    return await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/login`,
    });
  };

  const value = {
    user,
    session,
    profile,
    role,
    isAuthenticated: Boolean(user && session),
    loading,
    signIn,
    signOut,
    sendEmailOtp,
    verifyEmailOtp,
    resetPassword,
    refreshProfile: () => (user ? fetchProfile(user.id) : Promise.resolve(null)),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
