import { z } from 'zod'
import type { Action } from '../types/action'
import { fetchTokensList, getResolvedTokenAddress } from '../utils'

export const resolveToken: Action = {
  name: 'RESOLVE_TOKEN',
  similes: [
    'resolve token',
    'get token address',
    'resolve token address',
    'resolve token symbol',
    'resolve token name',
  ],
  examples: [
    [
      {
        input: {
          token: 'USDC',
        },
        output: {
          status: 'success',
          tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9EB0CE3606EB48',
          message:
            'Resolved token address: 0xA0b86991c6218b36c1d19D4a2e9EB0CE3606EB48',
        },
        explanation: 'Resolve the token address for USDC symbol',
      },
    ],
  ],
  description: 'Resolve a token address to its symbol and name',
  schema: z.object({
    token: z.string().describe('The token symbol/name to resolve'),
  }),
  handler: async (agent, input) => {
    try {
      const tokens = await fetchTokensList(agent.config.chainId)
      let tokenAddress = getResolvedTokenAddress({
        token: input.token,
        chainId: agent.config.chainId,
        tokens,
      })
      return {
        status: 'success',
        tokenAddress,
        message: `Resolved token address: ${tokenAddress}`,
      }
    } catch (error: any) {
      return {
        status: 'error',
        message: `Failed to resolve token: ${error.message}`,
      }
    }
  },
}
