import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null); // 'farmer' | 'buyer' | 'admin' | null
  const [loading, setLoading] = useState(true);

  // Fetch application profile from public.profiles table
  const fetchProfile = useCallback(async (authUserId) => {
    if (!authUserId) {
      setProfile(null);
      setRole(null);
      return null;
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', authUserId)
          .single();

        if (!error && data) {
          setProfile(data);
          setRole(data.role);
          return data;
        }
      } catch (err) {
        console.warn('Profile fetch notice:', err.message);
      }
    }

    // Local state fallback if profile record is being established
    const cachedProfile = localStorage.getItem('agrinova_session_profile');
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        setProfile(parsed);
        setRole(parsed.role);
        return parsed;
      } catch {
        // invalid JSON
      }
    }
    return null;
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted && session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          }
        } catch (e) {
          console.warn('Auth session check notice:', e.message);
        } finally {
          if (mounted) setLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            if (mounted) {
              const currentUser = session?.user ?? null;
              setUser(currentUser);
              if (currentUser) {
                await fetchProfile(currentUser.id);
              } else {
                setProfile(null);
                setRole(null);
                localStorage.removeItem('agrinova_session_profile');
              }
              setLoading(false);
            }
          }
        );

        return () => subscription.unsubscribe();
      } else {
        // Fallback for initial development mode
        const cachedUser = localStorage.getItem('agrinova_session_user');
        const cachedProfile = localStorage.getItem('agrinova_session_profile');
        if (cachedUser && cachedProfile) {
          try {
            setUser(JSON.parse(cachedUser));
            const p = JSON.parse(cachedProfile);
            setProfile(p);
            setRole(p.role);
          } catch {
            // ignore
          }
        }
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [fetchProfile]);

  // Sign In with email and password
  const signIn = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();

    if (!isSupabaseConfigured) {
      // Check for saved user from registration
      let matchedUser = null;
      let matchedProfile = null;

      try {
        const storedUsersRaw = localStorage.getItem('agrinova_registered_users');
        const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : {};
        if (registeredUsers[cleanEmail]) {
          matchedUser = registeredUsers[cleanEmail].user;
          matchedProfile = registeredUsers[cleanEmail].profile;
        }
      } catch (e) {}

      // Fallback check in last session profile
      if (!matchedProfile) {
        try {
          const lastProfile = JSON.parse(localStorage.getItem('agrinova_session_profile') || '{}');
          if (lastProfile.email && lastProfile.email.toLowerCase() === cleanEmail) {
            matchedProfile = lastProfile;
          }
        } catch (e) {}
      }

      const userRole = matchedProfile?.role || (cleanEmail.includes('buyer') ? 'buyer' : 'farmer');
      const activeUser = matchedUser || {
        id: matchedProfile?.auth_user_id || `usr_${Date.now()}`,
        email: cleanEmail,
      };
      const activeProfile = matchedProfile || {
        id: `prof_${Date.now()}`,
        auth_user_id: activeUser.id,
        role: userRole,
        first_name: userRole === 'buyer' ? 'Business' : 'Farmer',
        last_name: 'Member',
        email: cleanEmail,
      };

      setUser(activeUser);
      setProfile(activeProfile);
      setRole(activeProfile.role || userRole);
      localStorage.setItem('agrinova_session_user', JSON.stringify(activeUser));
      localStorage.setItem('agrinova_session_profile', JSON.stringify(activeProfile));

      return { data: { user: activeUser, profile: activeProfile }, error: null };
    }

    try {
      const res = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (res.error) return res;

      if (res.data?.user) {
        const userProfile = await fetchProfile(res.data.user.id);
        return { data: { user: res.data.user, profile: userProfile }, error: null };
      }
      return res;
    } catch (err) {
      console.warn('Supabase sign in failed:', err.message);
      return { data: null, error: err };
    }
  };

  // Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setRole(null);
    localStorage.removeItem('agrinova_session_user');
    localStorage.removeItem('agrinova_session_profile');
  };

  // Send custom SMTP Email OTP via backend
  const sendEmailOtp = async (email, firstName = '') => {
    return await authService.sendEmailOtp(email, firstName);
  };

  // Verify custom SMTP Email OTP via backend
  const verifyEmailOtp = async (email, token) => {
    return await authService.verifyEmailOtp(email, token);
  };

  // Password reset request
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      return { success: true, simulated: true };
    }
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
  };

  const value = {
    user,
    profile,
    role,
    isAuthenticated: Boolean(user),
    loading,
    signIn,
    signOut,
    sendEmailOtp,
    verifyEmailOtp,
    resetPassword,
    refreshProfile: () => user && fetchProfile(user.id),
    setSessionProfile: (u, p) => {
      setUser(u);
      setProfile(p);
      setRole(p.role);
      localStorage.setItem('agrinova_session_user', JSON.stringify(u));
      localStorage.setItem('agrinova_session_profile', JSON.stringify(p));
    },
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
