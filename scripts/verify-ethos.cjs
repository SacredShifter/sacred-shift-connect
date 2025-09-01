const { execSync } = require('child_process');

console.log('Running ethos verification...');

try {
  // Step 1: Generate the ethos review file
  console.log('Generating ethos_review.json...');
  execSync('node scripts/generate-ethos-review.cjs', { stdio: 'inherit' });

  // Step 2: Run the ethos scoring script
  console.log('Running ethos-score.cjs...');
  execSync('node scripts/ethos-score.cjs', { stdio: 'inherit' });

  console.log('Ethos verification passed successfully.');
} catch (error) {
  console.error('Ethos verification failed.');
  process.exit(1);
}
