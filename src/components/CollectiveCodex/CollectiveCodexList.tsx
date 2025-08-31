import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Filter, Calendar, Sparkles, MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown, Grid3X3, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { useAuth } from '@/hooks/useAuth';
import { CollectiveEntryModal } from './CollectiveEntryModal';
import { format } from 'date-fns/format';
import { TooltipWrapper } from '@/components/HelpSystem/TooltipWrapper';
import { ContextualHelp, HelpTooltips } from '@/components/HelpSystem/ContextualHelp';

const ENTRY_TYPES = [
  'Sacred Teachings', 'Collective Dreams', 'Integration Patterns', 'Emotional Resonance', 
  'Universal Laws', 'Consciousness Threads', 'Divine Downloads', 'Quantum Insights'
];

const ACCESS_LEVELS = [
  'Public', 'Circle', 'Private'
];

export function CollectiveCodexList() {
  const { entries, loading, createEntry, updateEntry, deleteEntry, categories, fetchEntries } = useRegistryOfResonance();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [viewMode, setViewMode] = useState('collective');
  const [sortField, setSortField] = useState<'created_at' | 'title' | 'entry_type' | 'resonance_rating'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [displayMode, setDisplayMode] = useState<'table' | 'grid'>('table');

  // Fetch collective entries on mount
  useEffect(() => {
    fetchEntries('collective');
  }, [fetchEntries]);

  const filteredAndSortedEntries = useMemo(() => {
    const filtered = entries.filter(entry => {
      const matchesSearch = !searchQuery || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = !typeFilter || typeFilter === 'all' || entry.entry_type === typeFilter;
      const matchesAccess = !accessFilter || accessFilter === 'all' || entry.access_level === accessFilter;
      const matchesVerified = verifiedFilter === 'all' || 
        (verifiedFilter === 'verified' && entry.is_verified) ||
        (verifiedFilter === 'unverified' && !entry.is_verified);
      
      return matchesSearch && matchesType && matchesAccess && matchesVerified;
    });

    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'entry_type':
          aValue = a.entry_type;
          bValue = b.entry_type;
          break;
        case 'resonance_rating':
          aValue = a.resonance_rating;
          bValue = b.resonance_rating;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [entries, searchQuery, typeFilter, accessFilter, verifiedFilter, sortField, sortOrder]);

  const handleCreateEntry = async (data) => {
    const result = await createEntry({
      ...data,
      entry_type: data.entry_type || 'Sacred Teachings',
      access_level: 'Public' // Collective entries are public by default
    });
    if (result) {
      setIsModalOpen(false);
      fetchEntries('collective'); // Refresh entries
    }
  };

  const handleUpdateEntry = async (data) => {
    if (selectedEntry) {
      const result = await updateEntry(selectedEntry.id, data);
      if (result) {
        setSelectedEntry(null);
        setIsModalOpen(false);
        fetchEntries('collective'); // Refresh entries
      }
    }
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      await deleteEntry(entryId);
      fetchEntries('collective'); // Refresh entries
    }
  };

  const handleSort = (field: 'created_at' | 'title' | 'entry_type' | 'resonance_rating') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setAccessFilter('all');
    setVerifiedFilter('all');
  };

  const canEditEntry = (entry) => {
    return user && (entry.user_id === user.id || user.email === 'justice@sacredshifter.com');
  };

  const canDeleteEntry = (entry) => {
    return user && (entry.user_id === user.id || user.email === 'justice@sacredshifter.com');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Sparkles className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading collective wisdom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Collective Sacred Codex
            </h1>
            <p className="text-muted-foreground mt-2">
              Community repository of sacred wisdom and shared consciousness insights
            </p>
          </div>
          
          <TooltipWrapper content="Contribute to the collective wisdom">
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </TooltipWrapper>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 backdrop-blur border rounded-lg p-6 mb-8"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Display Mode Toggle */}
            <div className="flex border rounded-lg p-1 bg-background">
              <Button
                variant={displayMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('table')}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                Table
              </Button>
              <Button
                variant={displayMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('grid')}
                className="gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Grid
              </Button>
            </div>
            
            <TooltipWrapper content="Search the collective wisdom">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collective entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </TooltipWrapper>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Entry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {ENTRY_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={accessFilter} onValueChange={setAccessFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Access Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access</SelectItem>
                {ACCESS_LEVELS.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            
            {(searchQuery || typeFilter !== 'all' || accessFilter !== 'all' || verifiedFilter !== 'all') && (
              <TooltipWrapper content="Clear all active filters">
                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </TooltipWrapper>
            )}
          </div>
        </div>
        
        {filteredAndSortedEntries.length !== entries.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">
              {filteredAndSortedEntries.length} of {entries.length} entries
            </Badge>
            {searchQuery && <Badge variant="outline">Search: "{searchQuery}"</Badge>}
            {typeFilter !== 'all' && <Badge variant="outline">Type: {typeFilter}</Badge>}
            {accessFilter !== 'all' && <Badge variant="outline">Access: {accessFilter}</Badge>}
            {verifiedFilter !== 'all' && <Badge variant="outline">Status: {verifiedFilter}</Badge>}
          </div>
        )}
      </motion.div>

      {/* Contextual Help */}
      {entries.length === 0 && (
        <ContextualHelp
          title="Welcome to the Collective Codex"
          description="This is the shared wisdom repository of the Sacred Shifter community. Contribute your insights and discover the collective consciousness."
          tips={[
            "All entries are visible to the community",
            "Use meaningful entry types to categorize your wisdom",
            "Add relevant tags to help others find your content",
            "Verified entries are highlighted and prioritized"
          ]}
          className="max-w-2xl mx-auto mb-8"
        />
      )}

      {/* Empty State */}
      {entries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto">
            <Sparkles className="h-16 w-16 text-primary/30 mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-4">The Collective Awaits</h3>
            <p className="text-muted-foreground mb-6">
              Be among the first to contribute to our shared wisdom repository. What sacred knowledge would you like to share?
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Share Your First Insight
            </Button>
          </div>
        </motion.div>
      ) : filteredAndSortedEntries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-muted-foreground">No entries match your current filters.</p>
        </motion.div>
      ) : displayMode === 'table' ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card/30 backdrop-blur border rounded-lg overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Title
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('entry_type')}
                >
                  <div className="flex items-center gap-2">
                    Type
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('resonance_rating')}
                >
                  <div className="flex items-center gap-2">
                    Resonance
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-2">
                    Created
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEntries.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-border/30 hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="max-w-[300px]">
                      <div className="font-semibold truncate">{entry.title}</div>
                      {entry.content && (
                        <div className="text-sm text-muted-foreground truncate mt-1">
                          {entry.content.substring(0, 100)}...
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {entry.entry_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(entry.resonance_rating / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {entry.resonance_rating}/10
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {entry.tags?.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags && entry.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={entry.access_level === 'Public' ? 'default' : 'outline'} 
                        className="text-xs"
                      >
                        {entry.access_level}
                      </Badge>
                      {entry.is_verified && (
                        <Badge variant="default" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.created_at), 'MMM d, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur border-border/50">
                        <DropdownMenuItem 
                          onClick={() => setSelectedEntry(entry)}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        {canEditEntry(entry) && (
                          <DropdownMenuItem 
                            onClick={() => handleEditEntry(entry)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {canDeleteEntry(entry) && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="cursor-pointer text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      ) : (
        // Grid View
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAndSortedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card/50 backdrop-blur border rounded-lg p-6 hover:bg-card/70 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary" className="text-xs">
                  {entry.entry_type}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedEntry(entry)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    {canEditEntry(entry) && (
                      <DropdownMenuItem onClick={() => handleEditEntry(entry)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {canDeleteEntry(entry) && (
                      <DropdownMenuItem 
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{entry.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {entry.content}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(entry.resonance_rating / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {entry.resonance_rating}/10
                  </span>
                </div>
                {entry.is_verified && (
                  <Badge variant="default" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {entry.tags.slice(0, 4).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {entry.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{entry.tags.length - 4}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                {format(new Date(entry.created_at), 'MMM d, yyyy')}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Entry Modal */}
      <CollectiveEntryModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEntry(null);
        }}
        onSubmit={selectedEntry ? handleUpdateEntry : handleCreateEntry}
        initialData={selectedEntry}
        isEditing={!!selectedEntry}
        onView={selectedEntry ? () => setSelectedEntry(selectedEntry) : undefined}
      />
    </div>
  );
}