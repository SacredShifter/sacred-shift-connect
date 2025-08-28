import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  Calendar, 
  TrendingUp,
  Eye,
  Heart,
  PenTool,
  Feather,
  Zap,
  Search,
  Filter,
  Clock,
  Infinity as InfinityIcon
} from 'lucide-react';
import { useSacredJournal } from '@/hooks/useSacredJournal';
import { EntryModeSelector } from './journal/EntryModeSelector';
import { ResonanceTagPicker } from './journal/ResonanceTagPicker';
import { JournalVisualization } from './journal/JournalVisualization';
import { MirrorBackInterface } from './journal/MirrorBackInterface';
import { VoiceJournalRecorder } from './journal/VoiceJournalRecorder';
import { format, formatDistanceToNow } from 'date-fns';

export type EntryMode = 'stream' | 'reflection' | 'transmutation' | 'integration';

export const SacredJournalInterface: React.FC = () => {
  const { 
    entries, 
    createEntry, 
    updateEntry, 
    deleteEntry, 
    loading, 
    error 
  } = useSacredJournal();

  const [selectedMode, setSelectedMode] = useState<EntryMode>('stream');
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showMirrorBack, setShowMirrorBack] = useState(false);
  const [mirrorBackText, setMirrorBackText] = useState('');
  const [viewMode, setViewMode] = useState<'write' | 'view' | 'evolve'>('write');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const entryModes = [
    {
      id: 'stream' as EntryMode,
      name: 'Stream',
      description: 'Free-flow consciousness writing',
      icon: Feather,
      color: 'from-blue-500 to-cyan-500',
      prompt: 'Let your consciousness flow freely onto the page...'
    },
    {
      id: 'reflection' as EntryMode,
      name: 'Reflection',
      description: 'Guided introspection and insight',
      icon: Eye,
      color: 'from-purple-500 to-violet-500',
      prompt: 'What awareness arose during your practice today?'
    },
    {
      id: 'transmutation' as EntryMode,
      name: 'Transmutation',
      description: 'Shadow release and reframing',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      prompt: 'What energy needs to be transformed within you?'
    },
    {
      id: 'integration' as EntryMode,
      name: 'Integration',
      description: 'Crystallize lessons into action',
      icon: InfinityIcon,
      color: 'from-green-500 to-emerald-500',
      prompt: 'How will you embody this wisdom in your daily life?'
    }
  ];

  const currentModeData = entryModes.find(mode => mode.id === selectedMode);

  const handleSaveEntry = async () => {
    if (!currentEntry.trim()) return;

    try {
      await createEntry({
        title: currentTitle || `${currentModeData?.name} Entry`,
        content: currentEntry,
        entry_mode: selectedMode,
        resonance_tags: selectedTags,
        voice_transcription: isVoiceMode
      });

      // Generate Mirror Back if content is substantial
      if (currentEntry.length > 100) {
        setMirrorBackText(generateMirrorBack(currentEntry));
        setShowMirrorBack(true);
      }

      // Clear form
      setCurrentEntry('');
      setCurrentTitle('');
      setSelectedTags([]);
      setIsVoiceMode(false);
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const generateMirrorBack = (content: string): string => {
    // Simple AI-like reflection - in production, this would use actual AI
    const words = content.toLowerCase().split(' ');
    const keyWords = words.filter(word => 
      word.length > 4 && 
      !['that', 'this', 'with', 'have', 'they', 'from', 'would', 'there', 'their'].includes(word)
    );
    
    const essenceWords = keyWords.slice(0, 3).join(', ');
    
    const reflections = [
      `Your essence speaks of ${essenceWords}. Trust this unfolding.`,
      `The pattern I witness is one of ${essenceWords}. This is your medicine.`,
      `Your soul's truth emerges through ${essenceWords}. Honor this knowing.`,
      `I reflect back your core essence: ${essenceWords}. This is your power.`
    ];
    
    return reflections[Math.floor(Math.random() * reflections.length)];
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterTag || (entry.resonance_tags && entry.resonance_tags.includes(filterTag)) || entry.mood_tag === filterTag;
    return matchesSearch && matchesFilter;
  });

  const uniqueTags = Array.from(new Set([
    ...entries.flatMap(entry => entry.resonance_tags || []),
    ...entries.map(entry => entry.mood_tag).filter(Boolean),
    ...entries.map(entry => entry.chakra_alignment).filter(Boolean)
  ].filter(Boolean) as string[]));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <JournalVisualization 
        mode={selectedMode} 
        isWriting={currentEntry.length > 0}
        resonanceTags={selectedTags}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-gradient-to-r from-primary to-secondary rounded-full"
              >
                <BookOpen className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-light text-foreground">Sacred Mirror Journal</h1>
                <p className="text-muted-foreground">Consciousness interface for integration</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'write' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('write')}
              >
                <PenTool className="h-4 w-4 mr-2" />
                Write
              </Button>
              <Button
                variant={viewMode === 'view' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('view')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button
                variant={viewMode === 'evolve' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('evolve')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Evolve
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'write' && (
              <motion.div
                key="write"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Entry Mode Selection */}
                <EntryModeSelector
                  modes={entryModes}
                  selectedMode={selectedMode}
                  onModeChange={(mode) => setSelectedMode(mode as EntryMode)}
                />

                {/* Writing Interface */}
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        {currentModeData?.icon && <currentModeData.icon className="w-5 h-5" />}
                        {currentModeData?.name} Entry
                    </CardTitle>
                      <VoiceJournalRecorder
                        onTranscription={(text) => {
                          setCurrentEntry(prev => prev + ' ' + text);
                          setIsVoiceMode(true);
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      {currentModeData?.prompt}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input
                      type="text"
                      placeholder="Entry title (optional)"
                      value={currentTitle}
                      onChange={(e) => setCurrentTitle(e.target.value)}
                      className="w-full bg-transparent border-none text-lg font-medium placeholder:text-muted-foreground focus:outline-none"
                    />
                    
                    <textarea
                      value={currentEntry}
                      onChange={(e) => setCurrentEntry(e.target.value)}
                      placeholder="Begin your sacred writing..."
                      className="w-full h-64 bg-transparent border-none resize-none placeholder:text-muted-foreground focus:outline-none text-foreground"
                    />

                    <ResonanceTagPicker
                      selectedTags={selectedTags}
                      onTagsChange={setSelectedTags}
                    />

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        {currentEntry.length} characters
                        {isVoiceMode && (
                          <Badge variant="secondary" className="ml-2">
                            Voice Transcribed
                          </Badge>
                        )}
                      </div>
                      <Button 
                        onClick={handleSaveEntry}
                        disabled={!currentEntry.trim()}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Integrate Entry
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Mirror Back Interface */}
                <AnimatePresence>
                  {showMirrorBack && (
                    <MirrorBackInterface
                      mirrorText={mirrorBackText}
                      onClose={() => setShowMirrorBack(false)}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {viewMode === 'view' && (
              <motion.div
                key="view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Search and Filter */}
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search your entries..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <select
                        value={filterTag || ''}
                        onChange={(e) => setFilterTag(e.target.value || null)}
                        className="px-3 py-2 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary"
                      >
                        <option value="">All Tags</option>
                        {uniqueTags.map((tag, index) => (
                          <option key={`tag-${index}-${tag}`} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Entries List */}
                <div className="space-y-4">
                  {filteredEntries.length === 0 ? (
                    <Card className="bg-card/30">
                      <CardContent className="p-8 text-center">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">
                          {entries.length === 0 
                            ? "Your journal awaits your first sacred entry"
                            : "No entries match your search"
                          }
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredEntries.map(entry => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        layout
                      >
                        <Card className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full bg-gradient-to-r ${
                                  entryModes.find(m => m.id === entry.entry_mode)?.color || 'from-gray-400 to-gray-600'
                                }`}>
                                  {(() => {
                                    const IconComponent = entryModes.find(m => m.id === entry.entry_mode)?.icon;
                                    return IconComponent ? <IconComponent className="w-4 h-4 text-white" /> : null;
                                  })()}
                                </div>
                                <div>
                                  <h3 className="font-medium">{entry.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(entry.created_at), 'MMM d, yyyy')} • 
                                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                              </div>
                              {entry.is_draft && (
                                <Badge variant="secondary">Draft</Badge>
                              )}
                            </div>
                            
                            <p className="text-foreground/80 mb-4 line-clamp-3">
                              {entry.content}
                            </p>
                            
                            {entry.resonance_tags && entry.resonance_tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {entry.resonance_tags.map(tag => (
                                  <Badge 
                                    key={tag} 
                                    variant="outline" 
                                    className="bg-primary/10 hover:bg-primary/20 cursor-pointer"
                                    onClick={() => setFilterTag(tag)}
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {viewMode === 'evolve' && (
              <motion.div
                key="evolve"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Evolution Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Coming soon: Timeline view, resonance analysis, integration threads, and pattern recognition.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-background/50 rounded-lg border border-primary/20">
                        <h4 className="font-medium mb-2">Total Entries</h4>
                        <p className="text-2xl font-bold text-primary">{entries.length}</p>
                      </div>
                      <div className="p-4 bg-background/50 rounded-lg border border-primary/20">
                        <h4 className="font-medium mb-2">Unique Tags</h4>
                        <p className="text-2xl font-bold text-secondary">{uniqueTags.length}</p>
                      </div>
                      <div className="p-4 bg-background/50 rounded-lg border border-primary/20">
                        <h4 className="font-medium mb-2">Integration Level</h4>
                        <p className="text-2xl font-bold text-emerald-500">Rising</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};