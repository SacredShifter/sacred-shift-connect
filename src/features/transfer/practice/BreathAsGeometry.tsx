// Breath as Geometry Practice Module
// Guided breath practice with living geometry visualization

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DiamondMorph from "../components/DiamondMorph";
import PacketAnimation from "../components/PacketAnimation";
import { useBreathSession } from "./useBreathSession";
import { logTransferEvent } from "../api/transferClient";

export default function BreathAsGeometry() {
  const { sessionId, isActive, duration, start, stop, pause, resume } = useBreathSession();
  const [notes, setNotes] = useState("");
  const [packetsVisualised, setPacketsVisualised] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    try {
      await start(packetsVisualised);
      await logTransferEvent("start_breath_practice", { packets_visualised });
    } catch (error) {
      console.error("Failed to start breath practice:", error);
    }
  };

  const handleStop = async () => {
    try {
      await stop(notes);
      setNotes("");
      await logTransferEvent("stop_breath_practice", { 
        duration_seconds: duration,
        has_reflections: !!notes 
      });
    } catch (error) {
      console.error("Failed to stop breath practice:", error);
    }
  };

  const handlePause = () => {
    if (isPaused) {
      resume();
      setIsPaused(false);
    } else {
      pause();
      setIsPaused(true);
    }
  };

  const getBreathPhase = () => {
    if (duration < 30) return "circle";
    if (duration < 60) return "stretched";
    if (duration < 120) return "diamond";
    return "diamond+core";
  };

  const getBreathGuidance = () => {
    const phase = getBreathPhase();
    switch (phase) {
      case "circle":
        return "Begin with gentle, circular breathing. Feel the wind as flow around you.";
      case "stretched":
        return "Stretch your awareness. Imagine oxygen as discrete packets entering your vessel.";
      case "diamond":
        return "Focus on the diamond shape. Feel the geometry of your breath becoming more defined.";
      case "diamond+core":
        return "Connect to your inner core. Feel the living geometry of information transfer.";
      default:
        return "Breathe consciously. Feel the living geometry of your breath.";
    }
  };

  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🌬️</span>
          Breath as Living Geometry
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Feel wind as flow. Imagine oxygen as packets (inner seeds) entering a living vessel (you).
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visualization */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <DiamondMorph 
            phase={getBreathPhase() as any}
            withInner={true}
            fluid={isActive && !isPaused}
            size={160}
            animate={isActive}
          />
          <div className="flex-1 space-y-4">
            <PacketAnimation 
              packetCount={packetsVisualised ? 12 : 0}
              speed={isActive ? 1.5 : 0.5}
              size="md"
              direction="left-to-right"
              className="h-16"
            />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {getBreathGuidance()}
              </p>
            </div>
          </div>
        </div>

        {/* Session Controls */}
        <div className="space-y-4">
          {!sessionId ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={packetsVisualised}
                    onChange={(e) => setPacketsVisualised(e.target.checked)}
                    className="rounded"
                  />
                  Visualize oxygen as packets
                </label>
              </div>
              <Button 
                onClick={handleStart}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                Start 3-Minute Practice
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Session Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? (isPaused ? "Paused" : "Active") : "Inactive"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDuration(duration)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePause}
                  >
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleStop}
                  >
                    Finish & Save
                  </Button>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.min(Math.floor((duration / 180) * 100), 100)}%</span>
                </div>
                <Progress 
                  value={Math.min((duration / 180) * 100, 100)} 
                  className="h-2"
                />
              </div>

              {/* Reflections */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Reflections</label>
                <Textarea 
                  placeholder="What did you experience? How did the geometry feel? Any insights about information transfer?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Practice Guidance */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">Practice Guidance</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Begin with 3 minutes of conscious breathing</li>
            <li>• Visualize oxygen as discrete packets flowing into your lungs</li>
            <li>• Feel the geometry of your breath transforming (circle → diamond)</li>
            <li>• Connect to the living nature of information transfer</li>
            <li>• Notice how your consciousness affects the flow</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
