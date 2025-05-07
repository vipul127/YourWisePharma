import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDoctor: boolean; 
  doctorDetails: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, doctorInfo: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDoctor, setIsDoctor] = useState(false);

  // Function to fetch doctor details
  const fetchDoctorDetails = async (userId: string) => {
    try {
      // Get the current session to ensure we have the latest user email
      const { data: sessionData } = await supabase.auth.getSession();
      const currentEmail = sessionData.session?.user?.email || user?.email;
      
      // For development purposes, if the user is authenticated, consider them a doctor
      // This is temporary until the doctors table is properly set up
      setIsDoctor(true);
      setDoctorDetails({
        name: currentEmail ? currentEmail.split('@')[0] : 'Doctor',
        specialty: 'General Practice',
        is_verified: true
      });
      
      try {
        // Try to fetch from the actual table if it exists
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (data && !error) {
          setDoctorDetails(data);
          setIsDoctor(true);
        }
      } catch (tableError) {
        console.error('Error fetching from doctors table:', tableError);
        // Continue with fallback data
      }
    } catch (error) {
      console.error('Error in fetchDoctorDetails:', error);
    } finally {
      // Ensure loading state ends even if there are errors
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Fetch doctor details if user is authenticated
          await fetchDoctorDetails(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Fetch doctor details if user is authenticated
          await fetchDoctorDetails(session.user.id);
        } else {
          setDoctorDetails(null);
          setIsDoctor(false);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, doctorInfo: any) => {
    // First create the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // Then add the doctor info to the doctors table
      const { error: profileError } = await supabase.from('doctors').insert([
        {
          id: data.user.id,
          email: email,
          name: doctorInfo.name,
          specialty: doctorInfo.specialty,
          license_number: doctorInfo.licenseNumber,
          is_verified: false, // Will be verified manually by admin
        },
      ]);

      if (profileError) {
        throw profileError;
      }
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      // Manually reset all auth-related state
      setSession(null);
      setUser(null);
      setDoctorDetails(null);
      setIsDoctor(false);
      
      // Force a page reload to clear any cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    isLoading,
    isDoctor,
    doctorDetails,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};