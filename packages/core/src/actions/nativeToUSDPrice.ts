import { z } from 'zod'
import type { Action } from '../types/action'

export const nativeToUSDPrice: Action = {
  name: 'NATIVE_TO_USD_PRICE',
  similes: [
    'native to usd price',
    'get native to usd price',
    'check native to usd price',
    'eth to usd price',
    'get eth to usd price',
    'check eth to usd price',
  ],
  schema: z.object({
    chainId: z.literal(1),
  }),
  description: 'Get the native to USD price of a given chain',
  examples: [
    [
      {
        input: {
          chainId: 1,
        },
        output: {
          status: 'success',
          price: 2000,
          message: 'Native to USD price: 2000',
        },
        explanation: 'Get the native to USD price of a given chain',
      },
    ],
  ],
  handler: async (agent, input) => {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    )
    const data = await response.json()
    return data.ethereum.usd
  },
}
