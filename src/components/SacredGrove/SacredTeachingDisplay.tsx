import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Brain, 
  Heart, 
  Zap, 
  Eye, 
  Sparkles,
  Play,
  Pause,
  Volume2,
  Star,
  Target,
  Infinity,
  Triangle,
  Circle,
  Square
} from 'lucide-react';
import { SacredTeaching, getTeachingById } from '@/data/sacredTeachings';

interface SacredTeachingDisplayProps {
  teachingId: string;
  onComplete: (insights: string[]) => void;
  isActive?: boolean;
}

export const SacredTeachingDisplay: React.FC<SacredTeachingDisplayProps> = ({
  teachingId,
  onComplete,
  isActive = false
}) => {
  const [teaching, setTeaching] = useState<SacredTeaching | null>(null);
  const [currentSection, setCurrentSection] = useState<'principle' | 'explanation' | 'practice' | 'meditation' | 'integration'>('principle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [userNotes, setUserNotes] = useState('');

  useEffect(() => {
    const teachingData = getTeachingById(teachingId);
    setTeaching(teachingData || null);
  }, [teachingId]);

  useEffect(() => {
    if (isActive && teaching) {
      // Simulate learning progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isActive, teaching]);

  if (!teaching) {
    return (
      <div className="text-center space-y-4 p-8">
        <div className="text-6xl">📚</div>
        <h3 className="text-xl font-bold text-white">Teaching Not Found</h3>
        <p className="text-white/60">This sacred teaching is not available.</p>
      </div>
    );
  }

  const sections = [
    { key: 'principle', label: 'Principle', icon: Star },
    { key: 'explanation', label: 'Explanation', icon: Brain },
    { key: 'practice', label: 'Practice', icon: Target },
    { key: 'meditation', label: 'Meditation', icon: Eye },
    { key: 'integration', label: 'Integration', icon: Heart }
  ];

  const getSectionContent = () => {
    switch (currentSection) {
      case 'principle':
        return teaching.content.principle;
      case 'explanation':
        return teaching.content.explanation;
      case 'practice':
        return teaching.content.practice;
      case 'meditation':
        return teaching.content.meditation;
      case 'integration':
        return teaching.content.integration;
      default:
        return '';
    }
  };

  const getSectionIcon = () => {
    const section = sections.find(s => s.key === currentSection);
    return section ? section.icon : Star;
  };

  const addInsight = (insight: string) => {
    if (insight.trim()) {
      setInsights(prev => [...prev, insight]);
    }
  };

  const completeTeaching = () => {
    const finalInsights = [
      ...insights,
      `Completed: ${teaching.title}`,
      `Level: ${teaching.level}`,
      `Pathway: ${teaching.pathway}`,
      userNotes
    ].filter(Boolean);
    
    onComplete(finalInsights);
  };

  const playFrequency = (frequency: number) => {
    // In a real implementation, this would play the actual frequency
    console.log(`Playing frequency: ${frequency}Hz`);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      {/* Teaching Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            {React.createElement(getSectionIcon(), { className: "w-8 h-8 text-white" })}
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white">{teaching.title}</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-white/20 text-white">
                Level {teaching.level}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white">
                {teaching.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/60">
            <span>Learning Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </motion.div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Button
              key={section.key}
              onClick={() => setCurrentSection(section.key as any)}
              variant={currentSection === section.key ? "default" : "outline"}
              className={`${
                currentSection === section.key
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {section.label}
            </Button>
          );
        })}
      </div>

      {/* Content Display */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/5 rounded-xl p-6 min-h-[300px]"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            {React.createElement(getSectionIcon(), { className: "w-5 h-5 mr-2 text-purple-400" })}
            {sections.find(s => s.key === currentSection)?.label}
          </h3>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-white/80 leading-relaxed text-lg">
              {getSectionContent()}
            </p>
          </div>

          {/* Symbols and Frequencies */}
          {currentSection === 'principle' && (
            <div className="space-y-4 pt-4 border-t border-white/20">
              <h4 className="text-lg font-semibold text-white">Sacred Symbols</h4>
              <div className="flex flex-wrap gap-2">
                {teaching.content.symbols.map((symbol, index) => (
                  <Badge key={index} variant="outline" className="border-white/20 text-white">
                    {symbol}
                  </Badge>
                ))}
              </div>

              <h4 className="text-lg font-semibold text-white">Resonance Frequencies</h4>
              <div className="flex flex-wrap gap-2">
                {teaching.content.frequencies.map((frequency, index) => (
                  <Button
                    key={index}
                    onClick={() => playFrequency(frequency)}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    {frequency}Hz
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Practice Section - Interactive Elements */}
          {currentSection === 'practice' && (
            <div className="space-y-4 pt-4 border-t border-white/20">
              <h4 className="text-lg font-semibold text-white">Interactive Practice</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Resonance Field</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-20 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg flex items-center justify-center">
                      <div className="text-white/60">Visualize your energy field</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Chakra Alignment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-1">
                      {['Root', 'Sacral', 'Solar', 'Heart', 'Throat', 'Third Eye', 'Crown'].map((chakra, index) => (
                        <div
                          key={chakra}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-60"
                          title={chakra}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Meditation Section - Guided Experience */}
          {currentSection === 'meditation' && (
            <div className="space-y-4 pt-4 border-t border-white/20">
              <h4 className="text-lg font-semibold text-white">Guided Meditation</h4>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6">
                <div className="text-center space-y-4">
                  <div className="text-4xl">🧘</div>
                  <p className="text-white/80">Close your eyes and follow the guidance...</p>
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Start'} Meditation
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* User Notes */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Your Insights & Notes</h4>
        <textarea
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          placeholder="Record your insights, experiences, and realizations as you work with this teaching..."
          className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-white/40 resize-none"
        />
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => addInsight(`Insight about ${teaching.title}: ${userNotes}`)}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Add Insight
          </Button>
        </div>
      </div>

      {/* Insights Display */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-xl p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
            Your Insights
          </h4>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-white/80 text-sm">{insight}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Completion Button */}
      {progress >= 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Button
            onClick={completeTeaching}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg px-8 py-3"
          >
            <Star className="w-5 h-5 mr-2" />
            Complete Teaching
          </Button>
        </motion.div>
      )}
    </div>
  );
};
