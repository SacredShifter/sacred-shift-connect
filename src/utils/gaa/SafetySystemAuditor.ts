/**
 * Safety System Auditor - WCAG 2.1 AA + Medical Compliance
 * Comprehensive safety validation for GAA system
 */

export interface SafetyThresholds {
  audio: {
    maxPeakLevel: number;        // dB
    maxRMSLevel: number;         // dB
    maxFrequency: number;        // Hz
    minFrequency: number;        // Hz
    maxExposureTime: number;     // minutes
  };
  visual: {
    maxFlashRate: number;        // Hz (epilepsy prevention)
    maxBrightness: number;       // 0-1
    maxContrast: number;         // 0-1
    minColorDifference: number;  // WCAG contrast ratio
  };
  session: {
    maxDuration: number;         // minutes
    warningInterval: number;     // minutes
    mandatoryBreak: number;      // minutes after max duration
  };
  biofeedback: {
    maxHeartRate: number;        // BPM
    minHeartRate: number;        // BPM
    maxStressIndicator: number;  // 0-1
    hrvThreshold: number;        // ms
  };
}

export interface ComplianceResult {
  compliant: boolean;
  level: 'WCAG_A' | 'WCAG_AA' | 'WCAG_AAA' | 'MEDICAL_GRADE';
  violations: SafetyViolation[];
  recommendations: string[];
  overallScore: number; // 0-100
}

export interface SafetyViolation {
  type: 'audio' | 'visual' | 'session' | 'biofeedback';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  currentValue: number;
  threshold: number;
  recommendation: string;
  wcagReference?: string;
  medicalReference?: string;
}

export class SafetySystemAuditor {
  private thresholds: SafetyThresholds;
  private violations: SafetyViolation[] = [];
  private auditHistory: { timestamp: number; result: ComplianceResult }[] = [];

  constructor() {
    // WCAG 2.1 AA + Medical-grade thresholds
    this.thresholds = {
      audio: {
        maxPeakLevel: -3,        // -3dB peak to prevent clipping/damage
        maxRMSLevel: -12,        // -12dB RMS for comfortable listening
        maxFrequency: 20000,     // 20kHz upper limit
        minFrequency: 20,        // 20Hz lower limit
        maxExposureTime: 45      // 45 minutes max continuous exposure
      },
      visual: {
        maxFlashRate: 3,         // 3Hz max (WCAG 2.3.1 - seizure prevention)
        maxBrightness: 0.8,      // 80% max brightness
        maxContrast: 0.9,        // 90% max contrast
        minColorDifference: 4.5  // WCAG AA contrast ratio
      },
      session: {
        maxDuration: 30,         // 30 minutes recommended max
        warningInterval: 20,     // Warning at 20 minutes
        mandatoryBreak: 60       // 60 minute mandatory break after max duration
      },
      biofeedback: {
        maxHeartRate: 180,       // 180 BPM max (age-dependent in real implementation)
        minHeartRate: 50,        // 50 BPM min
        maxStressIndicator: 0.8, // 80% max stress indicator
        hrvThreshold: 20         // 20ms minimum HRV
      }
    };

    console.log('🛡️ Safety System Auditor initialized with WCAG 2.1 AA + Medical compliance');
  }

  /**
   * Perform comprehensive safety audit
   */
  auditSafetyCompliance(metrics: {
    audio?: {
      peakLevel: number;
      rmsLevel: number;  
      frequency: number;
      exposureTimeMinutes: number;
    };
    visual?: {
      flashRate: number;
      brightness: number;
      contrast: number;
      colorContrast: number;
    };
    session?: {
      durationMinutes: number;
      lastBreakMinutes: number;
    };
    biofeedback?: {
      heartRate: number;
      stressLevel: number;
      hrv: number;
    };
  }): ComplianceResult {
    this.violations = [];

    // Audit each category
    if (metrics.audio) this.auditAudioSafety(metrics.audio);
    if (metrics.visual) this.auditVisualSafety(metrics.visual);
    if (metrics.session) this.auditSessionSafety(metrics.session);
    if (metrics.biofeedback) this.auditBiofeedbackSafety(metrics.biofeedback);

    // Determine compliance level
    const complianceLevel = this.determineComplianceLevel();
    const overallScore = this.calculateOverallScore();
    const recommendations = this.generateRecommendations();

    const result: ComplianceResult = {
      compliant: this.violations.filter(v => v.severity === 'critical' || v.severity === 'high').length === 0,
      level: complianceLevel,
      violations: [...this.violations],
      recommendations,
      overallScore
    };

    // Store in history
    this.auditHistory.push({
      timestamp: Date.now(),
      result: { ...result }
    });

    // Keep only last 100 audits
    if (this.auditHistory.length > 100) {
      this.auditHistory.shift();
    }

    console.log(`🛡️ Safety audit complete: ${result.level} (Score: ${result.overallScore}/100)`);
    
    if (result.violations.length > 0) {
      console.warn(`🛡️ Found ${result.violations.length} violations:`);
      result.violations.forEach(v => {
        console.warn(`  - ${v.type.toUpperCase()}: ${v.message}`);
      });
    }

    return result;
  }

