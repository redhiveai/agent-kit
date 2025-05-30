import { LidoSDK } from '@lidofinance/lido-ethereum-sdk'
import { parseEther } from 'ethers'
import { z } from 'zod'
import type { Action } from '../types/action'

export const lidoStake: Action = {
  name: 'LIDO_STAKE',
  similes: [
    'stake with lido',
    'lido stake',
    'stake eth with lido',
    'lido eth stake',
    'lido staking',
  ],
  description: 'Stake ETH with Lido to earn rewards',
  schema: z.object({
    amount: z.string().describe('The amount of ETH to stake'),
  }),
  examples: [
    [
      {
        input: {
          amount: '1.0', // Amount in ETH
        },
        output: {
          status: 'success',
          transactionHash:
            '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          message:
            'Transaction successful: 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        },
        explanation: 'Stake 1.0 ETH with Lido to earn rewards',
      },
    ],
  ],
  handler: async (agent, input) => {
    const lido = new LidoSDK({
      rpcUrls: [agent.config.rpcURL],
      chainId: agent.config.chainId,
    })
    const weiAmount = parseEther(input.amount)
    const preparedTx = await lido.stake.stakeEthPopulateTx({
      value: weiAmount,
      account: agent.wallet.address as `0x${string}`,
    })
    const tx = await agent.wallet.sendTransaction({
      to: preparedTx.to,
      data: preparedTx.data,
      value: preparedTx.value,
    })
    await tx.wait()
    return {
      status: 'success',
      transactionHash: tx.hash,
      message: `Transaction successful: ${tx.hash}`,
    }
  },
}

export const lidoUnstake: Action = {
  name: 'LIDO_UNSTAKE',
  similes: [
    'unstake with lido',
    'lido unstake',
    'unstake eth with lido',
    'lido eth unstake',
    'lido unstaking',
  ],
  description: 'Unstake ETH from Lido to withdraw rewards',
  schema: z.object({
    amount: z.string().describe('The amount of ETH to unstake'),
  }),
  examples: [
    [
      {
        input: {
          amount: '1.0', // Amount in ETH
        },
        output: {
          status: 'success',
          transactionHash:
            '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          message:
            'Transaction successful: 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        },
        explanation: 'Unstake 1.0 ETH from Lido to withdraw rewards',
      },
    ],
  ],
  handler: async (agent, input) => {
    const lido = new LidoSDK({
      rpcUrls: [agent.config.rpcURL],
      chainId: agent.config.chainId,
    })
    const weiAmount = parseEther(input.amount)
    const account = agent.wallet.address as `0x${string}`
    const withdrawals =
      await lido.withdraw.requestsInfo.getWithdrawalRequestsInfo({
        account,
      })
    const preparedTx = await lido.withdraw.request.requestWithdrawalPopulateTx({
      receiver: account,
      requests: withdrawals.claimableETH.requests.map((r) => r.id),
      account,
      token: 'stETH',
    })
    const tx = await agent.wallet.sendTransaction({
      to: preparedTx.to,
      data: preparedTx.data,
      value: preparedTx.value,
    })
    await tx.wait()
    return {
      status: 'success',
      transactionHash: tx.hash,
      message: `Transaction successful: ${tx.hash}`,
    }
  },
}

export const lidoStakedBalance: Action = {
  name: 'LIDO_STAKED_BALANCE',
  similes: [
    'lido staked balance',
    'get lido staked balance',
    'check lido staked balance',
    'lido balance',
    'get lido balance',
    'check lido balance',
  ],
  description: 'Get the staked balance of a given address on Lido',
  schema: z.object({
    address: z.string(),
  }),
  examples: [
    [
      {
        input: {
          address: '0x1234567890abcdef1234567890abcdef12345678',
        },
        output: {
          status: 'success',
          balance: '0.5',
          message: 'Lido staked balance: 0.5 ETH',
        },
        explanation: 'Get the staked balance of a given address on Lido',
      },
    ],
  ],
  handler: async (agent, input) => {
    const lido = new LidoSDK({
      rpcUrls: [agent.config.rpcURL],
      chainId: agent.config.chainId,
    })
    const balanceETH = await lido.shares.balance(
      agent.wallet.address as `0x${string}`
    )
    return {
      status: 'success',
      balance: balanceETH.toString(),
      message: `Lido staked balance: ${balanceETH.toString()} ETH`,
    }
  },
}
