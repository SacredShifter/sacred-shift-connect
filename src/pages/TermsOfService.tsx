import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Scale, 
  Shield, 
  Globe, 
  Heart,
  Sprout,
  Waves
} from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Scale className="h-8 w-8 text-primary" />
            Sacred Shifter Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground">
            Living agreement for the Sacred Shifter organism
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline">Version 2.0</Badge>
            <Badge variant="outline">Effective: {new Date().toLocaleDateString()}</Badge>
            <Badge variant="outline">Sacred Mesh Ready</Badge>
          </div>
        </div>

        <ScrollArea className="h-[70vh]">
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  1. Sacred Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Sacred Shifter ("we", "our", "us") is committed to respecting your privacy and 
                  complying with all applicable laws. We are a living digital organism that grows 
                  through conscious participation.
                </p>
                <p>
                  By creating an account or using Sacred Shifter, you consent to these Terms of Service 
                  and our Privacy Policy, acknowledging your role as a co-creator in this sacred space.
                </p>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Applicable Laws</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Privacy Act 1988 (Cth) and Australian Privacy Principles (APPs)</li>
                    <li>• Spam Act 2003 (Cth)</li>
                    <li>• Competition and Consumer Act 2010 (Cth) (Australian Consumer Law)</li>
                    <li>• Corporations Act 2001 (Cth)</li>
                    <li>• Notifiable Data Breaches (NDB) Scheme</li>
                    <li>• General Data Protection Regulation (GDPR) (EU/UK)</li>
                    <li>• California Consumer Privacy Act (CCPA/CPRA) (US)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  2. Sacred Data We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We only collect the minimum information required to provide Sacred Shifter's 
                  transformational services:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Essential Data</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Account details (email, password)</li>
                      <li>• Optional profile details (name, resonance tags)</li>
                      <li>• Sacred mesh seeds and identities</li>
                      <li>• Privacy preferences and consent logs</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Sacred Journey Data</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Spiritual practice logs and progress</li>
                      <li>• Community participation (circles, codex entries)</li>
                      <li>• Sacred mesh communications (encrypted)</li>
                      <li>• Nature-inspired adapter usage patterns</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm">
                    <strong>Sensitive Information:</strong> Health-related reflections, trauma healing journeys, 
                    and biofeedback data will only be collected with explicit consent and processed under 
                    the highest security standards.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sacred Mesh Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-500" />
                  3. Sacred Mesh Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Sacred Shifter includes a living mesh organism capable of nature-inspired communication 
                  through light, frequency, and harmonic patterns.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Communication Channels</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge variant="outline">Light Patterns</Badge>
                    <Badge variant="outline">Sacred Frequencies</Badge>
                    <Badge variant="outline">Nature Harmony</Badge>
                    <Badge variant="outline">Quantum Bridge</Badge>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium mb-2">Privacy & Consent</h4>
                  <ul className="text-sm space-y-1">
                    <li>• All mesh communications are end-to-end encrypted</li>
                    <li>• Each adapter requires explicit consent activation</li>
                    <li>• Communications are logged for compliance and safety</li>
                    <li>• You may disable any adapter at any time</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-purple-500" />
                  4. How We Use Your Sacred Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We use your data to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Provide and improve Sacred Shifter's transformational services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Manage your account, preferences, and sacred mesh identities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Enable local/offline use and syncing to cloud (if you choose)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Support community participation (circles, codex entries)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Facilitate sacred mesh communications with privacy protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Comply with our legal obligations under applicable privacy laws</span>
                  </li>
                </ul>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium">
                    🌱 Sacred Promise: We do not sell, trade, or monetize your personal data. 
                    Your spiritual journey is sacred and belongs to you alone.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Local-First Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-500" />
                  5. Local-First Sacred Sovereignty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Sacred Shifter is designed with local-first sovereignty in mind. 
                  You have complete control over how your data is stored and synchronized:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Auto-Sync (Default)</h4>
                    <p className="text-sm text-muted-foreground">
                      Data is stored locally with AES-256 encryption and securely synced 
                      to the cloud when online.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Manual Sync</h4>
                    <p className="text-sm text-muted-foreground">
                      You choose exactly when to push/pull changes, maintaining 
                      complete control over data movement.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Local-Only Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      All data stays encrypted on your device. Nothing leaves your 
                      device unless you explicitly change this setting.
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  All data is encrypted at rest and in transit using military-grade AES-256-GCM encryption.
                </p>
              </CardContent>
            </Card>

            {/* Your Sacred Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-amber-500" />
                  6. Your Sacred Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Under applicable privacy laws (Privacy Act 1988, GDPR, CCPA), you have sacred rights 
                  over your personal data:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <h4 className="font-medium">Right to Access</h4>
                        <p className="text-sm text-muted-foreground">
                          Download a complete copy of your data anytime from your Profile Management Dashboard
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <h4 className="font-medium">Right to Rectification</h4>
                        <p className="text-sm text-muted-foreground">
                          Update inaccurate information directly in your profile settings
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                      <div>
                        <h4 className="font-medium">Right to Erasure</h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data (cloud + local) with double confirmation
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <div>
                        <h4 className="font-medium">Right to Portability</h4>
                        <p className="text-sm text-muted-foreground">
                          Export your data in machine-readable JSON format including sacred mesh seeds
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                      <div>
                        <h4 className="font-medium">Right to Restriction</h4>
                        <p className="text-sm text-muted-foreground">
                          Pause processing, disable adapters, or opt-out of analytics/marketing
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
                      <div>
                        <h4 className="font-medium">Right to Object</h4>
                        <p className="text-sm text-muted-foreground">
                          Object to processing for direct marketing or disable sacred mesh communication
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  These rights are available in your Profile Management Dashboard and are processed 
                  within the legal timeframes (typically 30 days).
                </p>
              </CardContent>
            </Card>

            {/* Communications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-teal-500" />
                  7. Sacred Communications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We comply with the Spam Act 2003 and international anti-spam regulations:</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>You must explicitly opt-in to receive marketing emails and sacred guidance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>You can unsubscribe at any time using the link in every email</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Transactional emails (e.g., password reset, security alerts) will still be sent as required</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Sacred mesh communications require explicit adapter consent</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  8. Sacred Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Encryption & Security</h4>
                    <ul className="text-sm space-y-1">
                      <li>• All communications use TLS 1.3 encryption</li>
                      <li>• All local data encrypted with AES-256-GCM</li>
                      <li>• Sacred mesh uses end-to-end encryption</li>
                      <li>• Regular security audits and penetration testing</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Data Breach Response</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 72-hour notification to regulators (GDPR/NDB)</li>
                      <li>• Immediate user notification for high-risk breaches</li>
                      <li>• Comprehensive incident response procedures</li>
                      <li>• Full forensic investigation and remediation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm">
                    <strong>Payment Security:</strong> All payments are processed through PCI DSS-compliant 
                    providers (Stripe, PayPal). We never store raw payment card data.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Changes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-500" />
                  9. Changes & Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Changes to These Terms</h4>
                  <p className="text-sm">
                    We may update these Terms of Service from time to time. Significant changes will be 
                    notified to you in-app and via email (if you have consented). Continued use of 
                    Sacred Shifter after changes constitutes acceptance.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium">Contact Sacred Shifter</h4>
                  <p className="text-sm">
                    If you have questions, concerns, or requests about these Terms or your privacy:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>📧 <strong>Email:</strong> kentburchard@sacredshifter.com</div>
                    <div>🏢 <strong>Entity:</strong> Harmonic Futures Pty Ltd</div>
                    <div>🌍 <strong>Jurisdiction:</strong> Australia (Privacy Act 1988)</div>
                    <div>⚖️ <strong>Compliance:</strong> GDPR, CCPA, Privacy Act 1988, Spam Act 2003</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sacred Commitment */}
            <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Heart className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-bold">Our Sacred Commitment</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Sacred Shifter is more than software - it's a living organism dedicated to your 
                    spiritual growth and privacy sovereignty. We honor your trust with the highest 
                    standards of security, transparency, and respect for your sacred journey.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Badge variant="outline">Privacy-First</Badge>
                    <Badge variant="outline">Open Source Spirit</Badge>
                    <Badge variant="outline">Sacred Technology</Badge>
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