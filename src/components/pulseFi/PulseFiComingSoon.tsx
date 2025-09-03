import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  Heart, 
  Wind, 
  Shield, 
  Users, 
  HomeIcon,
  Eye,
  Bell,
  ChevronRight,
  Sparkles,
  Lock,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PulseFiComingSoonProps {
  variant?: 'banner' | 'card' | 'dashboard-widget';
  showDetails?: boolean;
}

export const PulseFiComingSoon: React.FC<PulseFiComingSoonProps> = ({ 
  variant = 'card',
  showDetails = false 
}) => {
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifyMe = () => {
    if (notifyEmail) {
      setIsSubscribed(true);
      // TODO: Integrate with email service
      console.log('Subscribing:', notifyEmail);
    }
  };

  const features = [
    {
      icon: Heart,
      title: "Heart Rate & Breath Sensing",
      description: "No wearables needed",
      category: "vitals"
    },
    {
      icon: Wind,
      title: "Stress & Calm Detection",
      description: "Adaptive sound + visuals",
      category: "biofeedback"
    },
    {
      icon: Eye,
      title: "Presence Awareness",
      description: "Motion energy mapping",
      category: "biofeedback"
    },
    {
      icon: Shield,
      title: "Home Guardian Mode",
      description: "Intrusion & fall detection",
      category: "security"
    },
    {
      icon: Users,
      title: "Group Resonance",
      description: "Shared coherence tracking",
      category: "community"
    }
  ];

  const kits = [
    {
      name: "Starter Kit",
      price: "$199 AUD",
      description: "1-room vital sensing",
      features: ["Heart rate monitoring", "Breath tracking", "Basic presence detection"]
    },
    {
      name: "Guardian Pack",
      price: "$399 AUD",
      description: "Multi-room awareness",
      features: ["Full home coverage", "Security monitoring", "Advanced motion tracking", "Family health insights"]
    },
    {
      name: "GAA Pro",
      price: "$499 AUD", 
      description: "Direct GAA Engine link",
      features: ["Biofeedback integration", "Real-time audio adaptation", "Advanced coherence analytics", "Community resonance"]
    }
  ];

  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Wifi className="w-8 h-8 text-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary">Pulse-Fi Add-On</h3>
                  <p className="text-sm text-muted-foreground">Turn Wi-Fi into awareness — sense your heart, your breath, your presence</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Coming Soon
                </Badge>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (variant === 'dashboard-widget') {
    return (
      <Card className="bg-gradient-to-r from-accent/10 to-secondary/5 border-accent/20 hover:border-accent/40 transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-lg bg-accent/20">
                <Wifi className="w-5 h-5 text-accent" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-accent mb-1">Pulse-Fi Hardware</h3>
                <p className="text-sm text-muted-foreground">Wi-Fi sensing technology</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 mb-2">
                Coming Soon
              </Badge>
              <div className="text-xs text-muted-foreground">From $199 AUD</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-3 rounded-xl bg-primary/10">
              <Wifi className="w-8 h-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse flex items-center justify-center">
                <Zap className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Pulse-Fi Add-On</CardTitle>
              <p className="text-muted-foreground">Vitals + Security + Biofeedback</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Turn Wi-Fi into awareness — sense your heart, your breath, your presence, and even your space.
          </h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* What It Does */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            What It Does
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <feature.icon className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium text-sm">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            How It Works
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Small plug-in Wi-Fi module (included in kit)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Runs locally — no cameras, no cloud</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span>Seamlessly links with Sacred Shifter modules</span>
            </div>
          </div>
        </div>

        {/* Why It Matters */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-secondary" />
            Why It Matters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-secondary/10">
              <Lock className="w-6 h-6 text-secondary mx-auto mb-2" />
              <div className="font-medium text-sm">Privacy-first</div>
              <div className="text-xs text-muted-foreground">All data stays on your network</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <HomeIcon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="font-medium text-sm">Multi-purpose</div>
              <div className="text-xs text-muted-foreground">Wellness + home security</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-accent/10">
              <Sparkles className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="font-medium text-sm">One device, three features</div>
              <div className="text-xs text-muted-foreground">Vitals, Guardian, Biofeedback</div>
            </div>
          </div>
        </div>

        {/* Available Soon */}
        <div>
          <h4 className="font-semibold mb-3">Available Soon</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kits.map((kit, index) => (
              <div key={index} className="border rounded-lg p-4 bg-card">
                <div className="text-center">
                  <h5 className="font-semibold">{kit.name}</h5>
                  <div className="text-2xl font-bold text-primary my-2">{kit.price}</div>
                  <p className="text-sm text-muted-foreground mb-3">{kit.description}</p>
                  <div className="space-y-1">
                    {kit.features.map((feature, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3 opacity-60"
                    disabled
                  >
                    Pre-Order Soon
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {!isSubscribed ? (
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email for updates"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg bg-background"
              />
              <Button onClick={handleNotifyMe} className="bg-primary hover:bg-primary/90">
                <Bell className="w-4 h-4 mr-2" />
                Notify Me When Available
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t pt-6">
            <div className="text-center p-4 rounded-lg bg-primary/10 text-primary">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Bell className="w-5 h-5" />
                <span className="font-semibold">You're on the list!</span>
              </div>
              <p className="text-sm">We'll notify you when Pulse-Fi becomes available.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};