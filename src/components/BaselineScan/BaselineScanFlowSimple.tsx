import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Brain
} from 'lucide-react';

const BaselineScanFlowSimple: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'entry' | 'quick-check' | 'biometric' | 'results'>('entry');

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
          onClick={() => setCurrentStep('biometric')}
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

  const renderQuickCheck = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Quick Check</h1>
        <p className="text-lg text-muted-foreground">
          Rate your current state across these key metrics
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                Quick Check Complete
              </div>
              <p className="text-muted-foreground">
                This is a simplified version for testing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={() => setCurrentStep('results')} className="flex-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          Continue
        </Button>
        <Button onClick={() => setCurrentStep('entry')} variant="outline">
          Back
        </Button>
      </div>
    </motion.div>
  );

  const renderBiometric = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Biometric Scan</h1>
        <p className="text-lg text-muted-foreground">
          Camera-based pulse and HRV detection
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                Biometric Scan Complete
              </div>
              <p className="text-muted-foreground">
                This is a simplified version for testing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={() => setCurrentStep('results')} className="flex-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          Continue
        </Button>
        <Button onClick={() => setCurrentStep('entry')} variant="outline">
          Back
        </Button>
      </div>
    </motion.div>
  );

  const renderResults = () => (
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

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                Data Saved
              </div>
              <p className="text-muted-foreground">
                Your baseline has been logged to your Evolution Timeline
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={() => window.history.back()} className="flex-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          Continue Practice
        </Button>
        <Button onClick={() => setCurrentStep('entry')} variant="outline">
          Scan Again
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {currentStep === 'entry' && renderEntryScreen()}
        {currentStep === 'quick-check' && renderQuickCheck()}
        {currentStep === 'biometric' && renderBiometric()}
        {currentStep === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default BaselineScanFlowSimple;
