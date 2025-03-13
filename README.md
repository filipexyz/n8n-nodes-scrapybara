# n8n-nodes-scrapybara

This is an n8n community node for interacting with the [Scrapybara](https://scrapybara.com) API. Scrapybara provides powerful remote desktop infrastructure for AI agents.

## Features

- **Start Instances**: Ubuntu, Browser, and Windows instances
- **Manage Instances**: Stop, pause, and resume instances
- **Remote Desktop Actions**: Take screenshots, get stream URLs, run bash commands, perform computer actions
- **Computer Control**: Execute mouse and keyboard actions programmatically

## Current Development Status

### Instance Management
- [x] List instances
- [x] Start instances (Ubuntu, Browser, Windows)
- [x] Stop instances
- [x] Pause instances
- [x] Resume instances
- [x] Screenshot functionality
- [x] Get stream URL
- [x] Run bash commands
- [x] Basic computer actions (mouse/keyboard)

### Code Execution
- [ ] Execute code without notebook

### Notebook Support
- [ ] Create, manage, and execute notebooks

### Browser Authentication
- [ ] Save and reuse browser authentication states

### File Management
- [ ] Upload/download files

### Environment Variables
- [ ] Manage environment variables

### Computer Control
- [x] Basic mouse/keyboard interactions
- [ ] Advanced mouse/keyboard interactions
- [ ] Enhanced UI interactions

## Prerequisites

- n8n v1.0+
- Scrapybara API key from [Scrapybara Dashboard](https://scrapybara.com/dashboard)

## Installation

### In n8n (Recommended)

1. Open your n8n instance
2. Go to **Settings > Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-scrapybara` and click **Install**

### Manual Installation

If you want to install this node manually:

```bash
# In your n8n installation directory
pnpm install n8n-nodes-scrapybara

# If you're using npm
npm install n8n-nodes-scrapybara
```

## Usage

1. Add your Scrapybara API credentials in n8n
2. Use the Scrapybara node in your workflows

### Example workflow: Start an Ubuntu instance and take a screenshot

1. Set up a **Scrapybara** node
2. Select **Instance** as the resource
3. Choose **Start** as the operation
4. Select **Ubuntu** as the instance type
5. Set timeout hours (optional)
6. Pass the instance ID to another Scrapybara node
7. Configure the second node to take a screenshot
8. The screenshot data will be returned in the response

## Resources

- [Scrapybara Documentation](https://scrapybara.com/docs)
- [n8n Documentation](https://docs.n8n.io/)

## License

[MIT](LICENSE.md) 