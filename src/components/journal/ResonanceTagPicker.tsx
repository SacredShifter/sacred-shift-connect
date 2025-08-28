import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResonanceTagPickerProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const DEFAULT_TAGS = [
  'Clarity', 'Fear', 'Flow', 'Resistance', 'Joy', 'Grief', 'Wisdom', 'Confusion',
  'Love', 'Anger', 'Peace', 'Anxiety', 'Trust', 'Doubt', 'Power', 'Vulnerability',
  'Expansion', 'Contraction', 'Light', 'Shadow', 'Integration', 'Breakthrough'
];

export const ResonanceTagPicker: React.FC<ResonanceTagPickerProps> = ({
  selectedTags,
  onTagsChange
}) => {
  const [customTag, setCustomTag] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      onTagsChange([...selectedTags, customTag.trim()]);
      setCustomTag('');
      setShowCustomInput(false);
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-4">
      {/* Selected Tags */}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20"
          >
            {selectedTags.map(tag => (
              <motion.div
                key={tag}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Badge 
                  variant="secondary" 
                  className="bg-primary/20 hover:bg-primary/30 transition-colors pl-3 pr-1 py-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default Tags */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Resonance Tags</p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_TAGS.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Custom Tag Input */}
      <div className="flex items-center gap-2">
        <AnimatePresence>
          {showCustomInput ? (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2 flex-1"
            >
              <Input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Custom resonance tag..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                autoFocus
              />
              <Button size="sm" onClick={addCustomTag} disabled={!customTag.trim()}>
                Add
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomTag('');
                }}
              >
                Cancel
              </Button>
            </motion.div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomInput(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Custom Tag
            </Button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};