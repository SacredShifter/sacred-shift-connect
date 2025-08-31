import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, Database, Lock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyConsentProps {
  onNext: () => void;
  onBack?: () => void;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onNext, onBack }) => {
  const [consents, setConsents] = useState({
    dataCollection: false,
    personalizedExperience: false,
    communityFeatures: false,
    analytics: false
  });

  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);

  const requiredConsents = ['dataCollection'];
  const allRequiredAccepted = requiredConsents.every(key => consents[key as keyof typeof consents]);

  const handleConsentChange = (key: keyof typeof consents, checked: boolean) => {
    setConsents(prev => ({ ...prev, [key]: checked }));
  };

  const consentItems = [
    {
      key: 'dataCollection' as const,
      required: true,
      icon: <Database className="h-5 w-5" />,
      title: 'Essential Data Collection',
      description: 'We collect minimal data necessary for your Sacred Shifter experience: account info, preferences, and usage patterns to ensure platform functionality.',
      details: 'This includes: email, display name, journey preferences, and basic usage analytics.'
    },
    {
      key: 'personalizedExperience' as const,
      required: false,
      icon: <Eye className="h-5 w-5" />,
      title: 'Personalized Experience',
      description: 'Allow us to tailor content, recommendations, and spiritual insights based on your journey patterns and preferences.',
      details: 'This helps us suggest relevant practices, connect you with aligned community members, and customize your learning path.'
    },
    {
      key: 'communityFeatures' as const,
      required: false,
      icon: <Shield className="h-5 w-5" />,
      title: 'Community Features',
      description: 'Enable features like Sacred Circles, community wisdom sharing, and collaborative spiritual practices with other members.',
      details: 'Your spiritual insights may be shared anonymously to benefit the collective wisdom, always with full control over what you share.'
    },
    {
      key: 'analytics' as const,
      required: false,
      icon: <Lock className="h-5 w-5" />,
      title: 'Anonymous Analytics',
      description: 'Help us improve Sacred Shifter by sharing anonymous usage data and spiritual wellness metrics.',
      details: 'This data is completely anonymized and helps us understand how to better serve the spiritual community.'
    }
  ];

  return (
    <div className="p-8 space-y-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Sacred Privacy & Data Sovereignty</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your spiritual journey is sacred. We honor your privacy and believe in full transparency 
          about how your data supports your transformation and our community.
        </p>
      </motion.div>

      {/* Privacy Policy Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">Full Privacy Policy & Terms</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              We encourage you to read our complete privacy policy and terms of service.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Checkbox 
                id="privacy-read"
                checked={hasReadPrivacy}
                onCheckedChange={(checked) => setHasReadPrivacy(checked === true)}
              />
              <label htmlFor="privacy-read" className="text-sm text-foreground cursor-pointer">
                I have read and understand the Privacy Policy and Terms of Service
              </label>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Consent Options */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground text-center mb-6">
          Choose Your Data Preferences
        </h3>
        
        {consentItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className={`border-2 transition-all duration-200 ${
              consents[item.key] ? 'border-primary/30 bg-primary/5' : 'border-border hover:border-primary/20'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      id={item.key}
                      checked={consents[item.key]}
                      onCheckedChange={(checked) => handleConsentChange(item.key, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-primary">{item.icon}</div>
                        <h4 className="font-semibold text-foreground">
                          {item.title}
                          {item.required && <span className="text-red-500 ml-1">*</span>}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <details className="text-xs text-muted-foreground">
                        <summary className="cursor-pointer hover:text-foreground transition-colors">
                          View details
                        </summary>
                        <p className="mt-2 pl-4 border-l-2 border-primary/20">
                          {item.details}
                        </p>
                      </details>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Sacred Promise */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h4 className="font-semibold text-foreground mb-3">Our Sacred Promise</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>✨ Your spiritual data remains under your complete control</p>
              <p>🔒 We use industry-standard encryption and security practices</p>
              <p>🤝 We will never sell your personal information to third parties</p>
              <p>🌟 You can modify or delete your data at any time</p>
              <p>💝 Your journey is sacred - we honor it with utmost respect</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-between items-center pt-6 border-t border-border/50"
      >
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        
        <div className="flex-1" />
        
        <Button 
          onClick={onNext}
          disabled={!allRequiredAccepted || !hasReadPrivacy}
          className="min-w-[140px]"
        >
          Continue Sacred Journey
        </Button>
      </motion.div>

      {!allRequiredAccepted && (
        <p className="text-center text-sm text-muted-foreground">
          * Essential data collection is required to provide your Sacred Shifter experience
        </p>
      )}
    </div>
  );
};