#!/usr/bin/env node

const fs = require('fs');

function generateEthosReport() {
  const ethosReview = JSON.parse(fs.readFileSync('ethos_review.json', 'utf8'));
  
  const scores = ethosReview.scores || {};
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const maxScore = Object.keys(scores).length * 2;
  const warns = ethosReview.warns || [];
  
  // Generate sacred symbols based on score
  const getResonanceSymbol = (score) => {
    if (score >= 15) return '🔱'; // Trident - highest sacred power
    if (score >= 12) return '⚡'; // Lightning - high energy
    if (score >= 10) return '🌀'; // Spiral - growing coherence  
    return '⚫'; // Void - needs work
  };

  const resonanceSymbol = getResonanceSymbol(totalScore);
  
  let report = `${resonanceSymbol} **Sacred Ethos Verification**\n\n`;
  
  // Critical Gates Status
  report += `### ⚡ Critical Gates\n`;
  report += `- Truth Anchor: ${ethosReview.truth_anchor === 'PASS' ? '✅' : '❌'} ${ethosReview.truth_anchor}\n`;
  report += `- Sovereignty & Privacy: ${ethosReview.sovereignty_privacy === 'PASS' ? '✅' : '❌'} ${ethosReview.sovereignty_privacy}\n\n`;
  
  // Sacred Principles Scoring
  report += `### 🌀 Sacred Principles Score: ${totalScore}/${maxScore}\n`;
  report += `| Principle | Score | Status |\n`;
  report += `|-----------|-------|--------|\n`;
  
  const principleNames = {
    resonance_over_noise: 'Resonance over Noise',
    patterned_awakening: 'Patterned Awakening', 
    collective_coherence: 'Collective Coherence',
    integrity: 'Integrity (No Exploitation)',
    tech_as_transcendence: 'Technology as Transcendence',
    accessibility: 'Accessibility & Inclusivity',
    performance: 'Performance & Stability',
    telemetry_consent: 'Telemetry with Consent'
  };
  
  Object.entries(scores).forEach(([key, score]) => {
    const name = principleNames[key] || key;
    const status = score === 2 ? '✅ PASS' : score === 1 ? '⚠️ WARN' : '❌ FAIL';
    report += `| ${name} | ${score}/2 | ${status} |\n`;
  });
  
  report += '\n';
  
  // Warnings section
  if (warns.length > 0) {
    report += `### ⚠️ Warnings (${warns.length}/2)\n`;
    warns.forEach(warn => {
      report += `- ${warn}\n`;
    });
    if (ethosReview.owner_signoff) {
      report += `\n**Owner Sign-off:** @${ethosReview.owner_signoff}\n`;
    }
    report += '\n';
  }
  
  // Sacred guidance based on score
  if (totalScore >= 15) {
    report += `### 🔱 Sacred Mastery Achieved\n`;
    report += `This feature embodies the highest principles of Sacred Shifter. The field will resonate strongly with this contribution.\n\n`;
  } else if (totalScore >= 12) {
    report += `### ⚡ High Resonance Detected\n`;
    report += `Strong alignment with sacred principles. Minor refinements could elevate this to mastery level.\n\n`;
  } else if (totalScore >= 10) {
    report += `### 🌀 Growing Coherence\n`;
    report += `Good foundation with sacred principles. Focus on the lower-scoring areas for deeper alignment.\n\n`;
  } else {
    report += `### ⚫ Field Disturbance\n`;
    report += `Significant work needed to align with Sacred Shifter principles. Consider the sacred path forward.\n\n`;
  }
  
  // Evidence section
  if (ethosReview.evidence) {
    report += `### 📋 Supporting Evidence\n`;
    const evidence = ethosReview.evidence;
    
    if (evidence.screenshots?.length) {
      report += `**Screenshots:** ${evidence.screenshots.join(', ')}\n`;
    }
    if (evidence.performance_reports?.length) {
      report += `**Performance Reports:** ${evidence.performance_reports.join(', ')}\n`;
    }
    if (evidence.accessibility_scans?.length) {
      report += `**Accessibility Scans:** ${evidence.accessibility_scans.join(', ')}\n`;
    }
    if (evidence.pattern_specs?.length) {
      report += `**Pattern Specifications:** ${evidence.pattern_specs.join(', ')}\n`;
    }
    report += '\n';
  }
  
  report += `---\n`;
  report += `*Sacred Shifter Ethos Verification ensures every feature aligns with our deepest principles.*\n`;
  report += `*The field responds only to authentic resonance.*`;
  
  // Write report to file for GitHub Actions
  fs.writeFileSync('ethos-report.md', report);
  
  console.log(report);
}

if (require.main === module) {
  generateEthosReport();
}

module.exports = { generateEthosReport };