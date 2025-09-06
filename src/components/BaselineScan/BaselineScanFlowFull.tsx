import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Activity, 
  Camera, 
  BarChart3, 
  Save, 
  TrendingUp,
  Info,
  CheckCircle,
  ArrowLeft,
  Heart,
  Wind,
  Brain,
  AlertCircle,
  Play
} from 'lucide-react';
import { RealBiometricScanner } from '@/components/BiometricCapture/RealBiometricScanner';

interface BiometricData {
  pulse: number;
  hrv: number;
  breathingRate: number;
  confidence: number;
  timestamp: Date;
}

interface QuickCheckData {
  mood: number;
  energy: number;
  clarity: number;
  stress: number;
}

interface BaselineData {
  biometric?: BiometricData;
  quickCheck?: QuickCheckData;
  timestamp: Date;
}

type ScanStep = 'entry' | 'quick-check' | 'biometric-setup' | 'results' | 'saved';

const BaselineScanFlowFull: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ScanStep>('entry');
  const [baselineData, setBaselineData] = useState<BaselineData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Quick Check State
  const [quickCheckValues, setQuickCheckValues] = useState<QuickCheckData>({
    mood: 5,
    energy: 5,
    clarity: 5,
    stress: 5
  });


  const handleQuickCheckComplete = (data: QuickCheckData) => {
    setBaselineData(prev => ({
      ...prev,
      quickCheck: data,
      timestamp: new Date()
    }));
    setCurrentStep('results');
  };

  const handleBiometricComplete = (data: BiometricData) => {
    setBaselineData(prev => ({
      ...prev,
      biometric: data,
      timestamp: new Date()
    }));
    setCurrentStep('results');
  };

  const handleSaveBaseline = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setCurrentStep('saved');
  };

  const getOverallState = () => {
    if (!baselineData) return null;
    
    const { biometric, quickCheck } = baselineData;
    
    if (biometric && quickCheck) {
      // Combined assessment
      const avgMood = quickCheck.mood;
      const avgEnergy = quickCheck.energy;
      const avgClarity = quickCheck.clarity;
      const stressLevel = quickCheck.stress;
      const hrvScore = biometric.hrv;
      
      const overallScore = (avgMood + avgEnergy + avgClarity + (10 - stressLevel) + (hrvScore / 10)) / 5;
      
      if (overallScore >= 7) return { label: 'Optimal', color: 'text-green-600', bg: 'bg-green-500/10' };
      if (overallScore >= 5) return { label: 'Balanced', color: 'text-blue-600', bg: 'bg-blue-500/10' };
      return { label: 'Needs Support', color: 'text-orange-600', bg: 'bg-orange-500/10' };
    }
    
    if (quickCheck) {
      const avgScore = (quickCheck.mood + quickCheck.energy + quickCheck.clarity + (10 - quickCheck.stress)) / 4;
      if (avgScore >= 7) return { label: 'Good', color: 'text-green-600', bg: 'bg-green-500/10' };
      if (avgScore >= 5) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-500/10' };
      return { label: 'Low', color: 'text-red-600', bg: 'bg-red-500/10' };
    }
    
    return null;
  };

  const renderEntryScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Activity className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Baseline Scan</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Check your current state with science-backed metrics
        </p>
      </div>

      <div className="grid gap-4 max-w-md mx-auto">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          onClick={() => setCurrentStep('quick-check')}
        >
          <CardContent className="p-6 text-center space-y-3">
            <BarChart3 className="h-8 w-8 mx-auto text-blue-600" />
            <h3 className="text-xl font-semibold">Quick Check</h3>
            <p className="text-muted-foreground">
              1–10 sliders for Mood, Energy, Clarity, Stress
            </p>
            <Badge variant="outline" className="mt-2">
              ~2 minutes
            </Badge>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          onClick={() => setCurrentStep('biometric-setup')}
        >
          <CardContent className="p-6 text-center space-y-3">
            <Camera className="h-8 w-8 mx-auto text-green-600" />
            <h3 className="text-xl font-semibold">Biometric Scan</h3>
            <p className="text-muted-foreground">
              Use camera to capture pulse + HRV
            </p>
            <Badge variant="outline" className="mt-2">
              ~1 minute
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Practice
        </Button>
      </div>
    </motion.div>
  );

  const renderQuickCheck = () => {
    const metrics = [
      {
        key: 'mood' as keyof QuickCheckData,
        label: 'Mood',
        icon: Heart,
        color: 'text-pink-600',
        bgColor: 'bg-pink-500/10',
        description: 'How positive do you feel right now?',
        lowLabel: 'Low',
        highLabel: 'High'
      },
      {
        key: 'energy' as keyof QuickCheckData,
        label: 'Energy',
        icon: Activity,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-500/10',
        description: 'How energized and alert do you feel?',
        lowLabel: 'Drained',
        highLabel: 'Vibrant'
      },
      {
        key: 'clarity' as keyof QuickCheckData,
        label: 'Clarity',
        icon: Brain,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500/10',
        description: 'How clear and focused is your mind?',
        lowLabel: 'Foggy',
        highLabel: 'Crystal Clear'
      },
      {
        key: 'stress' as keyof QuickCheckData,
        label: 'Stress',
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-500/10',
        description: 'How much tension or pressure do you feel?',
        lowLabel: 'Calm',
        highLabel: 'Overwhelmed'
      }
    ];

    const getMetricScore = (value: number) => {
      if (value <= 3) return { label: 'Low', color: 'text-red-600' };
      if (value <= 6) return { label: 'Moderate', color: 'text-yellow-600' };
      return { label: 'High', color: 'text-green-600' };
    };

    const getOverallState = () => {
      const avgScore = (quickCheckValues.mood + quickCheckValues.energy + quickCheckValues.clarity + (10 - quickCheckValues.stress)) / 4;
      if (avgScore >= 7) return { label: 'Balanced', color: 'text-green-600', bg: 'bg-green-500/10' };
      if (avgScore >= 5) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-500/10' };
      return { label: 'Needs Attention', color: 'text-red-600', bg: 'bg-red-500/10' };
    };

    const overallState = getOverallState();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Quick Check</h2>
          <p className="text-muted-foreground">
            Rate your current state across these key metrics
          </p>
        </div>

        {/* Overall State Indicator */}
        <Card className={`${overallState.bg} border-current/20`}>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className={`text-lg font-semibold ${overallState.color}`}>
                Current State: {overallState.label}
              </div>
              <div className="text-sm text-muted-foreground">
                Based on your current ratings
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric Sliders */}
        <div className="space-y-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const value = quickCheckValues[metric.key];
            const score = getMetricScore(value);
            
            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                          <Icon className={`h-5 w-5 ${metric.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{metric.label}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {metric.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={score.color}>
                        {score.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Slider
                        value={[value]}
                        onValueChange={(val) => setQuickCheckValues(prev => ({ ...prev, [metric.key]: val[0] }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {metric.lowLabel}
                        </div>
                        <div className={`text-2xl font-bold ${metric.color}`}>
                          {value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {metric.highLabel}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={() => handleQuickCheckComplete(quickCheckValues)} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Log Baseline
          </Button>
          <Button onClick={() => setCurrentStep('entry')} variant="outline">
            Back
          </Button>
        </div>
      </motion.div>
    );
  };

  const renderBiometricSetup = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
          <Camera className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Real Biometric Capture</h1>
        <p className="text-lg text-muted-foreground">
          Live camera-based pulse and HRV detection
        </p>
      </div>

      <RealBiometricScanner
        onComplete={handleBiometricComplete}
        onCancel={() => setCurrentStep('entry')}
        scanDuration={30}
      />
    </motion.div>
  );


  const renderResults = () => {
    const overallState = getOverallState();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Baseline Complete</h1>
          <p className="text-lg text-muted-foreground">
            Your current state has been captured
          </p>
        </div>

        {/* Overall State */}
        {overallState && (
          <Card className={`${overallState.bg} border-current/20`}>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className={`text-2xl font-bold ${overallState.color}`}>
                  Current State: {overallState.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on your biometric and self-assessment data
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metrics Display */}
        <div className="grid gap-4">
          {/* Biometric Data */}
          {baselineData?.biometric && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Biometric Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-500/10 rounded-lg">
                    <Heart className="h-6 w-6 mx-auto mb-2 text-red-600" />
                    <div className="text-2xl font-bold text-red-600">
                      {baselineData.biometric.pulse}
                    </div>
                    <div className="text-xs text-muted-foreground">bpm</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <Activity className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">
                      {baselineData.biometric.hrv}
                    </div>
                    <div className="text-xs text-muted-foreground">HRV Index</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                    <Wind className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">
                      {baselineData.biometric.breathingRate}
                    </div>
                    <div className="text-xs text-muted-foreground">breaths/min</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Check Data */}
          {baselineData?.quickCheck && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Self-Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-pink-500/10 rounded-lg">
                    <div className="font-semibold text-pink-600">Mood</div>
                    <div className="text-2xl font-bold">{baselineData.quickCheck.mood}/10</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                    <div className="font-semibold text-yellow-600">Energy</div>
                    <div className="text-2xl font-bold">{baselineData.quickCheck.energy}/10</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                    <div className="font-semibold text-blue-600">Clarity</div>
                    <div className="text-2xl font-bold">{baselineData.quickCheck.clarity}/10</div>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded-lg">
                    <div className="font-semibold text-red-600">Stress</div>
                    <div className="text-2xl font-bold">{baselineData.quickCheck.stress}/10</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Science Explanations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              What This Means
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {baselineData?.biometric && (
              <div className="space-y-2">
                <div className="font-medium text-green-600">HRV Index: {baselineData.biometric.hrv}</div>
                <div className="text-sm text-muted-foreground">
                  Higher HRV indicates better nervous system resilience and recovery capacity. 
                  {baselineData.biometric.hrv >= 60 ? ' Your system shows good adaptability.' : ' Consider stress management techniques.'}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <div className="font-medium text-blue-600">Breathing Rate: {baselineData?.biometric?.breathingRate || 'N/A'} breaths/min</div>
              <div className="text-sm text-muted-foreground">
                Optimal range is 12-16 breaths per minute. Lower rates indicate calmness and better autonomic regulation.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={handleSaveBaseline} 
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Log Baseline
              </>
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentStep('entry')}
          >
            Scan Again
          </Button>
        </div>
      </motion.div>
    );
  };

  const renderSaved = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-foreground">Data Saved</h1>
      <p className="text-lg text-muted-foreground max-w-md mx-auto">
        Your baseline has been logged to your Evolution Timeline
      </p>
      
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="font-semibold">View Trends</div>
              <div className="text-sm text-muted-foreground">
                Track your evolution over time
              </div>
            </div>
            <Button 
              onClick={() => window.history.back()}
              className="w-full"
            >
              Continue Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {currentStep === 'entry' && (
            <motion.div
              key="entry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderEntryScreen()}
            </motion.div>
          )}

          {currentStep === 'quick-check' && (
            <motion.div
              key="quick-check"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderQuickCheck()}
            </motion.div>
          )}

          {currentStep === 'biometric-setup' && (
            <motion.div
              key="biometric-setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderBiometricSetup()}
            </motion.div>
          )}


          {currentStep === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderResults()}
            </motion.div>
          )}

          {currentStep === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderSaved()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BaselineScanFlowFull;
