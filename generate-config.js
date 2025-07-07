#!/usr/bin/env node

/**
 * Generate config.js from .env file
 * This script reads environment variables and creates a config file for Google Apps Script
 */

const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please create one based on .env.example');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse .env file
envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Validate required variables
const requiredVars = ['TARGET_EMAIL', 'LABEL_NAME'];
const missingVars = requiredVars.filter(varName => !envVars[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Generate config.js content
const configContent = `/**
 * Configuration for Gmail Invoice Forwarder
 * This file is auto-generated from .env - do not edit manually
 * Run 'npm run build-config' to regenerate
 */

const CONFIG = {
  TARGET_EMAIL: '${envVars.TARGET_EMAIL}',
  LABEL_NAME: '${envVars.LABEL_NAME}'
};

// Export for testing (Apps Script doesn't use module exports)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
`;

// Write config.js to src directory
const configPath = path.join(__dirname, 'src', 'config.js');
fs.writeFileSync(configPath, configContent);

console.log('✅ Generated src/config.js from .env');
console.log(`📧 Target Email: ${envVars.TARGET_EMAIL}`);
console.log(`🏷️  Label Name: ${envVars.LABEL_NAME}`);
