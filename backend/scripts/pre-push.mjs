import { execSync } from 'child_process';
import fs from 'fs';

// Step 1: Generate the OpenAPI file
console.log('Generating OpenAPI documentation...');
execSync('npm run schema:generate', { stdio: 'inherit' });

