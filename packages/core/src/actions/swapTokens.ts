import { z } from "zod";
import { Action } from "../types/action";
import { Decimal } from "decimal.js";
import { parseEther, Interface } from "ethers";

export const swapTokens: Action = {
    name: "SWAP_TOKENS",
    similes: [
        "swap tokens",
        "exchange tokens",
        "trade tokens",
        "convert tokens",
    ],
    description: "Swap one token for another using a decentralized exchange",
    schema: z.object({
        fromToken: z.string().describe("The token to swap from"),
        toToken: z.string().describe("The token to swap to"),
        amount: z.string().describe("The amount of tokens to swap"),
    }),
    examples: [
        [
            {
                input: {
                    fromToken: "0xA0b86991c6218b36c1d19D4a2e9EB0CE3606EB48", // USDC
                    toToken: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
                    amount: "1000", // Amount in USDC
                },
                output: {
                    status: "success",
                    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                    message: "Transaction successful: 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                },
                explanation: "Swap 1000 USDC for DAI using a decentralized exchange",
            },
        ],
    ],
    handler: async (agent, input) => {
        try {
            const swapData = await getSwapTxWithWowmax({
                slippage: 0.5,
                from: input.fromToken,
                to: input.toToken,
                amount: input.amount,
                trader: agent.wallet.address,
            })
            const weiAmount = parseEther(input.amount);

            const iface = new Interface([
                "function approve(address _spender, uint256 _value)",
            ]);
            const approveData = iface.encodeFunctionData("approve", [
                swapData.contract,
                weiAmount,
            ]);
            const approveTrx = await agent.wallet.sendTransaction({
                to: input.fromToken,
                data: approveData,
                value: 0,
            })
            await approveTrx.wait();

            const swapTrx = await agent.wallet.sendTransaction({
                to: swapData.contract,
                data: swapData.data,
                value: swapData.value,
            });
            const transactionHash = swapTrx.hash;
            await swapTrx.wait();
            return {
                status: "success",
                transactionHash,
                message: `Transaction successful: ${transactionHash}`,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: `Failed to swap tokens: ${error.message}`,
            };
        }
    },
}

export type WowmaxSwapResponse = {
    requestId: string;
    amountIn: string;
    amountOut: Array<string>;
    from: string;
    to: Array<string>;
    price: any;
    priceImpact: number;
    data: string;
    gasUnitsConsumed: number;
    gasPrice: string;
    contract: string;
    value: string;
    l1Fee: string;
};

export async function getSwapTxWithWowmax({
    from,
    to,
    amount,
    slippage = 1,
    trader,
}: {
    from: string;
    to: string;
    amount: string;
    trader: string;
    slippage?: number;
}) {
    const response = await fetch(
        `https://api-gateway.wowmax.exchange/chains/1/swap?from=${from}&to=${to}&amount=${amount}&slippage=${slippage}&usePMM=false&trader=${trader}`
    );
    const swapData = (await response.json()) as WowmaxSwapResponse;
    const value = swapData.value
        ? (new Decimal(swapData.value).toHex() as `0x${string}`)
        : undefined;
    return {
        value: value,
        data: swapData.data,
        to: swapData.to[0],
        contract: swapData.contract,
        from: swapData.from,
        amountOut: swapData.amountOut[0],
    };
}