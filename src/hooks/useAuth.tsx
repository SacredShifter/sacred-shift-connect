import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string | undefined;
  roleLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [roleLoading, setRoleLoading] = useState(false);
  
  // Simple error handler without hooks
  const handleAuthError = (error: any, context: any) => {
    console.error('Auth error:', context, error);
  };
  
  console.log('AuthProvider state change', { 
    component: 'AuthProvider',
    userId: user?.id,
    metadata: { hasSession: !!session, loading }
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`Auth state changed: ${event}`, {
          component: 'AuthProvider',
          function: 'onAuthStateChange',
          userId: session?.user?.id,
          metadata: { event, hasSession: !!session }
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role if logged in
        if (session?.user) {
          setLoading(false);
          setRoleLoading(true);
          
          // Fetch roles
          (async () => {
            try {
              const { data: roles, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id);
              
              if (error) {
                handleAuthError(error, {
                  component: 'AuthProvider',
                  function: 'fetchUserRoles',
                  userId: session.user.id
                });
                setUserRole('user'); // Default to user role on error
              } else {
                // Check if user is admin
                const isAdmin = roles?.some(r => r.role === 'admin');
                const finalRole = isAdmin ? 'admin' : 'user';
                setUserRole(finalRole);
                
                console.log('Role fetch result', {
                  component: 'AuthProvider',
                  function: 'onAuthStateChange',
                  userId: session.user.id,
                  metadata: {
                    roles: roles?.map(r => r.role),
                    isAdmin,
                    finalRole,
                  }
                });
              }
            } catch (error) {
              handleAuthError(error, {
                component: 'AuthProvider',
                function: 'fetchUserRoles',
                userId: session.user.id
              });
              setUserRole('user'); // Default to user role on error
            } finally {
              setRoleLoading(false);
            }
          })();
        } else {
          setUserRole(undefined);
          setRoleLoading(false);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('Auth session error', {
          component: 'AuthProvider',
          function: 'getSession',
          userId: undefined,
          metadata: { error: String((error as any)?.message || error) }
        });
        try { await supabase.auth.signOut(); } catch {}
        setSession(null);
        setUser(null);
        setUserRole(undefined);
        setRoleLoading(false);
        setLoading(false);
        return;
      }
      
      console.log('Initial session check completed', {
        component: 'AuthProvider',
        function: 'getSession',
        userId: session?.user?.id,
        metadata: { hasSession: !!session }
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Fetch user role if logged in
      if (session?.user) {
        setRoleLoading(true);
        (async () => {
          try {
            const { data: roles, error } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id);
            
            if (error) {
              handleAuthError(error, {
                component: 'AuthProvider',
                function: 'fetchInitialUserRoles',
                userId: session.user.id
              });
              setUserRole('user'); // Default to user role on error
            } else {
              const isAdmin = roles?.some(r => r.role === 'admin');
              const finalRole = isAdmin ? 'admin' : 'user';
              setUserRole(finalRole);
              
              console.log('Initial role fetch result', {
                component: 'AuthProvider',
                function: 'getSession',
                userId: session.user.id,
                metadata: {
                  roles: roles?.map(r => r.role),
                  isAdmin,
                  finalRole,
                }
              });
            }
          } catch (error) {
            handleAuthError(error, {
              component: 'AuthProvider',
              function: 'fetchInitialUserRoles',
              userId: session?.user?.id
            });
            setUserRole('user'); // Default to user role on error
          } finally {
            setRoleLoading(false);
          }
        })();
      } else {
        setUserRole(undefined);
        setRoleLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('Starting user sign up', { component: 'useAuth', function: 'signUp', metadata: { email } });
    const redirectUrl = `${window.location.origin}/auth/confirm`;
    console.log('Using redirect URL for email confirmation', { component: 'useAuth', function: 'signUp', metadata: { redirectUrl } });
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('Supabase signUp failed', { component: 'useAuth', function: 'signUp' }, error);
      } else {
        console.log('Supabase signUp successful, confirmation email sent', { component: 'useAuth', function: 'signUp', metadata: { email } });
      }

      return { error };
    } catch (err) {
      console.error('Unhandled exception in signUp', { component: 'useAuth', function: 'signUp' }, err as Error);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    roleLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};