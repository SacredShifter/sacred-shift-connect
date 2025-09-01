import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TreePine, 
  Sparkles, 
  Heart, 
  Users, 
  BookOpen,
  Brain,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Pathway {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  features: string[];
}

const SacredGrove: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const pathways: Pathway[] = [
    {
      id: 'inner-wisdom',
      title: 'Inner Wisdom',
      description: 'Journey deep within to discover your authentic truth and inner guidance.',
      icon: <Heart className="h-8 w-8" />,
      color: 'from-rose-500 to-pink-600',
      route: '/journal',
      features: [
        'Sacred Self-Reflection',
        'Intuitive Guidance',
        'Heart-Centered Awareness',
        'Emotional Integration'
      ]
    },
    {
      id: 'collective-consciousness',
      title: 'Collective Consciousness',
      description: 'Connect with the shared wisdom and collective awakening of humanity.',
      icon: <Users className="h-8 w-8" />,
      color: 'from-blue-500 to-indigo-600',
      route: '/circles',
      features: [
        'Sacred Circles',
        'Community Wisdom',
        'Collective Healing',
        'Shared Experiences'
      ]
    },
    {
      id: 'cosmic-connection',
      title: 'Cosmic Connection',
      description: 'Expand your awareness to the infinite wisdom of the cosmos.',
      icon: <Globe className="h-8 w-8" />,
      color: 'from-purple-500 to-violet-600',
      route: '/learning-3d',
      features: [
        'Universal Patterns',
        'Sacred Geometry',
        'Cosmic Consciousness',
        'Infinite Perspectives'
      ]
    }
  ];

  const handlePathwaySelect = (pathway: Pathway) => {
    setSelectedPathway(pathway.id);
    navigate(pathway.route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Grove Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 space-y-6"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <TreePine className="h-16 w-16 text-emerald-600" />
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Sacred Grove
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Three pathways to collective wisdom and sacred community
            </p>
          </div>
        </div>

        {/* Sacred Quote */}
        <div className="max-w-2xl mx-auto">
          <blockquote className="text-lg italic text-foreground/80">
            "In the sacred grove, three paths converge - the journey within, the journey with others, 
            and the journey to the infinite. Choose your path, but know that all paths lead home."
          </blockquote>
          <cite className="text-sm text-muted-foreground mt-2 block">— Ancient Grove Teachings</cite>
        </div>
      </motion.div>

      {/* Three Sacred Pathways */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-3 gap-8">
          {pathways.map((pathway, index) => (
            <motion.div
              key={pathway.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 + 0.3 }}
              className="group"
            >
              <Card 
                className="h-full cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-primary/20 bg-white/80 backdrop-blur-sm overflow-hidden"
                onClick={() => handlePathwaySelect(pathway)}
              >
                <div className={`h-2 bg-gradient-to-r ${pathway.color}`} />
                
                <CardContent className="p-8 text-center space-y-6">
                  {/* Pathway Icon */}
                  <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r ${pathway.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    {pathway.icon}
                  </div>

                  {/* Pathway Title */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {pathway.title}
                    </h2>
                    <p className="text-muted-foreground mt-3 leading-relaxed">
                      {pathway.description}
                    </p>
                  </div>

                  {/* Pathway Features */}
                  <div className="space-y-3">
                    {pathway.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + featureIndex * 0.1 + 0.5 }}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <Sparkles className="h-4 w-4 text-primary/60" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pathway CTA */}
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className={`w-full border-2 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:${pathway.color} group-hover:text-white group-hover:border-transparent group-hover:shadow-lg`}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Enter Sacred Path
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sacred Grove Wisdom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-emerald-100/50 to-teal-100/50 border-emerald-200/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Heart className="h-8 w-8 text-emerald-600" />
                <Users className="h-8 w-8 text-blue-600" />
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                The Sacred Grove Awaits
              </h3>
              
              <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Each pathway offers unique gifts, yet all are interconnected in the web of sacred wisdom. 
                Whether you seek to heal, to connect, or to explore the mysteries of existence, 
                the grove holds space for your journey. Choose with your heart, and trust that 
                your path will reveal exactly what you need when you need it.
              </p>
              
              <div className="mt-8 flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">∞</div>
                  <div className="text-xs text-muted-foreground">Infinite Wisdom</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">◉</div>
                  <div className="text-xs text-muted-foreground">Sacred Unity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">◈</div>
                  <div className="text-xs text-muted-foreground">Divine Truth</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SacredGrove;