import { Action } from "../types/action";
import { z } from "zod";
import { Core } from "@quicknode/sdk";
import { formatEther } from "ethers";

export const walletBalance: Action = {
    name: "WALLET_BALANCE",
    similes: [
        "wallet balance",
        "get wallet balance",
        "check wallet balance",
        "balance",
        "get balance",
        "check balance",
    ],
    schema: z.object({
        address: z.string(),
    }),
    description: "Get the wallet balance of a given address",
    examples: [
        [
            {
                input: {
                    address: "0x1234567890abcdef1234567890abcdef12345678",
                },
                output: {
                    status: "success",
                    balance: "0.5",
                    message: "Wallet balance: 0.5 ETH",
                },
                explanation: "Get the wallet balance of a given address",
            },
        ],
    ],
    handler: async (agent, input) => {
        const quicknode = new Core({
            endpointUrl: agent.config.quicknodeEndpoint,
            config: { addOns: { nftTokenV2: true } },
        });

        const balance = await quicknode.client.getBalance({
            address: input.address,
        });
        return {
            status: "success",
            balance: formatEther(balance),
            message: `Wallet balance: ${formatEther(balance)} ETH`,
        }
    },
};