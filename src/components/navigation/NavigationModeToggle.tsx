import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigation } from "@/providers/NavigationProvider";
import { MapPin, Compass, Sparkles, List, ArrowRight } from "lucide-react";

export function NavigationModeToggle() {
  const { mode, setMode } = useNavigation();
  const [open, setOpen] = useState(false);

  const handleModeChange = (newMode: 'sacred-journey' | 'explorer') => {
    setMode(newMode);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 h-8 px-2 hover:bg-primary/10"
        >
          {mode === 'sacred-journey' ? (
            <>
              <MapPin className="h-3 w-3" />
              <span className="hidden sm:inline">Journey</span>
            </>
          ) : (
            <>
              <Compass className="h-3 w-3" />
              <span className="hidden sm:inline">Explorer</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-md border border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Choose Your Sacred Path
          </DialogTitle>
          <DialogDescription>
            Select how you'd like to navigate your consciousness journey
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              mode === 'sacred-journey' 
                ? 'border-primary bg-primary/5' 
                : 'border-border/30 hover:border-primary/30'
            }`}
            onClick={() => handleModeChange('sacred-journey')}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Sacred Journey</h3>
              </div>
              {mode === 'sacred-journey' && (
                <Badge variant="default" className="text-xs">Current</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              A guided, progressive path that unlocks modules as you grow. Perfect for newcomers and those who love structured exploration.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Ceremony gates • Progress tracking • Milestone celebrations</span>
            </div>
          </div>

          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              mode === 'explorer' 
                ? 'border-secondary bg-secondary/5' 
                : 'border-border/30 hover:border-secondary/30'
            }`}
            onClick={() => handleModeChange('explorer')}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-secondary" />
                <h3 className="font-medium">Explorer Mode</h3>
              </div>
              {mode === 'explorer' && (
                <Badge variant="secondary" className="text-xs">Current</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Full access to all modules and features from day one. Ideal for returning users and those who prefer complete freedom.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <List className="h-3 w-3" />
              <span>All modules • Instant access • Optional progress tracking</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            You can change this anytime in your settings
          </p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setOpen(false)}
            className="gap-1"
          >
            Continue
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}