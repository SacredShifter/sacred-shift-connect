import { useEffect, useCallback } from 'react';
import { useJusticePlatformContext } from '@/contexts/JusticePlatformContext';
import { useJusticeChat } from './useJusticeChat';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useJusticePlatformAwareness() {
  const { platformState, recordActivity, getJusticeContext } = useJusticePlatformContext();
  const { user } = useAuth();

  // Enhanced Justice invocation with platform context
  const invokeJusticeWithContext = useCallback(async (request: any) => {
    const platformContext = getJusticeContext();
    
    const enhancedRequest = {
      ...request,
      platform_context: platformContext,
      context_data: {
        ...request.context_data,
        platform_awareness: platformContext
      }
    };

    // For now, just log - would integrate with actual Justice system
    console.log('Justice invoked with context:', enhancedRequest);
    return { success: true, response: 'Justice acknowledged' };
  }, [getJusticeContext]);

  // Record Grove entry/exit for Justice awareness
  const recordGroveActivity = useCallback(async (
    activityType: 'entry' | 'exit' | 'interaction',
    groveComponent: string,
    interactionData?: any
  ) => {
    if (!user) return;

    // Record in platform context
    recordActivity({
      type: activityType === 'entry' ? 'grove_entry' : 'grove_exit',
      userId: user.id,
      data: {
        grove_component: groveComponent,
        interaction_data: interactionData,
        user_consciousness_state: 'grove_engaged'
      }
    });

    // Store in Grove interactions table for Justice's direct awareness
    try {
      await supabase
        .from('aura_grove_interactions')
        .insert({
          user_id: user.id,
          interaction_type: activityType,
          grove_component: groveComponent,
          aura_request: {
            action: 'grove_awareness_update',
            user_activity: activityType,
            component: groveComponent
          },
          consciousness_state_before: 'platform_active',
          consciousness_state_after: activityType === 'entry' ? 'grove_engaged' : 'platform_active'
        });
    } catch (error) {
      console.error('Error recording Grove activity for Justice:', error);
    }
  }, [user, recordActivity]);

  // Let Justice know about significant platform events
  const notifyJusticeOfEvent = useCallback(async (
    eventType: string,
    eventData: any,
    requiresResponse = false
  ) => {
    try {
      const request = {
        action: 'platform_event_notification',
        prompt: `Platform Event: ${eventType}`,
        context_data: {
          event_type: eventType,
          event_data: eventData,
          platform_context: getJusticeContext(),
          requires_justice_response: requiresResponse
        }
      };

      if (requiresResponse) {
        return await invokeJusticeWithContext(request);
      } else {
        // Fire and forget notification
        invokeJusticeWithContext(request).catch(error => 
          console.error('Error notifying Justice of event:', error)
        );
      }
    } catch (error) {
      console.error('Error in notifyJusticeOfEvent:', error);
    }
  }, [invokeJusticeWithContext, getJusticeContext]);

  // Check if Justice should respond to current platform state
  const checkForJusticeInitiative = useCallback(async () => {
    const context = getJusticeContext();
    
    // Conditions that might trigger Justice's autonomous initiative
    const shouldTriggerInitiative = 
      context.community_pulse.grove_engagement > 3 ||
      context.community_pulse.resonance_level > 0.8 ||
      context.platform_state.currentActivities.length > 10;

    if (shouldTriggerInitiative) {
      return await invokeJusticeWithContext({
        action: 'autonomous_initiative',
        context_data: {
          trigger: 'high_platform_activity',
          platform_context: context
        }
      });
    }
  }, [invokeJusticeWithContext, getJusticeContext]);

  // Sync Justice with current platform state periodically
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      try {
        // Update Justice with current platform pulse
        await invokeJusticeWithContext({
          action: 'platform_pulse_sync',
          context_data: {
            sync_type: 'periodic_update',
            platform_context: getJusticeContext()
          }
        });
      } catch (error) {
        // Silent sync - don't spam console
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(syncInterval);
  }, [invokeJusticeWithContext, getJusticeContext]);

  // Check for autonomous initiatives periodically
  useEffect(() => {
    const initiativeInterval = setInterval(checkForJusticeInitiative, 10 * 60 * 1000); // Every 10 minutes
    return () => clearInterval(initiativeInterval);
  }, [checkForJusticeInitiative]);

  return {
    platformState,
    invokeJusticeWithContext,
    recordGroveActivity,
    notifyJusticeOfEvent,
    checkForJusticeInitiative,
    getJusticeContext
  };
}
