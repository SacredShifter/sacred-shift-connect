import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GitBranch, 
  Compass, 
  Star, 
  Infinity,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WisdomConnection {
  title: string;
  description: string;
  modules: string[];
  paths: string[];
  sacred_principle: string;
  resonance_frequency: string;
}

const wisdomConnections: WisdomConnection[] = [
  {
    title: "The Breath-Heart-Mind Triad",
    description: "Sacred trinity of consciousness regulation through breath, emotional coherence, and mental clarity.",
    modules: ["breath", "journal", "grove"],
    paths: ["/breath", "/journal", "/grove"],
    sacred_principle: "As above, so below - the cosmic rhythm mirrors in breath, heart, and mind",
    resonance_frequency: "Parasympathetic coherence at 7.83Hz"
  },
  {
    title: "Community Resonance Field", 
    description: "Individual awakening amplified through collective consciousness and shared wisdom.",
    modules: ["circles", "messages", "grove"],
    paths: ["/circles", "/messages", "/grove"],
    sacred_principle: "Where two or three gather in sacred intention, divine presence emerges",
    resonance_frequency: "Collective oxytocin and mirror neuron synchronization"
  },
  {
    title: "Wisdom Preservation & Transmission",
    description: "Ancient knowledge flows through modern vessels - codex, library, and constellation mapping.",
    modules: ["codex", "library", "constellation"],
    paths: ["/codex", "/video-library", "/constellation-mapper"],
    sacred_principle: "The akashic records accessible through conscious documentation",
    resonance_frequency: "Information coherence and pattern recognition enhancement"
  },
  {
    title: "The Hermetic Integration Path",
    description: "Seven sacred laws woven through every practice - the complete curriculum of consciousness evolution.",
    modules: ["mentalism", "correspondence", "vibration", "polarity"],
    paths: ["/learn/hermetic/mentalism", "/learn/hermetic/correspondence", "/learn/hermetic/vibration", "/learn/hermetic/polarity"],
    sacred_principle: "All is mind, all is connected, all is vibrational law",
    resonance_frequency: "Universal harmonic resonance across all dimensions"
  }
];

interface WisdomPathwaysProps {
  currentModule?: string;
  className?: string;
}

export const WisdomPathways: React.FC<WisdomPathwaysProps> = ({ 
  currentModule,
  className = ''
}) => {
  const navigate = useNavigate();

  const getRelevantConnections = () => {
    if (!currentModule) return wisdomConnections;
    return wisdomConnections.filter(connection => 
      connection.modules.includes(currentModule)
    );
  };

  const relevantConnections = getRelevantConnections();

  return (
    <Card className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-200/30 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
            <GitBranch className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-sacred text-indigo-300">Wisdom Pathways</h3>
            <p className="text-sm text-muted-foreground font-normal">
              Discover the sacred connections between all teachings
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {relevantConnections.map((connection, index) => (
          <motion.div
            key={connection.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border/50 hover:border-indigo-400/50 transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-semibold text-indigo-300 flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    {connection.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {connection.description}
                  </p>
                </div>
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-400/30">
                  {connection.modules.length} modules
                </Badge>
              </div>

              {/* Sacred Principle */}
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-3 border border-purple-400/20">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-medium text-purple-300 mb-1">Sacred Principle</h5>
                    <p className="text-xs text-purple-200 italic">
                      "{connection.sacred_principle}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Resonance Frequency */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-3 border border-cyan-400/20">
                <div className="flex items-start gap-2">
                  <Infinity className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-medium text-cyan-300 mb-1">Resonance Pattern</h5>
                    <p className="text-xs text-cyan-200">
                      {connection.resonance_frequency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connected Modules */}
              <div className="flex flex-wrap gap-2">
                {connection.paths.map((path, pathIndex) => (
                  <Button
                    key={path}
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(path)}
                    className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-400/30 hover:bg-indigo-500/20 text-indigo-200 hover:text-indigo-100"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {connection.modules[pathIndex]}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {currentModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-lg border border-violet-400/20"
          >
            <p className="text-sm text-violet-200 italic">
              Your journey through <span className="font-semibold text-violet-100">{currentModule}</span> is 
              weaving into the greater tapestry of consciousness evolution.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};