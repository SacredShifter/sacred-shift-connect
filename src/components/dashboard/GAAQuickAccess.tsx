/**
 * GAA Quick Access - Dashboard widget for easy GAA access
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Waves, 
  Play, 
  Info, 
  Star, 
  Moon, 
  Sun, 
  Zap, 
  BookOpen, 
  Shield,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface GAAQuickAccessProps {
  className?: string;
}

const quickArchetypes = [
  { id: 'sun', name: 'Sun XIX', icon: Sun, description: 'Gentle introduction', color: 'text-amber-500' },
  { id: 'moon', name: 'Moon XVIII', icon: Moon, description: 'Deep shadow work', color: 'text-purple-500' },
  { id: 'tower', name: 'Tower XVI', icon: Zap, description: 'Breakthrough energy', color: 'text-blue-500' },
  { id: 'devil', name: 'Devil XV', icon: Shield, description: 'Liberation work', color: 'text-red-500' },
  { id: 'death', name: 'Death XIII', icon: BookOpen, description: 'Transformation', color: 'text-green-500' }
];

export const GAAQuickAccess: React.FC<GAAQuickAccessProps> = ({ className = '' }) => {
  return (
    <Card className={`bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
            <Waves className="w-4 h-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            GAA Engine
          </span>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            New
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Advanced consciousness harmonization using sacred geometry and precise frequencies.
        </p>
        
        {/* Quick Archetype Selection */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Quick Start Archetypes
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {quickArchetypes.slice(0, 4).map((archetype, index) => (
              <motion.div
                key={archetype.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/gaa?archetype=${archetype.id}`}
                  className="block p-2 rounded border hover:border-primary/50 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2">
                    <archetype.icon className={`w-3 h-3 ${archetype.color}`} />
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">
                        {archetype.name}
                      </div>
                      <div className="text-muted-foreground">
                        {archetype.description}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <Link to="/gaa">
            <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
              <Play className="w-4 h-4 mr-2" />
              Enter GAA Dashboard
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          <Link to="/guidebook#gaa">
            <Button variant="outline" className="w-full border-indigo-500/30 text-indigo-600 hover:bg-indigo-500/10">
              <Info className="w-4 h-4 mr-2" />
              Learn About GAA
            </Button>
          </Link>
        </div>
        
        {/* Features Highlight */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="w-3 h-3 text-amber-500" />
            <span>5 Archetypes</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Waves className="w-3 h-3 text-cyan-500" />
            <span>Cosmic Viz</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Shield className="w-3 h-3 text-green-500" />
            <span>Safety First</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="w-3 h-3 text-blue-500" />
            <span>Full Guide</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};