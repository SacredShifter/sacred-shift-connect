import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, VolumeX } from 'lucide-react';
import { logger } from '@/lib/logger';

interface GAAAudioErrorState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  audioContextState?: string;
  retryCount: number;
}

interface GAAAudioErrorBoundaryProps {
  children: ReactNode;
  onRetry?: () => void;
  onAudioReset?: () => Promise<boolean>;
}

/**
 * Specialized error boundary for GAA audio system
 * Handles Web Audio API crashes and provides recovery options
 */
export class GAAAudioErrorBoundary extends Component<GAAAudioErrorBoundaryProps, GAAAudioErrorState> {
  private maxRetries = 3;

  constructor(props: GAAAudioErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): GAAAudioErrorState {
    logger.error('GAA Audio Error Boundary triggered', { 
      component: 'GAAAudioErrorBoundary',
      function: 'getDerivedStateFromError'
    }, error);

    return {
      hasError: true,
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Check if it's an audio-related error
    const isAudioError = this.isAudioRelatedError(error);
    
    // Check AudioContext state
    let audioContextState = 'unknown';
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextState = audioContext.state;
      audioContext.close();
    } catch (e) {
      audioContextState = 'unavailable';
    }

    this.setState({
      error,
      errorInfo,
      audioContextState,
      hasError: true
    });

    logger.error('GAA Audio System Error', {
      component: 'GAAAudioErrorBoundary',
      function: 'componentDidCatch',
      metadata: {
        isAudioError,
        audioContextState,
        errorStack: error.stack,
        componentStack: errorInfo.componentStack
      }
    }, error);

    // Auto-retry for specific recoverable errors
    if (this.isRecoverableError(error) && this.state.retryCount < this.maxRetries) {
      setTimeout(() => {
        this.handleRetry();
      }, 2000);
    }
  }

  private isAudioRelatedError(error: Error): boolean {
    const audioKeywords = [
      'audiocontext',
      'oscillator',
      'webaudio',
      'tone.js',
      'gainnode',
      'analyser',
      'audionode'
    ];

    const errorMessage = error.message.toLowerCase();
    const errorStack = (error.stack || '').toLowerCase();

    return audioKeywords.some(keyword => 
      errorMessage.includes(keyword) || errorStack.includes(keyword)
    );
  }

  private isRecoverableError(error: Error): boolean {
    const recoverablePatterns = [
      'audiocontext was not allowed to start',
      'the operation was aborted',
      'invalidstateerror',
      'user gesture required'
    ];

    const errorMessage = error.message.toLowerCase();
    return recoverablePatterns.some(pattern => errorMessage.includes(pattern));
  }

  private handleRetry = async () => {
    if (this.state.retryCount >= this.maxRetries) return;

    logger.info('Attempting GAA Audio Recovery', {
      component: 'GAAAudioErrorBoundary',
      metadata: { attempt: this.state.retryCount + 1, maxRetries: this.maxRetries }
    });

    this.setState(prev => ({ 
      retryCount: prev.retryCount + 1 
    }));

    // Try to reset audio system if handler provided
    if (this.props.onAudioReset) {
      const success = await this.props.onAudioReset();
      if (success) {
        this.setState({
          hasError: false,
          error: undefined,
          errorInfo: undefined
        });
        return;
      }
    }

    // Fallback to simple retry
    if (this.props.onRetry) {
      this.props.onRetry();
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    });
  };

  private handleManualRetry = () => {
    logger.info('Manual GAA Audio Recovery initiated', { 
      component: 'GAAAudioErrorBoundary' 
    });

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0
    });

    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      const { error, audioContextState, retryCount } = this.state;
      const isAudioError = error && this.isAudioRelatedError(error);
      const canRetry = retryCount < this.maxRetries;

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-md border-destructive/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {isAudioError ? (
                  <VolumeX className="h-8 w-8 text-destructive" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                )}
              </div>
              <CardTitle className="text-destructive">
                {isAudioError ? 'Sacred Audio Interrupted' : 'Sacred Geometry Disrupted'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                {isAudioError
                  ? 'The sacred audio frequencies have been interrupted. This may be due to browser audio restrictions or device limitations.'
                  : 'An unexpected disruption occurred in the sacred geometry engine.'}
              </p>

              {audioContextState && (
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  Audio Context: {audioContextState}
                </div>
              )}

              {error && (
                <details className="text-xs text-left">
                  <summary className="cursor-pointer text-muted-foreground">
                    Technical Details
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                    {error.message}
                  </pre>
                </details>
              )}

              <div className="space-y-2">
                {canRetry && (
                  <Button 
                    onClick={this.handleManualRetry}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restore Sacred Frequencies
                  </Button>
                )}

                <Button
                  onClick={() => window.location.reload()}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Refresh Sacred Space
                </Button>
              </div>

              {retryCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  Recovery attempts: {retryCount}/{this.maxRetries}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional component error handling
export const useGAAAudioErrorHandler = () => {
  const handleAudioError = React.useCallback((error: Error) => {
    logger.error('GAA Audio Error', { 
      component: 'useGAAAudioErrorHandler' 
    }, error);

    // Check if AudioContext is still alive
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'closed') {
        throw new Error('AudioContext is closed');
      }
      audioContext.close();
    } catch (e) {
      logger.warn('AudioContext validation failed', { 
        component: 'useGAAAudioErrorHandler' 
      }, e as Error);
    }
  }, []);

  const recoverAudio = React.useCallback(async (): Promise<boolean> => {
    try {
      logger.info('Attempting audio recovery', { 
        component: 'useGAAAudioErrorHandler' 
      });

      // Try to create new AudioContext
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Test with a brief silent tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      gainNode.gain.value = 0; // Silent test
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);

      await new Promise(resolve => setTimeout(resolve, 200));
      
      audioContext.close();
      
      logger.info('Audio recovery successful', { 
        component: 'useGAAAudioErrorHandler' 
      });
      
      return true;
    } catch (error) {
      logger.error('Audio recovery failed', { 
        component: 'useGAAAudioErrorHandler' 
      }, error as Error);
      
      return false;
    }
  }, []);

  return { handleAudioError, recoverAudio };
};