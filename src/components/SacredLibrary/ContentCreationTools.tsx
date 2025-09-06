import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Upload, 
  Mic, 
  Camera, 
  FileText, 
  Video, 
  Image, 
  Audio,
  Save,
  Share2,
  Eye,
  Edit3,
  Trash2,
  Tag,
  Link,
  Bookmark,
  Heart,
  MessageCircle,
  Sparkles,
  Brain,
  Lightbulb,
  Crown,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ConsciousnessProfile } from '@/types/consciousness';

interface ContentAnnotation {
  id: string;
  contentId: string;
  userId: string;
  type: 'insight' | 'question' | 'practice' | 'experience' | 'teaching';
  text: string;
  timestamp?: number; // For video/audio content
  position?: { x: number; y: number }; // For image content
  tags: string[];
  consciousnessLevel: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContentCreation {
  id?: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'image' | 'article' | 'meditation' | 'practice';
  content: File | string; // File for uploads, string for text content
  tags: string[];
  consciousnessLevel: string;
  energyFrequency: string;
  chakraFocus: string[];
  lunarTiming: string;
  isPublic: boolean;
  allowAnnotations: boolean;
  allowComments: boolean;
  metadata: {
    duration?: number;
    size?: number;
    format?: string;
    resolution?: string;
  };
}

interface ContentCreationToolsProps {
  userProfile: ConsciousnessProfile | null;
  onContentCreate: (content: ContentCreation) => void;
  onAnnotationCreate: (annotation: ContentAnnotation) => void;
  onAnnotationUpdate: (annotation: ContentAnnotation) => void;
  onAnnotationDelete: (annotationId: string) => void;
}

export const ContentCreationTools: React.FC<ContentCreationToolsProps> = ({
  userProfile,
  onContentCreate,
  onAnnotationCreate,
  onAnnotationUpdate,
  onAnnotationDelete
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'annotate' | 'journal'>('create');
  const [isCreating, setIsCreating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Content creation state
  const [newContent, setNewContent] = useState<ContentCreation>({
    title: '',
    description: '',
    type: 'article',
    content: '',
    tags: [],
    consciousnessLevel: userProfile?.current_level || 'initiate',
    energyFrequency: userProfile?.energy_frequency_preference || '528Hz',
    chakraFocus: [],
    lunarTiming: 'any',
    isPublic: false,
    allowAnnotations: true,
    allowComments: true,
    metadata: {}
  });

  // Annotation state
  const [newAnnotation, setNewAnnotation] = useState<Partial<ContentAnnotation>>({
    type: 'insight',
    text: '',
    tags: [],
    consciousnessLevel: userProfile?.current_level || 'initiate',
    isPublic: true
  });

  // Journal state
  const [journalEntry, setJournalEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    energyLevel: 5,
    insights: '',
    gratitude: '',
    tags: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const contentTypes = [
    { value: 'video', label: 'Video', icon: Video, description: 'Upload or record a video' },
    { value: 'audio', label: 'Audio', icon: Audio, description: 'Upload or record audio' },
    { value: 'image', label: 'Image', icon: Image, description: 'Upload an image' },
    { value: 'article', label: 'Article', icon: FileText, description: 'Write an article' },
    { value: 'meditation', label: 'Meditation', icon: Brain, description: 'Create a meditation guide' },
    { value: 'practice', label: 'Practice', icon: Sparkles, description: 'Document a practice' }
  ];

  const consciousnessLevels = [
    'initiate', 'seeker', 'student', 'adept', 'practitioner', 
    'teacher', 'master', 'guardian', 'sage', 'enlightened', 
    'transcendent', 'cosmic'
  ];

  const energyFrequencies = [
    { value: '528Hz', label: '528Hz - Love Frequency', color: '#FF6B6B' },
    { value: '432Hz', label: '432Hz - Nature\'s Frequency', color: '#4ECDC4' },
    { value: '741Hz', label: '741Hz - Expression Frequency', color: '#45B7D1' },
    { value: '852Hz', label: '852Hz - Intuition Frequency', color: '#96CEB4' }
  ];

  const chakraOptions = [
    'root', 'sacral', 'solar_plexus', 'heart', 'throat', 'third_eye', 'crown'
  ];

  const lunarTimings = [
    'any', 'new', 'waxing', 'full', 'waning'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewContent(prev => ({ ...prev, content: file }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Set metadata
      setNewContent(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          size: file.size,
          format: file.type,
          duration: file.type.startsWith('video/') ? 0 : undefined // Would need to extract from video
        }
      }));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        setSelectedFile(audioFile);
        setNewContent(prev => ({ ...prev, content: audioFile, type: 'audio' }));
        
        const url = URL.createObjectURL(audioBlob);
        setPreviewUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleContentSubmit = async () => {
    if (!newContent.title || !newContent.description) return;

    setIsCreating(true);
    try {
      await onContentCreate(newContent);
      
      // Reset form
      setNewContent({
        title: '',
        description: '',
        type: 'article',
        content: '',
        tags: [],
        consciousnessLevel: userProfile?.current_level || 'initiate',
        energyFrequency: userProfile?.energy_frequency_preference || '528Hz',
        chakraFocus: [],
        lunarTiming: 'any',
        isPublic: false,
        allowAnnotations: true,
        allowComments: true,
        metadata: {}
      });
      
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error creating content:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAnnotationSubmit = async () => {
    if (!newAnnotation.text) return;

    const annotation: ContentAnnotation = {
      id: Date.now().toString(),
      contentId: 'current-content', // Would be passed from parent
      userId: userProfile?.user_id || '',
      type: newAnnotation.type as any,
      text: newAnnotation.text,
      tags: newAnnotation.tags || [],
      consciousnessLevel: newAnnotation.consciousnessLevel || 'initiate',
      isPublic: newAnnotation.isPublic || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await onAnnotationCreate(annotation);
    
    // Reset form
    setNewAnnotation({
      type: 'insight',
      text: '',
      tags: [],
      consciousnessLevel: userProfile?.current_level || 'initiate',
      isPublic: true
    });
  };

  const handleJournalSubmit = async () => {
    if (!journalEntry.title || !journalEntry.content) return;

    // Create journal entry as content
    const journalContent: ContentCreation = {
      title: journalEntry.title,
      description: `Journal Entry - ${new Date().toLocaleDateString()}`,
      type: 'article',
      content: journalEntry.content,
      tags: [...journalEntry.tags, 'journal', 'personal'],
      consciousnessLevel: userProfile?.current_level || 'initiate',
      energyFrequency: userProfile?.energy_frequency_preference || '528Hz',
      chakraFocus: [],
      lunarTiming: 'any',
      isPublic: false,
      allowAnnotations: false,
      allowComments: false,
      metadata: {}
    };

    await onContentCreate(journalContent);
    
    // Reset form
    setJournalEntry({
      title: '',
      content: '',
      mood: 'neutral',
      energyLevel: 5,
      insights: '',
      gratitude: '',
      tags: []
    });
  };

  const renderContentCreation = () => (
    <div className="space-y-6">
      {/* Content Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Content Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {contentTypes.map((type) => (
              <motion.div
                key={type.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  newContent.type === type.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setNewContent(prev => ({ ...prev, type: type.value as any }))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <type.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-center">{type.label}</h3>
                <p className="text-xs text-gray-600 text-center">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Details */}
      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              value={newContent.title}
              onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter content title..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={newContent.description}
              onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your content..."
              className="min-h-[100px]"
            />
          </div>

          {/* File Upload or Text Input */}
          {newContent.type === 'article' || newContent.type === 'meditation' || newContent.type === 'practice' ? (
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                value={newContent.content as string}
                onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your content here..."
                className="min-h-[200px]"
              />
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium mb-2 block">
                {newContent.type === 'video' ? 'Video' : 'Audio'} Content
              </label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  
                  {newContent.type === 'audio' && (
                    <Button
                      variant="outline"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex-1 ${isRecording ? 'bg-red-500 text-white' : ''}`}
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={newContent.type === 'video' ? 'video/*' : 'audio/*'}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {previewUrl && (
                  <div className="mt-4">
                    {newContent.type === 'video' ? (
                      <video src={previewUrl} controls className="w-full max-w-md rounded-lg" />
                    ) : (
                      <audio src={previewUrl} controls className="w-full" />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <Input
              placeholder="Enter tags separated by commas..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const tags = (e.target as HTMLInputElement).value.split(',').map(tag => tag.trim());
                  setNewContent(prev => ({ ...prev, tags: [...prev.tags, ...tags] }));
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {newContent.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                  <button
                    onClick={() => setNewContent(prev => ({ 
                      ...prev, 
                      tags: prev.tags.filter((_, i) => i !== index) 
                    }))}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sacred Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Sacred Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Consciousness Level</label>
              <Select
                value={newContent.consciousnessLevel}
                onValueChange={(value) => setNewContent(prev => ({ ...prev, consciousnessLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {consciousnessLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Energy Frequency</label>
              <Select
                value={newContent.energyFrequency}
                onValueChange={(value) => setNewContent(prev => ({ ...prev, energyFrequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {energyFrequencies.map(freq => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Chakra Focus</label>
            <div className="flex flex-wrap gap-2">
              {chakraOptions.map(chakra => (
                <Button
                  key={chakra}
                  variant={newContent.chakraFocus.includes(chakra) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setNewContent(prev => ({
                      ...prev,
                      chakraFocus: prev.chakraFocus.includes(chakra)
                        ? prev.chakraFocus.filter(c => c !== chakra)
                        : [...prev.chakraFocus, chakra]
                    }));
                  }}
                >
                  {chakra.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Lunar Timing</label>
            <Select
              value={newContent.lunarTiming}
              onValueChange={(value) => setNewContent(prev => ({ ...prev, lunarTiming: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lunarTimings.map(timing => (
                  <SelectItem key={timing} value={timing}>
                    {timing === 'any' ? 'Any Time' : `${timing.charAt(0).toUpperCase() + timing.slice(1)} Moon`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Sharing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Make Public</label>
              <p className="text-xs text-gray-600">Allow others to discover your content</p>
            </div>
            <Switch
              checked={newContent.isPublic}
              onCheckedChange={(checked) => setNewContent(prev => ({ ...prev, isPublic: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Allow Annotations</label>
              <p className="text-xs text-gray-600">Let others add insights to your content</p>
            </div>
            <Switch
              checked={newContent.allowAnnotations}
              onCheckedChange={(checked) => setNewContent(prev => ({ ...prev, allowAnnotations: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Allow Comments</label>
              <p className="text-xs text-gray-600">Enable discussion on your content</p>
            </div>
            <Switch
              checked={newContent.allowComments}
              onCheckedChange={(checked) => setNewContent(prev => ({ ...prev, allowComments: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setNewContent({
          title: '',
          description: '',
          type: 'article',
          content: '',
          tags: [],
          consciousnessLevel: userProfile?.current_level || 'initiate',
          energyFrequency: userProfile?.energy_frequency_preference || '528Hz',
          chakraFocus: [],
          lunarTiming: 'any',
          isPublic: false,
          allowAnnotations: true,
          allowComments: true,
          metadata: {}
        })}>
          Reset
        </Button>
        <Button onClick={handleContentSubmit} disabled={isCreating || !newContent.title || !newContent.description}>
          <Save className="w-4 h-4 mr-2" />
          {isCreating ? 'Creating...' : 'Create Content'}
        </Button>
      </div>
    </div>
  );

  const renderAnnotationTools = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Annotation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Annotation Type</label>
            <Select
              value={newAnnotation.type}
              onValueChange={(value: any) => setNewAnnotation(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="insight">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Insight
                  </div>
                </SelectItem>
                <SelectItem value="question">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Question
                  </div>
                </SelectItem>
                <SelectItem value="practice">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Practice
                  </div>
                </SelectItem>
                <SelectItem value="experience">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Experience
                  </div>
                </SelectItem>
                <SelectItem value="teaching">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Teaching
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Your Insight</label>
            <Textarea
              value={newAnnotation.text}
              onChange={(e) => setNewAnnotation(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Share your insight, question, or experience..."
              className="min-h-[120px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <Input
              placeholder="Enter tags separated by commas..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const tags = (e.target as HTMLInputElement).value.split(',').map(tag => tag.trim());
                  setNewAnnotation(prev => ({ ...prev, tags: [...(prev.tags || []), ...tags] }));
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {newAnnotation.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                  <button
                    onClick={() => setNewAnnotation(prev => ({ 
                      ...prev, 
                      tags: prev.tags?.filter((_, i) => i !== index) 
                    }))}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Make Public</label>
              <p className="text-xs text-gray-600">Share with the community</p>
            </div>
            <Switch
              checked={newAnnotation.isPublic || false}
              onCheckedChange={(checked) => setNewAnnotation(prev => ({ ...prev, isPublic: checked }))}
            />
          </div>

          <Button onClick={handleAnnotationSubmit} disabled={!newAnnotation.text} className="w-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            Add Annotation
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderJournal = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Personal Journal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              value={journalEntry.title}
              onChange={(e) => setJournalEntry(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What's on your mind today?"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Journal Entry</label>
            <Textarea
              value={journalEntry.content}
              onChange={(e) => setJournalEntry(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write about your experiences, insights, and reflections..."
              className="min-h-[200px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Mood</label>
              <Select
                value={journalEntry.mood}
                onValueChange={(value) => setJournalEntry(prev => ({ ...prev, mood: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joyful">😊 Joyful</SelectItem>
                  <SelectItem value="peaceful">😌 Peaceful</SelectItem>
                  <SelectItem value="grateful">🙏 Grateful</SelectItem>
                  <SelectItem value="inspired">✨ Inspired</SelectItem>
                  <SelectItem value="contemplative">🤔 Contemplative</SelectItem>
                  <SelectItem value="neutral">😐 Neutral</SelectItem>
                  <SelectItem value="challenged">😤 Challenged</SelectItem>
                  <SelectItem value="tired">😴 Tired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Energy Level: {journalEntry.energyLevel}/10</label>
              <Slider
                value={[journalEntry.energyLevel]}
                onValueChange={(value) => setJournalEntry(prev => ({ ...prev, energyLevel: value[0] }))}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Key Insights</label>
            <Textarea
              value={journalEntry.insights}
              onChange={(e) => setJournalEntry(prev => ({ ...prev, insights: e.target.value }))}
              placeholder="What did you learn or realize today?"
              className="min-h-[80px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Gratitude</label>
            <Textarea
              value={journalEntry.gratitude}
              onChange={(e) => setJournalEntry(prev => ({ ...prev, gratitude: e.target.value }))}
              placeholder="What are you grateful for today?"
              className="min-h-[80px]"
            />
          </div>

          <Button onClick={handleJournalSubmit} disabled={!journalEntry.title || !journalEntry.content} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Journal Entry
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Creation Tools</h2>
          <p className="text-gray-600">Create, annotate, and share your wisdom</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="annotate">Add Annotations</TabsTrigger>
          <TabsTrigger value="journal">Personal Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          {renderContentCreation()}
        </TabsContent>

        <TabsContent value="annotate" className="mt-6">
          {renderAnnotationTools()}
        </TabsContent>

        <TabsContent value="journal" className="mt-6">
          {renderJournal()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
