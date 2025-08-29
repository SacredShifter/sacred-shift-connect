import React from 'react';
import { Heart, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SacredNavigationProps {
  activeRealm: string;
  onRealmChange: (realm: string) => void;
}

const sacredRealms = [
  {
    id: 'communion',
    name: 'Sacred Communion',
    symbol: Heart,
    color: 'hsl(var(--resonance))',
    description: 'Heart-centered conversation and sharing'
  },
  {
    id: 'collective',
    name: 'Collective Presence',
    symbol: Users,
    color: 'hsl(var(--alignment))',
    description: 'Group consciousness and energy'
  },
  {
    id: 'transcendence',
    name: 'Sacred Practice',
    symbol: Sparkles,
    color: 'hsl(var(--purpose))',
    description: 'Meditation, ceremony, and ritual'
  }
];

export const SacredNavigation: React.FC<SacredNavigationProps> = ({ 
  activeRealm, 
  onRealmChange 
}) => {
  return (
    <div className="flex justify-center gap-2 px-6 py-4 border-b border-border/30">
      {sacredRealms.map((realm) => {
        const Icon = realm.symbol;
        const isActive = activeRealm === realm.id;
        
        return (
          <Button
            key={realm.id}
            variant="ghost"
            onClick={() => onRealmChange(realm.id)}
            className={cn(
              "group relative px-6 py-3 rounded-2xl transition-all duration-500",
              "hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
              isActive 
                ? "bg-primary/20 border border-primary/40 shadow-[0_0_15px_hsl(var(--primary)/0.4)]" 
                : "hover:bg-primary/10"
            )}
            title={realm.description}
          >
            <div className="flex flex-col items-center gap-1">
              <Icon 
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive 
                    ? "text-primary animate-pulse" 
                    : "text-muted-foreground group-hover:text-primary"
                )}
                style={{ 
                  color: isActive ? realm.color : undefined,
                  filter: isActive ? 'drop-shadow(0 0 8px currentColor)' : undefined
                }}
              />
              <span className={cn(
                "text-xs font-medium transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )}>
                {realm.name.split(' ')[0]}
              </span>
            </div>
            
            {/* Sacred glow effect for active realm */}
            {isActive && (
              <div 
                className="absolute inset-0 rounded-2xl opacity-20 animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${realm.color}20 0%, transparent 70%)`
                }}
              />
            )}
          </Button>
        );
      })}
    </div>
  );
};