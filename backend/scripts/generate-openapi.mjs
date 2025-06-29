// Use ES module `import` syntax
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';
import { spawn } from 'child_process';

const OPENAPI_URL = 'http://127.0.0.1:8787/doc'; // Adjust URL if necessary

// Utility function to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Step 1: Start the application
const startApplication = () => {
  console.log('Starting application...');
  
  // Replace with the command that starts your application
  const serverProcess = spawn('npm', ['run', 'dev'], { stdio: 'inherit' });

  return serverProcess;
};

// Step 2: Fetch OpenAPI spec
const fetchOpenApiSpec = async () => {
  try {
    console.log('Waiting for the server to start...');
    await sleep(5000); // Wait for 5 seconds (adjust this as needed)

    console.log('Fetching OpenAPI spec...');
    const response = await fetch(OPENAPI_URL);
    const openApiSpec = await response.json();

    // Step 3: Write OpenAPI spec to file
    writeFileSync('../shared/openapi.json', JSON.stringify(openApiSpec, null, 2));
    console.log('OpenAPI spec saved to openapi.json');
  } catch (error) {
    console.error('Error fetching OpenAPI spec:', error);
  }
};

// Step 4: Stop the application
const stopApplication = (serverProcess) => {
  console.log('Stopping application...');
  serverProcess.kill(); // Send termination signal to stop the server
};

const generateOpenApi = async () => {
  const serverProcess = startApplication();
  await fetchOpenApiSpec();
  stopApplication(serverProcess);
};

generateOpenApi();