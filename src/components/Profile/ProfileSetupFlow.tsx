import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useCreateProfile, useUpdateProfile, Profile } from '@/hooks/useProfile';
import { IdentityStep } from './Steps/IdentityStep';
import { ResonanceStep } from './Steps/ResonanceStep';
import { CommunityStep } from './Steps/CommunityStep';

interface ProfileSetupFlowProps {
  existingProfile?: Profile | null;
  onComplete?: () => void;
  mode?: 'create' | 'edit';
}

export interface ProfileFormData {
  // Identity fields
  full_name: string;
  date_of_birth: string;
  gender_identity: string;
  timezone: string;
  primary_language: string;
  
  // Resonance fields
  soul_identity: string;
  resonance_tags: string[];
  aura_signature: string;
  
  // Community fields
  circles_joined: string[];
}

const steps = [
  {
    id: 'identity',
    title: 'Sacred Identity',
    description: 'Anchor your presence in the field',
  },
  {
    id: 'resonance',
    title: 'Resonance Signature',
    description: 'Attune to your energetic frequency',
  },
  {
    id: 'community',
    title: 'Sacred Circles',
    description: 'Connect with your soul tribe',
  },
];

export const ProfileSetupFlow: React.FC<ProfileSetupFlowProps> = ({
  existingProfile,
  onComplete,
  mode = 'create'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProfileFormData>(() => {
    if (existingProfile) {
      return {
        full_name: existingProfile.full_name,
        date_of_birth: existingProfile.date_of_birth,
        gender_identity: existingProfile.gender_identity || '',
        timezone: existingProfile.timezone,
        primary_language: existingProfile.primary_language,
        soul_identity: existingProfile.soul_identity || '',
        resonance_tags: existingProfile.resonance_tags || [],
        aura_signature: existingProfile.aura_signature || '',
        circles_joined: existingProfile.circles_joined || [],
      };
    }
    
    return {
      full_name: '',
      date_of_birth: '',
      gender_identity: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      primary_language: 'en',
      soul_identity: '',
      resonance_tags: [],
      aura_signature: '',
      circles_joined: [],
    };
  });

  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();

  const updateFormData = (stepData: Partial<ProfileFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      if (mode === 'create') {
        await createProfile.mutateAsync({
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          timezone: formData.timezone,
          primary_language: formData.primary_language,
          gender_identity: formData.gender_identity || undefined,
          soul_identity: formData.soul_identity || undefined,
          resonance_tags: formData.resonance_tags,
          aura_signature: formData.aura_signature || undefined,
          circles_joined: formData.circles_joined,
        });
      } else {
        await updateProfile.mutateAsync({
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          timezone: formData.timezone,
          primary_language: formData.primary_language,
          gender_identity: formData.gender_identity || undefined,
          soul_identity: formData.soul_identity || undefined,
          resonance_tags: formData.resonance_tags,
          aura_signature: formData.aura_signature || undefined,
          circles_joined: formData.circles_joined,
        });
      }
      onComplete?.();
    } catch (error) {
      console.error('Profile submission error:', error);
    }
  };

  const isStepValid = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Identity
        return !!(formData.full_name && formData.date_of_birth && formData.timezone);
      case 1: // Resonance
        return true; // Optional fields
      case 2: // Community
        return true; // Optional fields
      default:
        return false;
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="sacred-card">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <div>
              <CardTitle className="text-2xl">
                {mode === 'create' ? 'Sacred Profile Setup' : 'Edit Sacred Profile'}
              </CardTitle>
              <p className="text-muted-foreground">
                {mode === 'create' 
                  ? 'Establish your presence in the Sacred Shifter field'
                  : 'Update your sacred resonance signature'
                }
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentStepData.title}</span>
              <span>{currentStep + 1} of {steps.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {currentStepData.description}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <IdentityStep 
                  data={formData}
                  onChange={updateFormData}
                />
              )}
              {currentStep === 1 && (
                <ResonanceStep 
                  data={formData}
                  onChange={updateFormData}
                />
              )}
              {currentStep === 2 && (
                <CommunityStep 
                  data={formData}
                  onChange={updateFormData}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep) || createProfile.isPending || updateProfile.isPending}
              className="flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  {mode === 'create' ? 'Complete Setup' : 'Save Changes'}
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};