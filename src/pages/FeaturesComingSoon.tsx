import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Circle, 
  Users, 
  Video, 
  Mic, 
  Brain, 
  Sparkles, 
  Calendar,
  BarChart3,
  Zap,
  Globe,
  Heart,
  Target,
  Infinity,
  Waves,
  Eye,
  Crown,
  Shield
} from "lucide-react";

export default function FeaturesComingSoon() {
  const circleFeatures = [
    {
      title: "Sacred Circle Analytics",
      description: "Deep insights into circle energy patterns, member resonance, and collective growth metrics",
      icon: BarChart3,
      progress: 75,
      timeline: "January 2025",
      priority: "high"
    },
    {
      title: "Circle Video Spaces",
      description: "Immersive 3D video environments for circle gatherings with spatial audio and presence",
      icon: Video,
      progress: 60,
      timeline: "February 2025",
      priority: "high"
    },
    {
      title: "Quantum Intention Setting",
      description: "Collective intention manifestation tools with quantum coherence measurement",
      icon: Target,
      progress: 45,
      timeline: "March 2025",
      priority: "medium"
    },
    {
      title: "Circle Wisdom AI",
      description: "AI moderator that facilitates deeper conversations and provides sacred insights",
      icon: Brain,
      progress: 30,
      timeline: "April 2025",
      priority: "medium"
    },
    {
      title: "Sacred Ritual Designer",
      description: "Tools to create and share guided rituals, ceremonies, and transformational practices",
      icon: Sparkles,
      progress: 20,
      timeline: "May 2025",
      priority: "low"
    },
    {
      title: "Global Circle Network",
      description: "Connect with circles worldwide based on resonance, interests, and spiritual paths",
      icon: Globe,
      progress: 15,
      timeline: "Q3 2025",
      priority: "low"
    }
  ];

  const platformFeatures = [
    {
      title: "Enhanced Voice Calling",
      description: "Crystal-clear voice calls with binaural beats and healing frequency integration",
      icon: Mic,
      progress: 85,
      timeline: "December 2024",
      priority: "high"
    },
    {
      title: "Sacred Journal Timeline",
      description: "Visual timeline view with resonance analysis and pattern recognition",
      icon: Calendar,
      progress: 70,
      timeline: "January 2025",
      priority: "high"
    },
    {
      title: "Consciousness Tracking",
      description: "Monitor your spiritual growth with advanced biometric and energy tracking",
      icon: Waves,
      progress: 55,
      timeline: "February 2025",
      priority: "medium"
    },
    {
      title: "AR Sacred Geometry",
      description: "Augmented reality overlays of sacred geometry in your physical space",
      icon: Eye,
      progress: 40,
      timeline: "March 2025",
      priority: "medium"
    },
    {
      title: "Premium Learning Modules",
      description: "Advanced 3D immersive experiences for deep spiritual learning",
      icon: Crown,
      progress: 35,
      timeline: "April 2025",
      priority: "medium"
    },
    {
      title: "Quantum Security",
      description: "Quantum-encrypted communications for the most sacred conversations",
      icon: Shield,
      progress: 25,
      timeline: "Q3 2025",
      priority: "low"
    }
  ];

  const integrationFeatures = [
    {
      title: "Wearables Integration",
      description: "Connect with Apple Watch, Fitbit, and other devices for holistic tracking",
      icon: Heart,
      progress: 60,
      timeline: "February 2025",
      priority: "high"
    },
    {
      title: "Meditation Apps Sync",
      description: "Seamlessly integrate with Headspace, Calm, and other meditation platforms",
      icon: Infinity,
      progress: 45,
      timeline: "March 2025",
      priority: "medium"
    },
    {
      title: "Calendar Integration",
      description: "Sync sacred practices and circle meetings with your existing calendar apps",
      icon: Calendar,
      progress: 30,
      timeline: "April 2025",
      priority: "medium"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const FeatureCard = ({ feature }: { feature: any }) => (
    <Card className="h-full border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <feature.icon className="w-8 h-8 text-primary mb-2" />
          <Badge variant={getPriorityColor(feature.priority) as any} className="text-xs">
            {feature.priority}
          </Badge>
        </div>
        <CardTitle className="text-lg">{feature.title}</CardTitle>
        <CardDescription className="text-sm">{feature.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="text-primary font-medium">{feature.progress}%</span>
          </div>
          <Progress value={feature.progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Expected: {feature.timeline}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-primary/5 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-10 h-10 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Features Coming Soon
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the revolutionary features we're building to enhance your sacred journey 
            and deepen connections within your circles of consciousness.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-primary/20">
            <CardHeader>
              <Circle className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Circle Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">6</div>
              <p className="text-sm text-muted-foreground">New circle capabilities</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-primary/20">
            <CardHeader>
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Platform Enhancements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">6</div>
              <p className="text-sm text-muted-foreground">Core improvements</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-primary/20">
            <CardHeader>
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <p className="text-sm text-muted-foreground">External connections</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Categories */}
        <Tabs defaultValue="circles" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="circles" className="flex items-center gap-2">
              <Circle className="w-4 h-4" />
              Sacred Circles
            </TabsTrigger>
            <TabsTrigger value="platform" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Platform
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="circles" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Circle className="w-6 h-6 text-primary" />
                Sacred Circle Features
              </h2>
              <p className="text-muted-foreground mb-6">
                Revolutionary features to enhance sacred circle experiences, deepen connections, 
                and facilitate profound collective transformation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {circleFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="platform" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Platform Enhancements
              </h2>
              <p className="text-muted-foreground mb-6">
                Core platform improvements to elevate your personal spiritual practice 
                and consciousness development journey.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Integration Features
              </h2>
              <p className="text-muted-foreground mb-6">
                Seamless connections with your favorite apps and devices to create 
                a unified consciousness development ecosystem.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrationFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg border border-primary/20">
          <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            These features are actively in development. Your feedback and suggestions 
            help shape the future of Sacred Shifter. Join our community to influence 
            what gets built next.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-sm px-3 py-1">
              Community Driven
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              Open Source Spirit
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              Sacred Technology
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}