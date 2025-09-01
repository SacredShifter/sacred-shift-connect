import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, Book, MessageCircle, ExternalLink, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { useState } from 'react';

export default function Help() {
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);
  const helpCategories = [
    {
      title: "Getting Started",
      description: "New to Sacred Shifter? Start here",
      icon: Book,
      items: [
        "Setting up your profile",
        "Understanding the Sacred Navigation",
        "Your first consciousness practice",
        "Joining circles and communities"
      ]
    },
    {
      title: "Practice & Tools", 
      description: "Master the sacred technologies",
      icon: LifeBuoy,
      items: [
        "Breath of Source techniques",
        "Meditation guidance",
        "Sacred journaling methods",
        "Consciousness mapping basics"
      ]
    },
    {
      title: "Community",
      description: "Connect with fellow seekers",
      icon: MessageCircle,
      items: [
        "Circle participation guidelines",
        "Messaging and communication",
        "Building sacred connections",
        "Collective resonance practices"
      ]
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <LifeBuoy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Sacred Support Center</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your guide to navigating the Sacred Shifter consciousness platform
        </p>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          Always here to help your journey
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {helpCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title} className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <div className="w-1 h-1 rounded-full bg-primary/60" />
                    {item}
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full mt-4 justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Explore {category.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Need Personal Support?
          </CardTitle>
          <CardDescription>
            Connect with our consciousness support team for personalized guidance
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline">
              Schedule Sacred Session
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Available for consciousness guidance 24/7 • Response within 4 hours
          </p>
        </CardContent>
      </Card>

      {/* Deeper Knowledge Section */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setShowDeeperKnowledge(!showDeeperKnowledge)}
          className="gap-2"
        >
          <BookOpen className="w-4 h-4" />
          {showDeeperKnowledge ? 'Hide' : 'Show'} Deeper Knowledge
          {showDeeperKnowledge ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Teaching Layer */}
      {showDeeperKnowledge && (
        <div className="mt-6">
          <TeachingLayer
            content={ALL_MODULE_TEACHINGS.help}
            moduleId="help"
          />
        </div>
      )}
    </div>
  );
}