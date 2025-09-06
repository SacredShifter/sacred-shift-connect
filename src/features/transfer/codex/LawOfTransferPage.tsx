// Law of Transfer Codex Page
// Displays the canonical Law of Transfer principle with interactive visualizations

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DiamondMorph from "../components/DiamondMorph";
import PacketAnimation from "../components/PacketAnimation";
import { logTransferEvent, getCodexPrinciple } from "../api/transferClient";
import type { CodexPrinciple } from "@/types/transfer";

export default function LawOfTransferPage() {
  const [principle, setPrinciple] = useState<CodexPrinciple | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [morphPhase, setMorphPhase] = useState<"circle" | "stretched" | "diamond" | "diamond+core">("circle");

  useEffect(() => {
    const loadPrinciple = async () => {
      try {
        const data = await getCodexPrinciple("law-of-transfer");
        setPrinciple(data);
        await logTransferEvent("open_codex", { slug: "law-of-transfer" });
      } catch (error) {
        console.error("Failed to load Law of Transfer principle:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrinciple();
  }, []);

  // Cycle through morph phases
  useEffect(() => {
    const phases: Array<"circle" | "stretched" | "diamond" | "diamond+core"> = ["circle", "stretched", "diamond", "diamond+core"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % phases.length;
      setMorphPhase(phases[currentIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Law of Transfer
        </h1>
        <p className="text-muted-foreground text-lg">
          Geometry is alive, containerised, and transfers information via flow
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
        </div>
      </div>

      {/* Core Principle */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            Sacred Principle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physical Analogue */}
            <div className="space-y-3">
              <h3 className="font-semibold text-green-600 dark:text-green-400">
                Physical Analogue
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded">Wind</span>
                <span className="text-muted-foreground">→</span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded">Oxygen</span>
                <span className="text-muted-foreground">→</span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded">Breath</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Wind carries oxygen packets to living vessels, enabling breath and life.
              </p>
            </div>

            {/* Engineering Analogue */}
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                Engineering Analogue
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">Packets</span>
                <span className="text-muted-foreground">→</span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">Mesh</span>
                <span className="text-muted-foreground">→</span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">Nodes</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Data packets flow through mesh networks to receptive nodes, enabling communication.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Living Geometry Visualization */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            Living Geometry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <DiamondMorph 
              phase={morphPhase}
              withInner={true}
              fluid={true}
              size={160}
              animate={true}
            />
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold">
                Diamonds with Inner Cores
              </h3>
              <p className="text-sm text-muted-foreground">
                Symbolize carriers: outer vessel (light) with inner seed (density).
                The geometry transforms dynamically, showing the living nature of information transfer.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {morphPhase}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Fluid Motion
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Inner Core
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Packet Flow Visualization */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            Packets in Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PacketAnimation 
            packetCount={15}
            speed={1.2}
            size="md"
            direction="left-to-right"
            className="h-20"
          />
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Packets (oxygen/data) traverse a medium to reach a receptive vessel.
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>Discrete Seeds</span>
              <span>•</span>
              <span>Flowing Medium</span>
              <span>•</span>
              <span>Receptive Vessel</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sacred Engineering Philosophy */}
      <Card className="border-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800">
        <CardContent className="p-6">
          <blockquote className="text-center space-y-4">
            <p className="text-lg italic text-muted-foreground">
              "Where a Telco sees packets, Sacred Shifter sees living geometry in flow."
            </p>
            <footer className="text-sm text-muted-foreground">
              — Sacred Engineering Philosophy
            </footer>
          </blockquote>
        </CardContent>
      </Card>

      {/* Full Principle Text */}
      {principle && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Principle</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: principle.body_md.replace(/\n/g, '<br/>') 
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
