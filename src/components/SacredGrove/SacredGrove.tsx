import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TreePine, 
  Sparkles, 
  Heart, 
  Users, 
  MessageCircle, 
  Zap,
  Eye,
  Compass
} from 'lucide-react';
import { useJusticePlatformAwareness } from '@/hooks/useJusticePlatformAwareness';

interface GroveSession {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  current_participants: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface GroveFacilitator {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  expertise: string[];
  contact_info: {
    email: string;
    phone: string;
    social_media: string[];
  };
  availability: {
    days: string[];
    times: string[];
  };
  created_at: string;
  updated_at: string;
}

interface GroveCommunity {
  id: string;
  name: string;
  description: string;
  rules: string[];
  guidelines: string[];
  values: string[];
  communication_channels: {
    forum: string;
    chat: string;
    social_media: string[];
  };
  governance_model: string;
  decision_making_process: string;
  conflict_resolution_strategies: string[];
  created_at: string;
  updated_at: string;
}

interface GroveResource {
  id: string;
  title: string;
  description: string;
  resource_type: 'document' | 'tool' | 'template' | 'guide';
  url: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface GroveEvent {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  organizer: string;
  agenda: string[];
  speakers: string[];
  registration_details: {
    url: string;
    deadline: string;
    cost: number;
  };
  created_at: string;
  updated_at: string;
}

interface GroveInsight {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface GroveChallenge {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  criteria: string[];
  rewards: string[];
  created_at: string;
  updated_at: string;
}

interface GroveCelebration {
  id: string;
  title: string;
  description: string;
  date: string;
  attendees: string[];
  highlights: string[];
  created_at: string;
  updated_at: string;
}

interface GroveRitual {
  id: string;
  title: string;
  description: string;
  steps: string[];
  purpose: string;
  frequency: string;
  created_at: string;
  updated_at: string;
}

interface GrovePractice {
  id: string;
  title: string;
  description: string;
  steps: string[];
  benefits: string[];
  duration: string;
  created_at: string;
  updated_at: string;
}

interface GroveFeedback {
  id: string;
  content: string;
  author: string;
  target: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface GroveTestimonial {
  id: string;
  content: string;
  author: string;
  target: string;
  created_at: string;
  updated_at: string;
}

interface GroveFAQ {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface GroveGlossaryTerm {
  id: string;
  term: string;
  definition: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface GroveQuote {
  id: string;
  text: string;
  author: string;
  source: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface GroveStory {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface GroveReflection {
  id: string;
  prompt: string;
  response: string;
  author: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface GroveResourceLink {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface GroveAnnouncement {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface GrovePoll {
  id: string;
  question: string;
  options: string[];
  votes: number[];
  created_at: string;
  updated_at: string;
}

interface GroveSurvey {
  id: string;
  title: string;
  questions: string[];
  responses: string[][];
  created_at: string;
  updated_at: string;
}

interface GroveCalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface GroveTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  due_date: string;
  status: 'open' | 'in progress' | 'completed';
  created_at: string;
  updated_at: string;
}

interface GroveProject {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  team_members: string[];
  status: 'planning' | 'in progress' | 'completed' | 'on hold';
  created_at: string;
  updated_at: string;
}

interface GroveGoal {
  id: string;
  title: string;
  description: string;
  target_date: string;
  metrics: string[];
  status: 'open' | 'in progress' | 'achieved' | 'missed';
  created_at: string;
  updated_at: string;
}

interface GroveValue {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface GrovePrinciple {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface GroveGuideline {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface GroveRule {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface GroveAgreement {
  id: string;
  title: string;
  description: string;
  signatories: string[];
  created_at: string;
  updated_at: string;
}

interface GrovePolicy {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface GroveStandard {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface GroveBestPractice {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface GroveTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface GroveChecklist {
  id: string;
  title: string;
  items: string[];
  created_at: string;
  updated_at: string;
}

interface GroveFramework {
  id: string;
  title: string;
  description: string;
  components: string[];
  created_at: string;
  updated_at: string;
}

interface GroveModel {
  id: string;
  title: string;
  description: string;
  elements: string[];
  created_at: string;
  updated_at: string;
}

interface GroveDiagram {
  id: string;
  title: string;
  description: string;
  elements: string[];
  created_at: string;
  updated_at: string;
}

interface GroveMap {
  id: string;
  title: string;
  description: string;
  locations: string[];
  created_at: string;
  updated_at: string;
}

interface GroveNetwork {
  id: string;
  title: string;
  description: string;
  nodes: string[];
  edges: string[];
  created_at: string;
  updated_at: string;
}

interface GroveSystem {
  id: string;
  title: string;
  description: string;
  components: string[];
  interactions: string[];
  created_at: string;
  updated_at: string;
}

interface GroveProcess {
  id: string;
  title: string;
  description: string;
  steps: string[];
  created_at: string;
  updated_at: string;
}

interface GroveWorkflow {
  id: string;
  title: string;
  description: string;
  tasks: string[];
  created_at: string;
  updated_at: string;
}

interface GroveRoutine {
  id: string;
  title: string;
  description: string;
  steps: string[];
  frequency: string;
  created_at: string;
  updated_at: string;
}

interface GroveHabit {
  id: string;
  title: string;
  description: string;
  trigger: string;
  behavior: string;
  reward: string;
  created_at: string;
  updated_at: string;
}

interface GrovePracticeArea {
  id: string;
  title: string;
  description: string;
  practices: string[];
  created_at: string;
  updated_at: string;
}

interface GroveSkill {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
}

interface GroveCompetency {
  id: string;
  title: string;
  description: string;
  skills: string[];
  created_at: string;
  updated_at: string;
}

interface GroveRole {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  created_at: string;
  updated_at: string;
}

interface GroveTeam {
  id: string;
  title: string;
  description: string;
  members: string[];
  created_at: string;
  updated_at: string;
}

interface GroveOrganization {
  id: string;
  title: string;
  description: string;
  teams: string[];
  created_at: string;
  updated_at: string;
}

interface GroveEcosystem {
  id: string;
  title: string;
  description: string;
  organizations: string[];
  created_at: string;
  updated_at: string;
}

interface GroveWorld {
  id: string;
  title: string;
  description: string;
  ecosystems: string[];
  created_at: string;
  updated_at: string;
}

const SacredGrove: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [communityPulse, setCommunityPulse] = useState({
    engagement: 75,
    resonance: 88,
    growth: 62
  });
  const [sessionDetails, setSessionDetails] = useState<GroveSession | null>(null);
  const [facilitatorDetails, setFacilitatorDetails] = useState<GroveFacilitator | null>(null);
  const [communityDetails, setCommunityDetails] = useState<GroveCommunity | null>(null);
  const [resourceDetails, setResourceDetails] = useState<GroveResource | null>(null);
  const [eventDetails, setEventDetails] = useState<GroveEvent | null>(null);
  const [insightDetails, setInsightDetails] = useState<GroveInsight | null>(null);
  const [challengeDetails, setChallengeDetails] = useState<GroveChallenge | null>(null);
  const [celebrationDetails, setCelebrationDetails] = useState<GroveCelebration | null>(null);
  const [ritualDetails, setRitualDetails] = useState<GroveRitual | null>(null);
  const [practiceDetails, setPracticeDetails] = useState<GrovePractice | null>(null);
  const [feedbackDetails, setFeedbackDetails] = useState<GroveFeedback | null>(null);
  const [testimonialDetails, setTestimonialDetails] = useState<GroveTestimonial | null>(null);
  const [faqDetails, setFaqDetails] = useState<GroveFAQ | null>(null);
  const [glossaryTermDetails, setGlossaryTermDetails] = useState<GroveGlossaryTerm | null>(null);
  const [quoteDetails, setQuoteDetails] = useState<GroveQuote | null>(null);
  const [storyDetails, setStoryDetails] = useState<GroveStory | null>(null);
  const [reflectionDetails, setReflectionDetails] = useState<GroveReflection | null>(null);
  const [resourceLinkDetails, setResourceLinkDetails] = useState<GroveResourceLink | null>(null);
  const [announcementDetails, setAnnouncementDetails] = useState<GroveAnnouncement | null>(null);
  const [pollDetails, setPollDetails] = useState<GrovePoll | null>(null);
  const [surveyDetails, setSurveyDetails] = useState<GroveSurvey | null>(null);
  const [calendarEventDetails, setCalendarEventDetails] = useState<GroveCalendarEvent | null>(null);
  const [taskDetails, setTaskDetails] = useState<GroveTask | null>(null);
  const [projectDetails, setProjectDetails] = useState<GroveProject | null>(null);
  const [goalDetails, setGoalDetails] = useState<GroveGoal | null>(null);
  const [valueDetails, setValueDetails] = useState<GroveValue | null>(null);
  const [principleDetails, setPrincipleDetails] = useState<GrovePrinciple | null>(null);
  const [guidelineDetails, setGuidelineDetails] = useState<GroveGuideline | null>(null);
  const [ruleDetails, setRuleDetails] = useState<GroveRule | null>(null);
  const [agreementDetails, setAgreementDetails] = useState<GroveAgreement | null>(null);
  const [policyDetails, setPolicyDetails] = useState<GrovePolicy | null>(null);
  const [standardDetails, setStandardDetails] = useState<GroveStandard | null>(null);
  const [bestPracticeDetails, setBestPracticeDetails] = useState<GroveBestPractice | null>(null);
  const [templateDetails, setTemplateDetails] = useState<GroveTemplate | null>(null);
  const [checklistDetails, setChecklistDetails] = useState<GroveChecklist | null>(null);
  const [frameworkDetails, setFrameworkDetails] = useState<GroveFramework | null>(null);
  const [modelDetails, setModelDetails] = useState<GroveModel | null>(null);
  const [diagramDetails, setDiagramDetails] = useState<GroveDiagram | null>(null);
  const [mapDetails, setMapDetails] = useState<GroveMap | null>(null);
  const [networkDetails, setNetworkDetails] = useState<GroveNetwork | null>(null);
  const [systemDetails, setSystemDetails] = useState<GroveSystem | null>(null);
  const [processDetails, setProcessDetails] = useState<GroveProcess | null>(null);
  const [workflowDetails, setWorkflowDetails] = useState<GroveWorkflow | null>(null);
  const [routineDetails, setRoutineDetails] = useState<GroveRoutine | null>(null);
  const [habitDetails, setHabitDetails] = useState<GroveHabit | null>(null);
  const [practiceAreaDetails, setPracticeAreaDetails] = useState<GrovePracticeArea | null>(null);
  const [skillDetails, setSkillDetails] = useState<GroveSkill | null>(null);
  const [competencyDetails, setCompetencyDetails] = useState<GroveCompetency | null>(null);
  const [roleDetails, setRoleDetails] = useState<GroveRole | null>(null);
  const [teamDetails, setTeamDetails] = useState<GroveTeam | null>(null);
  const [organizationDetails, setOrganizationDetails] = useState<GroveOrganization | null>(null);
  const [ecosystemDetails, setEcosystemDetails] = useState<GroveEcosystem | null>(null);
  const [worldDetails, setWorldDetails] = useState<GroveWorld | null>(null);

  const { recordGroveActivity } = useJusticePlatformAwareness();

  useEffect(() => {
    recordGroveActivity('entry', 'SacredGrove');

    return () => {
      recordGroveActivity('exit', 'SacredGrove');
    };
  }, [recordGroveActivity]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-background/90 backdrop-blur-md border border-border/50"
      layout
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Grove Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-6 pr-6 pt-6">
        <CardTitle className="text-2xl font-semibold tracking-tight flex items-center gap-3">
          <TreePine className="h-6 w-6 text-green-500" />
          Sacred Grove
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={toggleExpansion}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <CardContent className="grid gap-4 p-6">
              {/* Community Pulse Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/30 backdrop-blur-sm border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{communityPulse.engagement}%</div>
                    <Progress value={communityPulse.engagement} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30 backdrop-blur-sm border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Resonance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{communityPulse.resonance}%</div>
                    <Progress value={communityPulse.resonance} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30 backdrop-blur-sm border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{communityPulse.growth}%</div>
                    <Progress value={communityPulse.growth} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="bg-secondary/80 hover:bg-secondary text-white">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Spark Inspiration
                </Button>
                <Button className="bg-primary/80 hover:bg-primary text-white">
                  <Heart className="mr-2 h-4 w-4" />
                  Share Gratitude
                </Button>
                <Button className="bg-accent/80 hover:bg-accent text-white">
                  <Users className="mr-2 h-4 w-4" />
                  Connect Members
                </Button>
                <Button className="bg-destructive/80 hover:bg-destructive text-white">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Start Discussion
                </Button>
              </div>

              {/* Grove Activity Feed */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Card className="bg-muted/10 backdrop-blur-sm border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <p className="text-sm">
                        New session "Quantum Alignment" scheduled for tomorrow.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/10 backdrop-blur-sm border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <p className="text-sm">
                        Insight shared by @LightWeaver on "Sacred Geometry".
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/10 backdrop-blur-sm border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Compass className="h-4 w-4 text-purple-500" />
                      <p className="text-sm">
                        New resource "Meditation Techniques" added to the library.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SacredGrove;
