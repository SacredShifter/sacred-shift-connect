import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Play, BookOpen, Sparkles, Zap } from 'lucide-react';
import { EnhancedChakraData, ModuleBell } from '@/data/enhancedChakraData';
import { useNavigate } from 'react-router-dom';

interface ChakraDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  chakra: EnhancedChakraData;
  bell: ModuleBell;
}

export const ChakraDetailModal: React.FC<ChakraDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  chakra, 
  bell 
}) => {
  const navigate = useNavigate();

  // Direct mapping from module IDs to routes
  const moduleIdToRoute: Record<string, string> = {
    // Root Chakra
    'dashboard': '/dashboard',
    'profile': '/profile', 
    'settings': '/settings',
    // Sacral Chakra
    'journal': '/journal',
    'messages': '/messages',
    'library': '/library',
    // Solar Plexus
    'gaa': '/gaa',
    'learning-3d': '/learning-3d',
    'labs': '/labs',
    // Heart Chakra
    'circles': '/circles',
    'grove': '/grove',
    'feed': '/feed',
    'collective': '/collective',
    // Throat Chakra
    'codex': '/codex',
    'breath': '/breath',
    'help': '/help',
    'guidebook': '/guidebook',
    // Third Eye
    'meditation': '/meditation',
    'shift': '/shift',
    // Crown Chakra
    'journey-map': '/journey-map',
    'liberation': '/liberation'
  };

  const getModuleLink = () => {
    return moduleIdToRoute[bell.moduleId] || '/dashboard';
  };

  const handleStartPractice = () => {
    const moduleLink = getModuleLink();
    navigate(moduleLink);
    onClose();
  };

  const handleOpenJournal = () => {
    navigate('/journal', { state: { chakraContext: chakra.id, bellContext: bell.moduleId } });
    onClose();
  };

  const handleNavigateToModule = () => {
    const moduleLink = getModuleLink();
    navigate(moduleLink);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-background/95 backdrop-blur-md border-2" style={{ borderColor: chakra.color + '40' }}>
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute right-2 top-2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ 
                    backgroundColor: chakra.color,
                    boxShadow: `0 0 20px ${chakra.color}40`
                  }}
                >
                  {chakra.sanskrit.charAt(0)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{bell.moduleName}</CardTitle>
                  <p className="text-lg text-muted-foreground">{chakra.name} • {chakra.sanskrit}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" style={{ borderColor: chakra.color, color: chakra.color }}>
                      {bell.note} - {bell.frequency}Hz
                    </Badge>
                    <Badge variant={bell.isCompleted ? "default" : "secondary"}>
                      {bell.isCompleted ? "Completed" : bell.isUnlocked ? "Available" : "Locked"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Chakra Overview */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" style={{ color: chakra.color }} />
                  Chakra Essence
                </h3>
                <p className="text-muted-foreground mb-3">{chakra.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Element:</strong> {chakra.element}
                  </div>
                  <div>
                    <strong>Base Frequency:</strong> {chakra.baseFrequency}
                  </div>
                  <div className="col-span-2">
                    <strong>Theme:</strong> {chakra.theme}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Module Focus */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2" style={{ color: chakra.color }} />
                  Practice Focus
                </h3>
                <div className="bg-muted/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    This module resonates at <strong>{bell.frequency}Hz</strong> in the key of <strong>{bell.note}</strong>, 
                    specifically designed to activate and balance your {chakra.name.toLowerCase()}.
                  </p>
                  <p className="text-sm">
                    <strong>Affirmation:</strong> "{chakra.affirmation}"
                  </p>
                </div>
              </div>

              {/* Qualities */}
              <div>
                <h4 className="font-medium mb-2">Key Qualities</h4>
                <div className="flex flex-wrap gap-2">
                  {chakra.qualities.map((quality, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: chakra.color + '40' }}
                    >
                      {quality}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Navigation & Action Buttons */}
              <div className="space-y-3">
                {/* Primary Module Navigation */}
                <Button 
                  onClick={handleNavigateToModule}
                  className="w-full"
                  style={{ backgroundColor: chakra.color }}
                  disabled={!bell.isUnlocked}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Enter {bell.moduleName}
                </Button>
                
                {/* Secondary Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleStartPractice}
                    variant="outline"
                    className="flex-1"
                    style={{ borderColor: chakra.color, color: chakra.color }}
                    disabled={!bell.isUnlocked}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {bell.isCompleted ? "Practice Again" : "Start Practice"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleOpenJournal}
                    className="flex-1"
                    style={{ borderColor: chakra.color, color: chakra.color }}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Open Journal
                  </Button>
                </div>
              </div>

              {/* Progress Note */}
              <div className="text-xs text-muted-foreground text-center bg-muted/10 rounded-lg p-3">
                {bell.isCompleted ? (
                  <span className="text-green-600">✨ You've completed this practice! The resonance continues to strengthen your chakra.</span>
                ) : bell.isUnlocked ? (
                  "Ready to begin this sacred practice. Your journey through the chakras deepens with each resonance."
                ) : (
                  "This practice will unlock as you progress through the earlier chakra modules."
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};