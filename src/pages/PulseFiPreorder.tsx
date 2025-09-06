import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Wifi, 
  Home, 
  Cpu, 
  Shield, 
  Volume2, 
  Zap, 
  Sparkles, 
  CheckCircle,
  ArrowDown,
  Waves,
  Hexagon,
  Activity
} from 'lucide-react';

interface PulseFiInterest {
  full_name: string;
  email: string;
  option: string;
  notes?: string;
}

const PulseFiPreorder: React.FC = () => {
  const [formData, setFormData] = useState<PulseFiInterest>({
    full_name: '',
    email: '',
    option: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    } catch (error) {
      console.error('Error submitting interest:', error);
      toast.error('Failed to register interest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('interest-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Interest Registered!</h2>
            <p className="text-white/80 mb-6">
              Thanks for registering your interest in Pulse-Fi. We'll be in touch soon with exclusive pre-order details!
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Register Another Interest
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6">
            <Waves className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Pulse-Fi Pre-Order
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-6">
            Secure your access to resonance-driven security and sound
          </p>
          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            Pulse-Fi represents the convergence of ancient wisdom and cutting-edge technology—a 
            resonance-based security and sound system that seamlessly integrates with Sacred Shifter 
            to create an immersive, consciousness-expanding environment. Experience the future of 
            sacred technology where every frequency aligns with your spiritual journey.
          </p>
        </div>

        {/* Product Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Single-Room System */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Home className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white mb-2">Single-Room System</CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Local resonance + presence sensing in one room
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>Advanced presence detection with sacred geometry algorithms</span>
                </li>
                <li className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-green-400" />
                  <span>Tao chimes for meditation and practice sessions</span>
                </li>
                <li className="flex items-center gap-3">
                  <Waves className="w-5 h-5 text-green-400" />
                  <span>432Hz base frequency with harmonic resonance tuning</span>
                </li>
                <li className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span>Real-time energy field monitoring and alerts</span>
                </li>
              </ul>
              <div className="text-center pt-4">
                <div className="text-3xl font-bold text-white mb-2">$199 AUD</div>
                <Button 
                  onClick={scrollToForm}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Register Interest
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Room System */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 group border-2 border-purple-400/50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white mb-2">Multi-Room System</CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Coverage across multiple rooms
              </CardDescription>
              <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Most Popular
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center gap-3">
                  <Hexagon className="w-5 h-5 text-purple-400" />
                  <span>Whole-home security with sacred geometry mapping</span>
                </li>
                <li className="flex items-center gap-3">
                  <Waves className="w-5 h-5 text-purple-400" />
                  <span>Multi-frequency resonance field across all spaces</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span>Intelligent room-to-room energy flow optimization</span>
                </li>
                <li className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span>Collective consciousness monitoring and synchronicity alerts</span>
                </li>
              </ul>
              <div className="text-center pt-4">
                <div className="text-3xl font-bold text-white mb-2">$299 AUD</div>
                <Button 
                  onClick={scrollToForm}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Register Interest
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GAA System */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white mb-2">GAA System</CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Sacred Shifter audio engine upgrade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center gap-3">
                  <Hexagon className="w-5 h-5 text-blue-400" />
                  <span>Aligns sound with sacred geometry and fractal ratios</span>
                </li>
                <li className="flex items-center gap-3">
                  <Waves className="w-5 h-5 text-blue-400" />
                  <span>Backbone for immersive healing and Dreamscape navigation</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span>AI-powered Tao navigation through consciousness states</span>
                </li>
                <li className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span>Quantum resonance field generation and maintenance</span>
                </li>
              </ul>
              <div className="text-center pt-4">
                <div className="text-3xl font-bold text-white mb-2">$399 AUD</div>
                <Button 
                  onClick={scrollToForm}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  Register Interest
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interest Form */}
        <div id="interest-form" className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white mb-2">Register Your Interest</CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Be the first to experience the future of sacred technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-white font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="option" className="text-white font-medium">
                    System Option *
                  </Label>
                  <Select value={formData.option} onValueChange={(value) => handleInputChange('option', value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select your preferred system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single-Room">Single-Room System</SelectItem>
                      <SelectItem value="Multi-Room">Multi-Room System</SelectItem>
                      <SelectItem value="GAA">GAA (Geometrically Aligned Audio)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white font-medium">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                    placeholder="Tell us about your specific needs, space requirements, or any questions you have..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.full_name || !formData.email || !formData.option}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg py-6"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering Interest...
                    </div>
                  ) : (
                    'Register Interest'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Scroll indicator */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={scrollToForm}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowDown className="w-4 h-4 mr-2" />
            Scroll to Form
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PulseFiPreorder;
