import { useState, useEffect } from 'react';
import { useProfile, useCreateProfile } from '@/hooks/useProfile';
import { ProfileDashboard } from '@/components/Profile/ProfileDashboard';
import { ProfileSetupFlow } from '@/components/Profile/ProfileSetupFlow';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading, error } = useProfile();
  const [showSetup, setShowSetup] = useState(false);

  // Show setup flow if no profile exists
  useEffect(() => {
    if (!isLoading && !profile && user) {
      setShowSetup(true);
    }
  }, [isLoading, profile, user]);

  const handleSetupComplete = () => {
    setShowSetup(false);
  };

  const handleEdit = () => {
    setShowSetup(true);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your sacred profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-destructive space-y-2">
          <p>Failed to load your profile</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (showSetup || !profile) {
    return (
      <div className="h-full overflow-y-auto">
        <ProfileSetupFlow
          existingProfile={profile}
          mode={profile ? 'edit' : 'create'}
          onComplete={handleSetupComplete}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <ProfileDashboard 
        profile={profile} 
        onEdit={handleEdit}
      />
    </div>
  );
};

export default Profile;