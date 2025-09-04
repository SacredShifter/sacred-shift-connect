import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PreReleaseCountdown } from '@/components/PreReleaseCountdown';
import { CosmicBackground } from '@/components/CosmicBackground';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const PreReleaseLanding: React.FC = () => {
  const { user, signIn, signUp, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Portal opens on 09/09/2025 at 9:09 AM AEST
  const portalDate = new Date('2025-09-09T09:09:00+10:00'); // AEST timezone

  useEffect(() => {
    if (user) {
      // Fetch user profile to check pre_release_access
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('pre_release_access')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setUserProfile(data);
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Check if user has pre-release access
  const hasPreReleaseAccess = userProfile?.pre_release_access === true;

  // If user is authenticated and has pre-release access, redirect to app
  if (user && hasPreReleaseAccess) {
    return <Navigate to="/" replace />;
  }

  // If portal is open (countdown reached zero), allow entry
  if (portalOpen || new Date() >= portalDate) {
    if (user) {
      return <Navigate to="/" replace />;
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        let title = "Sign Up Failed";
        let description = error.message;
        
        if (error.message.includes("User already registered") || error.message.includes("already exists")) {
          title = "Account Already Exists";
          description = "This email is already registered. Try signing in instead.";
        }
        
        toast({
          title,
          description,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Sacred Shifter",
          description: "Please check your email to confirm your account",
        });
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      toast({
        title: "Sign Up Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const formatTimezoneTime = (date: Date, timezone: string) => {
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8">
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <motion.img 
                src="https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png"
                alt="Sacred Shifter" 
                className="h-48 lg:h-64 w-auto invert drop-shadow-2xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              />
            </div>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
              A quantum leap in consciousness awaits. The Portal opens at the sacred moment.
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="py-8"
          >
            <PreReleaseCountdown 
              targetDate={portalDate}
              onCountdownComplete={() => setPortalOpen(true)}
            />
          </motion.div>

          {/* Portal Date Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-primary">
              The Portal Opens at 9:09 AM — 9/9/2025
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-primary">AEST</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {formatTimezoneTime(portalDate, 'Australia/Sydney')}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-primary">UTC</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {formatTimezoneTime(portalDate, 'UTC')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Numerology */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="py-6"
          >
            <Card className="bg-background/80 backdrop-blur-sm border-primary/20 max-w-md mx-auto">
              <CardContent className="pt-6">
                <p className="text-primary font-semibold text-lg">
                  Portal 9.9.9 Resonance
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  9+9+2+0+2+5 = 27 → 2+7 = 9
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Triple Nine: Completion, Spiritual Mastery, Divine Alignment
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Authentication Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="w-full max-w-md mx-auto bg-background/90 backdrop-blur-md border-primary/30">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-xl">Join the Portal Queue</CardTitle>
                <CardDescription>
                  Create your account to be ready when the portal opens
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>
                
                <Tabs defaultValue="signup" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signup" className="space-y-4 mt-4">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password (min 6 characters)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={!email || password.length < 6 || isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Join the Portal Queue"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signin" className="space-y-4 mt-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={!email || password.length < 6 || isLoading}
                      >
                        {isLoading ? "Signing In..." : "Enter Portal Queue"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Status for Authenticated Users */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Card className="max-w-md mx-auto bg-background/90 backdrop-blur-md border-primary/30">
                <CardContent className="pt-6 text-center">
                  <p className="text-primary font-semibold">Portal Access Status</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    {hasPreReleaseAccess ? (
                      "✨ You have early access! Redirecting..."
                    ) : (
                      "⌛ Waiting for portal activation..."
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Signed in as: {user.email}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PreReleaseLanding;