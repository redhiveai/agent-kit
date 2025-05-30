import { parseEther } from 'ethers'
import { z } from 'zod'
import type { Action } from '../types/action'

export const transferNative: Action = {
  name: 'TRANSFER_NATIVE',
  similes: [
    'transfer native',
    'send native',
    'send eth',
    'send native token',
    'transfer eth',
    'transfer native token',
    'transfer native currency',
    'send native currency',
  ],
  description: 'Transfer native currency (ETH) from one address to another',
  schema: z.object({
    to: z.string().describe('The recipient address'),
    amount: z.string().describe('The amount of ETH to send'),
  }),
  examples: [
    [
      {
        input: {
          to: '0x1234567890abcdef1234567890abcdef12345678',
          amount: '0.1',
        },
        output: {
          status: 'success',
          transactionHash:
            '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          message:
            'Transaction successful: 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        },
        explanation: 'Transfer 0.1 ETH to the specified address',
      },
    ],
  ],
  handler: async (agent, input) => {
    const wai = parseEther(input.amount)
    try {
      const transaction = await agent.wallet.sendTransaction({
        to: input.to,
        value: wai,
      })
      const transactionHash = transaction.hash
      await transaction.wait()
      return {
        status: 'success',
        transactionHash,
        message: `Transaction successful: ${transactionHash}`,
      }
    } catch (error: any) {
      return {
        status: 'error',
        message: `Failed to transfer: ${error.message}`,
      }
    }
  },
}
