import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brain, Shield, Zap, Activity, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

import { JusticeHistory } from '@/justice/components/JusticeHistory';
import { JusticeConfirm } from '@/justice/components/JusticeConfirm';
import { useJustice } from '@/justice/useJustice';
import {
  BarChart3,
  Settings,
  Network,
  Database,
  Cpu,
  Lightbulb,
  Heart,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Command } from 'cmdk';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePersonalAI } from '@/hooks/usePersonalAI';
import { JusticeJob } from '@/justice/schema';

interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  databaseLoad: number;
}

interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high';
  activeAttacks: number;
  vulnerabilities: number;
}

interface StabilityMetrics {
  uptime: number;
  errorRate: number;
  responseTimes: number;
}

const AIAdmin = () => {
  const [selectedJob, setSelectedJob] = useState<JusticeJob | null>(null);
  const { 
    jobs, 
    auditLog, 
    loading, 
    loadJobs, 
    loadAuditLog, 
    executeCommand,
    confirmJob,
    cancelJob
  } = useJustice();
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 0,
    databaseLoad: 0,
  });
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    threatLevel: 'low',
    activeAttacks: 0,
    vulnerabilities: 0,
  });
  const [stabilityMetrics, setStabilityMetrics] = useState<StabilityMetrics>({
    uptime: 100,
    errorRate: 0,
    responseTimes: 0,
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { askPersonalAI } = usePersonalAI();

  useEffect(() => {
    // Mock data updates for metrics
    const interval = setInterval(() => {
      setPerformanceMetrics({
        cpuUsage: Math.random() * 80,
        memoryUsage: Math.random() * 70,
        networkLatency: Math.random() * 50,
        databaseLoad: Math.random() * 60,
      });

      setSecurityMetrics({
        threatLevel: Math.random() > 0.7 ? 'high' : (Math.random() > 0.5 ? 'medium' : 'low'),
        activeAttacks: Math.floor(Math.random() * 5),
        vulnerabilities: Math.floor(Math.random() * 3),
      });

      setStabilityMetrics({
        uptime: 99.9 + Math.random() * 0.1,
        errorRate: Math.random() * 0.05,
        responseTimes: Math.random() * 100,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      loadJobs();
      loadAuditLog();
    }
  }, [user, loadJobs, loadAuditLog]);

  const handleExecuteCommand = async (command: any) => {
    setIsExecuting(true);
    try {
      await executeCommand(command);
      toast({
        title: 'Command Executed',
        description: `Successfully executed command: ${command.kind}`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Command Failed',
        description: error.message || 'Failed to execute command.',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleConfirmJob = async (jobId: string) => {
    try {
      await confirmJob(jobId);
      toast({
        title: 'Job Confirmed',
        description: 'The job has been confirmed and will be processed.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Confirmation Failed',
        description: error.message || 'Failed to confirm job.',
      });
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await cancelJob(jobId);
      toast({
        title: 'Job Cancelled',
        description: 'The job has been cancelled successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Cancellation Failed',
        description: error.message || 'Failed to cancel job.',
      });
    }
  };

  const getStatusColor = (status: JusticeJob['status']) => {
    switch (status) {
      case 'queued': return 'text-gray-500';
      case 'running': return 'text-blue-500';
      case 'success': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'cancelled': return 'text-orange-500';
      case 'confirmed': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: JusticeJob['status']) => {
    switch (status) {
      case 'queued': return Clock;
      case 'running': return Activity;
      case 'success': return CheckCircle;
      case 'failed': return AlertTriangle;
      case 'cancelled': return XCircle;
      case 'confirmed': return Shield;
      default: return Brain;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">AI Administration Dashboard</h2>
        <p className="text-muted-foreground">Monitor and manage AI system performance and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-muted/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cpu className="h-4 w-4" /> Performance</CardTitle>
            <CardDescription>Real-time performance metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>CPU Usage</span>
                <Badge variant="secondary">{performanceMetrics.cpuUsage.toFixed(1)}%</Badge>
              </div>
              <Progress value={performanceMetrics.cpuUsage} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Memory Usage</span>
                <Badge variant="secondary">{performanceMetrics.memoryUsage.toFixed(1)}%</Badge>
              </div>
              <Progress value={performanceMetrics.memoryUsage} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Network Latency</span>
                <Badge variant="secondary">{performanceMetrics.networkLatency.toFixed(0)}ms</Badge>
              </div>
              <Progress value={performanceMetrics.networkLatency} max={100} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Database Load</span>
                <Badge variant="secondary">{performanceMetrics.databaseLoad.toFixed(1)}%</Badge>
              </div>
              <Progress value={performanceMetrics.databaseLoad} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" /> Security</CardTitle>
            <CardDescription>Security status and threat levels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Threat Level</span>
                <Badge variant={securityMetrics.threatLevel === 'low' ? 'success' : (securityMetrics.threatLevel === 'medium' ? 'warning' : 'destructive')}>
                  {securityMetrics.threatLevel}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Active Attacks</span>
                <Badge variant="secondary">{securityMetrics.activeAttacks}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Vulnerabilities</span>
                <Badge variant="secondary">{securityMetrics.vulnerabilities}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4" /> Stability</CardTitle>
            <CardDescription>System uptime and error rates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Uptime</span>
                <Badge variant="secondary">{stabilityMetrics.uptime.toFixed(2)}%</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Error Rate</span>
                <Badge variant="secondary">{stabilityMetrics.errorRate.toFixed(2)}%</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Response Times</span>
                <Badge variant="secondary">{stabilityMetrics.responseTimes.toFixed(0)}ms</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="w-full bg-muted/20 backdrop-blur-sm">
          <TabsTrigger value="jobs" className="col">Active Jobs</TabsTrigger>
          <TabsTrigger value="history" className="col">Job History</TabsTrigger>
          <TabsTrigger value="models" className="col">AI Models</TabsTrigger>
          <TabsTrigger value="settings" className="col">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Jobs</CardTitle>
              <CardDescription>List of currently active AI jobs.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertTitle>Loading...</AlertTitle>
                  <AlertDescription>Fetching active jobs.</AlertDescription>
                </Alert>
              ) : jobs.length === 0 ? (
                <Alert>
                  <AlertTitle>No Active Jobs</AlertTitle>
                  <AlertDescription>There are currently no active AI jobs.</AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Command
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jobs.map((job) => (
                        <tr key={job.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{job.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{job.command.kind}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <getStatusIcon status={job.status} className={`h-4 w-4 mr-1 ${getStatusColor(job.status)}`} />
                              <span className={getStatusColor(job.status)}>{job.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(job.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {job.status === 'queued' && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => handleConfirmJob(job.id)}>
                                  Confirm
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleCancelJob(job.id)}>
                                  Cancel
                                </Button>
                              </>
                            )}
                            {job.status !== 'success' && job.status !== 'failed' && job.status !== 'cancelled' && (
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <JusticeHistory />
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Models</CardTitle>
              <CardDescription>Manage and monitor available AI models.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTitle>AI Models Management</AlertTitle>
                <AlertDescription>
                  This section is under development.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure AI system settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTitle>Settings Configuration</AlertTitle>
                <AlertDescription>
                  This section is under development.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <JusticeConfirm 
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};

export default AIAdmin;
