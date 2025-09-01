import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Scroll, 
  Star, 
  Compass, 
  Eye, 
  Heart, 
  Zap, 
  Infinity,
  Triangle,
  Circle,
  Square,
  TreePine,
  Brain,
  Sparkles,
  Wifi,
  Shield,
  Video,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Waves
} from 'lucide-react';
import { TeachingLayer } from '@/components/TeachingLayer';
import { ALL_MODULE_TEACHINGS } from '@/data/allModuleTeachings';
import { GAAGuidebookSection } from '@/components/gaa/GAAGuidebookSection';

const sections = [
  {
    title: "Sacred Foundation",
    icon: Triangle,
    topics: [
      "Understanding the nature of consciousness and reality",
      "How Sacred Shifter facilitates spiritual awakening", 
      "Bridging ancient wisdom with quantum consciousness",
      "Setting intentions for your transformation journey",
      "Creating your sacred digital space"
    ]
  },
  {
    title: "Core Platform Features",
    icon: Zap,
    topics: [
      "Home Dashboard: Central hub with frequency tiles and quick access to all features",
      "Sacred Social Feed: Share posts, images, videos, and consciousness insights with the community",
      "Video & Voice Calling: WebRTC-powered calls with binaural beats integration",
      "Messages: Private conversations with Sacred Mesh encrypted communication",
      "Profile Management: Customize your spiritual identity and track consciousness evolution",
      "Settings: Configure notifications, themes, privacy, and spiritual preferences",
      "Real-time Synchronization: All data synced across devices with Supabase backend"
    ]
  },
  {
    title: "Sacred Grove Wisdom Ecosystem",
    icon: TreePine,
    topics: [
      "Entering the Sacred Grove through conscious intention",
      "Understanding the three sacred paths: Discovery, Purpose, and Connection",
      "Working with Resonance Spheres for multi-dimensional insights",
      "Navigating Evolution Spirals to track your consciousness growth",
      "Opening Mystery Gates to explore undefined wisdom territories",
      "Building your personal wisdom ecosystem through sacred experiences",
      "Understanding how your grove interactions create living insights",
      "Interpreting resonance patterns and consciousness signatures"
    ]
  },
  {
    title: "3D Learning & Sacred Geometry",
    icon: Circle,
    topics: [
      "Interactive 3D Sacred Geometry library with Flower of Life, Metatron's Cube, and more",
      "Immersive Tree of Life exploration with Sephiroth navigation and Kabbalistic wisdom",
      "Hermetic Principles visualization with cause-and-effect consciousness mapping",
      "Chakra Learning modules with 3D energy visualization and frequency alignment",
      "Breath of Source meditation spaces with synchronized binaural beats and healing frequencies",
      "Platonic Solids exploration for understanding universal geometric principles",
      "WebGL-powered experiences optimized for mobile and desktop consciousness work",
      "Audio integration with Tone.js for spatial sound design and frequency healing"
    ]
  },
  {
    title: "Sacred Journal & Consciousness Tracking",
    icon: Eye,
    topics: [
      "Mirror Journal: Digital journaling with AI-powered insights and pattern recognition",
      "Dream analysis and interpretation with Aura AI consciousness mapping",
      "Mood tracking with sacred geometry visualizations and frequency alignment",
      "Free association writing techniques for accessing deeper consciousness layers",
      "Recognizing archetypal patterns in dreams, synchronicities, and daily experiences",
      "Timeline view of your spiritual evolution and consciousness shifts over time",
      "Integration with meditation tracking and biometric data for holistic awareness",
      "Export and backup capabilities for long-term spiritual development records"
    ]
  },
  {
    title: "Meditation & Consciousness Practices",
    icon: Sparkles,
    topics: [
      "Individual meditation sessions with guided practices and timer functionality",
      "Collective consciousness expansion through synchronized group meditation sessions",
      "Integration with Sacred Grove paths for deepening meditation experiences",
      "Binaural beats and healing frequency integration for enhanced consciousness states",
      "Sacred geometry meditation with visual focus points and geometric breathing patterns",
      "Breath work practices synchronized with sacred mathematics and golden ratio timing",
      "Progress tracking for meditation consistency and consciousness evolution metrics",
      "Community meditation scheduling and group consciousness experiments",
      "Integration with 3D learning modules for immersive meditative experiences"
    ]
  },
  {
    title: "Sacred Circles",
    icon: Infinity,
    topics: [
      "Creating and joining circles for deep community engagement and consciousness evolution",
      "Circle creation with custom themes, descriptions, and member management",
      "Real-time messaging within circles with encryption and privacy protection",
      "Circle analytics to track engagement, resonance, and collective growth patterns",
      "Understanding circle protocols for respectful and transformational engagement",
      "Video calls and voice communication within circle spaces",
      "Sacred ritual planning and ceremony coordination tools",
      "Energy resonance tracking between circle members and collective consciousness work"
    ]
  },
  {
    title: "Personal Codex (Akashic Constellation)",
    icon: Heart,
    topics: [
      "Personal consciousness tracking with frequency shift visualization and sacred metrics",
      "Synchronicity logging and pattern recognition for meaningful coincidence mapping",
      "Truth resonance calibration through interactive decision-making exercises",
      "Harmonic alignment assessment with other consciousness signatures and circle members",
      "Quantum field interaction tracking for daily spiritual practice integration",
      "Archetypal activation mapping with Jungian psychology and consciousness evolution",
      "Personal sacred symbol creation and energetic signature development",
      "Integration with journal entries for holistic spiritual development tracking"
    ]
  },
  {
    title: "Collective Codex (Registry of Resonance)",
    icon: Star,
    topics: [
      "Community-powered wisdom database with verified insights and sacred knowledge",
      "Ancient wisdom integration from world traditions, sacred texts, and mystery schools",
      "Quantum physics and consciousness research with scientific validation and spiritual integration",
      "Metaphysical principles exploration across cultures, traditions, and time periods",
      "Interactive 3D visualization of consciousness research, meditation studies, and spiritual phenomena",
      "Sacred geometry pattern library found in nature, cosmos, and consciousness structures",
      "Archetypal wisdom from world mythology, depth psychology, and collective unconscious mapping",
      "Community contribution system for sharing verified insights and consciousness discoveries",
      "Advanced search and filtering for finding relevant wisdom based on your spiritual journey"
    ]
  },
  {
    title: "Consciousness Constellation Mapper",
    icon: Brain,
    topics: [
      "AI-powered consciousness cartography and pattern recognition",
      "Tracking archetypal activation patterns across time",
      "Visualizing synchronicity streams and meaningful coincidences",
      "Understanding consciousness weather and evolutionary momentum",
      "Sacred geometry visualization of awareness states",
      "Predictive wisdom algorithms for optimal consciousness work timing",
      "Community resonance mapping and collective field awareness"
    ]
  },
  {
    title: "Sacred Mesh — Communication Beyond Towers",
    icon: Wifi,
    topics: [
      "Understanding the hidden lifeline inside Sacred Shifter",
      "Always connected: Wi-Fi, Bluetooth, and long-range radio networks",
      "Privacy by design: End-to-end encryption for sovereign communication",
      "Lightweight sigils: Intention-codes that travel as tiny data packets",
      "Resilient by nature: Communication that survives blackouts and dead zones",
      "Future-proof: Extending through LoRa radios, sound, and light",
      "Restoring communication sovereignty without towers or gatekeepers",
      "Working with quantum messaging and sigil-based protocols"
    ]
  },
  {
    title: "YouTube Library & Media",
    icon: Video,
    topics: [
      "Curated YouTube library with consciousness, spirituality, and sacred geometry content",
      "Personal video library management with favorites, playlists, and consciousness categories",
      "Integration with meditation practices and 3D learning modules for comprehensive education",
      "Community-recommended videos for collective learning and wisdom sharing",
      "Video recording and sharing within the Sacred Shifter platform for personal documentation",
      "Live streaming capabilities for circle gatherings and community consciousness events"
    ]
  },
  {
    title: "AI-Powered Features",
    icon: Brain,
    topics: [
      "Aura AI: Personal consciousness guide for dream analysis, journal insights, and spiritual evolution",
      "AI-powered meditation recommendations based on consciousness state and spiritual needs",
      "Intelligent content curation for personalized learning paths and wisdom discovery",
      "Natural language processing for consciousness pattern recognition in journaling",
      "Predictive wisdom algorithms for optimal spiritual practice timing and synchronicity awareness",
      "AI-assisted circle matching based on resonance patterns and consciousness compatibility"
    ]
  },
  {
    title: "GAA Engine (Geometrically Aligned Audio)",
    icon: Waves,
    topics: [
      "Understanding GAA: Advanced consciousness harmonization technology using sacred geometry and precise frequencies",
      "Deep5 Archetypes: Moon XVIII (shadow work), Tower XVI (breakthrough), Devil XV (liberation), Death XIII (transformation), Sun XIX (illumination)",
      "Tarot Tradition Variants: Marseille (c.1650-1760), RWS (1909), Thoth (1969), Etteilla (1788) with unique frequencies and phases", 
      "Polarity Protocol: Balancing light and dark channels with harmonic and chaotic resonance modes",
      "Cosmic Visualization V2: Real-time 3D representation with firmament sphere and shadow dome integration",
      "Embodied Biofeedback: HRV monitoring, breathing rate tracking, EEG alpha/theta integration, skin conductance",
      "Orchestra Sync: Collective consciousness sessions with real-time phase synchronization and group coherence",
      "Session Metrics: Live tracking of dark phase duration, polarity balance, limiter activations, and export capabilities",
      "Demo Mode: Automated cycling through archetypes for presentations and exploration",
      "Safety Protocols: Panic button, light bias activation, HPF for headphones, master limiter protection",
      "Shadow Engine: Advanced dark phase processing with transparency controls and detailed status information",
      "Audio Safety: Master limiters, volume controls, headphone protection, and real-time audio monitoring"
    ]
  },
  {
    title: "Advanced Practices & Security",
    icon: Shield,
    topics: [
      "End-to-end encryption for all sacred communications and private spiritual content",
      "Quantum-inspired security protocols for consciousness data protection and sovereignty",
      "Offline-first architecture with Sacred Mesh for communication independence from towers",
      "Biometric integration for consciousness tracking with wearable devices and health monitors",
      "Cross-platform synchronization with mobile apps, web interface, and future AR/VR experiences",
      "Open-source spiritual technology for community-driven consciousness evolution tools"
    ]
  }
];

