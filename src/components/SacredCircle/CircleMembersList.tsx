import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Crown, Shield, UserPlus, UserMinus, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CircleMember {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  profile?: {
    display_name?: string;
    avatar_url?: string;
  };
  is_online?: boolean;
}

interface CircleMembersListProps {
  circleId: string;
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'admin' | 'moderator' | 'member';
}

export const CircleMembersList: React.FC<CircleMembersListProps> = ({
  circleId,
  isOpen,
  onClose,
  userRole = 'member'
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch circle members
  useEffect(() => {
    if (!isOpen || !circleId) return;

    const fetchMembers = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('circle_group_members')
          .select(`
            id,
            user_id,
            role,
            joined_at,
            group_id
          `)
          .eq('group_id', circleId)
          .order('joined_at', { ascending: true });

        if (error) throw error;

        // Fetch profile data separately for each member
        const membersWithProfiles = await Promise.all(
          (data || []).map(async (member) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name, avatar_url')
              .eq('user_id', member.user_id)
              .single();

            return {
              ...member,
              role: member.role as 'admin' | 'moderator' | 'member',
              profile: profile || undefined
            };
          })
        );

        setMembers(membersWithProfiles);
      } catch (error) {
        console.error('Error fetching members:', error);
        toast({
          title: "Error",
          description: "Failed to load circle members",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [isOpen, circleId, toast]);

  const handleRemoveMember = async (memberId: string) => {
    if (userRole !== 'admin' && userRole !== 'moderator') return;

    try {
      const { error } = await supabase
        .from('circle_group_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.filter(m => m.id !== memberId));
      
      toast({
        title: "Member Removed",
        description: "Member has been removed from the circle",
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive"
      });
    }
  };

  const handleChangeRole = async (memberId: string, newRole: 'admin' | 'moderator' | 'member') => {
    if (userRole !== 'admin') return;

    try {
      const { error } = await supabase
        .from('circle_group_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => 
        prev.map(m => m.id === memberId ? { ...m, role: newRole } : m)
      );
      
      toast({
        title: "Role Updated",
        description: `Member role changed to ${newRole}`,
      });
    } catch (error) {
      console.error('Error changing role:', error);
      toast({
        title: "Error",
        description: "Failed to change member role",
        variant: "destructive"
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'moderator': return <Shield className="h-3 w-3 text-blue-500" />;
      default: return <Users className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-yellow-100 text-yellow-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg w-full max-w-md h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Circle Members</h3>
              <p className="text-sm text-muted-foreground">
                {members.length} member{members.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        {/* Members List */}
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No members found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.profile?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                        {member.profile?.display_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    {member.is_online && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {member.profile?.display_name || 'Unknown User'}
                      </p>
                      {getRoleIcon(member.role)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0 ${getRoleBadgeColor(member.role)}`}
                      >
                        {member.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(member.joined_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions for admins/moderators */}
                  {(userRole === 'admin' || userRole === 'moderator') && member.user_id !== user?.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {userRole === 'admin' && (
                          <>
                            <DropdownMenuItem onClick={() => handleChangeRole(member.id, 'admin')}>
                              <Crown className="h-4 w-4 mr-2" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(member.id, 'moderator')}>
                              <Shield className="h-4 w-4 mr-2" />
                              Make Moderator
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(member.id, 'member')}>
                              <Users className="h-4 w-4 mr-2" />
                              Make Member
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-destructive"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove from Circle
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => {
              // TODO: Implement invite functionality
              toast({
                title: "Invite Members",
                description: "Invite functionality coming soon!",
              });
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Members
          </Button>
        </div>
      </div>
    </div>
  );
};