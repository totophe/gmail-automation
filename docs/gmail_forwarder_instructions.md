# Gmail Automations - Invoice Forwarder

Automatically forward unread emails labeled "Invoices" to a configured email address and mark them as read.

## Project Overview

This project uses Google Apps Script with local development via clasp, Git version control, and VS Code devcontainer for a complete development environment. The development environment is built on Alpine Linux for a lightweight, secure, and efficient container.

**Requirements:**
- Forward emails labeled "Invoices" (or configured label) that are unread
- Send to: configurable target email address
- Mark emails as read after forwarding
- Run automatically every 30 minutes

**Technical Stack:**
- Alpine Linux container for minimal resource usage
- Node.js LTS for Google Apps Script development
- Clasp CLI for Apps Script deployment
- VS Code with remote development capabilities
- Environment-based configuration (.env files)

## Setup Instructions

### 1. Initial Project Setup

```bash
# Create project directory
mkdir gmail-automations
cd gmail-automations

# Initialize Git repository
git init

# Create project structure
mkdir -p .devcontainer src docs
```

### 2. Create Development Container

Create `.devcontainer/devcontainer.json`:

```json
{
  "name": "Gmail Automations Dev Environment (Alpine)",
  "image": "node:lts-alpine",
  "features": {
    "ghcr.io/devcontainers/features/git:1": {},
    "ghcr.io/devcontainers/features/common-utils:2": {
      "installZsh": false,
      "installOhMyZsh": false,
      "upgradePackages": true,
      "username": "automatic",
      "uid": "automatic",
      "gid": "automatic"
    }
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-vscode.vscode-typescript-next",
        "GitHub.copilot",
        "esbenp.prettier-vscode"
      ]
    }
  },
  "postCreateCommand": "sudo npm install -g @google/clasp && npm install",
  "remoteUser": "node"
}
```

**Alpine Linux Benefits:**
- Lightweight container image (~5MB base)
- Fast startup and reduced resource usage
- Security-focused minimal attack surface
- Package management via `apk` (Alpine Package Keeper)

### 3. Create Package.json

```json
{
  "name": "gmail-automations",
  "version": "1.0.0",
  "description": "Gmail automation scripts using Google Apps Script - includes invoice forwarding and more",
  "scripts": {
    "build-config": "node generate-config.js",
    "push": "npm run build-config && /usr/local/bin/clasp push",
    "deploy": "/usr/local/bin/clasp create-deployment",
    "pull": "/usr/local/bin/clasp pull",
    "logs": "/usr/local/bin/clasp tail-logs",
    "open": "/usr/local/bin/clasp open-script"
  },
  "devDependencies": {
    "@google/clasp": "^2.4.2",
    "@types/google-apps-script": "^1.0.76"
  }
}
```

### 4. Create .gitignore

```
node_modules/
.clasp.json
*.log
.DS_Store
dist/
.env
src/config.js
```

### 5. Configuration Setup

Create `.env.example`:
```
# Gmail Automations Configuration
# Copy this file to .env and update the values

# Invoice Forwarder Configuration
# Target email address to forward invoices to
TARGET_EMAIL=your-email@example.com

# Gmail label name to monitor for invoices
LABEL_NAME=Invoices
```

Copy and configure:
```bash
cp .env.example .env
# Edit .env with your actual configuration
```

### 6. Open in VS Code and Dev Container

```bash
# Open in VS Code
code .

# In VS Code Command Palette (Ctrl+Shift+P):
# "Dev Containers: Reopen in Container"
```

### 7. Google Apps Script Setup

Once in the Alpine dev container:

```bash
# Login to Google Apps Script
clasp login

# Create new Apps Script project
clasp create --type standalone --title "Gmail Automations"

# This creates .clasp.json and appsscript.json
```

**Note:** The Alpine container includes bash and curl for enhanced compatibility with clasp and other tools.

### 8. Code Structure

Create these files in the `src/` directory:

- `invoice-forwarder.js` - Main forwarding logic
- `config.js` - Generated configuration from .env
- `generate-config.js` - Configuration generator script (root level)

**Use GitHub Copilot to generate the code with these specifications:**

#### invoice-forwarder.js
- Function: `forwardInvoiceEmails()`
- Search for emails with configured label and unread status
- Forward to configured target email
- Mark as read after forwarding
- Add error handling and logging
- Use CONFIG object for configuration values

#### config.js (auto-generated)
- Configuration constants loaded from .env
- TARGET_EMAIL and LABEL_NAME variables

### 9. Google Apps Script Permissions

The script needs these permissions:
- Gmail read/write access
- Gmail send access
- Google Apps Script triggers

### 10. Deployment

```bash
# Generate config from .env
npm run build-config

# Push code to Google Apps Script
npm run push

# Deploy (creates a new version)
npm run deploy

# View logs
npm run logs

# Open in web editor
npm run open
```

### 11. Set up Automated Triggers

In Google Apps Script web editor:
1. Go to Triggers (clock icon)
2. Add new trigger:
   - Function: `forwardInvoiceEmails`
   - Event source: Time-driven
   - Type: Minutes timer
   - Interval: Every 30 minutes

### 12. Testing

1. **Manual test**: Run function once in Apps Script editor
2. **Create test email**: Send yourself an email and label it with your configured label
3. **Check logs**: Use `npm run logs` to see execution details
4. **Verify forwarding**: Check if email arrives at your configured target email

### 13. Gmail Label Setup

Ensure you have your configured label in Gmail:
1. Go to Gmail Settings > Labels
2. Create new label with the name from your .env file (default: "Invoices")
3. Apply to relevant emails

## Development Workflow

```bash
# Update configuration
# Edit .env file with new values

# Regenerate config
npm run build-config

# Make changes locally
# Edit files in src/

# Push changes to Google Apps Script
npm run push

# Deploy new version
npm run deploy

# Check logs for issues
npm run logs

# Commit changes to Git
git add .
git commit -m "Description of changes"
```

## Troubleshooting

**Common Issues:**

1. **Authentication**: If `clasp login` fails, try `clasp logout` first
2. **Permissions**: First run may require manual authorization in Apps Script editor
3. **Label not found**: Ensure your configured label exists in Gmail
4. **Rate limits**: Script handles Gmail API limits automatically
5. **Configuration**: Make sure .env file exists and is properly formatted

**Debugging:**
- Use `console.log()` for debugging
- Check Apps Script execution logs
- Test with small batches first
- Container logs available via VS Code Dev Container extension

**Alpine-specific notes:**
- Package manager: `apk` (not `apt` or `yum`)
- Common-utils feature provides bash and curl for compatibility
- Minimal base image may require additional packages for some workflows

## Security Notes

- `.clasp.json` contains sensitive info - already in .gitignore
- `.env` contains configuration - also in .gitignore
- Google Apps Script runs with your Gmail permissions
- Consider using a dedicated Google account for automation

## Monitoring

- Apps Script provides execution logs
- Set up email notifications for script failures
- Monitor forwarded emails to ensure they're arriving

## Future Enhancements

- Add email filtering based on sender/subject
- Implement retry logic for failed forwards
- Add metrics/reporting
- Support multiple forward destinations