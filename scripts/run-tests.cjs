const { execSync } = require('child_process');
const path = require('path');

console.log('Running automated tests...');

try {
  const vitestPath = path.resolve(__dirname, '..', 'node_modules', 'vitest', 'vitest.mjs');
  // Execute the test command using the direct path to vitest
  execSync(`node ${vitestPath} --run`, { stdio: 'inherit' });
  console.log('All tests passed successfully.');
} catch (error) {
  console.error('Tests failed.');
  process.exit(1);
}
