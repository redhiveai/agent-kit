import { Core } from '@quicknode/sdk'
import { z } from 'zod'
import type { Action } from '../types/action'

export const walletTransactions: Action = {
  name: 'WALLET_TRANSACTIONS',
  similes: [
    'wallet transactions',
    'get wallet transactions',
    'check wallet transactions',
    'transactions',
    'get transactions',
    'check transactions',
  ],
  schema: z.object({
    address: z.string(),
  }),
  description: 'Get the wallet transactions of a given address',
  examples: [
    [
      {
        input: {
          address: '0x1234567890abcdef1234567890abcdef12345678',
        },
        output: {
          status: 'success',
          transactions: [
            {
              blockTimestamp: '2025-04-27T15:14:59.000Z',
              transactionHash:
                '0x3e544fb335f8d485a3675191b76522ad50da1b5999cb92c2380e6c2cf0f973e7',
              blockNumber: '22361223',
              transactionIndex: 26,
              fromAddress: '0xf89d7b9c864f589bbf53a82105107622b35eaa40',
              toAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
              contractAddress: null,
              value: '9514230000000000',
              status: 'success',
            },
          ],
        },
        explanation: 'Get the wallet transactions of a given address',
      },
    ],
  ],
  handler: async (agent, input) => {
    const quicknode = new Core({
      endpointUrl: agent.config.quicknodeEndpoint,
      config: { addOns: { nftTokenV2: true } },
    })
    const transactions = await quicknode.client.qn_getTransactionsByAddress({
      address: input.address,
      perPage: 1000,
    })

    return {
      status: 'success',
      transactions: transactions.paginatedItems,
    }
  },
}
