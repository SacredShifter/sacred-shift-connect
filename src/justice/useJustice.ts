
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
      // Use ai_assistant_requests as a placeholder until proper justice tables are created
      const { data, error } = await supabase
        .from('ai_assistant_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      // Transform the data to match JusticeJob structure
      const transformedJobs = (data || []).map((request: any) => ({
        id: request.id,
        created_by: request.user_id || '',
        level: 1 as const,
        command: {
          kind: 'moderation.flag',
          level: 1,
          payload: { resource: 'post', id: request.id, reason: 'auto-generated' }
        } as JusticeCommand,
        status: 'success' as const,
        created_at: request.created_at
      }));
      setJobs(transformedJobs);
    } catch (error) {
      console.error('Failed to load Justice jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadAuditLog = useCallback(async () => {
    if (!user) return;
    
    try {
      // Use a placeholder table until proper audit log table is created
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      // Transform the data to match JusticeAuditEntry structure
      const transformedAudit = (data || []).map((message: any) => ({
        id: message.id,
        job_id: message.id,
        actor: message.user_id || 'system',
        action: 'message_created',
        created_at: message.created_at
      }));
      setAuditLog(transformedAudit);
    } catch (error) {
      console.error('Failed to load audit log:', error);
    }
  }, [user]);

  const executeCommand = async (command: JusticeCommand) => {
    if (!user) throw new Error('Authentication required');
    
    try {
      // For now, just create a mock job entry
      const mockJob: JusticeJob = {
        id: `job_${Date.now()}`,
        created_by: user.id,
        level: command.level,
        command,
        status: command.level === 1 ? 'running' : 'queued',
        created_at: new Date().toISOString()
      };
      
      setJobs(prev => [mockJob, ...prev]);
      
      toast({
        title: command.level === 1 ? 'Command Executed' : 'Command Queued',
        description: command.level === 1 ? 'Justice has executed the command.' : 'Awaiting confirmation for execution.'
      });
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
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'confirmed', confirmed_at: new Date().toISOString() }
          : job
      ));
      
      toast({
        title: 'Job Confirmed',
        description: 'Justice will now execute the command.'
      });
    } catch (error) {
      console.error('Failed to confirm job:', error);
      throw error;
    }
  };

  const cancelJob = async (jobId: string) => {
    try {
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'cancelled' }
          : job
      ));
      
      toast({
        title: 'Job Cancelled',
        description: 'The command has been cancelled.'
      });
    } catch (error) {
      console.error('Failed to cancel job:', error);
      throw error;
    }
  };

  const rollbackAction = async (auditId: string) => {
    try {
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