  /**
   * Audit audio safety parameters
   */
  private auditAudioSafety(audio: {
    peakLevel: number;
    rmsLevel: number;
    frequency: number;
    exposureTimeMinutes: number;
  }): void {
    // Peak level check
    if (audio.peakLevel > this.thresholds.audio.maxPeakLevel) {
      this.violations.push({
        type: 'audio',
        severity: 'critical',
        message: `Audio peak level too high: ${audio.peakLevel.toFixed(1)}dB`,
        currentValue: audio.peakLevel,
        threshold: this.thresholds.audio.maxPeakLevel,
        recommendation: 'Reduce master gain or apply limiting',
        medicalReference: 'WHO safe listening guidelines'
      });
    }

    // RMS level check
    if (audio.rmsLevel > this.thresholds.audio.maxRMSLevel) {
      this.violations.push({
        type: 'audio',
        severity: audio.rmsLevel > this.thresholds.audio.maxRMSLevel + 6 ? 'high' : 'medium',
        message: `Audio RMS level high: ${audio.rmsLevel.toFixed(1)}dB`,
        currentValue: audio.rmsLevel,
        threshold: this.thresholds.audio.maxRMSLevel,
        recommendation: 'Lower overall volume or apply compression',
        medicalReference: 'OSHA occupational noise exposure limits'
      });
    }

    // Frequency range check
    if (audio.frequency > this.thresholds.audio.maxFrequency || 
        audio.frequency < this.thresholds.audio.minFrequency) {
      this.violations.push({
        type: 'audio',
        severity: 'medium',
        message: `Audio frequency outside safe range: ${audio.frequency.toFixed(0)}Hz`,
        currentValue: audio.frequency,
        threshold: audio.frequency > this.thresholds.audio.maxFrequency ? 
          this.thresholds.audio.maxFrequency : this.thresholds.audio.minFrequency,
        recommendation: 'Apply appropriate filtering to limit frequency range',
        medicalReference: 'Human auditory perception limits'
      });
    }

    // Exposure time check
    if (audio.exposureTimeMinutes > this.thresholds.audio.maxExposureTime) {
      this.violations.push({
        type: 'audio',
        severity: 'high',
        message: `Audio exposure time too long: ${audio.exposureTimeMinutes.toFixed(1)} minutes`,
        currentValue: audio.exposureTimeMinutes,
        threshold: this.thresholds.audio.maxExposureTime,
        recommendation: `Enforce mandatory break after ${this.thresholds.audio.maxExposureTime} minutes`,
        medicalReference: 'WHO safe listening duration guidelines'
      });
    }
  }

  /**
   * Audit visual safety parameters
   */
  private auditVisualSafety(visual: {
    flashRate: number;
    brightness: number;
    contrast: number;
    colorContrast: number;
  }): void {
    // Flash rate check (epilepsy prevention)
    if (visual.flashRate > this.thresholds.visual.maxFlashRate) {
      this.violations.push({
        type: 'visual',
        severity: 'critical',
        message: `Flash rate too high: ${visual.flashRate.toFixed(1)}Hz (seizure risk)`,
        currentValue: visual.flashRate,
        threshold: this.thresholds.visual.maxFlashRate,
        recommendation: 'Reduce animation flash rate immediately',
        wcagReference: 'WCAG 2.3.1 Three Flashes or Below Threshold'
      });
    }

    // Brightness check
    if (visual.brightness > this.thresholds.visual.maxBrightness) {
      this.violations.push({
        type: 'visual',
        severity: 'medium',
        message: `Brightness too high: ${(visual.brightness * 100).toFixed(1)}%`,
        currentValue: visual.brightness,
        threshold: this.thresholds.visual.maxBrightness,
        recommendation: 'Reduce overall brightness or add brightness control',
        wcagReference: 'WCAG 1.4.3 Contrast (Minimum)'
      });
    }

    // Contrast check
    if (visual.contrast > this.thresholds.visual.maxContrast) {
      this.violations.push({
        type: 'visual',
        severity: 'medium',
        message: `Contrast too high: ${(visual.contrast * 100).toFixed(1)}%`,
        currentValue: visual.contrast,
        threshold: this.thresholds.visual.maxContrast,
        recommendation: 'Reduce contrast or provide contrast adjustment controls',
        wcagReference: 'WCAG 1.4.6 Contrast (Enhanced)'
      });
    }

    // Color contrast check
    if (visual.colorContrast < this.thresholds.visual.minColorDifference) {
      this.violations.push({
        type: 'visual',
        severity: 'high',
        message: `Color contrast too low: ${visual.colorContrast.toFixed(1)}`,
        currentValue: visual.colorContrast,
        threshold: this.thresholds.visual.minColorDifference,
        recommendation: 'Increase color contrast to meet WCAG AA standards',
        wcagReference: 'WCAG 1.4.3 Contrast (Minimum) - AA Level'
      });
    }
  }

