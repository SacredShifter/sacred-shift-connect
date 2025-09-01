import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRedirectMappings } from '@/config/navigation';

export const RouteRedirectManager = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectMappings = getRedirectMappings();
    const currentPath = location.pathname;
    
    if (redirectMappings[currentPath]) {
      navigate(redirectMappings[currentPath], { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};