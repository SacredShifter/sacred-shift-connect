/**
 * Accessibility Audit Component - Tests e-learning modules for WCAG compliance
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AccessibilityIssue {
  id: string;
  level: 'A' | 'AA' | 'AAA';
  severity: 'error' | 'warning' | 'info';
  description: string;
  element?: string;
  recommendation: string;
}

interface AuditResults {
  passed: number;
  failed: number;
  warnings: number;
  issues: AccessibilityIssue[];
  compliance: {
    levelA: boolean;
    levelAA: boolean;
    levelAAA: boolean;
  };
}

export const AccessibilityAudit: React.FC = () => {
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const runAccessibilityAudit = async () => {
    setIsAuditing(true);

    try {
      // Simulate accessibility audit
      await new Promise(resolve => setTimeout(resolve, 2000));

      const results: AuditResults = {
        passed: 42,
        failed: 3,
        warnings: 8,
        issues: [
          {
            id: '1',
            level: 'AA',
            severity: 'error',
            description: 'Images missing alt text',
            element: 'img[src="fractal-bg.png"]',
            recommendation: 'Add descriptive alt text for fractal background images'
          },
          {
            id: '2',
            level: 'AA',
            severity: 'warning',
            description: 'Color contrast ratio insufficient',
            element: '.text-muted',
            recommendation: 'Increase contrast ratio to at least 4.5:1'
          },
          {
            id: '3',
            level: 'A',
            severity: 'error',
            description: 'Form inputs missing labels',
            element: 'input[type="range"]',
            recommendation: 'Associate labels with form controls using aria-label or label element'
          },
          {
            id: '4',
            level: 'AA',
            severity: 'warning',
            description: 'Audio content lacks transcript',
            element: 'audio.narration',
            recommendation: 'Provide text transcripts for audio narration'
          },
          {
            id: '5',
            level: 'AAA',
            severity: 'info',
            description: 'Animation cannot be paused',
            element: '.fractal-animation',
            recommendation: 'Add pause/play controls for continuous animations'
          }
        ],
        compliance: {
          levelA: false,
          levelAA: false,
          levelAAA: false
        }
      };

      // Calculate compliance levels
      const errorsByLevel = {
        A: results.issues.filter(i => i.level === 'A' && i.severity === 'error').length,
        AA: results.issues.filter(i => i.level === 'AA' && i.severity === 'error').length,
        AAA: results.issues.filter(i => i.level === 'AAA' && i.severity === 'error').length
      };

      results.compliance = {
        levelA: errorsByLevel.A === 0,
        levelAA: errorsByLevel.A === 0 && errorsByLevel.AA === 0,
        levelAAA: errorsByLevel.A === 0 && errorsByLevel.AA === 0 && errorsByLevel.AAA === 0
      };

      setAuditResults(results);
    } catch (error) {
      console.error('Accessibility audit failed:', error);
    } finally {
      setIsAuditing(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-warning" />;
      default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getComplianceBadge = (level: string, compliant: boolean) => (
    <Badge variant={compliant ? "default" : "destructive"}>
      WCAG {level} {compliant ? "✓" : "✗"}
    </Badge>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>E-Learning Accessibility Audit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runAccessibilityAudit}
              disabled={isAuditing}
              className="w-full"
            >
              {isAuditing ? 'Running Audit...' : 'Run Accessibility Audit'}
            </Button>

            {auditResults && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-success">{auditResults.passed}</div>
                      <div className="text-sm text-muted-foreground">Passed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-destructive">{auditResults.failed}</div>
                      <div className="text-sm text-muted-foreground">Failed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-warning">{auditResults.warnings}</div>
                      <div className="text-sm text-muted-foreground">Warnings</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Compliance Levels */}
                <div className="flex gap-2">
                  {getComplianceBadge('A', auditResults.compliance.levelA)}
                  {getComplianceBadge('AA', auditResults.compliance.levelAA)}
                  {getComplianceBadge('AAA', auditResults.compliance.levelAAA)}
                </div>

                {/* Issues List */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Issues Found</h3>
                  {auditResults.issues.map(issue => (
                    <Card key={issue.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{issue.description}</span>
                              <Badge variant="outline">WCAG {issue.level}</Badge>
                            </div>
                            {issue.element && (
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {issue.element}
                              </code>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {issue.recommendation}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};