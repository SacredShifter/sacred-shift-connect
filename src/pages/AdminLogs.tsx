import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileSearch, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  XCircle,
  Clock,
  User,
  Activity,
  Database,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  component: string;
  message: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface SystemStats {
  totalLogs: number;
  errorRate: number;
  activeUsers: number;
  systemLoad: number;
  uptime: string;
}

const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [componentFilter, setComponentFilter] = useState<string>('all');
  const [stats, setStats] = useState<SystemStats>({
    totalLogs: 0,
    errorRate: 0,
    activeUsers: 0,
    systemLoad: 0,
    uptime: '0h 0m'
  });

  // Mock data - in real app this would come from Supabase
  useEffect(() => {
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        level: 'info',
        component: 'AuthProvider',
        message: 'User authentication successful',
        userId: 'user123',
        metadata: { loginMethod: 'email', timestamp: Date.now() }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        level: 'error',
        component: 'SacredIntegration',
        message: 'Sacred Integration component failed to render',
        metadata: { error: 'Cannot read properties of undefined (reading \'lov\')', stack: 'Component stack trace...' }
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        level: 'warn',
        component: 'TeachingLayer',
        message: 'Sacred Integration toggle state changed',
        userId: 'user456',
        metadata: { moduleId: 'journal', showSacredIntegration: true }
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        level: 'info',
        component: 'WisdomPathways',
        message: 'Wisdom connections loaded successfully',
        metadata: { connectionsCount: 4, relevantConnections: 2 }
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        level: 'debug',
        component: 'InitiationProgressTracker',
        message: 'User progress updated',
        userId: 'user789',
        metadata: { sessionsCompleted: 5, unlockedTiers: ['scientific', 'metaphysical'] }
      }
    ];

    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
    
    setStats({
      totalLogs: mockLogs.length,
      errorRate: (mockLogs.filter(l => l.level === 'error').length / mockLogs.length) * 100,
      activeUsers: 127,
      systemLoad: 23.4,
      uptime: '72h 34m'
    });
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.component.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (componentFilter !== 'all') {
      filtered = filtered.filter(log => log.component === componentFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter, componentFilter]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      case 'debug': return <Eye className="w-4 h-4 text-gray-400" />;
      default: return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'warn': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'info': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'debug': return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
      default: return 'bg-green-500/20 text-green-300 border-green-400/30';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sacred-shifter-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const uniqueComponents = [...new Set(logs.map(log => log.component))];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
            <FileSearch className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sacred Shifter Admin Logs</h1>
            <p className="text-muted-foreground">System audit trails and consciousness analytics</p>
          </div>
        </div>
        <Button onClick={exportLogs} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold text-blue-300">{stats.totalLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-200/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold text-red-300">{stats.errorRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-green-300">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-200/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-muted-foreground">System Load</p>
                <p className="text-2xl font-bold text-purple-300">{stats.systemLoad}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-200/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold text-indigo-300">{stats.uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Log Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[140px] bg-background/50">
                <SelectValue placeholder="Log Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <Select value={componentFilter} onValueChange={setComponentFilter}>
              <SelectTrigger className="w-[160px] bg-background/50">
                <SelectValue placeholder="Component" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Components</SelectItem>
                {uniqueComponents.map(component => (
                  <SelectItem key={component} value={component}>{component}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>System Logs ({filteredLogs.length} entries)</span>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-background/50 rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getLevelIcon(log.level)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getLevelBadgeColor(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="bg-muted/50">
                          {log.component}
                        </Badge>
                        {log.userId && (
                          <Badge variant="outline" className="bg-muted/50 text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {log.userId.slice(0, 8)}...
                          </Badge>
                        )}
                      </div>
                      <p className="text-foreground font-medium">{log.message}</p>
                      {log.metadata && (
                        <details className="text-xs text-muted-foreground">
                          <summary className="cursor-pointer hover:text-foreground">
                            Metadata ({Object.keys(log.metadata).length} fields)
                          </summary>
                          <pre className="mt-2 p-2 bg-muted/30 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sacred Integration Status */}
      <Card className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-violet-200/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-400" />
            Sacred Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">WisdomPathways</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Component operational</p>
            </div>
            <div className="bg-background/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium">SacredResonanceIndicator</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Rendering error detected</p>
            </div>
            <div className="bg-background/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">InitiationProgressTracker</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Performance monitoring</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogs;