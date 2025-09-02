const { exec } = require('child_process');

console.log('🚀 Running GAA Stability & Integration Tests...');

const testFiles = [
  'src/tests/gaa/FrequencyValidation.test.ts',
  'src/tests/gaa/GaaEngine.integration.test.ts'
];

const command = `npx vitest --run ${testFiles.join(' ')}`;

const vitestProcess = exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Integration Test Run Failed:`);
    console.error(stderr);
    process.exit(1);
  }

  console.log(stdout);
  console.log('✅ GAA Stability & Integration Tests Passed!');
});

vitestProcess.stdout.pipe(process.stdout);
vitestProcess.stderr.pipe(process.stderr);
