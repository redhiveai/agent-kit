import {
  AgentKit,
  defaultActions,
  startMcpServer,
  type Action,
} from '@redhive/agent-kit-core'
import { ethers } from 'ethers'
import { str, url, cleanEnv } from 'envalid'

export const envSpec = {
  PRIVATE_KEY: str({
    desc: 'The private key of the wallet to use for the agent',
  }),
  RPC_URL: url({
    desc: 'The RPC URL to connect to the Ethereum network',
  }),
  QUICKNODE_ENDPOINT: url({
    desc: 'The QuickNode endpoint for the Ethereum network',
  }),
}
export const env = cleanEnv(process.env, envSpec);

const kit = new AgentKit(new ethers.Wallet(env.PRIVATE_KEY), {
  rpcURL: env.RPC_URL,
  chainId: 1,
  quicknodeEndpoint: env.QUICKNODE_ENDPOINT,
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
