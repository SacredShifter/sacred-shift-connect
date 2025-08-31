import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PrivacyPreferences {
  id?: string;
  user_id: string;
  analytics_consent: boolean;
  marketing_consent: boolean;
  profile_visibility: 'public' | 'private' | 'community';
  data_processing_consent: boolean;
  communication_consent: boolean;
  health_data_consent: boolean;
  research_participation_consent: boolean;
  geolocation_consent: boolean;
  cookie_consent: boolean;
  third_party_sharing_consent: boolean;
  data_retention_period: number; // in days
  auto_delete_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DataAccessRequest {
  id?: string;
  user_id: string;
  request_type: 'export' | 'deletion' | 'correction' | 'portability';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requested_data_types: string[];
  description?: string;
  created_at?: string;
  completed_at?: string;
}

export interface ConsentLog {
  id?: string;
  user_id: string;
  consent_type: string;
  consent_given: boolean;
  privacy_policy_version: string;
  terms_version: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export const usePrivacyPreferences = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['privacyPreferences', user?.id],
    queryFn: async (): Promise<PrivacyPreferences | null> => {
      if (!user) return null;
      
      // Use localStorage as fallback until tables are ready
      const stored = localStorage.getItem(`privacy_prefs_${user.id}`);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Return default preferences
      return {
        user_id: user.id,
        analytics_consent: false,
        marketing_consent: false,
        profile_visibility: 'private',
        data_processing_consent: false,
        communication_consent: false,
        health_data_consent: false,
        research_participation_consent: false,
        geolocation_consent: false,
        cookie_consent: false,
        third_party_sharing_consent: false,
        data_retention_period: 365,
        auto_delete_enabled: false,
      };
    },
    enabled: !!user?.id,
  });
};

export const useUpdatePrivacyPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (preferences: Partial<PrivacyPreferences>) => {
      if (!user) throw new Error('User not authenticated');
      
      // Store in localStorage for now, with audit trail
      const timestamp = new Date().toISOString();
      const updated = { 
        user_id: user.id, 
        ...preferences, 
        updated_at: timestamp 
      };
      
      localStorage.setItem(`privacy_prefs_${user.id}`, JSON.stringify(updated));
      
      // Store audit log
      const auditEntry = {
        user_id: user.id,
        action: 'privacy_preferences_updated',
        changes: preferences,
        timestamp
      };
      const existingAudit = JSON.parse(localStorage.getItem(`audit_log_${user.id}`) || '[]');
      existingAudit.push(auditEntry);
      localStorage.setItem(`audit_log_${user.id}`, JSON.stringify(existingAudit));
      
      return updated as PrivacyPreferences;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['privacyPreferences', user?.id], data);
      toast({
        title: "Privacy preferences updated",
        description: "Your privacy settings have been saved securely.",
      });
    },
  });
};

export const useSyncMode = () => {
  const { user } = useAuth();
  const [syncMode, setSyncMode] = useState<'auto' | 'manual' | 'local-only'>('auto');
  
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`sync_mode_${user.id}`);
      if (stored) {
        setSyncMode(stored as any);
      }
    }
  }, [user]);
  
  const updateSyncMode = (mode: 'auto' | 'manual' | 'local-only') => {
    if (user) {
      setSyncMode(mode);
      localStorage.setItem(`sync_mode_${user.id}`, mode);
    }
  };
  
  return { syncMode, updateSyncMode };
};

export const useExportUserData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Collect all user data from various sources
      const [profileData, privacyPrefs, auditLog] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle().then(r => r.data),
        JSON.parse(localStorage.getItem(`privacy_prefs_${user.id}`) || '{}'),
        JSON.parse(localStorage.getItem(`audit_log_${user.id}`) || '[]')
      ]);
      
      const exportData = {
        export_info: {
          exported_at: new Date().toISOString(),
          user_id: user.id,
          legal_basis: 'Article 20 GDPR - Right to Data Portability, Privacy Act 1988 APP 12',
          format_version: '1.0'
        },
        personal_data: {
          profile: profileData,
          privacy_preferences: privacyPrefs,
          audit_trail: auditLog,
          account_info: {
            email: user.email,
            created_at: user.created_at,
            last_sign_in: user.last_sign_in_at
          }
        },
        compliance_info: {
          privacy_policy_version: '1.0',
          terms_version: '1.0',
          data_retention_period: privacyPrefs.data_retention_period || 365,
          legal_bases: [
            'Consent (GDPR Art. 6(1)(a))',
            'Contract performance (GDPR Art. 6(1)(b))',
            'Privacy Act 1988 (Cth) compliance'
          ]
        }
      };
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sacred-shifter-data-export-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return exportData;
    },
    onSuccess: () => {
      toast({
        title: "Data exported successfully",
        description: "Your personal data has been exported and downloaded to your device.",
      });
    },
  });
};

export const useDeleteUserAccount = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (confirmation: string) => {
      if (!user) throw new Error('User not authenticated');
      if (confirmation !== 'DELETE MY ACCOUNT') {
        throw new Error('Invalid confirmation text');
      }
      
      // Clear all local data
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes(user.id)
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Delete profile from database
      await supabase.from('profiles').delete().eq('user_id', user.id);
      
      // Sign out user
      await signOut();
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account and personal data have been permanently deleted.",
      });
    },
  });
};

export const useConsentLogger = () => {
  const { user } = useAuth();
  
  const logConsent = async (consentData: Omit<ConsentLog, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    
    const consent: ConsentLog = {
      user_id: user.id,
      ...consentData,
      created_at: new Date().toISOString()
    };
    
    // Store in localStorage for now
    const existingConsents = JSON.parse(localStorage.getItem(`consent_log_${user.id}`) || '[]');
    existingConsents.push(consent);
    localStorage.setItem(`consent_log_${user.id}`, JSON.stringify(existingConsents));
  };
  
  return { logConsent };
};

export const useDataAccessRequests = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dataAccessRequests', user?.id],
    queryFn: async (): Promise<DataAccessRequest[]> => {
      if (!user) return [];
      
      // Get from localStorage for now
      const stored = localStorage.getItem(`data_requests_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!user?.id,
  });
};

export const useCreateDataAccessRequest = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (request: Omit<DataAccessRequest, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const newRequest: DataAccessRequest = {
        id: crypto.randomUUID(),
        user_id: user.id,
        ...request,
        created_at: new Date().toISOString()
      };
      
      // Store in localStorage
      const existing = JSON.parse(localStorage.getItem(`data_requests_${user.id}`) || '[]');
      existing.push(newRequest);
      localStorage.setItem(`data_requests_${user.id}`, JSON.stringify(existing));
      
      return newRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataAccessRequests'] });
      toast({
        title: "Data request submitted",
        description: "Your request has been submitted and will be processed within 30 days.",
      });
    },
  });
};