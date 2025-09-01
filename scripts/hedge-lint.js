#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// Truth Anchor: No hedging language in Sacred Shifter copy
const FORBIDDEN_HEDGING_TOKENS = [
  'maybe', 'probably', 'we believe', 'we think', 'might be', 'could be',
  'seems like', 'appears to', 'supposedly', 'allegedly', 'perhaps',
  'i guess', 'sort of', 'kind of', 'more or less', 'roughly',
  'approximately', 'about', 'around', 'or so', 'give or take'
];

// Sacred language is precise and truthful
const SACRED_ALTERNATIVES = {
  'maybe': 'will', 'probably': 'will', 'we believe': 'we know',
  'we think': 'we know', 'might be': 'is', 'could be': 'is',
  'seems like': 'is', 'appears to': 'does', 'perhaps': 'will'
};

const PATHS_TO_CHECK = [
  'src/copy/**/*.{ts,tsx,md}',
  'src/components/**/*.{ts,tsx}', 
  'src/pages/**/*.{ts,tsx}',
  'src/modules/**/*.{ts,tsx}'
];

const EXCLUDED_PATHS = [
  'src/**/*.test.{ts,tsx}',
  'src/**/*.spec.{ts,tsx}',
  'src/**/*.d.ts'
];

function checkFileForHedging(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];

  lines.forEach((line, lineNumber) => {
    const lowerLine = line.toLowerCase();
    
    FORBIDDEN_HEDGING_TOKENS.forEach(token => {
      if (lowerLine.includes(token)) {
        const column = lowerLine.indexOf(token);
        const alternative = SACRED_ALTERNATIVES[token] || '[choose precise sacred language]';
        
        violations.push({
          file: filePath,
          line: lineNumber + 1,
          column: column + 1,
          token,
          context: line.trim(),
          suggestion: alternative
        });
      }
    });
  });

  return violations;
}

function main() {
  console.log('🔱 Sacred Shifter Truth Anchor Verification');
  console.log('Checking for hedging language that dilutes truth...\n');

  const allFiles = [];
  
  // Gather all files to check
  PATHS_TO_CHECK.forEach(pattern => {
    const files = globSync(pattern, { 
      ignore: EXCLUDED_PATHS,
      absolute: true 
    });
    allFiles.push(...files);
  });

  // Remove duplicates
  const uniqueFiles = [...new Set(allFiles)];
  
  let totalViolations = 0;
  const fileViolations = {};

  uniqueFiles.forEach(filePath => {
    const violations = checkFileForHedging(filePath);
    
    if (violations.length > 0) {
      fileViolations[filePath] = violations;
      totalViolations += violations.length;
    }
  });

  // Report results
  if (totalViolations === 0) {
    console.log('✅ Truth Anchor VERIFIED');
    console.log('No hedging language detected. Sacred truth flows clearly.\n');
    process.exit(0);
  }

  console.log(`❌ Truth Anchor VIOLATION: ${totalViolations} hedging tokens found\n`);
  
  Object.entries(fileViolations).forEach(([filePath, violations]) => {
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`📄 ${relativePath}:`);
    
    violations.forEach(violation => {
      console.log(`  Line ${violation.line}:${violation.column} - "${violation.token}"`);
      console.log(`    Context: ${violation.context}`);
      console.log(`    Sacred Alternative: "${violation.suggestion}"`);
      console.log('');
    });
  });

  console.log('🔱 Sacred Truth requires precision. Replace hedging with certainty.');
  console.log('The field responds to clarity, not uncertainty.\n');
  
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { checkFileForHedging, FORBIDDEN_HEDGING_TOKENS };