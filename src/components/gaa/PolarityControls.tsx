/**
 * Polarity Controls - Shadow Engine Interface
 * Advanced controls for polarity protocol, shadow work, and dark energy
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Moon, 
  Sun, 
  Zap, 
  Activity, 
  Shield, 
  AlertTriangle,
  Waves,
  Eye,
  BarChart3
} from 'lucide-react';
import { PolarityProtocol, ShadowEngineState } from '@/types/gaa-polarity';

interface PolarityControlsProps {
  polarityProtocol: PolarityProtocol;
  shadowEngineState: ShadowEngineState;
  onPolarityChange: (protocol: PolarityProtocol) => void;
  onShadowToggle: (enabled: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const PolarityControls: React.FC<PolarityControlsProps> = ({
  polarityProtocol,
  shadowEngineState,
  onPolarityChange,
  onShadowToggle,
  disabled = false,
  className = ""
}) => {
  const handlePolarityBalanceChange = (value: number[]) => {
    onPolarityChange({
      ...polarityProtocol,
      polarityBalance: value[0]
    });
  };

  const handleLightChannelChange = (field: string, value: any) => {
    onPolarityChange({
      ...polarityProtocol,
      lightChannel: {
        ...polarityProtocol.lightChannel,
        [field]: value
      }
    });
  };

  const handleDarkChannelChange = (field: string, value: any) => {
    onPolarityChange({
      ...polarityProtocol,
      darkChannel: {
        ...polarityProtocol.darkChannel,
        [field]: value
      }
    });
  };

  const handleDarkEnergyChange = (field: string, value: any) => {
    onPolarityChange({
      ...polarityProtocol,
      darkEnergyDrift: {
        ...polarityProtocol.darkEnergyDrift,
        [field]: value
      }
    });
  };

  const getPolarityModeLabel = (balance: number) => {
    if (balance < -0.3) return "Dark Dominance";
    if (balance > 0.3) return "Light Dominance";
    return "Balanced";
  };

  const getPolarityColor = (balance: number) => {
    if (balance < -0.3) return "hsl(var(--destructive))";
    if (balance > 0.3) return "hsl(var(--warning))";
    return "hsl(var(--primary))";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Polarity Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Sun className="h-5 w-5 text-amber-500" />
              <Moon className="h-3 w-3 text-slate-400 absolute -bottom-1 -right-1" />
            </div>
            Polarity Protocol
            <Badge 
              variant="outline" 
              style={{ borderColor: getPolarityColor(polarityProtocol.polarityBalance) }}
            >
              {getPolarityModeLabel(polarityProtocol.polarityBalance)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Master Polarity Balance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Polarity Balance
              </Label>
              <span className="text-sm font-mono">
                {polarityProtocol.polarityBalance.toFixed(2)}
              </span>
            </div>
            <div className="relative">
              <Slider
                value={[polarityProtocol.polarityBalance]}
                onValueChange={handlePolarityBalanceChange}
                min={-1}
                max={1}
                step={0.01}
                disabled={disabled}
                className="polarity-slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Dark (-1)</span>
                <span>Neutral (0)</span>
                <span>Light (+1)</span>
              </div>
            </div>
          </div>

          {/* Cross-Polarization & Manifest in Dark */}
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="cross-polarization"
                checked={polarityProtocol.crossPolarizationEnabled}
                onCheckedChange={(checked) => 
                  onPolarityChange({
                    ...polarityProtocol,
                    crossPolarizationEnabled: checked
                  })
                }
                disabled={disabled}
              />
              <Label htmlFor="cross-polarization" className="text-sm">
                Cross-Polarization
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="manifest-dark"
                checked={polarityProtocol.manifestInDark}
                onCheckedChange={(checked) => 
                  onPolarityChange({
                    ...polarityProtocol,
                    manifestInDark: checked
                  })
                }
                disabled={disabled}
              />
              <Label htmlFor="manifest-dark" className="text-sm">
                Manifest in Dark
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Light Channel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" />
            Light Channel
            <Switch
              checked={polarityProtocol.lightChannel.enabled}
              onCheckedChange={(checked) => handleLightChannelChange('enabled', checked)}
              disabled={disabled}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amplitude</Label>
              <Slider
                value={[polarityProtocol.lightChannel.amplitude]}
                onValueChange={(value) => handleLightChannelChange('amplitude', value[0])}
                min={0}
                max={1}
                step={0.01}
                disabled={disabled || !polarityProtocol.lightChannel.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Phase</Label>
              <Slider
                value={[polarityProtocol.lightChannel.phase]}
                onValueChange={(value) => handleLightChannelChange('phase', value[0])}
                min={0}
                max={Math.PI * 2}
                step={0.01}
                disabled={disabled || !polarityProtocol.lightChannel.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Subharmonic Depth</Label>
              <Slider
                value={[polarityProtocol.lightChannel.subharmonicDepth]}
                onValueChange={(value) => handleLightChannelChange('subharmonicDepth', value[0])}
                min={0}
                max={1}
                step={0.01}
                disabled={disabled || !polarityProtocol.lightChannel.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Textural Complexity</Label>
              <Slider
                value={[polarityProtocol.lightChannel.texturalComplexity]}
                onValueChange={(value) => handleLightChannelChange('texturalComplexity', value[0])}
                min={0}
                max={1}
                step={0.01}
                disabled={disabled || !polarityProtocol.lightChannel.enabled}
              />
            </div>
          </div>
          
          <Badge variant="outline">
            {polarityProtocol.lightChannel.resonanceMode}
          </Badge>
        </CardContent>
      </Card>

      {/* Dark Channel */}
      <Card className="border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-slate-400" />
            Dark Channel
            <Switch
              checked={polarityProtocol.darkChannel.enabled}
              onCheckedChange={(checked) => handleDarkChannelChange('enabled', checked)}
              disabled={disabled}
            />
            {polarityProtocol.darkChannel.enabled && (
              <Badge variant="secondary" className="ml-auto">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Shadow Mode
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amplitude</Label>
              <Slider
                value={[polarityProtocol.darkChannel.amplitude]}
                onValueChange={(value) => handleDarkChannelChange('amplitude', value[0])}
                min={0}
                max={1}
                step={0.01}
                disabled={disabled || !polarityProtocol.darkChannel.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Phase</Label>
              <Slider
                value={[polarityProtocol.darkChannel.phase]}
                onValueChange={(value) => handleDarkChannelChange('phase', value[0])}
                min={0}
                max={Math.PI * 2}
                step={0.01}
                disabled={disabled || !polarityProtocol.darkChannel.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Subharmonic Depth</Label>
              <Slider
                value={[polarityProtocol.darkChannel.subharmonicDepth]}
                onValueChange={(value) => handleDarkChannelChange('subharmonicDepth', value[0])}
                min={0}
                max={1}
                step={0.01}
                disabled={disabled || !polarityProtocol.darkChannel.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Textural Complexity</Label>
              <Slider
                value={[polarityProtocol.darkChannel.texturalComplexity]}
                onValueChange={(value) => handleDarkChannelChange('texturalComplexity', value[0])}
                min={0}
                max={1}
                step={0.01}
                disabled={disabled || !polarityProtocol.darkChannel.enabled}
              />
            </div>
          </div>
          
          <Badge variant="outline">
            {polarityProtocol.darkChannel.resonanceMode}
          </Badge>
        </CardContent>
      </Card>

      {/* Dark Energy Configuration */}
      <Card className="border-purple-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-purple-400" />
            Dark Energy Drift
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Drift Rate (Hz/sec)</Label>
              <Slider
                value={[polarityProtocol.darkEnergyDrift.driftRate * 1000]} // Scale for UI
                onValueChange={(value) => handleDarkEnergyChange('driftRate', value[0] / 1000)}
                min={0}
                max={10}
                step={0.1}
                disabled={disabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Expansion Factor</Label>
              <Slider
                value={[polarityProtocol.darkEnergyDrift.expansionFactor]}
                onValueChange={(value) => handleDarkEnergyChange('expansionFactor', value[0])}
                min={0.5}
                max={2}
                step={0.01}
                disabled={disabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Quantum Fluctuation</Label>
              <Slider
                value={[polarityProtocol.darkEnergyDrift.quantumFluctuation]}
                onValueChange={(value) => handleDarkEnergyChange('quantumFluctuation', value[0])}
                min={0}
                max={1}
                step={0.01}
                disabled={disabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Dark Matter Density</Label>
              <Slider
                value={[polarityProtocol.darkEnergyDrift.darkMatterDensity]}
                onValueChange={(value) => handleDarkEnergyChange('darkMatterDensity', value[0])}
                min={0}
                max={1}
                step={0.01}
                disabled={disabled}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="void-resonance"
              checked={polarityProtocol.darkEnergyDrift.voidResonance}
              onCheckedChange={(checked) => handleDarkEnergyChange('voidResonance', checked)}
              disabled={disabled}
            />
            <Label htmlFor="void-resonance" className="text-sm">
              Void Resonance
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Shadow Engine Status */}
      {shadowEngineState.isActive && (
        <Card className="border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-400" />
              Shadow Engine Status
              <Badge 
                variant={shadowEngineState.currentPhase === 'void' ? 'destructive' : 'secondary'}
              >
                {shadowEngineState.currentPhase}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Shadow Intensity</Label>
                <div className="font-mono">{(shadowEngineState.shadowIntensity * 100).toFixed(1)}%</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Light Dominance</Label>
                <div className="font-mono">{(shadowEngineState.lightDominance * 100).toFixed(1)}%</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Dark Dominance</Label>
                <div className="font-mono">{(shadowEngineState.darkDominance * 100).toFixed(1)}%</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Breath Coherence</Label>
                <div className="font-mono">{(shadowEngineState.breathCoherence * 100).toFixed(1)}%</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Heart Variability</Label>
                <div className="font-mono">{(shadowEngineState.heartVariability * 100).toFixed(1)}%</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Neural Entrainment</Label>
                <div className="font-mono">{(shadowEngineState.neuralEntrainment * 100).toFixed(1)}%</div>
              </div>
            </div>
            
            {shadowEngineState.currentPhase === 'void' && (
              <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm">
                  Void phase active - Enhanced safety protocols engaged
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Emergency Stop */}
      <Button
        variant="destructive"
        size="lg"
        className="w-full"
        onClick={() => onShadowToggle(false)}
        disabled={disabled || !shadowEngineState.isActive}
      >
        <Shield className="h-4 w-4 mr-2" />
        Emergency Stop
      </Button>
    </div>
  );
};