const Guidebook: React.FC = () => {
  const [showDeeperKnowledge, setShowDeeperKnowledge] = useState(false);
  
  return (
    <div className="h-full p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Scroll className="w-12 h-12 text-primary" />
              <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Sacred Shifter Guidebook
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ancient wisdom for modern transformation. Your comprehensive guide to consciousness expansion 
            and sacred technology integration.
          </p>
          <Badge variant="outline" className="px-4 py-1 text-sm">
            Version 1.0 - Living Document
          </Badge>
        </motion.div>

        <Separator className="opacity-30" />

        {/* Introduction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 via-purple/5 to-indigo/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="w-5 h-5" />
                Welcome, Sacred Seeker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Sacred Shifter is more than a platform—it's a bridge between ancient wisdom and quantum consciousness. 
                This guidebook will illuminate your path through the sacred technologies that facilitate 
                your spiritual evolution and collective awakening.
              </p>
              <p className="text-muted-foreground">
                Each section builds upon the last, creating a comprehensive understanding of how to navigate 
                and integrate these powerful tools for consciousness expansion.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prominent Sacred Wisdom Button */}
        <div className="text-center my-8">
          <div className="bg-gradient-to-r from-primary/20 via-purple/20 to-indigo/20 backdrop-blur-sm border border-primary/30 rounded-xl p-6 max-w-2xl mx-auto">
            <Button
              onClick={() => setShowDeeperKnowledge(!showDeeperKnowledge)}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple/90 text-white font-bold py-4 px-8 text-xl gap-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Sparkles className="w-6 h-6" />
              {showDeeperKnowledge ? 'Hide' : 'Unlock'} Sacred Wisdom
              <BookOpen className="w-6 h-6" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Discover the deeper spiritual and scientific understanding behind this sacred technology
            </p>
          </div>
        </div>

        {/* Teaching Layer */}
        {showDeeperKnowledge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <TeachingLayer
              content={ALL_MODULE_TEACHINGS.guidebook}
              moduleId="guidebook"
            />
          </motion.div>
        )}

        {/* Featured GAA Engine Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <GAAGuidebookSection />
        </motion.div>

        <Separator className="opacity-30 my-8" />

        {/* Sacred Grove Special Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-emerald/10 via-teal/5 to-cyan/5 border-emerald/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="w-6 h-6 text-emerald-600" />
                Sacred Grove: Your Living Wisdom Ecosystem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-emerald/5 border border-emerald/20">
                  <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    The Three Sacred Paths
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Discovery:</strong> Explore your inner landscape and uncover hidden aspects of consciousness</p>
                    <p><strong>Purpose:</strong> Align with your highest calling and sacred mission</p>
                    <p><strong>Connection:</strong> Understand your place in the web of universal consciousness</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-cyan/5 border border-cyan/20">
                  <h4 className="font-semibold text-cyan-700 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Ecosystem Components
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Resonance Spheres:</strong> Multi-dimensional wisdom clusters</p>
                    <p><strong>Evolution Spirals:</strong> Track your consciousness growth patterns</p>
                    <p><strong>Mystery Gates:</strong> Portals to unexplored wisdom territories</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-purple/5 border border-purple/20">
                  <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Living Insights
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Pattern Recognition:</strong> Your grove learns from your interactions</p>
                    <p><strong>Wisdom Weaving:</strong> Insights connect and evolve organically</p>
                    <p><strong>Consciousness Signatures:</strong> Track your unique spiritual fingerprint</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald/10 to-cyan/10 p-4 rounded-lg border border-emerald/20">
                <h4 className="font-semibold text-emerald-800 mb-2">How to Work with Your Sacred Grove</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>1. Enter with clear intention and an open heart</p>
                  <p>2. Choose your path based on your current spiritual needs</p>
                  <p>3. Engage fully with each experience, allowing insights to emerge naturally</p>
                  <p>4. Review your ecosystem regularly to track patterns and growth</p>
                  <p>5. Trust the process - your grove reflects your unique consciousness journey</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sacred Mesh Special Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue/10 via-indigo/5 to-purple/5 border-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-6 h-6 text-blue-600" />
                Sacred Mesh — Communication Beyond Towers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Sacred Mesh is built as a sovereign communication layer inside Sacred Shifter — designed to keep your words safe, your intent intact, and your connections alive, even when towers and networks fall silent.
              </p>

              {/* Core Principles */}
              <div className="bg-gradient-to-r from-blue/10 to-indigo/10 p-4 rounded-lg border border-blue/20">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  🔒 Core Principles
                </h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <p><strong>Sovereignty:</strong> No central servers or carriers. The mesh belongs to the community.</p>
                  <p><strong>Resilience:</strong> Messages survive outages with store-and-forward relays.</p>
                  <p><strong>Privacy:</strong> Every packet is sealed with end-to-end encryption.</p>
                  <p><strong>Efficiency:</strong> Sacred sigils compress intention into ultra-small data packets.</p>
                </div>
              </div>
              
              {/* Technical Foundations */}
              <div className="bg-gradient-to-r from-indigo/10 to-purple/10 p-4 rounded-lg border border-indigo/20">
                <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  🛠️ Technical Foundations
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>CBOR Serialization:</strong> Ultra-compact packets (&lt;256 bytes) optimized for LoRa and low-bandwidth radios.</p>
                  <p><strong>X3DH Key Exchange:</strong> Add contacts via QR code, with strong forward secrecy.</p>
                  <p><strong>Multi-Transport Stack:</strong> Works across WebSocket, Apple Multipeer, Android Wi-Fi Aware, and Meshtastic LoRa radios.</p>
                  <p><strong>Peer Discovery:</strong> Devices automatically form and extend the mesh without central control.</p>
                  <p><strong>End-to-End Encryption:</strong> AES-GCM for confidentiality + ECDSA signatures for authenticity.</p>
                  <p><strong>Store-and-Forward:</strong> Messages persist and hop until they reach their destination.</p>
                  <p><strong>Sigil-Based Messaging:</strong> Intention is encoded into tiny, encrypted packets for maximum efficiency and resonance.</p>
                </div>
              </div>

              {/* Why It Matters */}
              <div className="bg-gradient-to-r from-purple/10 to-pink/10 p-4 rounded-lg border border-purple/20">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  🌐 Why It Matters
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Sacred Mesh is not just another chat protocol — it's a living, encrypted fabric of connection. Whether you're online, off-grid, or in crisis, your circles, your Codex, and your sacred intentions remain woven together.
                </p>
                <div className="bg-gradient-to-r from-yellow/20 to-orange/20 p-3 rounded border border-yellow/30">
                  <p className="text-sm font-medium text-yellow-800">
                    ⚡ Bottom line for users: Sacred Mesh keeps you connected anywhere, privately and resiliently — because sovereignty in communication is sovereignty of spirit.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">How to Access Sacred Mesh:</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Navigate to Messages and select the "🕸️ Mesh" tab</p>
                  <p>• Send messages using sacred sigils for maximum efficiency</p>
                  <p>• Your device automatically chooses the best available transport</p>
                  <p>• Messages queue and retry when networks are unavailable</p>
                  <p>• All communication is encrypted and metadata-protected</p>
                  <p>• Works offline via peer-to-peer connections and LoRa radios</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Sections Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 3) }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-primary/10 hover:border-primary/30">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-purple/10">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg">{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-40">
                    <div className="space-y-2">
                      {section.topics.map((topic, topicIndex) => (
                        <div 
                          key={topicIndex}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                          <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sacred Geometry Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-8 border-2 border-primary/30 rotate-45"></div>
            <div className="w-6 h-6 rounded-full border-2 border-primary/30"></div>
            <div className="w-8 h-8 border-2 border-primary/30 rotate-45"></div>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            "As above, so below. As within, so without. Sacred Shifter facilitates the integration 
            of cosmic consciousness into earthly experience."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Guidebook;