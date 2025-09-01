const { spawn, execSync } = require('child_process');
const http = require('http');

const PORT = 5173; // Default Vite port
const URL = `http://localhost:${PORT}`;

// Function to wait for the server to be ready
const waitForServer = (url, timeout = 30000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkServer = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          console.log('Server is ready.');
          resolve();
        } else {
          scheduleNextCheck();
        }
      }).on('error', (err) => {
        scheduleNextCheck();
      });
    };

    const scheduleNextCheck = () => {
      if (Date.now() - startTime > timeout) {
        reject(new Error('Server did not start within the timeout period.'));
        return;
      }
      setTimeout(checkServer, 1000);
    };

    checkServer();
  });
};


const runScans = async () => {
  let serverProcess;

  try {
    // Start the dev server in the background
    console.log('Starting dev server...');
    serverProcess = spawn('npm', ['run', 'dev']);

    serverProcess.stdout.on('data', (data) => {
        console.log(`server: ${data}`);
    });
    serverProcess.stderr.on('data', (data) => {
        console.error(`server_error: ${data}`);
    });

    // Wait for the server to be ready
    await waitForServer(URL);

    // Run Lighthouse scan
    console.log('\nRunning Lighthouse scan...');
    execSync(`npx lighthouse ${URL} --output=json --output-path=./lighthouse-report.json --view`, { stdio: 'inherit' });
    console.log('Lighthouse scan complete. Report saved to lighthouse-report.json');

    // Run axe scan
    console.log('\nRunning axe scan...');
    execSync(`npx axe ${URL}`, { stdio: 'inherit' });
    console.log('Axe scan complete.');

  } catch (error) {
    console.error('\nAn error occurred during the scans:', error);
    process.exit(1);
  } finally {
    // Shut down the server
    if (serverProcess) {
      console.log('\nShutting down dev server...');
      serverProcess.kill();
    }
  }
};

runScans();
