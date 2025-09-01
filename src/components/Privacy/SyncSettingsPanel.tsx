import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSyncMode } from '@/hooks/usePrivacyCompliance';
import { syncManager } from '@/lib/offline-storage';
import { 
  Cloud, 
  CloudOff, 
  Wifi, 
  WifiOff, 
  Shield, 
  Database, 
  RefreshCw,
  Lock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const SyncSettingsPanel: React.FC = () => {
  const { syncMode, updateSyncMode } = useSyncMode();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [lastSync, setLastSync] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    if (isOnline) {
      await syncManager.syncPendingData();
      setLastSync(new Date());
    }
  };

  const getSyncModeInfo = (mode: string) => {
    switch (mode) {
      case 'auto':
        return {
          title: 'Auto Sync',
          description: 'Data automatically syncs when online',
          icon: <Cloud className="h-4 w-4" />,
          color: 'text-green-500'
        };
      case 'manual':
        return {
          title: 'Manual Sync',
          description: 'You control when data syncs',
          icon: <RefreshCw className="h-4 w-4" />,
          color: 'text-blue-500'
        };
      case 'local-only':
        return {
          title: 'Local Only',
          description: 'Data never leaves your device',
          icon: <Shield className="h-4 w-4" />,
          color: 'text-purple-500'
        };
      default:
        return {
          title: 'Unknown',
          description: '',
          icon: <Database className="h-4 w-4" />,
          color: 'text-gray-500'
        };
    }
  };

  const currentModeInfo = getSyncModeInfo(syncMode);

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Local-First Data Sovereignty
          </CardTitle>
          <CardDescription>
            Your data is stored locally first, with your choice of cloud sync
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`${currentModeInfo.color}`}>
                {currentModeInfo.icon}
              </div>
              <div>
                <p className="font-medium">{currentModeInfo.title}</p>
                <p className="text-sm text-muted-foreground">{currentModeInfo.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          </div>

          {lastSync && (
            <p className="text-sm text-muted-foreground">
              Last sync: {lastSync.toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sync Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sync Preferences</CardTitle>
          <CardDescription>
            Choose how Sacred Shifter handles your data synchronization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={syncMode} onValueChange={(value: any) => updateSyncMode(value)}>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="auto" id="auto" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="auto" className="text-base font-medium cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-green-500" />
                      Auto Sync (Recommended)
                    </div>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Data is stored locally and automatically synced to the cloud when online. 
                    Best of both worlds - offline access with cloud backup.
                  </p>
                  <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Offline access • Cloud backup • Automatic updates</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="manual" id="manual" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="manual" className="text-base font-medium cursor-pointer">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-blue-500" />
                      Manual Sync
                    </div>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    You decide when to sync data to the cloud. Perfect for metered connections 
                    or when you want full control over data transmission.
                  </p>
                  <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5" />
                    <span>Full control • Data sovereignty • Bandwidth conscious</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg border-purple-200 bg-purple-50/50">
                <RadioGroupItem value="local-only" id="local-only" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="local-only" className="text-base font-medium cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-500" />
                      Local Only (Maximum Privacy)
                    </div>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    All data stays encrypted on your device. Nothing is ever sent to the cloud. 
                    Ultimate privacy and sovereignty over your spiritual journey.
                  </p>
                  <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500 mt-0.5" />
                    <span>Complete privacy • No cloud dependency • Encrypted locally</span>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {syncMode === 'local-only' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Local Only Mode:</strong> Your data will only exist on this device. 
            Make sure to backup your device regularly, as data cannot be recovered if lost.
          </AlertDescription>
        </Alert>
      )}

      {/* Manual Sync Controls */}
      {syncMode === 'manual' && (
        <Card>
          <CardHeader>
            <CardTitle>Manual Sync Controls</CardTitle>
            <CardDescription>
              Sync your data when you're ready
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleManualSync}
              disabled={!isOnline}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {isOnline ? 'Sync Now' : 'Offline - Cannot Sync'}
            </Button>
            
            {!isOnline && (
              <p className="text-sm text-muted-foreground text-center">
                Sync will be available when you're back online
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <Card className="border-muted">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium">Your Data, Your Choice</h4>
              <p className="text-sm text-muted-foreground">
                Sacred Shifter is built with local-first architecture. Your data is encrypted 
                and stored locally first, giving you complete control over synchronization. 
                You can change these settings anytime and your data remains secure.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• All local data is encrypted with AES-256-GCM</p>
                <p>• Cloud sync uses TLS 1.3 encryption in transit</p>
                <p>• You can export or delete all data at any time</p>
                <p>• Compliant with GDPR, CCPA, and Australian Privacy Act</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};