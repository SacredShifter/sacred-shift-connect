import { supabase } from '@/integrations/supabase/client';
import { SacredVoiceCalling } from './SacredVoiceCalling';
import { WebRTCSignaling } from './WebRTCSignaling';
import { SacredWebRTCMesh } from './SacredWebRTCMesh';
import { SSUC } from './SacredShifterUniversalConnectivity';

export interface ICEContact {
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  user_id?: string;
  priority: number;
  consent_given: boolean;
  consent_date?: string;
}

export interface ICEActivation {
  id: string;
  user_id: string;
  activated_by: string;
  contact_name: string;
  contact_phone?: string;
  contact_email?: string;
  contact_user_id?: string;
  activation_type: 'call' | 'message' | 'location_share';
  status: 'initiated' | 'connected' | 'failed' | 'fallback_sent';
  webrtc_attempted: boolean;
  fallback_attempted: boolean;
  location_shared: boolean;
  created_at: string;
  updated_at: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export class SacredICECalling {
  private ssuC: SSUC;
  private sacredVoiceCalling: SacredVoiceCalling;
  private webRTCSignaling: WebRTCSignaling;
  private webRTCMesh: SacredWebRTCMesh;
  private currentActivation: ICEActivation | null = null;

  constructor(ssuC: SSUC, sacredVoiceCalling: SacredVoiceCalling) {
    this.ssuC = ssuC;
    this.sacredVoiceCalling = sacredVoiceCalling;
    this.webRTCSignaling = new WebRTCSignaling();
    this.webRTCMesh = new SacredWebRTCMesh({
      meshId: 'sacred-ice-calling'
    });
  }

  /**
   * 🚨 **Emergency Call Initiation** - Bypasses all sovereignty filters
   * This is the primary method for triggering emergency communications
   */
  async triggerEmergencyCall(
    userId: string,
    message: string = "I need help! Please respond immediately.",
    shareLocation: boolean = true
  ): Promise<{ success: boolean; activations: ICEActivation[]; errors: string[] }> {
    console.log('🚨 Sacred ICE: Emergency call triggered by user:', userId);

    try {
      // Get current location if permission granted
      let location: LocationData | undefined;
      if (shareLocation && 'geolocation' in navigator) {
        try {
          location = await this.getCurrentLocation();
          console.log('📍 Location obtained for emergency:', location);
        } catch (locationError) {
          console.warn('⚠️ Could not get location for emergency:', locationError);
        }
      }

      // Load ICE contacts - bypassing sovereignty filters
      const iceContacts = await this.getICEContacts(userId);
      if (iceContacts.length === 0) {
        throw new Error('No emergency contacts configured');
      }

      console.log(`🚨 Found ${iceContacts.length} emergency contacts`);

      const activations: ICEActivation[] = [];
      const errors: string[] = [];

      // Attempt to reach each contact in priority order
      for (const contact of iceContacts.sort((a, b) => a.priority - b.priority)) {
        try {
          const activation = await this.activateICEContact(
            userId,
            contact,
            message,
            location,
            'call'
          );
          activations.push(activation);
          
          // If this is a Sacred Shifter user, attempt WebRTC first
          if (contact.user_id) {
            await this.attemptWebRTCEmergencyCall(contact.user_id, activation.id);
          }
          
          // Always attempt fallback for maximum reliability
          await this.attemptFallbackCommunication(contact, message, location, activation.id);
          
        } catch (error) {
          console.error(`❌ Failed to activate ICE contact ${contact.name}:`, error);
          errors.push(`Failed to reach ${contact.name}: ${error.message}`);
        }
      }

      // Log the emergency activation
      console.log('🚨 Emergency activation complete:', {
        activations: activations.length,
        errors: errors.length,
        location_shared: !!location
      });

      return {
        success: activations.length > 0,
        activations,
        errors
      };

    } catch (error) {
      console.error('❌ Sacred ICE: Emergency call failed:', error);
      return {
        success: false,
        activations: [],
        errors: [error.message]
      };
    }
  }

  /**
   * 📍 **Location-Only Emergency** - Share location without full call
   */
  async shareEmergencyLocation(
    userId: string,
    message: string = "Emergency location update"
  ): Promise<{ success: boolean; shared_with: string[] }> {
    try {
      const location = await this.getCurrentLocation();
      const iceContacts = await this.getICEContacts(userId);
      
      const sharedWith: string[] = [];
      
      for (const contact of iceContacts) {
        try {
          await this.attemptFallbackCommunication(contact, message, location, `location-${Date.now()}`);
          sharedWith.push(contact.name);
        } catch (error) {
          console.error(`Failed to share location with ${contact.name}:`, error);
        }
      }

      return {
        success: sharedWith.length > 0,
        shared_with: sharedWith
      };
    } catch (error) {
      console.error('❌ Failed to share emergency location:', error);
      return {
        success: false,
        shared_with: []
      };
    }
  }

  /**
   * 🔗 **WebRTC Emergency Call** - Attempt direct P2P connection
   */
  private async attemptWebRTCEmergencyCall(
    targetUserId: string,
    activationId: string
  ): Promise<boolean> {
    try {
      console.log('📞 Attempting WebRTC emergency call to Sacred Shifter user:', targetUserId);

      // Initialize WebRTC signaling if not done
      if (!this.webRTCSignaling) {
        await this.webRTCSignaling.initialize(this.ssuC.getLocalPeerId());
      }

      // Send emergency call signal - bypasses sovereignty
      await this.webRTCSignaling.sendMessage({
        type: 'call-initiation',
        from: this.ssuC.getLocalPeerId(),
        to: targetUserId,
        callId: activationId,
        metadata: {
          emergency: true,
          bypass_sovereignty: true,
          priority: 'critical',
          activation_id: activationId
        }
      });

      // Use Sacred Voice Calling but mark as emergency
      const callId = await this.sacredVoiceCalling.initiateCall(
        [targetUserId],
        1.0, // Maximum consciousness level for emergency
        {
          emergency: true,
          bypass_filters: true,
          priority: 'critical'
        }
      );

      // Update activation status
      await this.updateActivationStatus(activationId, 'initiated', { webrtc_attempted: true });

      console.log('✅ WebRTC emergency call initiated:', callId);
      return true;

    } catch (error) {
      console.error('❌ WebRTC emergency call failed:', error);
      await this.updateActivationStatus(activationId, 'failed', { webrtc_attempted: true });
      return false;
    }
  }

  /**
   * 📱 **Fallback Communication** - SMS/Email via Supabase Functions
   */
  private async attemptFallbackCommunication(
    contact: ICEContact,
    message: string,
    location: LocationData | undefined,
    activationId: string
  ): Promise<boolean> {
    try {
      console.log('📨 Attempting fallback communication to:', contact.name);

      const { data, error } = await supabase.functions.invoke('call-ice-contact', {
        body: {
          contact_phone: contact.phone,
          contact_email: contact.email,
          contact_name: contact.name,
          user_name: 'Sacred Shifter User', // TODO: Get actual user name
          message: message,
          location: location,
          activation_type: 'call'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        await this.updateActivationStatus(activationId, 'fallback_sent', { fallback_attempted: true });
        console.log('✅ Fallback communication sent successfully');
        return true;
      } else {
        throw new Error('Fallback communication failed');
      }

    } catch (error) {
      console.error('❌ Fallback communication failed:', error);
      await this.updateActivationStatus(activationId, 'failed', { fallback_attempted: true });
      return false;
    }
  }

  /**
   * 📍 **Get Current Location**
   */
  private async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          });
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  /**
   * 📋 **Get ICE Contacts** - Bypasses sovereignty for emergency access
   */
  private async getICEContacts(userId: string): Promise<ICEContact[]> {
    try {
      const { data, error } = await supabase.rpc('get_ice_contacts_for_emergency', {
        user_uuid: userId
      });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('❌ Failed to get ICE contacts:', error);
      throw error;
    }
  }

  /**
   * 📝 **Create ICE Activation Record**
   */
  private async activateICEContact(
    userId: string,
    contact: ICEContact,
    message: string,
    location: LocationData | undefined,
    activationType: 'call' | 'message' | 'location_share'
  ): Promise<ICEActivation> {
    try {
      const { data, error } = await supabase
        .from('ice_activations')
        .insert({
          user_id: userId,
          activated_by: userId,
          contact_name: contact.name,
          contact_phone: contact.phone,
          contact_email: contact.email,
          contact_user_id: contact.user_id,
          activation_type: activationType,
          status: 'initiated',
          location_shared: !!location
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to create ICE activation:', error);
      throw error;
    }
  }

  /**
   * 🔄 **Update Activation Status**
   */
  private async updateActivationStatus(
    activationId: string,
    status: ICEActivation['status'],
    updates: Partial<ICEActivation> = {}
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ice_activations')
        .update({
          status,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', activationId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('❌ Failed to update activation status:', error);
    }
  }

  /**
   * 🏥 **Emergency Shutdown**
   */
  async shutdown(): Promise<void> {
    try {
      await this.webRTCSignaling?.shutdown();
      await this.webRTCMesh?.shutdown();
      console.log('🚨 Sacred ICE calling shutdown complete');
    } catch (error) {
      console.error('❌ Error during ICE calling shutdown:', error);
    }
  }
}
