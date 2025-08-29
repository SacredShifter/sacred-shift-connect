import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, Globe, Languages } from 'lucide-react';
import { ProfileFormData } from '../ProfileSetupFlow';

interface IdentityStepProps {
  data: ProfileFormData;
  onChange: (data: Partial<ProfileFormData>) => void;
}

const commonTimezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'GMT (London)' },
  { value: 'Europe/Paris', label: 'CET (Paris)' },
  { value: 'Europe/Berlin', label: 'CET (Berlin)' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
  { value: 'Asia/Shanghai', label: 'CST (Shanghai)' },
  { value: 'Australia/Sydney', label: 'AEDT (Sydney)' },
  { value: 'UTC', label: 'UTC' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'hi', label: 'Hindi' },
];

const genderIdentities = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'fluid', label: 'Gender fluid' },
  { value: 'questioning', label: 'Questioning' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  { value: 'other', label: 'Other' },
];

export const IdentityStep: React.FC<IdentityStepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="w-12 h-12 text-primary mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Your Sacred Identity</h3>
        <p className="text-sm text-muted-foreground">
          These details help us personalize your journey and align synchronicity events to your local time.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name *
          </Label>
          <Input
            id="full_name"
            value={data.full_name}
            onChange={(e) => onChange({ full_name: e.target.value })}
            placeholder="Your sacred name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="date_of_birth" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date of Birth *
          </Label>
          <Input
            id="date_of_birth"
            type="date"
            value={data.date_of_birth}
            onChange={(e) => onChange({ date_of_birth: e.target.value })}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Used for astrology and cosmic alignment features
          </p>
        </div>

        <div>
          <Label htmlFor="gender_identity" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Gender Identity
          </Label>
          <Select 
            value={data.gender_identity} 
            onValueChange={(value) => onChange({ gender_identity: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your gender identity (optional)" />
            </SelectTrigger>
            <SelectContent>
              {genderIdentities.map((gender) => (
                <SelectItem key={gender.value} value={gender.value}>
                  {gender.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timezone" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Timezone *
          </Label>
          <Select 
            value={data.timezone} 
            onValueChange={(value) => onChange({ timezone: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent>
              {commonTimezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Ensures synchronicity events align with your local time
          </p>
        </div>

        <div>
          <Label htmlFor="primary_language" className="flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Primary Language *
          </Label>
          <Select 
            value={data.primary_language} 
            onValueChange={(value) => onChange({ primary_language: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your primary language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};