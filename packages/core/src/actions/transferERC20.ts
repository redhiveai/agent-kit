import { Interface, parseEther } from 'ethers'
import { z } from 'zod'
import type { Action } from '../types/action'

export const transferERC20: Action = {
  name: 'TRANSFER_ERC20',
  similes: [
    'transfer erc20',
    'send erc20',
    'send token',
    'send erc20 token',
    'transfer token',
    'transfer erc20 token',
    'transfer token',
    'send token',
    'transfer token',
  ],
  description: 'Transfer ERC20 token from one address to another',
  schema: z.object({
    to: z.string().describe('The recipient address'),
    amount: z.string().describe('The amount of token to send'),
    token: z.string().describe('The token address'),
  }),
  examples: [
    [
      {
        input: {
          to: '0x1234567890abcdef1234567890abcdef12345678',
          amount: '100',
          token: '0xA0b86991c6218b36c1d19D4a2e9EB0CE3606EB48',
        },
        output: {
          status: 'success',
          transactionHash:
            '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          message:
            'Transaction successful: 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        },
        explanation: 'Transfer 100 USDC to the specified address',
      },
    ],
  ],
  handler: async (agent, input) => {
    const iface = new Interface([
      'function transfer(address _to, uint256 _value)',
    ])
    const rawAmount = parseEther(input.amount)
    const transferData = iface.encodeFunctionData('transfer', [
      input.to,
      rawAmount,
    ])
    const trx = await agent.wallet.sendTransaction({
      to: input.token,
      data: transferData,
      value: 0,
    })
    await trx.wait()
    return {
      status: 'success',
      transactionHash: trx.hash,
      message: `Transaction successful: ${trx.hash}`,
    }
  },
}
