import { Core } from '@quicknode/sdk'
import { z } from 'zod'
import type { Action } from '../types/action'

export const walletBalances: Action = {
  name: 'WALLET_BALANCES',
  similes: [
    'wallet balances',
    'get wallet balances',
    'check wallet balances',
    'balances',
    'get balances',
    'check balances',
  ],
  schema: z.object({
    address: z.string(),
  }),
  description: 'Get the wallet balances of a given address',
  examples: [
    [
      {
        input: {
          address: '0x1234567890abcdef1234567890abcdef12345678',
        },
        output: {
          status: 'success',
          balances: [
            {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
              balance: '0.5',
            },
            {
              name: 'USDC',
              symbol: 'USDC',
              decimals: 6,
              balance: '1000',
            },
          ],
        },
        explanation: 'Get the wallet balances of a given address',
      },
    ],
  ],
  handler: async (agent, input) => {
    const quicknode = new Core({
      endpointUrl: agent.config.quicknodeEndpoint,
      config: { addOns: { nftTokenV2: true } },
    })
    const balances = await quicknode.client.qn_getWalletTokenBalance({
      wallet: input.address,
    })
    const formattedBalances = balances.result.map((balance) => ({
      name: balance.name,
      symbol: balance.symbol,
      decimals: balance.decimals,
      balance: balance.totalBalance,
    }))
    return {
      status: 'success',
      balances: formattedBalances,
      message: `Wallet balances: ${JSON.stringify(formattedBalances)}`,
    }
  },
}
