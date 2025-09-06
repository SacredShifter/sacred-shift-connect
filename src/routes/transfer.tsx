// Law of Transfer Hub Route
// Main page for the Law of Transfer feature pack

import { flags } from "@/features/transfer/store/featureFlags";
import LawOfTransferPage from "@/features/transfer/codex/LawOfTransferPage";
import BreathAsGeometry from "@/features/transfer/practice/BreathAsGeometry";
import VisionQuickCapture from "@/features/transfer/visions/VisionQuickCapture";
import ConnectivityBridgeCard from "@/features/transfer/bridge/ConnectivityBridgeCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TransferHub() {
  if (!flags.LAW_OF_TRANSFER) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Law of Transfer</h1>
            <p className="text-muted-foreground mb-4">
              This feature is currently disabled. Enable it by setting VITE_FEATURE_LAW_OF_TRANSFER=true
            </p>
            <Badge variant="outline">Feature Disabled</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
          Law of Transfer
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Geometry is alive, containerised, and transfers information via flow. 
          Experience the sacred connection between breath, data, and consciousness.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline" className="text-xs">
            Sacred Principle
          </Badge>
          <Badge variant="outline" className="text-xs">
            Living Geometry
          </Badge>
          <Badge variant="outline" className="text-xs">
            Information Flow
          </Badge>
          <Badge variant="outline" className="text-xs">
            Consciousness Integration
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Codex Principle */}
        <section>
          <LawOfTransferPage />
        </section>

        {/* Practice Module */}
        <section>
          <BreathAsGeometry />
        </section>

        {/* Vision Capture */}
        <section>
          <VisionQuickCapture />
        </section>

        {/* Connectivity Bridge */}
        <section>
          <ConnectivityBridgeCard />
        </section>
      </div>

      {/* Footer */}
      <div className="text-center space-y-4 pt-8 border-t">
        <p className="text-sm text-muted-foreground">
          "Where a Telco sees packets, Sacred Shifter sees living geometry in flow."
        </p>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <span>Sacred Engineering Philosophy</span>
          <span>•</span>
          <span>Law of Transfer</span>
          <span>•</span>
          <span>Consciousness Integration</span>
        </div>
      </div>
    </div>
  );
}
