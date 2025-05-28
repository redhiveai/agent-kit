import { AgentKit } from '@redhive/agent-kit-core';
import { ethers } from "ethers";

const kit = new AgentKit(
    new ethers.Wallet("0x..."),
    {
        rpcURL: "https://rpc.ankr.com/eth",
        chainId: 1,
        quicknodeEndpoint: "https:/your-quicknode-endpoint",
    }
)
