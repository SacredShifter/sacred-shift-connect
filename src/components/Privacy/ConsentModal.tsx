import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useConsentLogger } from '@/hooks/usePrivacyCompliance';
import { Shield, FileText, Eye, Lock, AlertTriangle } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (consents: ConsentData) => void;
  isNewUser?: boolean;
}

interface ConsentData {
  terms_of_service: boolean;
  privacy_policy: boolean;
  data_processing: boolean;
  marketing_communications: boolean;
  sensitive_data_processing: boolean;
  cookies_local_storage: boolean;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onOpenChange,
  onComplete,
  isNewUser = false
}) => {
  const { logConsent } = useConsentLogger();
  const [consents, setConsents] = useState<ConsentData>({
    terms_of_service: false,
    privacy_policy: false,
    data_processing: false,
    marketing_communications: false,
    sensitive_data_processing: false,
    cookies_local_storage: false
  });

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const updateConsent = (key: keyof ConsentData, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // Log each consent decision
    for (const [consentType, given] of Object.entries(consents)) {
      await logConsent({
        consent_type: consentType,
        consent_given: given,
        privacy_policy_version: '1.0',
        terms_version: '1.0',
        ip_address: 'local-device',
        user_agent: navigator.userAgent
      });
    }

    onComplete(consents);
    onOpenChange(false);
  };

  const canProceed = consents.terms_of_service && consents.privacy_policy && consents.data_processing;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Sacred Shifter - Privacy & Consent
          </DialogTitle>
          <DialogDescription>
            Your privacy is sacred. Please review and provide your consent for data processing.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4" onScrollCapture={handleScroll}>
          <div className="space-y-6">
            {/* Legal Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal Agreements</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={consents.terms_of_service}
                    onCheckedChange={(checked) => updateConsent('terms_of_service', checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-base font-medium cursor-pointer flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Terms of Service
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      I agree to the Sacred Shifter Terms of Service, including the use of the platform 
                      for spiritual development and community participation.
                    </p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                      Read Terms of Service
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id="privacy"
                    checked={consents.privacy_policy}
                    onCheckedChange={(checked) => updateConsent('privacy_policy', checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="privacy" className="text-base font-medium cursor-pointer flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Privacy Policy
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      I acknowledge reading and understanding the Privacy Policy, including data collection, 
                      processing, and my rights under GDPR, CCPA, and Australian Privacy Act.
                    </p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                      Read Privacy Policy
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Data Processing Consents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Data Processing Consent</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 border rounded-lg border-blue-200 bg-blue-50/50">
                  <Checkbox
                    id="data-processing"
                    checked={consents.data_processing}
                    onCheckedChange={(checked) => updateConsent('data_processing', checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="data-processing" className="text-base font-medium cursor-pointer flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Essential Data Processing
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Process my profile data, spiritual journey progress, and account information 
                      necessary to provide Sacred Shifter services.
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      <strong>Legal Basis:</strong> Contract performance (GDPR Art. 6(1)(b))
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id="sensitive-data"
                    checked={consents.sensitive_data_processing}
                    onCheckedChange={(checked) => updateConsent('sensitive_data_processing', checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="sensitive-data" className="text-base font-medium cursor-pointer flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      Health & Wellness Data
                      <Badge variant="outline" className="text-xs">Optional</Badge>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Process meditation, breathing, trauma healing, and other wellness data 
                      to provide personalized spiritual guidance and track your progress.
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      <strong>Legal Basis:</strong> Explicit consent for health data (GDPR Art. 9(2)(a))
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id="cookies"
                    checked={consents.cookies_local_storage}
                    onCheckedChange={(checked) => updateConsent('cookies_local_storage', checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="cookies" className="text-base font-medium cursor-pointer">
                      Cookies & Local Storage
                      <Badge variant="outline" className="text-xs ml-2">Optional</Badge>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Store preferences and session data on your device to enhance your experience. 
                      This enables offline functionality and saves your settings.
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      <strong>Legal Basis:</strong> Consent (ePrivacy Directive)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Marketing & Communications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Communications</h3>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="marketing"
                  checked={consents.marketing_communications}
                  onCheckedChange={(checked) => updateConsent('marketing_communications', checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="marketing" className="text-base font-medium cursor-pointer">
                    Sacred Communications
                    <Badge variant="outline" className="text-xs ml-2">Optional</Badge>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive spiritual guidance, community updates, and notifications about your sacred journey. 
                    You can unsubscribe anytime (Spam Act 2003 compliant).
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    <strong>Legal Basis:</strong> Consent (GDPR Art. 6(1)(a), Spam Act 2003)
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Rights Notice */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Your Privacy Rights</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• <strong>Right to Access:</strong> Download a copy of your data anytime</p>
                <p>• <strong>Right to Rectification:</strong> Correct inaccurate information</p>
                <p>• <strong>Right to Erasure:</strong> Delete your account and all data</p>
                <p>• <strong>Right to Portability:</strong> Export data in machine-readable format</p>
                <p>• <strong>Right to Withdraw:</strong> Change your consent preferences anytime</p>
                <p>• <strong>Right to Object:</strong> Opt-out of processing for direct marketing</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                These rights are available under GDPR, CCPA, Australian Privacy Act 1988, and other applicable laws.
              </p>
            </div>

            {!hasScrolledToBottom && (
              <div className="text-center text-sm text-muted-foreground">
                Please scroll to read all terms and conditions
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!canProceed || !hasScrolledToBottom}
              className="flex-1"
            >
              {canProceed 
                ? hasScrolledToBottom 
                  ? 'Accept & Continue' 
                  : 'Please scroll to continue'
                : 'Please accept required terms'
              }
            </Button>
          </div>
          
          {!canProceed && (
            <p className="text-sm text-muted-foreground mt-2">
              Terms of Service, Privacy Policy, and Essential Data Processing are required to use Sacred Shifter.
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};