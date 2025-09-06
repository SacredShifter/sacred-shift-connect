import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Waves, Zap, Info, CheckCircle, Sparkles, Home, Wifi, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface PulseFiAddonProps {
  className?: string;
}

interface PulseFiInterest {
  full_name: string;
  email: string;
  option: string;
  notes?: string;
}

export const PulseFiAddon: React.FC<PulseFiAddonProps> = ({ className }) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<PulseFiInterest>({
    full_name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    option: '',
    notes: ''
  });

  const handleInputChange = (field: keyof PulseFiInterest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('pulsefi_interest')
        .insert([formData]);

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Interest registered successfully! We\'ll be in touch soon.');
      setTimeout(() => {
        setIsDialogOpen(false);
        setIsSubmitted(false);
        setFormData({
          full_name: user?.user_metadata?.full_name || '',
          email: user?.email || '',
          option: '',
          notes: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting interest:', error);
      toast.error('Failed to register interest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSystemIcon = (option: string) => {
    switch (option) {
      case 'Single-Room': return Home;
      case 'Multi-Room': return Wifi;
      case 'GAA': return Cpu;
      default: return Waves;
    }
  };

  const getSystemColor = (option: string) => {
    switch (option) {
      case 'Single-Room': return 'from-green-500 to-emerald-500';
      case 'Multi-Room': return 'from-purple-500 to-pink-500';
      case 'GAA': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const SystemIcon = getSystemIcon(formData.option);
  const systemColor = getSystemColor(formData.option);

  return (
    <>
      <Card className={`bg-gradient-to-r from-purple-500/10 to-blue-500/5 border-purple-500/20 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-purple-600">Pulse-Fi Add-on</h3>
                <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-purple-500/10">
                      <Info className="h-3 w-3 text-purple-600/60" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Waves className="h-5 w-5 text-purple-600" />
                        Pulse-Fi Explained
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <p>
                        Pulse-Fi is a resonance-based security and sound system that integrates 
                        seamlessly with Sacred Shifter to create an immersive, consciousness-expanding environment.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-purple-600" />
                          <span><strong>Single-Room:</strong> $199 AUD - Local resonance + presence sensing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Waves className="h-4 w-4 text-purple-600" />
                          <span><strong>Multi-Room:</strong> $299 AUD - Whole-home coverage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                          <span><strong>GAA System:</strong> $399 AUD - Sacred Shifter audio engine upgrade</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Experience the future of sacred technology where every frequency 
                        aligns with your spiritual journey.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">Resonance-Driven Security</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Advanced presence detection with sacred geometry algorithms and 432Hz base frequency tuning
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-700">
                    Pre-Order Available
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Waves className="h-3 w-3" />
                    From $199 AUD
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <span>Features: </span>
                  <span className="text-purple-600">Sacred geometry mapping, Multi-frequency resonance, AI-powered navigation</span>
                </div>
              </div>
            </div>
            
            <div className="ml-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Notify Me
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Waves className="h-5 w-5 text-purple-600" />
                      Register for Pulse-Fi Updates
                    </DialogTitle>
                  </DialogHeader>
                  
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Interest Registered!</h3>
                      <p className="text-sm text-muted-foreground">
                        We'll be in touch soon with exclusive pre-order details.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          placeholder="Enter your email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="option">System Option *</Label>
                        <Select value={formData.option} onValueChange={(value) => handleInputChange('option', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your preferred system" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Single-Room">Single-Room System - $199 AUD</SelectItem>
                            <SelectItem value="Multi-Room">Multi-Room System - $299 AUD</SelectItem>
                            <SelectItem value="GAA">GAA System - $399 AUD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Tell us about your specific needs or questions..."
                          className="min-h-[80px]"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting || !formData.full_name || !formData.email || !formData.option}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Registering...
                          </div>
                        ) : (
                          'Register Interest'
                        )}
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
