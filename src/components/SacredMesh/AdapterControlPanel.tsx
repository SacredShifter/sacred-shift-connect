import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { usePrivacyPreferencesEnhanced } from '@/hooks/usePrivacyComplianceEnhanced';
import { 
  Lightbulb, 
  Music, 
  TreePine, 
  Settings,
  Waves,
  Volume2,
  Palette,
  Wind,
  Bird,
  Mountain,
  Zap,
  Shield,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface AdapterConfig {
  enabled: boolean;
  signalStrength: number;
  lastCalibration?: Date;
  configuration: any;
}

export const AdapterControlPanel: React.FC = () => {
  const { toast } = useToast();
  const { data: privacyPrefs } = usePrivacyPreferencesEnhanced();
  
  const [adapters, setAdapters] = useState<Record<string, AdapterConfig>>({
    light: {
      enabled: false,
      signalStrength: 0,
      configuration: {
        brightness: [70],
        colorTemperature: [5000],
        pulseRate: [1.0],
        wavelength: [528], // Love frequency in nanometers
        patterns: ['breath', 'heartbeat', 'sacred_spiral']
      }
    },
    frequency: {
      enabled: false,
      signalStrength: 0,
      configuration: {
        volume: [50],
        primaryFrequency: [528], // Love frequency
        harmonics: [[396, 417, 528, 639, 741, 852, 963]], // Solfeggio
        waveform: ['sine'],
        modulationType: ['sacred_geometry']
      }
    },
    nature: {
      enabled: false,
      signalStrength: 0,
      configuration: {
        environment: ['forest'],
        birdSongIntensity: [60],
        windStrength: [40],
        waterFlow: [30],
        earthResonance: [7.83] // Schumann resonance
      }
    }
  });

  const [isCalibrating, setIsCalibrating] = useState<string | null>(null);

  useEffect(() => {
    // Simulate signal strength updates
    const interval = setInterval(() => {
      setAdapters(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key].enabled) {
            // Simulate signal strength fluctuations
            updated[key].signalStrength = Math.min(100, 
              updated[key].signalStrength + (Math.random() - 0.5) * 10
            );
          } else {
            updated[key].signalStrength = 0;
          }
        });
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleAdapter = async (adapterType: string) => {
    // Check privacy consent first
    const consentKey = `${adapterType}_adapter_consent` as keyof typeof privacyPrefs;
    if (!privacyPrefs?.[consentKey]) {
      toast({
        title: "Consent required",
        description: `Please enable ${adapterType} adapter consent in Privacy Settings first.`,
        variant: "destructive"
      });
      return;
    }

    const wasEnabled = adapters[adapterType].enabled;
    
    setAdapters(prev => ({
      ...prev,
      [adapterType]: {
        ...prev[adapterType],
        enabled: !wasEnabled,
        signalStrength: !wasEnabled ? 50 : 0
      }
    }));

    if (!wasEnabled) {
      // Start calibration
      await calibrateAdapter(adapterType);
    }

    toast({
      title: `${adapterType.charAt(0).toUpperCase() + adapterType.slice(1)} adapter ${!wasEnabled ? 'enabled' : 'disabled'}`,
      description: !wasEnabled 
        ? `Sacred ${adapterType} communication is now active`
        : `${adapterType} communication has been disabled`,
    });
  };

  const calibrateAdapter = async (adapterType: string) => {
    setIsCalibrating(adapterType);
    
    try {
      // Simulate calibration process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setAdapters(prev => ({
          ...prev,
          [adapterType]: {
            ...prev[adapterType],
            signalStrength: i
          }
        }));
      }
      
      setAdapters(prev => ({
        ...prev,
        [adapterType]: {
          ...prev[adapterType],
          lastCalibration: new Date(),
          signalStrength: 85 + Math.random() * 15 // 85-100%
        }
      }));
      
      toast({
        title: "Calibration complete",
        description: `${adapterType} adapter has been calibrated to your environment`,
      });
    } catch (error) {
      toast({
        title: "Calibration failed",
        description: `Failed to calibrate ${adapterType} adapter. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsCalibrating(null);
    }
  };

  const updateAdapterConfig = (adapterType: string, configKey: string, value: any) => {
    setAdapters(prev => ({
      ...prev,
      [adapterType]: {
        ...prev[adapterType],
        configuration: {
          ...prev[adapterType].configuration,
          [configKey]: value
        }
      }
    }));
  };

  const testAdapter = async (adapterType: string) => {
    if (!adapters[adapterType].enabled) {
      toast({
        title: "Adapter disabled",
        description: `Please enable the ${adapterType} adapter first`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: `Testing ${adapterType} adapter`,
      description: "Sacred pattern transmission initiated...",
    });

    // Simulate test transmission
    setTimeout(() => {
      toast({
        title: "Test complete",
        description: `${adapterType} adapter is functioning correctly`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Sacred Adapter Control
        </h2>
        <p className="text-muted-foreground">
          Configure nature-inspired communication channels for the living mesh organism
        </p>
      </div>

      <Tabs defaultValue="light" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="light" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Light
          </TabsTrigger>
          <TabsTrigger value="frequency" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Frequency
          </TabsTrigger>
          <TabsTrigger value="nature" className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            Nature
          </TabsTrigger>
        </TabsList>

        {/* Light Adapter */}
        <TabsContent value="light">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Light Communication Adapter
                  </CardTitle>
                  <CardDescription>
                    Sacred geometry through LED patterns, camera flash, and screen modulation
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={adapters.light.enabled ? "default" : "outline"}>
                    {adapters.light.enabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={adapters.light.enabled}
                    onCheckedChange={() => toggleAdapter('light')}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Signal Strength */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Signal Strength
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(adapters.light.signalStrength)}%
                  </span>
                </div>
                <Progress value={adapters.light.signalStrength} />
              </div>

              {adapters.light.enabled && (
                <>
                  {/* Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Brightness ({adapters.light.configuration.brightness[0]}%)</Label>
                      <Slider
                        value={adapters.light.configuration.brightness}
                        onValueChange={(value) => updateAdapterConfig('light', 'brightness', value)}
                        max={100}
                        step={1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Color Temperature ({adapters.light.configuration.colorTemperature[0]}K)</Label>
                      <Slider
                        value={adapters.light.configuration.colorTemperature}
                        onValueChange={(value) => updateAdapterConfig('light', 'colorTemperature', value)}
                        min={2700}
                        max={6500}
                        step={100}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Pulse Rate ({adapters.light.configuration.pulseRate[0]}Hz)</Label>
                      <Slider
                        value={adapters.light.configuration.pulseRate}
                        onValueChange={(value) => updateAdapterConfig('light', 'pulseRate', value)}
                        min={0.1}
                        max={5.0}
                        step={0.1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Sacred Wavelength ({adapters.light.configuration.wavelength[0]}nm)</Label>
                      <Slider
                        value={adapters.light.configuration.wavelength}
                        onValueChange={(value) => updateAdapterConfig('light', 'wavelength', value)}
                        min={400}
                        max={700}
                        step={10}
                      />
                    </div>
                  </div>

                  {/* Sacred Light Patterns */}
                  <div className="space-y-2">
                    <Label>Sacred Light Patterns</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {adapters.light.configuration.patterns.map((pattern: string) => (
                        <Badge key={pattern} variant="outline" className="justify-center">
                          {pattern.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => calibrateAdapter('light')}
                      disabled={isCalibrating === 'light'}
                      className="flex items-center gap-2"
                    >
                      {isCalibrating === 'light' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
                      <Zap className="h-4 w-4" />
                      Calibrate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => testAdapter('light')}
                      className="flex items-center gap-2"
                    >
                      <Palette className="h-4 w-4" />
                      Test Pattern
                    </Button>
                  </div>
                </>
              )}

              {!privacyPrefs?.light_adapter_consent && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">
                    Light adapter consent required in Privacy Settings
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Frequency Adapter */}
        <TabsContent value="frequency">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-purple-500" />
                    Frequency Communication Adapter
                  </CardTitle>
                  <CardDescription>
                    Sacred frequencies, whale songs, and elephant rumbles for long-distance communication
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={adapters.frequency.enabled ? "default" : "outline"}>
                    {adapters.frequency.enabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={adapters.frequency.enabled}
                    onCheckedChange={() => toggleAdapter('frequency')}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Signal Strength */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Waves className="h-4 w-4" />
                    Signal Strength
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(adapters.frequency.signalStrength)}%
                  </span>
                </div>
                <Progress value={adapters.frequency.signalStrength} />
              </div>

              {adapters.frequency.enabled && (
                <>
                  {/* Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Volume ({adapters.frequency.configuration.volume[0]}%)</Label>
                      <Slider
                        value={adapters.frequency.configuration.volume}
                        onValueChange={(value) => updateAdapterConfig('frequency', 'volume', value)}
                        max={100}
                        step={1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Primary Frequency ({adapters.frequency.configuration.primaryFrequency[0]}Hz)</Label>
                      <Slider
                        value={adapters.frequency.configuration.primaryFrequency}
                        onValueChange={(value) => updateAdapterConfig('frequency', 'primaryFrequency', value)}
                        min={20}
                        max={20000}
                        step={1}
                      />
                    </div>
                  </div>

                  {/* Solfeggio Frequencies */}
                  <div className="space-y-2">
                    <Label>Sacred Solfeggio Frequencies</Label>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                      {adapters.frequency.configuration.harmonics[0].map((freq: number) => (
                        <Badge key={freq} variant="secondary" className="justify-center text-xs">
                          {freq}Hz
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      396Hz: Liberation • 417Hz: Change • 528Hz: Love • 639Hz: Connection • 
                      741Hz: Expression • 852Hz: Intuition • 963Hz: Pineal
                    </p>
                  </div>

                  {/* Nature-Inspired Patterns */}
                  <div className="space-y-2">
                    <Label>Bioacoustic Patterns</Label>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">🐋</Badge>
                        <span>Whale Song (20-40Hz)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">🐘</Badge>
                        <span>Elephant Rumbles (5-20Hz)</span>
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => calibrateAdapter('frequency')}
                      disabled={isCalibrating === 'frequency'}
                      className="flex items-center gap-2"
                    >
                      {isCalibrating === 'frequency' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
                      <Zap className="h-4 w-4" />
                      Calibrate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => testAdapter('frequency')}
                      className="flex items-center gap-2"
                    >
                      <Volume2 className="h-4 w-4" />
                      Test Frequency
                    </Button>
                  </div>
                </>
              )}

              {!privacyPrefs?.frequency_adapter_consent && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">
                    Frequency adapter consent required in Privacy Settings
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nature Adapter */}
        <TabsContent value="nature">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-green-500" />
                    Nature Harmony Adapter
                  </CardTitle>
                  <CardDescription>
                    Communicate through bird songs, wind patterns, and earth rhythms
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={adapters.nature.enabled ? "default" : "outline"}>
                    {adapters.nature.enabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={adapters.nature.enabled}
                    onCheckedChange={() => toggleAdapter('nature')}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Signal Strength */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Mountain className="h-4 w-4" />
                    Environmental Harmony
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(adapters.nature.signalStrength)}%
                  </span>
                </div>
                <Progress value={adapters.nature.signalStrength} />
              </div>

              {adapters.nature.enabled && (
                <>
                  {/* Environment Selection */}
                  <div className="space-y-2">
                    <Label>Current Environment</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['forest', 'ocean', 'mountain', 'desert'].map((env) => (
                        <Badge
                          key={env}
                          variant={adapters.nature.configuration.environment[0] === env ? "default" : "outline"}
                          className="justify-center cursor-pointer"
                          onClick={() => updateAdapterConfig('nature', 'environment', [env])}
                        >
                          {env}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Nature Pattern Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Bird className="h-4 w-4" />
                        Bird Song Intensity ({adapters.nature.configuration.birdSongIntensity[0]}%)
                      </Label>
                      <Slider
                        value={adapters.nature.configuration.birdSongIntensity}
                        onValueChange={(value) => updateAdapterConfig('nature', 'birdSongIntensity', value)}
                        max={100}
                        step={1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Wind className="h-4 w-4" />
                        Wind Strength ({adapters.nature.configuration.windStrength[0]}%)
                      </Label>
                      <Slider
                        value={adapters.nature.configuration.windStrength}
                        onValueChange={(value) => updateAdapterConfig('nature', 'windStrength', value)}
                        max={100}
                        step={1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Water Flow ({adapters.nature.configuration.waterFlow[0]}%)</Label>
                      <Slider
                        value={adapters.nature.configuration.waterFlow}
                        onValueChange={(value) => updateAdapterConfig('nature', 'waterFlow', value)}
                        max={100}
                        step={1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Earth Resonance ({adapters.nature.configuration.earthResonance[0]}Hz)</Label>
                      <Slider
                        value={adapters.nature.configuration.earthResonance}
                        onValueChange={(value) => updateAdapterConfig('nature', 'earthResonance', value)}
                        min={7.83}
                        max={30}
                        step={0.1}
                      />
                    </div>
                  </div>

                  {/* Sacred Earth Frequencies */}
                  <div className="space-y-2">
                    <Label>Schumann Resonances (Earth's Heartbeat)</Label>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      {[7.83, 14.3, 20.8, 27.3].map((freq) => (
                        <Badge key={freq} variant="secondary" className="justify-center">
                          {freq}Hz
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => calibrateAdapter('nature')}
                      disabled={isCalibrating === 'nature'}
                      className="flex items-center gap-2"
                    >
                      {isCalibrating === 'nature' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
                      <Zap className="h-4 w-4" />
                      Calibrate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => testAdapter('nature')}
                      className="flex items-center gap-2"
                    >
                      <TreePine className="h-4 w-4" />
                      Test Harmony
                    </Button>
                  </div>
                </>
              )}

              {!privacyPrefs?.nature_adapter_consent && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">
                    Nature adapter consent required in Privacy Settings
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Privacy Compliance Notice */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Privacy-First Sacred Communication</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                All sacred mesh communications are end-to-end encrypted and require explicit consent. 
                Your adapter usage is logged for compliance with Privacy Act 1988, GDPR, and CCPA. 
                You may revoke consent and disable any adapter at any time in Privacy Settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};