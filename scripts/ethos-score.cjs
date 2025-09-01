#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function computeEthosScore() {
  console.log('🔱 Computing Sacred Ethos Score...\n');

  // Load ethos review file
  if (!fs.existsSync('ethos_review.json')) {
    console.error('❌ ethos_review.json not found');
    console.error('Create this file using the PR template');
    process.exit(1);
  }

  let ethosReview;
  try {
    const content = fs.readFileSync('ethos_review.json', 'utf8');
    ethosReview = JSON.parse(content);
  } catch (error) {
    console.error('❌ Invalid JSON in ethos_review.json:', error.message);
    process.exit(1);
  }

  // Validate critical gates
  const criticalGates = {
    truth_anchor: ethosReview.truth_anchor,
    sovereignty_privacy: ethosReview.sovereignty_privacy
  };

  let criticalPassed = true;
  Object.entries(criticalGates).forEach(([gate, status]) => {
    if (status !== 'PASS') {
      console.error(`❌ Critical Gate Failed: ${gate.replace('_', ' ').toUpperCase()}`);
      criticalPassed = false;
    }
  });

  if (!criticalPassed) {
    console.error('\n🚫 ETHOS VERIFICATION FAILED: Critical gates must PASS');
    process.exit(1);
  }

  // Calculate total score
  const scores = ethosReview.scores || {};
  const scoreValues = Object.values(scores);
  const totalScore = scoreValues.reduce((sum, score) => sum + score, 0);
  const maxScore = Object.keys(scores).length * 2;

  // Validate warns
  const warns = ethosReview.warns || [];
  const warnCount = warns.length;

  // Check scoring rules
  const minimumScore = 14;
  const maxWarns = 2;

  console.log('📊 Ethos Scoring Results:');
  console.log(`  Total Score: ${totalScore}/${maxScore}`);
  console.log(`  Minimum Required: ${minimumScore}`);
  console.log(`  Warnings: ${warnCount}/${maxWarns} allowed`);
  console.log('');

  // Individual scores
  console.log('🌀 Sacred Principles:');
  Object.entries(scores).forEach(([principle, score]) => {
    const status = score === 2 ? '✅ PASS' : score === 1 ? '⚠️  WARN' : '❌ FAIL';
    const name = principle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    console.log(`  ${name}: ${score}/2 ${status}`);
  });
  console.log('');

  // Validate owner sign-off for warnings
  if (warnCount > 0 && !ethosReview.owner_signoff) {
    console.error('❌ Owner sign-off required for warnings');
    console.error('Set "owner_signoff" to GitHub username of @EthosOwner');
    process.exit(1);
  }

  // Final validation
  let passed = true;

  if (totalScore < minimumScore) {
    console.error(`❌ Score below minimum: ${totalScore} < ${minimumScore}`);
    passed = false;
  }

  if (warnCount > maxWarns) {
    console.error(`❌ Too many warnings: ${warnCount} > ${maxWarns}`);
    passed = false;
  }

  if (passed) {
    console.log('✅ ETHOS VERIFICATION PASSED');
    console.log('🔱 Sacred Shifter principles upheld');
    
    if (warnCount > 0) {
      console.log(`⚠️  Warnings present - Owner signed off: ${ethosReview.owner_signoff}`);
    }
    
    process.exit(0);
  } else {
    console.log('❌ ETHOS VERIFICATION FAILED');
    console.log('Sacred principles require higher alignment');
    process.exit(1);
  }
}

if (require.main === module) {
  computeEthosScore();
}

module.exports = { computeEthosScore };