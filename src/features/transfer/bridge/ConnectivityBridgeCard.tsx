// Connectivity Bridge Card
// Explains the mesh analogy and links to SSUC status

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PacketAnimation from "../components/PacketAnimation";
import { logTransferEvent } from "../api/transferClient";
import { useEffect } from "react";

export default function ConnectivityBridgeCard() {
  useEffect(() => {
    logTransferEvent("view_connectivity_bridge");
  }, []);

  const handleViewSSUC = () => {
    logTransferEvent("click_ssuc_status");
    // Navigate to SSUC status page
    window.location.href = "/sacred-voice-calling";
  };

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          Mesh & Breath Analogy
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Understanding Sacred Shifter Universal Connectivity through the Law of Transfer
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analogy Explanation */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-green-600 dark:text-green-400">
                Breath System
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Wind carries oxygen packets</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Packets flow through air medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Reach living vessels (lungs)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Enable consciousness and life</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                Mesh Network
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Data packets flow through mesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Packets traverse network medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Reach receptive nodes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Enable consciousness and communication</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Packet Flow Visualization */}
        <div className="space-y-4">
          <h4 className="font-medium">Packet Flow Visualization</h4>
          <div className="p-4 bg-muted/50 rounded-lg">
            <PacketAnimation 
              packetCount={20}
              speed={1.5}
              size="sm"
              direction="left-to-right"
              className="h-12"
            />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Packets (oxygen/data) traverse a medium to reach receptive vessels
            </p>
          </div>
        </div>

        {/* Sacred Engineering Philosophy */}
        <div className="space-y-3">
          <h4 className="font-medium">Sacred Engineering Philosophy</h4>
          <blockquote className="text-sm italic text-muted-foreground border-l-4 border-blue-500 pl-4">
            "Packets in a mesh are like oxygen in wind: discrete seeds carried by a flowing medium, 
            routed to receptive nodes. The geometry of this transfer is living and dynamic, 
            adapting to the consciousness of the flow."
          </blockquote>
        </div>

        {/* SSUC Integration */}
        <div className="space-y-3">
          <h4 className="font-medium">Sacred Shifter Universal Connectivity</h4>
          <p className="text-sm text-muted-foreground">
            Experience the Law of Transfer in action through our consciousness-aware 
            telecommunications system that transcends traditional connectivity.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">WebRTC Mesh</Badge>
            <Badge variant="outline">CRDT Sync</Badge>
            <Badge variant="outline">Aura AI</Badge>
            <Badge variant="outline">Sacred Voice</Badge>
            <Badge variant="outline">Offline-First</Badge>
          </div>

          <Button 
            onClick={handleViewSSUC}
            variant="outline"
            className="w-full"
          >
            View SSUC Status & Sacred Voice Calling
          </Button>
        </div>

        {/* Technical Details */}
        <div className="space-y-3">
          <h4 className="font-medium">Technical Implementation</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-medium">Breath System</div>
              <div>• Wind → Oxygen → Lungs</div>
              <div>• Physical medium (air)</div>
              <div>• Biological processing</div>
              <div>• Consciousness integration</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium">Mesh Network</div>
              <div>• Packets → Mesh → Nodes</div>
              <div>• Digital medium (network)</div>
              <div>• Electronic processing</div>
              <div>• Consciousness integration</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
