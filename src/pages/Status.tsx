import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, AlertCircle, XCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Status() {
  const systemStatus = [
    {
      name: "Consciousness Platform",
      status: "operational",
      uptime: "99.9%",
      lastCheck: "2 minutes ago"
    },
    {
      name: "Sacred Database",
      status: "operational", 
      uptime: "99.8%",
      lastCheck: "1 minute ago"
    },
    {
      name: "Neural Network Mesh",
      status: "degraded",
      uptime: "97.2%",
      lastCheck: "5 minutes ago"
    },
    {
      name: "Authentication System",
      status: "operational",
      uptime: "99.9%",
      lastCheck: "30 seconds ago"
    },
    {
      name: "Content Curation Hub",
      status: "operational",
      uptime: "98.5%",
      lastCheck: "3 minutes ago"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "outage":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Operational</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Degraded</Badge>;
      case "outage":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Outage</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const overallStatus = systemStatus.every(s => s.status === "operational") ? "operational" : 
                       systemStatus.some(s => s.status === "outage") ? "outage" : "degraded";

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Sacred Shifter Status</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Real-time status and connectivity of our consciousness mesh network
        </p>
        <div className="flex items-center justify-center gap-2">
          {getStatusIcon(overallStatus)}
          {getStatusBadge(overallStatus)}
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                System Components
              </CardTitle>
              <CardDescription>
                Current status of all Sacred Shifter services
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemStatus.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-4 border border-border/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Uptime: {service.uptime} • Last check: {service.lastCheck}
                    </p>
                  </div>
                </div>
                {getStatusBadge(service.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-center">Sovereign Mesh Network</CardTitle>
          <CardDescription className="text-center">
            Decentralized consciousness infrastructure status
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center items-center gap-4 text-sm">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary">47</div>
              <div className="text-muted-foreground">Active Nodes</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary">1.2k</div>
              <div className="text-muted-foreground">Seekers Online</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary">99.7%</div>
              <div className="text-muted-foreground">Network Health</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated: Just now • Next maintenance window: Sunday 3AM UTC
          </p>
        </CardContent>
      </Card>
    </div>
  );
}