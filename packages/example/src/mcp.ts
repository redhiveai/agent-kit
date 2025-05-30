import {
  AgentKit,
  defaultActions,
  startMcpServer,
  type Action,
} from '@redhive/agent-kit-core'
import { ethers } from 'ethers'

const kit = new AgentKit(new ethers.Wallet('0x....'), {
  rpcURL: 'https://rpc.ankr.com/eth_sepolia',
  chainId: 11155111,
  quicknodeEndpoint: 'https://rpc.quicknode.com/eth_sepolia',
})

// Add your required actions here
const mcp_actions: Record<string, Action> = defaultActions

for (const action of kit.actions) {
  mcp_actions[action.name] = action
}

startMcpServer(mcp_actions, kit, { name: 'evm-agent', version: '0.0.1' })
  .then((server) => {
    console.log('Server is running on port 3000')
  })
  .catch((error) => {
    console.error('Error starting MCP server:', error)
  })
