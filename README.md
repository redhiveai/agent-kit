# 🔴 Redhive Agentic Kit

![Cover](https://github.com/redhiveai/agent-kit/blob/8714ff39bd1957726dd940ac705e8e8ac1010c40/public/redhive.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/redhive/agent-kit.svg)](https://github.com/redhive/agent-kit/stargazers)




## ✨ Features

### 🔗 Blockchain Operations
- **Token Operations**: Send ETH, ERC20s, and NFTs
- **DeFi Integration**: Trade, stake, lend, and bridge assets
- **Cross-chain**: Bridge tokens across multiple chains
- **ENS Support**: Domains actions

### 🤖 AI Integration
- **Framework Agnostic**: Works with any AI model or framework
- **LangChain Ready**: Built-in tools and React framework support
- **Vercel AI SDK**: Seamless integration with Vercel's AI toolkit
- **Real-time**: Streaming responses and memory management

## 🚀 Quick Start

### Installation

```bash
npm install @redhive/agent-kit
# or
yarn add @redhive/agent-kit
# or
pnpm add @redhive/agent-kit
```

### Basic Usage

```javascript
import { AgentKit } from '@redhive/agent-kit';

const kit = new AgentKit(
    new ethers.Wallet("0x..."),
    {
        rpcURL: "https://rpc.ankr.com/eth",
        chainId: 1,
        quicknodeEndpoint: "https:/your-quicknode-endpoint",
    }
)

// Send ETH
await kit.methods.transferNative({
  to: '0x...',
  amount: '0.1'
});

// Trade token
await kit.methods.swapTokens({
  fromToken: '0xA0b86991c6218b36c1d19D4a2e9EB0CE3606EB48',
  toToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  amount: '100'
});
```

## 📋 Supported Operations

### Token Operations
- ✅ Send ETH
- ✅ Send ERC20 tokens
- ✅ Swap Tokens
- ✅ Bridge Tokens

### DeFi Integrations
- ✅ **WOWMAX**: Token trading
- ✅ **Lido**: Liquid staking
- ✅ **DeBridge**: Cross-chain bridging

### Utilities
- ✅ ENS resolution
- ✅ Asset price feeds
- ✅ Pool tracking information
- ✅ Transaction monitoring

## 🛠️ AI Framework Integration

### LangChain

```typescript
const tools = createLangchainTools(kit, kit.actions)
```

### Vercel AI SDK

```typescript
const tools = createVerceTools(kit, kit.actions)
```

## 📚 Documentation

## 🔧 Configuration

### Environment Variables

```bash
# Required
PRIVATE_KEY=your_ethereum_private_key
RPC_URL=your_ethereum_rpc_url
QUICKNODE_URL=your_quicknode_url
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/yourusername/redhive-agentic-kit.git
cd redhive-agentic-kit
npm install
npm run dev
```

## 🛡️ Security

- **Private Key Management**: Never commit private keys to version control
- **RPC Security**: Use secure RPC endpoints
- **Transaction Limits**: Implement appropriate spending limits
- **Audit**: Regular security audits of smart contract interactions

For security concerns, please email security@redhive.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Built with ❤️ by the Redhive team
- Powered by Ethereum and leading DeFi protocols
- Special thanks to the open-source community

## 📞 Support

- 📧 Email: support@redhive.com
- 💬 Discord: [Join our community](https://discord.gg/redhive)
- 🐛 Issues: [GitHub Issues](https://github.com/redhive/agent-kit/issues)
- 📖 Docs: [Documentation Site](https://docs.redhive.com)

---

<div align="center">
  <strong>Made with ❤️ for the AI x Web3 community</strong>
</div>