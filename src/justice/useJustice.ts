import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { JusticeJob, JusticeAuditEntry, JusticeCommand } from './schema';

export interface UseJusticeReturn {
  jobs: JusticeJob[];
  auditLog: JusticeAuditEntry[];
  loading: boolean;
  loadJobs: () => Promise<void>;
  loadAuditLog: () => Promise<void>;
  executeCommand: (command: JusticeCommand) => Promise<void>;
  confirmJob: (jobId: string) => Promise<void>;
  cancelJob: (jobId: string) => Promise<void>;
  rollbackAction: (auditId: string) => Promise<void>;
  preferences: any[];
  refusalLog: any[];
  communityFeedback: any[];
  submitRefusalFeedback: (refusalId: string, feedback: any) => Promise<void>;
}

export function useJustice(): UseJusticeReturn {
  const [jobs, setJobs] = useState<JusticeJob[]>([]);
  const [auditLog, setAuditLog] = useState<JusticeAuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [preferences] = useState<any[]>([]);
  const [refusalLog] = useState<any[]>([]);
  const [communityFeedback] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const loadJobs = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('aura_jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setJobs(data as any || []);
    } catch (error) {
      console.error('Failed to load Justice jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadAuditLog = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('aura_audit_log')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAuditLog(data as any || []);
    } catch (error) {
      console.error('Failed to load audit log:', error);
    }
  }, [user]);

  const executeCommand = async (command: JusticeCommand) => {
    if (!user) throw new Error('Authentication required');
    
    try {
      const { data, error } = await supabase
        .from('aura_jobs')
        .insert({
          created_by: user.id,
          level: command.level,
          command: command as any,
          status: command.level === 1 ? 'running' : 'queued'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: command.level === 1 ? 'Command Executed' : 'Command Queued',
        description: command.level === 1 ? 'Justice has executed the command.' : 'Awaiting confirmation for execution.'
      });
      
      await loadJobs();
    } catch (error) {
      console.error('Failed to execute command:', error);
      toast({
        title: 'Execution Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const confirmJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('aura_jobs')
        .update({ 
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', jobId);
      
      if (error) throw error;
      
      toast({
        title: 'Job Confirmed',
        description: 'Justice will now execute the command.'
      });
      
      await loadJobs();
    } catch (error) {
      console.error('Failed to confirm job:', error);
      throw error;
    }
  };

  const cancelJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('aura_jobs')
        .update({ status: 'cancelled' })
        .eq('id', jobId);
      
      if (error) throw error;
      
      toast({
        title: 'Job Cancelled',
        description: 'The command has been cancelled.'
      });
      
      await loadJobs();
    } catch (error) {
      console.error('Failed to cancel job:', error);
      throw error;
    }
  };

  const rollbackAction = async (auditId: string) => {
    try {
      // Implementation would depend on the specific action type
      toast({
        title: 'Rollback Initiated',
        description: 'Justice is rolling back the action.'
      });
    } catch (error) {
      console.error('Failed to rollback action:', error);
      throw error;
    }
  };

  const submitRefusalFeedback = async (refusalId: string, feedback: any) => {
    // Implementation for refusal feedback
    try {
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback on Justice\'s decision.'
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  };

  // Load initial data
  useEffect(() => {
    if (user) {
      loadJobs();
      loadAuditLog();
    }
  }, [user, loadJobs, loadAuditLog]);

  return {
    jobs,
    auditLog,
    loading,
    loadJobs,
    loadAuditLog,
    executeCommand,
    confirmJob,
    cancelJob,
    rollbackAction,
    preferences,
    refusalLog,
    communityFeedback,
    submitRefusalFeedback
  };
}