// Vision Quick Capture Component
// Quick capture interface for visions and morphology tracking

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import DiamondMorph from "../components/DiamondMorph";
import { createVision, addVisionMorph, logTransferEvent } from "../api/transferClient";
import { PHASES, VISION_TAGS, type VisionCaptureData, DEFAULT_VISION_CAPTURE } from "./visionSchema";

export default function VisionQuickCapture() {
  const [formData, setFormData] = useState<VisionCaptureData>(DEFAULT_VISION_CAPTURE);
  const [isSaving, setIsSaving] = useState(false);
  const [savedVision, setSavedVision] = useState<string | null>(null);

  const handleInputChange = (field: keyof VisionCaptureData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag as any) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag as any]
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please provide both title and description");
      return;
    }

    setIsSaving(true);
    try {
      // Create vision
      const vision = await createVision({ 
        title: formData.title,
        description: formData.description,
        tags: formData.tags
      });

      // Add vision morph
      await addVisionMorph({
        vision_id: vision.id,
        phase_from: formData.phaseFrom,
        phase_to: formData.phaseTo,
        has_inner_core: formData.hasInnerCore,
        fluidic_motion: formData.fluidicMotion,
        notes: formData.notes
      });

      await logTransferEvent("save_vision", { 
        visionId: vision.id,
        phaseFrom: formData.phaseFrom,
        phaseTo: formData.phaseTo,
        hasInnerCore: formData.hasInnerCore,
        tags: formData.tags
      });

      setSavedVision(vision.id);
      setFormData(DEFAULT_VISION_CAPTURE);
      
      // Reset saved vision indicator after 3 seconds
      setTimeout(() => setSavedVision(null), 3000);
    } catch (error) {
      console.error("Failed to save vision:", error);
      alert("Failed to save vision. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">👁️</span>
          Vision Quick Capture
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Capture visions and track their morphological transformations
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vision Title</label>
            <Input 
              placeholder="What did you see?"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              placeholder="Describe the vision in detail..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea 
              placeholder="Additional observations, feelings, or insights..."
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* Morphology Tracking */}
        <div className="space-y-4">
          <h4 className="font-medium">Morphology Tracking</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phase From</label>
              <Select 
                value={formData.phaseFrom} 
                onValueChange={(value) => handleInputChange("phaseFrom", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHASES.map(phase => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phase To</label>
              <Select 
                value={formData.phaseTo} 
                onValueChange={(value) => handleInputChange("phaseTo", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHASES.map(phase => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox 
                checked={formData.hasInnerCore}
                onCheckedChange={(checked) => handleInputChange("hasInnerCore", checked)}
              />
              Has inner core
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox 
                checked={formData.fluidicMotion}
                onCheckedChange={(checked) => handleInputChange("fluidicMotion", checked)}
              />
              Fluidic motion
            </label>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2">
            {VISION_TAGS.map(tag => (
              <Badge
                key={tag}
                variant={formData.tags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h4 className="font-medium">Preview</h4>
          <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-lg">
            <DiamondMorph 
              phase={formData.phaseTo as any}
              withInner={formData.hasInnerCore}
              fluid={formData.fluidicMotion}
              size={80}
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{formData.title || "Untitled Vision"}</p>
              <p className="text-xs text-muted-foreground">
                {formData.phaseFrom} → {formData.phaseTo}
                {formData.hasInnerCore && " with inner core"}
                {formData.fluidicMotion && " (fluidic)"}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSave}
            disabled={isSaving || !formData.title.trim() || !formData.description.trim()}
            className="flex-1"
          >
            {isSaving ? "Saving..." : "Save Vision + Morph"}
          </Button>
          
          {savedVision && (
            <Badge variant="default" className="bg-green-600">
              ✓ Saved
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
