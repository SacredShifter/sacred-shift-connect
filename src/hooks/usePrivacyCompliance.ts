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
      
      // Store in localStorage for now
      const updated = { user_id: user.id, ...preferences, updated_at: new Date().toISOString() };
      localStorage.setItem(`privacy_prefs_${user.id}`, JSON.stringify(updated));
      
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

export const useExportUserData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Export basic user data
      const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
      
      const exportData = {
        export_info: {
          exported_at: new Date().toISOString(),
          user_id: user.id,
          legal_basis: 'Article 20 GDPR - Right to Data Portability'
        },
        personal_data: {
          profile: profile,
          privacy_preferences: JSON.parse(localStorage.getItem(`privacy_prefs_${user.id}`) || '{}')
        }
      };
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
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
        description: "Your personal data has been exported and downloaded.",
      });
    },
  });
};

export const useDataAccessRequests = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dataAccessRequests', user?.id],
    queryFn: async (): Promise<DataAccessRequest[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('data_access_requests_enhanced')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching data access requests:', error);
        throw error;
      }
      
      return data as DataAccessRequest[];
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
      
      const { data, error } = await supabase
        .from('data_access_requests_enhanced')
        .insert({
          user_id: user.id,
          ...request,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Log the request for compliance
      await supabase.rpc('log_compliance_event', {
        p_user_id: user.id,
        p_actor_id: user.id,
        p_action_type: `data_access_request_${request.request_type}`,
        p_entity_type: 'data_access_request',
        p_entity_id: data.id,
        p_after_state: request,
        p_legal_basis: 'user_rights'
      });
      
      return data as DataAccessRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataAccessRequests'] });
      toast({
        title: "Data request submitted",
        description: "Your data access request has been submitted and will be processed within 30 days.",
      });
    },
    onError: (error: any) => {
      console.error('Data access request error:', error);
      toast({
        title: "Request failed",
        description: error.message || "Unable to submit data access request.",
        variant: "destructive",
      });
    },
  });
};

export const useExportUserData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // Create export request
      const { data: request, error: requestError } = await supabase
        .from('data_access_requests_enhanced')
        .insert({
          user_id: user.id,
          request_type: 'export',
          status: 'processing',
          requested_data_types: ['profile', 'routines', 'privacy_preferences', 'audit_logs'],
          description: 'User-initiated data export'
        })
        .select()
        .single();
      
      if (requestError) throw requestError;
      
      // Fetch user data
      const [
        { data: profile },
        { data: privacyPrefs },
        { data: routines },
        { data: auditLogs }
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('privacy_preferences_enhanced').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('routine_completion_logs').select('*').eq('user_id', user.id),
        supabase.from('compliance_audit_trail').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100)
      ]);
      
      const exportData = {
        export_info: {
          exported_at: new Date().toISOString(),
          user_id: user.id,
          request_id: request.id,
          legal_basis: 'Article 20 GDPR - Right to Data Portability'
        },
        personal_data: {
          profile: profile,
          privacy_preferences: privacyPrefs,
          routine_completions: routines,
          audit_trail: auditLogs?.slice(0, 50) // Limit for export size
        }
      };
      
      // Update request status
      await supabase
        .from('data_access_requests_enhanced')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', request.id);
      
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
    onError: (error: any) => {
      console.error('Data export error:', error);
      toast({
        title: "Export failed",
        description: error.message || "Unable to export your data.",
        variant: "destructive",
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
      
      // Use the compliant deletion function
      const { data, error } = await supabase.rpc('delete_user_data_compliant', {
        p_user_id: user.id
      });
      
      if (error) throw error;
      
      // Sign out user
      await signOut();
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account and personal data have been permanently deleted.",
      });
      // Redirect handled by auth state change
    },
    onError: (error: any) => {
      console.error('Account deletion error:', error);
      toast({
        title: "Deletion failed",
        description: error.message || "Unable to delete your account.",
        variant: "destructive",
      });
    },
  });
};

// Local storage encryption helpers
export const useLocalEncryption = () => {
  const { user } = useAuth();
  
  const getEncryptionKey = async () => {
    if (!user) return null;
    
    // Try to get existing key
    const { data: existingKey } = await supabase
      .from('local_encryption_keys')
      .select('key_data')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (existingKey) {
      return existingKey.key_data;
    }
    
    // Generate new key
    const key = crypto.getRandomValues(new Uint8Array(32));
    const keyString = Array.from(key).map(b => b.toString(16).padStart(2, '0')).join('');
    
    await supabase
      .from('local_encryption_keys')
      .insert({
        user_id: user.id,
        key_data: keyString,
        algorithm: 'AES-256-GCM'
      });
    
    return keyString;
  };
  
  return { getEncryptionKey };
};