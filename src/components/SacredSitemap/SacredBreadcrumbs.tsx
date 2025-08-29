import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getRouteByPath } from '@/config/routes.sacred';

export const SacredBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const currentRoute = getRouteByPath(location.pathname);

  if (!currentRoute || location.pathname === '/') {
    return null;
  }

  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {pathSegments.length > 0 && (
        <>
          <ChevronRight className="w-4 h-4" />
          <div className="flex items-center space-x-1">
            <span className="text-lg mr-1">{currentRoute.sigil}</span>
            <span className="font-medium text-foreground">{currentRoute.title}</span>
            <span className="text-xs bg-primary/10 px-2 py-1 rounded-full capitalize">
              {currentRoute.category}
            </span>
          </div>
        </>
      )}
    </nav>
  );
};