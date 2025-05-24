import { z } from "zod";
import { Action } from "../types/action";
import { Core } from "@quicknode/sdk";


export const walletERC20Balance: Action = {
    name: "WALLET_ERC20_BALANCE",
    similes: [
        "wallet erc20 balance",
        "get erc20 balance",
        "check erc20 balance",
        "erc20 balance",
        "get erc20 token balance",
        "token balance",
        "get token balance",
        "check token balance",
    ],
    schema: z.object({
        address: z.string().describe("The address to check the balance of"),
        token: z.string().describe("The token address or symbol to check the balance of"),
    }),
    description: "Get the ERC20 token balance of a given address",
    examples: [
        [
            {
                input: {
                    address: "0x1234567890abcdef1234567890abcdef12345678",
                    token: "0xA0b86991c6218b36c1d19D4a2e9EB0CE3606EB48", // USDC
                },
                output: {
                    status: "success",
                    balance: "1000.0",
                    message: "Wallet balance: 1000.0 USDC",
                },
                explanation: "Get the ERC20 token balance of a given address",
            },
        ],
    ],
    handler: async (agent, input) => {
        const quicknode = new Core({
            endpointUrl: agent.config.quicknodeEndpoint,
            config: { addOns: { nftTokenV2: true } },
        });
        const balances = await quicknode.client.qn_getWalletTokenBalance({
            wallet: input.address,
            contracts: [input.token],
        });
        if (balances[0]) {
            return {
                status: "success",
                balance: balances[0].totalBalance,
                message: `Wallet balance: ${balances[0].balance} ${balances[0].symbol}`,
            };
        }
        return {
            status: "error",
            message: `Failed to get balance for address: ${input.address} and token: ${input.token}`,
        };
    }

}
