import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';

interface UnifiedSearchProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  isSearching: boolean;
  searchQuery: string;
}

interface SearchFilters {
  category?: string;
  source?: string;
  consciousness_level?: string;
  energy_level_min?: number;
  energy_level_max?: number;
}

interface MediaCategory {
  id: string;
  name: string;
}

const sourceOptions = [
  { value: 'youtube', label: 'YouTube', icon: '📺' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'soundcloud', label: 'SoundCloud', icon: '🎵' }
];

const consciousnessLevels = [
  { value: 'beginner', label: 'Beginner', color: 'text-green-400' },
  { value: 'intermediate', label: 'Intermediate', color: 'text-yellow-400' },
  { value: 'advanced', label: 'Advanced', color: 'text-orange-400' },
  { value: 'master', label: 'Master', color: 'text-purple-400' }
];

const sacredSearchSuggestions = [
  'meditation',
  'consciousness',
  'sacred geometry',
  'breathwork',
  'healing frequencies',
  'chakra activation',
  'astral projection',
  'quantum healing',
  'divine feminine',
  'ancient wisdom'
];

export const UnifiedSearch: React.FC<UnifiedSearchProps> = ({
  onSearch,
  isSearching,
  searchQuery
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('media_categories')
        .select('id, name')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = () => {
    onSearch(localQuery, filters);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    onSearch(suggestion, filters);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setFilters({});
    onSearch(localQuery, {});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search across all sacred content..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              className="pl-12 pr-4 py-3 text-lg bg-background/60 backdrop-blur-sm border-border/30 focus:bg-background/80 transition-all"
            />
            {localQuery && (
              <button
                onClick={() => {
                  setLocalQuery('');
                  onSearch('', filters);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="ml-3 px-6 py-3 bg-primary hover:bg-primary/90"
          >
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>

          {/* Filter Toggle */}
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="ml-2 px-4 py-3 bg-background/60 backdrop-blur-sm border-border/30 relative"
              >
                <Filter className="h-5 w-5" />
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0 h-5 min-w-5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 bg-card/95 backdrop-blur-lg border-border/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Sacred Filters</h3>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={filters.category || 'all'}
                    onValueChange={(value) =>
                      setFilters(prev => ({ ...prev, category: value === 'all' ? undefined : value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Source Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Source Platform</label>
                  <Select
                    value={filters.source || 'all'}
                    onValueChange={(value) =>
                      setFilters(prev => ({ ...prev, source: value === 'all' ? undefined : value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All sources</SelectItem>
                      {sourceOptions.map(source => (
                        <SelectItem key={source.value} value={source.value}>
                          <span className="flex items-center gap-2">
                            {source.icon} {source.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Consciousness Level Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Consciousness Level</label>
                  <Select
                    value={filters.consciousness_level || 'all'}
                    onValueChange={(value) =>
                      setFilters(prev => ({ ...prev, consciousness_level: value === 'all' ? undefined : value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      {consciousnessLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          <span className={`${level.color} font-medium`}>
                            {level.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Sacred Search Suggestions */}
        {showSuggestions && !localQuery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-lg border border-border/20 rounded-lg p-4 z-50"
          >
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Sacred Suggestions</h4>
              <div className="flex flex-wrap gap-2">
                {sacredSearchSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm font-medium transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {categories.find(c => c.id === filters.category)?.name}
              <button onClick={() => setFilters(prev => ({ ...prev, category: undefined }))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.source && (
            <Badge variant="secondary" className="gap-1">
              Source: {sourceOptions.find(s => s.value === filters.source)?.label}
              <button onClick={() => setFilters(prev => ({ ...prev, source: undefined }))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.consciousness_level && (
            <Badge variant="secondary" className="gap-1">
              Level: {consciousnessLevels.find(l => l.value === filters.consciousness_level)?.label}
              <button onClick={() => setFilters(prev => ({ ...prev, consciousness_level: undefined }))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  );
};