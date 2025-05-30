import { bridge } from './debridge'
import { resolveENS } from './ens'
import { lidoStake } from './lido'
import { nativeToUSDPrice } from './nativeToUSDPrice'
import { walletNFTs } from './nfts'
import { resolveToken } from './resolveToken'
import { swapTokens } from './swapTokens'
import { transferERC20 } from './transferERC20'
import { transferNative } from './transferNative'
import { walletBalance } from './walletBalance'
import { walletBalances } from './walletBalances'
import { walletERC20Balance } from './walletERC20Balance'
import { walletTransactions } from './walletTransactions'

export const defaultActions = {
  bridge,
  resolveENS,
  lidoStake,
  nativeToUSDPrice,
  walletNFTs,
  resolveToken,
  swapTokens,
  transferERC20,
  transferNative,
  walletBalance,
  walletBalances,
  walletERC20Balance,
  walletTransactions,
}