  /**
   * Audit session safety parameters  
   */
  private auditSessionSafety(session: {
    durationMinutes: number;
    lastBreakMinutes: number;
  }): void {
    // Session duration check
    if (session.durationMinutes > this.thresholds.session.maxDuration) {
      this.violations.push({
        type: 'session',
        severity: session.durationMinutes > this.thresholds.session.maxDuration + 15 ? 'critical' : 'high',
        message: `Session too long: ${session.durationMinutes.toFixed(1)} minutes`,
        currentValue: session.durationMinutes,
        threshold: this.thresholds.session.maxDuration,
        recommendation: `Enforce break after ${this.thresholds.session.maxDuration} minutes`,
        medicalReference: 'Ergonomic guidelines for continuous activity'
      });
    }

    // Break interval check
    if (session.lastBreakMinutes > this.thresholds.session.mandatoryBreak) {
      this.violations.push({
        type: 'session',
        severity: 'high',
        message: `Too long since last break: ${session.lastBreakMinutes.toFixed(1)} minutes`,
        currentValue: session.lastBreakMinutes,
        threshold: this.thresholds.session.mandatoryBreak,
        recommendation: 'Mandate immediate break',
        medicalReference: 'Workplace safety regulations'
      });
    }

    // Warning interval
    if (session.durationMinutes > this.thresholds.session.warningInterval && 
        session.durationMinutes <= this.thresholds.session.maxDuration) {
      this.violations.push({
        type: 'session',
        severity: 'low',
        message: `Long session warning: ${session.durationMinutes.toFixed(1)} minutes`,
        currentValue: session.durationMinutes,
        threshold: this.thresholds.session.warningInterval,
        recommendation: 'Display break reminder to user',
        medicalReference: 'Preventive health guidelines'
      });
    }
  }

  /**
   * Audit biofeedback safety parameters
   */
  private auditBiofeedbackSafety(biofeedback: {
    heartRate: number;
    stressLevel: number;
    hrv: number;
  }): void {
    // Heart rate checks
    if (biofeedback.heartRate > this.thresholds.biofeedback.maxHeartRate) {
      this.violations.push({
        type: 'biofeedback',
        severity: 'critical',
        message: `Heart rate too high: ${biofeedback.heartRate} BPM`,
        currentValue: biofeedback.heartRate,
        threshold: this.thresholds.biofeedback.maxHeartRate,
        recommendation: 'Stop session immediately and suggest rest',
        medicalReference: 'Cardiac safety guidelines'
      });
    }

    if (biofeedback.heartRate < this.thresholds.biofeedback.minHeartRate) {
      this.violations.push({
        type: 'biofeedback',
        severity: 'high',
        message: `Heart rate too low: ${biofeedback.heartRate} BPM`,
        currentValue: biofeedback.heartRate,
        threshold: this.thresholds.biofeedback.minHeartRate,
        recommendation: 'Monitor closely and consider stopping session',
        medicalReference: 'Bradycardia detection protocols'
      });
    }

    // Stress level check
    if (biofeedback.stressLevel > this.thresholds.biofeedback.maxStressIndicator) {
      this.violations.push({
        type: 'biofeedback',
        severity: 'high',
        message: `Stress level too high: ${(biofeedback.stressLevel * 100).toFixed(1)}%`,
        currentValue: biofeedback.stressLevel,
        threshold: this.thresholds.biofeedback.maxStressIndicator,
        recommendation: 'Reduce session intensity or suggest break',
        medicalReference: 'Stress response monitoring protocols'
      });
    }

    // HRV check
    if (biofeedback.hrv < this.thresholds.biofeedback.hrvThreshold) {
      this.violations.push({
        type: 'biofeedback',
        severity: 'medium',
        message: `Heart rate variability too low: ${biofeedback.hrv.toFixed(1)}ms`,
        currentValue: biofeedback.hrv,
        threshold: this.thresholds.biofeedback.hrvThreshold,
        recommendation: 'Consider relaxation techniques or session modification',
        medicalReference: 'HRV clinical interpretation guidelines'
      });
    }
  }

