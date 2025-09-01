import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';
import { OnboardingChecker } from '@/components/OnboardingChecker';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  logger.debug('ProtectedRoute state check', {
    component: 'ProtectedRoute',
    userId: user?.id,
    metadata: { loading, hasUser: !!user }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Wrap authenticated routes with onboarding checker
  return (
    <OnboardingChecker>
      {children}
    </OnboardingChecker>
  );
};

export default ProtectedRoute;