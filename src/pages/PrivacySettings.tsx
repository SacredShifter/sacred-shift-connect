import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Download, 
  Smartphone,
  Wifi,
  WifiOff,
  Settings as SettingsIcon,
  Eye,
  Database,
  Globe,
  ArrowLeft,
  Zap
} from 'lucide-react';

// Import existing privacy components
import { DataManagementPanel } from '@/components/Privacy/DataManagementPanel';
import { SyncSettingsPanel } from '@/components/Privacy/SyncSettingsPanel';
import { PrivacyConsentFlow } from '@/components/Privacy/PrivacyConsentFlow';

// Import privacy hooks
import { usePrivacyPreferencesEnhanced } from '@/hooks/usePrivacyComplianceEnhanced';
import { useSacredMeshSeeds } from '@/hooks/useSacredMeshSeeds';
import { useUnifiedMessaging } from '@/hooks/useUnifiedMessaging';

export const PrivacySettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Load privacy preferences
  const { data: privacyPrefs, isLoading } = usePrivacyPreferencesEnhanced();
  
  // Load Sacred Mesh data
  const { data: meshSeeds } = useSacredMeshSeeds();
  
  // Unified messaging status
  const { connectionStatus, loading: messagingLoading } = useUnifiedMessaging({ autoConnect: false });

  const handlePWAInstall = () => {
    // Check if PWA install prompt is available
    if ('serviceWorker' in navigator) {
      // PWA installation logic
      const installPrompt = (window as any).deferredPrompt;
      if (installPrompt) {
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the PWA install prompt');
          }
        });
      } else {
        // Show instructions for manual install
        alert('To install Sacred Shifter as a PWA:\n\n' +
              'Chrome/Edge: Click the install icon in the address bar\n' +
              'Safari: Tap Share → Add to Home Screen\n' +
              'Firefox: Use the menu → Install');
      }
    }
  };

  const getConnectionStatusBadge = () => {
    if (connectionStatus?.database && connectionStatus?.mesh?.initialized) {
      return <Badge className="bg-green-100 text-green-800"><Wifi className="h-3 w-3 mr-1" />Connected</Badge>;
    } else if (connectionStatus?.database && !connectionStatus?.mesh?.initialized) {
      return <Badge className="bg-yellow-100 text-yellow-800"><Zap className="h-3 w-3 mr-1" />Database Only</Badge>;
    } else if (!connectionStatus?.database) {
      return <Badge className="bg-gray-100 text-gray-800"><WifiOff className="h-3 w-3 mr-1" />Offline</Badge>;
    } else {
      return <Badge variant="outline">Connecting</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                Privacy & Data Control
              </h1>
              <p className="text-xl text-muted-foreground">
                Complete control over your sacred data and communication channels
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {getConnectionStatusBadge()}
              <Badge variant="outline">Mesh Seeds: {meshSeeds?.length || 0}</Badge>
              <Badge variant="outline">Local-First Ready</Badge>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('sync')}>
            <CardContent className="p-4 text-center">
              <Database className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold">Sync Settings</h3>
              <p className="text-xs text-muted-foreground">Local, Manual, or Cloud</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('communication')}>
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold">Sacred Mesh</h3>
              <p className="text-xs text-muted-foreground">Nature Communication</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handlePWAInstall}>
            <CardContent className="p-4 text-center">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold">Install PWA</h3>
              <p className="text-xs text-muted-foreground">Offline Mobile App</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('data-rights')}>
            <CardContent className="p-4 text-center">
              <Download className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-semibold">Export Data</h3>
              <p className="text-xs text-muted-foreground">Download & Delete</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consent">Consent</TabsTrigger>
            <TabsTrigger value="sync">Sync</TabsTrigger>
            <TabsTrigger value="communication">Sacred Mesh</TabsTrigger>
            <TabsTrigger value="data-rights">Data Rights</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Privacy Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Data Storage</h4>
                    <p className="text-sm text-muted-foreground">
                      {privacyPrefs?.auto_delete_enabled ? 'Auto-cleanup enabled' : 'Standard retention'}
                    </p>
                    <Badge variant={privacyPrefs?.auto_delete_enabled ? 'default' : 'secondary'}>
                      {privacyPrefs?.data_retention_period || 365} days
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Communication</h4>
                    <p className="text-sm text-muted-foreground">
                      Sacred Mesh {privacyPrefs?.mesh_communication_consent ? 'enabled' : 'disabled'}
                    </p>
                    <Badge variant={privacyPrefs?.mesh_communication_consent ? 'default' : 'secondary'}>
                      {privacyPrefs?.mesh_communication_consent ? 'Active' : 'Offline'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Profile</h4>
                    <p className="text-sm text-muted-foreground">
                      Visibility: {privacyPrefs?.profile_visibility || 'private'}
                    </p>
                    <Badge variant={privacyPrefs?.profile_visibility === 'public' ? 'default' : 'secondary'}>
                      {privacyPrefs?.profile_visibility || 'Private'}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-semibold">Nature Adapters Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${privacyPrefs?.light_adapter_consent ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs">Light</span>
                    </div>
                    <div className="text-center">
                      <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${privacyPrefs?.frequency_adapter_consent ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs">Frequency</span>
                    </div>
                    <div className="text-center">
                      <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${privacyPrefs?.nature_adapter_consent ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs">Nature</span>
                    </div>
                    <div className="text-center">
                      <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${connectionStatus?.database ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs">Database</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consent" className="space-y-6">
            <PrivacyConsentFlow 
              onComplete={(preferences) => {
                console.log('Privacy preferences updated:', preferences);
              }} 
            />
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <SyncSettingsPanel />
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  Sacred Mesh Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                      <Zap className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Nature-Inspired Communication Network</h3>
                    <p className="text-muted-foreground">
                      Connect with other Sacred Shifters through light, sound, and quantum patterns.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Active Seeds</h4>
                      <div className="space-y-2">
                        {meshSeeds?.slice(0, 3).map((seed: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-mono">{seed.identity_key_public?.slice(0, 8)}...</span>
                            <Badge variant="outline" className="text-xs">
                              {seed.transport_capabilities?.join(', ') || 'Nature'}
                            </Badge>
                          </div>
                        )) || (
                          <p className="text-sm text-muted-foreground">No mesh seeds created yet.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Connection Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Overall Status:</span>
                          {getConnectionStatusBadge()}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Database:</span>
                          <Badge variant={connectionStatus?.database ? 'default' : 'secondary'}>
                            {connectionStatus?.database ? 'Online' : 'Offline'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Sacred Mesh:</span>
                          <Badge variant={connectionStatus?.mesh?.initialized ? 'default' : 'secondary'}>
                            {connectionStatus?.mesh?.initialized ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/settings')}
                      className="flex-1"
                    >
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Manage Mesh Seeds
                    </Button>
                    <Button 
                      onClick={() => console.log('Test mesh communication')}
                      className="flex-1"
                    >
                      Test Communication
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-rights" className="space-y-6">
            <DataManagementPanel />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Advanced Privacy Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Local Storage Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                    >
                      Clear All Local Data
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const data = {
                          privacy: localStorage.getItem('privacy_prefs_enhanced_' + privacyPrefs?.user_id),
                          mesh: localStorage.getItem('sacred_mesh_seeds_' + privacyPrefs?.user_id),
                          timestamp: new Date().toISOString()
                        };
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'sacred-shifter-local-backup.json';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Backup Local Data
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Compliance Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium">Applicable Laws:</h5>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>GDPR (European Union)</li>
                        <li>CCPA (California)</li>
                        <li>Privacy Act 1988 (Australia)</li>
                        <li>PIPEDA (Canada)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium">Your Rights:</h5>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Access your data</li>
                        <li>Correct inaccuracies</li>
                        <li>Delete personal information</li>
                        <li>Data portability</li>
                        <li>Opt-out of processing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};