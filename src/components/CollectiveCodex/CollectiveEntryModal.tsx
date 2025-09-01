import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Crown, Star, Zap, Heart, Brain, Sparkles, Globe, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const COLLECTIVE_ENTRY_TYPES = [
  { value: 'Sacred Teachings', label: 'Sacred Teachings', icon: Crown, color: 'hsl(var(--primary))' },
  { value: 'Collective Dreams', label: 'Collective Dreams', icon: Star, color: 'hsl(var(--accent))' },
  { value: 'Integration Patterns', label: 'Integration Patterns', icon: Zap, color: 'hsl(var(--secondary))' },
  { value: 'Emotional Resonance', label: 'Emotional Resonance', icon: Heart, color: 'hsl(var(--primary-glow))' },
  { value: 'Universal Laws', label: 'Universal Laws', icon: Brain, color: 'hsl(var(--wisdom))' },
  { value: 'Consciousness Threads', label: 'Consciousness Threads', icon: Sparkles, color: 'hsl(var(--divine))' },
  { value: 'Divine Downloads', label: 'Divine Downloads', icon: Crown, color: 'hsl(var(--sacred))' },
  { value: 'Quantum Insights', label: 'Quantum Insights', icon: Globe, color: 'hsl(var(--frequency))' }
];

interface CollectiveEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
  onView?: () => void;
}

export function CollectiveEntryModal({ 
  open, 
  onClose, 
  onSubmit, 
  initialData, 
  isEditing = false,
  onView 
}: CollectiveEntryModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    entry_type: 'Sacred Teachings',
    access_level: 'Public',
    resonance_rating: 5,
    tags: [] as string[],
    author_name: '',
    source_citation: '',
    inspiration_source: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  const [isViewOnly, setIsViewOnly] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        entry_type: initialData.entry_type || 'Sacred Teachings',
        access_level: initialData.access_level || 'Public',
        resonance_rating: initialData.resonance_rating || 5,
        tags: initialData.tags || [],
        author_name: initialData.author_name || '',
        source_citation: initialData.source_citation || '',
        inspiration_source: initialData.inspiration_source || ''
      });
      setIsViewOnly(!isEditing);
      setActiveTab(isEditing ? 'edit' : 'preview');
    } else {
      // Reset form for new entry
      setFormData({
        title: '',
        content: '',
        entry_type: 'Sacred Teachings',
        access_level: 'Public',
        resonance_rating: 5,
        tags: [],
        author_name: '',
        source_citation: '',
        inspiration_source: ''
      });
      setIsViewOnly(false);
      setActiveTab('edit');
    }
  }, [initialData, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const selectedEntryType = COLLECTIVE_ENTRY_TYPES.find(type => type.value === formData.entry_type);
  const Icon = selectedEntryType?.icon || Crown;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${selectedEntryType?.color}20` }}
            >
              <Icon 
                className="h-5 w-5" 
                style={{ color: selectedEntryType?.color }}
              />
            </div>
            {isViewOnly ? 'View Entry' : isEditing ? 'Edit Entry' : 'Create Collective Entry'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" disabled={isViewOnly}>
                {isViewOnly ? 'Details' : 'Edit'}
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[600px] pr-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter the title of your collective entry..."
                      required
                      disabled={isViewOnly}
                    />
                  </div>

                  {/* Entry Type and Access Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entry_type">Entry Type</Label>
                      <Select 
                        value={formData.entry_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, entry_type: value }))}
                        disabled={isViewOnly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select entry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLLECTIVE_ENTRY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <type.icon className="h-4 w-4" style={{ color: type.color }} />
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="access_level">Access Level</Label>
                      <Select 
                        value={formData.access_level} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, access_level: value }))}
                        disabled={isViewOnly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Public">🌍 Public</SelectItem>
                          <SelectItem value="Circle">🔒 Circle</SelectItem>
                          <SelectItem value="Private">👤 Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your wisdom with the collective..."
                      className="min-h-[200px] resize-none"
                      required
                      disabled={isViewOnly}
                    />
                    <p className="text-sm text-muted-foreground">
                      Supports Markdown formatting for rich text display
                    </p>
                  </div>

                  {/* Resonance Rating */}
                  <div className="space-y-2">
                    <Label>Resonance Rating: {formData.resonance_rating}/10</Label>
                    <Slider
                      value={[formData.resonance_rating]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, resonance_rating: value[0] }))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                      disabled={isViewOnly}
                    />
                    <p className="text-sm text-muted-foreground">
                      How strongly does this wisdom resonate with universal truth?
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Add tags..."
                        disabled={isViewOnly}
                      />
                      {!isViewOnly && (
                        <Button type="button" onClick={addTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {tag}
                            {!isViewOnly && (
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeTag(tag)}
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author_name">Author Name</Label>
                      <Input
                        id="author_name"
                        value={formData.author_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                        placeholder="Your name or handle..."
                        disabled={isViewOnly}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inspiration_source">Inspiration Source</Label>
                      <Input
                        id="inspiration_source"
                        value={formData.inspiration_source}
                        onChange={(e) => setFormData(prev => ({ ...prev, inspiration_source: e.target.value }))}
                        placeholder="What inspired this wisdom?"
                        disabled={isViewOnly}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source_citation">Source Citation</Label>
                    <Input
                      id="source_citation"
                      value={formData.source_citation}
                      onChange={(e) => setFormData(prev => ({ ...prev, source_citation: e.target.value }))}
                      placeholder="Reference or citation..."
                      disabled={isViewOnly}
                    />
                  </div>

                  {!isViewOnly && (
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {isEditing ? 'Update Entry' : 'Create Entry'}
                      </Button>
                    </div>
                  )}
                </form>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[600px] pr-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-3 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${selectedEntryType?.color}20` }}
                        >
                          <Icon 
                            className="h-6 w-6" 
                            style={{ color: selectedEntryType?.color }}
                          />
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {formData.entry_type}
                          </Badge>
                          <h1 className="text-2xl font-bold">{formData.title || 'Untitled Entry'}</h1>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={formData.access_level === 'Public' ? 'default' : 'outline'}>
                          {formData.access_level}
                        </Badge>
                      </div>
                    </div>

                    {/* Resonance Rating */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Resonance:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(formData.resonance_rating / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {formData.resonance_rating}/10
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    {(formData.author_name || formData.inspiration_source) && (
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {formData.author_name && (
                          <span>By: {formData.author_name}</span>
                        )}
                        {formData.inspiration_source && (
                          <span>Inspired by: {formData.inspiration_source}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>
                      {formData.content || '*No content yet...*'}
                    </ReactMarkdown>
                  </div>

                  {/* Tags */}
                  {formData.tags.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Source Citation */}
                  {formData.source_citation && (
                    <div className="border-l-4 border-primary/30 pl-4 py-2 bg-muted/30 rounded-r">
                      <p className="text-sm text-muted-foreground">
                        <strong>Source:</strong> {formData.source_citation}
                      </p>
                    </div>
                  )}

                  {isViewOnly && (
                    <div className="flex justify-end gap-3 pt-4">
                      <Button onClick={onClose}>
                        Close
                      </Button>
                    </div>
                  )}
                </motion.div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}