  /**
   * Determine overall compliance level
   */
  private determineComplianceLevel(): ComplianceResult['level'] {
    const criticalViolations = this.violations.filter(v => v.severity === 'critical').length;
    const highViolations = this.violations.filter(v => v.severity === 'high').length;
    const mediumViolations = this.violations.filter(v => v.severity === 'medium').length;

    if (criticalViolations > 0) return 'WCAG_A';
    if (highViolations > 2) return 'WCAG_A';
    if (highViolations > 0 || mediumViolations > 3) return 'WCAG_AA';
    if (mediumViolations > 0) return 'WCAG_AAA';
    
    return 'MEDICAL_GRADE';
  }

  /**
   * Calculate overall safety score
   */
  private calculateOverallScore(): number {
    if (this.violations.length === 0) return 100;

    let totalDeductions = 0;
    
    this.violations.forEach(violation => {
      switch (violation.severity) {
        case 'critical': totalDeductions += 30; break;
        case 'high': totalDeductions += 20; break;
        case 'medium': totalDeductions += 10; break;
        case 'low': totalDeductions += 5; break;
      }
    });

    return Math.max(0, 100 - totalDeductions);
  }

  /**
   * Generate safety recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // Audio recommendations
    const audioViolations = this.violations.filter(v => v.type === 'audio');
    if (audioViolations.length > 0) {
      recommendations.push('Implement automatic gain control and limiting');
      recommendations.push('Add user volume controls with safe maximum levels');
      recommendations.push('Implement mandatory listening breaks');
    }

    // Visual recommendations
    const visualViolations = this.violations.filter(v => v.type === 'visual');
    if (visualViolations.length > 0) {
      recommendations.push('Implement flash rate limiting (max 3Hz)');
      recommendations.push('Add brightness and contrast controls');
      recommendations.push('Ensure WCAG AA color contrast ratios');
    }

    // Session recommendations
    const sessionViolations = this.violations.filter(v => v.type === 'session');
    if (sessionViolations.length > 0) {
      recommendations.push('Implement automatic session time limits');
      recommendations.push('Add break reminders and enforcement');
      recommendations.push('Provide session duration tracking');
    }

    // Biofeedback recommendations
    const biofeedbackViolations = this.violations.filter(v => v.type === 'biofeedback');
    if (biofeedbackViolations.length > 0) {
      recommendations.push('Implement biometric monitoring thresholds');
      recommendations.push('Add emergency stop procedures');
      recommendations.push('Provide health status indicators');
    }

    // General recommendations
    if (this.violations.length > 5) {
      recommendations.push('Comprehensive safety system review required');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  /**
   * Get safety threshold configuration
   */
  getThresholds(): SafetyThresholds {
    return { ...this.thresholds };
  }

  /**
   * Update safety thresholds (admin only)
   */
  updateThresholds(newThresholds: Partial<SafetyThresholds>): void {
    this.thresholds = {
      ...this.thresholds,
      ...newThresholds
    };
    
    console.log('🛡️ Safety thresholds updated');
  }

  /**
   * Get audit history
   */
  getAuditHistory(limit: number = 10): { timestamp: number; result: ComplianceResult }[] {
    return this.auditHistory.slice(-limit);
  }

  /**
   * Generate safety report
   */
  generateSafetyReport(): {
    currentCompliance: ComplianceResult | null;
    historicalTrends: {
      averageScore: number;
      improvementTrend: 'improving' | 'declining' | 'stable';
      commonViolations: string[];
    };
    recommendations: string[];
  } {
    const recent = this.auditHistory.length > 0 ? this.auditHistory[this.auditHistory.length - 1].result : null;
    
    const scores = this.auditHistory.slice(-20).map(h => h.result.overallScore);
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    let improvementTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (scores.length >= 5) {
      const recentAvg = scores.slice(-5).reduce((a, b) => a + b, 0) / 5;
      const olderAvg = scores.slice(-10, -5).reduce((a, b) => a + b, 0) / 5;
      
      if (recentAvg > olderAvg + 5) improvementTrend = 'improving';
      else if (recentAvg < olderAvg - 5) improvementTrend = 'declining';
    }

    // Find common violations
    const allViolations = this.auditHistory.slice(-10).flatMap(h => h.result.violations);
    const violationCounts = new Map<string, number>();
    
    allViolations.forEach(v => {
      const key = `${v.type}: ${v.message.split(':')[0]}`;
      violationCounts.set(key, (violationCounts.get(key) || 0) + 1);
    });

    const commonViolations = Array.from(violationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([violation]) => violation);

    return {
      currentCompliance: recent,
      historicalTrends: {
        averageScore,
        improvementTrend,
        commonViolations
      },
      recommendations: recent ? recent.recommendations : []
    };
  }
}
