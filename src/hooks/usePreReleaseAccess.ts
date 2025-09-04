import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface PreReleaseStatus {
  hasAccess: boolean;
  loading: boolean;
  portalOpen: boolean;
}

export const usePreReleaseAccess = (): PreReleaseStatus => {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Portal opens on 09/09/2025 at 9:09 AM AEST
  const portalDate = new Date('2025-09-09T09:09:00+10:00');
  const portalOpen = new Date() >= portalDate;

  useEffect(() => {
    const checkPreReleaseAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('pre_release_access')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking pre-release access:', error);
          setHasAccess(false);
        } else {
          setHasAccess(data?.pre_release_access === true);
        }
      } catch (error) {
        console.error('Error checking pre-release access:', error);
        setHasAccess(false);
      }

      setLoading(false);
    };

    checkPreReleaseAccess();
  }, [user]);

  return {
    hasAccess,
    loading,
    portalOpen
  };
};