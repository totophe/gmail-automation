# Gmail Automation

A collection of Gmail automation scripts using Google Apps Script. Currently includes:

- **Invoice Forwarder**: Automatically forwards unread emails labeled "Invoices" to a specified email address and marks them as read

## Development Setup

### Prerequisites

- VS Code with Dev Containers extension
- Docker Desktop

### Getting Started

1. Open this project in VS Code
2. When prompted, click "Reopen in Container" or use Command Palette: `Dev Containers: Reopen in Container`
3. Wait for the container to build and dependencies to install
4. Copy `.env.example` to `.env` and update the configuration:
   ```bash
   cp .env.example .env
   # Edit .env with your target email and label name for invoice forwarding
   ```

### Development Workflow

```bash
# Generate config from .env (automatically run before push)
npm run build-config

# Push code changes to Google Apps Script (includes all automations)
npm run push

# Deploy new version
npm run deploy

# View execution logs
npm run logs

# Open in Google Apps Script web editor
npm run open
```

## Invoice Forwarder Usage

1. **Create the label** in Gmail (e.g., "Invoices")
2. **Test the setup** by running `testSetup()` function in Apps Script
3. **Set up automation** by running `setupTrigger()` function to enable automatic forwarding
4. **Configure** the target email and label name in `.env`

### Project Structure

- `src/` - Source code files
  - `invoice-forwarder.js` - Main Gmail invoice forwarding script
  - `config.js` - Generated configuration (from .env)
- `.devcontainer/` - Development container configuration
- `docs/` - Documentation
- `.env` - Configuration file (not committed to git)
- `.env.example` - Configuration template

## Features

### Invoice Forwarder
- Forwards emails with configured label to specified email address
- Marks processed emails as read
- Runs automatically every 30 minutes
- Configurable via .env file

### Planned Automations
- Receipt organizer
- Newsletter filters
- Meeting scheduler helpers

Built with Alpine Linux for lightweight development environment
