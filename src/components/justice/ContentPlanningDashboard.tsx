import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContentPlanning } from '@/hooks/useContentPlanning';
import { Play, Eye, CheckCircle, Clock, Sparkles, Heart } from 'lucide-react';

export const ContentPlanningDashboard = () => {
  const { loading, getContentPlans, approveContentPlan, getMediaAssets } = useContentPlanning();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mediaAssets, setMediaAssets] = useState([]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const data = await getContentPlans();
    setPlans(data || []);
  };

  const handleViewPlan = async (plan: any) => {
    setSelectedPlan(plan);
    const assets = await getMediaAssets(plan.id);
    setMediaAssets(assets || []);
  };

  const handleApprovePlan = async (planId: string) => {
    const success = await approveContentPlan(planId);
    if (success) {
      loadPlans();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rendering': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated': return <Eye className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rendering': return <Clock className="w-4 h-4" />;
      case 'completed': return <Play className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Planning</h2>
          <p className="text-muted-foreground">Sacred content transformation pipeline</p>
        </div>
        <Button onClick={loadPlans} disabled={loading}>
          Refresh Plans
        </Button>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">All Plans</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4">
            {plans.map((plan: any) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {plan.title}
                        <Badge variant="outline" className={`${getStatusColor(plan.status)} text-white`}>
                          {getStatusIcon(plan.status)}
                          {plan.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPlan(plan)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {plan.status === 'generated' && (
                        <Button
                          size="sm"
                          onClick={() => handleApprovePlan(plan.id)}
                          disabled={loading}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Duration</p>
                      <p>{Math.floor(plan.target_duration / 60)}:{String(plan.target_duration % 60).padStart(2, '0')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Chakra Focus</p>
                      <p className="capitalize">{plan.chakra_focus}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Sacred Elements</p>
                      <p>{plan.sacred_elements?.length || 0} elements</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Created</p>
                      <p>{new Date(plan.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="grid gap-4">
            {plans.filter((p: any) => p.status === 'generated').map((plan: any) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {plan.title}
                    <Badge variant="outline">Awaiting Approval</Badge>
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleViewPlan(plan)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                    <Button
                      onClick={() => handleApprovePlan(plan.id)}
                      disabled={loading}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="grid gap-4">
            {plans.filter((p: any) => ['approved', 'rendering', 'completed'].includes(p.status)).map((plan: any) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {plan.title}
                    <Badge className={`${getStatusColor(plan.status)} text-white`}>
                      {getStatusIcon(plan.status)}
                      {plan.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() => handleViewPlan(plan)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedPlan && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Plan Details: {selectedPlan.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Content Structure</h4>
                  <div className="text-sm space-y-2">
                    {selectedPlan.content_structure?.opening && (
                      <div className="p-3 bg-muted/50 rounded">
                        <p className="font-medium">Opening ({selectedPlan.content_structure.opening.duration}s)</p>
                        <p className="text-muted-foreground">{selectedPlan.content_structure.opening.type}</p>
                      </div>
                    )}
                    {selectedPlan.content_structure?.main_content && (
                      <div className="p-3 bg-muted/50 rounded">
                        <p className="font-medium">Main Content ({selectedPlan.content_structure.main_content.duration}s)</p>
                        <div className="mt-2 space-y-1">
                          {selectedPlan.content_structure.main_content.sections?.map((section: any, idx: number) => (
                            <div key={idx} className="text-xs">
                              {section.title} - {section.duration}s
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Sacred Elements</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlan.sacred_elements?.map((element: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{element}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Energy Signature</h4>
                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">Frequency:</span> {selectedPlan.energy_signature?.frequency_hz}Hz</p>
                    <p><span className="font-medium">Chakra Focus:</span> {selectedPlan.chakra_focus}</p>
                    <p><span className="font-medium">Sacred Geometry:</span> {selectedPlan.energy_signature?.geometric_pattern}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Media Assets ({mediaAssets.length})</h4>
                  <div className="space-y-2">
                    {mediaAssets.map((asset: any) => (
                      <div key={asset.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <span className="text-sm capitalize">{asset.asset_type.replace('_', ' ')}</span>
                        <Badge variant="outline" className={asset.status === 'completed' ? 'bg-green-500 text-white' : ''}>
                          {asset.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Video Script Preview</h4>
              <div className="bg-muted/50 p-4 rounded text-sm whitespace-pre-line max-h-40 overflow-y-auto">
                {selectedPlan.video_script}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};