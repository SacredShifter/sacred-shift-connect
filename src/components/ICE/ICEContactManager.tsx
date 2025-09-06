import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Plus, Shield, Heart, AlertTriangle, Phone, Mail, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ICEContact {
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  user_id?: string;
  priority: number;
  consent_given: boolean;
  consent_date?: string;
}

interface ICEContactManagerProps {
  currentUserConsciousness: number;
  currentUserSovereignty: number;
}

export const ICEContactManager: React.FC<ICEContactManagerProps> = ({
  currentUserConsciousness,
  currentUserSovereignty,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [iceContacts, setIceContacts] = useState<ICEContact[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [newContact, setNewContact] = useState<Partial<ICEContact>>({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    priority: 1,
    consent_given: false,
  });

  // 🌟 **Sacred Archetypes for Emergency Relationships**
  const relationshipTypes = [
    { value: 'parent', label: '👨‍👩‍👧‍👦 Parent/Guardian', energy: 'protection' },
    { value: 'partner', label: '💑 Life Partner', energy: 'unity' },
    { value: 'sibling', label: '👫 Sibling', energy: 'kinship' },
    { value: 'child', label: '👶 Child', energy: 'legacy' },
    { value: 'friend', label: '🤝 Close Friend', energy: 'resonance' },
    { value: 'mentor', label: '🧙‍♂️ Spiritual Mentor', energy: 'wisdom' },
    { value: 'healer', label: '🌿 Healer/Therapist', energy: 'restoration' },
    { value: 'emergency', label: '🚨 Emergency Services', energy: 'intervention' },
  ];

  useEffect(() => {
    if (user?.id) {
      loadICEContacts();
    }
  }, [user?.id]);

  const loadICEContacts = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('ice_contacts, ice_consent_given')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('❌ Error loading ICE contacts:', error);
        return;
      }

      if (profile) {
        setIceContacts(profile.ice_contacts || []);
        setConsentGiven(profile.ice_consent_given || false);
      }
    } catch (error) {
      console.error('❌ Error loading ICE contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load emergency contacts.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveICEContacts = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Use the custom function that validates contacts
      const { error } = await supabase.rpc('update_ice_contacts', {
        user_uuid: user.id,
        new_contacts: iceContacts
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Sacred Protection Updated",
        description: "Your emergency contacts have been securely saved.",
      });

      setConsentGiven(true);
    } catch (error) {
      console.error('❌ Error saving ICE contacts:', error);
      toast({
        title: "Error",
        description: "Failed to save emergency contacts. Please check your entries.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addContact = () => {
    if (!newContact.name || !newContact.relationship) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and relationship.",
        variant: "destructive"
      });
      return;
    }

    if (!newContact.phone && !newContact.email) {
      toast({
        title: "Contact Method Required",
        description: "Please provide either a phone number or email address.",
        variant: "destructive"
      });
      return;
    }

    const contact: ICEContact = {
      ...newContact as ICEContact,
      priority: iceContacts.length + 1,
      consent_given: false, // Will need to be verified separately
    };

    setIceContacts([...iceContacts, contact]);
    setNewContact({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      priority: 1,
      consent_given: false,
    });

    toast({
      title: "Contact Added",
      description: `${contact.name} has been added to your emergency contacts.`,
    });
  };

  const removeContact = (index: number) => {
    const contact = iceContacts[index];
    setIceContacts(iceContacts.filter((_, i) => i !== index));
    
    toast({
      title: "Contact Removed",
      description: `${contact.name} has been removed from your emergency contacts.`,
    });
  };

  const moveContactPriority = (index: number, direction: 'up' | 'down') => {
    const newContacts = [...iceContacts];
    if (direction === 'up' && index > 0) {
      [newContacts[index], newContacts[index - 1]] = [newContacts[index - 1], newContacts[index]];
    } else if (direction === 'down' && index < newContacts.length - 1) {
      [newContacts[index], newContacts[index + 1]] = [newContacts[index + 1], newContacts[index]];
    }
    
    // Update priority numbers
    newContacts.forEach((contact, idx) => {
      contact.priority = idx + 1;
    });
    
    setIceContacts(newContacts);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Shield className="h-4 w-4" />
          Emergency Contacts
          {iceContacts.length > 0 && (
            <Badge variant="secondary">{iceContacts.length}</Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Sacred Emergency Contacts (ICE)
          </DialogTitle>
          <DialogDescription>
            Configure trusted contacts who can be reached instantly during emergencies, 
            bypassing all sovereignty and consciousness filters.
          </DialogDescription>
        </DialogHeader>

        {/* Consciousness-Aware Consent Section */}
        {!consentGiven && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Sacred Consent Required:</strong> Emergency contacts will have the ability to 
              reach you even when you're in deep meditation, focus mode, or have sovereignty barriers active. 
              This bypasses your normal consciousness-filtering systems for true emergencies.
            </AlertDescription>
          </Alert>
        )}

        {/* Existing Contacts List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Current Emergency Contacts</h3>
            <Badge variant={iceContacts.length > 0 ? "default" : "secondary"}>
              {iceContacts.length} contacts
            </Badge>
          </div>

          {iceContacts.map((contact, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">#{contact.priority}</Badge>
                    <CardTitle className="text-sm">{contact.name}</CardTitle>
                    <Badge variant="secondary">
                      {relationshipTypes.find(r => r.value === contact.relationship)?.label || contact.relationship}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveContactPriority(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveContactPriority(index, 'down')}
                      disabled={index === iceContacts.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContact(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {contact.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </div>
                  )}
                  {contact.user_id && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Sacred Shifter User
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {iceContacts.length === 0 && (
            <Card className="text-center py-8">
              <CardContent>
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No emergency contacts configured yet. Add trusted people who can reach you in any situation.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add New Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-name">Name *</Label>
                <Input
                  id="contact-name"
                  value={newContact.name || ''}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label htmlFor="contact-relationship">Relationship *</Label>
                <select
                  id="contact-relationship"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  value={newContact.relationship || ''}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                >
                  <option value="">Select relationship</option>
                  {relationshipTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input
                  id="contact-phone"
                  value={newContact.phone || ''}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="+1234567890"
                  type="tel"
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Email Address</Label>
                <Input
                  id="contact-email"
                  value={newContact.email || ''}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="email@example.com"
                  type="email"
                />
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Privacy Note:</strong> Contact information is encrypted and only accessed during genuine emergencies. 
                Contacts will receive a consent request before being added to your emergency network.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={addContact} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={saveICEContacts} 
            disabled={isLoading || iceContacts.length === 0}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Saving...' : 'Save Emergency Contacts'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
