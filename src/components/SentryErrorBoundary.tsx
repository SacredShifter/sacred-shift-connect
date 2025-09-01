import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  eventId: string | null;
}

export class SentryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, eventId: null };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true, eventId: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only send to Sentry in production to avoid rate limits
    if (import.meta.env.PROD) {
      const eventId = Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
      this.setState({ eventId });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="bg-destructive/5 border-destructive/20 max-w-md mx-auto mt-8">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-destructive mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              We've been notified of this error and are working to fix it.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </Button>
            {this.state.eventId && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {this.state.eventId}
              </p>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// HOC wrapper for easier use
export const withSentryErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <SentryErrorBoundary fallback={fallback}>
      <Component {...props} />
    </SentryErrorBoundary>
  );
};