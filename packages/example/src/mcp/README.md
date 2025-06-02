<div align="center">

# Redhive Agent Kit MCP Server

</div>

A Redhive Agent Kit implementation using the Model Context Protocol (MCP) for handling protocol operations on the Solana blockchain.

## Features

- Supports all actions from the Redhive Agent Kit
- MCP server implementation for standardized interactions
- Environment-based configuration

## Prerequisites

- Node.js (v22 or higher recommended)
- pnpm or yarn or npm
- Ethereum wallet with private key
- Ethereum RPC URL

## Installation

```bash
pnpm install
```

## Configuration

1. Configure the `claude_desktop_config.json` file by editing the `env` fields.

```env
PRIVATE_KEY=private_key_here
RPC_URL=rpl_url_here
QUICKNODE_ENDPOINT=quicknode_url_here
```

2. Change the Claude Desktop MCP server settings:

For MacOS:
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

For Windows:
```bash
code $env:AppData\Claude\claude_desktop_config.json
```

The final configuration should look like the following (replace the path with your absolute project path):

```json
{
    "mcpServers": {
        "agent-kit": {
            "command": "node",
            "env": {
                "RPC_URL": "rpl_url_here",
                "PRIVATE_KEY": "private_key_here",
                "QUICKNODE_ENDPOINT": "quicknode_url_here"
            },
            "args": [
                "/ABSOLUTE/PATH/TO/YOUR/PROJECT"
            ]
        }
    }
}
```

Note: Make sure to restart Claude Desktop after updating the configuration and building the project.

## Building the Project

To build the project, run:

```bash
pnpm run build
```

This will compile the TypeScript code and set the appropriate permissions for the executable.

## Project Structure

- `src/index.ts` - Main entry point implementing the MCP server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.