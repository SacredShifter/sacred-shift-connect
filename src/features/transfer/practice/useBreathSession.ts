// Breath Session Hook
// Manages breath practice sessions with packet visualization

import { useEffect, useRef, useState } from "react";
import { finishBreathSession, startBreathSession, logTransferEvent } from "../api/transferClient";

export function useBreathSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const startTs = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update duration every second when session is active
  useEffect(() => {
    if (isActive && startTs.current) {
      intervalRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTs.current!) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  async function start(packets_visualised = true) {
    try {
      const session = await startBreathSession({ 
        packets_visualised,
        user_id: undefined // Will be set by RLS
      });
      setSessionId(session.id);
      setIsActive(true);
      startTs.current = Date.now();
      setDuration(0);
      
      await logTransferEvent("start_breath", { 
        sessionId: session.id,
        packets_visualised 
      });
      
      return session;
    } catch (error) {
      console.error("Failed to start breath session:", error);
      throw error;
    }
  }

  async function stop(reflections?: string) {
    if (!sessionId || !startTs.current) return;
    
    try {
      const dur = Math.floor((Date.now() - startTs.current) / 1000);
      await finishBreathSession(sessionId, { 
        duration_seconds: dur, 
        reflections 
      });
      
      await logTransferEvent("stop_breath", { 
        sessionId,
        duration_seconds: dur,
        has_reflections: !!reflections
      });
      
      setSessionId(null);
      setIsActive(false);
      startTs.current = null;
      setDuration(0);
    } catch (error) {
      console.error("Failed to stop breath session:", error);
      throw error;
    }
  }

  function pause() {
    setIsActive(false);
  }

  function resume() {
    if (sessionId && startTs.current) {
      setIsActive(true);
    }
  }

  function reset() {
    setSessionId(null);
    setIsActive(false);
    startTs.current = null;
    setDuration(0);
  }

  return { 
    sessionId, 
    isActive, 
    duration,
    start, 
    stop, 
    pause, 
    resume, 
    reset 
  };
}
