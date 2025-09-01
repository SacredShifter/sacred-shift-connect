import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { PolarityProtocol, ShadowEngineState } from '@/types/gaa-polarity';
import { Moon, Sun, Zap } from 'lucide-react';

interface PolarityControlsProps {
  polarityProtocol: PolarityProtocol;
  shadowEngineState: ShadowEngineState;
  onPolarityChange: (protocol: PolarityProtocol) => void;
  onShadowToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export const PolarityControls: React.FC<PolarityControlsProps> = ({
  polarityProtocol,
  shadowEngineState,
  onPolarityChange,
  onShadowToggle,
  disabled = false
}) => {
  const handleBalanceChange = (value: number[]) => {
    onPolarityChange({
      ...polarityProtocol,
      polarityBalance: value[0]
    });
  };

  const handleLightChannelToggle = (enabled: boolean) => {
    onPolarityChange({
      ...polarityProtocol,
      lightChannel: {
        ...polarityProtocol.lightChannel,
        enabled
      }
    });
  };

  const handleDarkChannelToggle = (enabled: boolean) => {
    onPolarityChange({
      ...polarityProtocol,
      darkChannel: {
        ...polarityProtocol.darkChannel,
        enabled
      }
    });
  };

  const handleLightAmplitude = (value: number[]) => {
    onPolarityChange({
      ...polarityProtocol,
      lightChannel: {
        ...polarityProtocol.lightChannel,
        amplitude: value[0]
      }
    });
  };

  const handleDarkAmplitude = (value: number[]) => {
    onPolarityChange({
      ...polarityProtocol,
      darkChannel: {
        ...polarityProtocol.darkChannel,
        amplitude: value[0]
      }
    });
  };

  const getPolarityLabel = (balance: number) => {
    if (balance < -0.5) return { label: 'Dark Dominant', color: 'bg-purple-500' };
    if (balance > 0.5) return { label: 'Light Dominant', color: 'bg-yellow-500' };
    return { label: 'Balanced', color: 'bg-green-500' };
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'activation': return { label: 'Activation', color: 'bg-red-500' };
      case 'integration': return { label: 'Integration', color: 'bg-blue-500' };
      case 'manifestation': return { label: 'Manifestation', color: 'bg-green-500' };
      case 'dissolution': return { label: 'Dissolution', color: 'bg-purple-500' };
      default: return { label: 'Unknown', color: 'bg-gray-500' };
    }
  };

  const polarityStatus = getPolarityLabel(polarityProtocol.polarityBalance);
  const phaseStatus = getPhaseLabel(shadowEngineState.currentPhase);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Polarity Controls
          <div className="ml-auto flex gap-2">
            <Badge className={polarityStatus.color}>
              {polarityStatus.label}
            </Badge>
            <Badge className={phaseStatus.color}>
              {phaseStatus.label}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shadow Engine Status */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${shadowEngineState.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <div>
              <p className="font-medium">Shadow Engine</p>
              <p className="text-sm text-muted-foreground">
                {shadowEngineState.isActive ? 'Active' : 'Inactive'} • Phase: {shadowEngineState.currentPhase}
              </p>
            </div>
          </div>
          <Switch
            checked={shadowEngineState.isActive}
            onCheckedChange={onShadowToggle}
            disabled={disabled}
          />
        </div>

        {/* Polarity Balance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">Polarity Balance</label>
            <span className="text-sm text-muted-foreground">
              {polarityProtocol.polarityBalance.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Moon className="h-4 w-4 text-purple-500" />
            <Slider
              value={[polarityProtocol.polarityBalance]}
              onValueChange={handleBalanceChange}
              min={-1}
              max={1}
              step={0.01}
              disabled={disabled}
              className="flex-1"
            />
            <Sun className="h-4 w-4 text-yellow-500" />
          </div>
        </div>

        {/* Light Channel */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Light Channel</span>
            </div>
            <Switch
              checked={polarityProtocol.lightChannel.enabled}
              onCheckedChange={handleLightChannelToggle}
              disabled={disabled}
            />
          </div>
          
          {polarityProtocol.lightChannel.enabled && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Amplitude</label>
                <Slider
                  value={[polarityProtocol.lightChannel.amplitude]}
                  onValueChange={handleLightAmplitude}
                  min={0}
                  max={1}
                  step={0.01}
                  disabled={disabled}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {polarityProtocol.lightChannel.amplitude.toFixed(2)}
                </span>
              </div>
              
              <div>
                <label className="text-sm font-medium">Phase</label>
                <div className="mt-2 text-sm text-muted-foreground">
                  {polarityProtocol.lightChannel.phase.toFixed(2)} rad
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Resonance Mode</label>
                <div className="mt-2 text-sm">
                  <Badge variant="outline">{polarityProtocol.lightChannel.resonanceMode}</Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dark Channel */}
        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Dark Channel</span>
            </div>
            <Switch
              checked={polarityProtocol.darkChannel.enabled}
              onCheckedChange={handleDarkChannelToggle}
              disabled={disabled}
            />
          </div>
          
          {polarityProtocol.darkChannel.enabled && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Amplitude</label>
                <Slider
                  value={[polarityProtocol.darkChannel.amplitude]}
                  onValueChange={handleDarkAmplitude}
                  min={0}
                  max={1}
                  step={0.01}
                  disabled={disabled}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {polarityProtocol.darkChannel.amplitude.toFixed(2)}
                </span>
              </div>
              
              <div>
                <label className="text-sm font-medium">Phase</label>
                <div className="mt-2 text-sm text-muted-foreground">
                  {polarityProtocol.darkChannel.phase.toFixed(2)} rad
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Resonance Mode</label>
                <div className="mt-2 text-sm">
                  <Badge variant="outline">{polarityProtocol.darkChannel.resonanceMode}</Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dark Energy Configuration */}
        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Dark Energy Dynamics</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium">Drift Rate</label>
              <p className="text-muted-foreground">{polarityProtocol.darkEnergyDrift.driftRate.toFixed(3)}</p>
            </div>
            <div>
              <label className="font-medium">Expansion Factor</label>
              <p className="text-muted-foreground">{polarityProtocol.darkEnergyDrift.expansionFactor.toFixed(3)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};