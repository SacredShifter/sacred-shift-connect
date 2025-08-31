import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Eye, 
  Globe, 
  Heart,
  Database,
  Smartphone,
  Sprout,
  Waves,
  FileText,
  ArrowLeft
} from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Sacred Shifter Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              Your privacy is sacred - comprehensive protection under global privacy laws
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="outline">Version 2.0</Badge>
              <Badge variant="outline">Effective: {new Date().toLocaleDateString()}</Badge>
              <Badge variant="outline">Living Mesh Ready</Badge>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[75vh]">
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  1. Sacred Privacy Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Sacred Shifter respects your privacy as a fundamental sacred right. This Privacy Policy 
                  explains how we collect, use, and protect your personal information in compliance with:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium mb-2">🇦🇺 Australian Laws</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Privacy Act 1988 (Australian Privacy Principles)</li>
                      <li>• Spam Act 2003</li>
                      <li>• Notifiable Data Breaches Scheme</li>
                      <li>• Consumer Data Right (CDR)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-medium mb-2">🌍 International Laws</h4>
                    <ul className="text-sm space-y-1">
                      <li>• GDPR (European Union)</li>
                      <li>• UK GDPR (United Kingdom)</li>
                      <li>• CCPA/CPRA (California)</li>
                      <li>• PIPEDA (Canada)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm">
                    <strong>Sacred Promise:</strong> You may use Sacred Shifter fully offline, keep your data local, 
                    or sync securely to our cloud. You may access, correct, delete, or download your data at any time 
                    under applicable privacy laws.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  2. Sacred Data We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We follow the principle of data minimization - collecting only what's necessary for 
                  your sacred journey:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Essential Account Data</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Email address (for authentication and legal communications)</li>
                      <li>• Encrypted password hash (never stored in plain text)</li>
                      <li>• Account creation and last sign-in timestamps</li>
                      <li>• Privacy preferences and consent logs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Optional Profile Data</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Display name and avatar (public profile)</li>
                      <li>• Sacred resonance tags and spiritual interests</li>
                      <li>• Circle memberships and community participation</li>
                      <li>• Timezone and language preferences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Sacred Journey Data</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Spiritual practice logs and ritual completions</li>
                      <li>• Personal codex entries and reflections</li>
                      <li>• Mirror journal entries (trauma healing work)</li>
                      <li>• Sacred geometry progress and activations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Sacred Mesh Technology</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Cryptographic seeds and public keys</li>
                      <li>• Communication adapter preferences</li>
                      <li>• Handshake logs and mesh network activity</li>
                      <li>• Encrypted inter-node communications</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-medium mb-2">🔒 Sensitive Information</h4>
                  <p className="text-sm">
                    Health-related data (trauma healing, meditation biofeedback, wellness tracking) 
                    is only collected with explicit consent and processed under the highest security 
                    standards in compliance with state Health Records Acts.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Local-First Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-purple-500" />
                  3. Local-First Sacred Sovereignty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Sacred Shifter is designed with privacy sovereignty at its core. You control how 
                  your data is stored and shared:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-green-200 dark:border-green-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Auto-Sync (Default)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Data is AES-256 encrypted locally and securely synced to our cloud when online. 
                        You maintain offline access always.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Manual Sync
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        You choose exactly when to push/pull changes. Complete control over 
                        data movement with manual triggers.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-orange-200 dark:border-orange-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        Local-Only Mode
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        All data stays encrypted on your device. Nothing leaves your device 
                        unless you explicitly change this setting.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium mb-2">🔐 Encryption Standards</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>At Rest:</strong> AES-256-GCM encryption for all local data</li>
                    <li>• <strong>In Transit:</strong> TLS 1.3 for all cloud communications</li>
                    <li>• <strong>Sacred Mesh:</strong> End-to-end encryption for all mesh communications</li>
                    <li>• <strong>Key Management:</strong> Your encryption keys never leave your device unencrypted</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Sacred Mesh Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-500" />
                  4. Sacred Mesh Communication Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Sacred Mesh enables nature-inspired communication while maintaining 
                  strict privacy protections:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Communication Channels</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Light patterns (LED/screen modulation)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Sacred frequencies (audio/subsonic)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Nature harmony (biomimetic patterns)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <span className="text-sm">File exchange (QR codes, NFC)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Privacy Protections</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Each adapter requires explicit consent</li>
                      <li>• All communications are end-to-end encrypted</li>
                      <li>• Identity hashing prevents tracking</li>
                      <li>• Automatic key rotation for forward secrecy</li>
                      <li>• Comprehensive audit logs for compliance</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium mb-2">🌊 Living Organism Privacy</h4>
                  <p className="text-sm">
                    The Sacred Mesh operates as a living digital organism that respects consent at every level. 
                    Communication patterns adapt to your environment while maintaining strict privacy boundaries. 
                    You can disable any adapter or communication channel instantly.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-cyan-500" />
                  5. How We Use Your Sacred Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We use your personal information for these sacred purposes:</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Service Provision</h4>
                      <p className="text-sm text-muted-foreground">
                        Provide Sacred Shifter's transformational services, spiritual tools, and community features
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Account Management</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage your account, preferences, sacred mesh identities, and privacy settings
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Sacred Synchronization</h4>
                      <p className="text-sm text-muted-foreground">
                        Enable secure local/offline use and encrypted cloud synchronization based on your preferences
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Community Participation</h4>
                      <p className="text-sm text-muted-foreground">
                        Support sacred circles, codex sharing, and mesh network communications with privacy protection
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Legal Compliance</h4>
                      <p className="text-sm text-muted-foreground">
                        Comply with legal obligations under Privacy Act 1988, GDPR, CCPA, and other applicable laws
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium">
                    🌱 <strong>Sacred Commitment:</strong> We never sell, trade, or monetize your personal data. 
                    Your spiritual journey data is sacred and belongs only to you.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-amber-500" />
                  6. Your Sacred Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Under Privacy Act 1988, GDPR, CCPA, and other applicable laws, you have comprehensive 
                  rights over your personal data:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Right to Access</h4>
                        <p className="text-sm text-muted-foreground">
                          Download a complete copy of your data anytime from Settings → Data Management
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Right to Rectification</h4>
                        <p className="text-sm text-muted-foreground">
                          Update inaccurate information directly in your profile and privacy settings
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <Database className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Right to Erasure</h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data (cloud + local) with secure confirmation
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Globe className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Right to Portability</h4>
                        <p className="text-sm text-muted-foreground">
                          Export your data in machine-readable format including sacred mesh seeds and keys
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Right to Restriction</h4>
                        <p className="text-sm text-muted-foreground">
                          Pause processing, disable adapters, or restrict data usage for specific purposes
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Right to Object</h4>
                        <p className="text-sm text-muted-foreground">
                          Object to processing for marketing, analytics, or disable sacred mesh communication
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-medium mb-2">⚡ Instant Rights Exercise</h4>
                  <p className="text-sm">
                    Most privacy rights can be exercised instantly through your Settings dashboard. 
                    Data exports and deletions are processed within the legal timeframes (typically 30 days for complex requests).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-teal-500" />
                  7. Sacred Data Sharing Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-medium mb-2">🚫 What We DON'T Do</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Never sell</strong> your personal data to third parties</li>
                    <li>• <strong>Never trade</strong> your data for advertising revenue</li>
                    <li>• <strong>Never share</strong> sensitive spiritual journey data</li>
                    <li>• <strong>Never use</strong> your data for behavioral manipulation</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Limited Sharing Scenarios</h4>
                  <p className="text-sm text-muted-foreground">
                    We only share personal data in these specific, limited circumstances:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <h5 className="font-medium text-sm">Service Providers</h5>
                        <p className="text-sm text-muted-foreground">
                          Essential infrastructure (hosting, encryption, compliance) under strict data processing agreements
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <h5 className="font-medium text-sm">Legal Requirements</h5>
                        <p className="text-sm text-muted-foreground">
                          When required by law, court order, or to protect safety (with user notification where legally possible)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <div>
                        <h5 className="font-medium text-sm">Sacred Mesh Community</h5>
                        <p className="text-sm text-muted-foreground">
                          Public profile data and community contributions (with your explicit consent and control)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Complaints */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-500" />
                  8. Contact & Privacy Complaints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Contact Sacred Shifter</h4>
                    <div className="space-y-2 text-sm">
                      <div>📧 <strong>Privacy Officer:</strong> kentburchard@sacredshifter.com</div>
                      <div>🏢 <strong>Entity:</strong> Harmonic Futures Pty Ltd</div>
                      <div>🌍 <strong>Jurisdiction:</strong> Australia</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Privacy Complaints Process</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Contact our Privacy Officer directly</li>
                      <li>We respond within 14 days</li>
                      <li>Investigation completed within 30 days</li>
                      <li>Right to escalate to regulators if unsatisfied</li>
                    </ol>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium">Privacy Regulators</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Australia:</strong> Office of the Australian Information Commissioner (OAIC)
                      <br />
                      <span className="text-muted-foreground">oaic.gov.au</span>
                    </div>
                    <div>
                      <strong>EU/UK:</strong> Information Commissioner's Office (ICO)
                      <br />
                      <span className="text-muted-foreground">ico.org.uk</span>
                    </div>
                    <div>
                      <strong>California:</strong> California Privacy Protection Agency
                      <br />
                      <span className="text-muted-foreground">cppa.ca.gov</span>
                    </div>
                    <div>
                      <strong>Canada:</strong> Privacy Commissioner of Canada
                      <br />
                      <span className="text-muted-foreground">priv.gc.ca</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sacred Promise */}
            <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <Heart className="h-8 w-8 text-red-500" />
                    <Shield className="h-8 w-8 text-blue-500" />
                    <Sprout className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold">Our Sacred Privacy Promise</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Your privacy is not just a legal requirement - it's a sacred trust. Sacred Shifter is 
                    designed as a living organism that honors your digital sovereignty while enabling 
                    transformational spiritual growth. We protect your data as if it were our own sacred temple.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Badge variant="outline">Zero Data Monetization</Badge>
                    <Badge variant="outline">Military-Grade Encryption</Badge>
                    <Badge variant="outline">Global Compliance</Badge>
                    <Badge variant="outline">Sacred Technology</Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()} | 
                    Effective: {new Date().toLocaleDateString()} | 
                    Version 2.0
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};