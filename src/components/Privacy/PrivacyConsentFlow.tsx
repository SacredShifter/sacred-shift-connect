import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useUpdatePrivacyPreferences, PrivacyPreferences } from '@/hooks/usePrivacyCompliance';
import { Shield, Eye, Database, MessageSquare, Heart, MapPin, Cookie, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyConsentFlowProps {
  onComplete: (preferences: Partial<PrivacyPreferences>) => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

interface ConsentItem {
  key: keyof PrivacyPreferences;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  required: boolean;
  legalBasis: string;
  dataTypes: string[];
}

const consentItems: ConsentItem[] = [
  {
    key: 'data_processing_consent',
    title: 'Essential Data Processing',
    description: 'Allow us to process your basic profile data to provide Sacred Shifter services. This includes your name, email, and spiritual journey progress.',
    icon: Database,
    required: true,
    legalBasis: 'Necessary for service provision (GDPR Art. 6(1)(b))',
    dataTypes: ['Profile data', 'Journey progress', 'Account information']
  },
  {
    key: 'analytics_consent',
    title: 'Analytics & Insights',
    description: 'Help us understand how you use Sacred Shifter to improve your spiritual journey experience. No personal identifiers are shared.',
    icon: Eye,
    required: false,
    legalBasis: 'Consent (GDPR Art. 6(1)(a))',
    dataTypes: ['Usage patterns', 'Feature interactions', 'Anonymous metrics']
  },
  {
    key: 'communication_consent',
    title: 'Sacred Communications',
    description: 'Receive guidance, updates about your spiritual journey, and notifications about community events.',
    icon: MessageSquare,
    required: false,
    legalBasis: 'Consent (GDPR Art. 6(1)(a))',
    dataTypes: ['Email address', 'Communication preferences', 'Journey milestones']
  },
  {
    key: 'health_data_consent',
    title: 'Wellness Data Processing',
    description: 'Process meditation, breathing, and other wellness data to provide personalized spiritual guidance.',
    icon: Heart,
    required: false,
    legalBasis: 'Explicit consent for health data (GDPR Art. 9(2)(a))',
    dataTypes: ['Meditation sessions', 'Breathing patterns', 'Wellness metrics']
  },
  {
    key: 'research_participation_consent',
    title: 'Sacred Research Participation',
    description: 'Contribute anonymously to research on consciousness, spirituality, and human transformation.',
    icon: Shield,
    required: false,
    legalBasis: 'Consent (GDPR Art. 6(1)(a))',
    dataTypes: ['Anonymized journey data', 'Transformation patterns', 'Collective insights']
  },
  {
    key: 'geolocation_consent',
    title: 'Location Services',
    description: 'Use your location to suggest local spiritual events, sacred sites, and community gatherings.',
    icon: MapPin,
    required: false,
    legalBasis: 'Consent (GDPR Art. 6(1)(a))',
    dataTypes: ['Approximate location', 'Local event preferences']
  },
  {
    key: 'cookie_consent',
    title: 'Cookies & Local Storage',
    description: 'Store preferences and session data on your device to enhance your Sacred Shifter experience.',
    icon: Cookie,
    required: false,
    legalBasis: 'Consent (ePrivacy Directive)',
    dataTypes: ['User preferences', 'Session tokens', 'Local cache']
  },
  {
    key: 'third_party_sharing_consent',
    title: 'Sacred Partner Integration',
    description: 'Share relevant data with trusted spiritual partners to provide enhanced services (meditation apps, spiritual teachers).',
    icon: Share,
    required: false,
    legalBasis: 'Consent (GDPR Art. 6(1)(a))',
    dataTypes: ['Profile summary', 'Journey preferences', 'Interaction data']
  }
];

export const PrivacyConsentFlow: React.FC<PrivacyConsentFlowProps> = ({
  onComplete,
  onSkip,
  showSkip = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<PrivacyPreferences>>({
    profile_visibility: 'private',
    data_retention_period: 365,
    auto_delete_enabled: false,
  });
  const [showDetails, setShowDetails] = useState<Record<number, boolean>>({});

  const updatePreference = (key: keyof PrivacyPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < consentItems.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAcceptAll = () => {
    const allConsents = consentItems.reduce((acc, item) => ({
      ...acc,
      [item.key]: true
    }), {});
    setPreferences(prev => ({ ...prev, ...allConsents }));
    onComplete({ ...preferences, ...allConsents });
  };

  const handleMinimal = () => {
    const minimalConsents = consentItems.reduce((acc, item) => ({
      ...acc,
      [item.key]: item.required
    }), {});
    setPreferences(prev => ({ ...prev, ...minimalConsents }));
    onComplete({ ...preferences, ...minimalConsents });
  };

  const toggleDetails = (index: number) => {
    setShowDetails(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const progress = ((currentStep + 1) / consentItems.length) * 100;
  const currentItem = consentItems[currentStep];
  const IconComponent = currentItem.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-background/98 backdrop-blur-xl border-primary/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Sacred Privacy Preferences</CardTitle>
            <CardDescription>
              Your privacy is sacred. Choose how your data supports your spiritual journey.
            </CardDescription>
            <Progress value={progress} className="mt-4" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {consentItems.length}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        {currentItem.title}
                        {currentItem.required && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            Required
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={currentItem.key}
                          checked={preferences[currentItem.key] as boolean || false}
                          onCheckedChange={(checked) => 
                            updatePreference(currentItem.key, checked as boolean)
                          }
                          disabled={currentItem.required}
                        />
                        <Label htmlFor={currentItem.key} className="sr-only">
                          {currentItem.title}
                        </Label>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground">
                      {currentItem.description}
                    </p>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDetails(currentStep)}
                      className="text-xs"
                    >
                      {showDetails[currentStep] ? 'Hide Details' : 'Show Details'}
                    </Button>

                    {showDetails[currentStep] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2 pt-2 border-t"
                      >
                        <div className="text-xs space-y-1">
                          <p><strong>Legal Basis:</strong> {currentItem.legalBasis}</p>
                          <p><strong>Data Types:</strong> {currentItem.dataTypes.join(', ')}</p>
                          <p><strong>Retention:</strong> Data retained for 365 days unless you choose otherwise</p>
                          <p><strong>Your Rights:</strong> You can withdraw consent, request data export, or delete your data at any time</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <Separator />

            <div className="flex justify-between gap-4">
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {showSkip && onSkip && (
                  <Button variant="ghost" onClick={onSkip}>
                    Skip for now
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {currentStep === 0 && (
                  <>
                    <Button variant="outline" onClick={handleMinimal}>
                      Minimal Setup
                    </Button>
                    <Button variant="outline" onClick={handleAcceptAll}>
                      Accept All
                    </Button>
                  </>
                )}
                <Button onClick={handleNext}>
                  {currentStep === consentItems.length - 1 ? 'Complete Setup' : 'Next'}
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>Your privacy choices are stored securely and can be changed anytime in Settings.</p>
              <p>Sacred Shifter is committed to protecting your spiritual journey data.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};