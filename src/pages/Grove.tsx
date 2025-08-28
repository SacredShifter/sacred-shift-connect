import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SacredGrove } from "@/components/SacredGrove/SacredGrove";
import ProtectedRoute from '@/components/ProtectedRoute';
import { Slogan } from '@/components/ui/Slogan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Star, Zap, ArrowLeft, BookOpen, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Grove() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get('tab');

  const handleClose = () => {
    navigate('/');
  };

  return (
    <ProtectedRoute>
      <div className="h-full">
        <Slogan variant="watermark" />
        {tab === '3d-modules' ? (
          <div className="p-6 space-y-6 animate-fade-in">
            {/* Grove Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                🌳 Sacred Grove - 3D Modules
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Immersive 3D learning experiences are coming soon.
              </p>
            </motion.div>

            {/* Placeholder for 3D Learning Modules */}
            <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-600" />
                  Interactive Learning Modules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  3D modules are temporarily disabled for stability. Check back soon for immersive learning experiences.
                </p>
                
                {/* Module Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "Sacred Geometry", icon: Star, description: "Explore the mathematical patterns of creation" },
                    { title: "Chakra System", icon: Zap, description: "Interactive energy center alignment" },
                    { title: "Heart Coherence", icon: Heart, description: "Develop emotional and energetic balance" },
                    { title: "Consciousness Maps", icon: Brain, description: "Navigate states of awareness" },
                    { title: "Group Practices", icon: Users, description: "Collective spiritual experiences" },
                    { title: "Ceremonial Spaces", icon: Calendar, description: "Sacred ritual environments" }
                  ].map((module, index) => (
                    <motion.div
                      key={module.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-md transition-shadow cursor-not-allowed opacity-75">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <module.icon className="w-4 h-4 text-emerald-600" />
                            <h3 className="font-medium text-sm">{module.title}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground">{module.description}</p>
                          <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Back Navigation */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center"
            >
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="hover:scale-105 transition-transform"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </motion.div>
          </div>
        ) : (
          <SacredGrove isVisible={true} onClose={handleClose} />
        )}
      </div>
    </ProtectedRoute>
  );
}