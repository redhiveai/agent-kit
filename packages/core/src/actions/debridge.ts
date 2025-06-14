import axios from 'axios'
import { Decimal } from 'decimal.js'
import { z } from 'zod'
import type { Action } from '../types/action'

export type DeBridgeResponse = {
  estimation: {
    srcChainTokenIn: {
      address: string
      chainId: number
      decimals: number
      name: string
      symbol: string
      amount: string
      approximateOperatingExpense: string
      mutatedWithOperatingExpense: boolean
      approximateUsdValue: number
      originApproximateUsdValue: number
    }
    srcChainTokenOut: {
      address: string
      chainId: number
      decimals: number
      name: string
      symbol: string
      amount: string
      maxRefundAmount: string
      approximateUsdValue: number
    }
    dstChainTokenOut: {
      name: string
      symbol: string
      chainId: number
      address: string
      decimals: number
      amount: string
      recommendedAmount: string
      maxTheoreticalAmount: string
      approximateUsdValue: number
      recommendedApproximateUsdValue: number
      maxTheoreticalApproximateUsdValue: number
    }
    costsDetails: Array<{
      chain: string
      tokenIn: string
      tokenOut: string
      amountIn: string
      amountOut: string
      type: string
      payload?: {
        feeAmount?: string
        feeBps?: string
        estimatedVolatilityBps?: string
        amountOutBeforeCorrection?: string
        feeApproximateUsdValue?: string
      }
    }>
    recommendedSlippage: number
  }
  tx: {
    value: string
    data: string
    to: string
  }
  prependedOperatingExpenseCost: string
  order: {
    approximateFulfillmentDelay: number
    salt: number
    metadata: string
  }
  orderId: string
  fixFee: string
  userPoints: number
  integratorPoints: number
}

type Token = {
  symbol: string
  name: string
  decimals: number
  address: string
  logoURI: string
  tags: { Name: string }[] | []
  eip2612: boolean
  domainVersion?: string
}

export type TokenList = {
  tokens: Record<string, Token>
}

export function getDebridgeChainList() {
  return [
    { name: 'Arbitrum', chainId: 42161 },
    { name: 'Avalanche', chainId: 43114 },
    { name: 'BNB Chain', chainId: 56 },
    { name: 'Ethereum', chainId: 1 },
    { name: 'Polygon', chainId: 137 },
    { name: 'Fantom', chainId: 250 },
    { name: 'Solana', chainId: 7565164 },
    { name: 'Linea', chainId: 59144 },
    { name: 'Optimism', chainId: 10 },
    { name: 'Base', chainId: 8453 },
    { name: 'Neon', chainId: 245022934 },
    { name: 'Gnosis', chainId: 100 },
    { name: 'Lightlink (suspended)', chainId: 1890 },
    { name: 'Metis', chainId: 1088 },
    { name: 'Bitrock', chainId: 7171 },
    { name: 'Sonic', chainId: 146 },
    { name: 'CrossFi', chainId: 4158 },
    { name: 'Cronos zkEVM', chainId: 388 },
    { name: 'Abstract', chainId: 2741 },
    { name: 'Berachain', chainId: 80094 },
    { name: 'Story', chainId: 1514 },
  ]
}

export async function bridgeEvm({
  srcChainId,
  userAddress,
  srcChainTokenIn,
  srcChainTokenInAmount,
  dstChainId,
  dstChainTokenOut,
  receiverAddress,
}: {
  srcChainId: string
  userAddress: string
  receiverAddress: string
  srcChainTokenIn: string
  srcChainTokenInAmount: string
  dstChainId: string
  dstChainTokenOut: string
}) {
  const res = await axios.get(
    `https://deswap.debridge.finance/v1.0/dln/order/create-tx`,
    {
      params: {
        srcChainId: srcChainId,
        srcChainTokenIn: srcChainTokenIn,
        srcChainTokenInAmount: srcChainTokenInAmount,
        dstChainTokenOutAmount: 'auto',
        dstChainId: dstChainId,
        dstChainTokenOut: dstChainTokenOut,
        prependOperatingExpenses: true,
        additionalTakerRewardBps: 0,
        dstChainTokenOutRecipient: receiverAddress,
        senderAddress: userAddress,
        srcChainRefundAddress: userAddress,
        enableEstimate: false,
        deBridgeApp: 'DESWAP',
        srcChainOrderAuthorityAddress: userAddress,
        dstChainOrderAuthorityAddress: receiverAddress,
      },
    }
  )

  const bridgeData = res.data as DeBridgeResponse
  const to = bridgeData.tx.to
  const data = bridgeData.tx.data
  const value = bridgeData.tx.value
    ? (new Decimal(bridgeData.tx.value).toHex() as `0x${string}`)
    : undefined
  return { to, data, value, orderId: bridgeData.orderId }
}

export const bridge: Action = {
  name: 'BRIDGE',
  similes: [
    'bridge',
    'bridge token',
    'bridge tokens',
    'bridge eth',
    'bridge crypto',
    'bridge assets',
  ],
  schema: z.object({
    receiverAddress: z
      .string()
      .describe(
        'Address of the bridge receiver. Specifically ask this address if not provided'
      ),
    wallet: z.string().describe('Wallet address'),
    srcChainTokenInAddress: z
      .string()
      .describe(
        'Address of the token to bridge from. it is one of them from search_debridge_token_list. If eth, use 0x0000000000000000000000000000000000000000'
      ),
    srcChainTokenInAmount: z
      .string()
      .describe(
        'Amount of the token to bridge from. If eth, convert to wei. If token, use the amount in the token'
      ),
    dstChainId: z
      .string()
      .describe(
        'Id of the destination chain. use get_debridge_chain_list to get the id'
      ),
    dstChainTokenOutAddress: z
      .string()
      .describe(
        'Address of the token to bridge to. it is one of them from search_debridge_token_list'
      ),
  }),
  description: 'Bridge ETH or tokens from one chain to another.',
  examples: [
    [
      {
        input: {
          receiverAddress: '0x1234567890abcdef1234567890abcdef12345678',
          wallet: '0x1234567890abcdef1234567890abcdef12345678',
          srcChainTokenInAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          srcChainTokenInAmount: '1000000000000000000',
          dstChainId: '1',
          dstChainTokenOutAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        },
        output: {
          status: 'success',
          transactionHash:
            '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          orderId: '1234567890abcdef1234567890abcdef12345678',
        },
        explanation: 'Bridge 1 ETH from Ethereum to Binance Smart Chain',
      },
    ],
  ],
  handler: async (agent, input) => {
    const bridgeData = await bridgeEvm({
      srcChainId: agent.config.chainId.toString(),
      userAddress: agent.wallet.address,
      receiverAddress: input.receiverAddress,
      srcChainTokenIn: input.srcChainTokenInAddress,
      srcChainTokenInAmount: input.srcChainTokenInAmount,
      dstChainId: input.dstChainId,
      dstChainTokenOut: input.dstChainTokenOutAddress,
    })
    const transaction = await agent.wallet.sendTransaction({
      to: bridgeData.to,
      data: bridgeData.data,
      value: bridgeData.value,
    })
    const transactionHash = transaction.hash
    await transaction.wait()
    return {
      status: 'success',
      transactionHash,
      orderId: bridgeData.orderId,
      message: `Transaction successful: ${transactionHash}`,
    }
  },
}
