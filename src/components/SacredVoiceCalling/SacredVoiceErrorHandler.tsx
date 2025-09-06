// Sacred Voice Calling Error Handler
// Provides graceful error handling and recovery for consciousness-aware voice calling

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Mic, 
  MicOff, 
  RefreshCw, 
  Shield, 
  Wifi, 
  Settings,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SacredVoiceErrorHandlerProps {
  error?: string;
  isInitializing: boolean;
  canRetry: boolean;
  retryCount: number;
  onRetry: () => void;
  onInitialize: () => void;
  onClearError: () => void;
  className?: string;
}

export function SacredVoiceErrorHandler({
  error,
  isInitializing,
  canRetry,
  retryCount,
  onRetry,
  onInitialize,
  onClearError,
  className = ''
}: SacredVoiceErrorHandlerProps) {
  if (!error) return null;

  const getErrorType = (errorMessage: string) => {
    if (errorMessage.includes('denied') || errorMessage.includes('NotAllowedError')) {
      return 'permission';
    } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('No microphone')) {
      return 'hardware';
    } else if (errorMessage.includes('NotReadableError') || errorMessage.includes('already in use')) {
      return 'conflict';
    } else if (errorMessage.includes('HTTPS') || errorMessage.includes('secure context')) {
      return 'security';
    } else if (errorMessage.includes('constraints') || errorMessage.includes('OverconstrainedError')) {
      return 'configuration';
    } else {
      return 'unknown';
    }
  };

  const errorType = getErrorType(error);

  const getErrorIcon = () => {
    switch (errorType) {
      case 'permission': return <Shield className="h-5 w-5" />;
      case 'hardware': return <MicOff className="h-5 w-5" />;
      case 'conflict': return <AlertTriangle className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'configuration': return <Settings className="h-5 w-5" />;
      default: return <HelpCircle className="h-5 w-5" />;
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'permission': return 'Microphone Permission Required';
      case 'hardware': return 'Microphone Not Found';
      case 'conflict': return 'Microphone In Use';
      case 'security': return 'Security Restriction';
      case 'configuration': return 'Configuration Error';
      default: return 'Voice Calling Error';
    }
  };

  const getErrorDescription = () => {
    switch (errorType) {
      case 'permission':
        return 'Please allow microphone access in your browser settings to use voice calling features. Click the microphone icon in your address bar and select "Allow".';
      case 'hardware':
        return 'No microphone was detected. Please connect a microphone and try again.';
      case 'conflict':
        return 'Your microphone is currently being used by another application. Please close other applications that might be using your microphone.';
      case 'security':
        return 'Voice calling requires a secure connection (HTTPS). Please ensure you are accessing the site over HTTPS.';
      case 'configuration':
        return 'There was an issue with your microphone configuration. Please check your microphone settings and try again.';
      default:
        return 'An unexpected error occurred while setting up voice calling. Please try again.';
    }
  };

  const getErrorActions = () => {
    const actions = [];

    if (errorType === 'permission') {
      actions.push(
        <Button
          key="grant-permission"
          onClick={onInitialize}
          disabled={isInitializing}
          className="bg-accent hover:bg-accent/90"
        >
          <Mic className="h-4 w-4 mr-2" />
          Grant Permission
        </Button>
      );
    }

    if (canRetry && errorType !== 'permission') {
      actions.push(
        <Button
          key="retry"
          onClick={onRetry}
          disabled={isInitializing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isInitializing ? 'animate-spin' : ''}`} />
          Retry ({retryCount}/3)
        </Button>
      );
    }

    actions.push(
      <Button
        key="dismiss"
        onClick={onClearError}
        variant="ghost"
        size="sm"
      >
        Dismiss
      </Button>
    );

    return actions;
  };

  const getErrorSeverity = () => {
    switch (errorType) {
      case 'permission': return 'warning';
      case 'hardware': return 'error';
      case 'conflict': return 'warning';
      case 'security': return 'error';
      case 'configuration': return 'warning';
      default: return 'error';
    }
  };

  const severity = getErrorSeverity();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={className}
    >
      <Alert variant={severity === 'error' ? 'destructive' : 'default'}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getErrorIcon()}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <AlertTitle className="text-sm font-medium">
                {getErrorTitle()}
              </AlertTitle>
              <Badge variant="outline" className="text-xs">
                {errorType}
              </Badge>
            </div>
            
            <AlertDescription className="text-sm">
              {getErrorDescription()}
            </AlertDescription>

            <div className="flex items-center gap-2 flex-wrap">
              {getErrorActions()}
            </div>

            {retryCount > 0 && (
              <div className="text-xs text-muted-foreground">
                Attempted {retryCount} time{retryCount !== 1 ? 's' : ''} to resolve this issue.
              </div>
            )}
          </div>
        </div>
      </Alert>
    </motion.div>
  );
}

// Sacred Voice Status Indicator
export function SacredVoiceStatusIndicator({
  isInitialized,
  isInitializing,
  hasActiveCalls,
  error,
  className = ''
}: {
  isInitialized: boolean;
  isInitializing: boolean;
  hasActiveCalls: boolean;
  error?: string;
  className?: string;
}) {
  const getStatus = () => {
    if (error) return 'error';
    if (isInitializing) return 'initializing';
    if (hasActiveCalls) return 'active';
    if (isInitialized) return 'ready';
    return 'inactive';
  };

  const status = getStatus();

  const getStatusIcon = () => {
    switch (status) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'initializing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'active': return <Mic className="h-4 w-4 text-green-500" />;
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <MicOff className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'error': return 'Error';
      case 'initializing': return 'Initializing...';
      case 'active': return 'Voice Active';
      case 'ready': return 'Ready';
      default: return 'Inactive';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'error': return 'text-destructive';
      case 'initializing': return 'text-blue-500';
      case 'active': return 'text-green-500';
      case 'ready': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
    </div>
  );
}

// Sacred Voice Troubleshooting Guide
export function SacredVoiceTroubleshootingGuide({ className = '' }: { className?: string }) {
  const troubleshootingSteps = [
    {
      issue: 'Microphone Permission Denied',
      solution: 'Click the microphone icon in your browser address bar and select "Allow"',
      icon: <Shield className="h-4 w-4" />
    },
    {
      issue: 'No Microphone Detected',
      solution: 'Connect a microphone and refresh the page',
      icon: <MicOff className="h-4 w-4" />
    },
    {
      issue: 'Microphone In Use',
      solution: 'Close other applications using your microphone',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      issue: 'HTTPS Required',
      solution: 'Ensure you are accessing the site over HTTPS',
      icon: <Wifi className="h-4 w-4" />
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Voice Calling Troubleshooting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {troubleshootingSteps.map((step, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex-shrink-0 mt-0.5">
              {step.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm mb-1">{step.issue}</div>
              <div className="text-sm text-muted-foreground">{step.solution}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
