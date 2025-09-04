import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Check, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PulseFiNotificationProps {
  variant?: 'inline' | 'modal';
  onComplete?: () => void;
}

export const PulseFiNotificationService = ({ variant = 'inline', onComplete }: PulseFiNotificationProps) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Store subscription in Supabase
      const { error } = await supabase
        .from('pulse_fi_notifications')
        .insert({
          email,
          user_id: user?.id || null,
          subscription_type: 'launch_notification',
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsSubscribed(true);
      
      toast({
        title: "Subscription Confirmed",
        description: "You'll be notified when Pulse-Fi launches!",
      });

      onComplete?.();
    } catch (error: any) {
      console.error('Subscription error:', error);
      
      // Handle duplicate subscription gracefully
      if (error.code === '23505') {
        toast({
          title: "Already Subscribed",
          description: "This email is already on our notification list",
        });
        setIsSubscribed(true);
        onComplete?.();
      } else {
        toast({
          title: "Subscription Failed",
          description: "Unable to subscribe. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-4 rounded-lg bg-primary/10 text-primary"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Check className="w-5 h-5" />
          <span className="font-semibold">You're on the list!</span>
        </div>
        <p className="text-sm">We'll notify you when Pulse-Fi becomes available.</p>
      </motion.div>
    );
  }

  return (
    <div className={`space-y-4 ${variant === 'modal' ? 'p-6' : ''}`}>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Get Notified</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Be the first to know when Pulse-Fi launches
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubscribe();
            }
          }}
        />
        <Button 
          onClick={handleSubscribe} 
          disabled={isLoading || !email}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Bell className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "Subscribing..." : "Notify Me"}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        We'll only email you about Pulse-Fi availability. No spam, ever.
      </p>
    </div>
  );
};