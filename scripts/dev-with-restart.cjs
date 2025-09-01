const { spawn } = require('child_process');
const path = require('path');

const VITE_COMMAND = path.resolve(__dirname, '..', 'node_modules', '.bin', 'vite');
const VITE_ARGS = ['--host', '127.0.0.1'];

let viteProcess;

function startVite() {
  console.log('Starting Vite dev server...');
  viteProcess = spawn(VITE_COMMAND, VITE_ARGS, {
    stdio: 'inherit',
    shell: false, // Set to false when using direct path
  });

  viteProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Vite process exited with code ${code}. Restarting in 5 seconds...`);
      setTimeout(startVite, 5000);
    }
  });

  viteProcess.on('error', (err) => {
    console.error('Failed to start Vite process:', err);
  });
}

startVite();

process.on('SIGINT', () => {
  console.log('Shutting down Vite dev server...');
  if (viteProcess) {
    viteProcess.kill('SIGINT');
  }
  process.exit(0);
});
